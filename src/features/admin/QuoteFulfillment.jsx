import { Link } from 'react-router-dom';

export function QuoteFulfillment({ request, language }) {
  const es = language === 'es';
  if (request.orderId) return <Link className="admin-action-primary" to={'/admin/pedidos/' + encodeURIComponent(request.orderId)}>{es ? 'Abrir pedido vinculado' : 'Open linked order'} ↗</Link>;
  if (request.status !== 'APPROVED') return null;
  return <aside className="admin-order-actions" aria-live="polite">
    <span className="admin-eyebrow">{es ? 'SIGUIENTE PASO · CLIENTE' : 'NEXT STEP · CUSTOMER'}</span>
    <h2>{es ? 'Pago pendiente del cliente' : 'Customer payment pending'}</h2>
    <p>{es ? 'La cotización ya fue aprobada. El cliente debe registrar el pago simulado desde su cuenta; Admin no puede crear el pedido en su nombre.' : 'The quote is approved. The customer must record the simulated payment from their account; Admin cannot create the order on their behalf.'}</p>
  </aside>;
}
