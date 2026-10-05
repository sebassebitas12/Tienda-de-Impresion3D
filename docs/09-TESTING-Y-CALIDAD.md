# Vértice CR — Testing y calidad

## Comprobante SINPE por pedido — 2026-10-04

orderPaymentWorkflow prueba handlers cliente/Admin registrados: reporte y auditoría,
confirmación PAID/CONFIRMED, rechazo con motivo, reingreso, bloqueo de decisión
repetida, propiedad, roles, estados no PENDING, validación y fallo de persistencia.
Fixtures en memoria: no escribe db.json ni llama banco/n8n. npm test: 40 suites /
237 tests verdes en el árbol local actual. Se eliminó duplicación concurrente de
los dos helpers de pago en commerceService manteniendo el contrato solicitado.

## Cancelación y descarte del cliente — 2026-10-04

customerQuoteActions prueba los handlers registrados de POST /quotes/cancel y
/quotes/delete: éxito propio, conservación de solicitudes ajenas, 404 para ajenas
o inexistentes, 409 para APPROVED/PAID, sesión customer activa y requestId requerido.
También comprueba que los rechazos no persisten y que cancelar conserva solicitud
y registra actividad. Fixtures en memoria, sin escribir db.json ni llamar n8n.
Verificación: npm test, 39 suites / 225 tests verdes en el árbol local actual.

## Pedidos propios — 2026-10-04

catalogOrderOperations cubre aislamiento entre clientes, payload de identidad
ignorado, líneas embebidas y normalizadas, lista vacía y 403 para sesión ausente,
inválida, vencida, inactiva o Admin. Fixture en memoria; lectura no persiste.
Suite completa: 38 suites / 215 tests verdes. Dos selectores de adminCatalogForm
se alinearon con el texto vigente sin emoji del botón de autocompletado.

## Reseñas y cambios de cotización — 2026-10-04

Verificación local: 38 suites / 212 tests verdes; lint, check:ui y build pasan.
Build conserva aviso de chunk mayor de 500 kB. productReviews prueba validación,
permisos, persistencia y proyección pública con fixture en memoria; requestActions
prueba nueva versión, conservación de oferta y conflicto; requestNextAction prueba
motivo y guardado sin envío automático. No se escribió db.json ni se enviaron correos.
Revisión visual autenticada de CHANGES_REQUESTED y CI de estos cambios pendientes.

> Última actualización: **2026-10-04**.

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

La inspección visual autenticada de la ficha Admin quedó pendiente: al abrirla,
la sesión había expirado y el navegador redirigió a `/login`. No se declara una
captura Dark/Light de esa página ni validación responsive 768/375.

### C-P2 — fotos propias en galería — 2026-10-04

`compressProductImage.test.js` y `imagePicker.test.jsx` verifican tipo/tamaño,
dimensiones, compresión y acciones de galería; `adminCatalogForm.test.jsx` cubre
las actualizaciones sucesivas de imágenes a partir del estado vigente. El
escenario HTTP de `check:automation` guarda seis data URLs de 300 KiB en una base
aislada, sin escribir el `db.json` real.

### C-P3 — adjuntos en solicitudes — 2026-10-04

`quoteRequest.test.jsx` comprueba selección de unidad mm/cm/in y envío de PNG+STL;
`preferences.test.jsx` comprueba que el asistente general esté disponible en
`/solicitud/archivo` y no duplique el integrado de ayuda de diseño. `check:automation`
valida multipart, autenticación, idempotencia y lectura privada autorizada.
La captura real de `/solicitud/archivo` en escritorio confirma Dark/Light y árbol
accesible; no se subieron archivos en navegador. Admin requiere reautenticación
antes de sus capturas visuales y recorridos reales.

### C-P5 — decisión de cotización por el cliente — 2026-10-04

`customerQuoteActions.test.js` cubre rol, pertenencia, estado/versión, vigencia,
motivo obligatorio y evento de actividad para aprobar, pedir cambios y rechazar.
`customerQuotesPage.test.jsx` cubre desglose visible en `AWAITING_APPROVAL`,
acciones de respuesta y ocultamiento de decisiones antes del envío de la oferta.
No se guardó ni aprobó una cotización en el `db.json` de desarrollo.

### C-P4 — encargo de catálogo desde el carrito — 2026-10-04

`catalogOrderOperations.test.js` cubre permisos de sesión, validación de
producto/variante, recálculo autoritativo (no confía en precio del cliente),
snapshot en tablas embebida y normalizada, evento, visibilidad en el adaptador
de Pedidos Admin e idempotencia. `cartCheckout.test.jsx` comprueba sesión,
payload, limpieza solo tras éxito, navegación/acuse y conservación del carrito
ante error; `cart.test.jsx` cubre `clear()`. No se creó ningún pedido en el
`db.json` real.

### Verificación local C-P2/P3 — 2026-10-04

`npm test`: 33 suites/187 tests; `npm run lint`; `npm run check:ui` (48 módulos);
`npm run check:automation` (255 comprobaciones HTTP/permisos/idempotencia/correo
mock/tools/workflows/assets); `npm run build:n8n` (23 nodos, tres agentes, cinco
entradas); `npm run build` (161 módulos) y `git diff --check` pasan. Son checks
locales: no equivalen a CI verde ni a pruebas live de Admin, n8n o subida en un
navegador autenticado.

### Verificación local C-P4/P5 — 2026-10-04

En el árbol local combinado: Jest 37 suites/203 tests; `npm run lint`,
`npm run check:ui` (48 módulos), `npm run check:automation` (255 comprobaciones),
`npm run build` (162 módulos) y `git diff --check` pasan. Estas verificaciones
no equivalen a CI verde. La revisión visual real de `/carrito` y `/cuenta` en
una sesión customer ni el ciclo Admin para `CHANGES_REQUESTED` se han confirmado
en navegador; no se alteró la base de desarrollo.

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
