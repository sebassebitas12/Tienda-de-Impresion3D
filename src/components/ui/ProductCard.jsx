import { useState } from 'react';
import { Badge } from './Badge.jsx';
import { Card } from './Card.jsx';
import { MonoLabel } from './MonoLabel.jsx';
import { LinkText } from './LinkText.jsx';
import { PriceTag } from './PriceTag.jsx';

export function ProductCard({ product, linkAs, href, to, showPrice = false }) {
  const [failedSource, setFailedSource] = useState(null);
  const src = product.images?.[0];
  const available = product.stock > 0 && product.status === 'ACTIVE';
  return (
    <Card hover className="v-product-card" data-unavailable={!available}>
      <div className="v-product-image">
        <div className="v-product-meta">
          <Badge variant="material-tag">{product.material}</Badge>
          <Badge variant="stock-tag" status={available ? 'in-stock' : 'out'}>
            {available ? 'En stock (' + product.stock + ')' : 'Sin stock'}
          </Badge>
        </div>
        {src && failedSource !== src ?
          <img src={src} alt={product.name + ' en ' + product.material} loading="lazy" decoding="async" onError={() => setFailedSource(src)} /> :
          <span className="v-image-empty">Imagen no disponible</span>}
      </div>
      <div className="v-product-body">
        {product.reference && <MonoLabel>{product.reference}</MonoLabel>}
        <h3>{product.name}</h3><p>{product.description}</p>
        {showPrice && <PriceTag amount={product.price} />}
        <div className="v-product-footer">
          <span>{product.categoryName}</span>
          <LinkText as={linkAs} href={href} to={to} aria-label={'Ver ficha de ' + product.name}>Ver ficha</LinkText>
        </div>
      </div>
    </Card>
  );
}
