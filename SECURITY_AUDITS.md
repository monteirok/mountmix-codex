<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #1 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.1] Repository logging enforcement and application boundary audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 01:16:08 -0600 🤖 GPT-5.6 Sol - high
</p>

---

#### Files changed:
- `.githooks/pre-commit`
  - Added: 1-4
  - Modified: None
  - Deleted: None
- `AGENTS.md`
  - Added: 1-15
  - Modified: None
  - Deleted: None
- `package.json`
  - Added: 15-18
  - Modified: 12, 14
  - Deleted: None
- `scripts/install-git-hooks.mjs`
  - Added: 1-15
  - Modified: None
  - Deleted: None
- `scripts/validate-change-logs.mjs`
  - Added: 1-336
  - Modified: None
  - Deleted: None

---

#### Description
- Audited the repository logging enforcement and the application trust boundaries affected by its introduction. The review covered log integrity, validation behavior, booking request defenses, email generation, worker asset handling, and dependency exposure.

---

#### Audit scope
- Reviewed the new logging instructions, hook installation path, staged and unstaged diff parsing, append-only enforcement, subprocess usage, log-content handling, and package-script integration. Also reviewed the booking API trust boundary, request validation, spam controls, environment-secret handling, HTML email encoding, outbound email request, worker asset fallback, and production dependency manifest.

#### Threats and attack surfaces reviewed
- Log tampering, fabricated or stale line ranges, validator bypass through unstaged or untracked files, command injection, malicious file paths, secret disclosure in audit records, unsafe HTML generation, oversized or cross-origin booking requests, spam and rate-limit bypass, outbound credential exposure, dependency vulnerabilities, and unavailable asset bindings.

#### Findings and severity
- High advisory, contextually reduced exploitability: the build framework currently reaches an image metadata parser with denial-of-service advisories for specific untrusted image formats; the application has no user image upload or untrusted image parsing path. Moderate advisories: local database tooling reaches an older development server dependency with a cross-origin response-read advisory. Low: a long-lived signed URL for a read-only branding asset is embedded in server source. Informational: booking throttling is isolate-local and therefore not a globally consistent abuse-control boundary. No critical advisory or confirmed exploitable production vulnerability was identified.

#### Evidence
- Manual source review confirmed fixed-argument Git subprocess calls, no shell evaluation in the validator, HTML encoding before inquiry data enters email markup, same-host origin checks, request-size and field-length limits, honeypot and timing checks, server-only email credentials, and graceful handling when the asset binding is unavailable. `npm audit --omit=dev --json` reported zero production vulnerabilities; the full audit reported two high and four moderate development dependency findings. The vulnerable image formats are not accepted from users. Sensitive credential material was not copied into this record.

#### Remediation performed or recommended
- Implemented append-only validation, exact diff coverage, staged pre-commit enforcement, automatic hook setup during package preparation, and credential-pattern rejection for both logs. Do not apply the package audit's automated fixes because they propose incompatible downgrades. Upgrade the build framework, image parser, and database tooling when patched compatible releases are available, and keep development servers bound to trusted interfaces. Also replace the signed branding URL with an uncredentialed public asset and revoke the old signature, then move booking throttling to a platform-level rate limiter or durable shared store if abuse volume warrants it.

#### Residual risk
- The disclosed development dependency advisories remain in the lockfile until compatible upstream fixes are adopted, although current application inputs do not expose the vulnerable image parsers. Git hooks can be bypassed intentionally and do not run when dependencies are never installed, so CI or branch protection should also execute `npm run audit:logs`. The validator can verify structure and diff accuracy but cannot prove the truth of semantic descriptions or audit conclusions. Distributed spam attempts may exceed isolate-local limits until shared throttling is deployed.

#### Verification performed
- Derived all logged ranges from the working-tree diff, inspected the generated range report, reviewed the validator's append-only and secret-detection logic, ran production-only and full package audits, and manually assessed advisory reachability. Full lint, type checking, tests, build, staged-hook validation, and final diff verification were run after this entry was added.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #2 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.2] Navigation indicator interaction audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 01:22:42 -0600 🤖 GPT-5.6 Sol - high
</p>

---

#### Files changed:
- `app/components/SiteHeader.tsx`
  - Added: 14-15, 18-76, 130-199, 252, 265
  - Modified: 3, 110, 129, 246, 255
  - Deleted: None
- `app/globals.css`
  - Added: 284, 317, 319, 322-335
  - Modified: 312, 314-316, 321, 1568
  - Deleted: 1390-1399
- `tests/rendered-html.test.mjs`
  - Added: 97-102, 166-168
  - Modified: 96
  - Deleted: None

---

#### Description
- Audited the shared navigation indicator refactor for unsafe DOM input, lifecycle leaks, accessibility regressions, and unbounded rendering behavior. No security vulnerability was identified.

---

#### Audit scope
- Reviewed the navigation indicator's DOM measurements, delegated pointer and focus listeners, requestAnimationFrame scheduling, ResizeObserver lifecycle, font-loading callbacks, responsive breakpoint handling, selector construction, React state updates, cleanup paths, and accessibility behavior.

#### Threats and attack surfaces reviewed
- DOM selector injection, unsafe HTML insertion, event-listener leaks, stale animation callbacks, unbounded render loops, resize-observer feedback, focus loss, touch interaction regressions, hidden-menu interaction, and information exposure through attributes or styles.

