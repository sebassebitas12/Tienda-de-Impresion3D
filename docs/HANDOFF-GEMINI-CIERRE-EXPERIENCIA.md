# Handoff para Gemini en Antigravity — cerrar la experiencia de Vértice CR

## Misión e instrucciones

Actúa como desarrollador senior y QA de producto. No hagas solamente una pasada de colores: termina recorridos coherentes de visitante, cliente y administrador, con persistencia académica real y estados de recuperación. Una pantalla bonita no demuestra que el negocio funciona.

Repositorio: `S:\Descargas\varas\visual\proyectos visual\impresion-3d\Tienda-de-Impresion3D`. Rama esperada: `Pruebas`. Corte de auditoría: 2026-10-04, HEAD observado `de5c5ea`, con numerosos cambios locales de trabajo paralelo. Reinspecciona antes de editar: algunos hallazgos pueden haberse corregido entretanto. No borres, reviertas ni sobrescribas trabajo ajeno.

Lee AGENTS.md, AI_CONTEXT.md, docs/00 y los dominios aplicables: 01/02 para negocio, 03/04/05 para UX, 06/07 para arquitectura/API, 08 para Admin/IA, 09 para pruebas y 10 para continuidad. Lee después cada archivo que modificarás. R-H74 en docs/05 contiene la evidencia del primer recorrido.

JavaScript/JSX, sin TypeScript ni dependencias adicionales. Servicios centralizan API; reglas monetarias y transiciones deben permanecer en utilidades/operaciones, no duplicadas en componentes. Auth es académica: JSON Server y JWT simulado, no construir otro backend de autenticación. OpenRouter es el proveedor vigente, no DeepSeek. HF-01 informa identidad; no rediseñar Home ni copiar Stitch.

No inventes precios, stock, tarifas, plazos, métricas, mediciones de STL, datos bancarios ni verificaciones. Estimación IA no equivale a laminado. Conserva procedencia experimental cuando aplique, sin llenar la UI de badges repetidos. No edites db.json con fixtures de prueba; usa datos aislados. No envíes correos ni ejecutes pagos/pruebas de negocio con datos del usuario sin acordar destinatario y alcance. No reintentes envíos de resultado UNKNOWN sin reconciliación.

## Qué se sabe y qué no

La revisión anterior incluyó navegador de visitante/cliente y código de Admin. Admin autenticado, matriz responsive completa, lector de pantalla y todas las transacciones NO quedaron verificados. Las pruebas históricas del snapshot no acreditan este árbol local ni el futuro commit. No hay base para afirmar un porcentaje exacto o «100%».

Leyenda: **B** confirmado en navegador; **C** confirmado por código/datos inspeccionados; **V** escenario pendiente de reproducción. Los hallazgos C prueban la estructura existente, no sustituyen una prueba end-to-end.

## Hallazgos y trabajo priorizado

### Bloque 1 — dinero, estado y continuidad (primero)

