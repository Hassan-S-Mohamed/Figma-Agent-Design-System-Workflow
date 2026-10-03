/*
 * Binding audit for one component set. Read-only.
 * Requires (paste first): scripts/figma/helpers.js
 *
 * Flags: raw fills/strokes (no variable, no style), primitive bindings, unbound padding/gap/radius,
 * rebuilt nested parts (frames named like a catalog component that are not instances), detached-looking layers.
 *
 * Usage:
 *   return await auditBindings({
 *     setName: 'Button / Web',
 *     primitiveCollections: ['Primitives'],          // from the Foundation Profile
 *     nestedNames: ['Icon', 'Spinner', 'Badge'],      // catalog components that must be instances
 *   });
 */

const NUMBER_FIELDS = [
  'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing', 'counterAxisSpacing',
  'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius',
];

async function auditBindings({ setName, primitiveCollections = ['Primitives'], nestedNames = [] }) {
  const set = await findComponentSet(setName);
  if (!set) return { error: `Component set not found: ${setName}` };

  const rows = [];
  const counts = { correct: 0, raw: 0, primitive: 0, unboundNumber: 0, rebuiltNested: 0 };
  const infoCache = new Map();
  const info = async (id) => {
    if (!infoCache.has(id)) infoCache.set(id, await variableInfo(id));
    return infoCache.get(id);
  };

  const nodes = [];
  walk(set, (node, path) => nodes.push({ node, path }));

  for (const { node, path } of nodes) {
    const where = { variant: variantLabel(node), layer: path.slice(2).join('/') || node.name };
    if (node.type === 'INSTANCE') continue; // nested instances are audited in their own set

    for (const field of ['fills', 'strokes']) {
      if (!(field in node) || !Array.isArray(node[field])) continue;
      const styleId = field === 'fills' ? node.fillStyleId : node.strokeStyleId;
      for (const paint of node[field]) {
        if (paint.visible === false || paint.type !== 'SOLID') continue;
        const alias = paint.boundVariables && paint.boundVariables.color;
        if (alias) {
          const v = await info(alias.id);
          if (v && primitiveCollections.includes(v.collection)) {
            counts.primitive++;
            rows.push({ rule: 'TOK-002', ...where, field, issue: `Bound to primitive ${v.name}` });
          } else counts.correct++;
        } else if (styleId && styleId !== '') {
          counts.correct++;
        } else {
          counts.raw++;
          rows.push({ rule: 'TOK-001', ...where, field, issue: 'Raw color (no variable, no style)' });
        }
      }
    }

    if ('layoutMode' in node && node.layoutMode !== 'NONE') {
      const bound = node.boundVariables || {};
      for (const f of NUMBER_FIELDS) {
        if (!(f in node) || typeof node[f] !== 'number' || node[f] === 0) continue;
        if (f === 'counterAxisSpacing' && node.layoutWrap !== 'WRAP') continue;
        if (bound[f]) counts.correct++;
        else {
          counts.unboundNumber++;
          rows.push({ rule: 'TOK-003', ...where, field: f, issue: `Unbound value ${node[f]}` });
        }
      }
    }

    if (node.type === 'FRAME' || node.type === 'GROUP') {
      const hit = nestedNames.find((n) => node.name.toLowerCase().startsWith(n.toLowerCase()));
      if (hit) {
        counts.rebuiltNested++;
        rows.push({ rule: 'DEP-001', ...where, field: 'node', issue: `"${node.name}" looks like a rebuilt ${hit} (not an instance)` });
      }
    }
    if ('layoutPositioning' in node && node.layoutPositioning === 'ABSOLUTE') {
      rows.push({ rule: 'STR-006', ...where, field: 'layout', issue: 'Absolute position inside Auto Layout (check it is intentional)' });
    }
  }
  return { set: setName, counts, findings: rows };
}
