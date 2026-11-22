# SENTINEL.AI — Login Screen Design Specification

**Document type:** UI design and implementation specification  
**Reference:** User-provided Sentinel.AI login-screen image  
**Reference image dimensions:** 1672 × 941 px  
**Target surface:** Desktop web authentication screen  
**Product descriptor shown:** `THREAT OPERATIONS`  
**Version label shown:** `v1.2 Enterprise`

---

## 1. Design intent

The screen is an enterprise security-operations login experience. It should communicate that Sentinel.AI is a serious, controlled SOC (Security Operations Center) product without looking like a conventional dark cybersecurity dashboard.

The reference uses a **warm ivory, pale blush, and muted bronze palette**. The overall impression is calm, premium, deliberate, and operational. It deliberately avoids the familiar black-background/neon-green “hacker terminal” aesthetic.

The composition has three visual zones:

1. **Brand and value proposition on the left** — the strongest typographic area and primary attention anchor.
2. **Threat-response process illustration in the center** — a visual explanation of the product workflow, connecting detection to verified resolution.
3. **Authentication panel on the right** — a contained, glass-like form surface that remains prominent but does not overpower the left-side message.

The page should feel like one continuous canvas. Avoid turning these zones into three unrelated cards or adding extra dashboard widgets.

### Design priorities

- Keep the left-side headline as the primary focal point.
- Preserve the generous negative space around the headline and process illustration.
- Keep the login panel visually quieter than the headline while retaining clear form usability.
- Use bronze sparingly for emphasis, icons, and primary actions.
- Maintain strong text contrast; pale surfaces must not result in low-contrast form labels or placeholder text.
- Do not introduce extra copy, decorative charts, navigation, or unrelated controls.

---

## 2. Reference canvas and coordinate system

The supplied image is **1672 × 941 px**. The following coordinates are approximate measurements read from the reference image, not source-design tokens. They are useful as a desktop reconstruction guide.

Use a 12-column or flexible three-zone layout rather than absolutely positioning every element. The approximate bounding boxes below describe the reference composition.

| Element | Approx. x | Approx. y | Approx. width | Approx. height |
|---|---:|---:|---:|---:|
| Brand lockup | 112 | 70 | 330 | 60 |
| SOC status pill | 1332 | 72 | 230 | 43 |
| Left headline block | 108 | 203 | 620 | 185 |
| Process illustration region | 635 | 248 | 385 | 540 |
| Login panel | 1068 | 201 | 480 | 536 |
| Left feature list | 113 | 497 | 470 | 255 |
| Bottom telemetry/version row | 72 | 856 | 390 | 28 |

**Important:** The coordinates above are visual estimates from the raster reference. They are not guaranteed CSS measurements. Build the layout proportionally and validate it at the reference aspect ratio.

### Desktop composition

At approximately 1672 × 941:

- Use a full-viewport page with a minimum height of `100vh`.
- Keep the main content inside a centered container with roughly 6–7% horizontal outer margins.
- The brand lockup sits near the upper-left corner.
- The SOC status pill sits near the upper-right corner.
- Main content begins around 21–22% down the viewport.
- The headline occupies the left third to slightly under half of the canvas.
- The process illustration occupies the central gap between headline and login panel.
- The login panel is vertically centered around the upper-middle of the viewport, not pinned to the very top.
- The telemetry/version row sits close to the lower-left edge with a comfortable bottom inset.

### Suggested layout model

Use CSS Grid for the main content:

- Left content: approximately `42%`
- Process illustration: approximately `28%`
- Authentication panel: approximately `30%`

Treat these as flexible proportions, not fixed widths. A practical desktop grid can use `minmax(0, 1.25fr) minmax(280px, 0.95fr) minmax(400px, 0.95fr)` with controlled gaps. At narrower desktop widths, allow the center illustration to contract before the login panel becomes unusably narrow.

---

## 3. Visual system

### 3.1 Color palette

The reference image is a raster with subtle gradients, transparency, and antialiasing. The values below are **recommended starting tokens sampled/estimated visually**, not verified original brand values. Tune them against the supplied image during implementation.

