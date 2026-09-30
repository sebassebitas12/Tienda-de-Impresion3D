import { productSubtotal } from '../../utils/money.js';
import { Badge } from './Badge.jsx';
import { Button } from './Button.jsx';
import { Input } from './Input.jsx';
import { PriceTag } from './PriceTag.jsx';

export function CartItem({ kind = 'catalog', product, request, quantity = 1, onQuantityChange, onRemove, processing = false, error }) {
  if (kind === 'request') {
    return (
      <article className="v-cart-item">
        <div><h3>{request.description || request.fileName || 'Solicitud personalizada'}</h3>
          <Badge variant="request" status={request.status} />
          <p>La cotización se revisa por separado. Esta solicitud no se suma al total de productos.</p>
        </div>
        {onRemove && <Button variant="ghost" disabled={processing} onClick={onRemove}>Quitar solicitud</Button>}
      </article>
    );
  }
  const subtotal = productSubtotal(quantity, product.price);
  return (
    <article className="v-cart-item" aria-busy={processing}>
      <div><h3>{product.name}</h3><p>{product.material}</p><PriceTag amount={product.price} /></div>
      <Input label={'Cantidad de ' + product.name} type="number" min="1" max={product.stock} step="1"
        value={quantity} disabled={processing || product.stock < 1} error={error}
        onChange={event => onQuantityChange?.(event.target.value === '' ? '' : Number(event.target.value))} />
      <div><span>Subtotal</span><PriceTag amount={subtotal} /></div>
      {onRemove && <Button variant="ghost" disabled={processing} onClick={onRemove}>Quitar producto</Button>}
    </article>
  );
}
