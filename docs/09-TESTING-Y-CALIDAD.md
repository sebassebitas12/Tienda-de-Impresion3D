# Vértice CR — Testing y calidad

> Última actualización: **2026-10-03**.

## Verificación del handoff A — 2026-10-03

- 25 suites, 136 tests pasan. `adminCatalogForm.test.jsx` cubre alta DRAFT, selección/reemplazo de portada (incluidas dos selecciones consecutivas), conservación de fotos secundarias, publicación incompleta, CRUD y protecciones de categoría/historial/foco.
- Lint, check:ui y build pasan; aviso de chunk >500 kB sigue presente.
- check:automation: 201 comprobaciones HTTP/permisos/idempotencia/correo mock/tools/workflows/assets con base aislada, no envíos externos. Se detectó y corrigió divergencia previa entre copias del workflow unificado y su generador; se fijan tipo y versión de tool HTTP en cada rol.
- Navegador: CRUD completo con registros temporales y guardias; 13 vistas × 3 anchos × 2 temas, evidencia y hallazgos en docs/05. Costeo avanzado abierto y selector por teclado revisados; no sustituye una prueba con lector de pantalla.
- AdminActivity también fue abierto con Admin y datos actuales de JSON Server: 3 eventos persistidos se renderizaron y enlazaron a su solicitud; verificación visual/AX Light a 1280×720 (sin guardar una captura adicional).
- Base original sin cambios tras limpiar registros QA. Commit de código `fb44abb` subido a Pruebas; [Verify Pruebas](https://github.com/sebassebitas12/Tienda-de-Impresion3D/actions/runs/37136992470) terminó success para ese SHA. Incluye npm ci, lint, tests, check:ui, check:automation y build.

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
pedido. Inspecciona los cinco módulos fuente y el JSON unificado: rutas, entradas,
convergencia al nodo DeepSeek compartido, Gmail, IDs únicos y conexiones válidas.
No llama DeepSeek, APIs externas o Gmail. Verificación local de R-H70: 23
suites/119 tests, 160 checks de automatización, ESLint, `check:ui`, Vite build y
diff check pasan. Vite deja una advertencia de bundle principal mayor a 500 kB;
el build termina correctamente. CI remoto queda pendiente del push de R-H70.

Las capturas `automation/evidence/` conservan una vista representativa de cada
pantalla/estado Admin por tema (26 PNG, 1280 px). La matriz completa de render
real (375/768/1280 × Dark/Light) y estados auxiliares permanece local en la
carpeta ignorada `automation/evidence/_local_archive/`; no forma parte del
repositorio ni se usa como evidencia versionada.
El workflow GitHub `verify.yml` incluye `check:automation`; el resultado de CI
solo se conoce después de subir este commit.

## Chat — envío por teclado y OpenRouter — 2026-10-03

`tests/preferences.test.jsx` comprueba que `Enter` envía una pregunta y que
`Shift+Enter` no la envía, preservando el borrador. La evidencia live de n8n se
registra en `docs/07`: el nodo OpenRouter aparecía sin conexiones y la ejecución
del chat interno seguía usando DeepSeek; esto no equivale a una prueba de los
webhooks del sitio. Tras este cambio: 26 suites/146 tests, lint, `check:ui`,
`check:automation` (205 verificaciones), build y `git diff --check` pasan.
Estas son comprobaciones locales; todavía no se han corrido en CI para un nuevo
commit.

### Asistentes — fallos B1 — 2026-10-03

`runAssistant` ya no reemplaza una caída, timeout o respuesta inválida de n8n con
una respuesta local `DEMO_RULES`, porque eso ocultaba si el workflow realmente
contestó. Devuelve `ASSISTANT_UNAVAILABLE` (HTTP 502), `ASSISTANT_TIMEOUT`
(HTTP 504) o `ASSISTANT_INVALID_RESPONSE` (HTTP 502); el panel muestra un error
accesible y localizado, y `role=status` conserva la espera. Jest cubre estos casos
incluido el estado de loading; `check:automation` fuerza proveedor HTTP 503 y
salida inválida contra el API aislado. El timeout se prueba a nivel de runtime
sin esperar 90 segundos. No se simularon como evidencia de navegador real.

### Intake multipart, cotizador de catálogo y copiloto Admin — 2026-10-03

`check:automation` arranca API y proveedor mock con base/almacenamiento aislados;
prueba el parseo real `multipart/form-data`, los topes/metadatos, persistencia
`PENDING_QUOTE` sin precio/correo, reintento idempotente, lectura de adjunto por
dueño/Admin y rechazo para otra cuenta; después recorre cotización DEMO Admin y
correo únicamente contra Gmail mock. Jest cubre `requestDraft` con campos
explícitos y descarte de campos ajenos, precio DEMO del catálogo y pantalla
Admin independiente. Ninguna de estas pruebas envía a OpenRouter o Gmail real.

El flujo quote también prueba que Enter envía únicamente el turno de chat,
Shift+Enter conserva el salto de línea, el resumen generado ofrece un salto con
foco accesible al formulario y no dispara el intake. `check:automation` evalúa el
normalizador exportado con JSON en bloque Markdown y con el texto del límite de
iteraciones; este último debe convertirse en error, no en una respuesta.

La instalación del parser multipart antes del parser JSON queda cubierta por el
endpoint de integración; si un test devuelve texto de error del parser, detener
la validación y no afirmar que la subida está lista.

### C-P1 — autocompletado asistido de producto — 2026-10-04

`adminCatalogForm.test.jsx` cubre que el formulario envíe solo nombre/idioma con
`mode: general`, `task: catalog_product_draft` y token; aplique description,
material, colores y estimaciones sin guardar; impida calcular con gramos/horas
no verificados; conserve el calculador después de confirmar y muestre error de
timeout sin modificar ficha. `quoteAutomation.test.js` cubre autorización Admin,
payload/prompt de tarea, tools deshabilitadas y rechazo de JSON inválido.
Resultado dirigido actual: 13 pruebas de formulario y 24 de runtime aprobadas.
El contrato n8n se comprueba en el export local; probar el nuevo formato desde
UI contra el workflow publicado requiere importar/publicar el JSON actualizado.

La auditoría visual local inspeccionó el formulario real en Dark y Light en una
ventana de escritorio aproximada de 1344×625. El CTA vive dentro de la ficha,
se ve en ambos temas y no reutiliza el chat flotante. La verificación responsive
con viewport dedicado de 768/375 px permanece pendiente: `agent-browser` no está
instalado y no se añadió una dependencia solo para capturar tamaños.

### R-H72 — regresiones de cotización y respuestas — 2026-10-03

Se añadieron pruebas para que una intención antigua de preparar el resumen no
capture preguntas nuevas, que detalles posteriores actualicen datos del borrador,
que las instrucciones de revisión no contaminen la descripción, y que las
respuestas Markdown se presenten con énfasis/listas seguros en vez de marcadores
crudos. También se comprueba el CTA de cotización por ficha, el error Admin
`ROLE_REQUIRED` sin logout automático, la guía local de materiales y las dos
formas de salida del límite de iteraciones. Resultado dirigido: 6 suites,
52 pruebas aprobadas. Recorrido de navegador: preparación por Enter y
actualización de campos observadas sin enviar intake; la respuesta de material
live reveló API sin recargar, por lo que no se declara el runtime live aprobado.

Verificación completa posterior: `npm run lint`; Jest con 31 suites/177 tests;
`npm run check:ui`; `npm run check:automation` (248 comprobaciones);
`npm run build:n8n`; `npm run build`; `git diff --check` pasan. Build conserva
aviso de chunk principal superior a 500 kB. La verificación live sigue limitada:
el API activo aún sirve una versión anterior y Admin no tiene sesión autorizada
en el navegador; no se declara aprobado el runtime OpenRouter ni el render
autenticado del copiloto.