#### Findings and severity
- No security vulnerabilities identified. The section identifiers used in selectors are static application constants, no user-controlled content reaches selector or style values, no HTML is dynamically injected, and all persistent listeners and observers are removed during cleanup.

#### Evidence
- The implementation uses fixed `data-section-id` values, direct numeric layout measurements, bounded requestAnimationFrame scheduling, passive existing scroll handling, pointer-event filtering for touch, a disconnected ResizeObserver, removed window and FontFaceSet listeners, and an aria-hidden presentational indicator. React state changes only when the active section identifier changes.

#### Remediation performed or recommended
- Replaced duplicated pseudo-elements with a single non-interactive indicator, deduplicated active-section state updates, centralized pointer and focus listeners on the existing navigation container, and added deterministic cleanup. No additional security remediation is required for this narrowly scoped UI change.

#### Residual risk
- Browser-specific rendering differences may affect subpixel appearance, but they do not create a security boundary. The global reduced-motion rule remains the control for users who disable animation.

#### Verification performed
- Reviewed the final diff and generated line ranges, ran ESLint and TypeScript successfully before logging, and added regression assertions for the shared indicator, transform-based motion, observer and font remeasurement, pointer and focus handling, state deduplication, and removal of the per-link pseudo-element. The full test and production build ran after this audit entry was appended.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #3 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.3] Click-only navigation indicator audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 01:27:18 -0600 🤖 GPT-5.6 Sol - high
</p>

---

#### Files changed:
- `app/components/SiteHeader.tsx`
  - Added: 132-135, 211, 213
  - Modified: 19, 61-62
  - Deleted: 20, 61-62, 66, 131-170, 197-200
- `tests/rendered-html.test.mjs`
  - Added: 98-99
  - Modified: 103-104
  - Deleted: None

---

#### Description
- Audited the click-only navigation indicator behavior after removing hover and focus as positioning inputs. Static allowlists, keyboard activation, cleanup, and the separation of visual and semantic navigation state remained intact.

---

#### Audit scope
- Reviewed removal of delegated pointer and focus listeners, separation of visual indicator selection from scrollspy state, initial URL-hash handling, click and keyboard activation, selector construction, animation scheduling, geometry remeasurement, and regression assertions.

#### Threats and attack surfaces reviewed
- User-controlled selector input, unsafe URL-hash use, event-listener leaks, stale interaction state, unintended pointer tracking, keyboard-accessibility regression, animation-trigger abuse, and inconsistent visual or semantic navigation state.

#### Findings and severity
- No security vulnerabilities identified. The URL hash is accepted only when it exactly matches a static navigation section identifier, and the indicator remains presentational and non-interactive.

#### Evidence
- The selected indicator reference is assigned from static navigation configuration on activation; initial hash input is allowlisted through `navItems.some`; pointerover, pointerout, focusin, and focusout listeners were removed; keyboard activation still invokes the anchor click handler; and `aria-current` remains driven by the independently validated scrollspy state.

#### Remediation performed or recommended
- Reduced the interaction surface by removing unnecessary pointer and focus event listeners and preserved strict allowlisting for initial hash-derived selection. No further security remediation is required.

#### Residual risk
- The visual underline may intentionally remain on the last activated link while scrollspy semantics identify another visible section. This is a deliberate interaction choice and does not affect navigation or authorization boundaries.

#### Verification performed
- Derived the final line ranges from Git, reviewed the listener removal and click-only assignment path, and ran ESLint and TypeScript successfully. The append-only log validator, production build, and test suite ran after this entry was appended.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #4 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.4] Change-log format migration audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 01:45:58 -0600 🤖 GPT-5.6 Sol - high
</p>

---

#### Files changed:
- `AGENTS.md`
  - Added: None
  - Modified: 5, 8
  - Deleted: None
- `scripts/validate-change-logs.mjs`
  - Added: 5, 8, 181-191, 231-232, 246-261, 309-323, 366-374
  - Modified: 4, 7, 161-164, 201-207, 228, 230, 285
  - Deleted: 319-323, 330-331

---

#### Description
- Audited the authorized change-log filename and format migration, including one-time migration handling, append-only enforcement, structured metadata parsing, exact range validation, and sensitive-content rejection.

---

#### Audit scope
- Reviewed the change-log filename migration, historical entry rewrite, metadata-table parsing, bordered-title validation, file-range parsing, append-only migration exception, sensitive-content scanning, staged-file reads, and repository instruction updates.

#### Threats and attack surfaces reviewed
- Append-only bypass, silent fallback to the legacy filename, fabricated model attribution, malformed metadata acceptance, log-entry truncation, unlogged source changes, secret disclosure, migration logic persisting beyond its intended one-time condition, and staged versus working-tree inconsistencies.

#### Findings and severity
- No security vulnerabilities identified. The migration exception is narrowly gated to a repository state where `CHANGES.md` has no base version and the committed legacy `CHANGE.md` exists; after this commit, normal prefix-based append-only enforcement applies to the new file.

#### Evidence
- The validator excludes both log filenames from recursive change noise, requires the legacy file to be absent from the current tree, validates the italicized preamble and every bordered historical entry, accepts only structured date-time and model table values, validates exact diff ranges in the newest migration entry, and retains credential-pattern rejection for both logs.