| ID | Evidencia | Problema / resultado requerido | Fuentes iniciales |
| --- | --- | --- | --- |
| E01 | B/C | Borrador de solicitud desaparece al ir a login y volver. Preservar campos y destino también al registrar; resolver explícitamente archivos no restaurables, sin prometer que sobrevivieron. | QuoteRequestPage.jsx, LoginPage.jsx, RegisterPage.jsx |
| E02 | B/C | Cliente muestra DELIVERED como texto crudo y stepper «Recibido»; usa COMPLETED mientras Admin usa otros estados. Compartir semántica y representación de estados, incluidos cancelación y cierre. | CustomerQuotesPage.jsx, adminOrders.js, contratos de estados |
| E03 | C | Quote fulfillment registra pago y crea pedido PENDING; cuenta pide SINPE nuevamente por PENDING. Separar pago y producción; nunca solicitar pagar de nuevo un pedido pagado. | scripts/quote-fulfillment.js, QuoteFulfillment.jsx, CustomerQuotesPage.jsx |
| E04 | C | Transición genérica permite confirmar/producir sin comprobar pago. Definir y aplicar regla vigente en servidor y UI; no saltar la verificación con otro botón. | scripts/automation-operations.js, OrderActions.jsx |
| E05 | C | Verificación SINPE no compara versión del comprobante observado; cliente puede reemplazarlo mientras Admin revisa. Añadir control de concurrencia y rechazo de evidencia obsoleta. Reproducir con dos sesiones. | scripts/order-payment-operations.js, commerceService.js, OrderActions.jsx |
| E06 | C | Carrito registra subtotal, sin acuerdo de entrega/retiro ni costos asociados; después pide transferencia. Definir modalidad y total conocido antes de pago. Si entrega depende de coordinación, comunicar qué falta y no inventar tarifa. | Shop.jsx, scripts/catalog-order-operations.js, CustomerQuotesPage.jsx |
| E07 | B/C | Líneas históricas muestran IDs y material PLA de fallback; totales no coinciden con líneas sin explicar diferencias. Usar snapshots verificables; no rellenar desconocidos con datos inventados. | CustomerQuotesPage.jsx, adminOrders.js, operaciones de creación |
| E08 | C | Pedido personalizado sin orderItems aparece como «0 modelos». Mostrar scopeSnapshot, archivo/referencias, material, medidas y cantidad cuando existan. | CustomerQuotesPage.jsx, scripts/quote-fulfillment.js |
| E09 | C/V | Admin carga snapshots al montar y tras su propia acción, no al recibir cambios externos. Incorporar actualización manual/foco u otra estrategia sencilla y consistente; demostrar que ve un nuevo pedido/comprobante del cliente sin reiniciar app. | useAdminOrders.js, useAdminRequests.js, hooks de resumen/cuenta |

### Bloque 2 — catálogo, compra y cuenta

| ID | Evidencia | Problema / resultado requerido | Fuentes iniciales |
| --- | --- | --- | --- |
| E10 | B/C | Corte real: 25 fichas, 19 DRAFT, 6 ACTIVE, solo 5 visibles por contrato material. No publicar en masa fichas incompletas ni afirmar 25 publicadas. Reconciliar imágenes, precio, variantes y capacidad; explicar borrador/bloqueo con acción útil. | AdminCatalogManagement.jsx, catálogo/API, contrato FDM |
| E11 | B/C | Audífonos muestra placeholder aunque existe nueva imagen local. Verificar correspondencia y vincularla si es efectivamente ese producto; no generar ni inventar foto faltante. | ProductMedia, catálogo, public/images |
| E12 | C | Admin admite galería pero ficha pública usa primera imagen. Implementar navegación accesible y fallback; revisar TODAS las fotos, recorte, proporción y fondo, no solo el ejemplo. | src/features/products, Shop.jsx |
| E13 | B/C | Llavero personalizable solo permite color/cantidad. Definir captura mínima de personalización o dirigir a solicitud; no vender una opción que no puede expresarse ni llegar al taller. | ficha de producto, carrito, snapshots |
| E14 | B | Carrito inválido muestra ₡0 y confirmación deshabilitada. Explicar bloqueo por línea, permitir recuperación desde catálogo; revisar carrito mixto válido/inválido sin perder selecciones útiles. | Shop.jsx, utilidades de carrito |
| E15 | C/V | localStorage usa una clave global para todas las cuentas y no sincroniza pestañas. Definir carrito invitado y su transferencia al login; impedir arrastre inesperado entre clientes A/B y estados divergentes entre pestañas. | CartProvider.jsx |
| E16 | C/V | Mutaciones de carrito usan `lines` capturado. Probar dos add consecutivos en el mismo ciclo; si se pierde una operación, usar actualizaciones seguras. | CartProvider.jsx, tests carrito |
| E17 | V | Precio/publicación/color puede cambiar entre lectura y confirmar. Reproducir y exigir reconfirmación si cambia importe; conservar captura de precio y detalle del pedido. | checkout, catalog-order-operations.js |
| E18 | V | Respuesta perdida o recarga después de crear pedido podría provocar duplicados. Verificar persistencia/reconciliación de idempotencia, no solo doble clic dentro del mismo montaje. | checkout, servicio, operaciones de órdenes |
| E19 | B/C | Cliente QUOTED/APPROVED carece de orientación suficiente sobre siguiente paso. Mostrar si falta envío/aprobación/pago y quién actúa; monto, vigencia, desglose, versión y motivo de cambios consistentes. | CustomerQuotesPage.jsx, RequestNextAction.jsx |
| E20 | C | Descartar elimina solicitud sin confirmación y puede eliminar una en revisión. Separar cancelación y ocultación/eliminación según negocio; confirmar acción destructiva y conservar historial necesario. | CustomerQuotesPage.jsx, automation-operations.js |
| E21 | B/C | Perfil es lectura con ACTIVE crudo. Definir mínimo académico: información entendible y ruta para corregir datos de contacto utilizados en pedidos/correos, o explicar límite explícito. No añadir recuperación de contraseña de producción. | CustomerQuotesPage.jsx, auth/usuarios |
| E22 | C/V | Formulario SINPE compartido entre pedidos y loading inicial falso. Probar cambio de pedido, errores y refresh: no mezclar referencia/teléfono, no mostrar vacío prematuro; ofrecer reintento y confirmación persistente. | CustomerQuotesPage.jsx |

