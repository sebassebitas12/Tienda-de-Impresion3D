import './ui.css';

export function StatusIndicator({ status = 'online', pulse = false, children, className = '', ...props }) {
  return <span {...props} className={'v-status ' + className} data-status={status} data-pulse={pulse}>{children}</span>;
}
