import './ui.css';

export function MonoLabel({ as: Tag = 'span', children, className = '', ...props }) {
  return <Tag {...props} className={'v-mono-label ' + className}>{children}</Tag>;
}
