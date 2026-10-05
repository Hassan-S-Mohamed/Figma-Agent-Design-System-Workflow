---
name: ds-delegate
description: >-
  Delegate orchestrator and thinking partner between Antigravity and Figma Agent for building
  a production design system from scratch at high speed with rigorous architecture, state tracking,
  and measured accessibility. Activates when designing, planning, auditing, or executing design system
  workflows in Figma.
---

# Design System Delegate Skill (`ds-delegate`)

The **`ds-delegate`** skill establishes Antigravity as the **Architect & Strategic Thinking Partner** who collaborates with the user, fetches canvas facts from Figma, makes sound design decisions, and delegates precise execution to the **Figma Agent** using the standardized workflow skills.

```mermaid
graph LR
  User[User / Designer] <--> |Brainstorm & Decisions (EN / AR)| AG[Antigravity IDE Agent]
  AG <--> |Fetch Missing Data (MCP)| FigmaFile[(Live Figma File)]
  AG --> |Draft Contracts & Approval Phrases| FA[Figma Agent]
  FA --> |Execute ds-foundation / ds-build / ds-test| FigmaFile
  FA --> |Update ds-state/ Ledger & Registry| AG
```

---

## 1. Core Principles

1. **Antigravity Thinks, Figma Agent Implements**: Antigravity runs the deep reasoning, dependency planning, contract drafting, and interactive decision-making. Figma Agent receives unambiguous, ready-to-run instructions and approved contracts.
2. **Speed with Structure**: Accelerate creation by using pre-curated foundation templates and pre-populated Component Contracts (`CC-*`) rather than drafting from scratch. Never bypass approval gates or accessibility verification.
3. **Data-Driven (Zero Guesswork)**: Whenever data is missing (existing colors, variable collections, component instances, text styles), Antigravity queries Figma via MCP before making decisions.
4. **Bilingual by Design (English & Arabic)**: English (LTR) and Arabic (RTL) typography, line-height constraints, and direction helpers are addressed from Day 1.

---

## 2. Fast-Track Lifecycle Workflow

Building a design system from scratch follows this structured 5-phase acceleration path:

### Phase 1: Foundation Discovery & Rapid Generation
1. **Interactive Discovery**: Antigravity prompts the user for brand identity:
   - Primary Brand Color (HEX) + secondary palette accents.
   - Typography pairings: English font (e.g., *Inter*, *Roboto*) + Arabic font (e.g., *IBM Plex Sans Arabic*, *Cairo*).
   - Architectural base: *Primer* (functional tokens), *Tailwind* (utility-aligned), or *Custom*.
   - Viewports & Themes: Web (Desktop, Tablet, Mobile viewports) + Themes (Light, Dark).
2. **Missing Data Inspection**: If the Figma file already has partial styles or colors, Antigravity calls MCP tools:
   - `figma_get_variables` or `figma_get_styles` to extract existing color styles or collections.
3. **Delegation Prompt**: Antigravity formats the exact foundation command and approval for the Figma Agent:
   ```text
   /ds-foundation-generate
   Generate Variables and Styles for {BrandName}. Structure: Primer. Brand primary: {HEX}.
   Typefaces: {EN_Font} (EN), {AR_Font} (AR). Themes: Light, Dark.
   ```
4. **Approval Gate**: Antigravity outputs the exact required gate phrase for the user:
   ```text
   Approve FG-{BRAND}-{STRUCTURE}-001 v1 Ready to Generate
   ```

---

### Phase 2: Foundation Audit & State Verification
1. **Live Verification**: Once Figma Agent generates foundations, Antigravity verifies via MCP:
   - Variable count and collection naming (`Primitives`, `Tokens`).
   - Light and Dark mode alias mappings.
   - Text styles with mode-aware line-height checks for Arabic ($\ge 1.4\times$).
2. **Architecture Review**: Trigger `/ds-foundation-architecture-review` to generate the official `Profile` in `ds-state/{file-key}/profile.md`.

---

### Phase 3: Dependency-Ordered Component Planning
Components must be built in dependency order ([catalog/components.md](../../catalog/components.md)):
- **Step 3A (Tier 0 Primitives)**: `Icon` $\rightarrow$ `Spinner` $\rightarrow$ `Divider` $\rightarrow$ `Tooltip` $\rightarrow$ `Icon Button` $\rightarrow$ `Menu`.
- **Step 3B (Tier 1 Foundations)**: `Button` $\rightarrow$ `Input` $\rightarrow$ `Checkbox` $\rightarrow$ `Toggle` $\rightarrow$ `Badge` $\rightarrow$ ...

