import './ui.css';

export function EmptyState({ title, description, action, className = '', ...props }) {
  return <section {...props} className={'v-feedback ' + className}><h3>{title}</h3>{description && <p>{description}</p>}{action}</section>;
}
