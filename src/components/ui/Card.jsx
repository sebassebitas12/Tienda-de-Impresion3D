import './ui.css';

export function Card({ as: Tag = 'article', radius = 'card', hover = false, className = '', children, ...props }) {
  return (
    <Tag {...props} className={'v-card v-card--' + radius + ' ' + className} data-hover={hover}>
      {children}
    </Tag>
  );
}
