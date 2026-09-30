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
  showPrice = false,
  viewLabel = 'Ver ficha',
  imageUnavailableLabel = 'Imagen no disponible',
}) {
  const [failedSource, setFailedSource] = useState(null);
  const src = product.images?.[0];
  const inferredAvailable = product.stock > 0 && product.status === 'ACTIVE';
  const stockStatus = product.stockStatus ?? (inferredAvailable ? 'in-stock' : 'out');
  const stockLabel = product.stockLabel ?? (inferredAvailable ? 'En stock (' + product.stock + ')' : 'Sin stock');
  const unavailable = product.status !== 'ACTIVE' || stockStatus === 'out';
  const imageAlt = product.imageAlt || (product.name + ' en ' + product.material);

  return (
    <Card hover className="v-product-card" data-unavailable={unavailable}>
      <div className="v-product-image">
        <div className="v-product-meta">
          <Badge variant="material-tag">{product.material}</Badge>
          <Badge variant="stock-tag" status={stockStatus}>{stockLabel}</Badge>
        </div>
        {src && failedSource !== src ?
          <img src={src} alt={imageAlt} loading="lazy" decoding="async" onError={() => setFailedSource(src)} /> :
          <span className="v-image-empty">{imageUnavailableLabel}</span>}
      </div>
      <div className="v-product-body">
        {product.reference && <MonoLabel>{product.reference}</MonoLabel>}
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        {showPrice && <PriceTag amount={product.price} />}
        <div className="v-product-footer">
          <span>{product.categoryName}</span>
          <LinkText as={linkAs} href={href} to={to} aria-label={viewLabel + ': ' + product.name}>{viewLabel}</LinkText>
        </div>
      </div>
    </Card>
  );
}
