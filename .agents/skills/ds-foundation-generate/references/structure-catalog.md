# Structure Catalog (choose one)

Source: [Open design systems (Figma Community)](https://www.designsystems.com/open-design-systems/). OSS kits supply **taxonomy and layer shape only**. Values always come from the user's brand seeds.

Present all options as a numbered menu with one line **Best for** and the collection shape. Wait for an explicit choice.

| # | Structure | Best for | Collections and modes | Brand remap |
|---|---|---|---|---|
| 1 | **Material 3** (@materialdesign) | Tonal palettes + role tokens (surface, on-surface, primary-container) | `Primitives` (tonal scales, one mode) · `Semantic` MD3 roles (Light / Dark) · numbers (spacing, shape, type) | Primary = seed → tonal steps → MD3 roles via aliases |
| 2 | **Primer** (@primer) | Dense product / developer tools; `fg` / `canvas` / `border` / `accent` | `Primitives` · `Semantic` `fg/*`, `canvas/*`, `border/*`, `accent/*`, `success/*`, `attention/*`, `danger/*`, `done/*` (Light / Dark, optional Dark Dimmed) | Brand → `accent` scale; keep functional names |
| 3 | **Carbon** (@ibmorg) | Enterprise apps with theme layers | `Primitives` · `Themes` layer tokens (White / Gray 10 / Gray 90 / Gray 100, or simplified Light / Dark) · productive vs expressive type | Replace IBM ramps with brand ramps; keep layer names |
| 4 | **Atlassian ADS** (@atlassian) | SaaS with elevation, border, icon, chart roles | `Primitives` · `Semantic` (background, text, border, icon, elevation, chart) (Light / Dark) · Effect Styles for elevation | Brand → brand roles; neutrals → elevation surfaces |
| 5 | **Twilio Paste** (@twilio) | Design-to-code token parity | `Primitives` · `Semantic` theme roles (Light / Dark; brand mode only if multi-brand) | Seed into brand scale; keep Paste roles |
| 6 | **Salesforce Lightning** (@salesforce) | CRM / form-heavy UIs | Brand tokens + palette categories · action / feedback colors · sizing, spacing | Primary becomes brand token; regenerate categories |
| 7 | **Ant Design** (@MrBiscuit / Ant patterns) | Algorithmic scales from a seed; compact density | `Seed` · `Map` · `Alias` (semantic) · **separate** `Density` collection (Default / Compact) | User colors = Seed; regenerate Map + Alias |
| 8 | **Cloudscape** (@cloudscape) | Console / admin density | `Semantic` color (Light / Dark) · `Density` (Comfortable / Compact) | Brand into status / link / primary roles; density stays separate |
| 9 | **Custom** | Your own collections and modes | User-described | Variables vs Styles rules and one-axis modes still apply |

Rules:

1. One structure per run. Changing structure after the blueprint = new blueprint version + new approval.
2. A mix of two structures must be labeled `Custom` and documented.
3. Never copy competitor hues or fonts from the kit.
4. Whatever structure is chosen, the file still gets the **required semantic roles** (see `defaults.md` §4) and the package naming grammar unless the user picks the structure's native names (record the choice in the Profile).