| Token | Suggested value | Intended use |
|---|---|---|
| `--page-bg` | `#F7F0EC` | Main warm ivory/blush canvas |
| `--page-bg-light` | `#FBF6F2` | Lighter central background glow |
| `--surface` | `rgba(255, 250, 246, 0.54)` | Login panel and soft surfaces |
| `--surface-strong` | `#F1E5DE` | Icon tiles and secondary surfaces |
| `--surface-border` | `rgba(255, 255, 255, 0.82)` | Fine light panel outline |
| `--line-subtle` | `rgba(112, 76, 54, 0.12)` | Dividers and field outlines |
| `--ink` | `#202020` | Main headings and primary text |
| `--ink-muted` | `#5E5855` | Secondary text and metadata |
| `--ink-faint` | `#8D8580` | Placeholder and subdued icon details |
| `--bronze` | `#95613F` | Brand accent, icons, emphasis |
| `--bronze-deep` | `#75482D` | Strong bronze, shield outline, button |
| `--bronze-soft` | `#B7835B` | Gradient highlights and connectors |
| `--peach` | `#F7D8C7` | Alert-stage surface |
| `--peach-light` | `#FCE8DC` | Process pills and soft highlights |
| `--success` | `#35A91B` | Live SOC indicators |
| `--success-dark` | `#23830F` | Optional deeper green edge |

Do not use saturated orange or bright gold as a general accent. Bronze should remain muted and earthy.

### 3.2 Background treatment

The background is not a flat solid fill. It is a warm, very low-contrast gradient field with large, translucent curved forms.

Implement the background using a small number of pseudo-elements or decorative SVG shapes:

- Base: warm ivory/blush.
- Add a soft, pale central glow behind the main content.
- Add a large translucent curved band entering from the upper-left edge.
- Add a second broad curved band entering from the lower-right edge.
- Curves should be low contrast, with opacity around `0.12–0.28` depending on the exact base tone.
- Use gentle blur only where needed; avoid multiple stacked, expensive `backdrop-filter` layers.
- Decorative shapes must be `pointer-events: none` and must not affect layout or reading order.

The upper-left shape resembles a broad, folded translucent ribbon or curved plane. The lower-right shape resembles a wide, flowing curved band. Neither should resemble a sharp geometric polygon.

### 3.3 Borders, shadows, and depth

- Use thin, soft white borders on translucent surfaces.
- Keep shadows broad and diffused, with low opacity and warm brown undertones.
- Avoid dark drop shadows, hard outlines, and high-contrast elevation.
- The login panel should appear gently lifted from the background, not like a floating modal.
- Field outlines are subtle and should not compete with labels.
- Use consistent border radii; do not make every component excessively pill-shaped.

Suggested starting values:

```css
:root {
  --panel-radius: 30px;
  --control-radius: 14px;
  --pill-radius: 999px;
  --soft-shadow: 0 18px 55px rgba(94, 61, 42, 0.08);
  --fine-shadow: 0 5px 18px rgba(94, 61, 42, 0.045);
}
```

These are implementation recommendations, not pixel-verified source values.

---

## 4. Typography

The typography is clean, modern, and high-contrast. The headline is the largest text on the page and uses a regular sans-serif weight, with the second line italicized and colored bronze.

### Recommended font stack

Use a modern neutral sans-serif such as **Inter** if it is already available in the project. Otherwise use a close system sans-serif fallback.

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system,
             BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Do not introduce a decorative display font. The brand wordmark may use a slightly heavier weight and tighter tracking.

### Type hierarchy

| Element | Approx. desktop size | Weight | Treatment |
|---|---:|---:|---|
| Main headline | 72–76 px | 400 | Tight line-height; dark ink |
| Headline emphasized line | 70–74 px | 400 / italic | Bronze |
| Brand wordmark | 30–32 px | 750–800 | Uppercase; tight tracking |
| Brand descriptor | 14–15 px | 650–700 | Uppercase; wide tracking |
| Login title | 36–38 px | 550–600 | “Welcome” dark, “Back” bronze |
| Feature labels | 22–24 px | 550–600 | Dark ink |
| Field labels | 14–15 px | 600 | Dark ink |
| Button label | 16–17 px | 550–600 | White |
| Process stage labels | 18–20 px | 600 | Dark ink; final stage white |
| Eyebrow / section label | 11–12 px | 700 | Uppercase; wide tracking |
| Footer metadata | 16–17 px | 450–500 | Dark/muted ink |

