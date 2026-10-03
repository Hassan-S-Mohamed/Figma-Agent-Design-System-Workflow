/*
 * Shared Figma Plugin API helpers for the ds-* skills.
 * Paste this file before any script in scripts/figma/ (see scripts/README.md).
 * All functions are async-safe and never mutate source components.
 * Run through use_figma after loading the figma-use skill (standards/figma-tooling.md §5).
 * Write helpers return node IDs: nothing persists between use_figma calls, so pass IDs as strings.
 */

const DS_NAMESPACE = 'ds_workflow';
const SYSTEM_PAGE = '_DS System';
const SANDBOX_PAGE = '_DS Sandbox';

/* ---------- Variables ---------- */

async function getCollectionsByName() {
  const list = await figma.variables.getLocalVariableCollectionsAsync();
  return Object.fromEntries(list.map((c) => [c.name, c]));
}

async function findVariable(name, collectionName) {
  const vars = await figma.variables.getLocalVariablesAsync();
  const cols = await getCollectionsByName();
  const colId = collectionName ? cols[collectionName] && cols[collectionName].id : null;
  return vars.find((v) => v.name === name && (!colId || v.variableCollectionId === colId)) || null;
}

/**
 * Resolve a variable to its final value for a mode map, following aliases across collections.
 * modeMap: { [collectionName]: modeName }. Collections not in the map use their default mode.
 * Returns { value, chain: [variable names], modes: [mode names] }.
 */
async function resolveVariable(variable, modeMap = {}, depth = 0) {
  if (depth > 20) throw new Error(`Alias chain too deep at ${variable.name} (circular?)`);
  const col = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
  const wanted = modeMap[col.name];
  const mode = (wanted && col.modes.find((m) => m.name === wanted)) || col.modes.find((m) => m.modeId === col.defaultModeId);
  const raw = variable.valuesByMode[mode.modeId];
  if (raw === undefined) {
    return { value: null, chain: [variable.name], modes: [`${col.name}:${mode.name}`], missing: true };
  }
  if (raw && raw.type === 'VARIABLE_ALIAS') {
    const target = await figma.variables.getVariableByIdAsync(raw.id);
    if (!target) return { value: null, chain: [variable.name, '(broken alias)'], modes: [mode.name], broken: true };
    const next = await resolveVariable(target, modeMap, depth + 1);
    return { ...next, chain: [variable.name, ...next.chain], modes: [`${col.name}:${mode.name}`, ...next.modes] };
  }
  return { value: raw, chain: [variable.name], modes: [`${col.name}:${mode.name}`] };
}

async function variableInfo(id) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (!v) return null;
  const col = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
  return { id, name: v.name, collection: col.name, type: v.resolvedType, scopes: v.scopes, hidden: v.hiddenFromPublishing };
}

/* ---------- Nodes ---------- */

async function findComponentSet(name) {
  await figma.loadAllPagesAsync();
  for (const page of figma.root.children) {
    const hit = page.findOne((n) => (n.type === 'COMPONENT_SET' || n.type === 'COMPONENT') && n.name === name);
    if (hit) return hit;
  }
  return null;
}

function walk(node, visit, path = []) {
  const here = [...path, node.name];
  visit(node, here);
  if ('children' in node) node.children.forEach((c) => walk(c, visit, here));
}

function variantLabel(node) {
  let n = node;
  while (n && n.type !== 'COMPONENT') n = n.parent;
  if (!n) return '(not in a component)';
  return n.variantProperties
    ? Object.entries(n.variantProperties).map(([k, v]) => `${k}=${v}`).join(', ')
    : n.name;
}

function renderBox(node) {
  const r = node.absoluteRenderBounds || node.absoluteBoundingBox;
  return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
}

/** Accept a node or a node ID string (IDs are how later use_figma calls refer to nodes). */
async function nodeRef(nodeOrId) {
  return typeof nodeOrId === 'string' ? figma.getNodeByIdAsync(nodeOrId) : nodeOrId;
}

