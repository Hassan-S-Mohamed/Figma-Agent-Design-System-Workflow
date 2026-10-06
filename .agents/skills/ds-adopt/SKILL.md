---
name: ds-adopt
description: Brings an existing Figma design-system file or existing component sets under the ds-* workflow without rebuilding them — sets up the state store, drafts a Foundation Profile from the live file for human confirmation, seeds the Registry, and writes as-is contracts (CC-* v0.x, mode Adopted) plus ledger rows for chosen components, with a first-pass findings scan. Use when a team already has foundations or components that were not made by this package. Do not use on an empty file (use /ds-foundation-generate) or to fix or rebuild components (use /ds-fix or /ds-build).
license: MIT
compatibility: Requires Figma write access via the Figma MCP server (use_figma + figma-use) or Figma's in-app agent (native canvas tools).
metadata:
  version: "2.2.0"
  mcp-server: figma
---

# Design System Adopt

You are the migration lead. Describe what already exists honestly, so the rest of the workflow can run on it. You change nothing in the source or foundations. State writes only.

The goal is a "workflow-ready" file:

1. A state store with Profile, Registry, Ledger.
2. A confirmed Foundation Profile that matches the file.
3. As-is contracts and ledger rows for the components the user picks.

## When to use

- "Adopt this file. Components: {Button / Web, Input / Web, …}" (or "all").
- A team has foundations or components that were made by hand or by another tool.
- `/ds-status` says "No workflow state for this file" and the file is not empty.

## When not to use

- Empty file → `/ds-foundation-generate`.
- Judging foundation quality → `/ds-foundation-architecture-review`.
- Repairing or rebuilding components → `/ds-fix` or `/ds-build`.

## Prerequisites

1. Follow [figma-tooling](references/figma-tooling.md) §5 for this runtime: on MCP, invoke `figma-use` before every `use_figma` call and pass `skillNames: "figma-use,ds-adopt"`; inside Figma's in-app agent, do not stop for a missing `figma-use` install — use native canvas tools, follow §5b, and use in-file state (`_DS System`).
2. Capability check (C1–C9); record it.
3. Choose the state store mode ([workflow-state](references/workflow-state.md) §1). Default: workspace `ds-state/{file-key}/`.

## References

[workflow-state](references/workflow-state.md) · [foundation-profile](references/foundation-profile.md) · [lifecycle-and-ids](references/lifecycle-and-ids.md) · [naming](references/naming.md) · [platforms](references/platforms.md) · [findings](references/findings.md) · [figma-tooling](references/figma-tooling.md) · [reporting](references/reporting.md) · [component catalog](references/components.md)

Scripts: [helpers](scripts/helpers.js) · [binding-audit](scripts/binding-audit.js) · [text-style-audit](scripts/text-style-audit.js)

## Instructions

1. **Inventory (read-only).** Collections, modes, groups, naming grammar, Text/Paint/Effect/Layout styles, fonts, viewport modes (map old `Desktop / Tablet / Mobile` Web modes as aliases to `Large / Medium / Small`, see [platforms](references/platforms.md)), component sets and their platform split, existing docs pages. Keep the node ID of every component set.
2. **Profile draft.** Fill every Profile field from evidence ([foundation-profile](references/foundation-profile.md)). Unknown fields stay `unknown`, never guessed. Show the draft and ask:

   ```text
   Confirm Profile FPR-{BRAND}-001 v1   (or: Revise Profile: …)
   ```

   Write the Profile record only after that phrase.
3. **Registry seed.** Scan component descriptions and any old state for existing IDs (`CC-`, `FP-`, `QA-`, …) and set each family's last number so new IDs never collide.
4. **As-is contracts** (per chosen component):
   - Map the component to a catalog entry. Not in the catalog → record as `custom` and continue.
   - Platform comes from the set name. A set mixing platforms → finding `STR-001`/Major and a recommendation to split (never split here).
   - Write `CC-{COMP}-{PLAT}-NNN v0.1`, state `Draft`, mode `Adopted`: Table B from the live properties, §10 from live bindings, §8 from what exists (Direction level inferred: none / helper / axis). Mark every unknown section `Unknown — fill in /ds-plan`.
   - Ledger row with the set's node ID: state `Draft`, next action `/ds-review` then `/ds-plan` (Revision) to reach `Ready to Build`. After approval the component can go straight to `/ds-test` (no rebuild) when the as-is build already matches.
5. **First-pass scan.** Run `auditBindings` and `auditTextStyles` on each chosen set (when code can run). Record counts by rule as **Info** in the ledger. This scan is not a test result.

## Examples

Input:

```text
/ds-adopt
Adopt this file. Components: Button / Web.
```

Expected output (summary): inventory of 3 collections and 14 Text Styles; Profile draft `FPR-ACME-001 v1` with two `unknown` fields; the phrase `Confirm Profile FPR-ACME-001 v1`; adopted row `Button / Web · Button · Web · CC-BUTTON-WEB-001 v0.1 · Direction: none · 6 TOK-001 (Info)`; next step `Confirm Profile FPR-ACME-001 v1`.

## Common edge cases

- **Profile not confirmed** → write Registry and nothing else; the next step stays the confirmation phrase.
- **Set mixes Web and Mobile** → `STR-001`/Major; adopt it as-is and recommend a split in `/ds-plan`.
- **Theme or Language baked into variants** → record under Structural issues; never restructure here.
- **Code cannot run** (C5 no) → skip the scan and mark it `Unverified`.
- **An old `_DS System` page exists** → use In-file mode unless the user types `Move state to workspace`.

## Output

Standard level ([reporting](references/reporting.md)):

1. **Report header**
2. **Adoption summary** — collections, styles, components found; Profile status (draft / confirmed); components adopted
3. **Profile draft** (fields with evidence) and the confirmation phrase
4. **Adopted components** — `| Component set | Catalog match | Platform | Contract | Direction level found | First-pass scan |`
5. **Structural issues** — mixed-platform sets, Theme/Language variants, missing Dark values
6. **Next step** — `Confirm Profile …` · `/ds-review {first target}` · `/ds-foundation-architecture-review`

## Completion gate

- Inventory complete; Profile drafted from evidence with unknowns marked; written only after confirmation
- Registry seeded without collisions
- As-is contracts and ledger rows (with node IDs) written for chosen components; nothing in source or foundations changed
- One next step

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
- [scripts/binding-audit.js](scripts/binding-audit.js)
- [scripts/helpers.js](scripts/helpers.js)
- [scripts/text-style-audit.js](scripts/text-style-audit.js)
