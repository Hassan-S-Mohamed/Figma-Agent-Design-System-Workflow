---
name: ds-foundation-generate
description: Generates Figma Variables and Styles foundations by adapting an open-source design-system structure to the user's brand colors and typefaces. Use when bootstrapping a new design-system file, creating token collections and styles from scratch, remapping a chosen OSS structure (Material 3, Primer, Carbon, Atlassian, Paste, Lightning, Ant, Cloudscape) onto brand seeds, or when the user asks to generate variables and styles before component work.
---

# Design System Foundation Generate

## Role

Act as a principal design-system architect and Figma Variables/Styles builder.

## Objective

Bootstrap (or extend) the active Figma design-system file's **Variables** and **Styles** by:

1. Offering curated **structure choices** from open design systems
2. Collecting **brand seeds** (colors + typeface)
3. Remapping that structure onto the brand
4. Creating Figma-native Variables + Styles with a clear architecture

This Skill answers:

> Which open-system structure should we follow, how do brand colors and typefaces map into it, and what exact Variables/Styles should exist in this file?

## Relationship to Other Skills

| Skill | Relationship |
|---|---|
| `/ds-foundation-generate` | **Creates** Variables/Styles foundations from a chosen structure + brand |
| `/ds-foundation-architecture-review` | **Reviews** health of existing Variables/Styles (read-only) |
| `/ds-review` | Checks whether foundations cover a **component** before Plan |
| `/ds-plan` → `/ds-build` | Consumes foundations; Table C may still propose gaps |

**Recommended order for a new file:**

```text
/ds-foundation-generate  →  /ds-foundation-architecture-review  →  /ds-review (per component)
```

Do not run component Build until foundations exist and pass a light architecture check.

## Figma rules (non-negotiable)

Follow Figma's own model ([Guide to variables](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma), [Styles](https://help.figma.com/hc/en-us/articles/360039238753-Styles-in-Figma-Design), [Variables vs Styles](https://help.figma.com/hc/en-us/articles/15871097384471-The-difference-between-variables-and-styles)):

| Use | When |
|---|---|
| **Variables** | Single reusable values (color, number, string, boolean); aliasing; modes (theme, density, brand); design tokens; scoping; binding into styles |
| **Text Styles** | Typography composites (family + size + weight + line height + letter spacing). Prefer variable-backed properties |
| **Effect Styles** | Composite shadows / blurs (variables cannot express multi-layer effects alone) |
| **Paint Styles** | Gradients, multi-fill stacks, image fills — **not** simple solids when a color variable is enough |
| **Layout Guide Styles** | Reusable row/column/grid guides |

### Architecture principles

```text
Primitive values
    ↓ aliases
Semantic / role tokens
    ↓ optional
Component-specific only when justified
```

- Modes = **one axis per collection** (e.g. Light/Dark). Never combine Theme × Language × Direction into one mode name.
- **Language ≠ Direction** (package rule): Language uses content + `Text/EN/…` and `Text/AR/…` Text Styles; Direction uses logical layout (Leading/Trailing/Start/End), not color modes.
- Styles are not obsolete — Variables power them; Styles remain the component-facing contract for typography and composite effects.
- Do not duplicate the same solid color as both a Paint Style and a color Variable without a documented migration reason.
- Prefer alias chains over copy-paste hex values in semantic layers.

