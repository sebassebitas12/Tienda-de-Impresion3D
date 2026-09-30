import './ui.css';

export function LinkText({ as: Tag = 'a', variant = 'standalone', children, className = '', ...props }) {
  return (
    <Tag {...props} className={'v-link-text v-link-text--' + variant + ' ' + className}>
      {children}<span aria-hidden="true">↗</span>
    </Tag>
  );
}
