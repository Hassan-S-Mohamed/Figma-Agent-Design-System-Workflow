# Fast-Track Playbook: From Blank Canvas to Production Design System

This playbook provides high-speed, battle-tested templates and sequences to take a design system from zero to fully documented in the shortest possible time.

---

## 1. 10-Minute Foundation Starter Pack

When starting from a blank Figma canvas, do not spend hours manually configuring color steps. Use standard functional tokens based on the **Primer** or **Tailwind** design token architecture:

### Preset A: Modern Corporate / SaaS (Primer-based)
- **Primary Brand**: `#0B5FFF` (Accessible Electric Blue)
- **Neutral Base**: Slate / Cool Gray (`#0F172A` to `#F8FAFC`)
- **Semantic Accents**:
  - Success: `#10B981` (Emerald)
  - Warning: `#F59E0B` (Amber)
  - Danger: `#EF4444` (Rose / Crimson)
  - Info: `#3B82F6` (Sky Blue)
- **Typography**:
  - English: `Inter`
  - Arabic: `IBM Plex Sans Arabic`
- **Variables Hierarchy**:
  - Collection `Primitives`: Raw color hexes, base spacing units (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`), base radius (`4px`, `8px`, `12px`, `9999px`).
  - Collection `Tokens`: Semantic aliases mapped to Light & Dark modes (`color/bg/default`, `color/fg/default`, `color/border/default`, `color/accent/primary`).

### Instant Generation Command for Figma Agent:
```text
/ds-foundation-generate
Generate Variables and Styles for Acme. Structure: Primer. Brand primary: #0B5FFF.
Typefaces: Inter (EN), IBM Plex Sans Arabic (AR). Themes: Light, Dark.
```

Approval phrase to proceed:
```text
Approve FG-ACME-PRIMER-001 v1 Ready to Generate
```

---

## 2. Component Sprint Order

Follow the dependency graph strictly to prevent rebuilds ([catalog/components.md](../../catalog/components.md)):

```
Sprint 1 (Tier 0 Primitives):
  1. Icon (24x24 default, vector instance swap)
  2. Spinner (stroke-based circular loader)
  3. Divider (horizontal & vertical variants)
  4. Tooltip (bubble container with text & arrow)
  5. Icon Button (compact interactive target, consumes Icon + Tooltip)

Sprint 2 (Tier 1 Interactive Core):
  6. Button (Primary, Secondary, Outline, Ghost; consumes Icon & Spinner)
  7. Link (Inline, Standalone; consumes Icon)
  8. Badge (Status indicators; optional Icon)

Sprint 3 (Tier 1 Form Elements):
  9. Input (Text field; consumes Icon, Spinner, Icon Button)
  10. Text Area (Multi-line text field; consumes Input patterns)
  11. Checkbox & Radio Button
  12. Toggle (Switch)
```

---

## 3. Fast-Track Component Contract Template (`Button / Web`)

Antigravity auto-populates the Component Contract (`CC-BUTTON-WEB-001 v1.0`) so the user only reviews and approves:

```markdown
# CC-BUTTON-WEB-001 v1.0
Component: Button / Web
Scope: New
Owner: Design System Team

## Table B — Component Controls
- Variant: Primary | Secondary | Outline | Ghost | Danger
- Size: Large (48px) | Medium (40px) | Small (32px)
- State: Default | Hover | Active | Focus | Disabled | Loading
- HasLeadingIcon: Boolean (default: false)
- HasTrailingIcon: Boolean (default: false)
- Direction: LTR | RTL (Helper sub-component)

## Table C — Token Solves
- Primary Default: Bg = token.color.accent.primary, Text = token.color.fg.on-accent
- Secondary Default: Bg = token.color.bg.subtle, Text = token.color.fg.default
- Outline Default: Bg = transparent, Border = token.color.border.default, Text = token.color.fg.default
- Radius: token.radius.md (8px)
- Typography:
  - Large: text.body.large (16px / line-height 24px)
  - Medium: text.body.medium (14px / line-height 20px)
  - Small: text.body.small (12px / line-height 16px)

## Table D — Nested Configurations
- LeadingIcon: Instance of Icon (default: ArrowRight)
- TrailingIcon: Instance of Icon (default: ArrowRight)
- Spinner: Instance of Spinner (visible when State = Loading)

## Table E — Blocks
- Icon: Built (Tier 0)
- Spinner: Built (Tier 0)
- Status: Ready to Build
```

Approval phrase:
```text
Approve CC-BUTTON-WEB-001 v1.0 Ready to Build
```
