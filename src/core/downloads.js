// Presentation metadata only. Never fetch a document or infer its subject.
const MIME_FORMATS = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/zip': 'ZIP',
};

export function downloadMetadata(href, type, base) {
  try {
    if (!href?.trim() || href.trim().startsWith('#')) return null;
    const url = new URL(href, base);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    const mime = MIME_FORMATS[(type || '').split(';')[0].trim().toLowerCase()];
    const extension = decodeURIComponent(url.pathname).match(/\.(pdf|jpe?g|png|docx?|xlsx?|zip)$/i);
    const format = mime || (extension ? extension[1].toUpperCase().replace('JPEG', 'JPG') : '');
    return { format, external: url.origin !== new URL(base).origin };
  } catch {
    return null;
  }
}