The sizes are estimates for the supplied canvas. Scale them with `clamp()` for responsive behavior.

### Headline line structure

The exact displayed copy is:

- `From Alert to`
- `Verified Resolution.`

The first line is dark, upright, and regular weight. The second line is italic and bronze. Keep the line break intentional; do not allow the browser to wrap the headline unpredictably on wide desktop screens.

Suggested treatment:

```css
.hero-title {
  font-size: clamp(2.8rem, 4.55vw, 4.75rem);
  line-height: 1.05;
  letter-spacing: -0.045em;
  font-weight: 400;
}

.hero-title em {
  color: var(--bronze);
  font-style: italic;
  white-space: nowrap;
}
```

At narrower widths, allow the emphasized line to wrap naturally rather than clipping it.

---

## 5. Header and brand lockup

### 5.1 Shield mark

At the upper-left, the brand begins with a simple outlined shield:

- No filled background.
- Thin bronze/dark-brown stroke.
- Symmetrical shield silhouette.
- Pointed lower tip.
- Approximately 48–54 px tall on the reference canvas.
- Stroke should be visually light but crisp.

Use an existing project icon or a custom inline SVG path if the exact shield is not available. Do not use a random emoji or a filled security badge.

### 5.2 Vertical divider

A thin vertical line separates the shield from the wordmark:

- Approximately 1–2 px wide.
- Muted warm gray/brown.
- Around 54–56 px tall.
- Comfortable horizontal spacing on both sides.

### 5.3 Wordmark

The wordmark reads `SENTINEL.AI`:

- `SENTINEL` in near-black.
- `.AI` in bronze.
- Uppercase.
- Bold, compact sans-serif.
- Tracking slightly negative or neutral.

Below it, the descriptor reads `THREAT OPERATIONS`:

- Uppercase.
- Smaller size.
- Wide letter spacing.
- Dark muted gray.
- Aligned to the left edge of the wordmark.

### 5.4 SOC status pill

At the upper-right:

- Rounded capsule with a translucent warm surface.
- Green circular status indicator on the left.
- Text: `SOC Command Center`.
- Dark muted text, approximately 14–15 px.
- Horizontally centered with comfortable padding.
- Green dot around 13–15 px with a very subtle halo if needed.

The green indicator communicates an active/available state. Do not animate it aggressively; a slow, subtle opacity pulse is optional.

---

## 6. Left-side hero content

### 6.1 Accent dash

Above the headline is a short horizontal bronze bar:

- Approximately 65–67 px wide.
- Around 8–9 px tall.
- Fully rounded ends.
- Positioned with a generous gap before the headline.

### 6.2 Headline

Display the exact text:

**From Alert to**  
*Verified Resolution.*

Keep the block left-aligned. The headline should be the most visually dominant element on the entire screen. Preserve the contrast between the dark first line and bronze italic second line.

Do not add a subtitle below the headline. The next element is the process vocabulary row.

### 6.3 Process vocabulary row

Text shown:

`DETECT  ·  CORRELATE  ·  CONTAIN  ·  VERIFY`

Styling:

- Uppercase.
- Approx. 15–16 px.
- Bold/semi-bold.
- Wide tracking (around `0.20em` as a starting point).
- Dark gray, not pure black.
- Centered dot separators with ample side spacing.
- One line at desktop width.

On smaller screens, allow the row to wrap or reduce tracking. Do not shrink it to illegibility.

### 6.4 Feature list

Three feature rows appear below the process vocabulary.

Each row contains a rounded-square icon tile and a text label.

| Row | Text | Icon concept |
|---|---|---|
| 1 | `Evidence-Backed Investigation` | Document with folded corner and horizontal lines |
| 2 | `Cross-Alert Kill-Chain` | Three stacked/layered diamonds or sheets |
| 3 | `Closed-Loop Verification` | Checkmark inside a circular outline |

