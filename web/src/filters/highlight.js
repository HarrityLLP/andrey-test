export default function(text, query) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  const escaped = text.replace(/[&<>"']/g, m => map[m]);
  if (!query) {
    return escaped;
  }

  const index = escaped.toLowerCase().indexOf(query.toLowerCase());
  if (index > -1) {
    return (
      escaped.substr(0, index) +
      '<mark class="marked">' +
      escaped.substr(index, query.length) +
      '</mark>' +
      escaped.substr(index + query.length, escaped.length)
    );
  } else {
    return escaped;
  }
}