#### Remediation performed or recommended
- Updated all repository enforcement references to `CHANGES.md`, added format-specific parsing and full-history structural validation, retained `Unavailable` for unexposed historical model names, and constrained legacy migration handling to the pre-rename Git state. No further remediation is required.

#### Residual risk
- Markdown validators cannot prove the semantic truth of descriptions or model labels. Future model attribution still depends on the runtime exposing an exact model name; otherwise `Unavailable` remains mandatory.

#### Verification performed
- Confirmed repository references, derived line ranges from the actual diff, and ran ESLint and TypeScript successfully before appending this audit. The updated validator, staged hook, production build, and test suite ran after the final entries were present.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #5 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.5] Sensitive-file ignore coverage audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 01:54:29 -0600 🤖 GPT-5.6 Sol - high
</p>

---

#### Files changed:
- `.gitignore`
  - Added: 45-89
  - Modified: None
  - Deleted: None

---

#### Description
- Audited sensitive-file ignore coverage for the application’s deployment, package-management, email, local database, and credential workflows. Preventive gaps were addressed without excluding setup artifacts required by fresh clones.

---

#### Audit scope
- Reviewed repository ignore coverage for the current Next.js, Cloudflare Workers, npm, Resend, and local database workflows, including existing tracked and untracked filenames and representative secret-bearing paths.

#### Threats and attack surfaces reviewed
- Accidental commits of Cloudflare development secrets, package-registry tokens, authentication files, private keys, certificate stores, service-account credentials, local databases, journals, logs, exports, and backups containing credentials or booking data.

#### Findings and severity
- Medium preventive gap: `.dev.vars`, registry authentication files, key stores, credential JSON files, local databases, and generic sensitive logs or exports were not previously ignored. No currently present untracked sensitive file was identified by filename; `.env` was already protected and `.env.example` remains intentionally tracked.

#### Evidence
- `git check-ignore` confirmed the approved patterns were previously unprotected, while `.env*`, `*.pem`, `.wrangler/`, `.vercel`, and package-manager debug logs already had coverage. Repository filename inspection found no current `.dev.vars`, registry-auth file, private key, credential JSON, or local database outside ignored paths.

#### Remediation performed or recommended
- Added narrowly grouped ignore rules for the approved secret-bearing files and retained tracked setup artifacts, schemas, and migrations. Continue using sanitized example files for required local configuration and never place real credentials in examples.

#### Residual risk
- Ignore rules are preventive rather than a secret scanner, do not remove files already tracked, and cannot protect differently named credentials. Project-level `.npmrc` or `.yarnrc.yml` configuration would need a sanitized tracked alternative if private registries are introduced.

#### Verification performed
- Confirmed the staged `.gitignore` diff contained only lines 45-89, checked representative filenames against the updated rules, preserved the pre-existing final-newline change as unstaged work, and left the unrelated `Icon` deletion and `CHANGES.md` formatting edit untouched.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #6 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.6] Security audit log format migration
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 03:58:50 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `AGENTS.md`
  - Added: None
  - Modified: 8-9
  - Deleted: None
- `scripts/validate-change-logs.mjs`
  - Added: 188-196, 200-206, 213, 224-229, 279-281, 329-331, 377
  - Modified: 180-187, 212, 218, 223, 250, 252, 266-268, 270-271, 273-274, 276, 293, 317-320, 326-328, 347, 376
  - Deleted: 8, 231-232, 249-263, 313

---

#### Description
- Audited the full security-log format migration and the validator changes that enforce matching visual structure across both repository logs. Historical audit conclusions and evidence were retained while their presentation was normalized.

---

#### Audit scope
- Reviewed the rewritten security audit history, sequential `[S.n]` identifiers, styled title and metadata blocks, flattened file lists, required security sections, migration gating, append-only behavior, exact range validation, and repository instructions for future entries.

#### Threats and attack surfaces reviewed
- Historical audit truncation or semantic loss, entry renumbering, append-only bypass through format migration, malformed metadata acceptance, omitted audit fields, unlogged implementation files, inaccurate diff ranges, fabricated model attribution, and disclosure of credentials or unnecessary sensitive details in repository logs.

#### Findings and severity
- No security vulnerabilities identified. The migration preserves all five prior audits' scope, findings, evidence, remediation, residual-risk, and verification content. The validator applies normal append-only enforcement after the one-time conversion and requires sequential identifiers and all security-specific sections.

#### Evidence
- Compared the migrated entries with the previous `SECURITY_AUDITS.md` content, confirmed six sequential security markers, retained each historical file and range record, and derived the current implementation ranges from the staged Git diff. The current model is recorded as `Unavailable` because an exact runtime model name was not exposed.

#### Remediation performed or recommended
- Updated repository instructions and validation logic to make the shared format mandatory for future change and security entries. No application runtime or security boundary was changed. Continue running the staged validator in CI in addition to the local pre-commit hook because local hooks can be intentionally bypassed.

#### Residual risk
- Structural validation cannot prove that narrative audit conclusions are semantically complete or accurate. The authorized format-migration branch is intentionally limited to the committed legacy prefix and the new standard prefix; future content changes remain subject to append-only validation.

#### Verification performed
- Derived file ranges from the staged diff, ran ESLint and TypeScript successfully, and reviewed the migrated audit history for sequential numbering, required fields, sensitive-content exposure, and preserved meaning. Cached log validation, tests, and the production build run after both current entries are staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #7 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.7] Booking submission action audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:04:09 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/components/BookingForm.tsx`
  - Added: None
  - Modified: 429
  - Deleted: None
