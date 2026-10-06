# Generation Defaults (deterministic)

Use these unless the user or the chosen structure says otherwise. Record every default used in the blueprint's **Method** section, so a second run gives the same result.

## 1. Color ramps (OKLCH)

- Steps: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950` (11 steps).
- Target lightness (OKLCH L) per step:

| Step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| L | 0.97 | 0.94 | 0.88 | 0.80 | 0.71 | 0.62 | 0.54 | 0.46 | 0.38 | 0.30 | 0.22 |

- **Anchor**: the brand hex becomes the step whose target L is closest to the brand's L. That step keeps the **exact** brand hex.
- Other steps: same hue as the brand; chroma peaks at the anchor and tapers toward 50 and 950; reduce chroma until the color fits sRGB (never clip channels).
- Neutral ramp: brand hue with chroma 0.01 (tinted) — or 0 (pure gray) if the user asks.
- Feedback ramps (hue in OKLCH): success 145°, warning 75°, danger 25°, info 245°. If a feedback hue is within 20° of the brand hue, shift it 20° away and note it.
- Secondary / accent (if not supplied): brand hue + 150° (or the structure's rule), same method.

## 2. Spacing, radius, size (base 4)

| Token | Value |
|---|---|
| `spacing/none, 3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl, 4xl` | 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64 |
| `radius/none, sm, md, lg, xl, full` | 0, 4, 8, 12, 16, 9999 |
| `size/target/min` | 24 (Web WCAG minimum) |
| `size/target/primary` | 40 (Web), 48 (Tablet), 44 (Mobile) — viewport/platform modes when used |
| `size/icon/sm, md, lg` | 16, 20, 24 |
| `size/border/default, strong, focus` | 1, 1, 2 |

## 3. Typography

- Roles: `Display`, `Headline`, `Title`, `Body`, `Label`, `Caption` — each `Large / Medium / Small`.
- Web body Medium = 16 px. Scale ratio 1.25 for Display → Title; Body/Label/Caption step by 2 px.
- Line height (Latin): Display/Headline 1.2, Title 1.3, Body 1.5, Label 1.4, Caption 1.4.
- Line height (Arabic): Display/Headline 1.4, Title 1.5, Body 1.7, Label 1.5, Caption 1.5 (never below 1.5 for Body/Label).
- Letter spacing: Latin per structure (usually 0; small positive for Caption/Label allowed). **Arabic always 0.**
- Arabic size adjust: `+0` by default; propose `+1 px` for Body/Label Small if the Arabic font's x-height looks small, and record it.
- Pattern: `one-style-plus-viewport-modes` — one Text Style per role × language; sizes and line heights bound to variables in the `Viewport` collection (`Large / Medium / Small`) when the user wants Web viewport typography. Text Styles have no modes.

## 4. Required semantic roles (every structure)

Generate these roles (renamed to the structure's grammar if needed). Missing roles are the most common cause of later `FP-*` storms.

| Family | Roles |
|---|---|
| Background | `surface/default`, `surface/raised`, `surface/sunken`, `brand/default·hover·pressed`, `selected`, `disabled`, `inverse` |
| Text | `primary`, `secondary`, `disabled`, `inverse`, `on-brand`, `link/default`, `link/visited` |
| Icon | `primary`, `secondary`, `disabled`, `inverse`, `on-brand` |
| Border | `default`, `strong` (input outline, ≥ 3:1), `focus`, `disabled`, `selected` |
| Divider | `default` |
| Overlay | `scrim` (with alpha) |
| Feedback × 4 (info, success, warning, danger) | `bg`, `border`, `text`, `icon` |
| Elevation | Effect Styles `Elevation/1…3` with shadow color variables |

## 5. Default Light / Dark mapping (starting point — verify with contrast)

| Semantic role | Light | Dark |
|---|---|---|
| bg/surface/default | neutral/50 | neutral/950 |
| bg/surface/raised | white | neutral/900 |
| bg/surface/sunken | neutral/100 | neutral/950 |
| text/primary | neutral/900 | neutral/50 |
| text/secondary | neutral/700 | neutral/300 |
| text/disabled | neutral/400 | neutral/600 |
| border/default | neutral/300 | neutral/700 |
| border/strong | neutral/500 | neutral/400 |
| border/focus | brand/600 | brand/300 |
| bg/brand/default · hover · pressed | brand/600 · 700 · 800 | brand/400 · 300 · 200 |
| text/on-brand | white or neutral/950 (whichever passes both methods) | same rule |
| text/link/default · visited | brand/700 · secondary/700 | brand/300 · secondary/300 |
| bg/selected | brand/100 | brand/900 |
| overlay/scrim | neutral/950 @ 50% | black @ 60% |
| feedback bg · border · text · icon | 100 · 500 · 800 · 600 | 900 · 400 · 200 · 300 |

After mapping, run the contrast smoke check (see the skill, step 8). If a pair fails, move **one step at a time** along the same ramp until it passes both WCAG and APCA, and log the move.
