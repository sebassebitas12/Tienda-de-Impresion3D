import { requestStatusLabels } from '../../utils/requests.js';
import './ui.css';

export function Badge({ variant = 'spec-chip', status, children, className = '', ...props }) {
  const label = children ?? (variant === 'request' ? requestStatusLabels[status] : variant === 'production-tag' ? 'Bajo pedido' : undefined);
  return (
    <span {...props} className={['v-badge', 'v-badge--' + variant, className].join(' ')} data-status={status}>
      {label}
    </span>
  );
}
