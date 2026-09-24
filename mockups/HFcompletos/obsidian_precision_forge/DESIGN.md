---
name: Obsidian Precision Forge
colors:
  surface: '#151311'
  surface-dim: '#151311'
  surface-bright: '#3c3936'
  surface-container-lowest: '#100e0c'
  surface-container-low: '#1e1b19'
  surface-container: '#221f1d'
  surface-container-high: '#2c2927'
  surface-container-highest: '#373432'
  on-surface: '#e8e1dd'
  on-surface-variant: '#e4beb3'
  inverse-surface: '#e8e1dd'
  inverse-on-surface: '#33302d'
  outline: '#ab897f'
  outline-variant: '#5b4038'
  surface-tint: '#ffb59e'
  primary: '#ffb59e'
  on-primary: '#5e1700'
  primary-container: '#ff5a1f'
  on-primary-container: '#541400'
  inverse-primary: '#ae3200'
  secondary: '#ffb59a'
  on-secondary: '#5b1b00'
  secondary-container: '#a03600'
  on-secondary-container: '#ffc4af'
  tertiary: '#4ae183'
  on-tertiary: '#003919'
  tertiary-container: '#00a857'
  on-tertiary-container: '#003316'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#852400'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59a'
  on-secondary-fixed: '#380d00'
  on-secondary-fixed-variant: '#802900'
  tertiary-fixed: '#6bfe9c'
  tertiary-fixed-dim: '#4ae183'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005228'
  background: '#151311'
  on-background: '#e8e1dd'
  surface-variant: '#373432'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Space Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  tech-data-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  tech-data-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  tech-label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  tech-micro:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels an **Industrial Tech / High-Precision Additive Manufacturing** aesthetic. It reflects the meticulous, micron-accurate realm of rapid prototyping, industrial engineering, and 3D printing. The visual atmosphere evokes a calibrated workshop at night: dark obsidian toolbeds, glowing extrusion hotends, structured blueprint metadata, and aerospace-grade execution.

### Personality & Emotional Response
- **Surgical Precision:** Every border, line-height, and badge feels drafted on a technical CAD workbench.
- **High-End Industrial Mastery:** Confident, premium, and durable—moving away from DIY maker cliches into industrial manufacturing standards.
- **Tactile High-Tech:** Rich, deep charcoal and obsidian foundations electrified by incandescent lava-orange thermal accents.

### Target Audience
Hardware engineers, industrial designers, architects, medical device innovators, and demanding prosumers in Costa Rica requiring exact tolerances, clear material specifications, and rapid on-demand fabrication.

## Colors

The palette is engineered around obsidian carbon substrates, warm mechanical tool-steel neutrals, and high-heat extrusion thermal markers.

### Palette Architecture
- **Thermal Core (Primary - `#FF5A1F`):** Represents molten filament, heated beds, and active laser sintering. Used for primary conversions, focal progress indicators, and prominent branding elements.
- **Thermal Glow (Secondary - `#FF7A45`):** Radiating heat tier for hover states, highlighted badges, active tab triggers, and directional callouts.
- **Calibrated Emerald (Tertiary - `#2ECC71`):** Functional validation color used exclusively for "In Stock", "Print Bed Level", "QC Verified", and dimensional tolerance passes.
- **Obsidian Carbon (Neutral Core - `#0D0B09`):** Deep, non-reflective base canvas that grounds the entire interface without harsh true-black voiding.

### Structural Surface Tokens
- **Canvas Base:** `#0D0B09`
- **Surface Level 1 (Cards, Modules):** `#141412`
- **Surface Level 2 (Panels, Drawers, Flyouts):** `#1E1C19`
- **Surface Level 3 (Inputs, Raised Tooltips):** `#25221E`
- **Structural Seams (Borders):** `#2A2723`
- **Thermal Seam (Accent Borders):** `rgba(255, 90, 31, 0.18)`
- **Text Readout (High Contrast):** `#F5F5F5`
- **Technical Metadata (Muted):** `#8A8884`

## Typography

The typographic hierarchy establishes a rigorous dual-engine split:
1. **Space Grotesk** drives communicative architecture: headlines, narrative descriptions, call-to-actions, and structural page navigation. Its geometric roots align naturally with CAD tooling and additive geometry.
2. **JetBrains Mono** powers all telemetry, material specs (e.g., `PETG-CF`, `PLA+`, `TOUGH-RESIN`), dimensional tolerances (`±0.05mm`), price readouts, layer height indicators, and configuration codes.

### Hierarchy & Style Rules
- All specs, numerical values, status labels, and telemetry chips MUST use `JetBrains Mono`.
- Headings display tight negative tracking (`-0.02em` to `-0.03em`) to mimic stamped engineering badges.
- Micro-labels and tags leverage uppercase styling with spaced tracking (`0.06em` to `0.08em`) to guarantee legible parsing on dark backgrounds.

## Layout & Spacing

The layout is built upon a balanced 12-column responsive fluid grid with a strict 4px base increment. Elements align to crisp, repeatable cadence markers resembling industrial schematics.

### Breakpoints & Grid Composition
- **Desktop (≥ 1280px):** 12 columns, `1.5rem` (24px) gutters, and `3rem` (48px) exterior margins. Max container constraint of `1440px`.
- **Tablet (768px - 1279px):** 8 columns, `1.25rem` (20px) gutters, and `2rem` (32px) margins.
- **Mobile (≤ 767px):** 4 columns, `1rem` (16px) gutters, and `1.25rem` (20px) margins.