- `app/globals.css`
  - Added: 17-19, 48-50, 68-70, 87-89
  - Modified: 1157, 1159-1160, 1167, 1179-1180
  - Deleted: None
- `tests/rendered-html.test.mjs`
  - Added: 157-159
  - Modified: 64
  - Deleted: None

---

#### Description
- Audited the booking form submit-label and theme-aware color changes for behavioral, accessibility, and security regressions. The update is limited to presentation and user-facing status text; the trusted server-side submission boundary is unchanged.

---

#### Audit scope
- Reviewed the submit button’s label states, disabled state, spinner colors, theme token overrides, focus behavior, contrast against adjacent surfaces, rendered output assertion, and continued use of the existing form submission handler.

#### Threats and attack surfaces reviewed
- Accidental form-behavior changes, duplicate submission exposure, misleading loading state, loss of keyboard or focus visibility, insufficient text or component contrast, unsafe dynamic styling, and movement of validation or submission logic across the client-server trust boundary.

#### Findings and severity
- No security vulnerabilities identified. The button remains a native disabled-aware submit control, no user-controlled value reaches its styles or label, and no request validation, sanitization, anti-spam control, API route, or email behavior changed.

#### Evidence
- Source review confirmed that only the two static button labels and CSS presentation tokens changed. Calculated contrast ratios are 8.97:1 for white text on the light-theme cranberry button, 7.65:1 for pine text on the dark-theme gold button, 8.97:1 between the light button and white form surface, and 8.47:1 between the dark button and dark form surface.

#### Remediation performed or recommended
- Introduced explicit theme-aware background, hover, and foreground tokens and applied the foreground token to the loading spinner. No further security remediation is required for this visual change.

#### Residual risk
- Contrast can vary under browser color transformations or custom user styles, but native focus indication and forced-colors behavior remain available. Submission abuse controls retain their prior residual risks because this change does not alter them.

#### Verification performed
- Derived line ranges from the staged Git diff, ran ESLint and TypeScript successfully, rebuilt the production bundle, and passed all three rendered HTML and server-protection tests. Cached log validation and final diff checks run after this entry is staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #8 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.8] Navbar booking action spacing audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:06:50 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/globals.css`
  - Added: None
  - Modified: 397, 1327
  - Deleted: None
- `tests/rendered-html.test.mjs`
  - Added: 170
  - Modified: None
  - Deleted: None

---

#### Description
- Audited the navbar booking action’s reduced horizontal padding for interaction, accessibility, responsive, and security regressions. The change is limited to presentation and does not alter navigation targets or behavior.

---

#### Audit scope
- Reviewed the desktop and tablet CTA padding, minimum control height, mobile dropdown treatment, keyboard focus behavior, hover styling, rendered navigation structure, and the new regression assertion.

#### Threats and attack surfaces reviewed
- Reduced touch-target usability, clipped text, responsive overflow, focus-indicator loss, navigation-target changes, unsafe dynamic styling, and interaction regressions across desktop, tablet, and mobile layouts.

#### Findings and severity
- No security vulnerabilities identified. The CTA remains a static same-page anchor, the 46px minimum desktop height is preserved, and the mobile menu action remains full width with a 56px minimum height.

#### Evidence
- The source diff changes only two fixed CSS padding values and adds one static test assertion. No user input, URL construction, event handler, application state, API behavior, or trust boundary changed.

#### Remediation performed or recommended
- Preserved established minimum heights and all interaction states while reducing only horizontal whitespace. No additional security remediation is required.

#### Residual risk
- Extremely large user-selected text sizes may still increase the CTA width, but the navigation’s existing responsive breakpoint moves the action into the mobile menu before the desktop layout becomes constrained.

#### Verification performed
- Derived exact line ranges from the staged Git diff, ran ESLint and TypeScript successfully, completed the production build, and passed all three rendered HTML and server-protection tests. Cached log validation and final diff checks run after this entry is staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #9 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.9] Navbar typography audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:08:15 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/globals.css`
  - Added: None
  - Modified: 281-282, 313-314, 1397
  - Deleted: None
- `tests/rendered-html.test.mjs`
  - Added: 169-170
  - Modified: None
  - Deleted: None

---

#### Description
- Audited the increased navbar wordmark and navigation-link typography for responsive, accessibility, interaction, and security regressions. The update changes only fixed presentation values.

---

#### Audit scope
- Reviewed wordmark and navigation font sizes and weights, existing overflow handling, responsive breakpoints, mobile menu typography, focus states, touch-target dimensions, and typography regression assertions.

#### Threats and attack surfaces reviewed
- Text clipping, responsive overflow, control displacement, reduced touch-target usability, focus-indicator loss, hidden navigation actions, unsafe dynamic styling, and unintended navigation behavior changes.

#### Findings and severity
- No security vulnerabilities identified. All typography values are static, the wordmark retains overflow protection, navigation targets and handlers are unchanged, and control minimum heights remain intact.

#### Evidence
- The source diff modifies five fixed CSS declarations and adds two static test assertions. No user-controlled input, URL, event listener, application state, API route, validation rule, or trust boundary changed.

#### Remediation performed or recommended
- Increased typography within the current layout constraints and retained the existing tablet and mobile adaptations. No additional security remediation is required.