**Icon tile geometry:**

- Approximately 80 × 74 px in the reference.
- Soft blush/beige fill.
- Rounded corners around 18–20 px.
- No strong border.
- Icon centered.
- Icon stroke bronze/brown, approximately 3 px at reference scale.
- Icon size around 36–42 px.

**Row layout:**

- Icon tile on the left.
- Label vertically centered to the tile.
- Horizontal gap around 30–34 px.
- Vertical spacing between rows around 15–18 px.
- Labels use approximately 22–24 px semibold dark text.

Do not place each feature inside a separate bordered card. The tile is the only contained surface in each row.

---

## 7. Central threat-response process illustration

The center illustration is a vertical, connected four-stage sequence. It explains the product's operational flow and visually bridges the left content and the login panel.

### 7.1 Stages and exact copy

The stages, from top to bottom:

1. `Alert Detected`
2. `Attack Correlated`
3. `Containment Applied`
4. `Resolution Verified`

The first three stages use pale peach/cream pills with dark text and bronze icons. The final stage is filled with a deeper muted brown/bronze and uses white text with a brighter bronze check icon.

### 7.2 Pill geometry

Each stage is a long rounded capsule with a slight individual rotation. The pills are not perfectly aligned in one vertical column; they gently alternate horizontally to create a flowing path.

Approximate dimensions:

- Width: 300–340 px depending on stage.
- Height: 82–96 px.
- Radius: fully rounded.
- Border: subtle white/peach edge.
- Fill: pale peach gradient or translucent peach surface.
- Shadow: soft, warm, low-opacity.
- Rotation: small, roughly between `-6deg` and `-9deg` in the supplied image; preserve the organic stagger rather than forcing identical angles.

The final dark pill is approximately the same width and height as the other stages.

### 7.3 Stage icons

Use simple outline icons, not filled illustrations:

- **Alert Detected:** warning triangle with exclamation mark.
- **Attack Correlated:** connected-node/relationship graph with three nodes.
- **Containment Applied:** shield outline.
- **Resolution Verified:** circular checkmark.

Icon stroke color is bronze/dark brown. The final checkmark is brighter amber/bronze against the dark pill.

### 7.4 Connectors

Connect the stages with a thin, curved bronze line:

- The line should visually flow from the bottom area of one pill toward the next.
- Use a smooth Bézier/S-curve, not a straight vertical connector.
- Add small circular nodes at the connector endpoints or transition points.
- Node fill: muted peach/bronze.
- Connector stroke: approximately 2 px.
- Keep connectors behind the pills.
- The connector should not cross labels or icons.

The illustration may be implemented with SVG positioned behind the stage pills. This is preferable to multiple unrelated CSS borders because the curve and node placement need to remain coherent as the layout scales.

### 7.5 Layering

Recommended stacking order:

1. Background decorative shapes.
2. SVG connector path.
3. Connector nodes.
4. Stage pills and icons.
5. Foreground text.

The process illustration is decorative/explanatory and should not intercept pointer events unless the stages are intentionally made interactive. The reference does not establish that they are clickable.

### 7.6 Responsive behavior

- Desktop: retain the vertical four-stage flow.
- Tablet: reduce pill width and move the process illustration below or between the hero and login content if space becomes constrained.
- Mobile: render as a compact vertical timeline below the hero copy, with smaller pills and a simplified connector. Do not squeeze the timeline into a narrow center column.

---

## 8. Authentication panel

### 8.1 Panel container

The login panel is a large translucent rounded rectangle on the right.

Approximate reference geometry:

- Width: 475–485 px.
- Height: 530–540 px.
- Radius: approximately 28–32 px.
- Fill: translucent warm ivory/white.
- Border: thin, soft white.
- Shadow: broad, subtle, warm-toned.
- Internal horizontal padding: approximately 40 px.
- Internal top padding: approximately 28–32 px.

The panel should feel like a glass surface integrated into the background, not a dark modal or opaque white card.

Avoid excessive blur. A translucent fill and soft border should provide most of the effect. If `backdrop-filter` is used, keep it restrained and provide a solid/translucent fallback.

