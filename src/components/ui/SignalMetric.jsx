import './ui.css';

export function SignalMetric({ value, label, className = '', ...props }) {
  return <div {...props} className={'v-signal ' + className}><strong>{value}</strong><span>{label}</span></div>;
}
