import './ui.css';

export function NavLink({ as: Tag = 'a', current = false, children, className = '', ...props }) {
  return <Tag {...props} className={'v-nav-link ' + className} aria-current={current ? 'page' : undefined}>{children}</Tag>;
}
