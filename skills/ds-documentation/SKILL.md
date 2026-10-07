---
name: ds-documentation
description: "Generates comprehensive component documentation directly on the Figma canvas based on the reference template from the design system documentation specification (Blade DSL reference), and appends a one-line log into the Figma file's .Changelog report. Covers Introduction & Anatomy (Light/Dark), Props & Tokens tables, Variations, Usage Guidelines (Do's & Don'ts), Platform Guidelines (Desktop/Tablet/Mobile), Accessibility, Motion Guidelines, and live component frames. Do not use before testing is complete (use /ds-test) or to build components (use /ds-component)."
license: MIT
compatibility: Designed for Figma Agent in Figma Design and Figma Make.
metadata:
  version: "3.0.0"
  target: "figma-agent"
---

# Design System Documentation

You are the documentation architect for Figma Agent. Your job is to construct complete, visual, production-grade component documentation directly on the Figma canvas, faithfully following the reference documentation template (modeled on the Blade DSL specification).

You also maintain design system governance by appending a mandatory, single-line log for every creation, update, or change into the `".Changelog"` report frame in the Figma file.

## When to use

- Generating canvas documentation for a tested component set on Web, Tablet, or Mobile.
- Updating existing documentation pages after component revisions or new variant additions.
- Documenting component anatomy, properties API, token mappings, usage do's/don'ts, platform specs, accessibility practices, and motion transitions.
- Appending one-line version history logs into the Figma file's `".Changelog"` report.

## When not to use

- Do not use before component testing is completed -> invoke `/ds-test` first.
- Do not use to fix component defects discovered while documenting -> invoke `/ds-fix`.
- Do not use to construct or modify the component source set -> invoke `/ds-component`.
- Do not use to generate foundations -> invoke `/ds-foundation`.

## Instructions

### 1. Canvas Documentation Layout (PDF Reference Template)

Construct the documentation on a dedicated Figma page named `Docs / Components / {Component}` (or a structured frame `Docs: {Component}`) organized into the following sequential sections:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ SECTION 1: HEADER & INTRODUCTION                                              │
│ Breadcrumb: {System Name} / Documentation                Link: docs.system.com│
│ Title: Introduction — {Component} component                                  │
│ Summary paragraph describing purpose, usage, and container behavior.         │
│ Anatomy Callout Diagram: (Light Mode Card & Dark Mode Card)                  │
│   Callouts: [Leading Visual] [Title] [Trailing Icon] [Content] [Slot]        │
├──────────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: PROPS & TOKENS                                                    │
│ Props [{Component}] Table: Prop Name | Description | Type | Values | Default │
│ Props [{Subcomponent}] Table: Prop Name | Description | Type | Values | Default│
│ Tokens Diagram + Table: Property | Token Name (by State/Condition)          │
├──────────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: VARIATIONS                                                        │
│ Visual showcase of variants (e.g. leading = None | Number | Icon) side-by-side│
├──────────────────────────────────────────────────────────────────────────────┤
│ SECTION 4: USAGE GUIDELINES (DO'S & DON'TS)                                  │
│ Side-by-side cards with green "Do" and red "Don't" badges + visual examples: │
│ 1. When to use  2. State count  3. Item limits  4. Line limits  5. Wrapping  │
├──────────────────────────────────────────────────────────────────────────────┤
│ SECTION 5: PLATFORM GUIDELINES                                               │
│ Desktop / Tablet / Mobile specs (min/max widths, lines) + device preview frames│
├──────────────────────────────────────────────────────────────────────────────┤
│ SECTION 6: ACCESSIBILITY                                                     │
│ Subsections: Use Case | Text | Colors/Contrast | Keyboard Nav | Labeling     │
├──────────────────────────────────────────────────────────────────────────────┤
│ SECTION 7: MOTION GUIDELINES                                                 │
│ Table: States | Animation | Triggers | Timeline (ms) | Transition Properties │
│ Duration & Easing tokens, property changes (Color, Rotate, Opacity, Move Y) │
├──────────────────────────────────────────────────────────────────────────────┤
│ SECTION 8: COMPONENT & SUBCOMPONENT CANVAS LAYOUT                            │
│ Live Component Set and Subcomponent frames with purple dashed borders & tags│
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2. Section Details & Formatting Rules

#### Section 1: Header & Visual Anatomy
- **Breadcrumb**: `{System Name} / Documentation` (e.g. `Blade DSL / Documentation`).
- **Title**: `Introduction` / Subtitle: `{Component} component`.
- **Summary**: Concise description explaining what the component is and how it behaves.
- **Anatomy**: Place two visual cards: **Light Mode** and **Dark Mode**. Annotate key parts with pointer lines and labels: `leading visual (can be icon or number)`, `title`, `trailing icon`, `accordion item`, `content`, `slot`.

#### Section 2: Props & Tokens Tables
- **Props Tables**: Create clean structured tables with headers `Prop Name`, `Description`, `Type`, `Prop Values`, `Default`:
  - One table for the main component: `Props [{Component}]`.
  - Additional tables for each subcomponent: `Props [{Subcomponent}]`.
- **Tokens Table**: Create a comprehensive mapping table with headers `Property` and `Token Name`:
  - Detail state conditions (e.g. `state = Default / isExpanded = False: theme.transparent`).
  - Cover background colors, text colors, icon sizes/types/colors, borders, dividers, paddings, and gaps.

