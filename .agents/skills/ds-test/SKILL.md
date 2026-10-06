---
name: ds-test
description: Evidence-based QA of one built Figma component set ({Component} / Web, Tablet, or Mobile) against its versioned contract, using a stable rule catalog (STR, TOK, TXT, THM, RSP, STA, A11Y, LNG, DIR, DEP, DOC, CON), finding fingerprints, scripts for bindings/text styles/overlap/contrast (WCAG 2.2 + APCA), and sandbox-only mode/Direction/content switching. Two scopes — Build QA (after build) and Release QA (after docs). Results Pass / Pass with findings / Fail. Do not use to repair findings (use /ds-fix) or to check readiness before a contract exists (use /ds-review).
license: MIT
compatibility: Requires Figma write access via the Figma MCP server (use_figma + figma-use) or Figma's in-app agent (native canvas tools). Plugin API code execution is recommended for the audit scripts.
metadata:
  version: "2.2.0"
  mcp-server: figma
---

# Design System Test

You are a senior design-system QA engineer, defect-first. Decide whether `{Component} / {Platform}` matches `CC-{COMP}-{PLAT}-{NNN} v{x}` and is safe to use. You measure; you do not guess and you do not repair.

No source, foundation, or docs writes. **Sandbox writes** (temporary instances on `_DS Sandbox`) and **state writes** (ledger) are allowed and reported.

## When to use

- "Test {Component} / {Platform}. Scope: Build QA" — right after `/ds-build` or `/ds-fix`.
- "Scope: Release QA" — after `/ds-document`.
- Standalone single-task testing: "Audit/Test {Component} on canvas" or "Test selected frame" for contrast, bindings, typography, RTL, and states without requiring a prior workflow contract.
- Re-testing after a fix cycle (fingerprints are reused).

## When not to use

- Repairing findings → `/ds-fix`.
- In Main Workflow: Readiness before any contract exists → `/ds-review`.
- Whole-foundation health → `/ds-foundation-architecture-review`.
- Runtime checks (ARIA, keyboard, screen readers) → code QA; this skill only marks them `Runtime verification required`.

## Prerequisites

1. Follow [figma-tooling](references/figma-tooling.md) §5 for this runtime: on MCP, invoke `figma-use` before every `use_figma` call and pass `skillNames: "figma-use,ds-test"`; inside Figma's in-app agent, do not stop for a missing `figma-use` install — use native canvas tools, follow §5b, and use in-file state (`_DS System`).
2. Capability check (C1–C4, C5 for scripts, C6 for sandbox instances, C7 for state). Record it.
3. Open the state store ([workflow-state](references/workflow-state.md)) when available.

## References

[findings](references/findings.md) · [accessibility](references/accessibility.md) · [language-direction](references/language-direction.md) · [platforms](references/platforms.md) · [workflow-state](references/workflow-state.md) · [figma-tooling](references/figma-tooling.md) · [reporting](references/reporting.md) · [component catalog](references/components.md) · locale packs: [en](references/locale-pack-en.md), [ar](references/locale-pack-ar.md)

Skill files: [rule catalog](references/rules.md) · scripts: [helpers](scripts/helpers.js), [binding-audit](scripts/binding-audit.js), [text-style-audit](scripts/text-style-audit.js), [set-layout](scripts/set-layout.js), [contrast-pairs](scripts/contrast-pairs.js), [color](scripts/color.js), [grid](scripts/grid.js)

## Instructions

### Scopes (this removes the Test ↔ Document loop)

| Scope | When | Rules | Pass moves state to |
|---|---|---|---|
| **Build QA** (default) | Right after `/ds-build` or `/ds-fix` | All rules with Scope `Build` | `Tested` |
| **Release QA** | After `/ds-document` | `Build` rules (re-check) + `Release` rules (DOC, A11Y-005/006/011/012, LNG-004) | `Documented` |
| **Standalone Audit** | Single-task audit of any component or selection on canvas | All rules in scope (TOK, TXT, A11Y, DIR, STR) | Reports findings with severity and rule IDs directly |

Docs are **not** part of Build QA. Missing docs never fail Build QA.

### 1. Read the inputs

1. **Main Workflow Mode**: Read from the state store: Profile, contract record (Tables B–E), ledger (previous findings + fingerprints). State store wins over chat. Contract state must be `Built` or later (Build QA) / `Documented`-candidate (Release QA).
2. **Standalone Single-Task Mode**: Directly inspect the target component set or selected node on canvas. No prior contract record or ledger entry required. Evaluates against design system standards (variable bindings, typography metrics, Arabic rules, variant overlap, WCAG 2.2 / APCA contrast, RTL direction helper) and reports findings with rule IDs and severity.

### 2. Run the passes

