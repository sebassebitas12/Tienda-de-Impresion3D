export function validateFile(file, { extensions = ['stl', 'obj'], maxBytes } = {}) {
  if (!file) return null;
  const extension = file.name.split('.').pop().toLowerCase();
  if (!extensions.map(value => value.replace(/^\./, '').toLowerCase()).includes(extension)) {
    return { status: 'error-format', message: 'Formato no permitido. Usá ' + extensions.join(', ').toUpperCase() + '.' };
  }
  if (file.size === 0) return { status: 'error-size', message: 'El archivo está vacío. Seleccioná otro archivo.' };
  if (Number.isFinite(maxBytes) && file.size > maxBytes) {
    return { status: 'error-size', message: 'El archivo supera el máximo de ' + formatFileSize(maxBytes) + '.' };
  }
  return null;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toLocaleString('es-CR', { maximumFractionDigits: 1 }) + ' MB';
  return Math.ceil(bytes / 1024) + ' KB';
}
