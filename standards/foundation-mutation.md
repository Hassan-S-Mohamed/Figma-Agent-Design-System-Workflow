# Foundation Mutation (the one path)

Creating or changing a shared Variable, collection, mode, or Style changes **every consumer**. There is exactly one procedure for it. Skills that need it:

| Skill | Calls this procedure for |
|---|---|
| `/ds-foundation-generate` | Bootstrap after `Approve FG-… vN Ready to Generate` |
| `/ds-foundation-extend` | Approved `FP-*` items, run on their own |
| `/ds-build` Phase 1 | Approved `FP-*` rows in Plan Table C |
| `/ds-fix` | Approved `FP-*` found during repair |

## Gate

1. Each item has an `FP-*` (or `FG-*` table row) with every field below.
2. The human typed an approval that names the ID (and version for `FG`).
3. Capability check passed C1, C2, C6 (and C9 for new modes).
4. A checkpoint was saved.

## Required proposal fields

ID · type (variable / text style / effect style / paint style / layout guide / collection / mode) · exact name (per [naming.md](naming.md) or the Profile grammar) · collection or style group · data type · scopes · modes and values (alias first) · code syntax (WEB/ANDROID/iOS, when the Profile uses it) · description · hidden from publishing? · rationale · affected components · alternative considered · risk · approval status.

## Execution (in order)

1. **Re-verify** the gap still exists. If an equivalent now exists under another name → stop with `Blocked: live file drift` (never create a parallel token).
2. Create in the **existing** collection or style group named in the proposal. Never create a new collection unless the proposal type is `collection`.
3. Primitives: raw value, `hiddenFromPublishing = true`, scopes `[]`.
4. Semantic/component tokens: **alias** a primitive (or semantic) per mode; exact scopes (`FRAME_FILL`, `SHAPE_FILL`, `TEXT_FILL`, `STROKE_COLOR`, `GAP`, `CORNER_RADIUS`, `WIDTH_HEIGHT`, …); no `ALL_SCOPES` without a reason.
5. Fill **every mode**. An empty Dark value is a failure.
6. Set description and code syntax.
7. Styles: bind to variables where Figma allows; never invent shadow geometry; Arabic Text Styles follow [language-direction.md](language-direction.md) §4.
8. Re-read what was created and compare to the proposal (name, type, scopes, values per mode).
9. Log each item: ID · action · result · **rollback** (inverse action).
10. Update the Registry, Ledger, and — if the role set changed — the Foundation Profile (version bump).

## Never

- Rename or delete existing foundations (that is a migration: `MIG-*` + approval).
- Duplicate a solid color as both a Paint Style and a variable without a written migration reason.
- Combine axes in one mode name (`Dark-Mobile-AR`).
- Publish the library.
