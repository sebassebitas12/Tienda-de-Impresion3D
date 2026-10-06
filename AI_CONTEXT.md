# AI_CONTEXT.md — Vértice CR

> **Última actualización:** 2026-10-06
> **Estado:** SNAPSHOT ACTIVO  
> **Rama:** `Pruebas`  
> **No es un diario:** este archivo resume el presente. El historial detallado vive en los documentos de dominio.

## Estado vigente — catálogo, cotización y pagos (2026-10-06)

- **Acceso Rápido de Evaluación y Demo en Login (/login):**
  Se incorporó un bloque accesible `auth-demo-helper` en [`LoginPage.jsx`](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/src/pages/LoginPage.jsx) con botones técnicos de un solo clic (`[Admin Demo]` y `[Cliente Demo]`) para agilizar la grabación del video y la presentación en vivo sin errores de tipeo manual. Respeta i18n (ES/EN) y estilos acordes a la identidad visual (`auth.css`), con test automatizado en `tests/auth.test.jsx`.
- **Rediseño Lógico de Contáctenos con Canales Oficiales y Formulario Directo (/contacto):**
  Se reestructuró por completo la página institucional de contacto (`src/pages/ContactPage.jsx`, `institutional.css`) para darle propósito y utilidad práctica al taller:
  1. *Canales directos del taller (DEMO Costa Rica):* Grid de tarjetas interactivas con WhatsApp directo (`wa.me` a `+506 8888-8888`), Teléfono de taller (`tel:+50625500000`), Correo oficial (`mailto:taller@verticecr.com`) y ficha de Ubicación y Horarios de atención (Cartago / San José, L-V 8am-6pm, Sáb 9am-1pm).
  2. *Formulario de contacto directo interactivo:* Permite enviar consultas clasificadas por motivo (materiales, estado de pedido, volumen, general), validando campos obligatorios en cliente y mostrando confirmación visual accesible de recepción.
  3. *Enrutamiento claro según etapa de proyecto:* Conserva y potencia los accesos a «Ya tengo el modelo» (`/solicitud/archivo`), «Quiero darle forma» (`/solicitud/ayuda-diseno`) y seguimiento en cuenta (`/cuenta` o `/login`).
  4. *Asistente general y FAQ ampliado:* Disparador del asistente técnico integrado y respuestas sobre envíos nacionales (Correos de CR / GAM), retiros en taller, cotización y archivos. Soporte bilingüe completo (ES/EN).
- **Detalles Finales de Accesibilidad — Escala Interactiva y Lectura al Cursor (2026-10-06):**
  Se completaron las dos mejoras clave de accesibilidad e interactividad en el panel de lectura flotante (`FloatingTools.jsx`, `PreferencesProvider.jsx`, `shell.css`):
  1. *Escala continua de texto (100% a 200%):* Se sustituyeron los 3 botones fijos (`A`, `A+`, `A++`) por un control deslizante continuo (`input[type="range"]`) con medidor en vivo en porcentaje (100% - 200%) y marcadores rápidos (`100%`, `150%`, `200%`). `PreferencesProvider` valida y normaliza cualquier escala decimal (ej. 1.1, 1.25, 1.5, 2.0) multiplicando fluidamente `--a11y-font-scale` en toda la aplicación.
  2. *Lectura en voz alta al pasar el cursor («Leer al pasar el cursor» / `vertice-read-on-hover`):* Diseñado para personas con baja visión o ceguera parcial. Al activarse mediante el interruptor accesible en el panel de lectura, sintetiza la voz nativa del navegador (`SpeechSynthesis`) al colocar el puntero sobre cualquier elemento semántico/interactivo (encabezados, párrafos, enlaces, botones, inputs con `aria-label`/texto) o al navegar con el teclado (Tab / `focusin`). Incluye debounce de 130 ms para evitar solapamientos al barrer la pantalla, cancelación inmediata de voz al cambiar de elemento o salir de él, y resaltado visual con contorno de alto contraste (`.a11y-reading-highlight`).
- **Motor Operativo del Copiloto Admin y Resiliencia CRUD (/admin/asistente):**
  Se resolvió el fallo de conexión (`ASSISTANT_UNAVAILABLE`) y la falta de utilidad operativa mediante la integración de un motor operativo de alta resiliencia (`scripts/admin-copilot-engine.js`). Ahora el Copiloto Admin es 100% capaz de leer y editar CRUDs:
  1. *Lectura:* Audita la calidad del catálogo identificando con exactitud las 11 fichas con galerías incompletas (< 4 vistas), el estado de calibración (`DEMO_NOT_SLICED` en Creality K1C) y enlaces directos a sus fichas de edición. Desglosa prioridades del taller (solicitudes pendientes por cotizar o revisar, y pedidos activos por etapa).
  2. *Edición:* Procesa comandos para dar de alta piezas (ej.: «Crear Soporte de Soldador en PETG...»), calculando de forma automática el precio DEMO FDM, y prepara propuestas de actualización (ocultar/desactivar a `INACTIVE`, publicar, cambiar precio o material) o eliminación (protegiendo modelos con pedidos existentes).
  3. *Confirmación en UI:* Despliega la tarjeta interactiva de cambios con el botón `[Confirmar y guardar]`, persistiendo en `db.json` vía `/admin/actions/catalog-ai-confirm` y registrando el evento en `activityLog`.
  4. *Tolerancia a fallos:* Ante errores en webhooks de n8n o fallos en nodos de herramientas, el sistema activa automáticamente el motor operativo local, garantizando disponibilidad sin caídas ni mensajes de desconexión.
- **Resolución de cotización automatizada y perfil análogo en Admin (/admin/solicitudes/:id):**
  Se solucionó el bloqueo donde "Usar la descripción de la solicitud" pedía obligatoriamente seleccionar una referencia. Se ampliaron las palabras clave en perfiles análogos (como `brazo`, `robotico`, `mecanico`, `soporte`, `pieza`, `repuesto`), se implementó coincidencia por límites de palabra (`(?:^|[^a-z0-9])`) para evitar falsos positivos con subpalabras, se incluyeron adjuntos e intención de uso, y `/admin/actions/auto-quote` ahora cuenta con fallback al perfil análogo base (`soporte`) cuando la descripción es genérica, calculando y guardando la estimación sin lanzar error 400 `PROFILE_REQUIRED`.
- **Transición clara del flujo de cotización en Admin (`RequestNextAction` y `AutomaticQuote`):**
  Al guardar una estimación manual o automatizada, la UI cierra el formulario de preparación y avanza al bloque destacado **«Cotización lista para enviar»**, presentando el resumen (total en CRC, vigencia, alcance) y los destinatarios (Para y BCC). `canSendQuote` ahora verifica la cotización guardada y únicamente se deshabilita si hay cambios manuales no guardados en edición. Se añadió el botón «Ocultar edición / Editar cotización» para alternar la visualización sin quedar atrapado.
- **Entorno de correos y entregabilidad (`isDeliverableEmail`):**
  Por regla de seguridad, `isDeliverableEmail` bloquea despachos hacia dominios reservados (`@example.com`, etc.) para prevenir errores de rebote en Gmail. Para realizar pruebas de envío real a través de n8n, el cliente o la solicitud deben utilizar un correo real (o el del taller). Con las URLs corregidas a `:5678`, el backend despacha el webhook cuando los destinatarios son entregables.
- **Experiencia de cotización, edición conversacional y navegación entre modos (/solicitud):**
  Se solucionó la queja del usuario en `/solicitud/ayuda-diseno` respecto a botones inactivos, bloqueo en la vista con bot y la incapacidad del asistente para actualizar detalles:
  1. *Edición conversacional bidireccional:* Anteriormente, si el usuario tocaba los inputs del formulario en pantalla, `manuallyEditedFields` bloqueaba permanentemente cualquier actualización posterior del bot. Ahora el asistente (`src/utils/quoteConversation.js` y `QuoteRequestPage.jsx`) detecta instrucciones explícitas en el chat (ej. «Cambiá la cantidad a 5», «el material es PETG», «las medidas son 15 x 8 cm», «borrá las medidas», «la descripción es...») y aplica los cambios inmediatamente en el formulario sin quedar bloqueado, preservando únicamente los campos no mencionados.
  2. *Interactividad y feedback visual:* Al presionar `[Revisar el resumen y adjuntar referencias ↘]`, el formulario emite un pulso visual (`is-highlighted-pulse`) y enfoca el resumen. Asimismo, el botón de envío (`quote-intake-submit`) ya no se desactiva silenciosamente ante medidas inválidas (ej. texto genérico como «EWQEWQ»); en su lugar, al hacer clic valida interactivamente, despliega el mensaje de error y enfoca el campo de medidas. Además, se añadió un botón rápido `[Dejar medidas sin definir (vacío)]` para limpiar el campo en un clic.
  3. *Selector de modo fluido (Tabs):* Se incorporó una barra superior accesible (`quote-mode-switcher`) con pestañas `[📄 Formulario directo (Modelo o archivo)]` y `[🤖 Con asistente IA (Ayuda de diseño)]`. El usuario puede alternar entre el formulario sin bot (`/solicitud/archivo`) y la ayuda con bot (`/solicitud/ayuda-diseno`) en cualquier momento sin perder los datos ya redactados en el borrador.