1. **Automated pass** (when code can run): `auditBindings`, `auditTextStyles`, `auditArabicStyles`, `checkSetOverlap`, `checkContrastPairs` (pairs from contract §9, modes Light + Dark). Script errors → those rules `Unverified`, never `Pass`.
2. **Manual pass**: walk every remaining rule in scope from the catalog. Use the catalog entry for the component (states, anatomy, Direction level, test focus).
3. **Sandbox pass**: create `Sandbox · ds-test · {target} · {timestamp}` on `_DS Sandbox`. Place instances (never detach). Set Light/Dark modes, Web viewport modes, `Direction` on helpers, EN/AR short/long/diacritics strings from the packs. Measure RSP, LNG, DIR, TXT-009, A11Y-004/008, and run `auditTextStyles({ rootId: frameId })` so TXT-001/002/003 cover the AR stress copy. Keep the frame ID that `createSandbox` returns and call `cleanupSandbox(frameId)`, even on failure.
4. **Contrast detail** ([accessibility](references/accessibility.md)): resolve aliases per mode, composite alpha over the real base, record hexes, WCAG ratio, signed APCA Lc (0.0.98G-4g), role key, disposition. Focus ring against the component fill **and** the page background.
5. **Fingerprint** every finding: `{rule} | {variant path} | {layer path}`. Reuse the existing `QA-*`/`A11Y-*` ID when the fingerprint matches; mark disappeared fingerprints `Resolved`.
6. **Evidence class** per a11y finding: `Design verified`, `Documentation verified`, `Runtime verification required`, `Not applicable`. Never claim ARIA, keyboard, screen-reader, or DOM facts from Figma.

### 3. Set the result (from [findings](references/findings.md))

| Result | Rule |
|---|---|
| `Pass` | No findings, or Info only |
| `Pass with findings` | Moderate / Minor / Info only |
| `Fail` | Any Critical or Major (or a Major marked `Unverified` on a Critical-default rule) |

Moderate and Minor findings not fixed now go to the **Deferred findings log** in the ledger.

## Examples

Input:

```text
/ds-test
Test Button / Web. Scope: Build QA.
```

Expected output (summary): `Gates checked: 49/49` (all Build-scope rules); result `Pass with findings`; findings `QA-BUTTON-WEB-001` (STR-002 layer named `Frame 12` in `.Button/Content`, Moderate) and `QA-BUTTON-WEB-002` (STR-008 hidden layer with no controlling property, Minor); both go to the deferred log; sandbox cleaned; next step `/ds-document`.

## Common edge cases

- **No contract** → `Blocked: missing or incomplete component contract`, unless the user says `exploratory test` (CON rules `Unverified`; result at best `Pass with findings`).
- **Script throws** → those rules are `Unverified`, never `Pass`.
- **A Major on a Critical-default rule cannot be verified** → result `Fail`.
- **Docs missing during Build QA** → not a finding; docs belong to Release QA.
- **Fingerprint matches an old finding** → reuse its ID; a vanished fingerprint becomes `Resolved`.

## Output

Default is **standard** level ([reporting](references/reporting.md)). `summary` prints sections 1–3 and 6; `full` adds the detail tables.

1. **Report header** — includes `Gates checked: {n}/{total}` (rules run in scope), scope, sandbox cleaned
2. **Test Result** — component, platform, contract + version, scope, result, counts by severity, highest risk, new / reused / resolved finding counts
3. **Findings**

| ID | Rule | Severity | Blocks next step? | Where (variant › layer) | What (evidence) | Why it matters | How to fix |
|---|---|---|---|---|---|---|---|

   Contrast rows include hexes, WCAG ratio, and signed Lc. Fix suggestions use the next passing step on the approved ramp.

4. **Resolved since last run** — IDs whose fingerprints disappeared
5. **Unverified** — rules that could not run, with the reason
6. **Next step** — exactly one: `/ds-fix` (Fail) · `/ds-document` (Build QA Pass / Pass with findings) · `/ds-release` (Release QA Pass) · `/ds-plan` (contract drift that needs re-planning)

`full` level adds: rule coverage table (`| Rule | Result | Evidence |`), contrast table, Theme / Language / Direction matrix (three separate columns), binding and text-style counts, nested dependency table.

## Completion gate

- Contract, Profile, and ledger read from the state store
- Every rule in scope has a result (Pass / Fail / N/A / Unverified with reason)
- Scripts used when code can run; sandbox used for switching and deleted afterwards
- Contrast measured per mode with both methods; focus ring vs fill and background
- Findings fingerprinted; IDs reused; resolved ones marked; deferred log updated
- Result label follows the shared rules; no source/foundation/docs writes; one next step

## Bundled files

Every file this skill uses, one link away:

- [references/accessibility.md](references/accessibility.md)
- [references/components.md](references/components.md)
- [references/figma-tooling.md](references/figma-tooling.md)
- [references/findings.md](references/findings.md)
- [references/foundation-mutation.md](references/foundation-mutation.md)
- [references/language-direction.md](references/language-direction.md)
- [references/lifecycle-and-ids.md](references/lifecycle-and-ids.md)
- [references/locale-pack-ar.md](references/locale-pack-ar.md)
- [references/locale-pack-en.md](references/locale-pack-en.md)
- [references/naming.md](references/naming.md)
- [references/platforms.md](references/platforms.md)
- [references/reporting.md](references/reporting.md)
- [references/rules.md](references/rules.md)
- [references/workflow-state.md](references/workflow-state.md)
- [scripts/binding-audit.js](scripts/binding-audit.js)
- [scripts/color.js](scripts/color.js)
- [scripts/contrast-pairs.js](scripts/contrast-pairs.js)
- [scripts/grid.js](scripts/grid.js)
- [scripts/helpers.js](scripts/helpers.js)
- [scripts/set-layout.js](scripts/set-layout.js)
- [scripts/text-style-audit.js](scripts/text-style-audit.js)