### 8.2 Security eyebrow

At the top of the panel:

- Small lock icon inside a soft rounded-square/circular warm tile.
- Text: `SECURE SOC AUTHENTICATION`.
- Uppercase.
- Approximately 11–12 px.
- Bold/semi-bold.
- Wide tracking.
- Dark gray.

The icon and text are horizontally aligned and vertically centered.

### 8.3 Login heading

Exact copy:

`Welcome Back`

- `Welcome` in dark ink.
- `Back` in bronze.
- Approximately 36–38 px.
- Medium/semi-bold.
- Tight letter spacing.
- One line.

Place a clear but not excessive gap between the eyebrow and title.

### 8.4 Enterprise Email field

Label: `Enterprise Email`

- Label above the field.
- Approximately 14–15 px.
- Semibold dark text.
- Field height approximately 46 px.
- Rounded rectangle with a subtle warm tinted fill.
- Thin low-contrast outline.
- Email icon at the left.
- Placeholder: `analyst@sentinel.cyber`
- Placeholder color: muted gray, visibly secondary to entered text.
- Left icon color: bronze/brown.
- Horizontal padding approximately 16 px.

Use a real email input with `type="email"` and a programmatic label. The placeholder is not a substitute for the label.

### 8.5 Security Password field

Label: `Security Password`

The password field uses the same geometry and surface treatment as the email field.

- Key icon at the left.
- Masked password characters in the default state.
- Eye icon at the right for show/hide password.
- Placeholder or initial visual example is muted gray.
- Keep the eye control inside the field, vertically centered, with a sufficiently large hit target.

Use a real `type="password"` input by default. The eye toggle should be a keyboard-accessible button with an accessible name that changes between “Show password” and “Hide password”.

### 8.6 Remember checkbox

Text: `Remember for 7 days`

- Checkbox is a small rounded square.
- Checked state shown in the reference.
- Checked fill is bronze.
- Checkmark is white.
- Text sits immediately to the right.
- Label is approximately 14 px and dark.
- Vertically align checkbox and label.

Use a native checkbox or an accessible custom checkbox. The checked appearance must include a visible checkmark and must not rely on color alone.

### 8.7 Primary sign-in button

Exact label:

`Sign In to SOC Console`

- Full width within the panel.
- Height approximately 47–48 px.
- Rounded corners around 13–15 px.
- Bronze/brown fill, potentially a subtle vertical gradient.
- White centered label.
- Right arrow icon aligned toward the right edge.
- Text around 16–17 px, medium weight.
- Subtle shadow; no bright glow.

The arrow should be visually separated from the label while remaining vertically centered.

Interaction requirements:

- Hover: slightly deepen the bronze tone or increase surface brightness subtly.
- Focus-visible: clear, high-contrast outline with offset.
- Active: slight darkening or 1 px press movement.
- Disabled/loading: reduce emphasis, prevent duplicate submission, and expose loading state accessibly.
- Error: show a concise inline error message without shifting the entire panel excessively.

Do not use a dramatic scale-up animation.

### 8.8 Demo access divider

Below the primary button:

- A thin horizontal line on each side.
- Centered text: `DEMO ACCESS`.
- Uppercase.
- Approximately 10–11 px.
- Bold/semi-bold.
- Wide tracking.
- Muted gray-brown.
- Lines are subtle and low contrast.

The divider has balanced spacing above and below.

### 8.9 Demo role buttons

Two equal-width buttons appear side by side:

1. `Lead SOC Analyst`
2. `SecOps Director`

Each button contains:

- A role icon at the left.
- Text centered or slightly left of center.
- A right arrow at the far right.
- Soft warm translucent fill.
- Subtle outline.
- Rounded corners around 14–16 px.
- Height approximately 49–51 px.

Icons:

- Lead SOC Analyst: outline user/person icon.
- SecOps Director: outline shield icon.

These are secondary actions and must remain visually quieter than the main sign-in button.

The reference communicates demo-role entry points but does not specify what credentials, permissions, or backend behavior they invoke. Implement their behavior only when the product's authentication flow defines it. Do not invent credentials or claim that these buttons authenticate successfully without a real implementation.

