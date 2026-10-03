/*
 * Text Style audit for one component set (or the Arabic style rules for all local styles). Read-only.
 * Requires (paste first): scripts/figma/helpers.js
 *
 * Usage:
 *   return await auditTextStyles({ setName: 'Button / Web', prefixes: { EN: 'Text/EN/', AR: 'Text/AR/' } });
 *   return await auditArabicStyles({ prefix: 'Text/AR/', minLineHeight: 1.5 });
 */

const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

async function auditTextStyles({ setName, prefixes = { EN: 'Text/EN/', AR: 'Text/AR/' } }) {
  const set = await findComponentSet(setName);
  if (!set) return { error: `Component set not found: ${setName}` };
  const rows = [];
  const counts = { nodes: 0, styled: 0, missingStyle: 0, wrongLanguage: 0, overrides: 0 };
  const styleCache = new Map();
  const getStyle = async (id) => {
    if (!styleCache.has(id)) styleCache.set(id, await figma.getStyleByIdAsync(id));
    return styleCache.get(id);
  };

  const texts = [];
  walk(set, (node, path) => {
    if (node.type === 'TEXT') texts.push({ node, path });
  });

  for (const { node, path } of texts) {
    if (node.parent && node.parent.type === 'INSTANCE') continue;
    counts.nodes++;
    const where = { variant: variantLabel(node), layer: path.slice(2).join('/') };
    const lang = ARABIC_RE.test(node.characters) ? 'AR' : 'EN';
    const segments = node.getStyledTextSegments(['textStyleId', 'fontSize', 'fontName', 'letterSpacing', 'lineHeight']);
    for (const seg of segments) {
      if (!seg.textStyleId) {
        counts.missingStyle++;
        rows.push({ rule: 'TXT-001', ...where, issue: `No Text Style on "${seg.characters.slice(0, 24)}"` });
        continue;
      }
      const style = await getStyle(seg.textStyleId);
      if (!style) {
        rows.push({ rule: 'TXT-001', ...where, issue: 'Text Style id not found (remote or deleted)' });
        continue;
      }
      counts.styled++;
      if (!style.name.startsWith(prefixes[lang])) {
        counts.wrongLanguage++;
        rows.push({ rule: 'TXT-003', ...where, issue: `${lang} content uses "${style.name}"` });
      }
      const differs =
        seg.fontSize !== style.fontSize ||
        seg.fontName.family !== style.fontName.family ||
        seg.fontName.style !== style.fontName.style ||
        JSON.stringify(seg.letterSpacing) !== JSON.stringify(style.letterSpacing) ||
        JSON.stringify(seg.lineHeight) !== JSON.stringify(style.lineHeight);
      if (differs) {
        counts.overrides++;
        rows.push({ rule: 'TXT-002', ...where, issue: `Local typography override on top of "${style.name}"` });
      }
    }
  }
  return { set: setName, counts, findings: rows };
}

async function auditArabicStyles({ prefix = 'Text/AR/', minLineHeight = 1.5 } = {}) {
  const styles = (await figma.getLocalTextStylesAsync()).filter((s) => s.name.startsWith(prefix));
  const rows = [];
  for (const s of styles) {
    const ls = s.letterSpacing;
    if (ls && ls.value !== 0) rows.push({ rule: 'TXT-006', style: s.name, issue: `Letter spacing ${ls.value}${ls.unit === 'PERCENT' ? '%' : 'px'} (must be 0)` });
    if (s.textCase && s.textCase !== 'ORIGINAL') rows.push({ rule: 'TXT-007', style: s.name, issue: `Case transform ${s.textCase}` });
    const lh = s.lineHeight;
    let ratio = null;
    if (lh.unit === 'PIXELS') ratio = lh.value / s.fontSize;
    if (lh.unit === 'PERCENT') ratio = lh.value / 100;
    if (lh.unit === 'AUTO') rows.push({ rule: 'TXT-008', style: s.name, issue: 'Line height AUTO — set an explicit value ≥ ' + minLineHeight });
    else if (ratio !== null && ratio < minLineHeight) rows.push({ rule: 'TXT-008', style: s.name, issue: `Line height ${ratio.toFixed(2)}× < ${minLineHeight}×` });
  }
  return { checked: styles.length, findings: rows };
}
