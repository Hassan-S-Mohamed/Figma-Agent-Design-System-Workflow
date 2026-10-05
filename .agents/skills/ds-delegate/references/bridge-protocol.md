# Bridge Protocol: Antigravity <-> Figma Agent

This protocol defines the formal interaction model between **Antigravity** (IDE reasoning agent) and the **Figma Agent** (Figma canvas implementer).

---

## 1. Dual Agent Division of Responsibilities

| Role | Antigravity (IDE Agent) | Figma Agent (Canvas Executor) |
|---|---|---|
| **Primary Focus** | Strategy, Architecture, Decision Support, Contract Generation | Direct Figma Canvas Manipulation, Layout, Variant Creation |
| **Data Access** | Reads filesystem state (`ds-state/`), calls Figma MCP to query canvas data | Executes Figma Plugin API calls, modifies nodes, sets variables |
| **Speed Acceleration** | Generates pre-populated contracts, tests APCA contrast math, plans dependency trees | Executes verified layout algorithms and batch operations in canvas |
| **Approval Gates** | Emits exact approval phrases for the user to confirm | Enforces approval validation before executing high-risk writes |

---

## 2. Communication Modes

### Mode A: Hybrid Automated (Figma MCP + In-App Skills)
- Antigravity queries Figma live state using `figma_get_status`, `figma_get_variables`, `figma_get_component`, or `figma_get_design_system_summary`.
- Antigravity generates the full Component Contract (`CC-*`) and saves it to `ds-state/{file-key}/contracts/`.
- Antigravity generates the exact command prompt and approval string for the user to trigger in Figma Agent or via slash commands.

### Mode B: Direct MCP Canvas Automation
- Antigravity calls `figma_execute` or specialized MCP tools (`figma_create_variable`, `figma_set_fills`, `figma_create_component_set`) to directly create elements if the user requests complete automation within the IDE.

---

## 3. Workflow State Synchronization

To ensure that both agents never overwrite each other:
1. **Default Storage**: `ds-state/{figma-file-key}/` in the workspace root.
   - `profile.md`: Foundations profile, token naming conventions, font pairings.
   - `ledger.md`: Status of every component $\times$ platform, current phase, open findings, node IDs.
   - `registry.md`: Append-only list of all generated IDs (`CC-*`, `FP-*`, `FG-*`, `QA-*`).
   - `contracts/CC-{COMP}-{PLAT}-{NNN}.md`: Active component contracts with Tables B–E.
2. **Revision Safety (`rev`)**:
   - Each state record contains a `rev` integer.
   - When Antigravity reads state, it records the current `rev`.
   - Before writing or updating state, Antigravity verifies `rev` hasn't changed.
3. **In-File Fallback (`_DS System`)**:
   - If the user prefers storing state directly in the Figma file, Antigravity respects the `_DS System` canvas page and uses plugin data or reads frames via MCP.

---

## 4. Standard Approval Gates & Commands

Figma workflow skills require strict, verbatim approval strings:

| Action | Skill | Exact Gate Phrase |
|---|---|---|
| **Generate Foundations** | `/ds-foundation-generate` | `Approve FG-{BRAND}-{STRUCTURE}-001 v1 Ready to Generate` |
| **Extend Token Collection** | `/ds-foundation-extend` | `Approve FP-{NAME}-{NNN} v1.0` |
| **Approve Component Build** | `/ds-build` | `Approve CC-{COMP}-{PLAT}-{NNN} v1.0 Ready to Build` |
| **Resume Interrupted Build** | `/ds-build` | `Proceed CC-{COMP}-{PLAT}-{NNN} v1.0` |
| **Approve Component Release** | `/ds-release` | `Approve Release {COMP} / {PLAT} v{VERSION}` |

Antigravity **must always present these phrases clearly in code blocks** so the user can easily review and accept or copy them into Figma Agent.