---

## 9. Bottom telemetry and version row

At the lower-left of the canvas, show:

- Green status dot.
- Text: `SOC Telemetry: Active`
- Thin vertical divider.
- Text: `v1.2 Enterprise`

Styling:

- Dot approximately 14 px.
- Green fill matching the top-right status indicator.
- Main status text approximately 16–17 px, medium weight, dark.
- Vertical divider approximately 1 px wide and 18 px tall.
- Version text approximately 16–17 px, muted gray.
- Horizontal gaps around 16–28 px.

Keep the row aligned horizontally on desktop. On mobile, it may move below the main content and wrap if required.

Do not imply real telemetry health based only on a static decorative dot. If the status is dynamic, connect it to actual system state. Otherwise label it as a design/static status only in development.

---

## 10. Interaction and state specification

The reference is a static screenshot. The following are implementation recommendations for a production-quality login screen, not interactions proven by the image.

### Form states

| State | Expected presentation |
|---|---|
| Default | Empty or placeholder email; password masked; remember option checked as shown |
| Email focused | Clear focus ring; field border becomes slightly more defined |
| Password focused | Same focus treatment as email |
| Password visible | Characters shown; eye control updates accessible label |
| Invalid email | Inline validation message and error border; do not rely on red alone |
| Missing password | Inline required-field feedback |
| Submitting | Button shows progress and prevents repeat submission |
| Authentication failed | Concise error message near the form controls |
| Authenticated | Navigate to the actual SOC application |
| Demo role selected | Invoke only the configured demo-role flow |

### Motion

Keep motion restrained and purposeful:

- Page content may fade in with a short upward movement.
- Stage pills may appear sequentially with a small stagger.
- Connector may draw in once on initial load if implemented with SVG stroke animation.
- Hover transitions should be around 140–220 ms.
- Avoid perpetual movement, large parallax, bouncing, or excessive glow.
- Respect `prefers-reduced-motion: reduce`; disable nonessential entrance and connector animations.

### Keyboard behavior

- Tab order follows visual and semantic order: email, password visibility control, remember checkbox, sign-in, demo role one, demo role two.
- Enter submits the form when appropriate.
- Space toggles the checkbox and activates focused buttons.
- Focus indicators must remain visible against the pale background.
- Decorative illustration elements must not enter the tab order.

---

## 11. Responsive behavior

The supplied reference is a wide desktop composition. The mobile layout is not shown, so the following is a recommended adaptation rather than a pixel-faithful observed state.

### Large desktop: 1440 px and wider

- Preserve the three-zone composition.
- Keep the login panel near its reference width.
- Maintain the headline as the dominant focus.
- Keep the process illustration between the left content and panel.
- Prevent the center illustration from colliding with the headline or panel.

### Standard desktop: 1024–1439 px

- Reduce outer margins.
- Reduce headline size with `clamp()`.
- Narrow the process pills.
- Reduce the gap between the three zones.
- Keep the login panel wide enough for readable fields and role buttons.
- If necessary, let the center illustration overlap the left/right grid tracks only within a controlled visual container; do not let it cover interactive controls.

### Tablet: 768–1023 px

Recommended structure:

1. Brand header across the top.
2. Hero headline and process vocabulary.
3. Login panel.
4. Process illustration below the login panel or as a compact horizontal/vertical sequence.
5. Telemetry/version row at the bottom.

The feature list can remain below the hero copy. Do not force all three desktop columns into a tablet width.

### Mobile: below 768 px

Recommended single-column order:

1. Brand lockup and SOC status.
2. Hero headline.
3. Process vocabulary.
4. Feature list.
5. Authentication panel.
6. Compact threat-response timeline.
7. Telemetry/version row.

Mobile-specific rules:

- Use 20–24 px page gutters.
- Keep the login panel full width with 22–26 px internal padding.
- Headline should scale to approximately 42–52 px depending on available width.
- Allow the italic phrase to wrap; do not clip it.
- Stack demo role buttons vertically when two columns become too narrow.
- Reduce or simplify background curves to avoid visual noise.
- Ensure no horizontal scrolling.
- Keep input and button heights at least 44 px for touch use.
- Maintain readable contrast and adequate spacing between controls.

