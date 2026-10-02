# Vértice CR — Testing y calidad

> Última actualización: **2026-09-24**.

## Objetivo

Jest + Testing Library.

Cobertura mínima objetivo:
- branches >= 70%;
- functions >= 70%;
- lines >= 70%;
- statements >= 70%.

## Estrategia

La prueba sigue la misma dirección que la arquitectura: cuanto más pura y estable sea una pieza, antes se prueba; los flujos completos se validan después.

## Orden

1. utils y reglas puras;
2. métricas;
3. services con mocks;
4. hooks;
5. componentes críticos;
6. flujos;
7. errores y estados vacíos;
8. accesibilidad/interacción crítica;
9. coverage;
10. build/lint.

## Preflight de scripts

No documentar comandos como ejecutables hasta que existan en `package.json`. Antes de la primera feature React, deben estar definidos como mínimo los scripts reales para lint, build y test; luego añadir watch/coverage según la estrategia acordada.

## Casos críticos

API 404/500, API caída durante restore (sin autorizar la sesión no verificada y permitiendo borrarla localmente), catálogo vacío, cantidad inválida de producto bajo pedido, archivo inválido/grande, formulario incompleto, doble envío, permisos, pedido inexistente, solicitud inexistente, cotización pendiente/aprobada, métricas sin datos, Dark/Light y foco/teclado. En envío Admin: resolver destinatarios desde registros, bloquear dominios reservados, exigir configuración webhook/Gmail, no cambiar a `AWAITING_APPROVAL` ante fallo y guardar estado + activity solo tras confirmación; Jest nunca envía correos reales.

## Nunca

- HTTP real desde Jest;
- secretos;
- tests que duplican implementación;
- eliminar tests para pasar build;
- hardcodear datos solo para subir coverage.

## Salida

Implementación + lint + build + tests relevantes + errores cubiertos + coverage >= 70%.

## Admin — solicitudes (2026-10-01)

La suite `tests/adminRequests.test.jsx` cubre agrupación/aislamiento de estados
desconocidos, búsqueda, filtro accionado desde la leyenda, ausencia de precio en
`PENDING_QUOTE` aunque exista un campo heredado y precio CRC de una solicitud
cotizada. `tests/adminRequestsService.test.js` cubre lectura paralela de
solicitudes/clientes y rechazo de una colección mal formada. Las pruebas usan
datos/fetch simulados; la revisión manual en navegador con JSON Server real
confirma el acceso KPI → fase del taller → lista → detalle. Estado final
(2026-10-01): suite completa 7 suites / 60 tests aprobados; cobertura global
statements 75.70%, branches 74.53%, functions 77.50%, lines 82.07%. También
pasan lint, `check:ui`, build y `git diff --check`. El npm global del host no
pudo iniciar por un `npm-cli.js` ausente; se ejecutaron Jest/ESLint/Vite con el
Node empaquetado y binarios del proyecto.

## Admin — pedidos y catálogo (2026-10-01)

`tests/adminOrders.test.jsx`/`adminOrdersService.test.js` cubren asociación,
filtros, flujo desconocido, detalle y lectura del servicio. Para catálogo,
`tests/adminCatalog.test.jsx` cubre unión de categorías, filtros por origen,
alerta de material fuera de capacidad, exclusión de campos heredados de stock,
ficha de consulta y fallback de URL de imagen rota; `adminCatalogService.test.js`
cubre lectura/validación y métodos REST de alta, edición y baja de catálogo. Estado
conjunto actual: 13 suites / 83 tests pasan, junto con ESLint, `check:ui` (48
módulos), build Vite (119 módulos) y `git diff --check`. La inspección manual
conectada previa cubrió dashboard y catálogo/ficha en viewport estrecho Dark;
no se inspeccionaron todavía los formularios nuevos, Light ni otros breakpoints.

## Admin — envío de cotización por correo (2026-10-02)

`emailAddress.test.js`, `adminActionsService.test.js`,
`requestNextAction.test.jsx` y `requestActions.test.js` cubren direcciones
entregables/no entregables, payload de acción, destinatarios visibles, bloqueo
de direcciones demo y transición interna solo después de confirmación simulada.
Jest no realiza HTTP externo ni envía correo real. `npm test -- --runInBand`
pasó 22 suites / 106 tests; la integración real de n8n/Gmail y la captura visual
Dark/Light siguen pendientes de credenciales y verificación manual controlada.

## Automatización, cotización DEMO y regresión visual — 2026-10-02

`npm run check:automation` levanta API aislada con base temporal y proveedor
mock; recorre separación de roles, los tres bots/tools, perfiles 23, cálculo,
idempotencia, cotización/aprobación, email/outbox, fulfillment y estados de
pedido, además de inspeccionar los cinco JSON n8n. No llama DeepSeek, APIs
externas o Gmail. Verificación más reciente: 23 suites/119 tests, 108 checks de
automatización, ESLint, `check:ui`, Vite build y diff check pasan en local.

Las capturas `automation/evidence/` documentan el render real de Clientes,
Pedidos, Categorías y cotizador en vistas estrechas/medias/anchas y Dark/Light.
El workflow GitHub `verify.yml` incluye `check:automation`; el resultado de CI
solo se conoce después de subir este commit.
