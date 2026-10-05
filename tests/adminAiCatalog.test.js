/** @jest-environment node */
import { describe, expect, test, jest } from '@jest/globals';
import { prepareAdminCatalogAction, applyAdminCatalogAction } from '../scripts/admin-ai-catalog.js';
import { runAssistant, executeAssistantToolCapability } from '../scripts/assistant-runtime.js';

const admin = { id: 'a1', role: 'admin', status: 'ACTIVE' };
const fixture = () => ({ categories: [{ id: 'c1', name: 'Accesorios', status: 'ACTIVE' }], products: [], orders: [], orderItems: [], activityLog: [] });
const input = { entity: 'products', operation: 'CREATE', changes: { name: 'Base teléfono', categoryId: 'c1', description: 'Base para el escritorio', material: 'PLA', availableColors: ['Negro'], weightGrams: 40, estimatedProductionHours: 2, status: 'ACTIVE' } };

describe('CRUD IA confirmado por Admin', () => {
  test('preparar no modifica datos; confirmar crea pieza con precio calculado y auditoría; reintento no duplica', () => {
    const data = fixture(); const before = JSON.stringify(data);
    const action = prepareAdminCatalogAction(input, data);
    expect(JSON.stringify(data)).toBe(before);
    expect(action.changes.priceSource).toBe('DEMO');
    expect(action.changes.price).toBeGreaterThan(0);
    const response = applyAdminCatalogAction(action, data, admin);
    expect(response.record.status).toBe('ACTIVE');
    expect(data.products).toHaveLength(1); expect(data.activityLog).toHaveLength(1);
    expect(applyAdminCatalogAction(action, data, admin).alreadyApplied).toBe(true);
    expect(data.products).toHaveLength(1); expect(data.activityLog).toHaveLength(1);
  });
  test('cliente no puede confirmar; editar invalida propuestas viejas; borrar elimina registro sin referencias', () => {
    const data = fixture();
    const action = prepareAdminCatalogAction(input, data);
    expect(applyAdminCatalogAction(action, data, { ...admin, role: 'customer' }).error).toBe('ADMIN_REQUIRED');
    const { record } = applyAdminCatalogAction(action, data, admin);
    const update = prepareAdminCatalogAction({ entity: 'products', operation: 'UPDATE', recordId: record.id, changes: { name: 'Base nueva' } }, data);
    record.updatedAt = 'otro';
    expect(applyAdminCatalogAction(update, data, admin).error).toBe('STATUS_CONFLICT');
    const fresh = prepareAdminCatalogAction({ entity: 'products', operation: 'UPDATE', recordId: record.id, changes: { name: 'Base nueva' } }, data);
    expect(applyAdminCatalogAction(fresh, data, admin).record.name).toBe('Base nueva');
    const remove = prepareAdminCatalogAction({ entity: 'products', operation: 'DELETE', recordId: record.id }, data);
    expect(applyAdminCatalogAction(remove, data, admin).error).toBeUndefined(); expect(data.products).toHaveLength(0);
  });
  test('protege pedidos/categorías usadas y valida campos/dobles nombres al confirmar', () => {
    const data = fixture(); const { record } = applyAdminCatalogAction(prepareAdminCatalogAction(input, data), data, admin);
    data.orders.push({ orderItems: [{ productId: record.id }] });
    expect(prepareAdminCatalogAction({ entity: 'products', operation: 'DELETE', recordId: record.id }, data).error).toBe('PRODUCT_IN_USE');
    expect(prepareAdminCatalogAction({ entity: 'categories', operation: 'DELETE', recordId: 'c1' }, data).error).toBe('CATEGORY_IN_USE');
    expect(prepareAdminCatalogAction({ ...input, changes: { ...input.changes, secret: 'injected' } }, data).error).toBe('INVALID_CATALOG_FIELDS');
    expect(prepareAdminCatalogAction(input, data).error).toBe('CATALOG_DUPLICATE');
  });
  test('crea, edita y elimina categoría; publicar requiere campos completos', () => {
    const data = fixture();
    const created = applyAdminCatalogAction(prepareAdminCatalogAction({ entity: 'categories', operation: 'CREATE', changes: { name: 'Decoración' } }, data), data, admin).record;
    const edited = applyAdminCatalogAction(prepareAdminCatalogAction({ entity: 'categories', operation: 'UPDATE', recordId: created.id, changes: { name: 'Decoración nueva' } }, data), data, admin).record;
    expect(edited.name).toBe('Decoración nueva');
    expect(applyAdminCatalogAction(prepareAdminCatalogAction({ entity: 'categories', operation: 'DELETE', recordId: edited.id }, data), data, admin).error).toBeUndefined();
    expect(prepareAdminCatalogAction({ ...input, changes: { name: 'Otra', categoryId: 'c1', status: 'ACTIVE' } }, data).error).toBe('CATALOG_PUBLICATION_INCOMPLETE');
  });
});

