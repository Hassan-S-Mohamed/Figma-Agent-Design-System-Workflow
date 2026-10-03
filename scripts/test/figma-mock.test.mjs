import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

/** Load scripts the same way an agent pastes them into a Plugin API runtime. */
function loadInRuntime(files, figma) {
  const context = vm.createContext({ figma, console, JSON, Math, Object, Array, Map, Error, String, Date });
  vm.runInContext(files.map(read).join('\n;\n'), context);
  return context;
}

function mockVariables() {
  const collections = [
    { id: 'c-prim', name: 'Primitives', modes: [{ modeId: 'p', name: 'Value' }], defaultModeId: 'p' },
    { id: 'c-sem', name: 'Semantic', modes: [{ modeId: 'l', name: 'Light' }, { modeId: 'd', name: 'Dark' }], defaultModeId: 'l' },
  ];
  const rgb = (hex) => ({
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
    a: 1,
  });
  const alias = (id) => ({ type: 'VARIABLE_ALIAS', id });
  const variables = [
    { id: 'v-white', name: 'color/white', variableCollectionId: 'c-prim', valuesByMode: { p: rgb('#FFFFFF') } },
    { id: 'v-black', name: 'color/neutral/950', variableCollectionId: 'c-prim', valuesByMode: { p: rgb('#0A0A0A') } },
    { id: 'v-blue', name: 'color/blue/600', variableCollectionId: 'c-prim', valuesByMode: { p: rgb('#0B5FFF') } },
    { id: 'v-text', name: 'color/text/primary', variableCollectionId: 'c-sem', valuesByMode: { l: alias('v-black'), d: alias('v-white') } },
    { id: 'v-bg', name: 'color/bg/surface/default', variableCollectionId: 'c-sem', valuesByMode: { l: alias('v-white'), d: alias('v-black') } },
    { id: 'v-onbrand', name: 'color/text/on-brand', variableCollectionId: 'c-sem', valuesByMode: { l: alias('v-white'), d: alias('v-white') } },
    { id: 'v-brand', name: 'color/bg/brand/default', variableCollectionId: 'c-sem', valuesByMode: { l: alias('v-blue'), d: alias('v-blue') } },
    { id: 'v-empty', name: 'color/border/focus', variableCollectionId: 'c-sem', valuesByMode: { l: alias('v-blue') } },
  ];
  return {
    variables: {
      getLocalVariableCollectionsAsync: async () => collections,
      getLocalVariablesAsync: async () => variables,
      getVariableByIdAsync: async (id) => variables.find((v) => v.id === id) || null,
      getVariableCollectionByIdAsync: async (id) => collections.find((c) => c.id === id) || null,
    },
  };
}

test('all Figma scripts parse together with their dependencies', () => {
  for (const file of ['contrast-pairs', 'binding-audit', 'text-style-audit', 'set-layout']) {
    assert.doesNotThrow(() =>
      loadInRuntime(['lib/color.js', 'lib/grid.js', 'figma/helpers.js', `figma/${file}.js`], {}),
    );
  }
});

test('contrast-pairs resolves aliases per mode and keeps polarity', async () => {
  const ctx = loadInRuntime(['lib/color.js', 'figma/helpers.js', 'figma/contrast-pairs.js'], mockVariables());
  const result = await ctx.checkContrastPairs({
    modes: [{ Semantic: 'Light' }, { Semantic: 'Dark' }],
    pairs: [
      { name: 'Body text', fg: 'color/text/primary', bg: 'color/bg/surface/default', role: 'body-text' },
      { name: 'Label on brand', fg: 'color/text/on-brand', bg: 'color/bg/brand/default', role: 'label-text' },
      { name: 'Focus (missing Dark)', fg: 'color/border/focus', bg: 'color/bg/surface/default', role: 'non-text-ui' },
    ],
  });
  const row = (pair, mode) => result.rows.find((r) => r.pair === pair && r.mode === `Semantic:${mode}`);

  assert.equal(row('Body text', 'Light').fgChain, 'color/text/primary → color/neutral/950');
  assert.ok(row('Body text', 'Light').apcaLc > 0, 'dark text on light bg is positive');
  assert.ok(row('Body text', 'Dark').apcaLc < 0, 'light text on dark bg is negative');
  assert.ok(row('Label on brand', 'Light').apcaLc < 0, 'white on brand is negative in Light mode too');
  assert.equal(row('Focus (missing Dark)', 'Dark').disposition, 'Unverified');
  assert.match(row('Focus (missing Dark)', 'Dark').error, /Unresolved/);
});

function mockPages() {
  const nodes = new Map();
  let next = 1;
  const makeNode = (type) => {
    const node = {
      id: `${next++}:1`, type, name: '', children: [], removed: false,
      appendChild(child) { child.parent = this; this.children.push(child); },
      remove() {
        this.removed = true;
        nodes.delete(this.id);
        if (this.parent) this.parent.children = this.parent.children.filter((c) => c !== this);
      },
    };
    nodes.set(node.id, node);
    return node;
  };
  const root = { children: [] };
  return {
    root,
    loadAllPagesAsync: async () => {},
    createPage: () => { const p = makeNode('PAGE'); root.children.push(p); return p; },
    createFrame: () => makeNode('FRAME'),
    getNodeByIdAsync: async (id) => nodes.get(id) || null,
  };
}

test('sandbox returns its node ID and a later call can delete it by ID', async () => {
  const figma = mockPages();
  const ctx = loadInRuntime(['figma/helpers.js'], figma);
  const created = await ctx.createSandbox('Button / Web');
  assert.deepEqual([...created.createdNodeIds], [created.frameId]);

  const result = await ctx.cleanupSandbox(created.frameId);
  assert.deepEqual([...result.removedNodeIds], [created.frameId]);
  assert.equal(result.remaining, 0);
  assert.equal(await figma.getNodeByIdAsync(created.frameId), null);

  const again = await ctx.cleanupSandbox(created.frameId);
  assert.equal(again.removedNodeIds.length, 0, 'cleanup is safe to repeat');
});
