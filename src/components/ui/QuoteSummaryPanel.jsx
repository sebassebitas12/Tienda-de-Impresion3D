import { canPayQuote, hasQuotedAmount, isQuoteExpired } from '../../utils/requests.js';
import { useCurrentTime } from '../../hooks/useCurrentTime.js';
import { Badge } from './Badge.jsx';
import { Button } from './Button.jsx';
import { PriceTag } from './PriceTag.jsx';

export function QuoteSummaryPanel({ request, onPay, onReview, processing = false, now: suppliedTime }) {
  const currentTime = useCurrentTime();
  const now = suppliedTime ?? currentTime;
  const expired = isQuoteExpired(request, now);
  const quoted = hasQuotedAmount(request);
  const pay = canPayQuote(request, now);
  const validity = Date.parse(request.quoteValidUntil);
  return (
    <aside className="v-summary" aria-label="Resumen de cotización">
      <h2>Tu cotización</h2>
      <Badge variant="request" status={expired ? 'EXPIRED' : request.status} />
      {quoted ? <p><PriceTag amount={request.quotedPrice} /></p> :
        <p>La revisión técnica determina el monto. Sin cobro previo.</p>}
      {quoted && Number.isFinite(validity) && <p>Vigencia: <time dateTime={request.quoteValidUntil}>{new Date(validity).toLocaleString('es-CR')}</time></p>}
      {request.quoteNotes && <p>{request.quoteNotes}</p>}
      {!expired && ['QUOTED', 'AWAITING_APPROVAL'].includes(request.status) && onReview &&
        <Button onClick={onReview} disabled={processing}>Revisar cotización</Button>}
      {pay && onPay && <Button fullWidth onClick={onPay} loading={processing}>Pagar cotización</Button>}
      {expired && <p>La cotización caducó. Solicitá una revisión antes de pagar.</p>}
    </aside>
  );
}