### Vertical Rhythm
Section offsets favor high structural clarity: major module sections are separated by `space-xl` * 2 (5rem) on desktop and `space-xl` (2.5rem) on mobile, ensuring dense technical cards breathe against the obsidian background.

## Elevation & Depth

Visual depth is achieved through layered matte surfaces, ultra-fine mechanical boundaries, and targeted thermal photonic blooms rather than heavy muddy drop shadows.

### Surface Hierarchy
1. **Base Substrate (`#0D0B09`):** Ground level. Never carries shadows.
2. **Resting Component Layer (`#141412`):** Delimited by a 1px solid `#2A2723` perimeter outline.
3. **Floating Overlays & Sheets (`#1E1C19`):** Elevated with a dual shadow:
   - Ambient structural shadow: `0 16px 32px -8px rgba(0, 0, 0, 0.65)`
   - Hotbed rim light: `0 0 0 1px rgba(255, 90, 31, 0.2)`
4. **Active Focus & Hover States:** Emits a localized orange photon glow:
   - Glow blur: `0 0 20px -2px rgba(255, 90, 31, 0.35)`
   - Border shift: `rgba(255, 90, 31, 0.6)`

### Translucency & Glass Mechanics
Overlays, sticky navigation, and toolbars apply `#0D0B09/80` coupled with `backdrop-filter: blur(16px) saturate(180%)`, maintaining context visibility beneath the control deck.

## Shapes

The design uses balanced `rounded-xl` corners for principal containers and interactive controls, counteracted by crisp internal data chips to preserve a precise CAD instrument feel.

### Geometric Rules
- **Interactive Units (Buttons, Text Inputs, Dropdowns):** Defined by `0.75rem` (12px) to `1rem` (16px) radii (`rounded-xl`), creating tactile ergonomics.
- **Modular Cards & Dialogs:** `1rem` (16px) outer perimeter curves with 1px hairline borders.
- **Technical Badges & Spec Chips:** Pill format (`9999px` radius) with dense internal padding to distinguish data tokens from actionable components.

## Components

### Navigation Bar
- **Positioning:** Sticky top-0, height 72px, z-index 50.
- **Surface:** `rgba(13, 11, 9, 0.82)` with `backdrop-blur-md` and a bottom boundary of `1px solid #2A2723`.
- **Branding:** Vértice CR logotype in `Space Grotesk Bold` with the signature "V" glyph rendered in `#FF5A1F` copper/lava gradient.
- **Links:** JetBrains Mono uppercase navigation links (`tech-label-sm`). On hover, links transition color to `#FF7A45` with an ambient text-glow (`filter: drop-shadow(0 0 6px rgba(255, 90, 31, 0.5))`).

### Buttons
- **Primary:** Background `#FF5A1F` transitioning to `#FF7A45` on hover. Text `#0D0B09` (extra bold) or `#F5F5F5`. Shape: `rounded-xl`. Subtly cast with a thermal shadow `0 4px 16px rgba(255, 90, 31, 0.3)`.
- **Secondary / Technical Ghost:** Background `#141412`, border `1px solid #2A2723`, text `#F5F5F5`. On hover: border switches to `rgba(255, 90, 31, 0.45)` with subtle background shift to `#1E1C19`.
- **Action Metric (Calculate Instant Quote):** Includes an inline `JetBrains Mono` spec ticker alongside the button label.

### Technical Badges & Filament Chips
- **Geometry:** Pill-shaped capsules (`rounded-full`), border `1px solid`.
- **Material Pills (PLA, PETG, Resina SLA, FDM):** Background `rgba(30, 28, 25, 0.75)`, border `#2A2723`, text `#8A8884` in `tech-label-sm`.
- **Status Badges (In Stock / Ready to Print):** Background `rgba(46, 204, 113, 0.1)`, border `rgba(46, 204, 113, 0.3)`, text `#2ECC71`. Preceded by a 6px pulsing green beacon dot.

### Cards & Showcase Panels
- **Structure:** Background `#141412`, border `1px solid #2A2723`, `rounded-xl`. Padding: `space-lg` (24px).
- **Interaction:** On hover, border translates to `rgba(255, 90, 31, 0.35)` with an ultra-subtle upward translation (`translate-y-[-2px]`) and ambient lava perimeter glow.
- **Footer Metadata Matrix:** Bottom area contains a segmented bar featuring printer build volume (e.g., `300×300×400mm`), layer precision (`50μm`), and material compliance.

### Form Inputs & Upload Zone
- **Text Inputs:** Background `#141412`, border `1px solid #2A2723`, text `#F5F5F5`, typography `tech-data-md`. Focused: border `#FF5A1F` with `box-shadow: 0 0 0 2px rgba(255, 90, 31, 0.2)`.
- **STL/STEP File Dropper:** Dashed border `1.5px dashed #2A2723` on `#141412` surface. Center icon pulsing in `#FF5A1F` when a CAD model is dragged into the viewport.

### Checkboxes & Radio Controls
- **Checkboxes:** Square with `rounded-sm` corners, `#1E1C19` unselected with `#2A2723` border. Checked: `#FF5A1F` fill with deep obsidian tick mark.
- **Radio Buttons:** Concentric mechanical rings. Active state fires a bright `#FF5A1F` center pip surrounded by an obsidian ring and glowing border.