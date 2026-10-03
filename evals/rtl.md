# Eval — Language and Direction

| # | Component | Check | Assertion |
|---|---|---|---|
| R1 | Button / Web | Plan §8c | Content row is Level 2 (`.Button/Content`), root is Level 1. There is no Direction axis on the main set |
| R2 | Button / Web | Build sandbox | In RTL the trailing icon renders on the physical left and the label is right-aligned. Re-checked LTR is unchanged |
| R3 | Button / Web | Generic icon slot | Not flipped. Docs explain picking a mirrored glyph |
| R4 | Toggle / Mobile | RTL | Knob starts on the right when Off and travels left. `On` still means On (DIR-004) |
| R5 | Input / Web | Email field in RTL | Label, helper and error use Arabic styles. The value `user@example.com` stays LTR and its characters are not reversed (LNG-003) |
| R6 | Calendar / Web | RTL | Month navigation arrows mirror. Digits in cells are not reversed |
| R7 | Avatar / Web | RTL | Level 1. Image and status glyph are not mirrored |
| R8 | Any | AR diacritics line `مُتَابَعَةُ الطَّلَبِ المُقَدَّمِ` in a fixed-height box | Not clipped (TXT-009), or reported as a finding |
| R9 | Any | AR Text Style with letter spacing 2% | Reported as `TXT-006` (Major) |
| R10 | Any | Report tables | Theme, Language and Direction always appear as separate columns. There is never one "EN LTR / AR RTL" cell |
| R11 | Any | AR strings | Each one is flagged `Stress copy — needs native review` and matches the meaning of its EN string |
| R12 | Any | Profile `numerals_AR: open-question` | Plan adds an `OQ-*`. Build does not choose a digit style silently |
