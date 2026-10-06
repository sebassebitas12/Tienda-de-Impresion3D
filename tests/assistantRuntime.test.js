import { describe, expect, it, jest } from '@jest/globals';
import { runAssistant } from '../scripts/assistant-runtime.js';

describe('contexto del formulario para el asistente de cotización', () => {
  it('envía solo campos permitidos y una instrucción estructurada al proveedor', async () => {
    let requestBody;
    const fetchImpl = jest.fn(async (_url, options) => {
      requestBody = JSON.parse(options.body);
      return { ok: true, json: async () => ({ output: { reply: 'Preparé el resumen.', links: [], requestDraft: null } }) };
    });
    const result = await runAssistant({
      mode: 'quote', message: 'Prepará el resumen para revisar.', history: [], prepareDraft: true,
      draftContext: {
        values: {
          description: 'Brazo para banda transportadora', intendedUse: 'Simulación', dimensions: '15 cm',
          material: 'PETG', quantity: 1, needsDesign: true, referenceUrl: '',
          adminToken: 'must-not-be-forwarded',
        },
        editedFields: ['description', 'material', 'notAField'],
      },
    }, { actor: null, data: { categories: [] }, getRates: jest.fn() }, {
      fetchImpl, env: { VERTICE_ASSISTANT_QUOTE_URL: 'http://localhost:5678/webhook/vertice-assistant-quote' },
    });

    expect(result).toEqual(expect.objectContaining({ reply: 'Preparé el resumen.', requestDraft: null }));
    expect(requestBody.prepareDraft).toBe(true);
    expect(requestBody.draftContext).toEqual(expect.objectContaining({ values: expect.objectContaining({ description: 'Brazo para banda transportadora' }) }));
    const messages = requestBody.messages;
    expect(messages[0].content).toMatch(/requestDraft como objeto no nulo/i);
    expect(JSON.stringify(requestBody.draftContext)).toContain('"editedFields":["description","material"]');
    expect(JSON.stringify(requestBody.draftContext)).not.toContain('must-not-be-forwarded');
    expect(requestBody.messages.at(-1).content).toBe('Prepará el resumen para revisar.');
  });

  it('no envía contexto del formulario en turnos normales ni en otros roles', async () => {
    let requestBody;
    const fetchImpl = jest.fn(async (_url, options) => {
      requestBody = JSON.parse(options.body);
      return { ok: true, json: async () => ({ output: { reply: 'De acuerdo.', links: [], requestDraft: null } }) };
    });
    await runAssistant({ mode: 'quote', message: '¿Cómo funciona?', draftContext: {
      values: { description: 'Soporte especial' }, editedFields: ['description'],
    } }, { actor: null, data: { categories: [] }, getRates: jest.fn() }, {
      fetchImpl, env: { VERTICE_ASSISTANT_QUOTE_URL: 'http://localhost:5678/webhook/vertice-assistant-quote' },
    });

    expect(requestBody.messages.some(item => item.content.includes('Contexto actual del formulario'))).toBe(false);
    expect(requestBody.prepareDraft).toBe(false);
    expect(requestBody.draftContext).toBeUndefined();
  });
});