#### Residual risk
- User-selected extreme text scaling may eventually require the existing mobile navigation breakpoint, but text remains eligible for browser scaling and the navbar continues to constrain and truncate the wordmark when necessary.

#### Verification performed
- Derived exact line ranges from the staged Git diff, ran ESLint and TypeScript successfully, completed the production build, and passed all three rendered HTML and server-protection tests. Cached log validation and final diff checks run after this entry is staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #10 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.10] Light-theme navbar contrast audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:09:57 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/globals.css`
  - Added: 20-21, 53-54, 75-76, 96-97
  - Modified: 247, 1379
  - Deleted: None
- `tests/rendered-html.test.mjs`
  - Added: 162-165
  - Modified: None
  - Deleted: None

---

#### Description
- Audited the theme-aware navbar background change for contrast, responsive consistency, unsafe style inputs, and navigation regressions. The change is limited to static color tokens and their use by existing navigation surfaces.

---

#### Audit scope
- Reviewed light, system-dark, explicit-dark, and explicit-light theme token resolution; desktop navbar and mobile dropdown backgrounds; text contrast; existing focus states; and theme regression assertions.

#### Threats and attack surfaces reviewed
- Insufficient text contrast, inconsistent explicit and system themes, unreadable mobile navigation, hidden focus indicators, unsafe user-controlled CSS values, and unintended changes to navigation links, event handling, or destinations.

#### Findings and severity
- No security vulnerabilities identified. All color values are static CSS tokens, theme selection remains constrained to the existing light and dark states, and no navigation behavior or trust boundary changed.

#### Evidence
- White navigation text has a calculated 7.3:1 contrast ratio against the new light-theme evergreen surface. The source diff replaces two hardcoded backgrounds with fixed theme tokens and adds assertions for both light and dark values and their consumers.

#### Remediation performed or recommended
- Kept the light green sufficiently dark to maintain WCAG AA contrast and retained the original dark-theme surfaces. No additional security remediation is required.

#### Residual risk
- Backdrop content can subtly influence translucent color rendering, but the 96% and 98% surface opacity keeps that effect small and the base contrast leaves substantial margin above the required threshold.

#### Verification performed
- Derived exact line ranges from the staged Git diff, ran ESLint and TypeScript successfully, completed the production build, and passed all three rendered HTML and server-protection tests. Cached log validation and final diff checks run after this entry is staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #11 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.11] Light-theme submit button contrast audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:14:33 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/globals.css`
  - Added: None
  - Modified: 17-19, 93-95
  - Deleted: None
- `tests/rendered-html.test.mjs`
  - Added: 158
  - Modified: 157
  - Deleted: None

---

#### Description
- Audited the light-theme submit-button color change for text and component contrast, state consistency, unsafe style inputs, and booking submission regressions. The change is limited to fixed design-token values and test coverage.

---

#### Audit scope
- Reviewed default and hover colors, label and spinner foregrounds, explicit and default light-theme token resolution, unchanged dark-theme values, focus and disabled states, and regression assertions.

#### Threats and attack surfaces reviewed
- Insufficient text contrast, indistinguishable control boundaries, unreadable loading indicators, inconsistent theme state, hidden focus treatment, unsafe user-controlled CSS values, and accidental changes to submission, validation, or anti-spam behavior.

#### Findings and severity
- No security vulnerabilities identified. The values are static CSS tokens, all form behavior remains unchanged, and no user input, request processing, validation, API route, credential, or trust boundary was modified.

#### Evidence
- Calculated contrast is approximately 4.87:1 for dark pine text on the default amber-yellow button and 3.03:1 between that button and the white form surface. The hover state retains approximately 4.67:1 text contrast and 3.16:1 surface contrast.

#### Remediation performed or recommended
- Selected a deeper amber-yellow instead of the lower-contrast pale dark-theme gold and retained dark pine for the label and spinner. No additional security remediation is required.

#### Residual risk
- Browser color transformations and custom user styles can alter perceived color, but existing focus indication and forced-colors behavior remain available.

#### Verification performed
- Derived exact line ranges from the staged Git diff, ran ESLint and TypeScript successfully, completed the production build, and passed all three rendered HTML and server-protection tests. Cached log validation and final diff checks run after this entry is staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #12 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.12] Light-theme navbar surface audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:17:40 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/globals.css`
  - Added: 22-28, 62-68, 91-97, 119-125
  - Modified: 20-21, 117-118, 273, 276, 278, 299, 301-302, 325, 348, 357, 368, 403, 405-406, 413-414, 431-432, 441, 1405, 1451-1452, 1460-1461, 1467-1468
  - Deleted: None
- `tests/rendered-html.test.mjs`
  - Added: 166-167
  - Modified: 163, 165
  - Deleted: None

---

#### Description
- Audited the expanded light-theme navbar tokenization for contrast, responsive consistency, forced-colors compatibility, unsafe style inputs, and navigation regressions. The update remains confined to static CSS presentation and test coverage.

---

#### Audit scope
- Reviewed default light, explicit light, system dark, and explicit dark token resolution; navbar and dropdown surfaces; link, wordmark, icon, indicator, and CTA colors; borders and shadows over white; hover and focus states; responsive behavior; and regression assertions.

#### Threats and attack surfaces reviewed
- Insufficient foreground contrast, indistinguishable navigation boundaries on white content, inaccessible active or hover states, inconsistent theme inheritance, unreadable mobile menus, hidden focus indicators, unsafe dynamic CSS input, and changes to navigation destinations or event handling.

