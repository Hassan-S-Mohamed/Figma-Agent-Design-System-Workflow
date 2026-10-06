---
name: ds-handoff
description: Prepares the developer handoff for a released (or tested) Figma component and its foundations — DTCG 2025.10 token export with modes and aliases (Style Dictionary ready), Figma property to code prop mapping (Code Connect ready), runtime accessibility notes from the WAI-ARIA APG pattern, Direction and Language implementation notes, and the contrast evidence table. Read-only in Figma; outputs files or text. Do not use for design-side docs pages (use /ds-document) or to write production component code.
license: MIT
compatibility: Requires Figma write access via the Figma MCP server (use_figma + figma-use) or Figma's in-app agent (native canvas tools). Writes export files only when the runtime has a workspace.
metadata:
  version: "2.2.0"
  mcp-server: figma
---

# Design System Handoff

You are the design-to-code bridge. Translate the verified Figma contract into what engineers need, without claiming runtime behavior Figma cannot prove. Give developers one package for `{Component} / {Platform}`:

1. Tokens it uses (export).
2. Props it exposes (mapping).
3. How it must behave at runtime (APG, keyboard, ARIA, RTL).

Read-only in Figma. Outputs are files in the workspace (when allowed) or text in the report.

## When to use

- "Handoff {Component} / {Platform}. Outputs: tokens, props, runtime." after release (or after Build QA).
- Standalone single-task handoff: "Handoff {Component} / {Platform}" or "Export tokens and props for {Component} / selection" without requiring prior test workflow state.
- Exporting the component's tokens in DTCG format for Style Dictionary.

## When not to use

- In Main Workflow: Component not tested yet → `/ds-test` first (or use Standalone Handoff mode to inspect canvas component directly).
- Design-side docs pages → `/ds-document`.
- Writing or generating production component code → outside this package.
- Publishing Code Connect mappings → Figma's Code Connect tooling (this skill only prepares the mapping table).

## Prerequisites

1. Follow [figma-tooling](references/figma-tooling.md) §5 for this runtime: on MCP, invoke `figma-use` before every `use_figma` call and pass `skillNames: "figma-use,ds-handoff"`; inside Figma's in-app agent, do not stop for a missing `figma-use` install — use native canvas tools, follow §5b, and use in-file state (`_DS System`).
2. Capability check (C1, C3, C4; C5 for `resolveVariable`); record it.
3. Open the state store ([workflow-state](references/workflow-state.md)) when available.

## References

[accessibility](references/accessibility.md) · [language-direction](references/language-direction.md) · [naming](references/naming.md) · [foundation-profile](references/foundation-profile.md) · [figma-tooling](references/figma-tooling.md) · [workflow-state](references/workflow-state.md) · [reporting](references/reporting.md) · [component catalog](references/components.md)

Scripts: [helpers](scripts/helpers.js) (`resolveVariable`, `variableInfo`)

## Instructions

### 1. Check the gate

- **Main Workflow Mode**: Read the contract record and Profile from the state store. Contract state must be `Tested` or later (prefer `Released`). Earlier → `Blocked: component not tested`. Foundations-only handoff needs a Profile.
- **Standalone Single-Task Mode**: Directly inspect the target component set or selected node on canvas and read its bound variables/styles. Exports DTCG 2025.10 tokens, Code Connect prop mappings, APG runtime notes, and contrast evidence directly without requiring pre-existing workflow state.

### 2. Produce the outputs

#### 1. Token export (DTCG 2025.10 format)

- One group per collection; `$type` from the variable type (`color`, `dimension`, `fontFamily`, `fontWeight`, `number`, …); `$value` as an alias `{group.token}` when the variable is aliased, else the raw value; `$description` from the variable description.
- Modes: one file per mode (`tokens.light.json`, `tokens.dark.json`, `tokens.viewport-small.json`, …) or `$extensions["com.figma"].modes` — state which.
- Names follow the variable's code syntax when set, else the Figma path in kebab-case.
- Text, Effect, and Layout Styles export as composite tokens (`typography`, `shadow`) where DTCG supports them; mark the rest `Transform required` or `Lossy`.
- Primitives included but flagged `private` when hidden from publishing.
- Scope: only tokens this component uses (from contract §10), unless the user asks for the full set.

