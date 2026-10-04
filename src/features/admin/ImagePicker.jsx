import { useId, useState } from 'react';
import { catalogImageLibrary } from './catalogImageLibrary.js';
import { compressProductImage, PRODUCT_IMAGE_LIMITS } from '../../utils/compressProductImage.js';
import './image-picker.css';

const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const storedDataUrlBytes = value => {
  if (!value.startsWith('data:')) return null;
  const base64 = value.slice(value.indexOf(',') + 1);
  return Math.max(0, Math.floor(base64.length * 3 / 4) - (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0));
};
const errorCopy = {
  es: {
    PRODUCT_IMAGE_UNSUPPORTED: 'Elegí una imagen JPG, PNG o WebP.',
    PRODUCT_IMAGE_SOURCE_TOO_LARGE: 'La imagen original supera 20 MB. Reducila antes de subirla.',
    PRODUCT_IMAGE_COMPRESSION_LIMIT: 'No pudimos reducir esta imagen a 300 kB. Probá con otra foto.',
    PRODUCT_IMAGE_DECODER_UNAVAILABLE: 'Este navegador no permite procesar la imagen. Probá con otro navegador actualizado.',
    PRODUCT_IMAGE_DIMENSIONS_INVALID: 'La imagen no tiene dimensiones válidas o es demasiado grande para procesarla.',
    PRODUCT_IMAGE_ENCODE_FAILED: 'No se pudo preparar la imagen. Probá con otro archivo.',
    PRODUCT_IMAGE_READ_FAILED: 'No se pudo leer la imagen preparada. Probá de nuevo.',
    PRODUCT_IMAGE_CANVAS_UNAVAILABLE: 'No se pudo procesar la imagen en este navegador.',
    PRODUCT_IMAGE_DECODE_FAILED: 'El archivo no parece ser una imagen válida.',
  },
  en: {
    PRODUCT_IMAGE_UNSUPPORTED: 'Choose a JPG, PNG or WebP image.',
    PRODUCT_IMAGE_SOURCE_TOO_LARGE: 'The original image is over 20 MB. Reduce it before uploading.',
    PRODUCT_IMAGE_COMPRESSION_LIMIT: 'We could not reduce this image below 300 kB. Try another photo.',
    PRODUCT_IMAGE_DECODER_UNAVAILABLE: 'This browser cannot process the image. Try an up-to-date browser.',
    PRODUCT_IMAGE_DIMENSIONS_INVALID: 'The image dimensions are invalid or too large to process.',
    PRODUCT_IMAGE_ENCODE_FAILED: 'The image could not be prepared. Try another file.',
    PRODUCT_IMAGE_READ_FAILED: 'The prepared image could not be read. Try again.',
    PRODUCT_IMAGE_CANVAS_UNAVAILABLE: 'This browser could not process the image.',
    PRODUCT_IMAGE_DECODE_FAILED: 'This file does not appear to be a valid image.',
  },
};

