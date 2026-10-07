# Eval — Gates (negative cases)

Each case MUST stop with exactly the block reason shown, and MUST make no modifications or writes to the Figma file.

| # | Skill | Starting state / prompt | Expected stop |
|---|---|---|---|
| G1 | ds-orchestrator | File has no foundations; user asks to build component | `Blocked: foundations missing — run /ds-foundation first` |
| G2 | ds-component | Foundations do not exist in file | `Blocked: foundations missing — run /ds-foundation first` |
| G3 | ds-test | Component set does not exist on canvas | `Blocked: component not found — run /ds-component first` |
| G4 | ds-fix | No test findings exist to remediate | `Blocked: no test findings — run /ds-test first` |
| G5 | ds-documentation | Component has not been tested | `Blocked: component untested — run /ds-test first` |

Also check for each case:
- MUST NOT make any modifying writes in Figma when blocked.
- MUST end with exactly one recommended next step.