**Antigravity's Fast-Drafting Role**:
1. Selects the next unblocked component from the ledger.
2. Drafts the full Component Contract (`CC-{COMP}-{PLAT}-001 v1.0`):
   - **Table B**: Properties (`Variant`, `Size`, `State`, `Direction`, `HasLeadingIcon`, etc.).
   - **Table C**: Token solves (Background, Text, Border, Radius, Spacing).
   - **Table D**: Nested configurations (e.g., `Icon` instance swaps, `Spinner` placement).
   - **Table E**: Block checks (verifies dependencies are already `Built`).
3. Presents key design choices to the user in English and Arabic for swift approval.

---

### Phase 4: Build & Safety Gates Delegation
1. Antigravity emits the exact approval command:
   ```text
   Approve CC-{COMP}-{PLAT}-001 v1.0 Ready to Build
   ```
2. Hands off to Figma Agent:
   ```text
   /ds-build
   Build {Component} on {Platform} from approved CC-{COMP}-{PLAT}-001 v1.0.
   ```
3. Checks output for created node IDs and checkpoint logging.

---

### Phase 5: Automated Testing, Documentation & Handoff
1. **QA Testing**: Antigravity instructs Figma Agent to run `/ds-test`.
   - Runs deterministic checks: `TOK-*` (token bindings), `A11Y-*` (WCAG 2.2 & APCA contrast), `DIR-*` (RTL layout & direction helper), `TXT-*` (Arabic font metrics).
2. **Auto-Fix (if needed)**: If findings are reported, Antigravity guides `/ds-fix` (up to 2 iterations).
3. **Documentation**: Antigravity delegates documentation generation:
   ```text
   /ds-document
   Create documentation page for {Component} on {Platform} with live interactive states.
   ```
4. **Handoff**: Antigravity exports code tokens and APG runtime accessibility notes via `/ds-handoff`.

---

## 3. Tool Reference for Antigravity

When inspecting Figma file context, Antigravity uses the available MCP server tools:

| Task | MCP Tool | Purpose |
|---|---|---|
| **Check Connection** | `figma_get_status` | Verifies WebSocket connection to Figma Desktop Bridge. |
| **Inspect File Metadata** | `figma_get_file_data` | Reads pages, frames, and root document structure. |
| **Read Variables & Tokens** | `figma_get_variables` | Retrieves variable collections, modes (Light/Dark), and token aliases. |
| **Read Text & Color Styles** | `figma_get_styles` | Inspects font families, font sizes, line heights, and paint fills. |
| **Inspect Selection** | `figma_get_selection` | Reads user's current selection on canvas for contextual advice. |
| **Component Details** | `figma_get_component` | Analyzes component properties, variants, and nested instances. |
| **Design System Kit** | `figma_get_design_system_kit` | Extracts full combined snapshot of tokens, components, and styles. |
| **Canvas Screenshot** | `figma_take_screenshot` / `figma_capture_screenshot` | Visual verification of canvas components and documentation layout. |

---

## 4. Bilingual Decision Guide (English & Arabic)

When Antigravity asks the user for design system choices, present them clearly in both languages:

### Key Inquiries:
1. **Brand Palette / لوحة ألوان الهوية**:
   - Primary Accent, Neutral Shades, Semantic Colors (Success, Warning, Danger, Info).
2. **Typography Pairings / تناسق الخطوط**:
   - Latin: *Inter*, *Roboto*, *SF Pro*, *Plus Jakarta Sans*.
   - Arabic: *IBM Plex Sans Arabic* (neutral/modern), *Cairo* (geometric/bold), *Readex Pro* (clean/tech), *Tajawal* (friendly).
   - Line height constraint: Arabic text must have line-height $\ge 1.4\times$ font-size to prevent glyph clipping.
3. **Direction & RTL Strategy / اتجاه الواجهة ودعم العربية**:
   - Figma Auto Layout doesn't flip order automatically. Use a dedicated `Direction = LTR | RTL` helper sub-component exposed on the parent component.

---

## 5. References & Deep Guides

- [Bridge Protocol & Commands](./references/bridge-protocol.md): How Antigravity and Figma Agent exchange state, syntax, and gates.
- [Fast-Track Playbook](./references/fast-track-playbook.md): High-speed templates for instant foundation and Tier 0 primitive setup.
- [Bilingual Guide & Typography](./references/bilingual-guide.md): Comprehensive English + Arabic typography and RTL layout rules.
