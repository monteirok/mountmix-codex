<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #1 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.1] Enforce repository change and security audit logging
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
- Added repository-wide, append-only change and security-audit governance. Codex instructions now require diff-derived logging and a security review for every task; a tracked pre-commit hook validates staged work; package scripts install the hook and run validation in the normal test path; and the validator checks append-only history, required metadata, exact added/modified/deleted ranges, binary-file reporting, security-audit fields, complete diff coverage, and common credential patterns. Existing application behavior and runtime dependencies are unchanged.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #2 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.2] Stabilize navigation underline transitions
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
- Replaced per-link active pseudo-elements with one persistent navigation indicator so underline state is retained while moving between Services and Approach. Pointer, keyboard-focus, active-section, hash, resize, responsive-breakpoint, and font-loading changes now update transform and opacity variables through requestAnimationFrame and ResizeObserver without changing layout. Scroll-driven section updates are deduplicated before React state is dispatched, reducing unnecessary renders. Desktop horizontal and mobile vertical treatments, current navigation behavior, focus visibility, forced-colour handling, and reduced-motion behavior are preserved.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #3 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.3] Restrict underline movement to navigation activation
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
- Removed hover and focus events as navigation-indicator positioning inputs and introduced a dedicated selected-indicator reference. Clicking or keyboard-activating a navigation link now changes and animates the underline target; passive pointer movement, focus movement, and scrollspy updates do not move it. Initial hash placement, resizing, responsive changes, and font remeasurement remain immediate so they cannot produce an unintended transition. Existing keyboard focus outlines and scroll-driven `aria-current` semantics are preserved.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #4 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.4] Rename and reformat the change log
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
- Renamed `CHANGE.md` to `CHANGES.md` and reformatted every historical entry with a consistent bordered title, combined date-and-time metadata table, flattened file list, and dedicated description section. The introductory policy text is now italicized. Repository instructions and automated validation now target the new filename and syntax, validate all historical entry structures, preserve secret scanning, and support this authorized one-time migration from the legacy filename without weakening append-only enforcement for future entries. Model values remain `GPT-5.6 Sol - high` where the exact historical model was not exposed, avoiding fabricated attribution.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #5 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.5] Expand sensitive-file ignore coverage
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
- Added the approved ignore rules for Cloudflare development secrets, package-manager authentication, authentication files, private keys and certificate stores, service credential JSON, local databases and journals, and potentially sensitive logs or exports. Existing environment, build-output, and final `/work/` rules remain intact. The pre-existing missing final newline is preserved separately as unstaged work rather than being attributed to this change.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #6 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.6] Standardize change and security audit log formatting
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 03:58:50 -0600 🤖 GPT-5.6 Sol - high
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
- Adopted the current `CHANGES.md` numbered, styled entry structure as the repository standard and migrated the complete security audit history to the corresponding `[S.n]` format. Repository instructions now require both logs to use matching visual structure, while retaining the security-specific review sections. The validator now parses sequential change and security markers, validates the shared title, metadata, file-list, and description structure, supports this explicitly authorized one-time format migration, preserves append-only enforcement afterward, and continues to verify exact diff coverage and reject sensitive log content.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #7 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.7] Improve booking form submission action
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:04:09 -0600 🤖 GPT-5.6 Sol - high
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
- Renamed the booking form action from “Send booking inquiry” to “Submit” and changed its in-progress label to “Submitting.” Added theme-aware submit-button tokens so the action uses deep cranberry with white text in light mode and gold with dark pine text in dark mode, creating strong separation from the surrounding form surface in both themes. Existing dimensions, focus treatment, hover motion, disabled behavior, spinner, validation, and submission logic are unchanged. Regression assertions now cover the rendered label and theme-specific action styling.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #8 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.8] Tighten navbar booking action spacing
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:06:50 -0600 🤖 GPT-5.6 Sol - high
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
- Reduced the desktop “Book Event” navbar button’s horizontal padding from 20px to 16px and its intermediate tablet padding from 15px to 13px. The existing height, typography, focus treatment, hover behavior, and full-width mobile dropdown action remain unchanged. Added a regression assertion for the compact desktop padding.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #9 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.9] Increase navbar typography
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 04:08:15 -0600 🤖 GPT-5.6 Sol - high
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
- Increased the Mountain Mixology navbar wordmark from 1rem at weight 600 to 1.125rem at weight 700. Increased desktop navigation links from 0.84rem at weight 650 to 0.92rem at weight 700, and raised mobile dropdown links from 0.95rem to 1rem. Existing navbar dimensions, spacing, interaction states, and responsive breakpoints remain unchanged. Added regression assertions for the wordmark and desktop navigation typography.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #10 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.10] Lighten the light-theme navbar
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
- Added theme-aware navigation surface tokens so light mode uses a lighter evergreen navbar and mobile dropdown while dark mode retains the existing near-black green treatment. The light surface uses `rgba(36, 91, 75, 0.96)` for the navbar and a slightly more opaque equivalent for the dropdown. Existing text, borders, shadows, controls, interaction states, and responsive behavior remain unchanged. Regression assertions cover both theme values and their application to the navigation surfaces.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #11 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.11] Use a yellow light-theme submit button
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
- Changed the light-theme booking form submit button from cranberry to an accessible amber-yellow with dark pine text. The default `#c18a24` background and `#bd8723` hover state preserve visible separation from the white form surface while maintaining readable label and spinner contrast. Dark mode retains its existing lighter gold treatment. Submission logic, loading behavior, disabled state, focus treatment, dimensions, and animation are unchanged. Updated regression assertions cover the new light-theme colors.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #12 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.12] Refine the light-theme navbar surface
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
- Reworked the light-theme navbar into a pale green-white glass surface with dark green typography, a stronger green edge, and a green-tinted shadow so it remains distinct over white page content. Added reusable theme tokens for navigation foregrounds, borders, accents, CTA colors, and elevation; applied them consistently to the wordmark, links, active indicator, icon controls, desktop booking CTA, mobile dropdown, and mobile CTA. Dark mode retains its existing deep green, light text, gold accent, and light CTA treatment. Navigation structure, dimensions, behavior, accessibility, and responsive breakpoints are unchanged. Regression assertions cover the light and dark surfaces and token application.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #13 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.13] Unify booking action colors
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
- Unified the desktop and mobile navbar “Book Event” buttons and the hero “Start an inquiry” button with the booking form submit button’s shared yellow background, hover, and foreground tokens. Removed the redundant navbar-specific CTA color tokens so these conversion actions cannot drift apart across light, dark, or system themes. Existing button dimensions, typography, placement, focus states, hover motion, links, and responsive behavior remain unchanged. The footer “Booking inquiry” remains a plain text link. Regression assertions verify all three button selectors use the shared tokens and that legacy CTA tokens are absent.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #14 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.14] Retheme the booking section and form
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
- Introduced a complete theme-aware booking palette. Dark mode now places the booking section on the same `#0c1713` canvas inherited by the services section and keeps the form on its existing elevated dark-green surface. Light mode now uses a white booking-section background with a `#245b4b` green form, light labels and helper text, white-based fields, gold accents, and high-visibility validation and focus colors. Booking copy, dividers, email link, form header, alerts, legends, required markers, inputs, placeholders, dropdown options, metadata, and footer text now consume dedicated booking tokens. Form layout, state management, validation, submission, responsive behavior, and accessibility semantics are unchanged. Regression assertions cover both section surfaces, the green form, and field token application.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #15 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.15] Unify light-mode green surfaces
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
- Added a shared `#eff7f2` light-green surface token and applied it to every green-backed light-mode area: the services canvas, desktop and mobile navbar, Approach section, booking form, and footer. Added theme-aware Approach and footer foreground, muted, divider, and accent tokens, and changed the light booking form back to dark text and light-theme validation colors on the shared pale surface. Dark mode preserves the existing deep-green Approach section, dark booking form, footer, navbar, and canvas. Existing layouts, content, navigation, form behavior, responsive behavior, and accessibility semantics are unchanged. Regression assertions verify the shared token and its section consumers.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #16 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.16] Follow the system color scheme automatically
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
- Made `prefers-color-scheme` the sole authority for light and dark presentation. Removed explicit `data-theme` palettes and the client-side manual override that prevented later operating-system changes from reaching the website. Replaced the footer toggle with an accessible, non-interactive system-theme indicator whose sun and moon icons switch through the same media query without hydration flicker or JavaScript state. Existing light and dark color tokens, native control color-scheme support, responsive footer alignment, and browser theme-color metadata are preserved. Regression assertions verify automatic media-query theming and prevent storage, dataset, or click-based theme overrides from returning.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #17 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.17] Restore original light-mode green surfaces
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
- Restored the original section-specific light-mode surfaces that preceded the shared pale-green treatment: the page canvas returns to `#eef2ef`, the Approach section to deep pine `#102d25`, the booking form to `#245b4b`, and the footer to `#091713`. Restored the corresponding light foreground, muted, divider, accent, focus, validation, and success tokens so contrast remains consistent on those darker surfaces. The navbar and mobile menu retain their current `#eff7f2` pale-green background, and automatic operating-system theme synchronization remains unchanged. Regression assertions now lock the restored light palette and its section consumers.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #18 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.18] Make navigation underlines route-aware
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
- Consolidated navigation activity and indicator positioning onto the existing active-section state so Home, Services, Approach, and Booking resolve consistently from clicks, hashes, and scroll position. Home now removes every active underline, while Booking applies `aria-current="location"` and an animated underline to both desktop and mobile “Book Event” variants. Services and Approach retain the shared transform-based indicator without hover-driven movement. Added one `--nav-link-text` token shared by link text and all underline treatments, plus shared CTA pseudo-element styles for desktop and dropdown variants. Existing menu closing, focus handling, resize and font remeasurement, reduced motion, responsive layout, and keyboard semantics remain intact.

