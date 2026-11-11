# HexMap — Master Responsive Design Guidelines & Architecture Standard

This document establishes the permanent UI/UX responsive engineering standards for the **HexMap** platform. All current and future pages, sections, components, and interactive widgets **must** strictly comply with these guidelines to guarantee seamless readability, touch optimization, visual impact, and zero-overflow behavior across all device viewports.

---

## 1. Viewport Breakpoint Architecture

HexMap applications must fluidly scale across **5 standardized device viewports**:

| Breakpoint Tier | Viewport Width Range | Target Devices | Key Layout Behavior |
| :--- | :--- | :--- | :--- |
| **Small Mobile** | `320px – 374px` | iPhone SE, Galaxy Fold (collapsed) | Single column, compact padding, 100% width buttons |
| **Mobile** | `375px – 639px` | iPhone 13/14/15, Pixel, Android | Single column stack, scrollable pills, drawer menu |
| **Tablet** | `640px – 1023px` | iPad Air/Mini, Android tablets | 2-column bento grids, collapsed nav pill to drawer |
| **Laptop / Desktop** | `1024px – 1439px` | MacBooks, Standard Laptops | Full floating pill nav, 3/4-column grids, 3D tilt stage |
| **Large Desktop** | `1440px+` | Ultra-wide displays, 4K Monitors | Centered max-width containers (`1280px` / `1440px`) |

---

## 2. Global Container & Spacing Tokens

### Fluid Container Padding
Never hardcode fixed pixel left/right paddings for page-level containers. Use CSS fluid functions:

```css
.container,
.responsive-container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(1rem, 4vw, 2.5rem);
  padding-right: clamp(1rem, 4vw, 2.5rem);
}
```

### Fluid Section Padding
Sections must shrink their top/bottom whitespace on smaller screens to eliminate huge empty gaps:

```css
.section-wrapper,
.responsive-section {
  padding-top: clamp(2.5rem, 6vw, 6rem);
  padding-bottom: clamp(2.5rem, 6vw, 6rem);
  width: 100%;
}
```

---

## 3. Typography & Fluid Scaling

Never use fixed desktop font sizes (`font-size: 72px`) without mobile overrides or fluid scaling.

### Fluid Headings Hierarchy
- **Hero Title (`h1`)**: `font-size: clamp(2rem, 6.5vw, 4.5rem);`
- **Section Heading (`h2`)**: `font-size: clamp(1.75rem, 4vw, 3rem);`
- **Card/Feature Title (`h3`)**: `font-size: clamp(1.25rem, 2.5vw, 1.85rem);`
- **Subheadings & Paragraphs**: `font-size: clamp(0.95rem, 1.8vw, 1.15rem);`

### Overflow & Word Break Rules
All heading and paragraph elements must include text-wrapping defenses:
```css
h1, h2, h3, h4, p {
  white-space: normal !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
}
```

---

## 4. Layout & Navigation Conventions

### Navbar
- Desktop (`> 1024px`): Floating translucent pill navbar (`.center-nav-pill`).
- Mobile/Tablet (`<= 1024px`): `.center-nav-pill` hides; mobile drawer button (`.menu-circle-btn`) opens `<Sidebar />`.
- Logo & Action Pills:
  - Small mobile (`< 400px`): Hide text labels inside `.ask-ai-pill-btn` (icon-only circular pill).

### Mobile Navigation Drawer (`Sidebar.jsx`)
- Drawer width: `width: min(340px, 85vw);`
- Scroll locking: Must set `document.body.style.overflow = 'hidden'` while open to prevent background page scrolling.
- Tap targets: All drawer items must have a minimum height of `48px`.

---

## 5. Component Layout Standards

### Grid Rules
- **Desktop (4 Columns)**: `grid-template-columns: repeat(4, 1fr);`
- **Tablet (2 Columns)**: `@media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }`
- **Mobile (1 Column)**: `@media (max-width: 640px) { grid-template-columns: 1fr; }`
- **Featured Bento Cards**: Cards with `grid-column: span 2` **must** collapse to `grid-column: span 1` on screens `<= 640px`.

### Button & CTA Rules
- Desktop: Horizontal button group (`flex-direction: row; gap: 1.25rem;`).
- Mobile (`< 640px`): Vertical button stack (`flex-direction: column; width: 100%; gap: 0.75rem;`). Buttons stretch to `100%` width with centered text.

### Media & 3D Stage Elements
- Images and SVGs: Always use `max-width: 100%; height: auto; object-fit: contain;`.
- 3D Cutout Stages: Dampen or disable mouse/tilt transforms on touch viewports (`window.innerWidth <= 768`) to avoid edge clipping.
- Floating absolute chips/badges: Hide absolute floating chips around outer Hero canvas on viewports `<= 900px` and render an inline `.mobile-hero-chips-tray` instead.

---

## 6. Modals, Drawers & Overlays

Every modal (`AskAIModal.jsx`, Bento detail modals, popup drawers) **must** abide by:
```css
.modal-card {
  width: min(94vw, 680px);
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: clamp(1.25rem, 4vw, 2.25rem);
}
```
This guarantees modals stay centered and scroll internally on short screens or mobile keyboards.

---

## 7. Responsive QA Checklist for Future Developers

Before submitting any new feature, page, or component to HexMap, verify:

- [ ] Viewport 320px check: No horizontal scrollbar (`overflow-x`), no cut-off text.
- [ ] Viewport 375px check: Mobile layout stacks cleanly; CTA buttons take full width.
- [ ] Viewport 768px check: Tablet 2-column grids align without overlapping cards.
- [ ] Viewport 1440px check: Content is cleanly centered inside container max-width.
- [ ] Touch target check: All buttons/links have at least `44px × 44px` interactive area.
- [ ] Form input check: Input font size is at least `16px` to prevent iOS zoom.
- [ ] Navigation drawer check: Background scrolling is locked when open.
- [ ] Animation check: Motion remains smooth and non-disruptive on mobile devices.
