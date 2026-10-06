import { describe, expect, test } from '@jest/globals';
import { runInNewContext } from 'node:vm';
import { prepareQuoteEmail } from '../src/utils/quoteEmailTemplate.js';

const fixture = { requestId: 'r1', customerEmail: 'customer@example.test', adminEmail: 'admin@example.test', amountCrc: 10384, validUntil: '2026-10-11', notes: 'Sin envío incluido.', piece: 'Soporte', quantity: 4, material: 'PETG' };
describe('correo de cotización al cliente', () => {
  test('funciona en el sandbox de n8n sin el global URL', () => {
    const result = runInNewContext(`(${prepareQuoteEmail.toString()})(data)`, { data: fixture });
    expect(result.html).toContain('http://localhost:5173/cuenta');
  });
  test.each(['https://user:secret@example.com', 'http://localhost:99999', 'https://example.com" onclick="bad', 'javascript:alert(1)'])('rechaza origen inseguro %s', appUrl => {
    expect(() => prepareQuoteEmail({ ...fixture, appUrl })).toThrow();
  });
  test('distingue propuesta y precio sin mostrar costos internos como otro total', () => {
    const { html } = prepareQuoteEmail({ ...fixture, breakdown: { costSubtotalCrc: 6699 } });
    expect(html).toContain('max-width:600px');
    expect(html).toContain('Polímero propuesto');
    expect(html).toContain('Revisar cotización en mi cuenta');
    expect(html).not.toContain('Subtotal técnico');
    expect(html).not.toContain('Material Confirmado');
    expect(html).toContain('no confirma un pago');
  });
  test('rotula prueba/demo y enlace local sin prometer sitio público', () => {
    const result = prepareQuoteEmail({ ...fixture, test: true, mode: 'DEMO' });
    expect(result.subject).toContain('[DEMO] [PRUEBA]');
    expect(result.html).toContain('no solicita una transferencia');
    expect(result.html).toContain('No es un sitio publicado');
  });
  test('escapa contenido e impide enlaces ejecutables', () => {
    expect(prepareQuoteEmail({ ...fixture, notes: '<script>alert(1)</script>' }).html).not.toContain('<script>');
    expect(() => prepareQuoteEmail({ ...fixture, appUrl: 'javascript:alert(1)' })).toThrow();
  });
  test.each([{ amountCrc: 0 }, { amountCrc: 1.5 }, { validUntil: 'invalid' }, { customerEmail: 'invalid' }, { currency: 'USD' }])('rechaza contrato inválido %j', override => {
    expect(() => prepareQuoteEmail({ ...fixture, ...override })).toThrow();
  });
});