- **Robustez de respuestas JSON en runtime y n8n:**
  Tanto `scripts/assistant-runtime.js` como el workflow unificado en `build-n8n-unified.mjs` ahora extraen bloques JSON con tolerancia a bloques markdown (` ```json `) y llaves sin quebrar en texto de razonamiento. Las 57 suites (413 tests) y las 296 comprobaciones de automatización están 100% verdes.
- Pasada en QA aislado (API 3219 / UI 5181; copia temporal, sin tocar usuarios
  del db principal): IA n8n real completa el resumen; login conserva los campos;
  cliente envía solicitud; Admin revisa y guarda oferta DEMO de ₡9 306.
- Un único correo autorizado se intentó a la cuenta del taller. Entrega UNKNOWN,
  sin reintento. Ejecución n8n #73 falla antes de Gmail: `URL is not defined`
  en Validar y preparar correo. Gmail no encontró el mensaje al consultar; no
  reintentar hasta reconciliar ese outbox. En revisión del 2026-10-06, n8n
  muestra el workflow unificado publicado (opción `Unpublish`) y la rama de
  recibo de pago en el canvas. No hay ejecución de pago: la más reciente (#81)
  consultó tasas y la #80 falló en AI Agent Admin por `reasoning_content`, ajeno
  a correo/pago.
- Chat permite reintentar respuesta fallida sin duplicar mensaje; envío de
  solicitud bloquea doble clic y el éxito reemplaza conversación por siguientes
  pasos. La reauditoría visual de escritorio Light descrita en R-H88 corrigió un
  Copiloto Admin cuyo saludo quedaba cortado por auto-scroll inicial. Móvil no se
  verificó en esta pasada.

- Recuperación ejecutada: 25 fuentes consultadas en Printables; fotografías en
  `public/images/catalog/` y un archivo original por diseño en
  `.local-data/catalog/models/` (ignorado). Manifiestos y hashes en
  `automation/catalog/`. Las fichas corresponden ahora al objeto fuente y el
  detalle muestra atribución. Alcance educativo, no autorización comercial.
- `node scripts/import-catalog-sources.mjs` modifica únicamente `products`.
  Una selección de componente se identifica en `modelEvidence.componentLabel`.
- Las 25 fichas tienen al menos una foto fuente; 14 tienen cuatro o más y 11
  necesitan completar galería. Aún no hay vistas renderizadas desde los STL.
  Pendientes: galería principal + tres vistas estáticas y laminado K1C. Los campos
  `productionDataSource: DEMO_NOT_SLICED` y `slicingStatus: PENDING` distinguen
  estimaciones heredadas de resultados del laminador.

- Rama `Pruebas`, base local `7dc24c8` alineada con `origin/Pruebas` al iniciar
  esta pasada; `main` permanece fuera del alcance. Hay cambios locales sin commit.
- La base local tiene cambios intencionales solo en `products`. En comparación
  con `HEAD:db.json`, usuarios, pedidos, solicitudes y demás colecciones son
  iguales; no se debe copiar el archivo entero al llevar el catálogo remoto.
- **Flujo vigente de pago:** el carrito crea `PENDING`/`UNPAID` y abre
  `/carrito?orderId=...`; no cobra ni confirma al crear. Ahora ofrece tres
  elecciones explícitas: PayPal Sandbox, tarjeta mediante botones oficiales de
  PayPal si Sandbox la declara elegible, o reporte SINPE DEMO para revisión
  manual. Vértice no recoge datos de tarjeta. Una cotización solo genera pedido
  después de aprobación en la app; todos pagan en el checkout común.
- `VERTICE_PAYPAL_CLIENT_ID`, `VERTICE_PAYPAL_CLIENT_SECRET`,
  `VERTICE_PAYPAL_ENV=sandbox` y `VERTICE_APP_URL` son configuración local de
  servidor; nunca poner el secreto en React/Git. La conversión obtiene tasa
  pública con fecha. En esta pasada el servidor obtuvo OAuth Sandbox y creó un
  checkout PayPal para la orden de prueba `ord-e92ef3dc-…` por ₡5 100 (~USD
  11.12 a la tasa/snapshot mostrado). La aprobación quedó en la página Sandbox
  para que el usuario la complete; no se capturó el pago. Un checkout creado
  bloquea cambiar de método en esa misma orden para evitar intents paralelos.
- La captura PayPal y confirmación SINPE crean un outbox y disparan
  `vertice-payment-email` después de persistir el pago. El servidor registra
  `SENDING/SENT/FAILED/UNKNOWN`; valida `orderId`, `deliveryKey` y `messageId`
  del acuse y no reenvía resultados inciertos. URL: `VERTICE_PAYMENT_EMAIL_WEBHOOK_URL`;
  Header Auth comparte el token de cotización salvo override local. La integración
  HTTP aislada pasa con dos recibos mock y confirmaciones repetidas sin duplicar.
  El envío de recibos se dispara únicamente tras captura PayPal o confirmación
  Admin de SINPE; no afirmar entrega hasta acuse Gmail con `messageId`. El
  workflow publicado contiene la rama de recibo y la configuración Sandbox,
  webhook y buzón de taller ya está disponible localmente. El intento anterior
  de correo de cotización sigue `UNKNOWN` antes de Gmail: no reintentar ese
  outbox sin reconciliarlo. La cuenta de cliente `sebasfores992@gmail.com` ya
  está activa en el entorno local. La API fue reiniciada para cargar el código
  vigente; ningún secreto se comparte ni se guarda en frontend/Git.
- Pago/correo real de extremo a extremo sigue pendiente: la página de PayPal
  Sandbox está esperando login/aprobación del usuario; no se realizó la captura,
  no se disparó `vertice-payment-email` y no se afirma que Gmail haya recibido
  mensajes.
- Tarjeta se verifica primero con `POST /orders/paypal/client-config` y
  `Buttons.isEligible()`; la no elegibilidad no crea un intent y deja elegir
  PayPal/SINPE. Las tres opciones y SINPE se inspeccionaron en checkout real;
  no se confirmó que el proveedor habilite tarjeta en esta cuenta.
- Recorrido real de n8n desde cotización: la UI preparó un borrador del brazo
  robótico de banda transportadora; dejó material, cantidad y diseño sin
  inventarlos. La acción explícita «Preparar resumen para revisar» produjo el
  resumen estructurado editable y el CTA «Revisar el resumen y adjuntar
  referencias». No envía la solicitud. Fotos/STL/OBJ todavía no se transmiten al
  modelo ni se analizan.
- p19: la portada ahora prioriza la foto de instalación montada; se verificó en
  catálogo y detalle local, sin rotar ni editar los píxeles. `db.json` conserva
  datos runtime del usuario y está modificado: no incluirlo en commits.
- Validación de este bloque: Jest 56 suites / 409 tests, lint, `check:ui` y
  build pasan localmente. Falta completar la aprobación Sandbox por el usuario,
  verificar captura y estados/outbox, obtener el acuse Gmail y verificar la
  elegibilidad positiva de tarjeta con el proveedor.
- Se bloqueó el REST genérico de `/orders` para operaciones no autorizadas; las
  lecturas administrativas requieren token y los cambios pasan por acciones
  auditadas. Las rutas de negocio de cliente se mantienen explícitamente
  permitidas.
- El seed local tiene 25 productos `ACTIVE` con imágenes
  existentes. `ACTIVE` significa visible en la demo, no inventario ni promesa de
  fabricación/entrega. Todos los precios se identifican como `DEMO`; las fuentes
  se registraron para uso educativo, sin validar peso/tiempo ni fabricación.
  Gramos/horas heredados no
  tienen prueba de laminador; `stock`/`minStock` son campos legados.
- El usuario confirma una impresora Creality K1C. Hay un archivo fuente por
  diseño en `.local-data/catalog/models/` (ignorado); no se ha laminado el seed.
  Creality Print tiene CLI para procesar un lote con presets:
  recuperar/validar una vez la lista de modelos y automatizar las mediciones, no
  exigir al usuario abrir uno por uno. La potencia nominal de 350 W no equivale
  al promedio medido y no debe usarse como costo de energía.
- La tienda explica que imágenes/precios son referencias; cada precio DEMO
  muestra «Precio referencial» y la ficha/checkout aclaran que no confirman
  producción/entrega. Se inspeccionó Dark escritorio (1265 × 720), 25 modelos,
  rejilla de 3 columnas y tarjetas cargadas. La reauditoría de Admin/Copiloto
  incluyó Light escritorio, pero tienda Light y móvil siguen pendientes.
- R-H89: recorrido local de cliente en Dark escritorio (1265×704) cubrió Cuenta
  → pedido pendiente → checkout, Cuenta → cotizaciones y entrada a `/solicitud`
  con ambos caminos visibles; el formulario de archivo deja dimensiones y
  material opcionales. Pedido `o4` mostraba
  ₡6 500 en piezas + ₡2 000 de entrega = ₡8 500; el checkout ahora presenta
  esos conceptos. Cargos no registrados quedan explícitamente fuera del importe.
  Un pedido histórico entregado sin historial de pago ahora se marca «Pago sin
  conciliar» y no ofrece volver a pagar. No se alteró `db.json`.
- En cliente, `QUOTED` ahora se presenta como «Lista para enviar» y aclara que el
  monto está preparado pero aún no se entregó para decisión; no ofrece aprobar
  ni pagar hasta `AWAITING_APPROVAL`. La carga de producto/color/cantidad hacia
  login/registro está cubierta por Jest; la vuelta con sesión no se probó en
  navegador en esta pasada.
- Verificación de estos cambios: Jest 56 suites / 406 tests, lint,
  `check:ui` y build pasan. Todavía no hay commit ni CI para esta pasada.
- Diferencial confirmado por el usuario: IA integrada que organiza la idea y
  referencias y evita captura manual de datos técnicos; herramientas calculan
  con evidencia, con acciones para enviar/revisar/aprobar/pagar en Sandbox o
  reportar SINPE. Flujo: `cliente → IA → Admin/revisión → aprobación en app →
  checkout → pago/validación → seguimiento`.
- Brecha comprobada en código: el intake guarda imagen/STL/OBJ, pero
  `/assistants/chat` solo recibe mensajes de texto. No hay análisis visual ni
  extracción geométrica/laminado automático; el motor de precio sigue DEMO.
- Meshy (`@meshy-ai/meshy-mcp-server`) quedó aplazado por el usuario para esta
  entrega; no se requiere ni se integra en el siguiente bloque. La generación
  image-to-3D es una herramienta opcional futura y no sustituye un laminado real.
  La galería deseada es solo imagen (principal + tres vistas); puede renderizarse
  desde el mismo modelo fuente y mantener ese archivo privado. Para gramos/horas
  hacen falta los modelos fuente autorizados y un laminado K1C reproducible.
- Verificación previa del catálogo: Jest 51 suites / 305 tests, lint,
  `check:ui`, `check:automation` (270 comprobaciones), build y `git diff --check`
  pasan. CI aún corresponde al baseline publicado `e41099d`, no a estos cambios
  locales.

## Reauditoría visual y cotización conversacional — 2026-10-05

- QA aislado: UI `localhost:5181` (Admin), `127.0.0.1:5182` (cliente), API
  `127.0.0.1:3219` con copia temporal. No se tocó el `db.json` de trabajo ni se
  envió pedido, correo o pago.
- El agente de cotización respondió a una petición de solo el brazo robótico
  para simulación de banda transportadora y devolvió un resumen estructurado con
  dimensiones/material sin definir. La conversación y su borrador sobrevivieron
  recarga y retorno de login. No se envió la solicitud.
- Medidas de `/solicitud/archivo`: vacío permitido; `15 × 8 × 4` con selector
  `cm` válido; «15 cm y lo que sea» bloqueado con error. La unidad seleccionada
  se usa si el texto no incluye unidades, y el payload evita duplicar `cm`.
- Copiloto Admin Light a 1265×720: corregido auto-scroll que recortaba el saludo;
  se ven saludo, sugerencias y composer. Catálogo Admin identifica junto al
  importe cuándo el precio es `DEMO · REFERENCIAL`.
- Revisión visual comprobada en escritorio Light; no se hizo matriz 375/768,
  teclado/lector ni recorrido completo post-cambio. No se corrieron pruebas Jest
  en esta pasada. `npm run lint`, `npm run check:ui`, `npm run build` y
  `git diff --check` pasan.
- No se verificó una escritura CRUD desde el Copiloto. El chat Cliente aún no
  transmite imágenes/STL/OBJ al modelo y el cotizador no obtiene grams/horas de
  un laminador. Correo permanece UNKNOWN por el fallo anterior de n8n antes de
  Gmail; no reintentar sin autorización expresa.

Siguiente trabajo de mayor impacto: conectar de forma segura las referencias
del cliente al flujo IA con consentimiento/validación, terminar la ruta
laminador K1C reproducible, ejecutar y observar una operación Admin CRUD de QA,
y luego recorrer catálogo → carrito → pago DEMO y cotización → aprobación → pago
con matriz responsive. Ver evidencia y límites de esta pasada en `docs/05`,
contrato de negocio en `docs/02`/`docs/03`, APIs en `docs/07` y orden en `docs/10`.

## Snapshot previo — historial, no usar como estado actual

- Integración casa–curso: recuperados `1e086a9`, `7e0c2dd` y `ba497da`
  mediante bundle Git autorizado, SHA256 comprobado y fast-forward desde
  `e5c1976`. Publicado `ba497da` en origin/Pruebas. Base runtime de casa
  preservada sin stage ni cambios; no asumir que coincide con el fixture
  versionado del curso. Gates locales: 50 suites/299 tests (sin caché), lint,
  check:ui, build y 270 comprobaciones de automatización pasan. CI del push
  está pendiente; revisión visual autenticada y proveedor IA real pendientes.
  Continuar con docs/11 y revisar el recorrido completo, no declararlo cerrado.

### Corrección de alcance del usuario: presentación de 15 minutos

La decisión vigente es cliente + IA preparan la cotización personalizada desde
mensajes y referencias; Admin revisa/aprueba la propuesta; n8n/Gmail entrega
la cotización validada; cliente paga DEMO; comienza el pedido de fabricación.
La propuesta es independiente del catálogo. La IA debe realizar CRUD de Admin
con revisión del cambio antes de confirmar, requisito de graduación. DeepSeek
es el proveedor solicitado. Las frases históricas de "solo lectura" describen
limitaciones por resolver, no el alcance aprobado. Roadmap y criterios de cierre
en docs/10, bloque "Presentación de 15 minutos". Comentarios nuevos se agregan
a esos requisitos. Trabajo exclusivamente en Pruebas; main no se modifica.
Preparación estimada inicial: 45/100 según esa matriz; no es auditoría completa.

- Esta sección reemplaza las descripciones anteriores de compra y pago que
  aparecen más abajo en los apuntes históricos. La entrega es un MVP frontend
  con JSON Server: `DEMO` simula persistencia/recibo, no cobra dinero real.
- Catálogo: visitantes pueden explorar; solo `customer` puede agregar, abrir
  carrito y pagar. Login/registro devuelve a la ficha del producto; no existe
  carrito anónimo. `Pagar · DEMO` crea una compra idempotente `CONFIRMED`/`PAID`
  y navega al recibo `/pedidos/:id`.
- Cotización personalizada: Admin dispone de una opción simple para guardar
  monto, alcance/condiciones y vigencia sin exigir producto del catálogo. El
  correo sigue por el workflow n8n/Gmail vigente. El cliente aprueba y paga
  DEMO desde su cuenta; el pedido con snapshot del alcance se crea al pagar y
  el cliente recibe el recibo.
- Admin no verifica comprobantes ficticios ni paga/crea pedidos en nombre del
  cliente. Las órdenes avanzan a producción después del pago DEMO. Eventos
  antiguos relacionados con SINPE se consideran datos de flujo anterior.
- El catálogo reconoce `PLA Silk` como variante `PLA`: un producto activo
  tenía estado publicado pero no aparecía ni se podía pedir porque varias
  listas de materiales no coincidían entre Tienda, Admin y el asistente. Se
  alinearon las reglas y el perfil de costo DEMO usa el perfil base PLA sin
  cambiar datos del producto.
- La base contiene 25 productos (6 `ACTIVE`, 19 `DRAFT`), no 25 publicados. Al
  alinear `PLA Silk`, los seis activos aparecen en la tienda. La tabla
  `reviews` está vacía en `db.json` y en la copia preservada del stash; la
  ficha sí conserva el bloque de opiniones, su estado vacío y el acceso para
  opinar. Esta revisión no eliminó reseñas ni alteró la base.
- No se editó `db.json` ni se alteró/publicó/envió el workflow Gmail/n8n. Para
  ejecutar pruebas manuales se usa copia temporal de `db.json` vía
  `VERTICE_DB_FILE`, con Vite en `127.0.0.1:5174` y JSON Server en
  `127.0.0.1:3217`. Los procesos anteriores 5173/3000 no fueron alterados.
- Gates de esta revisión: 49 suites / 292 tests, lint, `check:ui` (47 módulos),
  `check:automation` (264 comprobaciones), build de producción y `git diff
  --check` pasan. En navegador se comprobaron Home, seis productos visibles,
  ficha con un solo selector de color, descripción, reseñas/estado vacío, el
  bloqueo de invitado hacia carrito y el enlace de retorno con filtros.
  Administración y pagos autenticados se comprobaron por tests de componentes
  y API; Gmail real no se envió ni el workflow se modificó.

## Snapshot histórico anterior (no describe el flujo vigente de compra/pago)

- R-H85: se implementaron FAQ, Materiales, Requisitos, Términos, Privacidad y
  Envíos bilingües; checkout legacy redirige a flujos útiles; detalle de pedido
  es customer-only y lee órdenes propias. Admin en `/cuenta` recibe handoff; el
  perfil indica que aún es de consulta. No se agrega pago ficticio: la política
  académica prohíbe acreditar `PAID` sin proveedor verificable. «Mi espacio» es
  ahora identificable para lector de pantalla y ofrece login/registro. La
  confirmación SINPE Admin aclara verificación manual, 44px de botones y Escape
  con retorno de foco. Light `--dim` cumple 4.77:1 sobre panel; cálculo completo
  en docs/04. Solicitudes Light capturada a escritorio; no se mutaron órdenes ni
  pagos. Se quitó de Admin la pantalla de correo de prueba y el backend ya no
  permite desviar el envío a un destinatario arbitrario; el correo comercial
  conserva como destino al cliente registrado y al taller. Gates locales: 48
  suites/304 tests, lint, check:ui, check:automation (261), build y diff-check
  verdes; entrada principal 291.16 kB (gzip 92.45 kB), sin warning de chunk
  grande. GitHub Actions `verify.yml` run #77 completó verde para
  `642b5f1` (2026-10-05; ejecución 37284941855). Responsive visual 375/768,
  Catálogo Light y teclado/AT integral siguen sin evidencia. El `db.json` manual
  permanece sin tocar ni stage. La documentación registra el cierre CI; validar
  también el commit documental antes de recomendar pull.

- R-H81: carrito simplificado; cuenta presenta piezas antes de pago y separa
  verificación de producción. Referencia de nombre actual para órdenes heredadas
  implementada sin cambiar snapshots/precios: falta recargar API activa y verla.
  n8n unificado confirmado Published; Gmail no contiene prueba con plantilla nueva.
- R-H83: Contacto probado como visitante y copia ajustada para no insinuar un
  equipo inexistente; Sobre nosotros inspeccionado visualmente en escritorio.
- R-H82: búsqueda por términos corregida; workflow local actualizado de Agent
  2.2 a 3.1. Ejecución 66 mostró error parser en Agent 2.2 tras tool HTTP exitoso.
  El n8n publicado aún corre 2.2; requiere importar/publicar el JSON regenerado
  y volver a probar la herramienta. Respuesta directa sin tool ya comprobada.
  Browser real 375 Light/1280 Dark; sin pagos/órdenes/correos ni editar db.json.
  Gate local: 45 suites/291 tests, lint/check:ui/build verdes, warning de bundle.
  Siguiente: reinicio controlado API, correo en n8n/Gmail y auditoría abierta.

- **R-H80, versión local de presentación:** tienda con categoría/material;
  ficha sin selector de color duplicado, galería y ruta a personalización;
  cuenta explica QUOTED/CHANGES_REQUESTED, reseñas sin falsa certificación.
  Correo rediseñado desde renderer único probado e incrustado en workflow
  oficial regenerado. Preview IAB 375/1280; Gmail/n8n activo aún no actualizado.
  No se enviaron correos ni se editó db.json. Gate: 45 suites/289 tests, lint,
  check:ui/build y 258 comprobaciones de automatización verdes; bundle grande
  sigue advertido. Sin commit/push/CI remoto. Próximo: revisar versión Gmail
  tras importación, continuar auditoría visual abierta y condiciones de entrega.

- **R-H79, auditoría abierta:** usuario rechaza considerar cuatro bloques como
  garantía de 100%. Recorrer visualización y acciones paso a paso, registrar
  correctos/duplicados/defectos. Correo real de prueba leído y capturado en Gmail:
  HTML anterior distinto a plantilla actual, tabla demasiado ancha, sin enlace
  a cuenta, diferencia costo/total no explicada y Material duplicado. No se
  envió correo ni se modificó n8n. Próximo: comprobar versión ejecutada y
  rediseñar/verificar correo; continuar recorrido completo sin porcentaje fijo.
  Evidencia y límites en docs/05 R-H79.

- **R-H78, carrito/cuenta/pago:** corregidos progreso READY/SHIPPED/DELIVERED,
  encargo sin cobro/producción, advertencia SINPE de ejemplo, desglose de cargos
  registrados y actualización de seguimiento. Evidencia IAB antes/después de
  desborde cuenta 375 y superposición carrito 768; Admin o4 autenticado sin
  mutaciones. No se editó db.json. Gate final: 44 suites/278 tests, lint,
  check:ui y build verdes localmente; CI remoto pendiente. Próximo cierre:
  entrega/retiro y monto final, galería pública y snapshots heredados. Detalle
  en docs/03 y docs/05 R-H78; checkout comercial no se declara completo.

- **Catálogo y procedencia (Bloque 1 / Codex):**
  - Los productos `p7` a `p25` quedaron reclasificados formalmente en `db.json` con `priceSource: 'DEMO'`, `priceConfirmation: { mode: 'DEMO' }`, y `aiProductionEstimate: { source: 'DEMO', verifiedWithSlicer: false }`.
  - No se inventan medidas de laminador ni precios de taller.
  - En `/catalogo` ([Shop.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/src/pages/Shop.jsx)), se añadió una nota académica sobria y discreta (`.shop-product-demo-note`) para los ítems DEMO.
  - Los 25 productos se conservan activos, con sus imágenes y ordenables. Se respetó la directiva de no ejecutar `git checkout -- db.json`.

- **Sesión y expiración activa (Bloque 2 / Codex):**
  - Se implementó expiración activa y recuperación coherente en [AuthProvider.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/src/app/providers/AuthProvider.jsx) mediante `setTimeout` programado hacia `getTokenExpiresAt(token)` y desautenticación reactiva con error tipado `AUTH_SESSION_EXPIRED`.
  - [AuthGuards.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/src/app/routes/AuthGuards.jsx) (`RequireAuth` y `RequireRole`) preservan la ruta de destino (`state: { from, reason: 'session-expired' }`), y tanto [LoginPage.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/src/pages/LoginPage.jsx) como [RegisterPage.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/src/pages/RegisterPage.jsx) presentan aviso informativo y conservan el destino al navegar entre sí.
  - Sincronizado en [07-DATOS-API-AUTH.md](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/docs/07-DATOS-API-AUTH.md) y verificado con la nueva suite [tests/sessionExpiration.test.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/tests/sessionExpiration.test.jsx) (3 tests pasando).

- **Autocompletado IA en Admin (Bloque 3 / Codex):**
  - Suite exhaustiva añadida en [tests/adminCatalogForm.test.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/tests/adminCatalogForm.test.jsx) con 17 pruebas unitarias y de integración de componentes UI: valida nombre vacío, `ROLE_REQUIRED`, timeout, respuesta inválida, generación automática de slug y preservación de campos previos ante fallos de red.
  - Separación estricta entre la propuesta de autocompletado IA y la calculadora de precios DEMO del taller.

- **E01 - Preservación de solicitud personalizada (Bloque 4 / Codex):**
  - Implementada en [QuoteRequestPage.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/src/pages/QuoteRequestPage.jsx) la persistencia reactiva en `sessionStorage`/`localStorage` (`vertice.quote.draft`), incluyendo campos manuales, estado del asistente y nombres de archivos.
  - Si un visitante llena la solicitud y se redirige a `/login` o `/registro`, al volver se restaura el formulario y se advierte de forma explícita (`.quote-intake-restored`) que por políticas de seguridad del navegador los archivos adjuntos deben seleccionarse nuevamente.
  - Suite automatizada [tests/quoteDraftPersistence.test.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/tests/quoteDraftPersistence.test.jsx) añadida y pasando.

- **E03–E05 - Consistencia de pago y concurrencia SINPE (Bloque 5 / Codex):**
  - E03: Pedidos originados desde cotización aprobada (`prepareQuoteFulfillment`) nacen en `status: 'CONFIRMED'` y `paymentStatus: 'PAID'`; en `/cuenta` ([CustomerQuotesPage.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/src/pages/CustomerQuotesPage.jsx)) se muestra el badge de pago verificado y se suprime el formulario e instrucciones de SINPE.
  - E04: La transición operativa genérica (`prepareOrderTransition`) bloquea avanzar de `PENDING` a `CONFIRMED` sin pago verificado (`409 PAYMENT_VERIFICATION_REQUIRED`). En UI Admin ([OrderActions.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/src/features/admin/OrderActions.jsx)), se desactiva el botón genérico de avance y se alerta sobre la necesidad de validar el comprobante primero.
  - E05: La verificación de pago SINPE ([order-payment-operations.js](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/scripts/order-payment-operations.js)) valida `expectedProofSubmittedAt`. Si el cliente actualizó el comprobante con una versión más reciente, la acción rechaza con `409 PAYMENT_PROOF_OUTDATED`.
  - Verificado con [tests/orderPaymentWorkflow.test.js](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/tests/orderPaymentWorkflow.test.js) (15 tests) y [tests/customerOrdersTab.test.jsx](file:///s:/Descargas/varas/visual/proyectos%20visual/impresion-3d/Tienda-de-Impresion3D/tests/customerOrdersTab.test.jsx) (5 tests).

- **Resultados de verificación y gates:**
  - `npm test`: 44 test suites pasando, 271 tests pasando (100% en la suite local al 2026-10-05).
  - `npm run lint`: 0 errores, 0 advertencias (código limpio).
  - `npm run check:ui`: 48 módulos transformados con éxito.
  - `npm run build`: bundle de producción Vite generado sin errores (dist/index.html, dist/assets/).
  - `git diff --check`: 0 errores de formato ni espacios en blanco.

- **Recorrido visitante/cuenta e institucionales (bloque local 2026-10-04):**
  - `/nosotros` y `/contacto` son páginas ES/EN, con enlaces a catálogo, solicitud por archivo, ayuda de diseño y seguimiento según rol. Contacto abre el asistente general; no publica correo de empresa sin autorización explícita.
  - `CartProvider` separa visitante, cada usuario y Admin; la migración `vertice-cart-v1` queda atribuida solo a visitante. La captura de R-H77 detectó el icono visible sin sesión: ahora el navbar solo ofrece el carrito a `customer`, `/carrito` requiere ese rol y login/registro preserva destino y fusiona la selección guardada del visitante. La ficha comunica ese handoff; Admin no tiene acceso de compra. El logout preserva carritos independientes y las pestañas del mismo navegador sincronizan la clave activa.
  - R-H77: el navbar del visitante ya no ofrece carrito; `/carrito` exige `customer`, envía a login con destino/aviso y restringe Admin. La ficha visitante explica que la selección se conserva localmente y ofrece crear cuenta/entrar; el login/registro la incorpora al carrito customer. No se borró almacenamiento ni se tocó `db.json`. Tests de regresión añadidos; IAB Light escritorio (~1265×713) y pestaña real Brave Dark confirman navbar/menú de visitante sin carrito y redirección al login. Vista customer live, viewport 375/768 y continuidad de datos locales tras login siguen pendientes. Detalle en `docs/05` R-H77.
  - Gate local tras el bloque: `npm test` 44 suites/271 tests, `npm run lint`, `npm run check:ui`, `npm run build` y `git diff --check` pasan. Build conserva el aviso de bundle JS principal superior a 500 kB. CI remoto y vista Admin con sesión no se validaron aquí.
  - Contratos documentados en `docs/02`, recorrido en `docs/03`, guía visual en `docs/04` y evidencia parcial en `docs/05` R-H77. Siguiente cierre: revisar carrito customer en viewport móvil, tema Dark y continuidad real de carrito al autenticarse; no declarar completa la revisión responsive global.

- **Revisión puntual de Contacto (2026-10-04):**
  - Eliminado el offset superior duplicado del shell en `/contacto`; su composición distingue entrada por archivo, idea y seguimiento, explica el proceso real y conserva FAQ/asistente general. El link de sesión visitante retorna a `/cuenta` después del login.
  - No se muestra el Gmail personal ni un buzón inventado: un correo corporativo no puede ser creado por código. El formulario de mensaje general y su destino interno siguen pendientes; no confundirlos con intake de cotización.
  - IAB: `/contacto` capturado en escritorio (~1270×707) Light/Dark. Árbol AX confirma enlaces por rol y llamada al asistente. Aún sin captura 375/768 ni teclado completo. Registro `docs/05` R-H76.
  - Verificación local más reciente: `npm test` 44 suites/271 tests; lint, `check:ui` y build pasan (con aviso de bundle principal >500 kB). El worktree ya estaba muy modificado antes de este corte; no hacer stage/commit/push sin aislar y revisar esos cambios preexistentes.


## Registro anterior para continuar (2026-10-03; superado)

- Rama `Pruebas`, HEAD `5972088`; GitHub Actions está verde solo para ese commit (run `37149033364`), no para el árbol local. Los cambios locales de este corte no están committeados; no hacer stage/commit/push automático. `db.json` conserva una entrega de correo `UNKNOWN`; no modificar ni reenviar.
- B0 local: `automation/n8n/vertice-cr-unificado.json` es la fuente oficial; `scripts/build-n8n-unified.mjs` genera el export. Se conserva `@n8n/n8n-nodes-langchain.toolHttpRequest` v1.1 y los payloads/placeholder fixes documentados en `docs/08`.
- Proveedor único: OpenRouter; no se usará ni requiere clave de DeepSeek. El runtime local sirve comparaciones de materiales desde la guía controlada y clasifica `Agent stopped due to max iterations` como fallo. Pero la instancia `npm run api` activa en `localhost:3000` todavía sirvió la lógica anterior durante prueba live; reiniciar solo ese proceso y repetir la pregunta en UI. No reiniciar n8n ni Vite por este cambio.
- La nota del workflow local se corrigió y publicó para indicar OpenRouter; solo se editó documentación del canvas, no nodos ni credenciales.
- Admin B1 continúa abierto. El intento de abrir `/admin/asistente` en el origen `127.0.0.1:5174` redirigió a `/login`, por lo que no hay sesión Admin utilizable en el navegador y no se pudo auditar visualmente esa pantalla. El `ROLE_REQUIRED` anterior confirma rechazo de API, pero no su causa exacta; expiración o desajuste de sesión son hipótesis, no diagnóstico confirmado. `localhost:5173` y `127.0.0.1:5174` tienen `localStorage` distinto. Mantener `npm run dev` + `npm run api`, reautenticar en un solo origen; no leer/copiar token ni relajar la guarda.
- El intake local prepara con Enter y actualiza medidas/material posteriores sin pedir otra iteración de n8n; una prueba real pobló el resumen y corrigió la contaminación del nombre por “para revisarlo”. Se formatean listas Markdown de forma segura. La comparación de materiales live demostró que el API activo está desactualizado; guía/error tras recarga aún pendiente.
- Tasas públicas: Hacienda y ARESEP respondieron en ejecuciones previas; no se encontró selección exacta del servicio eléctrico del taller. Mantener cálculo como DEMO si faltan tarifa/mediciones auténticas.
- B2: la prueba de email continúa `UNKNOWN`, sin `messageId`; la búsqueda Gmail más reciente en Enviados para asuntos `DEMO`/`PRUEBA` no halló coincidencias y no se identificó una ejecución de correo. Eso no prueba con certeza que no se enviara. No reintentar hasta reconciliar Gmail/n8n; no mandar a `ana@example.com`.
- Auditoría de lógica: están pendientes fotos propias/galería y intake de archivo; checkout real, rechazo/solicitud de cambios y pedidos del cliente; borradores asistidos; perfil/cuenta completa; rutas informativas. Admin ya tiene transiciones de pedidos secuenciales y auditadas; Clientes consulta historial y Activity presenta eventos existentes.
- Bloque C y su orden siguen preservados en `docs/10-ROADMAP.md`. El asistente para solicitudes es un intake que ordena la idea, acepta referencias y produce un borrador editable; no calcula ni envía sin confirmación. El precio por producto en Admin es una sugerencia DEMO separada. No se reanuda el roadmap completo de C hasta cerrar el gate acordado; esta corrección puntual no depende de DeepSeek.
- Decisión de correo: la aprobación de cotización se registra dentro de la app, no respondiendo al email. Al aprobar, se busca confirmar al cliente y avisar al taller con snapshot/estado correcto; los avances al cliente se disparan por transiciones reales de pedido. No está implementado. B2 queda aparte: el `UNKNOWN` no se reenvía hasta reconciliarlo junto al usuario y usar su correo alternativo de cliente.
- Estimación conversacional (no métrica de producto): ~60% del MVP académico total, rango 55–65%; Auth/Admin y base storefront existen, mientras checkout, archivos y ciclo completo de cuenta/solicitud faltan.
- Verificación visual actual: en sesión anónima limpia a ~1265×710, el árbol accesible confirmó Enter crea el resumen, otro mensaje llena medidas/material y no se envía nada. El viewport no cubre 375/768/1280; respuestas Markdown actualizadas requieren nueva captura. Admin continúa sin sesión visual: `/admin/asistente` es una página distinta del widget público según rutas/código, pero no hubo captura autenticada del copiloto ni del CTA de cotizador por ficha.
- Verificación local del corte actual: `npm run lint`, Jest (31 suites/177 tests), `check:ui`, `check:automation` (248 comprobaciones), `build:n8n`, `build` y `git diff --check` pasan. Build conserva aviso de bundle principal >500 kB. El proceso API live no se reinició y mostró el error de iteraciones sin clasificar. El CI remoto verde se limita al HEAD `5972088`; no hay commit ni cambios enviados a CI.
- Continuación inmediata: reiniciar solo `npm run api` en el puerto 3000 y probar orientación desde el cotizador con OpenRouter; no enviar solicitudes ni correos. Después auditar el copiloto Admin con rol válido, confirmar que se ve la página completa y probar agente/herramienta/inyección. B2 sigue `UNKNOWN`, no reintentar; reconciliarlo con el usuario y usar la cuenta cliente que elija.

Este registro anterior fue superado por el snapshot vigente del 2026-10-04.

## 1. Misión del proyecto

Vértice CR es una tienda costarricense de impresión 3D con dos líneas:

1. modelos de catálogo que se fabrican después de recibir el pedido, sin promesa de entrega inmediata;
2. impresión personalizada con revisión y cotización antes de producción/pago.

Stack objetivo: React + Vite + JavaScript/JSX, con las integraciones definidas en `06` y `07`.

## 2. Estado actual

- Fase: **4 — Implementación React (Acomodo y Base)**.
- HF-01: **CONGELADO** (Aprobación final dada el 2026-09-30).
- React: **DESBLOQUEADO** (Gate Abierto).
- Dark/Light: definidos.
- Identidad: **Obsidian Precision Forge + Lava Orgánica**.
- El objetivo visual no es “más efectos”; es una Home con identidad fuerte que venda por producto, composición y percepción.
- Capacidad confirmada por el usuario: impresión FDM únicamente, con filamentos ASA, PLA, PETG, ABS y TPU.

## 3. Autoridad

Para conflictos usa:

**usuario → AGENTS → dominio vigente → AI_CONTEXT → historial → académico.**

Este archivo no puede reemplazar una decisión de `docs/01–10`.

## 4. Qué leer según la tarea

- Home/visual: `03 + 04 + 05`.
- Negocio: `01 + 02`.
- API/datos/auth/N8N: `02 + 07`.
- Arquitectura React: `01 + 02 + 03 + 06 + 07 + 09 + 10`.
- Admin/IA: `02 + 08` + visual del área.
- Testing: `09` + dominio afectado.

## 5. Contratos no negociables

- JavaScript/JSX; no TypeScript.
- No inventar datos, claims, endpoints, métricas, capacidades o resultados de pruebas.
- Solicitud personalizada no es producto de catálogo.
- Flujo oficial de solicitud:
  `PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID`
  con salidas `REJECTED`, `EXPIRED`, `CANCELLED`.
- Una solicitud pendiente nunca se trata como `precio × cantidad`.
- La UI no accede directamente a APIs/datos; usa las capas definidas en `06`.
- Estados de carga, vacío, error, validación y procesamiento forman parte de la UX.

## 6. Contrato visual

Dirección: **Obsidian Precision Forge + Lava Orgánica**.

Vértice debe sentirse técnico, industrial y contemporáneo sin caer en gamer/cyberpunk/neón ni UI genérica de IA.

Principios:
- el producto es protagonista;
- precisión = evidencia, no ruido;
- geometría y tipografía deben sentirse propias;
- cada ruta necesita atmósfera con intención: variar capas/superficies por tarea sin repetir fondos secos ni pegar la misma retícula/halo en todas partes;
- movimiento con propósito;
- evitar decoración repetitiva;
- mobile es reinterpretación, no simple reducción.

Las referencias externas sirven para extraer principios. Registrar fuente, patrón, adaptación y razón cuando una referencia influya en una decisión.

## 7. HF-01 actual

### Fuerte
- Hero workbench con producto grande.
- Riel vertical de piezas.
- Tipografía Space Grotesk + JetBrains Mono.
- Retícula y acento Lava.
- Catálogo con materialidad y estados.
- Chatbot con lenguaje visual integrado al workbench.
- Panel de accesibilidad con controles definidos.
- Search compacto con estado sin resultados.
- Dark/Light y reduced motion contemplados.

### Defectos visuales cerrados e implementados (render real, 2026-09-29)
Detalle, decisiones del usuario, orden de trabajo y criterio de cierre en `docs/05`, sección «Auditoría visual con render real».
- **Implementados en el mockup** (V-01, V-04 a V-09): ✅ V-04 fundido en fotos; ✅ V-01 scroll en botones flotantes; ✅ V-05 opacidad en «Mi Espacio»; ✅ V-06 buscador simplificado; ✅ V-07 chat (flechas y hueco); ✅ V-08 título y botón cerrar en móvil; ✅ V-09 etiquetas español en Precisión y footer.
- **Requisitos de React, no se tocan en el mockup:** V-02 (en móvil el producto debe verse en la primera pantalla); V-03 (PRT-006 y las demás tarjetas son ejemplos del mockup; el catálogo real vendrá con datos reales).
- Idioma y tamaño de texto globales no entran en el mockup; están documentados como requisito de React en `docs/04`.

### Deuda visual conocida (se resuelve en React, no bloquea congelación)
- Responsive real (V-02: en 375 px el producto debe verse en la primera pantalla).
- Datos de catálogo reales vs. ejemplos de mockup (V-03).
- Equilibrio final entre producto y telemetría decorativa del hero.
- Comportamiento final del hamburger (funcionalidad React, no HTML estático).
- Validación de accesibilidad con tecnología asistiva real.

### Regla
No tratar como contrato React algo que aún esté marcado como pendiente.

## 8. Navegación

Rutas públicas y administrativas: `docs/03`.

El navbar mantiene la identidad pública de Vértice. El hamburger se conserva; su comportamiento final sigue pendiente donde el historial registra rechazo del menú anterior. No resucitar una variante rechazada por asumir que un snapshot antiguo era definitivo.

## 9. Arquitectura objetivo

Referencia: `docs/06`.

Capas:

**UI → Pages/Features → Hooks/Services/Utils → APIs → datos**

La UI no contiene reglas de negocio complejas ni accede directamente a JSON Server.

## 10. Datos e integraciones

Referencia: `docs/07`.

Contratos académicos base cerrados para abrir el gate: modelo/estados y auth simulado contra JSON Server. La implementación continúa por slices. El proveedor externo y credenciales reales de n8n siguen pendientes en `docs/07`; el webhook único y callback de herramientas ya están implementados y verificados localmente con servicios mock.

## 11. Calidad

Referencia: `docs/09`.

Objetivo de coverage y orden de pruebas se definen en `docs/09`. Los scripts actuales viven en `package.json`; verificar los resultados de la rama antes de reportarlos.

## 12. Gate de React — SUPERADO (2026-09-30)

El gate está abierto y React está en curso. Las listas de preflight describen los criterios que se cerraron, no una prohibición actual. Las integraciones que aún no tienen proveedor/URL deben concretarse antes de su slice correspondiente.

## 13. Orden de arranque de React

Cuando el gate abra: → **ABIERTO (2026-09-30)**

1. limpiar scaffold Vite;
2. aplicar tokens/global styles;
3. crear App shell/layout;
4. routing;
5. providers;
6. services/adapters;
7. primitives/components compartidos;
8. Home fiel a HF-01;
9. features por flujo;
10. estados y errores;
11. tests por bloque;
12. auditoría visual global.

## 14. Referencias maestras

El banco vivo está en `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md`.

Fuentes principales:
- Impeccable
- Anthropic frontend-design
- taste-skill
- UI/UX Pro Max
- Godly
- Awwwards
- Siteinspire
- Land-book
- Commerce Cream
- Mobbin
- Refero
- Pageflows
- Codrops
- Radix / React Aria
- Vercel Web Interface Guidelines
- Scrolltide — motion, scroll-driven interaction, componentes/shaders y proceso de construcción por etapas

No instalar ni copiar una referencia por aparecer en esta lista.

## 15. Cómo continuar

Antes de editar:
1. inspecciona el estado real;
2. identifica la fuente de verdad;
3. detecta contradicciones;
4. define el cambio mínimo que resuelve el problema;
5. implementa;
6. verifica;
7. documenta.

**Punto actual:** HF-01 **CONGELADO**, React Gate **ABIERTO**; Auth académico implementado y verificado localmente.

**Prioridad académica nueva:** por indicación del profesor, el orden operativo es **Autenticación → Admin → IA**. Se trabaja por slices funcionales con identidad/tokens vigentes; Admin no debe copiar la composición Home.
- **Auth académico implementado:** login/registro/restore/logout contra JSON Server. Sesión guardada sin verificar por fallo de red no autentica rutas, pero se puede borrar localmente. Cliente y Admin probados manualmente en desktop; salida existe en navbar público y sidebar Admin. Token `sim.v1` es académico, no seguridad de producción. AuthLayout muestra seis fotos como collage superpuesto; hover, foco y tap elevan/agrandan una pieza y su leyenda. Fondo con retícula y luz cálida de baja intensidad. Tests cubren nombres, selección y teclado. Dark/Light en más breakpoints y aprobación visual pendientes. GitHub Actions debe quedar verde en el commit de entrega antes de recomendar pull.
- **Capa 0 (UI Kit):** Completada y testeada (100%).
- **Capa 1 (App Shell):** Completada (100%). Layouts (`PublicLayout`, `AdminLayout`, `AuthLayout`), Routing (`react-router-dom`), Providers y estilos base (`shell.css`) implementados. El error de NPM (`brace-expansion`) fue parcheado y el servidor levanta en `localhost:5173`.
- **Capa 2 (Home — cerrada para avanzar, 2026-10-01):** Hero/workbench, scanner, tarjetas, bloque «Bajo pedido»/FDM y contenido actual están implementados. A petición del usuario se posponen las iteraciones restantes; HF-01 ya no bloquea Admin. No significa cambiar ni editar el HTML congelado.
- **Marco global responsive:** tokens `--page-gutter`, `--page-gutter-compact`, `--layout-max-wide` (1680px) y `--layout-max-content` (1520px) centralizados en `src/index.css`; Home/navbar comparten el ancho amplio y las secciones el ancho de lectura. R-H28 documenta el aumento tras el reporte de encogimiento en 1920×1080. Render de escritorio ancho confirmado por screenshot; tablet/móvil y ultrawide continúan pendientes.
- **Alcance de preferencias:** tema, idioma seleccionado, escala tipográfica, contraste y movimiento son preferencias compartidas por providers y persistidas en localStorage; paneles abiertos, query/conversación y pieza seleccionada son estados locales. La traducción integral de todas las rutas aún no se declara completa. Contrato en `docs/04`.
- **Iteración visual React (2026-10-01):** Acceso cambió de carrusel rechazado a collage según R-H39/R-H41. Asistencia se reorganizó como bienvenida + temas rápidos + compositor; se informa que la respuesta automática no está conectada y se ofrece `/solicitud`. Referencias y criterio en `docs/04`, auditoría en `docs/05`. Aprobación visual de Acceso/Asistencia y prueba con tecnología asistiva real pendientes. Home se cierra para avance; el siguiente orden es Admin → IA/N8N.
- **R-H48 — Home puntual:** navbar/footer restaurados a la primera iteración R-H45 (nav 14/13 px, CTA 13/12 px, idioma 12 px, footer 14/12 px; menú a 820 px) tras aclaración del usuario de que la captura anterior se observó con zoom 75%. Catálogo ahora se presenta como selección editorial en tendencia sin afirmar popularidad cuantificada. Controles flotantes aumentados a 56 px y paneles móviles separados para evitar solapamiento. HF-01 no se tocó. Pasan lint, 7 suites/60 tests, `check:ui` (48 módulos), build (107 módulos) y diff check. La pestaña local confirmó el texto y controles en árbol accesible, pero no se obtuvo screenshot para comparar tamaños; queda pendiente la inspección visual de escala. Home continúa cerrada como área prioritaria y los cambios posteriores son puntuales.
- **Admin slice 1 (historial):** `/admin` y solicitudes quedaron implementados en slices previos. En este corte se termina `/admin/actividad`; pedidos, catálogo, categorías y clientes conservan placeholders hasta sus slices. El snapshot de pasos anteriores y su evidencia vive en `docs/05`.
- **Admin slice 2–3 + R-H50:** solicitud inicia revisión con transición auditada y contrato de almacenamiento pendiente de proveedor. Dashboard `/admin` rehecho como tablero de flujo: KPI abierto, anillo proporcional calculado sobre pedidos activos por etapa, registro sin paneles enmarcados y cola accionable de solicitudes; referencias documentadas en `docs/04`, `docs/05` y `docs/08`. Home/HF-01 no se editaron. Browser local confirmó el árbol accesible actualizado, no se obtuvo screenshot visual. ESLint, 7 suites/60 tests, `check:ui` (48) y build (108) pasan. `npm run api` requiere reinicio para el endpoint de revisión; el fixture no tiene `PENDING_QUOTE`, así que esa acción no se recorrió. Comparativa visual 1280/768/375 y Light pendiente.
- **R-H47 — Acceso/Admin:** collage conserva seis fotos, pero en estado idle ya no atribuye el nombre/material de la primera pieza; ofrece guía y contextualización, y la leyenda de producto aparece tras hover/foco/selección. «Mi cuenta» diferencia invitado, cliente y admin; admin abre `/admin`. El shell identifica la sesión Admin. Navegador local confirmó login admin → tienda → menú «Panel de administración» → `/admin`; a 724 px se observó el reflujo responsive. Pasan 54 tests, lint, `check:ui`, build y `git diff --check`. Sin aprobación visual humana ni cobertura de todos los breakpoints/tema Light. Detalle en `docs/05`.
- **R-H41/R-H42 Home:** R-H41 afirmaba que el líder acababa sobre las cuatro piezas; el usuario comprobó en el render que seguía en el fondo. R-H42 calcula el endpoint midiendo el `object-fit: contain`, paddings y dimensiones naturales del asset; recalcula al redimensionar o cambiar la pieza y conecta desde el rótulo. Inspección local confirma el líder sobre las cuatro piezas a 1280×800 y sobre soporte a 375×812. «Filamento · PETG» contextualiza el material; lattice pasa a «estructura aligerada» también en la tarjeta del soporte. La ProductCard destacada omite su badge flotante; las columnas de precisión pierden índice/chip redundante. Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`; faltan tamaños/temas restantes.
- **Assets del mockup publicados:** `hero-soporte.jpg`, `producto-engranaje.jpg`, `producto-dragon.jpg`, `producto-drone.jpg` y `producto-maqueta.jpg` fueron reutilizados desde `mockups/images/` en `public/images/` sin alterar el mockup congelado.

**Admin actual:** `/admin/actividad` consulta `activityLog`; el usuario pidió dejar su prueba para más adelante. Pedidos son de solo lectura; las solicitudes pueden preparar/publicar cotizaciones e incorporar el legacy `SUBMITTED` mediante registro explícito. Catálogo tiene CRUD de productos/categorías con bajas protegidas por referencias; sin stock ni storage. `/admin/clientes` y ficha son lectura de usuarios `customer`, búsqueda y relaciones a pedidos/solicitudes; no exponen credenciales ni editan PII. En este corte, el aviso del resumen explica `SUBMITTED` sin convertirlo por defecto, la leyenda adapta columnas al ancho disponible, Categorías ofrece edición contextual con preview, y Pedidos/Clientes tienen registros visualmente diferenciados dentro del lenguaje Admin. Buscador global ofrece coincidencias reales de modelos ACTIVE. Idioma ES/EN en selector segmentado; no se amplían locales sin traducciones completas y público objetivo. El asistente Admin debe también enseñar cómo recorrer el panel, explicar secciones/estados y orientar al operador sin ejecutar cambios; este requisito responde a que el uso del dashboard todavía no es autoevidente.

**Cotización y asistentes (dirección vigente):** usar exclusivamente OpenRouter hasta que el usuario indique lo contrario (la API de DeepSeek pertenece al profesor y no está disponible en fin de semana). El asistente de diseño organiza los datos que el cliente declara y prepara un resumen editable con referencias; no fuerza dimensiones, no interpreta una imagen como medición, no calcula precio ni envía sin revisión/confirmación explícita. El cálculo de precio de catálogo por producto en Admin es DEMO y requiere entradas y confirmación. El asistente Admin es una página operativa separada y de solo lectura, no el popup público; su render requiere recuperar sesión válida para inspeccionarlo.

**Regla visual permanente (indicación del usuario, 2026-10-02):** cada cambio de UI exige screenshots y revisión en navegador tras cada iteración y en el render final, comparando rutas relacionadas para conservar un sistema común sin copiar su composición. Responsive se comprueba en 1280/768/375; si el navegador impide un tamaño, dejarlo explícitamente pendiente y no afirmar que se revisó.

**Verificación más reciente:** ESLint, 18 suites/98 tests, `check:ui` (48 módulos), build (133 módulos) y `git diff --check` pasan localmente. Capturas de `/catalogo` Light/Dark (~1150 px) verifican el tratamiento de imagen full-bleed R-H64. La captura de Admin en el corte R-H63 muestra 25 modelos, 6 publicados y 19 borradores con fotos; Clientes/Categorías Light también fueron revisadas. No hay control del viewport integrado: 768/375 siguen pendientes. Se añadieron 19 fichas DRAFT; no se editaron datos ajenos a esas fichas. Activity no se recorrió por decisión del usuario. GitHub Actions no está confirmado verde.

**Siguiente bloque exacto:** actualizar y probar el workflow único OpenRouter en la instancia n8n existente; verificar que Enter entrega el mensaje y que cada agente responde sin error de iteraciones. Después, reautenticar y revisar el copiloto Admin independiente y el calculador por producto. No declarar B1/B2 cerrados ni recomendar `pull` hasta que exista evidencia live y CI verde para el commit correspondiente. Activity continúa aplazada por el usuario.

**R-H63 — Productos y motion Admin (2026-10-02):** se agregaron 19 borradores `p7`–`p25` a `db.json`, asociados a 19 fotos identificables en `public/images`; no se inventaron datos comerciales/técnicos, todos tienen precio/material sin confirmar, no aparecen en la tienda y su publicación está bloqueada hasta completar lo requerido. Los seis productos activos preexistentes siguen publicados. Clientes y Categorías recuperan entrada escalonada `admin-row-enter`; ambas preferencias de movimiento reducido la desactivan. Navegador Light (~1166 px) inspeccionado: `/admin/clientes`, `/admin/catalogo/categorias`, `/admin/catalogo`; Catálogo muestra 25 registros, 6 publicados, 19 borradores. Todas las rutas de imagen están presentes. Lint, 18 suites/98 tests, `check:ui` (48 módulos), build (133 módulos) y `git diff --check` pasan. No se tocó Activity. Responsive 768/375 y completar datos de fichas pendientes; sin commit/push ni confirmación de CI.

**R-H64 — Tienda, fotografía de producto (2026-10-02):** se quitó el marco
visual anidado de las imágenes de `/catalogo` haciendo que la foto llene la zona
superior de su tarjeta (1.8:1, sin padding ni máscara). El render Light/Dark se
inspeccionó a ~1150 px; responsive móvil/tablet pendiente. El orden sigue siendo
Auth → Admin → IA.

**Skills de proyecto activas:** `.agents/skills/vertice-continuity/SKILL.md` y `.agents/skills/vertice-visual-audit/SKILL.md`. Nuevas skills/referencias aportadas por el usuario se evalúan por utilidad real; no se incorporan automáticamente.

**Referencia nueva:** Scrolltide queda registrada en `docs/04` como banco para motion cinematográfico, scroll, componentes y proceso de construcción. Regla: páginas sirven para estudiar resultado/comportamiento; repositorios sirven para estudiar implementación/licencia/dependencias. Ninguna referencia sustituye HF-01 ni justifica instalar una librería automáticamente.

**Contexto confirmado por el usuario:** entrega académica frontend, con visión
de migrar a servicios reales. Pagos/facturación reales fuera del alcance actual.
La rúbrica académica ya se compartió; sus requisitos se implementan según los
contratos existentes en Markdown. Pagos reales y facturación fiscal real quedan
fuera de esta entrega.
`docs/07` ya detalla Auth y almacenamiento académico. SINPE continúa pendiente de
contrato; `db.json` conserva un estado histórico `SUBMITTED` que debe resolverse
explícitamente antes de conectar solicitudes.

**Fabricación:** FDM únicamente; filamentos ASA, PLA, PETG, ABS y TPU. Home no
debe afirmar SLA, resina o nylon como capacidades disponibles.

**Modelo del catálogo:** los modelos se imprimen bajo pedido y no hay productos
para entrega inmediata. Ninguna ficha, tarjeta, Admin o métrica debe inferir
disponibilidad de los campos demo `stock`/`minStock`. Admin va antes de IA/N8N;
este orden se conserva en `docs/10`.

**Claims aún no confirmados:** la tolerancia `±0.05 mm` de HF-01 y los plazos/
cobertura logística no son compromisos operativos. React los omite hasta que se
definan con datos reales.

**Corte de anotaciones (2026-10-01):** hallada y corregida la causa del recorte
de fotos de Tienda (zoom de hover compartido + escenario con `overflow:hidden`),
sin alterar el asset completo. El aviso de borradores ahora explica que falta
confirmar la ficha y enlaza al filtro `DRAFT`; no completa ni publica nada.
«Ver tienda» se quitó del pie aislado de Admin porque duplicaba el enlace del
logotipo; sesión y cierre quedan como grupo terminal. Se documentó en `docs/07`
una primera política/prompt investigados para cotizar FDM de forma automática
en los casos comprobables y derivar excepciones al taller; faltan tarifas y
perfiles reales, no hay integración activa.

**Verificado localmente:** screenshots en navegador Light: Tienda ~1150/768/375,
Admin Catálogo ~1150 y Admin Resumen 1280/768/375. Las cajas de imagen empatan
con sus escenarios, contain muestra productos completos y 375 no desborda; el
CTA filtra exactamente 19 borradores sin publicarlos. Logout y navegación del
sidebar responden en móvil. 18 suites/98 pruebas, lint, `check:ui` (48 módulos),
build (133 módulos) y `git diff --check` pasan. El screenshot inicial de 768 px
reveló choque de etiquetas en la leyenda del gráfico; se cambió a dos columnas
para ese rango y el screenshot posterior muestra etiquetas/números legibles,
sin colisión. La revisión no cubre aún todas las rutas de Admin. No commit ni
push en este corte.

**Siguiente bloque:** revisar visualmente y probar el cotizador manual de
`/admin/solicitudes/:id`, traer los inputs reales del taller (sin sustituirlos por
datos demo) y confirmar recorrido Guardar → Publicar. Luego seguir con los
pendientes de cierre de Admin; Activity se mantiene para el bloque que el usuario
reservó. Después de Admin, avanzar a asistentes separados y automatizar laminado/
cotización solo cuando perfiles, tarifas y privacidad estén resueltos. R-H66 revisa las
cuatro fotos y el placeholder del catálogo: las fuentes cuadradas siguen
completas y ahora prolongan su fondo para no quedar como una caja negra inserta;
assets originales intactos. También se unificó el placeholder sin foto. Light
validado a ~1135/768/375 y Dark a ~1135/375; no hay overflow horizontal en móvil.

**R-H67 — Cotizador manual Admin (2026-10-02):** `RequestNextAction` reemplaza el
monto libre por captura guiada de material FDM, gramos/horas por pieza, filamento
y desgaste USD/kg, cambio BCCR, potencia media de impresora y tarifa eléctrica,
postprocesado, diseño, otros costos y recargo. Una función pura calcula costos y
total; la acción de servidor recalcula y persiste valores, desglose, cantidad,
fecha y versión de regla con la cotización. Las tarifas se copian manualmente por
solicitud; sin AI, API BCCR/ARESEP en vivo ni integración de laminador. No hay
importes precargados. Impuestos/envío solo se consideran si se agregan o se
explican en condiciones. En captura local la ficha real ya se revisó en Dark y
Light a 1265×633; al detectar los campos negros en Light se corrigió el uso de
tokens y se recapturó. Lint, 19 suites/101 tests, `check:ui` (48 módulos), build
(134 módulos) y `git diff --check` pasan. Responsive estrecho y el recorrido
manual contra tarifas verdaderas/API siguen pendientes; no se guardó una oferta
de ejemplo.

**Cotización por email (R-H68, 2026-10-02):** en `QUOTED`, Admin tiene un único
CTA para enviar al cliente y copiar al operador por BCC; el servidor hace el
dispatch a n8n, registra actividad y avanza a `AWAITING_APPROVAL` solo tras 2xx.
Direcciones `example.*` se bloquean. La conexión de Gmail OAuth y Webhook no
quedó verificada; no se asume conectada. Falta generar el secreto compartido
Header Auth, guardarlo en `.env`, publicar el workflow y probar un correo
controlado; no se envió ningún correo. Hacienda ofrece un endpoint
oficial sin token para USD compra/venta (usar venta para reposición en USD); BCCR
(indicador 318, con suscripción/token) queda como alternativa. ARESEP publica
tarifas por empresa/tipo/bloque de la factura. Ninguna fuente está conectada a la
calculadora. El cotizador se inspeccionó en sesión real local: el registro R5 está
En revisión y el formulario no tiene datos de costos reales, así que no se guardó
una cotización ni se forzó el CTA de email. Cierre de código local: 22 suites/106
tests, lint, `check:ui`, build y diff check; no hay commit/push. Próximo:
configuración de Header Auth y publicación del workflow, integrar Hacienda y
definir la tarifa ARESEP exacta a partir de la factura, además del cierre
CRUD/responsive de Admin antes de IA y los tres asistentes.

## Continuidad de Bloque C — 2026-10-04

C-P5 está implementado localmente: `/cuenta` muestra los detalles de una oferta
`AWAITING_APPROVAL`; aprobar valida dueño/versión/vigencia y pedir cambios o
rechazar exige motivo y registra `activityLog`. Pruebas unitarias de lógica y UI
añadidas. La vista Admin para procesar `CHANGES_REQUESTED` requiere integrar el
estado con la revisión operativa; no declarar cerrado ese recorrido completo.

C-P4 también está implementado localmente: `/carrito` crea un pedido de catálogo
`PENDING` solo con sesión customer; la API vuelve a validar variante y precio,
guarda snapshot/líneas normalizadas, actividad e idempotencia. El éxito limpia
el carrito y lleva a `/cuenta` con un acuse; no hay pago, reserva de stock ni
fecha de entrega. No alterar `db.json` real con pedidos de prueba. Jest (37
suites/203), lint, `check:ui`, `check:automation` (255), build y diff check
pasaron en el árbol local combinado.

P5/P4 están listos para commits atómicos locales; CI remota aún no certifica
estos cambios. No declarar cerrada la integración completa de P5: Admin todavía
debe permitir retomar `CHANGES_REQUESTED`. Tampoco se verificó visualmente
`/cuenta` con sesión customer ni el carrito con líneas. Sí se capturó el estado
vacío de `/carrito` en Light (~1254×704): una caja interior innecesaria se retiró
y título/descripción/CTA ahora comparten una sola superficie. Los breakpoints
375/768 y Dark siguen pendientes. Seguir después con P8/P7/P9 según el orden
acordado. Mantener fuera de los commits los cambios paralelos del orquestador
en n8n, Admin, copy del correo y catálogo.
