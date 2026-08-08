import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const worker = await loadWorker();

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    executionContext,
  );
}

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

const executionContext = {
  waitUntil() {},
  passThroughOnException() {},
};

test("server-renders the complete Mountain Mixology experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="en-CA">/i);
  assert.match(html, /<title>Mountain Mixology \| Premium Cocktail Catering in Canmore<\/title>/i);
  assert.match(html, /<h1 id="hero-title">Mountain<br\s*\/>Mixology<\/h1>/i);
  assert.match(html, /href="#main-content">Skip to main content/i);
  assert.match(html, /id="services"/i);
  assert.match(html, /id="approach"/i);
  assert.doesNotMatch(html, /service[ -]area/i);
  assert.match(html, /id="booking"/i);
  assert.match(html, /A bar program that belongs at your event/i);
  assert.match(html, /Tell us what you are bringing together/i);

  assert.match(html, /aria-controls="primary-menu"/i);
  assert.match(html, /aria-expanded="false"/i);
  assert.match(html, /id="primary-menu"/i);
  assert.match(html, /data-open="false"/i);
  assert.match(html, /Theme follows your system setting/i);

  assert.match(html, /<legend><span>01<\/span> Contact details<\/legend>/i);
  assert.match(html, /<legend><span>02<\/span> Event and service<\/legend>/i);
  assert.match(html, /<legend><span>03<\/span> Event notes<\/legend>/i);
  assert.match(html, /aria-label="Phone country code, Canada \+1"/i);
  assert.match(html, /role="listbox"/i);
  assert.match(html, /role="option"/i);
  assert.match(html, /Canada/);
  assert.match(html, /United States/);
  assert.match(html, /United Kingdom/);
  assert.match(html, /autoComplete="tel-national"/i);
  assert.match(html, />Submit<\/button>/i);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working|react-loading-skeleton/i);
});

