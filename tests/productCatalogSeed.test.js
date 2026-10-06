import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { describe, expect, test } from '@jest/globals';

const catalog = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'db.json'), 'utf8'));
const activeProducts = catalog.products.filter(product => product.status === 'ACTIVE');

describe('Semilla de catálogo para presentación', () => {
  test('identifica como DEMO todos los precios publicados de la semilla', () => {
    expect(activeProducts.length).toBe(25);
    expect(activeProducts.every(product => Number.isFinite(product.price) && product.priceSource === 'DEMO')).toBe(true);
  });

  test('cada producto publicado tiene categoría e imágenes existentes', () => {
    for (const product of activeProducts) {
      expect(catalog.categories.some(category => String(category.id) === String(product.categoryId))).toBe(true);
      expect(product.images.length).toBeGreaterThan(0);
      for (const image of product.images) {
        expect(fs.existsSync(path.resolve(process.cwd(), 'public', image.replace(/^\//, '')))).toBe(true);
      }
    }
  });

  test('las fichas sensibles no prometen uso clínico, alimentario o de vuelo', () => {
    const byId = Object.fromEntries(catalog.products.map(product => [product.id, product]));
    expect(byId.p12.description).toMatch(/no está certificado para contacto alimentario/i);
    expect(byId.p13.description).toMatch(/no es un dispositivo médico/i);
    expect(byId.p24.description).toMatch(/no se han validado para vuelo/i);
  });

  test('las imágenes conceptuales no presentan escala desconocida como medida verificada', () => {
    const byId = Object.fromEntries(catalog.products.map(product => [product.id, product]));
    expect(byId.p21.description).toMatch(/escala 1\/10.*no se ha verificado/i);
    expect(byId.p25.description).toMatch(/escala.*no están verificados/i);
  });

  test('cada diseño conserva atribución y evidencia del archivo sin fingir laminado', () => {
    for (const product of activeProducts) {
      expect(product.source.platform).toBe('Printables');
      expect(product.source.author).toBeTruthy();
      expect(product.source.license).toBeTruthy();
      expect(product.modelEvidence.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(product.modelEvidence.slicingStatus).toBe('PENDING');
      expect(product.productionDataSource).toBe('DEMO_NOT_SLICED');
    }
  });

});