---

<div style="margin-bottom:1rem;color:white;">.</div>

---
<!--! ~=~=~=~=~=~ -->
<!--!  CHANGE #19 -->
<!--! ~=~=~=~=~=~ -->
<!-- change title -->
<div style="width:fit-content;margin-bottom:.5rem;padding:.5rem 1rem;background:#ff000010;border:3px solid #ff000040;border-radius:20px;font-size:1.8rem;font-weight:800;color:red;line-height:2.5rem;">
  [C.19] Fix Vercel deployment build output
</div>
<!-- date & time / model -->
<p style="width:fit-content;margin-top:.6rem;margin-left:.8rem;padding:.1rem .5rem;background:#00000010;border:1px solid #00000010;border-radius:100px;font-size:1.05rem;font-weight:500;font-style:italic;">
  📅 2026-08-08 05:33:27 -0600 🤖 Unavailable
</p>

---

#### Files changed:
- `vercel.json`
  - Added: 1-5
  - Modified: None
  - Deleted: None

---

#### Description
- Added Vercel project settings so deployments run `next build` instead of the repository’s default `vinext build`. Vercel expects a Next.js `.next` output directory, while vinext targets Cloudflare Workers and leaves that directory absent. Local vinext development, Cloudflare builds, and existing tests remain unchanged.

---

<div style="margin-bottom:1rem;color:white;">.</div>
