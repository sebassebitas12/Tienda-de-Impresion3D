import { describe, expect, it } from '@jest/globals';
import { isDeliverableEmail } from '../src/utils/emailAddress.js';

describe('validación de destinatarios de correo', () => {
  it('acepta correos con dominio real y rechaza placeholders o direcciones incompletas', () => {
    expect(isDeliverableEmail('cliente@vertice.cr')).toBe(true);
    expect(isDeliverableEmail(' ana@sub.example.com ')).toBe(false);
    expect(isDeliverableEmail('admin@example.com')).toBe(false);
    expect(isDeliverableEmail('no-es-correo')).toBe(false);
    expect(isDeliverableEmail('')).toBe(false);
  });
});