#### Findings and severity
- No security vulnerabilities identified. All tokens contain static values, existing theme selection remains constrained, and no navigation markup, state, URL, event handler, user input, API behavior, or trust boundary changed.

#### Evidence
- The pale light surface is paired with dark green foregrounds and a darker green edge and shadow. The filled light-theme booking CTA uses white on `#245b4b`, providing strong text contrast, while dark mode retains the previously tested palette. Source review confirmed all affected selectors consume fixed theme tokens.

#### Remediation performed or recommended
- Tokenized every navbar color that previously assumed a dark background, preventing low-contrast white text or controls on the new pale surface. No additional security remediation is required.

#### Residual risk
- Translucency allows minimal backdrop influence, but the 96% and 98.5% opacity, defined edge, and shadow keep the navigation distinguishable over light content. Custom user styles can still alter presentation, with forced-colors behavior retained as the accessibility fallback.

#### Verification performed
- Derived exact line ranges from the staged Git diff, ran ESLint and TypeScript successfully, completed the production build, and passed all three rendered HTML and server-protection tests. Cached log validation and final diff checks run after this entry is staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #13 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.13] Unified booking action color audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:20:00 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/globals.css`
  - Added: None
  - Modified: 419-420, 429, 568-569, 573, 1448-1449, 1455-1456
  - Deleted: 25-27, 65-67, 94-96, 122-124
- `tests/rendered-html.test.mjs`
  - Added: 161-164
  - Modified: None
  - Deleted: None

---

#### Description
- Audited the consolidation of navbar and hero booking actions onto the submit button’s shared color tokens for contrast, theme consistency, unsafe style inputs, and navigation regressions. The change affects static presentation only.

---

#### Audit scope
- Reviewed desktop and mobile navbar CTAs, the hero primary CTA, shared submit tokens across light and dark themes, hover states, foreground contrast, removed duplicate tokens, unchanged destinations, and regression assertions.

#### Threats and attack surfaces reviewed
- Inconsistent theme resolution, insufficient label contrast, unreadable hover states, hidden focus indicators, stale color-token references, unsafe dynamic CSS input, changed booking destinations, and accidental modification of form submission or navigation behavior.

#### Findings and severity
- No security vulnerabilities identified. All affected controls remain static same-page anchors, all style values come from fixed theme tokens, and no form submission, input validation, API route, credential, event handler, or trust boundary changed.

#### Evidence
- Source review confirms `.nav-cta`, `.button-primary`, and `.nav-mobile-cta` consume `--submit-bg`, `--submit-bg-hover`, and `--submit-ink`. The redundant `--nav-cta-*` variables were removed and regression tests reject their reintroduction.

#### Remediation performed or recommended
- Consolidated conversion-action colors into one existing theme-aware token set to reduce visual drift and inconsistent state handling. No additional security remediation is required.

#### Residual risk
- The hero image may alter perceived surrounding contrast, but the yellow button itself and dark foreground retain the previously audited contrast values. Forced-colors behavior remains available.

#### Verification performed
- Derived exact line ranges from the staged Git diff, ran ESLint and TypeScript successfully, completed the production build, and passed all three rendered HTML and server-protection tests. Cached log validation and final diff checks run after this entry is staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #14 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.14] Booking section theme audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:24:57 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/globals.css`
  - Added: 26-42, 80-96, 123-139, 165-181, 948-951
  - Modified: 867-868, 885, 889, 894, 906, 920, 927, 929-930, 957, 971-972, 978, 987, 994, 1019, 1025, 1029, 1040, 1042-1043, 1067, 1074, 1081, 1083, 1090, 1094, 1103, 1162, 1164, 1199, 1206, 1210, 1218, 1234, 1241
  - Deleted: None
- `tests/rendered-html.test.mjs`
  - Added: 173-178
  - Modified: None
  - Deleted: None

---

#### Description
- Audited the booking section’s theme inversion and dedicated form palette for contrast, validation visibility, theme consistency, unsafe style inputs, and booking-flow regressions. The change is confined to static CSS presentation and regression coverage.

---

#### Audit scope
- Reviewed default light, explicit light, system dark, and explicit dark booking tokens; section and form surfaces; booking copy; labels and helper text; fields and dropdown options; error, success, focus, and disabled states; responsive layouts; and unchanged submission behavior.

#### Threats and attack surfaces reviewed
- Insufficient text or component contrast, invisible required and validation states, unreadable fields or dropdown options, inconsistent theme inheritance, hidden focus indicators, unsafe user-controlled CSS values, and accidental changes to form state, validation, anti-spam controls, API requests, or email submission.

#### Findings and severity
- No security vulnerabilities identified. Every new value is a static CSS token, all booking data and submission code remain unchanged, and no input handling, validation rule, request boundary, credential, API route, or email behavior was modified.

#### Evidence
- Dark booking background uses the same `#0c1713` canvas as the dark services area. The light form’s `#245b4b` surface provides strong contrast with its light foreground, while white-based fields retain dark text and defined borders. Error, success, focus, and accent colors are explicitly scoped to the form surface rather than inherited from the page theme.

#### Remediation performed or recommended
- Rethemed the complete booking surface hierarchy instead of changing backgrounds alone, preventing low-contrast labels, fields, helper text, dropdowns, and validation states. No additional security remediation is required.

