function escapeXmlText(value) {
  return String(value).replace(/[&<>]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[character]));
}

// Match the editor's text-node order, including dash placeholders as products.
// Old SVG exports can contain stale data indices, so never use those to locate edits.
function applyTextChanges(svg, changes) {
  if (!Array.isArray(changes) || changes.length > 500) throw new Error('قائمة التعديلات غير صحيحة');
  const values = new Map();
  for (const change of changes) {
    const index = Number.parseInt(change.index, 10);
    const value = String(change.value ?? '').trim();
    if (!Number.isInteger(index) || !value || value.length > 300) throw new Error('بيانات التعديل غير صحيحة');
    values.set(`${change.type === 'price' ? 'price' : 'product'}:${index}`, escapeXmlText(value));
  }
  let priceIndex = 0;
  let productIndex = 0;
  return svg.replace(/(<text\b[^>]*>)([\s\S]*?)(<\/text>)/gi, (match, start, body, end) => {
    const text = body.replace(/<[^>]+>/g, '').trim();
    const price = /^\s*[0-9٠-٩]+(?:\s*[.,،]\s*[0-9٠-٩]+)?\s*$/.test(text) && text.length <= 24;
    const digits = text.replace(/[^0-9٠-٩]/g, '');
    const phone = digits.length >= 8 && digits.length <= 24 && /[0-9٠-٩][\s-]*[0-9٠-٩]/.test(text);
    if (!price && (!text || phone || /\bdata-fixed-phone\s*=/i.test(start))) return match;
    const type = price ? 'price' : 'product';
    const index = price ? priceIndex++ : productIndex++;
    const cleanStart = start.replace(/\s+data-(?:price|product)-index\s*=\s*(?:"[^"]*"|'[^']*')/gi, '');
    const indexedStart = cleanStart.slice(0, -1) + ` data-${type}-index="${index}">`;
    return indexedStart + (values.get(`${type}:${index}`) ?? body) + end;
  });
}

module.exports = { applyTextChanges };
