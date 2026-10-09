export function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
  }
  
  export function formatDateTime(iso) {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }
  
  export function excerpt(text, max = 160) {
    return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text;
  }