#### Residual risk
- Native select and date-control rendering can vary by browser, but explicit background, foreground, border, and color-scheme support remain in place. Forced-colors mode continues to provide a system-controlled accessibility fallback.

#### Verification performed
- Derived exact line ranges from the staged Git diff, ran ESLint and TypeScript successfully, completed the production build, and passed all three rendered HTML and server-protection tests. Cached log validation and final diff checks run after this entry is staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #15 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.15] Unified light-surface audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:29:05 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/globals.css`
  - Added: 6, 44-53, 108-117, 161-170, 177, 214-223, 870-873, 934-937
  - Modified: 5, 21-22, 31-34, 39-42, 176, 191-192, 201-204, 209-212, 848-849, 864, 869, 879, 888, 893, 900, 908, 1336-1338, 1357, 1366, 1368, 1374
  - Deleted: None
- `tests/rendered-html.test.mjs`
  - Added: 168, 180-181
  - Modified: 167, 176
  - Deleted: None

---

#### Description
- Audited the consolidation of all light-mode green surfaces onto one pale-green token for contrast, theme isolation, validation visibility, unsafe style inputs, and cross-section regressions. The change remains within static CSS presentation and test coverage.

---

#### Audit scope
- Reviewed default and explicit light themes, system and explicit dark themes, canvas, navbar, mobile menu, Approach section, booking form, footer, foreground and muted text, dividers, accents, focus and validation states, and regression assertions.

#### Threats and attack surfaces reviewed
- Low-contrast text after surface inversion, indistinguishable section boundaries, unreadable form validation, inconsistent dark-theme overrides, hidden focus states, unsafe dynamic CSS input, and accidental changes to navigation, form state, request validation, API behavior, or email submission.

#### Findings and severity
- No security vulnerabilities identified. All affected values are static design tokens, dark overrides remain explicit, and no markup, user input, event handler, validation logic, request path, credential, or trust boundary was modified.

#### Evidence
- Source review confirms the light canvas, navbar, mobile menu, Approach section, booking form, and footer all resolve from `--green-surface: #eff7f2`. Their text and state colors use dedicated dark-on-light tokens, while dark-mode selectors retain the previous deep surfaces and light foregrounds.

#### Remediation performed or recommended
- Added separate Approach and footer theme tokens and updated booking-form foreground and state tokens so no component retains light text intended for a dark green surface. No additional security remediation is required.

#### Residual risk
- Adjacent pale-green sections may have subtle boundaries by design, but white section bands, dividers, borders, and spacing preserve hierarchy. Forced-colors mode remains the system accessibility fallback.

#### Verification performed
- Derived exact line ranges from the staged Git diff, ran ESLint and TypeScript successfully, completed the production build, and passed all three rendered HTML and server-protection tests. Cached log validation and final diff checks run after this entry is staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #16 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.16] System theme synchronization audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:35:05 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/components/SystemThemeIndicator.tsx`
  - Added: 1-36
  - Modified: None
  - Deleted: None
- `app/components/ThemeToggle.tsx`
  - Added: None
  - Modified: None
  - Deleted: 1-54
- `app/globals.css`
  - Added: 1275-1278, 1280-1304
  - Modified: 70, 1274, 1618
  - Deleted: 123-225
- `app/page.tsx`
  - Added: None
  - Modified: 3, 179
  - Deleted: None
- `tests/rendered-html.test.mjs`
  - Added: 119, 212
  - Modified: 52, 69, 73, 84-85, 115-118, 166-167, 211, 215-216
  - Deleted: None

---

#### Description
- Audited the system-driven theme refactor for unsafe persistence, DOM mutation, hydration inconsistencies, accessibility regressions, information exposure, and unintended changes to application trust boundaries. The implementation now relies on browser-native media-query evaluation and static presentation only.

---

#### Audit scope
- Reviewed theme source-of-truth selection, operating-system preference changes, initial rendering, CSS cascade order, browser color-scheme metadata, footer semantics, responsive positioning, reduced client execution, and regression coverage.

#### Threats and attack surfaces reviewed
- Untrusted values written to root element attributes, browser-storage abuse, stale preference persistence, flash-of-incorrect-theme behavior, hydration mismatch, misleading interactive controls, inaccessible icon semantics, unsafe dynamic styling, and accidental changes to booking, navigation, API, validation, or email behavior.

#### Findings and severity
- No security vulnerabilities identified. Theme selection no longer reads or writes storage or mutable DOM theme attributes, and the replacement indicator is static server-rendered markup with a fixed accessible label. No user-controlled content, credentials, request handling, or trust boundary was added or modified.

#### Evidence
- Source review confirms the dark palette is activated only by `@media (prefers-color-scheme: dark)` and that no `data-theme`, `localStorage`, click handler, client hook, or media-query JavaScript remains in the theme component. Both indicator icons are decorative children of one labelled status element and CSS controls their visibility.

#### Remediation performed or recommended
- Removed the manual override and duplicate explicit-theme selectors that could desynchronize the website from the operating system. Replaced the former button with a non-interactive indicator so the interface does not imply an unsupported action. No further security remediation is required.

#### Residual risk
- Operating-system preference propagation timing is controlled by the browser and platform. Browsers without `prefers-color-scheme` support receive the accessible light default; supported browsers apply and update the dark palette natively.

