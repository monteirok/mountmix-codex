"use client";

import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useId,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  defaultPhoneCountryCode,
  defaultPhoneCountryId,
  formatPhoneNumber,
  getPhoneValidationError,
  phoneCountryCodes,
} from "../lib/phone";

type BookingFormState = {
  name: string;
  email: string;
  phoneCountryId: string;
  phoneCountryCode: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  venue: string;
  serviceStyle: string;
  budget: string;
  details: string;
  website: string;
  startedAt: string;
};

type FormErrors = Partial<Record<keyof BookingFormState, string>>;
type PhoneCountry = (typeof phoneCountryCodes)[number];

const eventTypes = ["Wedding", "Private dinner", "Corporate event", "Retreat", "Celebration", "Other"];
const serviceStyles = ["Full cocktail bar", "Signature cocktail station", "Mocktail and zero-proof bar", "Welcome drinks", "Consultation only"];

function createInitialForm(): BookingFormState {
  return {
    name: "",
    email: "",
    phoneCountryId: defaultPhoneCountryId,
    phoneCountryCode: defaultPhoneCountryCode,
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    venue: "",
    serviceStyle: "",
    budget: "",
    details: "",
    website: "",
    startedAt: String(Date.now()),
  };
}

function sanitizeText(value: string, maxLength: number) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function validateForm(form: BookingFormState): FormErrors {
  const errors: FormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const guestCount = Number.parseInt(form.guestCount, 10);

  if (sanitizeText(form.name, 80).length < 2) errors.name = "Enter your name.";
  if (!emailPattern.test(form.email.trim()) || form.email.length > 120) errors.email = "Enter a valid email address.";

  const phoneError = getPhoneValidationError(form.phone, form.phoneCountryCode);
  if (phoneError) errors.phone = phoneError;
  if (!form.eventType) errors.eventType = "Choose an event type.";
  if (!form.eventDate) errors.eventDate = "Choose a target date.";
  if (!Number.isFinite(guestCount) || guestCount < 1 || guestCount > 2000) errors.guestCount = "Enter 1 to 2000 guests.";
  if (sanitizeText(form.venue, 120).length < 2) errors.venue = "Enter a venue or location.";
  if (!form.serviceStyle) errors.serviceStyle = "Choose a service style.";
  if (!form.budget) errors.budget = "Choose a planning range.";
  if (sanitizeText(form.details, 700).length < 20) errors.details = "Add a few details about the event.";
  return errors;
}

