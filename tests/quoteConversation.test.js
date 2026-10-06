import { describe, expect, it } from '@jest/globals';
import { extractQuoteDraft, prepareExplicitQuoteDraft } from '../src/utils/quoteConversation.js';

describe('preparación explícita del borrador de solicitud', () => {
  it('deja de interrogar, conserva lo dicho y nunca inventa unidades', () => {
    const result = prepareExplicitQuoteDraft([
      { role: 'user', content: 'Quiero hacerme un dildo de juguete' },
      { role: 'assistant', content: '¿Preferís rígido o flexible TPU?' },
      { role: 'user', content: 'Una unidad, material flexible y tamaño promedio' },
      { role: 'assistant', content: 'Anoto una unidad en TPU flexible, ¿qué tamaño?' },
      { role: 'user', content: 'Quiero que me hagas el pedido' },
      { role: 'user', content: 'Largo de 15 y ancho de 3' },
    ]);

    expect(result.draft).toEqual(expect.objectContaining({
      description: 'Dildo de juguete', intendedUse: 'Uso personal; contacto corporal',
      dimensions: 'Largo 15; ancho 3 (unidad por confirmar)', material: 'TPU', quantity: 1,
    }));
    expect(result.reply).toMatch(/No se envió nada/);
    expect(result.reply).toMatch(/no se certifica seguridad/i);
  });

  it('no prepara una solicitud por una pregunta informativa', () => {
    expect(prepareExplicitQuoteDraft([
      { role: 'user', content: 'Quiero hacer una pieza y saber qué datos necesitás.' },
    ])).toBeNull();
  });

  it('captura el progreso explícito del intake antes de que se solicite preparar el envío', () => {
    const result = extractQuoteDraft([
      { role: 'user', content: 'Quiero fabricar una base para celular.' },
      { role: 'assistant', content: '¿Qué medidas aproximadas necesitás?' },
      { role: 'user', content: 'Una unidad, material PETG, largo 15 cm y ancho 3 cm.' },
    ]);
    expect(result).toEqual(expect.objectContaining({ description: 'Base para celular', intendedUse: '', quantity: 1, material: 'PETG', dimensions: 'Largo 15 cm; ancho 3 cm' }));
  });

  it('no convierte una pregunta sobre materiales en la descripción de una pieza', () => {
    expect(extractQuoteDraft([{ role: 'user', content: '¿Qué usos orientativos tiene TPU en impresión 3D FDM?' }])).toBeNull();
    expect(extractQuoteDraft([{ role: 'user', content: 'Ayudame a elegir un material.' }])).toBeNull();
  });

  it('extrae la pieza de una comparación sin elegir arbitrariamente uno de los materiales', () => {
    const result = extractQuoteDraft([{ role: 'user', content: 'Compará PETG y PLA para una base rígida de teléfono que usaré en interiores.' }]);

    expect(result).toEqual(expect.objectContaining({ description: 'Base rígida de teléfono', material: '' }));
  });

  it('no infiere el material si el cliente solo dijo que lo quiere flexible', () => {
    const result = prepareExplicitQuoteDraft([
      { role: 'user', content: 'Quiero una pieza flexible, una unidad.' },
      { role: 'user', content: 'Prepará la solicitud.' },
    ]);
    expect(result.draft.material).toBe('');
  });

  it('no confunde la instrucción de preparar el resumen con el uso de la pieza', () => {
    const result = prepareExplicitQuoteDraft([
      { role: 'user', content: 'Quiero un organizador de cables, una unidad, aproximadamente 15 cm de largo por 3 cm de ancho.' },
      { role: 'user', content: 'Prepará el resumen para revisarlo, por favor.' },
    ]);

    expect(result.draft).toEqual(expect.objectContaining({
      description: 'Organizador de cables, una unidad, aproximadamente 15 cm de largo por 3 cm de ancho',
      intendedUse: '',
      dimensions: 'Largo 15 cm; ancho 3 cm',
      quantity: 1,
    }));
  });

  it('no agrega la instrucción de revisar el resumen al nombre de la pieza', () => {
    const result = prepareExplicitQuoteDraft([
      { role: 'user', content: 'Quiero un soporte para teléfono de escritorio. Prepará el resumen para revisarlo.' },
    ]);
    expect(result.draft.description).toBe('Soporte para teléfono de escritorio');
  });

  it('preserva diámetro cuando el cliente lo nombra así', () => {
    const result = prepareExplicitQuoteDraft([
      { role: 'user', content: 'Una pieza de 15 cm de largo por 3 cm de diámetro.' },
      { role: 'user', content: 'Prepará la solicitud.' },
    ]);
    expect(result.draft.dimensions).toBe('Largo 15 cm; diámetro 3 cm');
  });

  it('separa el uso previsto de la cantidad y las medidas', () => {
    const result = prepareExplicitQuoteDraft([
      { role: 'user', content: 'Quiero un organizador de cables para ordenar cables sobre el escritorio, 1 unidad, largo 15 cm y ancho 3 cm. Prepará el resumen.' },
    ]);
    expect(result.draft.intendedUse).toBe('ordenar cables sobre el escritorio');
    expect(result.draft.dimensions).toBe('Largo 15 cm; ancho 3 cm');
    expect(result.draft.quantity).toBe(1);
  });

  it('convierte una conversación natural en un resumen limpio y deja ampliar el borrador después', () => {
    const turns = [
      { role: 'user', content: 'Estoy pensando en un organizador de cables para escritorio. ¿Qué dato te falta para ordenar la solicitud?' },
      { role: 'assistant', content: '¿Qué medidas aproximadas necesita (largo, ancho, alto) y cuántas unidades?' },
      { role: 'user', content: 'Quiero que me prepares la solicitud con lo que ya te dije.' },
      { role: 'user', content: 'Largo de 15 cm y ancho de 3 cm, una unidad en PETG. Referencia https://example.com/pieza.' },
    ];

    const result = prepareExplicitQuoteDraft(turns);
    expect(result.draft).toEqual(expect.objectContaining({
      description: 'Organizador de cables para escritorio',
      intendedUse: '',
      dimensions: 'Largo 15 cm; ancho 3 cm',
      material: 'PETG',
      quantity: 1,
      referenceUrl: 'https://example.com/pieza',
    }));
  });

  it('solo reutiliza una orden anterior de borrador para detalles estructurados, no para preguntas nuevas', () => {
    const turns = [
      { role: 'user', content: 'Quiero un organizador para el escritorio.' },
      { role: 'user', content: 'Prepará el resumen para revisarlo.' },
    ];

    expect(prepareExplicitQuoteDraft([...turns, {
      role: 'user', content: 'Hola, todavía estoy pensando qué pieza hacer. ¿Qué datos conviene tener para empezar?',
    }])).toBeNull();

    expect(prepareExplicitQuoteDraft([...turns, {
      role: 'user', content: 'Largo de 15 cm y ancho de 3 cm.',
    }])).toEqual(expect.objectContaining({
      reply: expect.stringMatching(/Actualicé el borrador.*No se envió nada/),
      draft: expect.objectContaining({ description: 'Organizador para el escritorio', dimensions: 'Largo 15 cm; ancho 3 cm' }),
    }));
  });

  it('permite al cliente editar y corregir detalles en el chat (cantidad, material, medidas, descripción)', () => {
    const turns = [
      { role: 'user', content: 'Quiero un engranaje para motor, 1 unidad, material PLA, 5 x 5 cm.' },
      { role: 'user', content: 'Prepará el resumen.' },
    ];
    const initial = prepareExplicitQuoteDraft(turns);
    expect(initial.draft.quantity).toBe(1);
    expect(initial.draft.material).toBe('PLA');
    expect(initial.draft.dimensions).toBe('5 × 5 cm');

    // Cambiar cantidad
    const updatedQty = prepareExplicitQuoteDraft([...turns, { role: 'user', content: 'Cambiá la cantidad a 5 unidades' }]);
    expect(updatedQty.draft.quantity).toBe(5);
    expect(updatedQty.reply).toMatch(/Actualicé el borrador/);

    // Cambiar material
    const updatedMat = prepareExplicitQuoteDraft([...turns, { role: 'user', content: 'Cambiá el material a PETG' }]);
    expect(updatedMat.draft.material).toBe('PETG');

    // Cambiar medidas con formato estándar 3D
    const updatedDim = prepareExplicitQuoteDraft([...turns, { role: 'user', content: 'Las medidas son 15 x 8 x 4 cm' }]);
    expect(updatedDim.draft.dimensions).toBe('15 × 8 × 4 cm');

    // Borrar medidas
    const clearedDim = prepareExplicitQuoteDraft([...turns, { role: 'user', content: 'Borrá las medidas, no las tengo' }]);
    expect(clearedDim.draft.dimensions).toBe('');

    // Cambiar descripción
    const updatedDesc = prepareExplicitQuoteDraft([...turns, { role: 'user', content: 'Cambiá la descripción a soporte para soldador' }]);
    expect(updatedDesc.draft.description).toBe('Soporte para soldador');
  });
});