---

## 12. Accessibility and usability requirements

- Use semantic landmarks: `header`, `main`, and `footer` where appropriate.
- Use a single meaningful `h1` for the headline or login purpose; do not create multiple competing top-level headings.
- Associate each form label with its input.
- Use appropriate input types and autocomplete attributes:
  - Email: `type="email"`, `autocomplete="username"`.
  - Password: `type="password"`, `autocomplete="current-password"`.
- Ensure all controls are keyboard operable.
- Provide visible `:focus-visible` styles.
- Give icon-only controls accessible names.
- Mark purely decorative SVGs with `aria-hidden="true"` and remove them from the accessibility tree.
- Do not communicate active/inactive state by color alone; include text.
- Maintain WCAG AA contrast for all essential text and controls. The pale placeholder treatment in the reference should not be copied if it becomes too faint to read.
- Ensure validation and authentication errors are announced to assistive technology, for example with an appropriate live region.
- Do not use placeholder text as the only field instruction.
- Respect reduced-motion preferences.

---

## 13. Implementation guidance

### Suggested component structure

```text
LoginPage
├── BackgroundDecor
├── Header
│   ├── BrandLockup
│   │   ├── ShieldMark
│   │   ├── BrandDivider
│   │   └── BrandText
│   └── SocCommandStatus
├── MainLayout
│   ├── HeroSection
│   │   ├── AccentDash
│   │   ├── HeroHeadline
│   │   ├── ProcessKeywords
│   │   └── FeatureList
│   │       └── FeatureItem × 3
│   ├── ThreatFlow
│   │   ├── ConnectorSvg
│   │   └── ThreatStage × 4
│   └── AuthenticationPanel
│       ├── AuthEyebrow
│       ├── AuthHeading
│       ├── LoginForm
│       │   ├── EmailField
│       │   ├── PasswordField
│       │   ├── RememberOption
│       │   └── SubmitButton
│       ├── DemoDivider
│       └── DemoRoleActions
└── FooterStatus
```

### Styling approach

- Prefer CSS Grid and Flexbox for the primary layout.
- Use CSS custom properties for all palette, spacing, radius, and shadow tokens.
- Use inline SVG or the project's existing icon library for consistent stroke icons.
- Use a single SVG for the process connector path and node positions.
- Avoid absolute positioning for major content blocks. Absolute positioning is acceptable for background decoration and connector details inside a positioned illustration wrapper.
- Avoid large raster images for icons or the process flow.
- Keep the page lightweight; do not add a charting library or animation framework solely for this screen.
- Avoid stacking multiple `backdrop-filter: blur()` layers. A translucent fill and subtle border are sufficient.
- Use responsive `clamp()` values for typography and selected spacing.

### Example design tokens

```css
:root {
  /* Color */
  --page-bg: #F7F0EC;
  --page-bg-light: #FBF6F2;
  --surface: rgba(255, 250, 246, 0.54);
  --surface-strong: #F1E5DE;
  --surface-border: rgba(255, 255, 255, 0.82);
  --line-subtle: rgba(112, 76, 54, 0.12);
  --ink: #202020;
  --ink-muted: #5E5855;
  --ink-faint: #8D8580;
  --bronze: #95613F;
  --bronze-deep: #75482D;
  --bronze-soft: #B7835B;
  --peach: #F7D8C7;
  --peach-light: #FCE8DC;
  --success: #35A91B;

  /* Geometry */
  --panel-radius: 30px;
  --control-radius: 14px;
  --pill-radius: 999px;

  /* Elevation */
  --soft-shadow: 0 18px 55px rgba(94, 61, 42, 0.08);
  --fine-shadow: 0 5px 18px rgba(94, 61, 42, 0.045);

  /* Spacing */
  --page-gutter: clamp(24px, 6.7vw, 112px);
  --content-gap: clamp(24px, 3vw, 52px);
}
```

---

## 14. Content inventory — exact visible copy

Use the following text exactly unless the product owner explicitly changes the copy.

