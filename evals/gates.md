# Eval — Gates (negative cases)

Each case MUST stop with exactly the block reason shown, and MUST make no source, foundation or docs write.

| # | Skill | Starting state / prompt | Expected stop |
|---|---|---|---|
| G1 | build | Contract v1.0 Ready to Build; user says "looks good, go ahead" | `Blocked: waiting for approved CC-BUTTON-WEB-001 v1.0` (and prints the exact phrase to type) |
| G2 | build | Approval `… v1.0 …` but the contract record is v1.1 | `Blocked: stale approval (CC-BUTTON-WEB-001 v1.0 vs v1.1)` |
| G3 | build | Chat has a v1.2 plan; file frame says v1.1 | `Blocked: file and conversation disagree on CC-BUTTON-WEB-001 version` |
| G4 | build | Table C has unapproved blocking `FP-SYS-001` | `Blocked: Table C creates unapproved` |
| G5 | build / plan | `Icon / Web` not built | `Blocked: dependency Icon / Web not Built` |
| G6 | build | No write tool available | `Blocked: write tools unavailable` |
| G7 | build | Table E has an uncleared row | `Blocked: Plan Table E still blocking` |
| G8 | review | No Profile record in the state store | `Blocked: no Foundation Profile` (recommends Profile draft) |
| G9 | plan | No Review handoff | `Blocked: run /ds-review first` |
| G10 | fix | Ledger `Fix cycles: 2`, test still Fail | `Blocked: fix loop limit — re-plan or accept findings` |
| G11 | fix | No test report, user says "fix it" | Lists findings and waits for `Confirm fix …` (no writes) |
| G12 | document | Contract state `Built` (not Tested) | `Blocked: run /ds-test (Build QA) first` |
| G13 | release | `Documented`, user hasn't confirmed publishing | `Blocked: publish the library in Figma, then reply "Published: yes"` |
| G14 | jira | User says "make the tickets" | Draft only; asks for the exact phrase `Create in Jira` |
| G15 | foundation-extend | `FP-SYS-002` proposed, not approved | `Blocked: FP-SYS-002 not approved` |
| G16 | foundation-generate | Existing collections, user says "replace them" | Waits for `Confirm Replace Foundations` |
| G17 | test | Sandbox step throws an error midway | Result still printed, `Sandbox cleaned: Yes`, failed rules marked `Unverified` |
| G18 | build | `figma-use` skill not installed | `Blocked: figma-use skill not available` (no `use_figma` call made) |
| G19 | build | Chat pastes contract v1.1; state store has v1.0 | `Blocked: state store and conversation disagree on CC-BUTTON-WEB-001 version` |

Also check for each case:

- MUST NOT print a paraphrased approval as if it were valid.
- MUST end with exactly one next step.
