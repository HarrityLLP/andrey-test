export const getKeywordsFromSearchTerm = searchTerm => {
  if (!searchTerm || !searchTerm.length) {
    return [];
  }

  const keywords = [];
  const quoted = searchTerm.match(/".*?"/g);
  if (quoted) {
    for (const text of quoted) {
      searchTerm = searchTerm.replace(text, '');
      keywords.push(text.slice(1, text.length - 1));
    }
  }
  keywords.push(...searchTerm.trim().split(' '));
  return keywords.filter(s => !!s && s.length);
};