### Bloque 3 — cierre de Admin, soporte y asistentes

| ID | Evidencia | Problema / resultado requerido | Fuentes iniciales |
| --- | --- | --- | --- |
| E23 | B/C | Rutas informativas, checkouts y detalle público de pedido siguen en ConstructionPage. Resolver destinos usados por el flujo: implementar lo necesario o quitar enlaces/rutas redundantes con sustituto real. About/Contacto fueron reproducidos. | manifiesto/rutas, ConstructionPage |
| E24 | C | Activity no etiqueta nuevos eventos SINPE, creación de pedido y varias decisiones del cliente; omite motivo del evento. Mostrar acciones/estados humanos, motivos y enlaces útiles, incluso registros históricos eliminados. | AdminActivity.jsx, activityLog |
| E25 | C | Resumen declara ausencia de cobros aunque existen registros nuevos de pago. Revisar definición de KPI; solo pagos confirmados auténticos, separar simulación y evitar sumar pedidos como ventas cobradas. | adminOverview.js, AdminDashboard |
| E26 | V | Confirmar bandeja operativa: Admin debe descubrir comprobantes pendientes, cambios solicitados y solicitudes antiguas sin abrir cada ficha a ciegas. SUBMITTED antiguo no equivale automáticamente a pendiente de cotización. | dashboard, listados/filtros, docs/02 |
| E27 | C/V | Asistente vacía composer antes de respuesta y carece de guard IME al Enter. Probar fallo/reintento sin duplicar historial, cancelar al salir, composición de texto y retorno de foco. | AssistantPanel.jsx |
| E28 | V | Verificar tres entornos reales: público orienta; cotización organiza borrador editable y adjuntos; Admin página/copiloto de trabajo con herramientas por rol. Probar sesión expirada, denegación, timeout, JSON inválido e inyección; no ejecutar escrituras por conversación sin confirmación. | asistentes, automationService, n8n oficial |
| E29 | V | Adjuntos: selección sucesiva, quitar uno, formatos/límites, error de subida y conservación de campos; recepción/visualización por Admin con nombres y unidades. No dar por completo porque acepta File[]. | QuoteRequestPage.jsx, upload/API, detalle Admin |
| E30 | V | Notificaciones: aprobación dentro de app, correo como aviso; verificar qué eventos de aprobación/pedido/avance realmente disparan email. No prometer avisos inexistentes ni reabrir B por documentación histórica contradictoria: usuario reportó B cerrado. | docs/08, workflows, operaciones |

