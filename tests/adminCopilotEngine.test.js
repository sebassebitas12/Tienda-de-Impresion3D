import { describe, expect, it } from '@jest/globals';
import {
  auditCatalogQuality,
  auditWorkshopOverview,
  detectAndPrepareCrudAction,
  executeAdminCopilotTurn,
} from '../scripts/admin-copilot-engine.js';
import { runAssistant } from '../scripts/assistant-runtime.js';

const fixtureData = () => ({
  categories: [
    { id: 'cat1', name: 'Gadgets', slug: 'gadgets', status: 'ACTIVE' },
    { id: 'cat5', name: 'Piezas funcionales', slug: 'piezas-funcionales', status: 'ACTIVE' },
  ],
  products: [
    {
      id: 'p1',
      name: 'Organizador modular',
      slug: 'organizador-modular',
      categoryId: 'cat1',
      material: 'PLA',
      price: 8500,
      status: 'ACTIVE',
      productionDataSource: 'DEMO_NOT_SLICED',
      images: ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg', '/img/4.jpg'],
      availableColors: ['Negro'],
      weightGrams: 50,
      estimatedProductionHours: 2,
    },
    {
      id: 'p4',
      name: 'Maceta geométrica',
      slug: 'maceta-geometrica',
      categoryId: 'cat1',
      material: 'PLA',
      price: 6000,
      status: 'ACTIVE',
      productionDataSource: 'DEMO_NOT_SLICED',
      images: ['/img/1.jpg'],
      availableColors: ['Blanco'],
      weightGrams: 30,
      estimatedProductionHours: 1.5,
    },
    {
      id: 'p5',
      name: 'Mecanismo planetario',
      slug: 'mecanismo-planetario',
      categoryId: 'cat5',
      material: 'PETG',
      price: 12000,
      status: 'ACTIVE',
      productionDataSource: 'DEMO_NOT_SLICED',
      images: ['/img/1.jpg', '/img/2.jpg'],
      availableColors: ['Negro'],
      weightGrams: 80,
      estimatedProductionHours: 4,
    },
  ],
  customPrintRequests: [
    { id: 'rq-1', status: 'PENDING_QUOTE', description: 'Pieza de repuesto para torno', quantity: 2, material: 'PETG' },
    { id: 'rq-2', status: 'IN_REVIEW', description: 'Brazo para simulación', quantity: 1, material: 'PETG' },
  ],
  orders: [
    { id: 'ord-1', status: 'PENDING', total: 8500, orderItems: [{ productId: 'p1' }] },
    { id: 'ord-2', status: 'IN_PRODUCTION', total: 12000, orderItems: [] },
  ],
  activityLog: [],
});