Label every mapping `Direct`, `Transform required`, `Lossy`, or `Unsupported`. Never claim full DTCG compliance — say "exported in DTCG format; validate with your toolchain".

#### 2. Prop mapping (Code Connect ready)

| Figma property | Kind | Values | Code prop | Code values | Notes |
|---|---|---|---|---|---|

From Table B and contract §13. Missing code names → `TBD (ask engineering)`. Exposed nested helper `Direction` → usually inherited from `dir`, not a prop.

#### 3. Runtime notes

| Topic | Requirement |
|---|---|
| APG pattern | From the catalog entry (e.g. Button, Menu Button, Switch, Dialog) with link |
| Keyboard | Keys and expected behavior |
| ARIA | Roles, states, properties (`aria-pressed`, `aria-expanded`, `aria-busy`, `aria-invalid`, …) |
| Focus | Visible ring spec (width, offset, token), focus order, focus return |
| Direction | Use `dir` / logical CSS properties (`margin-inline-start`, `inset-inline-end`); which icons mirror |
| Language | Font stacks per Profile (EN, AR + fallback), Arabic rules (no letter-spacing, no text-transform), numerals policy |
| Motion | Durations/easing tokens; `prefers-reduced-motion` behavior |
| Targets | Minimum hit area per platform |

All rows are `Implementation requirement` — not verified by Figma.

#### 4. Evidence

Contrast table from the latest test (pairs, modes, hexes, WCAG ratio, signed APCA Lc) and the test result + date.

## Examples

Input:

```text
/ds-handoff
Handoff Button / Web. Outputs: tokens, props, runtime.
```

Expected output (summary): `tokens.light.json` and `tokens.dark.json` with 14 tokens (12 `Direct`, 2 `Transform required` for the focus-ring shadow and typography); prop rows `Hierarchy → variant`, `Size → size`, `Label → children`, `Leading icon → startIcon`; Direction inherited from `dir`; runtime pattern APG Button (`aria-busy` while loading); contrast evidence from the latest test; next step `Attach to the Handoff ticket`.

## Common edge cases

- **Contract earlier than `Tested`** → `Blocked: component not tested`.
- **No code names in §13** → `TBD (ask engineering)`; never invent prop names.
- **Composite styles DTCG cannot express** → label `Lossy` or `Unsupported`.
- **No workspace** → print the JSON inline and say `Files: inline`.

## Output

Standard level ([reporting](references/reporting.md)):

1. **Report header**
2. **Handoff summary** — target, contract + version, state, files written (paths) or `inline`
3. Token export summary — counts by type and mapping label (+ files)
4. Prop mapping table
5. Runtime notes table
6. Evidence table
7. **Next step** — `Attach to the Handoff ticket` or `/ds-jira`

## Completion gate

- Gate respected; nothing written in Figma
- Tokens exported with aliases and modes, every mapping labeled
- Props mapped from Table B; runtime notes from the catalog's APG pattern; all marked as implementation requirements
- Evidence attached; one next step

## Bundled files

Every file this skill uses, one link away:

- [references/accessibility.md](references/accessibility.md)
- [references/components.md](references/components.md)
- [references/figma-tooling.md](references/figma-tooling.md)
- [references/findings.md](references/findings.md)
- [references/foundation-mutation.md](references/foundation-mutation.md)
- [references/foundation-profile.md](references/foundation-profile.md)
- [references/language-direction.md](references/language-direction.md)
- [references/lifecycle-and-ids.md](references/lifecycle-and-ids.md)
- [references/locale-pack-ar.md](references/locale-pack-ar.md)
- [references/locale-pack-en.md](references/locale-pack-en.md)
- [references/naming.md](references/naming.md)
- [references/platforms.md](references/platforms.md)
- [references/reporting.md](references/reporting.md)
- [references/workflow-state.md](references/workflow-state.md)
- [scripts/helpers.js](scripts/helpers.js)
