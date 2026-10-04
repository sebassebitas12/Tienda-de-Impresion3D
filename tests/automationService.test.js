/** @jest-environment node */
import { describe, expect, test } from '@jest/globals';
import { automationError } from '../src/services/automationService.js';

describe('mensajes de conexión de asistentes', () => {
  test.each([
    ['ASSISTANT_UNAVAILABLE', 'No se pudo conectar con n8n.', 'Could not connect to n8n.'],
    ['ASSISTANT_TIMEOUT', 'n8n tardó demasiado', 'n8n took too long'],
    ['ASSISTANT_INVALID_RESPONSE', 'respuesta inválida', 'invalid response'],
    ['ASSISTANT_ITERATION_LIMIT', 'no pudo completar la respuesta', 'could not complete this reply'],
    ['ROLE_REQUIRED', 'La API local no reconoce la sesión Admin', 'The local API does not recognize the Admin session'],
    ['RATE_LIMIT', 'Esperá un minuto', 'Wait a minute'],
  ])('traduce %s según idioma', (code, spanish, english) => {
    expect(automationError(code, 'es')).toContain(spanish);
    expect(automationError(code, 'en')).toContain(english);
  });
});
