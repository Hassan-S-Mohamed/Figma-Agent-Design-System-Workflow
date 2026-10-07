# Eval — Button / Web workflow for Figma Agent

Starting state: a Figma file with Figma Agent available in Figma Design or Figma Make.

## 1. Orchestration Intake

Prompt:

```text
/ds-orchestrator
Start workflow for Button on Web.
```

- MUST inspect the Figma file and check if foundations exist.
- If foundations are missing, MUST direct the user: `Blocked: foundations missing — run /ds-foundation first`.
- MUST announce Package 3.0.0 and prompt `/ds-foundation`.

## 2. Foundation Generation

Prompt:

```text
/ds-foundation
Generate Variables and Styles for Acme. Brand primary: #0B5FFF.
Typefaces: Inter (Latin), IBM Plex Sans Arabic (Arabic). Themes: Light, Dark.
```

- If parameters are ambiguous, MUST ask the user via chat before proceeding.
- MUST create `_Primitives` collection (color, spacing, radius) and `Semantic Tokens` collection (Light and Dark modes).
- MUST set strict variable scopes on every variable (`TEXT_FILL`, `FRAME_FILL`, `STROKE_COLOR`, `GAP`, `CORNER_RADIUS`).
- MUST provide descriptive comments on all variables and text styles.
- MUST end with next step: `/ds-component`.

## 3. Component Planning & Implementation

Prompt:

```text
/ds-component
Implement Button for Web, Tablet, and Mobile.
```

- MUST create a component-variables tier (`component/button/*`) aliasing semantic foundation variables.
- MUST construct the component set with variants: `Hierarchy` (Primary, Secondary), `Size` (Large, Medium, Small), and `State` (Default, Hover, Focus, Active, Disabled).
- MUST bind all layers, fills, strokes, padding, gaps, and corner radii to component-level variables.
- MUST provide a 2px visible focus ring on the Focus state.
- MUST end with next step: `/ds-test`.

## 4. Test Audit

Prompt:

```text
/ds-test
Audit Button / Web.
```

- MUST inspect 100% token binding (flags raw hex or hardcoded sizes).
- MUST verify variable scoping compliance and Auto Layout integrity.
- MUST measure color contrast for normal text (≥ 4.5:1) and UI boundaries (≥ 3:1) in Light and Dark modes.
- MUST output a structured Test Findings Report with verdict (`PASS`, `PASS WITH FINDINGS`, or `FAIL`).
- If findings exist, MUST recommend `/ds-fix`. If passed, MUST recommend `/ds-documentation`.

## 5. Remediation (Optional)

Prompt:

```text
/ds-fix
Fix all findings on Button / Web.
```

- MUST resolve reported finding codes (e.g. repoints contrast aliases, binds raw values to component variables).
- MUST re-verify modified nodes and report resolution status.
- MUST end with next step: `/ds-documentation`.

## 6. Canvas Documentation & Changelog

Prompt:

```text
/ds-documentation
Generate documentation for Button / Web.
```

- MUST generate canvas documentation adhering to the reference template:
  1. Header & Introduction (with Light/Dark visual anatomy callouts).
  2. Props & Tokens tables (Props [Button] + component tokens mapping).
  3. Variations showcase.
  4. Usage Guidelines (5 Do's & Don'ts cards).
  5. Platform Guidelines (Desktop, Tablet, Mobile).
  6. Accessibility section (Use case, text, colors, keyboard nav, labeling).
  7. Motion Guidelines (states, timeline, transition tokens).
  8. Live component set display with variant frames.
- MUST locate or create the `".Changelog"` report frame in the Figma file.
- MUST append a single one-line entry:
  `[YYYY-MM-DD] [v1.0] [Button / Web] - Initial documentation created and tested (Figma Agent)`
- MUST confirm in chat that the `.Changelog` entry was added.