| Location | Visible text |
|---|---|
| Brand | `SENTINEL.AI` |
| Brand descriptor | `THREAT OPERATIONS` |
| Top status | `SOC Command Center` |
| Headline line 1 | `From Alert to` |
| Headline line 2 | `Verified Resolution.` |
| Process keywords | `DETECT · CORRELATE · CONTAIN · VERIFY` |
| Feature 1 | `Evidence-Backed Investigation` |
| Feature 2 | `Cross-Alert Kill-Chain` |
| Feature 3 | `Closed-Loop Verification` |
| Flow stage 1 | `Alert Detected` |
| Flow stage 2 | `Attack Correlated` |
| Flow stage 3 | `Containment Applied` |
| Flow stage 4 | `Resolution Verified` |
| Auth eyebrow | `SECURE SOC AUTHENTICATION` |
| Auth heading | `Welcome Back` |
| Email label | `Enterprise Email` |
| Email placeholder | `analyst@sentinel.cyber` |
| Password label | `Security Password` |
| Remember option | `Remember for 7 days` |
| Primary action | `Sign In to SOC Console` |
| Demo divider | `DEMO ACCESS` |
| Demo role 1 | `Lead SOC Analyst` |
| Demo role 2 | `SecOps Director` |
| Footer status | `SOC Telemetry: Active` |
| Footer version | `v1.2 Enterprise` |

The screenshot does not show legal links, password recovery, registration, MFA, SSO, CAPTCHA, or a support link. Do not add these to the visual design unless product requirements call for them.

---

## 15. Quality assurance checklist

### Visual fidelity

- [ ] Warm ivory/blush canvas is preserved.
- [ ] Background curves are soft and low contrast.
- [ ] Brand lockup matches the upper-left placement and proportions.
- [ ] SOC status pill is at the upper-right.
- [ ] Hero headline is the strongest focal point.
- [ ] Second headline line is italic and bronze.
- [ ] Process keywords use uppercase, wide tracking, and centered separators.
- [ ] Feature rows use icon tiles, not full cards.
- [ ] Four-stage process is vertically connected and staggered.
- [ ] Final process stage is dark bronze with white text.
- [ ] Login panel is translucent, softly bordered, and softly elevated.
- [ ] Form controls share consistent height, radius, and border treatment.
- [ ] Primary action is the strongest control inside the panel.
- [ ] Demo actions remain secondary.
- [ ] Footer status/version row is aligned at the lower-left.

### Functional quality

- [ ] Email and password inputs are correctly typed and labeled.
- [ ] Password visibility toggle works and is accessible.
- [ ] Remember option is operable by keyboard.
- [ ] Form validation is clear and accessible.
- [ ] Submission prevents duplicate requests.
- [ ] Demo actions invoke only configured flows.
- [ ] Status indicators reflect real state or are clearly treated as static presentation.
- [ ] No decorative element blocks interaction.

### Responsive and accessibility quality

- [ ] No horizontal overflow at 320 px viewport width.
- [ ] Login panel remains usable on tablet and mobile.
- [ ] Demo buttons stack when needed.
- [ ] Focus indicators are visible.
- [ ] Text contrast meets WCAG AA.
- [ ] Reduced-motion preference is respected.
- [ ] Decorative SVGs are hidden from assistive technology.
- [ ] Touch targets are at least 44 × 44 px where practical.

---

## 16. Fidelity notes and unknowns

This specification is based on one static reference image. It can establish visible copy, relative placement, color character, typography hierarchy, component shapes, and the apparent visual relationships between elements.

It **cannot** establish:

- The original font file or exact font weights.
- Exact source color values or gradient stop positions.
- Exact CSS dimensions, grid definitions, or breakpoints.
- Whether the status indicators are live or decorative.
- The actual authentication provider, API contract, or session behavior.
- What the demo-role actions do.
- Whether the threat-flow stages animate or respond to interaction.
- The intended mobile/tablet design.

Where exact implementation data is unavailable, this document labels values as estimates or recommendations. Use the reference image as the final visual comparison target and adjust tokens after rendering at the same 1672 × 941 canvas size.
