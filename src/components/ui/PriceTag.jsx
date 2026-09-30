import { formatCRC } from '../../utils/money.js';
import './ui.css';

// Only receives a monetary amount. Request eligibility belongs to the domain layer.
export function PriceTag({ amount, className = '', ...props }) {
  const formatted = formatCRC(amount);
  if (formatted === null) return null;
  return <span {...props} className={'v-price ' + className}>{formatted}<small> CRC</small></span>;
}
