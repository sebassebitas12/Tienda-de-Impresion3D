import { useState } from 'react';
import { Badge } from './Badge.jsx';
import { Card } from './Card.jsx';
import { MonoLabel } from './MonoLabel.jsx';
import { LinkText } from './LinkText.jsx';
import { PriceTag } from './PriceTag.jsx';

export function ProductCard({
  product,
  linkAs,
  href,
  to,
  layout = 'standard',
  showMadeToOrder = false,
  showPrice = false,
  demoPriceLabel = 'Precio referencial',
  viewLabel = 'Ver ficha',
  imageUnavailableLabel = 'Imagen no disponible',
}) {
  const [failedSource, setFailedSource] = useState(null);
  const [photoShape, setPhotoShape] = useState(null);
  const src = product.images?.[0];
  const unpublished = String(product.status || 'ACTIVE').toUpperCase() !== 'ACTIVE';
  const imageAlt = product.imageAlt || (product.name + ' en ' + product.material);
  const featured = layout === 'featured';
  const hasPhoto = Boolean(src && failedSource !== src);

  return (
    <Card hover className={'v-product-card' + (featured ? ' v-product-card--featured' : '')} data-unavailable={unpublished}>
      <div className="v-product-image" data-has-photo={hasPhoto} data-photo-shape={photoShape} style={hasPhoto ? { '--product-photo-backdrop': `url(${JSON.stringify(src)})` } : undefined}>
        <div className="v-product-meta">
          {!featured && <Badge variant="material-tag">{product.material}</Badge>}
          {showMadeToOrder && <Badge variant="production-tag">Bajo pedido</Badge>}
        </div>
        {hasPhoto ?
          <img src={src} alt={imageAlt} loading="lazy" decoding="async" onLoad={event => {
            const { naturalWidth, naturalHeight } = event.currentTarget;
            setPhotoShape(Math.abs(naturalWidth / naturalHeight - 1) < 0.08 ? 'square' : 'landscape');
          }} onError={() => setFailedSource(src)} /> :
          <span className="v-image-empty">{imageUnavailableLabel}</span>}
      </div>
      <div className="v-product-body">
        {featured && product.categoryName && <MonoLabel>{product.categoryName}</MonoLabel>}
        {!featured && product.reference && <MonoLabel>{product.reference}</MonoLabel>}
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        {showPrice && <PriceTag amount={product.price} />}
        {showPrice && product.priceSource === 'DEMO' && <small className="v-product-price-note">{demoPriceLabel}</small>}
        <div className="v-product-footer">
          {!featured && <span>{product.categoryName}</span>}
          <LinkText as={linkAs} href={href} to={to} aria-label={viewLabel + ': ' + product.name}>{viewLabel}</LinkText>
        </div>
      </div>
    </Card>
  );
}
