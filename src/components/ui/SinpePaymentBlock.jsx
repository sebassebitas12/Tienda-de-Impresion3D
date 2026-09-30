import { FileDropzone } from './FileDropzone.jsx';
import { Input } from './Input.jsx';

const paymentLabels = {
  idle: 'Completá los datos del comprobante.',
  'form-invalid': 'Revisá los datos del pago.',
  processing: 'Procesando el comprobante…',
  'awaiting-receipt': 'Esperando comprobante.',
  'receipt-received': 'Comprobante recibido.',
  validating: 'Pago pendiente de validación.',
  confirmed: 'Pago confirmado.',
  error: 'No se pudo registrar el comprobante.',
};

export function SinpePaymentBlock({
  destination, recipient, status = 'idle', receipt, onReceipt, reference = '', onReference,
  referenceError, error, maxBytes, receiptExtensions = ['jpg', 'jpeg', 'png', 'pdf'],
}) {
  const processing = ['processing', 'validating'].includes(status);
  const disabled = !destination || processing || status === 'confirmed';
  return (
    <section className="v-summary" aria-label="Pago SINPE" aria-busy={processing}>
      <h2>Pago por SINPE</h2>
      {destination ? <><p>Destino: <strong>{destination}</strong></p>{recipient && <p>A nombre de {recipient}</p>}</> :
        <p>El destino de pago aún no está disponible. Esperá la confirmación antes de transferir.</p>}
      <Input label="Número de comprobante" value={reference} error={referenceError} disabled={disabled}
        onChange={event => onReference?.(event.target.value)} />
      <FileDropzone label="Comprobante SINPE" file={receipt} onFile={onReceipt}
        extensions={receiptExtensions} maxBytes={maxBytes} disabled={disabled} processing={status === 'processing'} error={error} />
      <p role={status === 'error' ? 'alert' : 'status'}>{paymentLabels[status]}</p>
    </section>
  );
}