/* ---------- In-file state store (opt-in, standards/workflow-state.md) ---------- */

async function getPage(name, create) {
  await figma.loadAllPagesAsync();
  let page = figma.root.children.find((p) => p.name === name);
  if (!page && create) {
    page = figma.createPage();
    page.name = name;
  }
  return page || null;
}

async function getStateFrame(kind, frameName, create) {
  const page = await getPage(SYSTEM_PAGE, create);
  if (!page) return null;
  let frame = page.children.find((n) => n.type === 'FRAME' && n.name === frameName);
  if (!frame && create) {
    frame = figma.createFrame();
    frame.name = frameName;
    page.appendChild(frame);
  }
  if (frame && !frame.getSharedPluginData(DS_NAMESPACE, 'kind')) frame.setSharedPluginData(DS_NAMESPACE, 'kind', kind);
  return frame;
}

async function readState(kind, frameName) {
  const frame = await getStateFrame(kind, frameName, false);
  if (!frame) return null;
  const raw = frame.getSharedPluginData(DS_NAMESPACE, kind);
  return raw ? JSON.parse(raw) : null;
}

/** State write, in-file mode only. Workspace mode writes ds-state/ files instead. */
async function writeState(kind, frameName, data) {
  const frame = await getStateFrame(kind, frameName, true);
  frame.setSharedPluginData(DS_NAMESPACE, kind, JSON.stringify(data));
  return { mutatedNodeIds: [frame.id] };
}

/* ---------- Checkpoint ---------- */

async function saveCheckpoint(title, description = '') {
  if (typeof figma.saveVersionHistoryAsync !== 'function') {
    return { saved: false, reason: 'saveVersionHistoryAsync not available — ask the human to save a named version' };
  }
  const result = await figma.saveVersionHistoryAsync(title, description);
  return { saved: true, id: result && result.id, title };
}

/* ---------- Sandbox (_DS Sandbox page) ---------- */

async function createSandbox(label) {
  const page = await getPage(SANDBOX_PAGE, true);
  const frame = figma.createFrame();
  frame.name = `Sandbox · ${label} · ${new Date().toISOString()}`;
  frame.layoutMode = 'VERTICAL';
  frame.itemSpacing = 40;
  frame.paddingTop = frame.paddingBottom = frame.paddingLeft = frame.paddingRight = 24;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.clipsContent = false;
  page.appendChild(frame);
  return { frame, frameId: frame.id, createdNodeIds: [frame.id] };
}

/** Set a variable mode on a sandbox frame (node or ID) by names. */
async function setSandboxMode(frameOrId, collectionName, modeName) {
  const frame = await nodeRef(frameOrId);
  if (!frame) throw new Error(`Sandbox frame not found: ${frameOrId}`);
  const col = (await getCollectionsByName())[collectionName];
  if (!col) throw new Error(`Collection not found: ${collectionName}`);
  const mode = col.modes.find((m) => m.name === modeName);
  if (!mode) throw new Error(`Mode not found: ${collectionName}/${modeName}`);
  frame.setExplicitVariableModeForCollection(col, mode.modeId);
  return { mutatedNodeIds: [frame.id] };
}

/** Delete the sandbox frame (node or ID). Call it even after a failure. */
async function cleanupSandbox(frameOrId) {
  const frame = await nodeRef(frameOrId);
  const removedId = frame && !frame.removed ? frame.id : null;
  if (removedId) frame.remove();
  const page = await getPage(SANDBOX_PAGE, false);
  return { cleaned: true, removedNodeIds: removedId ? [removedId] : [], remaining: page ? page.children.length : 0 };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCollectionsByName, findVariable, resolveVariable, variableInfo, findComponentSet, walk, variantLabel,
    renderBox, readState, writeState, nodeRef, saveCheckpoint, createSandbox, setSandboxMode, cleanupSandbox,
  };
}
