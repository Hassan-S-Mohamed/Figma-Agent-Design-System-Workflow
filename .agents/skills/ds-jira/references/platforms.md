# Platforms and Viewports

## 1. Platforms (separate component sets)

| Platform | Meaning | Component set name |
|---|---|---|
| `Web` | Responsive web / portal | `{Component} / Web` |
| `Tablet` | Tablet **app** | `{Component} / Tablet` |
| `Mobile` | Mobile **app** | `{Component} / Mobile` |

- One component + one platform per Plan / Build / Test / Fix / Document run.
- Never pack platforms into one set "for now".

## 2. Web viewports (inside the Web component)

To avoid mixing up "Tablet app" with "tablet-sized browser", Web viewports use **size words**, never platform words:

| Web viewport | Typical width | Mode name in the Profile's viewport collection |
|---|---|---|
| Large | ≥ 1024 px | `Large` |
| Medium | 600–1023 px | `Medium` |
| Small | < 600 px | `Small` |

The exact names and breakpoints come from the Foundation Profile. If an older file uses `Desktop / Tablet / Mobile` as Web modes, record that in the Profile as an alias and keep using the file's names in reports, but never call a Web viewport a "platform".

### How Web responsiveness is built (one mechanism)

1. **Values that change by viewport** (type size, line height, spacing, min target) → variables in the viewport collection, with modes `Large / Medium / Small`. The frame mode selects them.
2. **Layout that changes by width** → Auto Layout Hug / Fill / min / max / wrap.
3. **No viewport variants** on the component set. A `Size` axis is a consumer choice, not a viewport.

## 3. Touch and pointer defaults

Targets come from the Foundation Profile. If the Profile is silent, use these defaults and say so:

| Platform | Minimum target | Basis |
|---|---|---|
| Web | 24 × 24 CSS px (WCAG 2.5.8 AA). Product default for primary controls: 40 px height | WCAG 2.2 |
| Tablet | 48 × 48 dp | Material guidance |
| Mobile | 44 × 44 pt (iOS) / 48 × 48 dp (Android) — use the larger when the app ships on both | Apple HIG / Material |

The visual size may be smaller than the target; the hit area must not be.

## 4. Sibling delta contracts

After `{Component} / Web` is Approved, Tablet and Mobile may be planned as **delta contracts** (see `/ds-plan`, mode "Sibling delta"):

- New contract ID per platform (`CC-BUTTON-TABLET-001`).
- Contains only a **delta table** against the parent contract plus anything that must differ (targets, hover → pressed, density). Unchanged sections say `Same as CC-BUTTON-WEB-001 v1.0 §n`.
- Still a separate Review (delta mode), Build, Test and Document run.
- Property names and values stay identical across siblings unless a `DEC-*` says why (family parity).