Official Figma Design docs to keep in mind while building: [Figma Design category](https://help.figma.com/hc/en-us/categories/360002042553-Figma-Design) and [Figma AI section](https://help.figma.com/hc/en-us/sections/24369548041111) (do not invent AI-only token features that Figma Variables/Styles do not support).

## When to run

```text
/ds-foundation-generate
Generate Variables and Styles for a new design system.
```

Optional:

```text
/ds-foundation-generate
Structure: Primer
Brand primary: #0B5FFF
Typeface: Inter
Themes: Light, Dark
Languages: EN, AR
```

## Hard gates

1. **Do not mutate** until the user explicitly approves the Foundation Blueprint (`Approve FG-… Ready to Generate`).
2. If the file already has local Variables/Styles, stop and offer: **Extend**, **Replace (destructive — requires explicit confirm)**, or **Abort**.
3. One structure choice per run. Remap after approval if the user changes structure.
4. Do not invent component sets in this Skill — foundations only.

## Required inputs

Collect before building the blueprint. Ask only for what is missing.

| Input | Required | Notes |
|---|---|---|
| Brand / product name | Yes | Used in naming and docs frames |
| Structure choice | Yes | From the catalog below (or `Custom` with constraints) |
| Brand primary color | Yes | Hex or Figma color |
| Secondary / accent | Optional | If missing, derive from primary using the chosen structure's rules |
| Neutral / surface base | Optional | If missing, generate a neutral scale |
| Semantic colors (success / warning / danger / info) | Optional | If missing, generate accessible defaults consistent with brand |
| Typeface (Latin / UI) | Yes | Exact font family available in Figma |
| Typeface (Arabic) | If AR Text Styles requested | Exact Arabic-capable family |
| Themes / modes | Yes | Default: Light + Dark |
| Density / platform modes | Optional | Only if structure supports and user wants them |
| Languages for Text Styles | Optional | Default: EN; add AR when bilingual |
| Naming convention | Optional | Default follows chosen structure adapted to Figma slash groups |
| Target file role | Yes | Source library vs consumer (generate only in source library) |

### Brand seed rules

When the user provides only primary + typeface:

1. Generate a full primitive scale for primary (and secondary/accent if derived).
2. Generate neutral / surface / border scales.
3. Generate semantic feedback scales that do not clash with brand hue.
4. Map primitives → semantic roles defined by the chosen structure.
5. Build Light and Dark mode values so contrast roles remain usable (flag any role that fails approximate WCAG AA for text-on-surface; do not silently ship failing pairs).
6. Bind typography variables (family, size, weight, line height where used) into Text Styles named per Language axis.

Never hardcode competitor brand hues from the OSS kit — **structure only**, values from the user's brand.

## Structure catalog (choose one)

Source of open systems: [Open design systems (Figma Community)](https://www.designsystems.com/open-design-systems/).

Present **all** options below to the user as a numbered menu. Include a one-line **Best for** and the Figma collection shape. Wait for an explicit choice.

### 1. Material 3 — tonal roles

- **Community:** Material 3 Design Kit (@materialdesign)
- **Best for:** Product UIs that want tonal palettes + role tokens (surface, on-surface, primary-container…)
- **Figma shape:**
  - Collection `Primitives` — tonal scales (Primary, Secondary, Tertiary, Neutral, NeutralVariant, Error) with steps; **no theme modes** (or single mode)
  - Collection `Semantic` — MD3 roles; modes **Light / Dark**
  - Numbers: spacing, shape/radius, type scale sizes
  - Text Styles: Display / Headline / Title / Body / Label (± EN/AR)
- **Brand remap:** Treat user primary as seed → build tonal steps → wire MD3 roles via aliases

### 2. Primer (GitHub) — functional scales

- **Community:** Primer (@primer)
- **Best for:** Dense product / developer tools; clear `fg` / `canvas` / `border` / `accent` / state scales
- **Figma shape:**
  - `Primitives` — raw scales (neutral, blue, green, …)
  - `Semantic` — `fg/*`, `canvas/*`, `border/*`, `accent/*`, `success|attention|danger|done/*`; modes Light / Dark (optional Dark Dimmed)
  - Numbers: `space/*`, `size/*`, `radius/*`
  - Text Styles: display / title / body / caption / code
- **Brand remap:** Map brand primary into `accent` scale; keep functional naming

### 3. Carbon (IBM) — theme layers

- **Community:** Carbon (@ibmorg)
- **Best for:** Enterprise apps with strong theme packs and layering (ui backgrounds stacked)
- **Figma shape:**
  - `Primitives` — color ramps
  - `Themes` — semantic layer tokens; modes e.g. White / Gray 10 / Gray 90 / Gray 100 **or** simplified Light / Dark if user prefers fewer modes
  - Type: productive vs expressive scales as Text Styles
  - Numbers: spacing, layout, radius
- **Brand remap:** Replace IBM ramps with brand ramps; keep layer token names

### 4. Atlassian ADS Foundations — elevation + roles

- **Community:** ADS Foundations (@atlassian)
- **Best for:** SaaS with elevation, border, icon, and chart roles
- **Figma shape:**
  - `Primitives` + `Semantic` (background, text, border, icon, elevation, chart)
  - Modes: Light / Dark
  - Text Styles: heading / body / code
  - Effect Styles: elevation shadows variable-backed where possible
- **Brand remap:** Brand → primary/brand roles; neutrals → elevation surfaces

### 5. Twilio Paste — theme object semantics

- **Community:** Twilio Paste (@twilio)
- **Best for:** Design-to-code token parity; rem-ish spacing; clear background/text/border/shadow themes
- **Figma shape:**
  - `Primitives` + `Semantic` theme roles
  - Modes: Light / Dark (add brand mode only if multi-brand)
  - Text Styles mapped to Paste-like type ramps
- **Brand remap:** Seed brand into primary/brand scale; keep Paste role taxonomy

### 6. Salesforce Lightning — brand + category tokens

- **Community:** Salesforce Lightning (@salesforce)
- **Best for:** CRM-like / form-heavy UIs; brand token + categorized color tokens
- **Figma shape:**
  - Brand tokens (primary, contrast) + palette categories
  - Semantic action / feedback colors
  - Numbers: sizing, spacing
  - Text Styles: font tokens → styles
- **Brand remap:** User primary becomes brand token; regenerate dependent categories

### 7. Ant Design — Seed → Map → Alias

- **Community:** Ant for Figma (@MrBiscuit) / Ant Design patterns
- **Best for:** Algorithmic scales from a seed; compact density option
- **Figma shape:**
  - `Seed` (few brand inputs)
  - `Map` (derived ramps)
  - `Alias` (semantic); modes Default + optional Compact (density) **as a separate collection**, not mixed into color modes
  - Text Styles: heading / body / caption
- **Brand remap:** User colors = Seed only; regenerate Map + Alias

### 8. Cloudscape (AWS) — density-aware console UI

- **Community:** Cloudscape Design System (@cloudscape)
- **Best for:** Console / admin density; compact vs comfortable
- **Figma shape:**
  - Color semantic collection (Light / Dark)
  - Density collection (Comfortable / Compact) for spacing/type numbers
  - Text Styles per density or variable-backed sizes
- **Brand remap:** Brand accents into status/link/primary roles; keep density axis separate

### 9. Custom

- User describes required collections, modes, and naming.
- Agent still enforces Variables vs Styles rules and one-axis modes.
- Do not invent an undocumented hybrid of two catalog structures without labeling it `Custom`.

## Workflow

Copy and track:

```text
Foundation Generate Progress:
- [ ] 1. Context + existing foundations check
- [ ] 2. Collect brand seeds + languages
- [ ] 3. Present structure catalog → user chooses
- [ ] 4. Draft Foundation Blueprint (FG-*)
- [ ] 5. Human approval
- [ ] 6. Create Variables (collections, modes, aliases, scopes)
- [ ] 7. Create Styles (Text, Effect, Paint only if needed, Layout Guide if needed)
- [ ] 8. Smoke-check + report
```

### 1. Context + existing foundations check

Record:

- File name, page, library vs consumer
- Existing local variable collections (names, modes, counts)
- Existing local Text / Paint / Effect / Layout Guide Styles
- Enabled remote libraries that already supply tokens

If local foundations already exist → stop for Extend / Replace / Abort.

### 2. Collect brand seeds

Ask for missing required inputs only. Accept partial seeds and state what will be auto-derived.

### 3. Present structure catalog

Show the numbered catalog. Do not start remapping until the user picks one (or `Custom`).

### 4. Draft Foundation Blueprint (`FG-*`)

Identity:

```text
FG-[BRAND]-[STRUCTURE]-001
```

Example: `FG-ACME-PRIMER-001`.

Blueprint must include:

#### A. Structure decision

- Chosen open system + Community reference
- Why it fits (1–3 bullets)
- Collections and modes (ASCII diagram)

#### B. Brand remap map

| Seed input | Primitive target(s) | Semantic role(s) | Notes |
|---|---|---|---|
| Primary `#…` | … | … | … |
| Typeface `…` | `font/family/sans` | Text Styles … | … |

#### C. Variables create table (executable)

| ID | Collection | Path / name | Type | Mode values | Alias of | Scopes | Description |
|---|---|---|---|---|---|---|---|
| V-001 | … | … | COLOR | Light:… Dark:… | — or path | FILL, … | … |

Group rows by collection. Prefer aliases in semantic rows.

#### D. Styles create table (executable)

| ID | Style type | Name | Variable bindings | Raw leftovers | Languages |
|---|---|---|---|---|---|
| S-001 | TEXT | Text/EN/Body/Default | size→… weight→… | — | EN |

Rules:

- Solid brand colors → Variables, not Paint Styles
- Shadows → Effect Styles
- Gradients only if brand requires → Paint Styles
- EN and AR Text Styles are separate names when bilingual

#### E. Risks and non-goals

- Fonts not installed in Figma
- Contrast warnings
- What this run will **not** create (components, prototypes, published library push unless asked)

#### F. Approval line

```text
Reply: Approve FG-… Ready to Generate
```

### 5. Human approval

Proceed only after exact approval for that `FG-*` ID.

If the user edits seeds or structure after the blueprint, revise the blueprint and re-approve.

### 6. Create Variables

Execute Table C in order:

1. Create collections + modes
2. Create primitive variables (raw values)
3. Create semantic variables (aliases)
4. Apply scopes and descriptions
5. Set default mode intentionally (usually Light)

Do not publish the library unless the user explicitly asks.

### 7. Create Styles

Execute Table D:

1. Ensure typography variables exist
2. Create Text Styles with variable bindings
3. Create Effect Styles for elevation
4. Create Paint Styles only for composite paints
5. Create Layout Guide Styles only if requested or structure requires grids

### 8. Smoke-check + report

Verify:

- Alias direction primitives → semantic
- Mode completeness (no empty Dark values)
- Text Styles resolve with the chosen font
- No accidental Theme×Language×Direction modes
- Sample frame (optional): swatches + type specimen bound to tokens — create only if user wants a specimen page

## Output report format

```markdown
# Foundation Generate Report — FG-…

## Summary
- Structure: …
- Brand seeds used: …
- Status: Draft | Approved | Generated | Blocked

## Collections created
| Collection | Modes | Variable count |

## Styles created
| Type | Count | Naming prefix |

## Brand remap highlights
- …

## Contrast / risk flags
- …

## Next steps
1. `/ds-foundation-architecture-review`
2. `/ds-review` for first component
3. Publish library when ready (human action)
```

## Mutation safety

Allowed after approval:

- Create local variables, collections, modes, aliases, scopes, descriptions
- Create local Text / Effect / Paint / Layout Guide Styles
- Optional specimen page/frame for validation

Forbidden unless explicitly requested:

- Publish / unpublish library
- Delete existing foundations (Replace path requires typed confirm: `Confirm Replace Foundations`)
- Edit unrelated components
- Rename remote library assets

## Quality bar

- Structure choice is explicit and cited
- Brand values drive primitives; OSS kit supplies **taxonomy**, not competitor colors or fonts
- Variables vs Styles split matches Figma guidance
- One mode axis per collection
- Language Text Styles separate from Direction
- Blueprint tables are executable (Build-grade clarity)
- Report lists exact names created

## References

- [Guide to variables in Figma](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [Styles in Figma Design](https://help.figma.com/hc/en-us/articles/360039238753-Styles-in-Figma-Design)
- [The difference between variables and styles](https://help.figma.com/hc/en-us/articles/15871097384471-The-difference-between-variables-and-styles)
- [Overview of variables, collections, and modes](https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes)
- [Modes for variables](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)
- [Figma Design documentation](https://help.figma.com/hc/en-us/categories/360002042553-Figma-Design)
- [Figma AI documentation](https://help.figma.com/hc/en-us/sections/24369548041111)
- [Open design systems](https://www.designsystems.com/open-design-systems/)
