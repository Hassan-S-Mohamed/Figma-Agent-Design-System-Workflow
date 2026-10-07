# Eval — One positive case per skill

Every skill has at least one golden case here, so a change to any skill has something to check. `node scripts/check-evals.mjs` verifies that every active skill has a test entry in this table.

| # | Skill | Starting state / prompt | Expected (MUST) |
|---|---|---|---|
| K1 | ds-orchestrator | Prompt "Run workflow for Accordion on Web" | Evaluates current file state; announces stage 1 (Foundations); directs user to execute `/ds-foundation`. |
| K2 | ds-foundation | Prompt "Create foundations for brand #0B5FFF, Inter, Light/Dark" | Establishes `_Primitives` and `Semantic Tokens`; applies strict scopes (e.g. `TEXT_FILL`, `FRAME_FILL`, `GAP`); writes descriptions on every token and style; prompts `/ds-component`. |
| K3 | ds-component | Prompt "Build Accordion for Web, Tablet, Mobile" | Creates component-level variables (`component/accordion/*`) aliasing semantic foundations; builds subcomponents and main component set across viewports; binds component tokens. |
| K4 | ds-test | Prompt "Audit Accordion / Web" | Deeply inspects bindings, scoping, Auto Layout, WCAG 2.2 contrast across modes, touch targets, and RTL; outputs structured Test Findings Report with verdict and finding IDs. |
| K5 | ds-fix | Prompt "Fix test findings on Accordion / Web" | Resolves reported finding codes (binds raw values to component tokens, fixes contrast, adjusts touch target padding); confirms resolution. |
| K6 | ds-documentation | Prompt "Create documentation for Accordion / Web" | Constructs canvas documentation adhering to reference template (Anatomy Light/Dark, Props/Tokens tables, Variations, 5 Do's & Don'ts, Platform, A11y, Motion); appends single-line log to `.Changelog`. |

Also check for each case:
- MUST operate cleanly inside Figma Agent (Figma Design / Figma Make).
- MUST end with exactly one recommended next step.
