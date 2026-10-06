/*
 * Variant set grid planner. Pure function, no Figma API.
 * Implements the "Variant set canvas layout" rules of /ds-build:
 *   - 1 axis: one row, left to right
 *   - 2 axes: columns = axis 1, rows = axis 2
 *   - 3+ axes: groups (top to bottom) = every axis except the last two; columns = second last; rows = last
 *   - column width = widest cell in that column; row height = tallest cell in that row
 *   - gap >= 40, group gap >= 64, frame padding >= 24, items placed top-left in their cell
 */

const DEFAULTS = { gap: 40, groupGap: 64, padding: 24 };

function cartesian(lists) {
  return lists.reduce((acc, list) => acc.flatMap((prefix) => list.map((v) => [...prefix, v])), [[]]);
}

/**
 * @param {Array<{id:string, props:Object<string,string>, width:number, height:number}>} variants
 *        width/height should be render size (incl. strokes, focus rings, shadows).
 * @param {Array<{name:string, values:string[]}>} axes  in contract (Table B) order
 * @returns {{ positions: Array<{id,x,y}>, width:number, height:number, unplaced:string[], roles:Object }}
 */
function planGrid(variants, axes, options = {}) {
  const { gap, groupGap, padding } = { ...DEFAULTS, ...options };
  if (gap < 40 || groupGap < 64 || padding < 24) {
    throw new Error('planGrid(): gap >= 40, groupGap >= 64, padding >= 24 are required.');
  }
  if (!axes.length) throw new Error('planGrid(): at least one axis is required.');

  let groupAxes = [];
  let colAxis;
  let rowAxis = null;
  if (axes.length === 1) {
    colAxis = axes[0];
  } else {
    groupAxes = axes.slice(0, -2);
    colAxis = axes[axes.length - 2];
    rowAxis = axes[axes.length - 1];
  }

  const groups = cartesian(groupAxes.map((a) => a.values));
  const rows = rowAxis ? rowAxis.values : [null];
  const cols = colAxis.values;

  const key = (g, r, c) => JSON.stringify([g, r, c]);
  const cells = new Map();
  const unplaced = [];
  for (const v of variants) {
    const g = groupAxes.map((a) => v.props[a.name]);
    const r = rowAxis ? v.props[rowAxis.name] : null;
    const c = v.props[colAxis.name];
    const known =
      groupAxes.every((a, i) => a.values.includes(g[i])) &&
      cols.includes(c) &&
      (!rowAxis || rows.includes(r));
    if (!known) {
      unplaced.push(v.id);
      continue;
    }
    const k = key(g, r, c);
    if (cells.has(k)) {
      unplaced.push(v.id);
      continue;
    }
    cells.set(k, v);
  }

  const colWidths = cols.map((c) =>
    Math.max(0, ...[...cells.values()].filter((v) => v.props[colAxis.name] === c).map((v) => v.width)),
  );
  const colX = [];
  colWidths.reduce((x, w, i) => {
    colX[i] = x;
    return x + w + (w > 0 ? gap : 0);
  }, padding);

  const positions = [];
  let y = padding;
  let maxRight = padding;
  groups.forEach((g, gi) => {
    let groupHasContent = false;
    rows.forEach((r) => {
      const rowCells = cols.map((c) => cells.get(key(g, r, c))).filter(Boolean);
      if (!rowCells.length) return;
      const rowHeight = Math.max(...rowCells.map((v) => v.height));
      cols.forEach((c, ci) => {
        const v = cells.get(key(g, r, c));
        if (!v) return;
        positions.push({ id: v.id, x: colX[ci], y });
        maxRight = Math.max(maxRight, colX[ci] + v.width);
      });
      y += rowHeight + gap;
      groupHasContent = true;
    });
    if (groupHasContent && gi < groups.length - 1) y += groupGap - gap;
  });

  const height = positions.length ? y - gap + padding : padding * 2;
  return {
    positions,
    width: maxRight + padding,
    height,
    unplaced,
    roles: {
      groups: groupAxes.map((a) => a.name),
      columns: colAxis.name,
      rows: rowAxis ? rowAxis.name : null,
    },
  };
}

/** Pairwise intersection test for render boxes {id,x,y,width,height}. */
function findOverlaps(boxes) {
  const hits = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      if (a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height) {
        hits.push([a.id, b.id]);
      }
    }
  }
  return hits;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { planGrid, findOverlaps, DEFAULTS };
}
