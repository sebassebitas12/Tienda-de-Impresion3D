import process from 'node:process';
import { randomUUID } from 'node:crypto';
import { isDeliverableEmail } from '../src/utils/emailAddress.js';

export async function deliverQuote({ data, requestId, actor, expectedVersion, testRecipient, persist, fetchImpl = globalThis.fetch, env = process.env }) {
  const failure = (code, status = 400) => ({ status, body: { code } });
  const index = data.customPrintRequests.findIndex(request => String(request.id) === requestId);
  if (index < 0) return failure('REQUEST_NOT_FOUND', 404);
  const request = data.customPrintRequests[index];
  const deliveryKey = `${request.id}:${expectedVersion}:${testRecipient || 'customer'}`;
  const previousDelivery = data.quoteDeliveries?.find(item => item.key === deliveryKey);
  if (previousDelivery?.status === 'SENT') return { status: 200, body: { request, replay: true, test: Boolean(testRecipient) } };
  if (previousDelivery) return failure('QUOTE_EMAIL_DELIVERY_UNCERTAIN', 409);
  if (request.status !== 'QUOTED' || (request.quoteVersion || 0) !== expectedVersion) return failure('STATUS_CONFLICT', 409);
  if (!(Date.parse(request.quoteValidUntil) > Date.now())) return failure('QUOTE_EXPIRED', 409);
  if (!Number.isSafeInteger(request.quotedPrice) || request.quotedPrice <= 0 || request.currency !== 'CRC' || !request.quoteNotes?.trim()) return failure('INVALID_QUOTE');
  const customer = data.users?.find(user => String(user.id) === String(request.userId) && user.role === 'customer');
  const isTest = Boolean(testRecipient);
  if (isTest && (actor.role !== 'admin' || request.quotePricing?.mode !== 'DEMO')) return failure('TEST_EMAIL_FORBIDDEN', 403);
  const customerEmail = isTest ? testRecipient : customer?.email;
  const adminEmail = isTest ? testRecipient : env.VERTICE_WORKSHOP_EMAIL || actor.email;
  if (!isDeliverableEmail(customerEmail) || !isDeliverableEmail(adminEmail)) return failure('QUOTE_EMAIL_RECIPIENT_INVALID', 422);
  const webhookUrl = env.VERTICE_QUOTE_EMAIL_WEBHOOK_URL;
  const webhookToken = env.VERTICE_QUOTE_EMAIL_WEBHOOK_TOKEN;
  if (!webhookUrl || !webhookToken) return failure('QUOTE_EMAIL_NOT_CONFIGURED', 503);
  try { if (!['http:', 'https:'].includes(new URL(webhookUrl).protocol)) throw new Error(); } catch { return failure('QUOTE_EMAIL_NOT_CONFIGURED', 503); }
  const occurredAt = new Date().toISOString();
  const pendingData = structuredClone(data);
  pendingData.quoteDeliveries ||= [];
  pendingData.quoteDeliveries.push({ id: randomUUID(), key: deliveryKey, requestId, quoteVersion: expectedVersion, status: 'SENDING', createdAt: occurredAt, test: isTest });
  // Persist intent before dispatch: an ambiguous timeout must not be blindly retried.
  await persist(pendingData);
  const emailPayload = { requestId, quoteVersion: expectedVersion, deliveryKey, test: isTest, mode: request.quotePricing?.mode || 'MANUAL',
    customerName: customer?.name || '', customerEmail, adminEmail, piece: request.fileName || request.description || requestId,
    quantity: request.quantity, material: request.quotePricing?.inputs?.material || request.material || '', amountCrc: request.quotedPrice,
    validUntil: request.quoteValidUntil, notes: request.quoteNotes, breakdown: request.quotePricing?.breakdown || null };
  let confirmation;
  try {
    const response = await fetchImpl(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Vertice-Webhook-Token': webhookToken },
      body: JSON.stringify(emailPayload), signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error('delivery');
    const body = await response.json();
    confirmation = Array.isArray(body) ? body[0] : body;
    if (confirmation.delivered !== true || confirmation.deliveryKey !== deliveryKey || !confirmation.messageId) throw new Error('confirmation');
  } catch {
    const uncertain = structuredClone(pendingData);
    uncertain.quoteDeliveries.find(item => item.key === deliveryKey).status = 'UNKNOWN';
    await persist(uncertain);
    return failure('QUOTE_EMAIL_DELIVERY_UNCERTAIN', 502);
  }
  const next = structuredClone(pendingData);
  const delivery = next.quoteDeliveries.find(item => item.key === deliveryKey);
  Object.assign(delivery, { status: 'SENT', messageId: confirmation.messageId, sentAt: occurredAt });
  const updated = isTest ? { ...request, quoteTestEmailSentAt: occurredAt, updatedAt: occurredAt } : {
    ...request, status: 'AWAITING_APPROVAL', quoteEmailSentAt: occurredAt, quoteEmailSentTo: customerEmail, quoteEmailCopiedTo: adminEmail, updatedAt: occurredAt,
  };
  next.customPrintRequests[index] = updated;
  next.activityLog.push({ id: randomUUID(), entity: 'customPrintRequest', entityId: requestId,
    action: isTest ? 'REQUEST_QUOTE_TEST_EMAIL_SENT' : 'REQUEST_QUOTE_EMAIL_SENT',
    fromStatus: request.status, toStatus: updated.status, actorId: actor.id, actorName: actor.name, occurredAt });
  try { await persist(next); } catch { return failure('QUOTE_EMAIL_SENT_BUT_NOT_RECORDED', 500); }
  return { status: 200, body: { request: updated, test: isTest, messageId: confirmation.messageId } };
}