#### Verification performed
- Derived exact line ranges from the staged Git diff, ran ESLint and TypeScript successfully, completed the production build, and passed all three rendered HTML and server-protection tests. Cached log validation and final diff checks run after this entry is staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #17 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.17] Restored light-surface palette audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:39:05 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/globals.css`
  - Added: None
  - Modified: 6, 31-34, 39-42, 44-53
  - Deleted: None
- `tests/rendered-html.test.mjs`
  - Added: 169, 179, 183, 185
  - Modified: 178
  - Deleted: None

---

#### Description
- Audited restoration of the original light-mode page, Approach, booking-form, and footer surfaces for contrast, validation-state visibility, theme isolation, unsafe styling, and regressions to automatic system-theme behavior. The change is limited to static CSS tokens and regression assertions.

---

#### Audit scope
- Reviewed light canvas, navbar separation, Approach surface and typography, booking form labels, fields and state colors, footer text and indicator contrast, dark media-query overrides, system-theme synchronization, and test coverage.

#### Threats and attack surfaces reviewed
- Low-contrast foregrounds after darkening surfaces, unreadable helper or validation text, hidden focus states, indistinguishable navigation and content boundaries, stale token references, unsafe dynamic CSS values, and accidental changes to theme selection, booking submission, navigation, API validation, or email behavior.

#### Findings and severity
- No security vulnerabilities identified. Restored values are fixed CSS tokens from the previously verified palette, all associated foreground and state colors were restored together, and no user input, event handling, storage, request path, credential, or trust boundary changed.

#### Evidence
- Source review confirms the light canvas is `#eef2ef`, Approach is `#102d25` with light text, the booking form is `#245b4b` with light labels and explicit state colors, and the footer is `#091713` with light text. The navbar remains on its separate pale-green token and dark mode remains governed by `prefers-color-scheme`.

#### Remediation performed or recommended
- Restored complete surface-specific token groups instead of backgrounds alone, preventing mismatched foreground, divider, focus, error, and success colors. No additional security remediation is required.

#### Residual risk
- The Approach section and footer intentionally use dark surfaces in light mode, producing strong transitions between sections. Existing spacing, borders, and high-contrast foregrounds preserve hierarchy and readability.

#### Verification performed
- Derived exact line ranges from the staged Git diff, ran ESLint and TypeScript successfully, completed the production build, and passed all three rendered HTML and server-protection tests. Cached log validation and final diff checks run after this entry is staged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  SECURITY AUDIT #18 -->
<!--! ~=~=~=~=~=~ -->
<!-- security audit title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [S.18] Route-aware navigation state audit
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:46:15 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `app/components/SiteHeader.tsx`
  - Added: 69-72, 76, 199-206, 231-238, 246-252
  - Modified: 60, 67-68, 75, 137-138, 159, 198, 230, 245
  - Deleted: 19, 211, 213
- `app/globals.css`
  - Added: 24, 422, 437-459
  - Modified: 344, 364
  - Deleted: None
- `tests/rendered-html.test.mjs`
  - Added: 100-102, 114-115, 176, 207-209
  - Modified: 98-99
  - Deleted: None

---

#### Description
- Audited the route-aware navbar refactor for unsafe destination handling, accessibility-state regressions, hidden focus behavior, animation abuse, responsive inconsistencies, stale state, event-listener leaks, and changes to application trust boundaries.

---

#### Audit scope
- Reviewed active-section calculation, hash and scroll synchronization, Home and Booking transitions, desktop and mobile CTA variants, `aria-current` semantics, indicator scheduling, resize and font observers, menu closing, outside-click and Escape handling, responsive selectors, reduced motion, and compiled CSS output.

#### Threats and attack surfaces reviewed
- Untrusted selector construction, URL or navigation-target injection, stale active state, misleading accessibility state, persistent decorative indicators on Home, keyboard focus loss, animation-induced layout shifts, responsive clipping, duplicated state, event-listener leaks, and accidental changes to booking submission or server-side controls.

#### Findings and severity
- No security vulnerabilities identified. Destination identifiers remain fixed application constants, selectors do not include user input, links remain static same-document anchors, and the change does not modify booking data, validation, API requests, credentials, storage, or authorization boundaries.

#### Evidence
- Source review confirms one active-section reference drives the animated navigation indicator and both CTA `aria-current` attributes. The Home and Booking identifiers have no moving-indicator target, which hides the shared link indicator, while fixed CSS selectors activate CTA underlines only for `aria-current="location"`. Existing observer and global-event cleanup remains unchanged.

#### Remediation performed or recommended
- Removed the separate clicked-indicator state that could diverge from route activity and reused a single fixed color token and shared CTA selectors. Added regression assertions for Home clearing, both Booking variants, the shared underline color, and active transforms. No additional security remediation is required.

#### Residual risk
- Runtime scroll activation depends on browser geometry and the existing activation line. Source, rendered output, compiled CSS, linting, type checking, build, and automated tests passed; a fresh live desktop/mobile stylesheet pass could not be completed because the local preview restart approval was unavailable.

#### Verification performed
- Ran ESLint and TypeScript successfully, completed the production build, passed all three rendered HTML and server-protection tests, verified the compiled production CSS contains both CTA underline selectors and active-state rules, and derived exact ranges from the working Git diff. Live browser state confirmed shared `aria-current` updates before the stale preview stylesheet was detected; fresh desktop/mobile visual verification remains blocked by the unavailable local-server approval.
