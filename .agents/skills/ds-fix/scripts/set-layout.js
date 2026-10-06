/*
 * Variant set view: overlap check and grid layout.
 * Requires (paste first): scripts/lib/grid.js, scripts/figma/helpers.js
 *
 * checkSetOverlap is read-only.
 * layoutVariantSet mutates positions only (source write) — run it only inside /ds-build or /ds-fix after the gates.
 *
 * Usage:
 *   return await checkSetOverlap({ setName: 'Button / Web' });
 *   return await layoutVariantSet({ setName: 'Button / Web', axisOrder: ['Hierarchy', 'Size', 'State'], dryRun: true });
 */

async function checkSetOverlap({ setName }) {
  const set = await findComponentSet(setName);
  if (!set || set.type !== 'COMPONENT_SET') return { error: `Component set not found: ${setName}` };
  const boxes = set.children.map((c) => ({ id: c.name, ...renderBox(c) }));
  const overlaps = findOverlaps(boxes);
  const setBox = renderBox(set);
  const clipped = boxes
    .filter((b) => b.x < setBox.x || b.y < setBox.y || b.x + b.width > setBox.x + setBox.width || b.y + b.height > setBox.y + setBox.height)
    .map((b) => b.id);
  return {
    set: setName,
    variants: boxes.length,
    overlaps: overlaps.map(([a, b]) => ({ rule: 'STR-004', a, b })),
    clippedBySetFrame: clipped.map((id) => ({ rule: 'STR-005', id })),
  };
}

async function layoutVariantSet({ setName, axisOrder, dryRun = true, gap = 40, groupGap = 64, padding = 24 }) {
  const set = await findComponentSet(setName);
  if (!set || set.type !== 'COMPONENT_SET') return { error: `Component set not found: ${setName}` };
  if (set.layoutMode && set.layoutMode !== 'NONE') {
    return { error: 'Set uses Auto Layout. Manual grid placement skipped; check wrap/grid settings instead.' };
  }
  const defs = set.componentPropertyDefinitions;
  const order = axisOrder || Object.keys(defs).filter((k) => defs[k].type === 'VARIANT');
  const axes = order.map((name) => {
    if (!defs[name] || defs[name].type !== 'VARIANT') throw new Error(`Not a variant axis: ${name}`);
    return { name, values: defs[name].variantOptions };
  });

  const variants = set.children.map((c) => {
    const render = renderBox(c);
    const frame = c.absoluteBoundingBox;
    return {
      id: c.id,
      node: c,
      props: c.variantProperties,
      width: render.width,
      height: render.height,
      dx: frame.x - render.x,
      dy: frame.y - render.y,
    };
  });

  const plan = planGrid(variants, axes, { gap, groupGap, padding });
  if (!dryRun) {
    const byId = new Map(variants.map((v) => [v.id, v]));
    for (const p of plan.positions) {
      const v = byId.get(p.id);
      v.node.x = p.x + v.dx;
      v.node.y = p.y + v.dy;
    }
    set.resizeWithoutConstraints(plan.width, plan.height);
  }
  return {
    set: setName,
    dryRun,
    roles: plan.roles,
    size: { width: plan.width, height: plan.height },
    placed: plan.positions.length,
    unplaced: plan.unplaced.map((id) => (set.children.find((c) => c.id === id) || {}).name),
    mutatedNodeIds: dryRun ? [] : [set.id, ...plan.positions.map((p) => p.id)],
    rollback: dryRun ? null : 'Undo in Figma, or restore from the checkpoint saved at Phase 0',
  };
}
