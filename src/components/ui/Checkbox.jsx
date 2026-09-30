import { useId } from 'react';
import './ui.css';

export function Checkbox({ id: suppliedId, label, className = '', ...props }) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return <label className={'v-check ' + className} htmlFor={id}><input {...props} id={id} type="checkbox" /><span>{label}</span></label>;
}
