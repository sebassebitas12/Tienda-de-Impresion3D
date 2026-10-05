import { mkdir, writeFile } from 'node:fs/promises';
import { prepareQuoteEmail } from '../src/utils/quoteEmailTemplate.js';

// Isolated visual fixture. Never sends mail, changes db.json or invokes n8n.
const directory = new URL('../automation/evidence/_local_archive/', import.meta.url);
await mkdir(directory, { recursive: true });
const { html } = prepareQuoteEmail({
  requestId: 'PREVIEW', customerEmail: 'customer@example.test', adminEmail: 'admin@example.test',
  amountCrc: 10384, currency: 'CRC', validUntil: '2026-10-11', test: true, mode: 'DEMO',
  piece: 'Soporte de muestra · fixture visual', quantity: 4, material: 'PETG',
  notes: 'Demostración visual. No solicita dinero.\nIncluye cuatro piezas de muestra; entrega e impuestos pendientes de confirmar. No autoriza producción.',
});
await writeFile(new URL('quote-email-preview.html', directory), html);
console.log('Preview local: /automation/evidence/_local_archive/quote-email-preview.html');
