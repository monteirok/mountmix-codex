import {
  defaultPhoneCountryCode,
  formatPhoneForDisplay,
  formatPhoneNumber,
  getPhoneValidationError,
  isSupportedPhoneCountryCode,
  phoneContainsOnlyAllowedCharacters,
} from "../../lib/phone";

type BookingPayload = {
  name?: unknown;
  email?: unknown;
  phoneCountryCode?: unknown;
  phone?: unknown;
  eventType?: unknown;
  eventDate?: unknown;
  guestCount?: unknown;
  venue?: unknown;
  serviceStyle?: unknown;
  budget?: unknown;
  details?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

type BookingInquiry = {
  name: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  phoneFull: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  venue: string;
  serviceStyle: string;
  budget: string;
  details: string;
};

type ValidationResult =
  | { ok: true; inquiry: BookingInquiry }
  | { ok: false; errors: Partial<Record<keyof BookingInquiry, string>> };

const resendApiUrl = "https://api.resend.com/emails";
const defaultRecipient = "mountainmixologyca@gmail.com";
const bookingEmailLogoUrl =
  "https://lrysnhjxuoldyouylvua.supabase.co/storage/v1/object/sign/assets/logos/mm-transparent-light.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85NGNkNmUzMy0wYWYzLTQ5OGMtYTc0MC03NjdiMzZiOTllNDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbG9nb3MvbW0tdHJhbnNwYXJlbnQtbGlnaHQucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDI2MDQwNSwiZXhwIjoxOTQxOTQwNDA1fQ.ta9anI7lR-jr--dnQSFGUhtw1j8e_QHnna75uWxQy-w";
const maxRequestBytes = 12_000;
const minCompletionMs = 3_000;
const rateLimitWindowMs = 10 * 60 * 1_000;
const maxRequestsPerWindow = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const emailIcons = {
  announcement: "&#128197;",
  name: "&#9675;",
  email: "&#9993;",
  phone: "&#9742;",
  date: "&#9633;",
  event: "&#9826;",
  guests: "&#9673;",
  location: "&#9678;",
  mountain: "&#9651;",
  service: "&#9671;",
  budget: "&#9716;",
  details: "&#9998;",
};

function getClientKey(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const key = getClientKey(request);
  const current = rateLimitStore.get(key);

  for (const [storedKey, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) rateLimitStore.delete(storedKey);
  }

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  current.count += 1;
  return current.count > maxRequestsPerWindow;
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function sanitizeInline(value: unknown, maxLength: number) {
  return asString(value)
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeMessage(value: unknown, maxLength: number) {
  return asString(value)
    .replace(/[<>]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isLikelySpam(inquiry: BookingInquiry) {
  const combined = `${inquiry.name} ${inquiry.email} ${inquiry.venue} ${inquiry.details}`.toLowerCase();
  const urlMatches = combined.match(/https?:\/\/|www\.|\.ru\b|\.cn\b|\.xyz\b|\.top\b/g) ?? [];
  const spamTerms = [
    "casino",
    "crypto",
    "loan",
    "seo backlinks",
    "telegram",
    "viagra",
    "whatsapp marketing",
  ];

  return (
    urlMatches.length > 2 ||
    spamTerms.some((term) => combined.includes(term)) ||
    /(.)\1{12,}/.test(combined)
  );
}

function validate(payload: BookingPayload): ValidationResult {
  const rawPhoneCountryCode = sanitizeInline(payload.phoneCountryCode, 8);
  const phoneCountryCode = isSupportedPhoneCountryCode(rawPhoneCountryCode)
    ? rawPhoneCountryCode
    : defaultPhoneCountryCode;
  const rawPhone = sanitizeInline(payload.phone, 32);
  const phone = formatPhoneNumber(rawPhone, phoneCountryCode);
  const inquiry: BookingInquiry = {
    name: sanitizeInline(payload.name, 80),
    email: sanitizeInline(payload.email, 120).toLowerCase(),
    phoneCountryCode,
    phone,
    phoneFull: formatPhoneForDisplay(phone, phoneCountryCode),
    eventType: sanitizeInline(payload.eventType, 40),
    eventDate: sanitizeInline(payload.eventDate, 20),
    guestCount: sanitizeInline(payload.guestCount, 5),
    venue: sanitizeInline(payload.venue, 120),
    serviceStyle: sanitizeInline(payload.serviceStyle, 80),
    budget: sanitizeInline(payload.budget, 60),
    details: sanitizeMessage(payload.details, 900),
  };
  const errors: Partial<Record<keyof BookingInquiry, string>> = {};
  const guestCount = Number.parseInt(inquiry.guestCount, 10);
  const startedAt = Number.parseInt(sanitizeInline(payload.startedAt, 16), 10);
  const elapsedMs = Date.now() - startedAt;

  if (sanitizeInline(payload.website, 120)) {
    errors.details = "Unable to accept this submission.";
  }

  if (!Number.isFinite(startedAt) || elapsedMs < minCompletionMs || elapsedMs > 24 * 60 * 60 * 1_000) {
    errors.details = "Please review the form and try again.";
  }

  if (inquiry.name.length < 2) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    errors.email = "Enter a valid email.";
  }
  if (rawPhoneCountryCode && !isSupportedPhoneCountryCode(rawPhoneCountryCode)) {
    errors.phone = "Choose a valid country code.";
  } else if (rawPhone && !phoneContainsOnlyAllowedCharacters(rawPhone)) {
    errors.phone = "Use only numbers and standard phone punctuation.";
  } else {
    const phoneError = getPhoneValidationError(inquiry.phone, inquiry.phoneCountryCode);
    if (phoneError) errors.phone = phoneError;
  }
  if (!inquiry.eventType) errors.eventType = "Choose an event type.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(inquiry.eventDate)) {
    errors.eventDate = "Choose a target date.";
  }
  if (!Number.isFinite(guestCount) || guestCount < 1 || guestCount > 2000) {
    errors.guestCount = "Enter 1 to 2000 guests.";
  }
  if (inquiry.venue.length < 2) errors.venue = "Enter a venue or location.";
  if (!inquiry.serviceStyle) errors.serviceStyle = "Choose a service style.";
  if (!inquiry.budget) errors.budget = "Choose a planning range.";
  if (inquiry.details.length < 20) errors.details = "Add a few details about the event.";
  if (isLikelySpam(inquiry)) errors.details = "Please remove links or promotional content.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, inquiry };
}

function formatText(inquiry: BookingInquiry) {
  return [
    "Mountain Mixology booking inquiry",
    "================================",
    "",
    "CONTACT",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phoneFull || "Not provided"}`,
    "",
    "EVENT",
    `Type: ${inquiry.eventType}`,
    `Date: ${inquiry.eventDate}`,
    `Guest count: ${inquiry.guestCount}`,
    `Venue/location: ${inquiry.venue}`,
    "",
    "SERVICE REQUEST",
    `Service style: ${inquiry.serviceStyle}`,
    `Planning range: ${inquiry.budget}`,
    "",
    "NOTES",
    inquiry.details,
    "",
    "--",
    "Submitted from the Mountain Mixology website booking form.",
  ].join("\n");
}

function iconBadge(iconHtml: string, size = 50) {
  return `
    <div aria-hidden="true" style="display: inline-block; width: ${size}px; height: ${size}px; border-radius: 50%; background: #15211b; border: 1px solid #26362d; color: #d7a956; font-family: Georgia, 'Times New Roman', serif; font-size: ${Math.round(size * 0.44)}px; font-weight: 400; line-height: ${size}px; text-align: center; mso-line-height-rule: exactly; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);">
      ${iconHtml}
    </div>`;
}

function mountainLineMark(width = 94, height = 28) {
  return `
    <div aria-hidden="true" style="width: ${width}px; height: ${height}px; margin: 0 auto; color: #d7a956; font-family: Georgia, 'Times New Roman', serif; font-size: ${Math.max(18, Math.round(height * 0.78))}px; line-height: ${height}px; text-align: center; letter-spacing: 0.08em;">
      &#9651;&#9585;&#9651;
    </div>`;
}

function fieldCard(label: string, value: string, iconHtml: string) {
  return `
    <td width="50%" valign="top" style="padding: 6px;">
      <table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #ece7de; background: #fffefb;">
        <tr>
          <td width="72" valign="top" style="padding: 15px 0 15px 16px;">
            ${iconBadge(iconHtml)}
          </td>
          <td valign="top" style="padding: 16px 18px 15px 8px;">
            <p style="margin: 0 0 8px; color: #161a18; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; line-height: 1.25; font-weight: 700;">${escapeHtml(label)}</p>
            <p style="margin: 0; color: #151922; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.45;">${escapeHtml(value || "Not provided")}</p>
          </td>
        </tr>
      </table>
    </td>`;
}

function fullWidthCard(label: string, value: string, iconHtml: string, preserveLines = false) {
  return `
    <tr>
      <td colspan="2" style="padding: 6px;">
        <table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #ece7de; background: #fffefb;">
          <tr>
            <td width="72" valign="top" style="padding: 15px 0 15px 16px;">
              ${iconBadge(iconHtml)}
            </td>
            <td valign="top" style="padding: 16px 18px 15px 8px;">
              <p style="margin: 0 0 8px; color: #161a18; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; line-height: 1.25; font-weight: 700;">${escapeHtml(label)}</p>
              <p style="margin: 0; color: #151922; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.55;${preserveLines ? " white-space: pre-line;" : ""}">${escapeHtml(value || "Not provided")}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function formatHtml(inquiry: BookingInquiry, logoUrl: string) {
  return `
    <div style="margin: 0; padding: 0; background: #f7f5f0; font-family: Arial, Helvetica, sans-serif; color: #16201b;">
      <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">New Mountain Mixology booking inquiry from ${escapeHtml(inquiry.name)}.</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background: #f7f5f0;">
        <tr>
          <td align="center" style="padding: 30px 14px;">
            <table role="presentation" width="780" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 780px; border-collapse: separate; border-spacing: 0; overflow: hidden; border-radius: 7px; background: #fffefb; border: 1px solid #ded6c8; box-shadow: 0 18px 54px rgba(18, 28, 23, 0.14);">
              <tr>
                <td align="center" style="padding: 34px 26px 28px; background: #14211b; background-image: radial-gradient(circle at 16% 2%, rgba(215, 169, 86, 0.13) 0, rgba(215, 169, 86, 0) 38%), radial-gradient(circle at 84% 8%, rgba(255, 255, 255, 0.07) 0, rgba(255, 255, 255, 0) 34%), linear-gradient(135deg, #17251f 0%, #101a16 100%); border-bottom: 2px solid #d7a956;">
                  <img src="${escapeHtml(logoUrl)}" width="450" alt="Mountain Mixology" style="display: block; width: 450px; max-width: 92%; height: auto; margin: 8px auto 0;" />
                  <p style="margin: 14px 0 0; color: #d7a956; font-family: Georgia, 'Times New Roman', serif; font-size: 13px; line-height: 1.35; letter-spacing: 0.24em; text-transform: uppercase;">Premium cocktail catering</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0; background: #13324b; background-image: linear-gradient(135deg, #143751 0%, #112f48 100%);">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td width="98" valign="middle" style="padding: 22px 0 22px 28px;">
                        <div aria-hidden="true" style="display: inline-block; width: 60px; height: 60px; border-radius: 50%; border: 2px solid #d7a956; color: #d7a956; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 400; line-height: 60px; text-align: center; mso-line-height-rule: exactly;">
                          ${emailIcons.announcement}
                        </div>
                      </td>
                      <td valign="middle" style="padding: 22px 30px 22px 0;">
                        <h1 style="margin: 0 0 8px; color: #fff9ee; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; line-height: 1.2; font-weight: 700; letter-spacing: 0.01em; text-transform: uppercase;">New booking inquiry</h1>
                        <p style="margin: 0; color: #e9dfcf; font-size: 15px; line-height: 1.55;">A new inquiry has been submitted through the booking form.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 18px 20px 16px; background: #fffefb;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      ${fieldCard("Name", inquiry.name, emailIcons.name)}
                      ${fieldCard("Email", inquiry.email, emailIcons.email)}
                    </tr>
                    <tr>
                      ${fieldCard("Phone", inquiry.phoneFull, emailIcons.phone)}
                      ${fieldCard("Event date", inquiry.eventDate, emailIcons.date)}
                    </tr>
                    <tr>
                      ${fieldCard("Event type", inquiry.eventType, emailIcons.event)}
                      ${fieldCard("Guest count", inquiry.guestCount, emailIcons.guests)}
                    </tr>
                    ${fullWidthCard("Venue or event location", inquiry.venue, emailIcons.location)}
                    ${fullWidthCard("Service style", inquiry.serviceStyle, emailIcons.service)}
                    ${fullWidthCard("Planning range", inquiry.budget, emailIcons.budget)}
                    ${fullWidthCard("Event details, drink preferences, or constraints", inquiry.details, emailIcons.details, true)}
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 32px 26px 34px; background: #14211b; background-image: radial-gradient(circle at 10% 20%, rgba(215, 169, 86, 0.11) 0, rgba(215, 169, 86, 0) 36%), radial-gradient(circle at 92% 18%, rgba(255, 255, 255, 0.07) 0, rgba(255, 255, 255, 0) 34%), linear-gradient(135deg, #101a16 0%, #17251f 100%); border-top: 2px solid #d7a956;">
                  ${mountainLineMark()}
                  <p style="margin: 16px 0 8px; color: #fff9ee; font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 1.55;">Thank you for considering Mountain Mixology.</p>
                  <p style="margin: 0 0 20px; color: #e9dfcf; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; line-height: 1.55;">We'll be in touch shortly to follow up on this inquiry.</p>
                  <div style="margin: 0 auto 22px; width: 38px; height: 2px; background: #d7a956;"></div>
                  <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin: 0 auto;">
                    <tr>
                      <td style="padding: 0 16px; color: #fff9ee; font-size: 14px; line-height: 1.4; white-space: nowrap;">
                        <span style="display: inline-block; vertical-align: middle; color: #d7a956; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; line-height: 1; margin-right: 8px;">${emailIcons.email}</span>
                        <span style="display: inline-block; vertical-align: middle;">mountainmixologyca@gmail.com</span>
                      </td>
                      <td style="padding: 0 16px; color: #fff9ee; font-size: 14px; line-height: 1.4; border-left: 1px solid rgba(255, 249, 238, 0.38); white-space: nowrap;">
                        <span style="display: inline-block; vertical-align: middle; color: #d7a956; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; line-height: 1; margin-right: 8px;">${emailIcons.location}</span>
                        <span style="display: inline-block; vertical-align: middle;">Canmore, Alberta</span>
                      </td>
                      <td style="padding: 0 16px; color: #fff9ee; font-size: 14px; line-height: 1.4; border-left: 1px solid rgba(255, 249, 238, 0.38); white-space: nowrap;">
                        <span style="display: inline-block; vertical-align: middle; color: #d7a956; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; line-height: 1; margin-right: 8px;">${emailIcons.mountain}</span>
                        <span style="display: inline-block; vertical-align: middle;">mountainmixology.ca</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>`;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL ?? defaultRecipient;

  if (!isSameOrigin(request)) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  if (isRateLimited(request)) {
    return Response.json(
      { error: "Too many booking attempts. Please try again later." },
      { status: 429 }
    );
  }

  if (!apiKey || !from) {
    return Response.json(
      { error: "Booking email is not configured yet." },
      { status: 503 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maxRequestBytes) {
    return Response.json({ error: "Request is too large." }, { status: 413 });
  }

  let payload: BookingPayload;
  try {
    payload = (await request.json()) as BookingPayload;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = validate(payload);
  if (!validation.ok) {
    return Response.json({ errors: validation.errors }, { status: 400 });
  }

  const { inquiry } = validation;
  const subject = `Mountain Mixology booking inquiry: ${inquiry.eventType} on ${inquiry.eventDate}`;

  const response = await fetch(resendApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: inquiry.email,
      subject,
      text: formatText(inquiry),
      html: formatHtml(inquiry, bookingEmailLogoUrl),
      tags: [{ name: "source", value: "mountain_mixology_booking" }],
    }),
  });

  if (!response.ok) {
    return Response.json(
      { error: "Unable to send the booking inquiry right now." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
