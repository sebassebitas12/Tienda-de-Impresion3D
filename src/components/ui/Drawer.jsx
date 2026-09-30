import { Panel } from './Panel.jsx';

export function Drawer({ className = '', ...props }) {
  return <Panel {...props} modal className={'v-drawer ' + className} />;
}
