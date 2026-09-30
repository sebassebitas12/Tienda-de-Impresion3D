import './ui.css';

export function Skeleton({ variant = 'text', width, height, className = '', style, ...props }) {
  return <span {...props} className={'v-skeleton v-skeleton--' + variant + ' ' + className} style={{ width, height, ...style }} aria-hidden="true" />;
}