describe('Admin Copilot Engine — Lectura y propuesta de CRUDs', () => {
  it('audita calidad del catálogo identificando fichas con galería incompleta y estado de laminado', () => {
    const data = fixtureData();
    const result = auditCatalogQuality(data, 'es');

    expect(result.reply).toContain('Diagnóstico de calidad del catálogo');
    expect(result.reply).toContain('Maceta geométrica');
    expect(result.reply).toContain('1/4 fotos');
    expect(result.reply).toContain('Mecanismo planetario');
    expect(result.reply).toContain('2/4 fotos');
    expect(result.reply).toContain('DEMO_NOT_SLICED');
    expect(result.links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '/admin/catalogo' }),
        expect.objectContaining({ path: '/admin/catalogo/p4/editar' }),
      ])
    );
  });

  it('resume prioridades del taller dividiendo solicitudes y pedidos con gobernanza de cobros', () => {
    const data = fixtureData();
    const result = auditWorkshopOverview(data, 'es');

    expect(result.reply).toContain('Solicitudes personalizadas');
    expect(result.reply).toContain('Pieza de repuesto para torno');
    expect(result.reply).toContain('Pedidos en curso');
    expect(result.reply).toContain('Pendientes de confirmación');
    expect(result.reply).toContain('Nota de control');
    expect(result.links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '/admin/solicitudes' }),
        expect.objectContaining({ path: '/admin/pedidos' }),
      ])
    );
  });

  it('prepara propuesta para crear un nuevo producto con cálculo de precio DEMO', () => {
    const data = fixtureData();
    const result = detectAndPrepareCrudAction(
      { message: 'Crear Soporte de Soldador en PETG, categoría Piezas funcionales, peso 60g, tiempo 2.5h, color Negro' },
      data,
      'es'
    );

    expect(result).not.toBeNull();
    expect(result.adminAction).toBeDefined();
    expect(result.adminAction.operation).toBe('CREATE');
    expect(result.adminAction.name).toBe('Soporte de Soldador');
    expect(result.adminAction.changes.material).toBe('PETG');
    expect(result.adminAction.changes.price).toBeGreaterThan(0);
    expect(result.adminAction.changes.priceSource).toBe('DEMO');
    expect(result.reply).toContain('Preparé la propuesta interactiva');
  });

  it('prepara propuesta para ocultar un producto cambiando su estado a INACTIVE', () => {
    const data = fixtureData();
    const result = detectAndPrepareCrudAction({ message: 'Ocultar la pieza p5' }, data, 'es');

    expect(result).not.toBeNull();
    expect(result.adminAction).toBeDefined();
    expect(result.adminAction.operation).toBe('UPDATE');
    expect(result.adminAction.recordId).toBe('p5');
    expect(result.adminAction.changes.status).toBe('INACTIVE');
    expect(result.reply).toContain('ocultar');
  });

  it('prepara propuesta para actualizar el precio de un producto existente', () => {
    const data = fixtureData();
    const result = detectAndPrepareCrudAction({ message: 'Cambiar precio de p1 a 15000' }, data, 'es');

    expect(result).not.toBeNull();
    expect(result.adminAction).toBeDefined();
    expect(result.adminAction.operation).toBe('UPDATE');
    expect(result.adminAction.recordId).toBe('p1');
    expect(result.adminAction.changes.price).toBe(15000);
    expect(result.reply).toContain('15');
  });

  it('protege piezas con pedidos asociados impidiendo el borrado y sugiriendo ocultar', () => {
    const data = fixtureData();
    const result = detectAndPrepareCrudAction({ message: 'Eliminar pieza p1' }, data, 'es');

    expect(result.adminAction).toBeUndefined();
    expect(result.reply).toContain('No es posible eliminar');
    expect(result.reply).toContain('pedidos registrados asociados');
    expect(result.reply).toContain('INACTIVE');
  });

  it('prepara propuesta para crear una nueva categoría', () => {
    const data = fixtureData();
    const result = detectAndPrepareCrudAction({ message: 'Crear categoría Drones' }, data, 'es');

    expect(result).not.toBeNull();
    expect(result.adminAction).toBeDefined();
    expect(result.adminAction.entity).toBe('categories');
    expect(result.adminAction.operation).toBe('CREATE');
    expect(result.adminAction.name).toBe('Drones');
  });

  it('ejecuta fallback en runAssistant cuando n8n no está disponible en modo admin', async () => {
    const data = fixtureData();
    const admin = { id: 'a1', role: 'admin', status: 'ACTIVE' };

    // Simula n8n caído o con error 500
    const fetchImpl = async () => ({ ok: false, status: 500 });

    const result = await runAssistant(
      { mode: 'admin', message: 'Revisa la calidad del catálogo y dime qué fichas están incompletas.' },
      { actor: admin, data, getRates: async () => ({}) },
      { fetchImpl }
    );

    expect(result.error).toBeUndefined();
    expect(result.source).toBe('ADMIN_OPERATIONAL');
    expect(result.reply).toContain('Diagnóstico de calidad del catálogo');
    expect(result.reply).toContain('Maceta geométrica');
    expect(result.links.length).toBeGreaterThan(0);
  });

  it('ejecuta fallback en runAssistant cuando n8n devuelve respuesta con error de herramienta de langchain', async () => {
    const data = fixtureData();
    const admin = { id: 'a1', role: 'admin', status: 'ACTIVE' };

    const fetchImpl = async () => ({
      ok: true,
      json: async () => ({
        output: {
          reply: 'No pude revisar la calidad del catálogo: la herramienta catalog_quality devolvió un error ("supplyData method but no execute method").',
          links: [],
        },
      }),
    });

    const result = await runAssistant(
      { mode: 'admin', message: 'Revisa la calidad del catálogo y dime qué fichas están incompletas.' },
      { actor: admin, data, getRates: async () => ({}) },
      { fetchImpl }
    );

    expect(result.error).toBeUndefined();
    expect(result.source).toBe('ADMIN_OPERATIONAL');
    expect(result.reply).toContain('Diagnóstico de calidad del catálogo');
    expect(result.reply).toContain('Maceta geométrica');
  });

  it('ejecuta directamente un turno operativo general en executeAdminCopilotTurn', () => {
    const data = fixtureData();
    const result = executeAdminCopilotTurn({ message: 'Hola' }, data);
    expect(result.reply).toContain('Copiloto Admin');
    expect(result.links.length).toBeGreaterThan(0);
  });
});
