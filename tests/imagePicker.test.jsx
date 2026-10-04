import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { ImagePicker } from '../src/features/admin/ImagePicker.jsx';
import { compressProductImage } from '../src/utils/compressProductImage.js';

jest.mock('../src/utils/compressProductImage.js', () => ({
  PRODUCT_IMAGE_LIMITS: { maxImages: 6, maxSourceBytes: 20 * 1024 * 1024, maxStoredBytes: 300 * 1024, maxDimension: 1200 },
  compressProductImage: jest.fn(),
}));

function GalleryHarness() {
  const [images, setImages] = useState(['/images/producto-base-control.jpg']);
  return <ImagePicker images={images} onChange={setImages} />;
}

describe('galería de fotos del catálogo', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('comprime y agrega una foto real sin cambiar la portada existente', async () => {
    compressProductImage.mockResolvedValue({ dataUrl: `data:image/webp;base64,${'A'.repeat(160000)}`, bytes: 120000, width: 800, height: 600, type: 'image/webp' });
    render(<GalleryHarness />);
    const file = new File(['photo'], 'pieza.jpg', { type: 'image/jpeg' });

    fireEvent.change(screen.getByLabelText(/subir fotos reales/i), { target: { files: [file] } });

    await waitFor(() => expect(screen.getByText('Foto 2')).toBeInTheDocument());
    expect(compressProductImage).toHaveBeenCalledWith(file);
    expect(screen.getByText('117 kB', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Portada')).toBeInTheDocument();
  });

  it('agrega una imagen de la biblioteca y la permite colocar como portada', () => {
    render(<GalleryHarness />);
    fireEvent.change(screen.getByLabelText(/buscar en la biblioteca/i), { target: { value: 'llavero' } });
    fireEvent.click(screen.getByRole('button', { name: 'Usar foto: Llavero' }));
    expect(screen.getAllByText('Llavero').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Hacer portada: Foto 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Hacer portada: Foto 2' }));
    expect(screen.getByRole('button', { name: 'Usar foto: Llavero' })).toHaveAttribute('aria-pressed', 'true');
  });
});