function CountryCodeDropdown({ countryId, hasError, onSelect }: { countryId: string; hasError: boolean; onSelect: (country: PhoneCountry) => void }) {
  const listboxId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const selectedIndex = Math.max(0, phoneCountryCodes.findIndex((country) => country.id === countryId));
  const selectedCountry = phoneCountryCodes[selectedIndex];
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const [opensUp, setOpensUp] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function focusOption(index: number) {
    window.requestAnimationFrame(() => optionRefs.current[index]?.focus({ preventScroll: true }));
  }

  function openDropdown(index = selectedIndex, shouldFocus = false) {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setOpensUp(window.innerHeight - rect.bottom < 340 && rect.top > window.innerHeight - rect.bottom);
    setActiveIndex(index);
    setIsOpen(true);
    if (shouldFocus) focusOption(index);
  }

  function selectCountry(index: number) {
    const country = phoneCountryCodes[index];
    if (!country) return;
    onSelect(country);
    setActiveIndex(index);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function activateOption(index: number) {
    setActiveIndex(index);
    focusOption(index);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const lastIndex = phoneCountryCodes.length - 1;
    if (event.key === "Escape") {
      if (isOpen) {
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) return openDropdown(selectedIndex, true);
      return activateOption(activeIndex >= lastIndex ? 0 : activeIndex + 1);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) return openDropdown(selectedIndex, true);
      return activateOption(activeIndex <= 0 ? lastIndex : activeIndex - 1);
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      return activateOption(event.key === "Home" ? 0 : lastIndex);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) return openDropdown(selectedIndex, true);
      selectCountry(activeIndex);
    }
  }

  return (
    <div
      className="country-code-dropdown"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        className="country-code-button"
        type="button"
        aria-label={`Phone country code, ${selectedCountry.country} ${selectedCountry.value}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        data-invalid={hasError}
        onClick={() => isOpen ? setIsOpen(false) : openDropdown()}
      >
        <span className="country-flag" aria-hidden="true">{selectedCountry.flag}</span>
        <span>{selectedCountry.value}</span>
        <span className="country-code-chevron" aria-hidden="true" />
      </button>
      <div
        className="country-code-menu"
        id={listboxId}
        role="listbox"
        aria-label="Phone country code"
        aria-activedescendant={isOpen ? `${listboxId}-${phoneCountryCodes[activeIndex].id}` : undefined}
        data-open={isOpen}
        data-placement={opensUp ? "top" : "bottom"}
      >
        {phoneCountryCodes.map((country, index) => (
          <div
            className="country-code-option"
            id={`${listboxId}-${country.id}`}
            role="option"
            aria-selected={country.id === selectedCountry.id}
            tabIndex={isOpen && index === activeIndex ? 0 : -1}
            data-active={index === activeIndex}
            key={country.id}
            ref={(node) => { optionRefs.current[index] = node; }}
            onClick={() => selectCountry(index)}
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <span className="country-flag" aria-hidden="true">{country.flag}</span>
            <span className="country-option-name">{country.country}</span>
            <span className="country-option-code">({country.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <span className="field-error" id={id}>{message}</span> : null;
}

export default function BookingForm() {
  const [form, setForm] = useState<BookingFormState>(() => createInitialForm());
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const errorSummaryRef = useRef<HTMLDivElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  function updateField(field: keyof BookingFormState, value: string) {
    const maxLength = field === "details" ? 700 : 140;
    setForm((current) => ({ ...current, [field]: value.slice(0, maxLength) }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitted(false);
    setSubmitError("");
  }

  function updatePhoneCountry(country: PhoneCountry) {
    setForm((current) => ({
      ...current,
      phoneCountryId: country.id,
      phoneCountryCode: country.value,
      phone: formatPhoneNumber(current.phone, country.value),
    }));
    setErrors((current) => {
      if (!current.phone) return current;
      const next = { ...current };
      delete next.phone;
      return next;
    });
  }

  function focusErrorSummary() {
    window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    setSubmitted(false);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError("Review the highlighted fields before sending your inquiry.");
      focusErrorSummary();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json().catch(() => ({}))) as { errors?: FormErrors; error?: string };

      if (!response.ok) {
        if (response.status === 400 && payload.errors) setErrors(payload.errors);
        setSubmitError(payload.error || "Unable to send right now. Please try again later.");
        focusErrorSummary();
        return;
      }

      setSubmitted(true);
      setForm(createInitialForm());
      window.requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setSubmitError("Unable to send right now. Please try again later.");
      focusErrorSummary();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      <div className="form-intro">
        <div>
          <p className="form-kicker">Booking inquiry</p>
          <h3>Share the shape of your event.</h3>
        </div>
        <p>Required fields are marked <span aria-hidden="true">*</span>.</p>
      </div>

      {submitError ? (
        <div className="form-alert form-alert-error" role="alert" tabIndex={-1} ref={errorSummaryRef}>
          <strong>We could not send the inquiry yet.</strong>
          <span>{submitError}</span>
        </div>
      ) : null}
      {submitted ? (
        <div className="form-alert form-alert-success" role="status" tabIndex={-1} ref={successRef}>
          <strong>Inquiry sent.</strong>
          <span>Thank you. Mountain Mixology will follow up using the email address you provided.</span>
        </div>
      ) : null}

      <fieldset>
        <legend><span>01</span> Contact details</legend>
        <div className="form-grid">
          <label>
            <span className="field-label">Name <span aria-hidden="true">*</span></span>
            <input id="name" autoComplete="name" maxLength={80} required value={form.name} onChange={(event) => updateField("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
            <FieldError id="name-error" message={errors.name} />
          </label>
          <label>
            <span className="field-label">Email <span aria-hidden="true">*</span></span>
            <input id="email" type="email" autoComplete="email" inputMode="email" maxLength={120} required value={form.email} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
            <FieldError id="email-error" message={errors.email} />
          </label>
          <label>
            <span className="field-label">Phone <span className="field-optional">Optional</span></span>
            <div className="phone-input-group">
              <CountryCodeDropdown countryId={form.phoneCountryId} hasError={Boolean(errors.phone)} onSelect={updatePhoneCountry} />
              <input id="phone" autoComplete="tel-national" inputMode="tel" maxLength={20} placeholder="(403) 555-0184" value={form.phone} onChange={(event) => updateField("phone", formatPhoneNumber(event.target.value, form.phoneCountryCode))} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} />
            </div>
            <FieldError id="phone-error" message={errors.phone} />
          </label>
          <label>
            <span className="field-label">Event date <span aria-hidden="true">*</span></span>
            <input id="event-date" type="date" required value={form.eventDate} onChange={(event) => updateField("eventDate", event.target.value)} aria-invalid={Boolean(errors.eventDate)} aria-describedby={errors.eventDate ? "date-error" : undefined} />
            <FieldError id="date-error" message={errors.eventDate} />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend><span>02</span> Event and service</legend>
        <div className="form-grid">
          <label>
            <span className="field-label">Event type <span aria-hidden="true">*</span></span>
            <select id="event-type" required value={form.eventType} onChange={(event) => updateField("eventType", event.target.value)} aria-invalid={Boolean(errors.eventType)} aria-describedby={errors.eventType ? "type-error" : undefined}>
              <option value="">Select an event type</option>
              {eventTypes.map((type) => <option value={type} key={type}>{type}</option>)}
            </select>
            <FieldError id="type-error" message={errors.eventType} />
          </label>
          <label>
            <span className="field-label">Guest count <span aria-hidden="true">*</span></span>
            <input id="guest-count" inputMode="numeric" maxLength={5} pattern="[0-9]*" required placeholder="85" value={form.guestCount} onChange={(event) => updateField("guestCount", event.target.value.replace(/\D/g, ""))} aria-invalid={Boolean(errors.guestCount)} aria-describedby={errors.guestCount ? "guests-error" : undefined} />
            <FieldError id="guests-error" message={errors.guestCount} />
          </label>
          <label className="field-span-2">
            <span className="field-label">Venue or event location <span aria-hidden="true">*</span></span>
            <input id="venue" maxLength={120} required placeholder="Venue name, town, or address" value={form.venue} onChange={(event) => updateField("venue", event.target.value)} aria-invalid={Boolean(errors.venue)} aria-describedby={errors.venue ? "venue-error" : undefined} />
            <FieldError id="venue-error" message={errors.venue} />
          </label>
          <label className="field-span-2">
            <span className="field-label">Service style <span aria-hidden="true">*</span></span>
            <select id="service-style" required value={form.serviceStyle} onChange={(event) => updateField("serviceStyle", event.target.value)} aria-invalid={Boolean(errors.serviceStyle)} aria-describedby={errors.serviceStyle ? "style-error" : undefined}>
              <option value="">Select a service style</option>
              {serviceStyles.map((style) => <option value={style} key={style}>{style}</option>)}
            </select>
            <FieldError id="style-error" message={errors.serviceStyle} />
          </label>
          <label className="field-span-2">
            <span className="field-label">Planning range <span aria-hidden="true">*</span></span>
            <select id="budget" required value={form.budget} onChange={(event) => updateField("budget", event.target.value)} aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? "budget-error" : undefined}>
              <option value="">Select a planning range</option>
              <option value="$1,500-$3,000">$1,500-$3,000</option>
              <option value="$3,000-$6,000">$3,000-$6,000</option>
              <option value="$6,000-$10,000">$6,000-$10,000</option>
              <option value="$10,000+">$10,000+</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
            <FieldError id="budget-error" message={errors.budget} />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend><span>03</span> Event notes</legend>
        <label>
          <span className="field-label">Drink preferences, venue constraints, and event details <span aria-hidden="true">*</span></span>
          <textarea id="details" maxLength={700} rows={6} required placeholder="Tell us about the atmosphere, cocktail preferences, timing, venue rules, accessibility needs, and zero-proof options." value={form.details} onChange={(event) => updateField("details", event.target.value)} aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? "details-error details-help" : "details-help"} />
          <span className="field-meta" id="details-help"><span>Minimum 20 characters</span><span>{form.details.length}/700</span></span>
          <FieldError id="details-error" message={errors.details} />
        </label>
      </fieldset>

      <label className="form-honeypot" aria-hidden="true">
        Website
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => updateField("website", event.target.value)} />
      </label>

      <div className="form-footer">
        <p>This sends a booking inquiry, not a confirmed reservation.</p>
        <button className="submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <span className="button-spinner" aria-hidden="true" /> : null}
          {isSubmitting ? "Submitting" : "Submit"}
        </button>
      </div>
    </form>
  );
}