## Ejecución por slices

1. Reproducir E01–E09 y fijar contrato común pedido/pago/entrega; corregir contradicciones de dinero antes del polish.
2. Cerrar catálogo → ficha → carrito → cuenta, incluyendo recuperación y snapshots (E10–E22).
3. Cerrar bandejas/detalles Admin, Activity y destinos públicos (E23–E26).
4. Verificar integración de asistentes, archivos y notificaciones sin rehacer lo que ya funciona (E27–E30).
5. Regresión visual y accesible de TODOS los recorridos afectados, no únicamente componentes editados.

Cada slice: inspeccionar → reproducir → implementar causa raíz → pruebas → navegador → documentar. No convertir esto en reescritura masiva. Los casos V no autorizan asumir un defecto: primero comprobar y registrar resultado.

## Matriz obligatoria de cierre

| Actor | Recorrido completo a demostrar |
| --- | --- |
| Visitante | Inicio/búsqueda → catálogo/ficha → selección → carrito → login o registro → recuperar selección/destino. Solicitud con descripción/adjuntos → autenticación → recuperar borrador → envío confirmado. |
| Cliente catálogo | Encargo → detalle con líneas/total/modalidad → comprobante → espera → rechazo con motivo y corrección → confirmación → producción → listo/entrega → historial y reseña según elegibilidad. |
| Cliente personalizado | Crear solicitud → revisión → cotización vigente → solicitar cambios → nueva versión → aprobar/rechazar → pedido y pago UNA vez → seguimiento. Expirada y versión obsoleta incluidas. |
| Admin | Detectar nueva solicitud/pedido → revisar referencias → cotizar/reemitir/enviar → verificar comprobante → avanzar etapas válidas → cierre → actividad legible y cuenta cliente actualizada. |
| Admin catálogo | Crear/editar ficha, subir/ordenar galería, autocompletar IA revisable, cotizador separado, borrador/publicación y consistencia inmediata con tienda. |
| Recuperación | API caída, n8n caído, timeout, respuesta inválida, upload fallido, sesión expirada, usuario inactivo, rol incorrecto, recurso ajeno, recurso inexistente, reload, atrás y dos pestañas. |

Para cada recorrido registra: resultado esperado, resultado observado, evidencia, pruebas y pendiente. Datos/acciones de prueba aislados: no alterar db del usuario para obtener una captura.

Visual: Dark y Light a 375/768/1280, tamaños de texto disponibles, teclado, foco visible, foco/restauración en paneles, mensajes anunciados, reduced motion y ausencia de overflow. Revisar capturas reales después de cada cambio de UI. Estados loading/empty/error/validation/processing/success deben verse y permitir continuar. No afirmar lector de pantalla probado si solo inspeccionaste DOM.

Si falta sesión Admin, pedir al usuario abrirla; no leer claves/tokens ni eludir guards. No cerrar su sesión cliente. Mantener un solo origen para evitar confundir localhost con 127.0.0.1.

## Gates y entrega

Ejecutar `npm test`, `npm run lint`, `npm run check:ui`, `npm run build`; añadir regresiones para cada causa corregida. Si cambia automatización, ejecutar además los scripts de generación/verificación vigentes y entregar solo el workflow oficial. Verificar `git diff --check`.

Actualizar documento de dominio y AI_CONTEXT con estado vigente, sin copiar este handoff como diario. Si se autoriza commit/push, commits atómicos y CI verde del commit final en verify.yml antes de indicar pull. No atribuir CI previo al árbol actual.

Entrega: IDs corregidos/descartados/pendientes, evidencia browser, resultados exactos de checks, límites y siguiente slice. El «100%» solo puede referirse a una matriz de alcance acordado con todos los casos aprobados; no al número de pantallas ni a una estimación subjetiva. Todo pendiente crítico mantiene el proyecto abierto. No añadir funciones empresariales fuera del alcance para inflar la lista.
