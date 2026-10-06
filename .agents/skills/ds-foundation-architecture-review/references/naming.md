# Naming Grammar

Default grammar for **files this package generates**. For existing files, the Foundation Profile records the real grammar and skills follow it.

## Variables

- Slash groups, lower-kebab segments: `color/bg/brand/default`, `spacing/md`, `radius/full`, `size/target/min`.
- One grammar per file. Do not mix `spacing-md` with `color/bg/...`.
- Order: `{category}/{role}/{variant}/{state}`. Drop segments that add nothing.
- State words (fixed set, in this order): `default`, `hover`, `focus`, `pressed`, `selected`, `disabled`, `error`, `loading`.
- Primitives: `{category}/{hue}/{step}` → `color/blue/600`, `number/4`. Hidden from publishing.
- Component tokens (only when the Profile allows them): `component/{component}/{role}/{variant}/{state}` → `component/button/bg/primary/hover`. They must alias a semantic token.
- Never use `new`, `test`, `final`, `copy`, `v2`, or numbered duplicates.

## Styles

| Style | Pattern | Example |
|---|---|---|
| Text | `Text/{LANG}/{Role}/{Size}` | `Text/AR/Body/Medium` |
| Effect | `Elevation/{level}` or `Effect/{role}` | `Elevation/2` |
| Paint (composite only) | `Paint/{role}` | `Paint/brand-gradient` |
| Layout guide | `Layout/{viewport}` | `Layout/Large` |

## Components and layers

- Component set: `{Component} / {Platform}` → `Button / Web`.
- Private helper components start with a dot: `.Button/Content`.
- Variant property names: Title Case (`Hierarchy`, `Size`, `State`). Values: lower-kebab (`primary`, `icon-only`).
- Layer names are logical, never physical: `Leading`, `Label`, `Trailing`, `Start`, `End`, `Helper`, `Error`. Avoid `Left` / `Right` unless the meaning is physical.