#### Section 3: Variations
- Group variants by key dimensions (e.g., Leading options: `leading = None`, `leading = Number`, `leading = Icon`).
- Place live variant instances side-by-side on subtle neutral cards with bottom labels.

#### Section 4: Usage Guidelines (Do's & Don'ts)
- Construct side-by-side comparison cards:
  - Left card: Green pill tag **Do** with prescriptive guidance.
  - Right card: Red pill tag **Don't** with prohibited pattern.
- Cover 5 mandatory rules:
  1. **When to use**: Proper use cases vs inappropriate alternatives.
  2. **Active state limit**: Single vs multiple expanded items.
  3. **Total count limit**: Recommended volume before grouping.
  4. **Text line limits**: Maximum title lines for Desktop/Tablet (e.g. 2 lines) and Mobile (e.g. 3 lines).
  5. **Text wrapping**: Automatic Auto Layout wrapping vs manual carriage returns.

#### Section 5: Platform Guidelines
- Three dedicated columns/cards:
  - **Desktop**: Role context, specs (e.g. Min-width 400px, Max-width 800px, Title max 2 lines), visual mockup preview.
  - **Tablet**: Role context, specs (e.g. Min-width 360px, Max-width 640px), visual mockup preview.
  - **Mobile**: Native mobile app / m-web context, specs (e.g. Max-width 320px or viewport - 40px, Title max 3 lines, touch target 44px), visual mobile mockup frame.

#### Section 6: Accessibility
- Document clear, developer-actionable accessibility rules:
  - **Use Case**: Screen reader navigation, expanding/collapsing items.
  - **Text**: Dynamic type scaling, screen reader reading order.
  - **Colors**: Minimum contrast requirements (3:1 graphical UI, 4.5:1 text).
  - **Keyboard Navigation**: Document specific keys: `Space / Enter` (toggle item), `Up / Down Arrows` (navigate list items), `Cmd + F / Ctrl + F` (find text in collapsed state).
  - **Labeling**: ARIA labels, `aria-expanded`, `aria-controls`, and screen reader cues.

#### Section 7: Motion Guidelines
- Structured motion specification matrix:
  - `States`: Initial State frame vs Final State frame.
  - `Animation`: Visual arrow or description of state transition.
  - `Triggers`: `Hover`, `Click`, `System Trigger`.
  - `Timeline (ms)`: Visual timeline bar (0ms, 70ms, 150ms, 300ms) indicating transition curve.
  - `Transition Properties`: Duration token (`theme.motion.duration.*`), timing function token (`theme.motion.easing.*`), and property effects (Color, Rotate 0° to 180°, Opacity 0% to 100%, Move Y axis).

#### Section 8: Live Component Layout
- Showcase live component sets and subcomponents with clear purple dashed bounding boxes and variant dimension tags (e.g. `Accordion Item / Leading Item v2.0`, `Accordion v2.0`, `Accordion / Accordion Item v2.0`).

### 3. Mandatory One-Line Changelog Log

**CRITICAL REQUIREMENT**: Every time `/ds-documentation` creates or updates a component's documentation, you **MUST add a log for all updates or changes in one line into the ".Changelog" report in the Figma file**.

1. **Locate or Create `.Changelog` Frame**:
   - Check if a page or frame named `".Changelog"` exists in the Figma file.
   - If not present, create a dedicated frame named `".Changelog"` (styled with dark header and monospace/clean rows).
2. **Append Exactly One Line**:
   - Format: `[YYYY-MM-DD] [v{Version}] [{Component} / {Platform}] - {Summary of creation/update} (Figma Agent)`
   - Examples:
     - `[2026-10-07] [v1.0] [Accordion / Web] - Initial component documentation created with Light/Dark anatomy, props, and motion specs (Figma Agent)`
     - `[2026-10-07] [v1.1] [Button / Web] - Updated focus ring stroke and contrast tokens in props table (Figma Agent)`
3. **Confirm in Chat**:
   - Report the exact line appended to `.Changelog`.

## Examples

### Example 1: Documenting Accordion component
**User**: "/ds-documentation Create documentation for Accordion / Web."
**Agent**:
1. Creates `Docs: Accordion` frame on canvas.
2. Draws Header with breadcrumb and introduction.
3. Renders Light and Dark mode visual anatomy with pointer callouts.
4. Generates Props and Tokens tables.
5. Builds Variations card (leading = None, Number, Icon).
6. Constructs 5 Do's & Don'ts usage guideline cards.
7. Adds Platform cards (Desktop, Tablet, Mobile) with specs and mockups.
8. Writes Accessibility section (Use Case, Text, Colors, Keyboard Nav, Labeling).
9. Builds Motion Guidelines matrix with timeline and transition properties.
10. Renders live component sets.
11. Appends one-line log into `.Changelog`:
    `[2026-10-07] [v1.0] [Accordion / Web] - Initial documentation created matching Blade DSL reference template (Figma Agent)`.
12. Reports completion in chat.

## Common edge cases

- **Missing Dark Mode Frames**: If dark mode variables exist, always render the visual anatomy in both Light and Dark mode to illustrate theme switching.
- **Missing Motion Tokens**: If the design system does not have motion duration/easing tokens in foundations, document standard recommended CSS transitions (e.g. `200ms ease-out`) and recommend adding motion tokens to `/ds-foundation`.
- **No Existing `.Changelog` Frame**: Create the `".Changelog"` frame on the cover or system page so the project maintains an ongoing audit log.
