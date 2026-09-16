# Tienda de Impresión 3D

Frontend escalable para una tienda real de impresión 3D. El proyecto combina catálogo de productos terminados con un servicio de impresión personalizada y está diseñado para evolucionar después del curso.

**Stack base:** React + Vite + JavaScript/JSX + React Router DOM + JSON Server + Tailwind CSS.

**Rama de trabajo actual:** `Pruebas`.

## Modelo de negocio

### Productos terminados

Catálogo de gadgets, figuras, juguetes, decoración y piezas funcionales con variantes, disponibilidad e inventario.

### Impresión personalizada

El cliente puede cargar un archivo `.stl` / `.obj` o solicitar ayuda para definir una pieza. La solicitud pasa por revisión y cotización antes de convertirse en una operación de producción.

Una solicitud personalizada no se trata como una venta de ₡0: mientras no exista una cotización, su estado económico es `PENDING_QUOTE`.

## Arquitectura

La aplicación separa páginas, features, componentes, servicios, hooks, contexto y funciones puras de negocio.

```text
UI
 ↓
Pages / Features
 ↓
Hooks + Services + Utils
 ↓
JSON Server / APIs externas
 ↓
db.json
```

Las métricas siguen el mismo principio:

```text
db.json → services → funciones de métricas → dashboard
```

No se escriben manualmente las ventas, pedidos, clientes, stock ni tendencias que presenta el panel.

## Dashboard administrativo

El dashboard no será únicamente tres cards para cumplir la rúbrica. Se organizará por familias:

- ventas y resultados;
- conversión y comportamiento cuando existan eventos suficientes;
- inventario y eficiencia;
- operación de pedidos;
- impresión personalizada;
- alertas y deficiencias operativas;
- tendencias y comparaciones por periodo.

Se podrán utilizar cards KPI, líneas, barras, barras apiladas, donut, tablas operacionales, rankings y sparklines cuando cada visualización responda una pregunta útil.

Las fórmulas están documentadas en [`docs/METRICS.md`](docs/METRICS.md).

## Documentación consolidada

| Documento | Propósito |
|---|---|
| [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) | Requisitos, MoSCoW, criterios de aceptación y relación con la rúbrica |
| [`docs/BUSINESS-LOGIC.md`](docs/BUSINESS-LOGIC.md) | Entidades, estados, reglas, carrito, pedidos, cotizaciones e inventario |
| [`docs/METRICS.md`](docs/METRICS.md) | Sistema de KPIs, fórmulas, gráficos, alertas y filtros |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Estructura técnica y responsabilidades |
| [`docs/TESTING.md`](docs/TESTING.md) | Estrategia Jest + Testing Library y estándar de cobertura |

La documentación de fases anteriores se conserva como historial de decisiones de producto, visuales y UX.

## Rúbrica integrada

El proyecto contempla:

- React + React Router DOM.
- Componentes y páginas separados.
- `services/` para API local y externa.
- JSON Server con `db.json`.
- Login, registro, sesión y rutas privadas.
- Roles y autorización.
- CRUDs según el negocio.
- Dashboard con métricas derivadas y gráficos.
- Jest + Testing Library.
- Integración de IA.
- Dos flujos N8N.
- Responsive móvil, tablet y escritorio.
- Accesibilidad.

## Testing

La guía de testing del proyecto establece Jest con `jsdom`, tests `.test.js` / `.test.jsx`, mocks de `fetch` y cobertura global mínima del 70 % para branches, functions, lines y statements.

```bash
npm run test
npm run test:watch
npm run test:coverage
```

Los tests nunca deben realizar peticiones HTTP reales.

## Desarrollo

Instalar dependencias:

```bash
npm install
```

Ejecutar frontend:

```bash
npm run dev
```

Ejecutar JSON Server:

```bash
npx json-server --watch db.json --port 3001
```

## Principios permanentes

1. JavaScript/JSX; no TypeScript.
2. La UI no contiene reglas de negocio complejas.
3. Los servicios centralizan las peticiones.
4. Los cálculos importantes son funciones puras y testeables.
5. Ninguna métrica operativa se hardcodea.
6. `VALUE`, `ZERO` y `NO_DATA` son estados distintos.
7. Los errores, cargas y estados vacíos forman parte del producto.
8. No se inventan precios de solicitudes personalizadas.
9. No se suben secretos al repositorio.
10. No se usan emojis en la UI ni en comentarios del código.
11. El código generado con IA debe revisarse, probarse y poder justificarse.
