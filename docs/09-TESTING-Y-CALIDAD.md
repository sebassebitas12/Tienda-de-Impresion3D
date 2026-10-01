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

API 404/500, API caída durante restore (sin autorizar la sesión no verificada y permitiendo borrarla localmente), catálogo vacío, stock insuficiente, archivo inválido/grande, formulario incompleto, doble envío, permisos, pedido inexistente, solicitud inexistente, cotización pendiente/aprobada, métricas sin datos, Dark/Light y foco/teclado.

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
