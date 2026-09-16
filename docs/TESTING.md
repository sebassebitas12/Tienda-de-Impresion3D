# Testing — React + Jest + Testing Library

## 1. Fuente de referencia

Este documento adapta al proyecto la guía `testing-guide.md` proporcionada para el curso. Se mantiene como estándar técnico la ejecución con Jest, entorno `jsdom`, tests `.test.js` / `.test.jsx`, mocks de `fetch` y cobertura global mínima del 70 %.

La guía establece expresamente que los tests no deben realizar peticiones HTTP reales; las respuestas de APIs deben interceptarse mediante `global.fetch` conservando la estructura esperada en producción.

## 2. Scripts previstos

```json
"scripts": {
  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
  "test:watch": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch",
  "test:coverage": "node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage"
}
```

Comandos:

```bash
npm run test
npm run test:watch
npm run test:coverage
```

## 3. Configuración objetivo

Archivo: `jest.config.cjs`

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: ['**/*.test.js', '**/*.test.jsx'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  coverageReporters: ['text', 'text-summary', 'html'],
  clearMocks: true
};
```

## 4. Capas que deben probarse

### Lógica de negocio

Prioridad alta porque concentra cálculos independientes de la UI:

- carrito;
- subtotal y total;
- descuentos;
- stock;
- transiciones de estado;
- validación de solicitudes;
- métricas;
- agrupación temporal.

### Servicios

Probar:

- URL y método;
- serialización JSON;
- respuesta correcta;
- respuesta no OK;
- errores de red;
- datos faltantes;
- fallbacks.

### Componentes

Probar comportamiento observable:

- renderizado;
- estados loading;
- éxito;
- vacío;
- error;
- interacción;
- validación;
- accesibilidad básica;
- prevención de doble envío.

### Hooks

Cuando existan hooks personalizados:

- estado inicial;
- efectos asíncronos;
- actualizaciones;
- temporizadores con `jest.useFakeTimers()` cuando corresponda.

## 5. Convención de archivos

```text
ProductCard.test.jsx
Cart.test.jsx
Checkout.test.jsx
Login.test.jsx
AdminDashboard.test.jsx

productService.test.js
orderService.test.js
customPrintService.test.js
metrics.test.js
calculations.test.js
validation.test.js
```

## 6. Mocking de API

Regla de oro:

> Nunca realizar peticiones HTTP reales durante los tests.

Ejemplo:

```javascript
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => mockData
});
```

Para errores:

```javascript
global.fetch = jest.fn().mockResolvedValue({
  ok: false,
  status: 404,
  json: async () => ({})
});
```

Después debe verificarse la interacción:

```javascript
expect(global.fetch).toHaveBeenCalledWith(
  expect.stringContaining('/products')
);
```

## 7. Testing del dashboard

El `AdminDashboard` no debe mockear valores de KPI directamente dentro del componente.

La prueba debe preparar datos de entrada, ejecutar servicios/mock y verificar que:

- los valores mostrados corresponden al dataset;
- los estados vacíos son correctos;
- las alertas aparecen cuando corresponde;
- los filtros modifican la información presentada;
- los gráficos reciben series derivadas del dataset.

## 8. Testing de métricas

Las métricas deben probarse como funciones puras antes de probar el dashboard.

Ejemplo conceptual:

```javascript
const metrics = calculateDashboardMetrics({
  orders,
  orderItems,
  products,
  customPrintRequests,
  users
});
```

Esto permite comprobar la lógica sin montar React.

## 9. Casos negativos obligatorios

- API no disponible.
- HTTP 404.
- HTTP 500.
- JSON inválido o incompleto.
- Catálogo vacío.
- Stock insuficiente.
- Archivo con extensión inválida.
- Archivo demasiado grande.
- Formulario incompleto.
- Doble envío.
- Usuario sin permisos.
- Pedido inexistente.
- Solicitud inexistente.
- Métrica sin datos.

## 10. Accesibilidad en tests

Cuando sea posible, consultar elementos mediante roles y nombres accesibles:

```javascript
screen.getByRole('button', { name: /agregar al carrito/i });
screen.getByRole('textbox', { name: /correo/i });
```

No depender de clases CSS para comprobar comportamiento.

## 11. Cobertura

La guía de testing establece un mínimo global del 70 % para:

- branches;
- functions;
- lines;
- statements.

El objetivo del proyecto será mantener al menos ese mínimo y evitar aumentar cobertura mediante tests artificiales que no validen comportamiento real.

## 12. Qué no hacer

- No llamar APIs reales desde Jest.
- No probar detalles internos irrelevantes.
- No depender de tiempos reales cuando puedan usarse fake timers.
- No duplicar la lógica de producción dentro del test.
- No colocar números de métricas manualmente para facilitar una prueba.
- No eliminar tests para hacer pasar el build.
- No considerar el porcentaje de cobertura como sustituto de calidad.

## 13. Orden de implementación

```text
1. Configurar Jest
2. Probar utils y lógica de negocio
3. Probar services con fetch mock
4. Probar hooks
5. Probar componentes críticos
6. Probar flujos principales
7. Ejecutar coverage
8. Corregir ramas no cubiertas
9. Validar build + lint + tests
```

## 14. Criterio de salida

Una funcionalidad se considera lista cuando:

```text
Implementada
   +
Lint sin errores
   +
Build correcto
   +
Tests relevantes
   +
Casos de error cubiertos
   +
Coverage ≥ 70 % global
   =
Lista para integración
```
