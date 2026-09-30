import './ui.css';

export function BrandLogo({ as: Tag = 'a', compact = false, className = '', ...props }) {
  return (
    <Tag href={Tag === 'a' ? '/' : undefined} {...props} className={'v-brand ' + className} aria-label="Vértice CR, inicio">
      <img src="/favicon-64.png" alt="" width="30" height="30" />
      {!compact && <><span className="v-brand-name">VÉRTICE</span><span className="v-brand-code">3D / CR</span></>}
    </Tag>
  );
}