describe('proveedor DeepSeek y herramientas autorizadas', () => {
  test('n8n también devuelve la propuesta real del dispatcher sin confiar en acciones inventadas en la respuesta', async () => {
    const data = fixture();
    const response = await runAssistant({ mode: 'admin', message: 'Crear base' }, { actor: admin, data, getRates: async () => ({}) }, {
      fetchImpl: async (_url, options) => {
        const payload = JSON.parse(options.body);
        await executeAssistantToolCapability(payload.toolCapability, { mode: 'admin', name: 'prepare_catalog_action', args: { entity: 'products', operation: 'CREATE', changesJson: JSON.stringify(input.changes) } });
        return { ok: true, json: async () => ({ output: { reply: 'Revisá y confirmá.', links: [], adminAction: { operation: 'DELETE' } } }) };
      },
    });
    expect(response.source).toBe('N8N'); expect(response.adminAction.operation).toBe('CREATE');
    expect(data.products).toHaveLength(0);
  });
  test('tools de IA preparan propuesta canónica sin mutar, la respuesta muestra esa propuesta', async () => {
    const data = fixture();
    const fetchImpl = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ choices: [{ finish_reason: 'tool_calls', message: { role: 'assistant', content: null, tool_calls: [{ id: 'tool1', function: { name: 'prepare_catalog_action', arguments: JSON.stringify({ entity: 'products', operation: 'CREATE', changesJson: JSON.stringify(input.changes) }) } }] } }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: JSON.stringify({ reply: 'Revisá la pieza y confirmá.', links: [] }) } }] }) });
    const response = await runAssistant({ mode: 'admin', message: 'Crear base' }, { actor: admin, data, getRates: async () => ({}) }, { env: { VERTICE_AI_PROVIDER: 'deepseek', DEEPSEEK_API_KEY: 'test-only-key' }, fetchImpl });
    expect(response.source).toBe('DEEPSEEK'); expect(response.adminAction.changes.price).toBeGreaterThan(0);
    expect(data.products).toHaveLength(0);
    expect(fetchImpl.mock.calls[0][0]).toBe('https://api.deepseek.com/chat/completions');
    expect(JSON.parse(fetchImpl.mock.calls[1][1].body).messages.at(-1).role).toBe('tool');
  });
  test('clave ausente, rol incorrecto y crédito agotado dan fallos identificables sin revelar clave', async () => {
    const context = { actor: admin, data: fixture(), getRates: async () => ({}) };
    await expect(runAssistant({ mode: 'admin', message: 'Hola' }, context, { env: { VERTICE_AI_PROVIDER: 'deepseek' } })).resolves.toEqual({ error: 'ASSISTANT_NOT_CONFIGURED' });
    await expect(runAssistant({ mode: 'admin', message: 'Hola' }, { ...context, actor: { role: 'customer' } }, { env: { VERTICE_AI_PROVIDER: 'deepseek' } })).resolves.toEqual({ error: 'ROLE_REQUIRED' });
    await expect(runAssistant({ mode: 'admin', message: 'Hola' }, context, { env: { VERTICE_AI_PROVIDER: 'deepseek', DEEPSEEK_API_KEY: 'test-only-key' }, fetchImpl: async () => ({ ok: false, status: 402 }) })).resolves.toEqual({ error: 'ASSISTANT_CREDIT_REQUIRED' });
  });
});
