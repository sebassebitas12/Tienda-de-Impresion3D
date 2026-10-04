import { describe, expect, it, jest } from '@jest/globals';
import { compressProductImage, PRODUCT_IMAGE_LIMITS } from '../src/utils/compressProductImage.js';

function createCanvasHarness(encodeBlob) {
  const drawImage = jest.fn();
  const fillRect = jest.fn();
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ({ drawImage, fillRect, set fillStyle(_value) {} }),
    toBlob: jest.fn((callback, type, quality) => callback(encodeBlob(type, quality, canvas.width, canvas.height))),
  };
  return { canvas, drawImage, fillRect };
}

describe('compresión de fotos de catálogo', () => {
  it('reduce una imagen a un data URL WebP dentro de 1200 px y 300 KiB', async () => {
    const bitmap = { width: 2400, height: 1200, close: jest.fn() };
    const { canvas, drawImage } = createCanvasHarness(type => new Blob([new Uint8Array(180 * 1024)], { type }));
    const result = await compressProductImage(new File(['photo'], 'pieza.png', { type: 'image/png' }), {
      createBitmap: jest.fn().mockResolvedValue(bitmap), createCanvas: () => canvas,
      readDataUrl: async blob => `data:${blob.type};base64,AA==`,
    });

    expect(result).toEqual({ dataUrl: 'data:image/webp;base64,AA==', bytes: 180 * 1024, width: 1200, height: 600, type: 'image/webp' });
    expect(drawImage).toHaveBeenCalledWith(bitmap, 0, 0, 1200, 600);
    expect(bitmap.close).toHaveBeenCalled();
  });

  it('rechaza formatos no admitidos y fuentes enormes antes de decodificarlas', async () => {
    const decode = jest.fn();
    await expect(compressProductImage(new File(['x'], 'modelo.svg', { type: 'image/svg+xml' }), { createBitmap: decode }))
      .rejects.toMatchObject({ code: 'PRODUCT_IMAGE_UNSUPPORTED' });
    await expect(compressProductImage(new File(['xx'], 'grande.jpg', { type: 'image/jpeg' }), { createBitmap: decode, limits: { maxSourceBytes: 1 } }))
      .rejects.toMatchObject({ code: 'PRODUCT_IMAGE_SOURCE_TOO_LARGE' });
    expect(decode).not.toHaveBeenCalled();
  });

  it('reduce más las dimensiones hasta cumplir el límite almacenado', async () => {
    const bitmap = { width: 3000, height: 2000, close: jest.fn() };
    const { canvas } = createCanvasHarness((_type, _quality, width) => new Blob([new Uint8Array(width > 900 ? PRODUCT_IMAGE_LIMITS.maxStoredBytes + 1 : 90_000)], { type: 'image/webp' }));
    const result = await compressProductImage(new File(['x'], 'pieza.webp', { type: 'image/webp' }), {
      createBitmap: async () => bitmap, createCanvas: () => canvas,
      readDataUrl: async blob => `data:${blob.type};base64,AA==`,
    });

    expect(result.width).toBeLessThan(1200);
    expect(result.bytes).toBeLessThanOrEqual(PRODUCT_IMAGE_LIMITS.maxStoredBytes);
  });
});
