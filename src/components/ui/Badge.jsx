import { requestStatusLabels } from '../../utils/requests.js';
import './ui.css';

export function Badge({ variant = 'spec-chip', status, children, className = '', ...props }) {
  const stockLabels = { 'in-stock': 'En stock', order: 'Bajo pedido', out: 'Sin stock' };
  const label = children ?? (variant === 'request' ? requestStatusLabels[status] : stockLabels[status]);
  return (
    <span {...props} className={['v-badge', 'v-badge--' + variant, className].join(' ')} data-status={status}>
      {label}
    </span>
  );
}