test("preserves accessible UI behavior and server-side booking protections", async () => {
  const [page, bookingForm, header, systemThemeIndicator, route, phone, css, layout, worker, viteConfig] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/BookingForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SystemThemeIndicator.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/bookings/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/phone.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /import BookingForm from/);
  assert.match(page, /import SiteHeader from/);
  assert.match(page, /import SystemThemeIndicator from/);
  assert.match(page, /<SystemThemeIndicator \/>/);
  assert.match(page, /import Image from "next\/image"/);
  assert.match(page, /src="\/og-v2\.png"/);
  assert.match(page, /priority/);
  assert.match(page, /sizes="100vw"/);

  assert.doesNotMatch(header, /theme-toggle|ThemeIcon|prefers-color-scheme/);
  assert.doesNotMatch(header, /IntersectionObserver/);
  assert.match(header, /window\.requestAnimationFrame\(updateActiveSection\)/);
  assert.match(header, /window\.addEventListener\("scroll", scheduleUpdate, \{ passive: true \}\)/);
  assert.match(header, /window\.cancelAnimationFrame\(animationFrame\)/);
  assert.match(header, /setCurrentSection\(item\.sectionId\)/);
  assert.match(header, /activeSectionRef\.current === sectionId/);
  assert.doesNotMatch(header, /indicatorSectionRef/);
  assert.match(header, /`\[data-section-id="\$\{activeSectionRef\.current\}"\]`/);
  assert.match(header, /const setCurrentSection = useCallback\(\(sectionId: string, immediate = false\)/);
  assert.match(header, /scheduleIndicator\(immediate\)/);
  assert.match(header, /setCurrentSection\("top"\)/);
  assert.match(header, /className="nav-link-indicator"/);
  assert.match(header, /new ResizeObserver\(handleGeometryChange\)/);
  assert.match(header, /document\.fonts\.addEventListener\("loadingdone"/);
  assert.doesNotMatch(header, /addEventListener\("pointerover"/);
  assert.doesNotMatch(header, /addEventListener\("focusin"/);
  assert.match(header, /matchMedia\("\(min-width: 761px\)"\)/);
  assert.match(header, /document\.body\.style\.overflow = "hidden"/);
  assert.match(header, /document\.addEventListener\("pointerdown"/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(header, /aria-current=/);
  assert.equal(header.match(/Book Event/g)?.length, 2);
  assert.equal(header.match(/activeSection === "booking"/g)?.length, 2);
  assert.equal(header.match(/setCurrentSection\("booking"\)/g)?.length, 2);
  assert.doesNotMatch(header, /Start an inquiry/);
  assert.match(header, /className="nav-mobile-cta"/);
  assert.doesNotMatch(header, /service-area|Service area/);

  assert.match(systemThemeIndicator, /Theme follows your system setting/);
  assert.match(systemThemeIndicator, /role="img"/);
  assert.match(systemThemeIndicator, /system-theme-icon-light/);
  assert.match(systemThemeIndicator, /system-theme-icon-dark/);
  assert.doesNotMatch(systemThemeIndicator, /"use client"|matchMedia|localStorage|dataset\.theme|onClick/);

  assert.match(phone, /phoneCountryCodes = \[/);
  assert.match(phone, /defaultPhoneCountryId = "CA"/);
  assert.match(phone, /defaultPhoneCountryCode = "\+1"/);
  assert.match(phone, /isSupportedPhoneCountryCode/);
  assert.match(phone, /phoneContainsOnlyAllowedCharacters/);
  assert.match(phone, /formatPhoneForDisplay/);

  assert.match(bookingForm, /function CountryCodeDropdown/);
  assert.match(bookingForm, /phoneCountryCodes\.map/);
  assert.match(bookingForm, /aria-activedescendant/);
  assert.match(bookingForm, /event\.key === "ArrowDown"/);
  assert.match(bookingForm, /event\.key === "Escape"/);
  assert.match(bookingForm, /updatePhoneCountry/);
  assert.match(bookingForm, /getPhoneValidationError\(form\.phone, form\.phoneCountryCode\)/);
  assert.match(bookingForm, /errorSummaryRef\.current\?\.focus/);
  assert.match(bookingForm, /successRef\.current\?\.focus/);
  assert.match(bookingForm, /aria-busy=/);

  assert.match(route, /isSameOrigin\(request\)/);
  assert.match(route, /isRateLimited\(request\)/);
  assert.match(route, /maxRequestBytes/);
  assert.match(route, /sanitizeInline/);
  assert.match(route, /sanitizeMessage/);
  assert.match(route, /escapeHtml/);
  assert.match(route, /isLikelySpam/);
  assert.match(route, /phoneCountryCode\?: unknown/);
  assert.doesNotMatch(route, /serviceArea|Service area/);
  assert.match(route, /isSupportedPhoneCountryCode\(rawPhoneCountryCode\)/);
  assert.match(route, /phoneContainsOnlyAllowedCharacters\(rawPhone\)/);
  assert.match(route, /formatPhoneForDisplay\(phone, phoneCountryCode\)/);
  assert.match(route, /bookingEmailLogoUrl/);
  assert.match(route, /mm-transparent-light\.png/);
  assert.match(route, /function iconBadge/);
  assert.match(route, /function mountainLineMark/);
  assert.doesNotMatch(route, /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);

  assert.match(css, /--duration-base/);
  assert.match(css, /--submit-bg: #c18a24/);
  assert.match(css, /--submit-bg-hover: #bd8723/);
  assert.match(css, /--submit-bg: #e2b36b/);
  assert.match(css, /\.submit-button \{[\s\S]*background: var\(--submit-bg\);[\s\S]*color: var\(--submit-ink\)/);
  assert.match(css, /\.nav-cta \{[\s\S]*background: var\(--submit-bg\);[\s\S]*color: var\(--submit-ink\)/);
  assert.match(css, /\.button-primary \{[\s\S]*background: var\(--submit-bg\);[\s\S]*color: var\(--submit-ink\)/);
  assert.match(css, /\.nav-links \.nav-mobile-cta \{[\s\S]*background: var\(--submit-bg\);[\s\S]*color: var\(--submit-ink\)/);
  assert.doesNotMatch(css, /--nav-cta-/);
  assert.match(css, /@media \(prefers-color-scheme: dark\) \{\s*:root \{/);
  assert.doesNotMatch(css, /:root\[data-theme=/);
  assert.match(css, /--green-surface: #eff7f2/);
  assert.match(css, /--canvas: #eef2ef/);
  assert.match(css, /--nav-bg: var\(--green-surface\)/);
  assert.match(css, /--nav-link-text: color-mix\(in srgb, var\(--nav-ink\) 76%, transparent\)/);
  assert.match(css, /--nav-bg: rgba\(9, 29, 23, 0\.94\)/);
  assert.match(css, /--nav-ink: #173f34/);
  assert.match(css, /--nav-edge: rgba\(36, 91, 75, 0\.42\)/);
  assert.match(css, /\.site-nav \{[\s\S]*border: 1px solid var\(--nav-edge\);[\s\S]*background: var\(--nav-bg\);[\s\S]*color: var\(--nav-ink\);[\s\S]*box-shadow: var\(--nav-shadow\)/);
  assert.match(css, /\.nav-links \{[\s\S]*background: var\(--nav-menu-bg\)/);
  assert.match(css, /--booking-bg: #ffffff/);
  assert.match(css, /--booking-bg: #0c1713/);
  assert.match(css, /--booking-form-bg: #245b4b/);
  assert.match(css, /--booking-form-ink: #f5f7f5/);
  assert.match(css, /\.booking-section \{[\s\S]*background: var\(--booking-bg\);[\s\S]*color: var\(--booking-ink\)/);
  assert.match(css, /\.booking-form \{[\s\S]*background: var\(--booking-form-bg\);[\s\S]*color: var\(--booking-form-ink\)/);
  assert.match(css, /\.booking-form input,[\s\S]*background: var\(--booking-field-bg\);[\s\S]*color: var\(--booking-field-ink\)/);
  assert.match(css, /--approach-bg: #102d25/);
  assert.match(css, /\.approach-section \{[\s\S]*background: var\(--approach-bg\);[\s\S]*color: var\(--approach-ink\)/);
  assert.match(css, /--footer-bg: #091713/);
  assert.match(css, /\.site-footer \{[\s\S]*background: var\(--footer-bg\);[\s\S]*color: var\(--footer-ink\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /scroll-padding-top/);
  assert.match(css, /grid-template-columns: auto minmax\(0, 1fr\) auto/);
  assert.match(css, /width: min\(1080px, 100%\)/);
  assert.match(css, /\.eyebrow \{[\s\S]*font-size: 0\.95rem/);
  assert.match(css, /\.nav-links \{[\s\S]*justify-self: end;[\s\S]*justify-content: flex-end/);
  assert.match(css, /\.brand-copy strong \{[\s\S]*font-size: 1\.125rem;[\s\S]*font-weight: 700/);
  assert.match(css, /\.nav-links a \{[\s\S]*font-size: 0\.92rem;[\s\S]*font-weight: 700/);
  assert.match(css, /\.nav-actions \{[\s\S]*margin-left: clamp\(16px, 2vw, 28px\)/);
  assert.match(css, /\.nav-cta \{[\s\S]*padding: 0 16px/);
  assert.match(css, /\.nav-links a:hover,[\s\S]*background: transparent/);
  assert.match(css, /\.nav-link-indicator \{[\s\S]*transform: translate3d\([\s\S]*scale\(/);
  assert.match(css, /\.nav-link-indicator \{[\s\S]*will-change: transform, opacity/);
  assert.match(css, /\.nav-link-indicator \{[\s\S]*background: var\(--nav-link-text\)/);
  assert.match(css, /\.nav-cta::after,[\s\S]*\.nav-links \.nav-mobile-cta::after \{[\s\S]*background: var\(--nav-link-text\);[\s\S]*transform: scaleX\(0\)/);
  assert.match(css, /\.nav-cta\[aria-current="location"\]::after,[\s\S]*\.nav-links \.nav-mobile-cta\[aria-current="location"\]::after \{[\s\S]*transform: scaleX\(1\)/);
  assert.doesNotMatch(css, /\.nav-links a\[aria-current="location"\]::after/);
  assert.match(css, /@media \(min-width: 761px\) and \(max-width: 920px\)[\s\S]*\.brand-copy span \{[\s\S]*display: none/);
  assert.match(css, /\.phone-input-group/);
  assert.match(css, /grid-template-columns: 108px minmax\(0, 1fr\)/);
  assert.match(css, /\.country-code-menu/);
  assert.match(css, /@media \(max-width: 380px\)[\s\S]*grid-template-columns: 100px minmax\(0, 1fr\)/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.menu-toggle \{ display: grid; \}/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*width: min\(360px, calc\(100vw - 20px\)\)/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*flex-direction: column;[\s\S]*justify-content: flex-start/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*transform-origin: top right/);
  assert.match(css, /\.nav-links\[data-open="true"\] a \{[\s\S]*opacity: 1;[\s\S]*transform: translateY\(0\)/);
  assert.match(css, /\.nav-links \.nav-mobile-cta,\s*\.menu-toggle \{\s*display: none/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.nav-links \.nav-mobile-cta \{[\s\S]*display: inline-flex/);
  assert.match(css, /\.nav-links \.nav-mobile-cta \{[\s\S]*justify-content: flex-start/);
  assert.match(css, /\.system-theme-indicator \{[\s\S]*margin-left: auto/);
  assert.match(css, /@media \(prefers-color-scheme: dark\)[\s\S]*\.system-theme-icon-light \{ display: none; \}[\s\S]*\.system-theme-icon-dark \{ display: grid; \}/);
  assert.match(css, /@media \(max-width: 600px\)[\s\S]*\.footer-inner \{[\s\S]*text-align: center/);
  assert.match(css, /@media \(max-width: 600px\)[\s\S]*\.footer-meta \{[\s\S]*flex-direction: column;[\s\S]*justify-content: center/);
  assert.match(css, /@media \(max-width: 600px\)[\s\S]*\.system-theme-indicator \{[\s\S]*margin-left: 0/);
  assert.doesNotMatch(css, /documentElement|data-theme|localStorage/);
  assert.doesNotMatch(css, /content: "↘"|service-area|area-list/);

  assert.match(layout, /colorScheme: "light dark"/);
  assert.match(layout, /<html lang="en-CA">/);

  assert.match(viteConfig, /assets:\s*\{\s*binding: "ASSETS",\s*directory: "\.\/public"/);
  assert.match(worker, /if \(!assetFetcher\)/);
  assert.match(worker, /status: 503/);
  assert.match(worker, /if \(imageTransformer\)/);
});

test("serves image assets safely when the local Images binding is unavailable", async () => {
  const worker = await loadWorker();
  const request = new Request(
    "http://localhost/_vinext/image?url=%2Fog-v2.png&w=640&q=75",
    { headers: { accept: "image/webp,image/*" } },
  );

  const response = await worker.fetch(
    request,
    {
      ASSETS: {
        fetch: async () =>
          new Response(new Uint8Array([137, 80, 78, 71]), {
            headers: { "content-type": "image/png" },
          }),
      },
    },
    executionContext,
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("cache-control") ?? "", /max-age=31536000/);

  const unavailable = await worker.fetch(request, {}, executionContext);
  assert.equal(unavailable.status, 503);
});
