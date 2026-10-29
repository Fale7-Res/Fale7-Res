(function(root) {
  function menuImageUrl(page, width, updatedAt) {
    const file = page.previewFiles?.[String(width)] || (width === 1600 ? page.previewFile : null);
    if (file && /^previews\/[a-zA-Z0-9_-]+\.webp$/.test(file)) return '/' + file;
    return `/api/pages/${encodeURIComponent(page.id)}/preview.webp?w=${width}&v=${encodeURIComponent(page.updatedAt || updatedAt || '')}`;
  }
  if (typeof module !== 'undefined') module.exports = { menuImageUrl };
  else root.menuImageUrl = menuImageUrl;
})(typeof window !== 'undefined' ? window : globalThis);
