export const PRODUCT_IMAGE_LIMITS = Object.freeze({
  maxImages: 6,
  maxSourceBytes: 20 * 1024 * 1024,
  maxStoredBytes: 300 * 1024,
  maxDimension: 1200,
});

const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

function imageError(code) {
  return Object.assign(new Error(code), { code });
}

function encode(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(imageError('PRODUCT_IMAGE_ENCODE_FAILED')), type, quality);
  });
}

function readDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(imageError('PRODUCT_IMAGE_READ_FAILED'));
    reader.readAsDataURL(blob);
  });
}

export async function compressProductImage(file, options = {}) {
  const limits = { ...PRODUCT_IMAGE_LIMITS, ...options.limits };
  if (!file || !acceptedTypes.has(file.type)) throw imageError('PRODUCT_IMAGE_UNSUPPORTED');
  if (file.size > limits.maxSourceBytes) throw imageError('PRODUCT_IMAGE_SOURCE_TOO_LARGE');

  const createBitmap = options.createBitmap || globalThis.createImageBitmap?.bind(globalThis);
  if (typeof createBitmap !== 'function') throw imageError('PRODUCT_IMAGE_DECODER_UNAVAILABLE');

  let bitmap;
  try {
    bitmap = await createBitmap(file);
    if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > 80_000_000) {
      throw imageError('PRODUCT_IMAGE_DIMENSIONS_INVALID');
    }
    const canvas = (options.createCanvas || (() => document.createElement('canvas')))();
    const context = canvas.getContext('2d');
    if (!context) throw imageError('PRODUCT_IMAGE_CANVAS_UNAVAILABLE');
    const fitScale = Math.min(1, limits.maxDimension / Math.max(bitmap.width, bitmap.height));
    const formats = [['image/webp', [0.84, 0.72, 0.6]], ['image/jpeg', [0.82, 0.7, 0.58]]];

    for (const shrink of [1, 0.84, 0.68, 0.52]) {
      const width = Math.max(1, Math.round(bitmap.width * fitScale * shrink));
      const height = Math.max(1, Math.round(bitmap.height * fitScale * shrink));
      canvas.width = width;
      canvas.height = height;

      for (const [type, qualities] of formats) {
        if (type === 'image/jpeg') {
          context.fillStyle = '#f4f0e8';
          context.fillRect(0, 0, width, height);
        }
        context.drawImage(bitmap, 0, 0, width, height);
        for (const quality of qualities) {
          const blob = await encode(canvas, type, quality);
          if (blob.type === type && blob.size <= limits.maxStoredBytes) {
            const dataUrl = await (options.readDataUrl || readDataUrl)(blob);
            if (typeof dataUrl !== 'string' || !dataUrl.startsWith(`data:${type};base64,`)) {
              throw imageError('PRODUCT_IMAGE_READ_FAILED');
            }
            return { dataUrl, bytes: blob.size, width, height, type };
          }
        }
      }
    }
    throw imageError('PRODUCT_IMAGE_COMPRESSION_LIMIT');
  } catch (error) {
    if (error?.code) throw error;
    throw imageError('PRODUCT_IMAGE_DECODE_FAILED');
  } finally {
    bitmap?.close?.();
  }
}
