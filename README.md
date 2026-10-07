# Figma Agent Design System Workflow

**Version 3.0.0** · [CHANGELOG](CHANGELOG.md) · MIT license

A specialized suite of custom skills designed natively for **[Figma Agent](https://help.figma.com/hc/en-us/articles/40283639496599-Create-and-manage-custom-skills-in-Figma)** (in Figma Design and Figma Make). This workflow guides the Figma Agent through building, maintaining, verifying, and documenting an enterprise design system directly inside your Figma files.

Every step features strict token abstraction (Primitive → Semantic → Component tokens), automated compliance checks (100% token binding, variable scoping), measured accessibility (WCAG 2.2 AA + APCA), bidirectional LTR/RTL support, canvas documentation based on the Blade DSL reference template, and automated `.Changelog` tracking.

---

## The 6 Core Figma Agent Skills

```text
[1. Orchestration]     /ds-orchestrator     Stage management, progress tracking & phase gates
        │
        ▼
[2. Foundations]       /ds-foundation       Variables & Styles, Light/Dark modes, strict scopes & descriptions
        │
        ▼
[3. Components]        /ds-component        Component-level variables, Web / Tablet / Mobile sets & variants
        │
        ▼
[4. Compliance QA]     /ds-test             100% token binding, Auto Layout, WCAG 2.2 contrast, touch targets
        │
        ├───────────────────────────────────┐
        ▼ (if findings detected)            ▼ (if test passes)
[5. Remediation]       /ds-fix (Optional)   │
        │                                   │
        └───────────────────┬───────────────┘
                            ▼
[6. Documentation]     /ds-documentation    Canvas docs (Blade DSL template) + .Changelog 1-line append
```

| Skill Command | Primary Role & Responsibility | Output in Figma |
|---|---|---|
| **`/ds-orchestrator`** | Manages the end-to-end workflow, tracks project stage in Figma, enforces phase gates, and directs the user on who does what and what slash command to run next. | Workflow status board (`_DS System`) |
| **`/ds-foundation`** | Plans and implements design system foundations (Variables & Styles) based on requested structure. Sets up Primitive and Semantic token layers, enforces explicit variable descriptions and strict scoping (`TEXT_FILL`, `FRAME_FILL`, `STROKE_COLOR`, `GAP`, `CORNER_RADIUS`). Asks user via chat whenever clarification is required. | Variable collections, Modes, Text & Effect Styles |
| **`/ds-component`** | Plans and implements components for all platforms (Web, Tablet, Mobile). Establishes a dedicated **component-variables tier** based on semantic variables, and binds all component layers to these component-level tokens. Builds full variant states, slots, and responsive Auto Layout. | Multi-platform Component Sets |
| **`/ds-test`** | Quality assurance and compliance auditor. Verifies 100% token binding (zero raw hex or unlinked values), variable scoping compliance, component-variable mapping, UI principles, WCAG 2.2 AA / APCA contrast, touch targets (≥44px), and RTL/Arabic stress. Outputs structured Findings Report. | Test Findings Report (chat & canvas sticker) |
| **`/ds-fix`** *(optional)* | Automatically repairs findings and violations from the `/ds-test` report. Binds unlinked properties to component tokens, corrects Auto Layout constraints, fixes contrast pairs, and expands touch targets. | Fixed component nodes |
| **`/ds-documentation`** | Constructs visual canvas documentation faithfully following the **Blade DSL Reference Template** (Anatomy Light/Dark, Props/Tokens tables, Variations, 5 Do's & Don'ts cards, Platform guidelines, Accessibility, Motion guidelines) and appends a mandatory one-line log into the Figma file's `".Changelog"` report. | Canvas documentation frames + `.Changelog` append |

---

## Detailed Skill Specifications

### 1. `/ds-orchestrator`
- **Controller of the pipeline**: Maintains awareness across all 5 downstream skills.
- **Workflow State**: Keeps a clean status registry on a canvas frame (`_DS System / Workflow Board`) tracking `{Component} / {Platform}`, lifecycle state (`Foundation → Component → Tested → Fixed → Documented → Released`), and open findings.
- **Phase Gates**:
  - *Gate 1 (Foundations)*: Semantic tokens verified with scopes and descriptions before component work starts.
  - *Gate 2 (Component)*: Component set and component tokens verified before testing.
  - *Gate 3 (QA)*: Findings addressed via `/ds-fix` or acknowledged before documentation.
  - *Gate 4 (Release)*: Canvas docs complete and `.Changelog` updated.
- **Interactive Prompts**: Concludes every interaction with the exact next command for the user to copy or run.

### 2. `/ds-foundation`
- **Two-Tier Architecture**:
  - `_Primitives` (Hidden from publishing): Color scales (50–900), base spacing (0–64), base radius (0–full).
  - `Semantic Tokens` (Published): `color/surface/*`, `color/text/*`, `color/icon/*`, `color/border/*`, `color/interactive/*`, `color/feedback/*`, `spacing/*`, `radius/*`.
  - Modes: `Light` and `Dark` (plus high contrast or density where requested).
- **Mandatory Descriptions**: Every variable and style MUST have an informative description: `[Purpose] | Usage: [Where to apply] | Pairing: [Paired contrast token]`.
- **Strict Scoping (`scopes`)**:
  - Text colors: `TEXT_FILL` only.
  - Surface colors: `FRAME_FILL`, `SHAPE_FILL`.
  - Border colors: `STROKE_COLOR`.
  - Spacing: `GAP`, `WIDTH_HEIGHT`.
  - Corner radius: `CORNER_RADIUS`.
  - Stroke width: `STROKE_FLOAT`.
- **Chat Clarification Protocol**: If the agent cannot recognize brand colors, typography font families, or token conventions from context, **it stops and asks the user via chat** before proceeding. Never guesses arbitrary values.

### 3. `/ds-component`
- **Component-Variables Tier (Tier 3 Tokens)**:
  - Establishes dedicated component-level variables: `component/{name}/{part}/{property}/{state}` (e.g. `component/accordion/header/bg/default`).
  - Aliases every component variable to a semantic foundation token (never raw hex).
  - Binds all visual layers, strokes, paddings, and radii to these component tokens.
- **Multi-Platform Support**:
  - **Web**: Responsive breakpoints (Large, Medium, Small), hover feedback, 2px visible focus rings.
  - **Tablet**: Touch ergonomics, minimum touch target 44 × 44 pt.
  - **Mobile**: Native app conventions, minimum touch target 44 × 44 pt (iOS) / 48 × 48 px (Android), compact stacks.
- **Component Anatomy & Auto Layout**:
  - Subcomponents (e.g. `Accordion Item / Leading Item`, `Accordion Item / Content Slot`).
  - Variants: State (`Default`, `Hover`, `Focus`, `Active`, `Disabled`), Size (`Small`, `Medium`, `Large`), Booleans (leading/trailing visual toggles), Instance Swap (slots).
  - Dynamic resizing: `Fill container` for wrapping text, `Hug contents` for compact items. Never fixed width on text containers.
  - Bidirectional LTR/RTL support with adequate line-height for Arabic text expansion.

### 4. `/ds-test`
- **Automated Quality & Compliance Audit**:
  - `TOK`: Zero hardcoded hex colors, zero unlinked font styles, zero raw spacing/radius numbers.
  - `SCP`: Variable scoping verification (no text color used on frame fills).
  - `CMP`: Component-level tokens properly aliased to semantic foundations.
  - `UI`: Auto Layout completeness, dynamic reflow without clipping, state completeness.
  - `A11Y`: WCAG 2.2 AA contrast (≥ 4.5:1 text, ≥ 3:1 non-text UI) & APCA (|Lc| ≥ 75 text, ≥ 60 UI), visible 2px focus ring, touch targets (≥ 44px).
  - `LNG` / `DIR`: Arabic font vertical metrics (no clipped glyphs) and RTL layout mirroring.
- **Test Findings Report**: Outputs structured findings with IDs (`TOK-001`, `A11Y-002`, `UI-003`), severity (`CRITICAL`, `WARNING`, `INFO`), and remediation instructions.

### 5. `/ds-fix` (Optional)
- **Automated Remediation**:
  - Reads findings from `/ds-test`.
  - Binds raw hex values to appropriate component variables.
  - Re-aliases contrast tokens along approved token ramps to satisfy WCAG 2.2 AA.
  - Adjusts Auto Layout properties (fixed to Hug/Fill, corrects padding).
  - Expands touch target padding on Mobile/Tablet to reach 44px minimum.
  - Re-verifies fixed nodes and confirms resolution.

### 6. `/ds-documentation`
- **Figma Canvas Documentation Layout (Blade DSL Reference Template)**:
  1. **Header & Intro**: Breadcrumb (`{System Name} / Documentation`), Title (`Introduction — {Component}`), Summary paragraph, Light & Dark visual anatomy callouts with pointers (`leading visual`, `title`, `trailing icon`, `content`, `slot`).
  2. **Props & Tokens Tables**: Props `[{Component}]` table, Props `[{Subcomponent}]` table(s), and Tokens mapping table (Property → State/Condition → Token Name).
  3. **Variations**: Side-by-side showcase of variants (e.g. `leading = None`, `Number`, `Icon`) with labels.
  4. **Usage Guidelines (Do's & Don'ts)**: 5 visual comparison cards with green "Do" and red "Don't" badges (When to use, Active state limit, Item volume, Title line limits for Desktop vs Mobile, Text wrapping).
  5. **Platform Guidelines**: Desktop, Tablet, and Mobile specification cards (min/max widths, lines) + device mockup frames.
  6. **Accessibility**: Use case, text scaling, color contrast minimums, keyboard navigation (`Space/Enter`, `Arrows`, `Cmd+F`), screen reader labeling.
  7. **Motion Guidelines**: Matrix of States (Initial/Final), Animation, Triggers (Hover, Click, System Trigger), Timeline (ms), and Transition Properties (duration & easing tokens, property changes).
  8. **Live Component Set & Subcomponents**: Rendered component sets with purple dashed bounding boxes and variant dimension tags.
- **Mandatory One-Line Changelog Log**:
  - Finds or creates the `".Changelog"` report frame in the Figma file.
  - Appends a single one-line entry:
    `[YYYY-MM-DD] [vX.X] [{Component} / {Platform}] - {Summary of creation/update} (Figma Agent)`
  - Confirms the changelog update in chat.

---

## Installation into Figma Agent

According to [Figma's custom skills guide](https://help.figma.com/hc/en-us/articles/40283639496599-Create-and-manage-custom-skills-in-Figma), custom skills in Figma Agent are uploaded as **single, standalone Markdown (`.md`) files**:

1. Build or locate the standalone skill files in `dist/single/`:
   - `dist/single/ds-orchestrator.md`
   - `dist/single/ds-foundation.md`
   - `dist/single/ds-component.md`
   - `dist/single/ds-test.md`
   - `dist/single/ds-fix.md`
   - `dist/single/ds-documentation.md`
2. Open **Figma Design** or **Figma Make**.
3. Open the agent chat sidebar.
4. Click `+` (Add context) in the prompt box → **Skills** → **Add skill** → **Upload a file**.
5. Select and upload each skill file.
6. The skills are now active and ready to be invoked using slash commands:
   - `/ds-orchestrator`
   - `/ds-foundation`
   - `/ds-component`
   - `/ds-test`
   - `/ds-fix`
   - `/ds-documentation`

---

## Example Workflow Walkthrough

```text
User:
/ds-orchestrator Start workflow for Accordion component.

Agent:
Inspecting file... Foundations are present (142 semantic tokens).
Next step: Plan and implement the Accordion component across Web, Tablet, and Mobile.
Run: /ds-component Build Accordion for Web, Tablet, and Mobile

User:
/ds-component Build Accordion for Web, Tablet, and Mobile

Agent:
- Created component-variables collection: component/accordion/*
- Built subcomponents: Accordion Item / Leading Item, Accordion / Accordion Item
- Built main component set: Accordion / Web, Accordion / Tablet, Accordion / Mobile
- Bound all fills, strokes, padding, and radii to component tokens
Next step: Run /ds-test to audit token compliance and accessibility

User:
/ds-test Audit Accordion / Web

Agent:
Test Findings Report: Accordion / Web
- Total Nodes Inspected: 48
- Verdict: PASS WITH FINDINGS (2 Warnings)
  * A11Y-001 (Warning): Hover background contrast in Dark mode is 4.1:1 (recommended 4.5:1)
  * TOK-001 (Warning): Trailing chevron stroke unbound to component token
Next step: Run /ds-fix to automatically resolve findings

User:
/ds-fix Resolve findings on Accordion / Web

Agent:
- Re-aliased component/accordion/header/bg/hover to color/surface/interactive/subdued-hover (Dark mode contrast now 5.4:1)
- Bound chevron stroke to component/accordion/icon/color
- Verified: 0 open findings
Next step: Run /ds-documentation to generate the documentation page

User:
/ds-documentation Document Accordion / Web

Agent:
- Created Docs: Accordion canvas frame
- Generated Header, Light & Dark Anatomy, Props & Tokens tables, Variations, 5 Do/Don't cards, Platform specs, Accessibility, and Motion matrix
- Appended one-line log into ".Changelog":
  "[2026-10-07] [v1.0] [Accordion / Web] - Initial documentation created matching Blade DSL reference template (Figma Agent)"
Component Accordion is now complete and documented!
```

---

## Developer Validation & Scripts

```bash
node --test scripts/test/*.test.mjs     # Run unit tests
node scripts/bundle-skills.mjs          # Build install bundles into dist/
node scripts/validate-skills.mjs        # Validate skills against Agent Skills spec
node scripts/check-evals.mjs            # Verify eval cases and package consistency
```