export function ImagePicker({ images, value = '', onChange, language = 'es', disabled = false }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [failedPath, setFailedPath] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const es = language === 'es';
  const selectedImages = Array.isArray(images) ? images : (value ? [value] : []);
  const cover = selectedImages[0] || '';
  const selected = catalogImageLibrary.find(image => image.path === cover);
  const label = image => image.labels[language] || image.labels.es;
  const filtered = catalogImageLibrary.filter(image => normalize(`${label(image)} ${image.file}`).includes(normalize(query.trim())));
  const imageCopy = es
    ? { title: 'Galería del producto', description: 'Subí fotos reales o elegí imágenes del taller. La primera será la portada de la tienda.', library: 'Biblioteca del taller', main: 'Portada', noPhoto: 'Todavía sin fotos', unavailable: 'Esta foto no está disponible', choose: 'Elegí una foto', removeCover: 'Quitar portada', search: 'Buscar en la biblioteca', count: 'fotos disponibles', files: 'Fotos del producto', upload: 'Subir fotos reales', uploadHelp: 'JPG, PNG o WebP · hasta 20 MB originales · se guardan comprimidas a 300 kB como máximo · 6 fotos por producto', uploading: 'Comprimiendo y agregando fotos…', added: count => `${count} ${count === 1 ? 'foto agregada' : 'fotos agregadas'} a la galería.`, tooMany: remaining => `Solo podés agregar ${remaining} ${remaining === 1 ? 'foto más' : 'fotos más'} (máximo 6).`, makeCover: 'Hacer portada', moveEarlier: 'Mover antes', moveLater: 'Mover después', remove: 'Quitar', photo: index => `Foto ${index + 1}`, local: 'Foto cargada', empty: 'No hay fotos con ese nombre. Probá otra búsqueda.' }
    : { title: 'Product gallery', description: 'Upload real photos or choose workshop images. The first one is the store cover.', library: 'Workshop library', main: 'Cover', noPhoto: 'No photos yet', unavailable: 'This photo is unavailable', choose: 'Choose a photo', removeCover: 'Remove cover', search: 'Search library', count: 'available photos', files: 'Product photos', upload: 'Upload real photos', uploadHelp: 'JPG, PNG or WebP · originals up to 20 MB · compressed to 300 kB max · 6 photos per product', uploading: 'Compressing and adding photos…', added: count => `${count} ${count === 1 ? 'photo added' : 'photos added'} to the gallery.`, tooMany: remaining => `You can add only ${remaining} more ${remaining === 1 ? 'photo' : 'photos'} (maximum 6).`, makeCover: 'Make cover', moveEarlier: 'Move earlier', moveLater: 'Move later', remove: 'Remove', photo: index => `Photo ${index + 1}`, local: 'Uploaded photo', empty: 'No photos with that name. Try another search.' };

  function update(next) {
    onChange(next);
    setUploadError('');
  }

  function selectLibraryImage(path) {
    if (!selectedImages.includes(path) && selectedImages.length >= PRODUCT_IMAGE_LIMITS.maxImages) {
      setUploadError(es ? 'La galería llegó al máximo de 6 fotos. Quitá una antes de agregar otra.' : 'The gallery reached its 6-photo limit. Remove one before adding another.');
      return;
    }
    update([path, ...selectedImages.filter(image => image !== path)]);
  }

  async function uploadImages(event) {
    const files = [...event.target.files];
    event.target.value = '';
    setUploadMessage('');
    setUploadError('');
    if (!files.length) return;
    const remaining = PRODUCT_IMAGE_LIMITS.maxImages - selectedImages.length;
    if (files.length > remaining) {
      setUploadError(imageCopy.tooMany(remaining));
      return;
    }
    setUploading(true);
    try {
      const prepared = [];
      for (const file of files) prepared.push(await compressProductImage(file));
      update([...selectedImages, ...prepared.map(image => image.dataUrl)]);
      setUploadMessage(imageCopy.added(prepared.length));
    } catch (error) {
      setUploadError(errorCopy[es ? 'es' : 'en'][error?.code] || (es ? 'No se pudo agregar la foto.' : 'The photo could not be added.'));
    } finally {
      setUploading(false);
    }
  }

  function moveImage(index, direction) {
    const destination = index + direction;
    if (destination < 0 || destination >= selectedImages.length) return;
    const next = [...selectedImages];
    [next[index], next[destination]] = [next[destination], next[index]];
    update(next);
  }

  function removeImage(index) {
    update(selectedImages.filter((_, current) => current !== index));
  }

  return <section className="admin-image-picker" aria-labelledby={`${id}-title`}>
    <header><div><h2 id={`${id}-title`}>{imageCopy.title}</h2><p>{imageCopy.description}</p></div><span>{imageCopy.library}</span></header>
    <div className="admin-image-picker__layout">
      <div className="admin-image-picker__preview">
        {cover && failedPath !== cover ? <img key={cover} src={cover} alt={selected ? label(selected) : (es ? 'Portada actual del producto' : 'Current product cover')} onError={() => setFailedPath(cover)} /> : <div className="admin-image-picker__placeholder">{cover ? imageCopy.unavailable : imageCopy.noPhoto}</div>}
        <p role="status"><strong>{selected ? label(selected) : cover ? imageCopy.local : imageCopy.choose}</strong>{cover && <small>{selected?.file || (es ? 'Imagen comprimida · guardado local en el catálogo' : 'Compressed image · stored in the local catalog')}</small>}</p>
        {cover && <button type="button" className="admin-action-secondary" disabled={disabled || uploading} onClick={() => removeImage(0)}>{imageCopy.removeCover}</button>}
        <label className="admin-image-picker__upload">
          <span>{uploading ? imageCopy.uploading : imageCopy.upload}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={disabled || uploading || selectedImages.length >= PRODUCT_IMAGE_LIMITS.maxImages} onChange={uploadImages} />
        </label>
        <small className="admin-image-picker__upload-help">{imageCopy.uploadHelp}</small>
        {uploading && <p className="admin-image-picker__status" role="status" aria-live="polite">{imageCopy.uploading}</p>}
        {uploadMessage && <p className="admin-image-picker__status" role="status">{uploadMessage}</p>}
        {uploadError && <p className="admin-image-picker__error" role="alert">{uploadError}</p>}
      </div>
      <div className="admin-image-picker__library">
        <h3>{imageCopy.files} <span>{selectedImages.length}/{PRODUCT_IMAGE_LIMITS.maxImages}</span></h3>
        {selectedImages.length > 0 && <ol className="admin-image-picker__gallery" aria-label={imageCopy.files}>
          {selectedImages.map((image, index) => {
            const libraryImage = catalogImageLibrary.find(entry => entry.path === image);
            const bytes = storedDataUrlBytes(image);
            return <li key={`${index}-${image.slice(0, 48)}`}>
              <img src={image} alt="" />
              <div className="admin-image-picker__gallery-info"><strong>{index === 0 ? imageCopy.main : imageCopy.photo(index)}</strong><small>{libraryImage ? label(libraryImage) : `${es ? 'Foto cargada' : 'Uploaded photo'}${bytes === null ? '' : ` · ${(bytes / 1024).toFixed(0)} kB`}`}</small></div>
              <div className="admin-image-picker__gallery-actions" role="group" aria-label={`${imageCopy.photo(index)} · ${index === 0 ? imageCopy.main : ''}`}>
                {index > 0 && <button type="button" className="admin-action-secondary" disabled={disabled || uploading} onClick={() => moveImage(index, -1)} aria-label={`${imageCopy.moveEarlier}: ${imageCopy.photo(index)}`}>↑</button>}
                {index < selectedImages.length - 1 && <button type="button" className="admin-action-secondary" disabled={disabled || uploading} onClick={() => moveImage(index, 1)} aria-label={`${imageCopy.moveLater}: ${imageCopy.photo(index)}`}>↓</button>}
                {index > 0 && <button type="button" className="admin-action-secondary" disabled={disabled || uploading} onClick={() => moveImage(index, -index)} aria-label={`${imageCopy.makeCover}: ${imageCopy.photo(index)}`}>{imageCopy.makeCover}</button>}
                <button type="button" className="admin-action-secondary" disabled={disabled || uploading} onClick={() => removeImage(index)} aria-label={`${imageCopy.remove}: ${imageCopy.photo(index)}`}>{imageCopy.remove}</button>
              </div>
            </li>;
          })}
        </ol>}
        <label htmlFor={`${id}-search`}>{imageCopy.search}</label>
        <input id={`${id}-search`} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={es ? 'Soporte, llavero, maceta…' : 'Stand, keychain, planter…'} disabled={disabled || uploading} />
        <p className="admin-image-picker__count" role="status">{filtered.length} {imageCopy.count}</p>
        <div className="admin-image-picker__grid" role="group" aria-label={es ? 'Fotos del taller' : 'Workshop photos'}>
          {filtered.map(image => <button key={image.path} type="button" disabled={disabled || uploading} aria-pressed={image.path === cover} aria-label={`${es ? 'Usar foto' : 'Use photo'}: ${label(image)}`} onClick={() => selectLibraryImage(image.path)}>
            <img src={image.path} alt="" loading="lazy" />
            <span>{label(image)}</span>{image.path === cover && <i aria-hidden="true">✓</i>}
          </button>)}
        </div>
        {!filtered.length && <p className="admin-image-picker__empty">{imageCopy.empty}</p>}
      </div>
    </div>
  </section>;
}
