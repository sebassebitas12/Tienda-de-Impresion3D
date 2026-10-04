# Vértice CR — Métricas, Admin e IA operativa

> Última actualización: **2026-10-03**.

## Cierre del handoff A — 2026-10-03

- Alta/edición de producto permite escoger una de 26 imágenes existentes, buscar por nombre, ver portada y quitarla. Se conservan imágenes secundarias; seleccionar una foto no publica ni asigna precio/material.
- Nuevos productos: DRAFT, precio/material vacíos hasta confirmación. Se conserva el guard de publicación; las 19 fichas originales no se completan automáticamente con datos inferidos.
- Bajas: diálogo Vértice con nombre del registro, Cancelar como foco inicial, Escape y retorno de foco. Modelos referenciados por pedidos y categorías utilizadas no se eliminan. La referencia URL de una categoría nueva se genera desde el nombre completo; una referencia manual no se sobrescribe.
- Recorrido real: crear/editar/publicar/ocultar/eliminar un producto QA; crear/editar/eliminar categoría QA; cancelar y confirmar modal de borrado; guard de historial y de categoría usada. Registros temporales retirados; db.json no cambia respecto del corte inicial.
- Responsive y temas: resumen/pedidos adaptan filas en móvil sin ocultar cliente/etapa/total ni cantidad/unitario/subtotal; steps muestran las seis etapas; referencias de cotización pasan a dos columnas legibles en tablet. Historial de Clientes muestra estados conocidos en lenguaje humano ES/EN, con fallback para un valor desconocido.
- Alcance: Admin local académico, no integración n8n real ni Activity cerrada. La portada de p2 no existe en disco; queda pendiente obtener/asignar la foto correcta. No publicar borradores solo por tener imagen.

## Principio

Admin debe ayudar a decidir y actuar diariamente, no demostrar cantidad de widgets.

## KPIs principales

1. Ventas cobradas en el período.
2. Pedidos activos.
3. Solicitudes pendientes de revisión/cotización.

## Gráficas

- ventas por día/semana;
- pedidos por estado;
- solicitudes por estado;
- productos más vendidos.

## Panel operativo

- pedidos que requieren atención;
- solicitudes pendientes;
- actividad reciente si existe activityLog.

## Filtro

Periodo global: hoy, 7 días, 30 días y rango personalizado cuando corresponda.

## Fórmulas

Ventas = suma de importes efectivamente cobrados dentro del período.

Pedidos activos = pedidos que no están en estados terminales.

Pendientes = solicitudes en estados que requieren acción administrativa.

Más vendidos = cantidades de orderItems asociadas a pedidos válidos según la regla de datos definitiva.

## Resumen operativo IA

Módulo compacto: **Resumen operativo IA**.

Entrada: métricas ya calculadas.

Puede sintetizar:
- alertas;
- cuellos de botella;
- solicitudes atrasadas;
- tendencias observables.

Reglas:
- nunca inventar números;
- no inventar causas;
- mostrar periodo;
- separar dato de interpretación;
- permitir ver los datos origen;
- si no hay datos suficientes, decirlo.

La IA no modifica datos ni sustituye KPIs.

## Usuario

Priorizar pedidos activos, cotizaciones pendientes, solicitudes en revisión, archivos, historial y contacto/facturación.

No usar LTV, churn, saldo SINPE u otros indicadores sin fuente y significado real.

## Funciones puras

calculateDashboardMetrics(data, period) sin React, HTTP ni efectos secundarios.

## Criterio

Una gráfica entra al MVP solo si ayuda a detectar un problema, comparar evolución o ejecutar una acción.


## Integración del resumen IA con N8N

El módulo **Resumen operativo IA** puede implementarse mediante un Webhook de N8N consumido desde React.

Flujo:
1. Dashboard calcula KPIs y datos de origen.
2. React solicita `mode: "admin_summary"`.
3. N8N recibe período + métricas.
4. AI Agent resume únicamente la información recibida/consultada mediante herramientas autorizadas.
5. React muestra la respuesta en un módulo compacto.

Reglas del resumen:
- nunca reemplaza los KPI;
- nunca inventa cifras;
- debe indicar el período;
- distingue datos de interpretación;
- debe permitir volver a los datos origen;
- ante información insuficiente, declara la limitación.

El chatbot general puede usar el mismo patrón con `mode: "chat"`; ambos casos siguen siendo capacidades distintas aunque compartan workflow/infraestructura.

## Admin — primer dashboard React (2026-10-01)

El dashboard inicial lee `orders`, `customPrintRequests` y `users` mediante un service de solo lectura contra JSON Server. Muestra pedidos activos usando los estados no terminales conocidos; cuenta para revisión únicamente solicitudes `PENDING_QUOTE`/`IN_REVIEW`; el estado legacy `SUBMITTED` se reporta como dato fuera del flujo y queda excluido hasta una decisión/migración explícita.

El conjunto demo actual no incluye entidad `payments`, `paidAt` ni comprobantes de cobro que permitan demostrar pago. La métrica de ventas cobradas debe mostrar “Sin datos de cobros”, nunca sumar automáticamente los totales de pedidos como ingreso efectivo. `activityLog` inicia vacío; el evento de inicio de revisión tiene contrato en `docs/07`. `/admin/actividad` presenta eventos existentes o un estado vacío, nunca actividad de ejemplo. Desde el detalle se puede consultar el historial filtrado por solicitud.

El `activityLog` del dataset inicia vacío; las acciones administrativas pueden
añadir eventos con fuente y actor identificables. La pantalla los muestra en
orden cronológico inverso y permite filtrar por solicitud; el vacío indica que
todavía no hay acciones guardadas. No usar `stock`/`minStock` en el dashboard ni
inferir disponibilidad material de piezas: el catálogo se fabrica bajo pedido.

### Clientes Admin — lectura e historial (2026-10-02)

`/admin/clientes` lista únicamente cuentas `role: customer`; permite buscar por
nombre, correo o ID y enlaza a una ficha de solo lectura. La ficha relaciona
pedidos y solicitudes por `userId` y lleva a sus vistas de detalle. No expone
`demoPassword`, no permite editar/eliminar cuentas y no inventa teléfono,
dirección, facturación, gasto total ni estado de pagos. Si esos campos se
incorporan al modelo, deberán tener propósito y permisos documentados.

Los tres asistentes (público, Admin y cotización) ya tienen puntos de entrada
separados en React y contratos de rol en `docs/07`. El export n8n debe conservar
un AI Agent nativo independiente para cada uno; compartir solo modelo y
credencial no significa fusionar los agentes. Mientras no se configure el
webhook/proveedor real, React conserva el fallback local etiquetado como demo.

### Referencia de contenido para el tablero

Las capturas aportadas por el usuario (2026-10-01) muestran tipos útiles de
contenido para un dashboard: resumen de etapas, registros recientes y actividad.
Se adapta esa jerarquía a los datos del taller: pedidos por estado, solicitudes
que requieren atención y un historial trazable. No se incorporan visitas,
ingresos ni tendencias porque el modelo no tiene esas fuentes. La dirección de
color, tipografía y superficies sigue siendo la de Vértice, no la plantilla
mostrada en las capturas.

### Historial de actividad Admin

La ruta `/admin/actividad` consulta exclusivamente `activityLog`, ordena por
`occurredAt` descendente y reconoce la acción `REQUEST_REVIEW_STARTED`. El evento
abre el detalle de solicitud relacionado. Desde el detalle se ofrece
`/admin/actividad?solicitud=<id>`; el filtro se aplica sobre los eventos ya
leídos, acorde con el JSON Server académico actual. `db.json` todavía no contiene
eventos, por lo que la UI expone un estado vacío en vez de poblar actividad falsa.

### Identidad y entrada al dashboard

El shell Admin mantiene una navegación de tareas distinta al navbar comercial, pero comparte tokens, tipografía y estados de Vértice. La sesión autenticada identifica al operador en la barra lateral. El feedback de selección se aplica a navegación real; filas tabulares y solicitudes no deben parecer botones si aún no tienen una acción implementada. No sumar métricas decorativas ni datos de inventario.

Desde el navbar público, «Mi cuenta» dirige a `/admin` para `role === admin` y a `/cuenta` para clientes; para invitados dirige a `/login`. Los guards conservan la ruta solicitada durante el login y la redirección por defecto usa el rol. Contrato de flujo completo en `docs/03-UX-Y-FLUJOS.md`.

### Admin — bandeja y detalle de solicitudes React (2026-10-01)

La ruta `/admin/solicitudes` lee solicitudes y usuarios desde JSON Server. La
bandeja agrupa el ciclo oficial en cuatro preguntas operativas: ¿requiere acción
del taller? (`PENDING_QUOTE`, `IN_REVIEW`), ¿espera al cliente? (`QUOTED`,
`AWAITING_APPROVAL`), ¿está aprobada/pagada? (`APPROVED`, `PAID`) o ¿cerró?
(`REJECTED`, `EXPIRED`, `CANCELLED`). El filtro de cada etapa conserva su estado
en `?fase=`; búsqueda por id, cliente, archivo, material y descripción refina el
conjunto. `Todas` lista únicamente estados del flujo oficial; legacy se abre por
separado y no altera el conteo de resultados del flujo. Desde el KPI del dashboard, `Solicitudes por revisar` abre la
etapa del taller; filas abren `/admin/solicitudes/:id`.

El SVG circular resume proporciones de solicitudes reconocidas y su leyenda filtra
la bandeja. No suma `SUBMITTED` ni otros estados desconocidos; estos se muestran
aparte con su valor real. La gráfica no afirma tendencias ni volumen suficiente
para proyecciones. Si el conjunto oficial está vacío, se omite el anillo. El
detalle presenta cliente/origen/material/cantidad/fecha y progreso solo para el
ciclo conocido; precio se muestra solo con `quotedPrice` CRC real y nunca para
`PENDING_QUOTE`/`IN_REVIEW`. `fileName` es metadato, no enlace de descarga. Ver
contrato de lectura y límites de escritura en `docs/07-DATOS-API-AUTH.md`.

El resumen Admin conserva sus métricas como señales abiertas, sin contenedores
gemelos; ahora se agrupan sobre una única superficie cálida con radio amplio del
token Vértice, mientras cada cifra conserva jerarquía abierta. El anillo y su
lista se separan por aire en vez de encerrar cada etapa en una mini tarjeta. Sus
cifras principales tienen escala moderada. El anillo solo muestra la distribución
actual observada, no una tendencia.

### Admin de pedidos

El registro cuenta los datos presentes, agrupa `PENDING` a `SHIPPED` como en
proceso, `DELIVERED` como entregado y `CANCELLED`/`REJECTED` como cierres. Otros
estados se conservan y aíslan bajo “Estado no reconocido”, con una explicación
de que el valor recibido no coincide con las etapas configuradas. Búsqueda abarca ID, nombre/correo
de cliente y nombre/material de pieza. El detalle muestra solo datos enlazados
desde `orders`, `orderItems`, `products` y `users`; los montos son registrados,
no indicadores de pago. No se añadió una acción de cambio de etapa porque falta
un contrato de transición y auditabilidad.

La ficha permite iniciar revisión únicamente desde `PENDING_QUOTE`. La acción
valida estado esperado y actor Admin, transiciona a `IN_REVIEW` y agrega el evento
en una sola escritura del API académico. El resultado y los errores se anuncian;
la ficha actualiza el estado y muestra quién inició la revisión. Desde `IN_REVIEW`,
Admin puede calcular y guardar una cotización manual con snapshot auditado (ver
“Cotización manual desde la ficha de solicitud” abajo); aún no ejecuta laminado ni
consulta tarifas en vivo. La ruta global de actividad muestra eventos desde
`activityLog` y permite filtrarlos por solicitud.

#### Referencias de movimiento y datos

- **Motion — [Layout animations for React](https://motion.dev/docs/react-layout-animations):** transición compartida que sigue selección y cambios de distribución; adaptación: un indicador recorre la leyenda accionable hasta el grupo activo y la lista entra en una secuencia corta al filtrar. No se añadió Motion; CSS usa `transform`/`opacity` y respeta movimiento reducido.
- **Apache ECharts — [Data Transition](https://echarts.apache.org/handbook/en/how-to/animation/transition/) y [Basic Pie Chart](https://echarts.apache.org/handbook/en/how-to/chart-types/pie/basic-pie/):** segmentos expresan proporción sobre un total y cambian cuando lo hacen los datos; adaptación: anillo SVG con cuatro grupos mutuamente excluyentes y leyenda accionable que filtra exactamente la bandeja. No se instaló ECharts porque el conjunto pequeño, estático y de cuatro valores no necesita una dependencia completa.
- **Codrops — [Hover Motion Intro](https://tympanus.net/codrops/2024/05/29/hover-motion-intro-animation/):** el movimiento hace legible la selección de un elemento dentro de una composición; adaptación Admin: franja de selección, acento lateral y avance al detalle mediante hover/foco. Se descartaron GSAP, la inclinación de puntero y el zoom de imagen porque son efectos de showcase y no aportan lectura operativa.

El anillo resume distribución del conjunto actual, no constituye una métrica temporal ni un pronóstico. Todos los grupos muestran cantidades además de color y tienen controles de filtro por teclado. `prefers-reduced-motion` y el ajuste global eliminan entradas/transiciones.

### Contrato de operación y archivo (2026-10-01)

Las métricas KPI del dashboard dejan de ser tres tarjetas idénticas: presentan
un carril abierto de señales. La cifra de solicitudes conserva enlace real a la
bandeja; solo esa columna lleva regla de acento y respuesta en hover/foco. Los
pedidos activos y cobros sin datos no adquieren affordance engañosa. El patrón
usa tipografía de señal y reglas del sistema Vértice; no clona Stitch ni suma una
gráfica a datos que no la justifican.

La transición `PENDING_QUOTE → IN_REVIEW` y el evento
`REQUEST_REVIEW_STARTED` se guardan juntos por el endpoint académico definido
en `docs/07`. El contrato de almacenamiento conserva metadatos opacos y requiere
descarga temporal autorizada, pero el proveedor de archivos sigue pendiente;
`fileName` no da acceso a bytes. La ruta global de actividad, otras transiciones
y cotización siguen como siguientes slices.

### Replanteamiento visual del dashboard — R-H50 (2026-10-01)

La primera corrección del usuario indicó que el dashboard seguía pareciendo una
plantilla Stitch incluso después de quitar el marco a los KPIs. La causa estaba
en el resto de la composición: paneles simétricos con borde/fondo, encabezados
enmarcados, tabla dentro de tarjeta y tarjeta de solicitudes del mismo peso.

`/admin` ahora se compone como tablero de flujo del taller: franja de KPI abierta;
anillo SVG con proporciones calculadas sobre todos los pedidos activos por etapa;
leyenda textual con cantidad, registro reciente semántico y una cola de
solicitudes con hover/foco que conduce al detalle real. El aviso de estados
legacy es una nota editorial abierta. Sin pagos se conserva “Sin datos de
cobros”. No se usan inventarios, máximos, periodo ni pronósticos.

**Fuente → patrón → adaptación → razón:** [Impeccable](https://github.com/pbakaus/impeccable): evitar cajas idénticas/anidadas → composiciones de distinta densidad → cada región responde a una tarea concreta. [taste-skill](https://github.com/senlindesign/taste-skill): expresar trade-offs de tokens → Lava reservado al enlace accionable y etapas con señal semántica → identidad sin colorear todo. [Emil Kowalski / skills](https://github.com/emilkowalski/skills): movimiento según intención y física adecuada → entrada corta del anillo/filas, anulada por movimiento reducido → feedback sin showcase. No se copiaron interfaces ni código y no se instaló nada específico de Claude o dependencias.

El conjunto completo del dashboard se revisa en `docs/05`, R-H50. Home y
`mockups/hf-01-home-definitivo.html` no se modifican.

### Fondo y orientación visual del dashboard — R-H55

El resumen conserva sus métricas y distribución. El lienzo usa capas ambientales
de token y una retícula técnica tenue; la sección de etapas recibe una
geometría grabada propia y la cola de solicitudes un resplandor localizado. La
textura no representa mediciones, máximos ni valores adicionales. Contraste
alto la retira. Detalle de referencia y auditoría visual en `docs/04` R-H55 y
`docs/05` R-H55.

### Bandeja operativa de catálogo — 2026-10-01

El catálogo Admin prioriza la tarea de localizar una pieza: búsqueda por texto,
filtros derivados de los estados/materiales que realmente llegan de JSON Server,
y ficha con categoría, precio publicado y especificaciones de origen. Filas con
imagen ayudan a reconocer el modelo, y el patrón abierto comparte tokens/radios
Vértice sin convertir cada dato en una tarjeta. La ficha recuerda que se produce
bajo pedido. No se muestran cifras de inventario, no se cambia publicación y no
se habilita edición hasta que existan reglas, endpoint transaccional y storage.
Los registros con un material no admitido por la capacidad actual se hacen
visibles para revisión, en lugar de borrarlos u ocultarlos.

### Aviso de registros heredados en Resumen — 2026-10-02

El dashboard separa los estados fuera del flujo oficial y no los incluye en las
métricas ni los convierte automáticamente. Para el fixture `SUBMITTED`, la UI
explica que es una etiqueta del formato anterior, enlaza a la ficha de la
solicitud y señala que desde allí se puede registrar como `PENDING_QUOTE` si la
revisión confirma que corresponde. La existencia del dato por sí sola no
autoriza una conversión ni permite inferir equivalencia de negocio.

### Cotización manual desde la ficha de solicitud (2026-10-02)

La cotización dejó de solicitar un monto final aislado. Admin introduce mediciones
del laminador y costos/tasas reales, ve un desglose antes de guardar, y guarda/publica
solo la cifra calculada y persistida. La aritmética corre de nuevo en el servidor
JSON académico; la solicitud conserva parámetros, desglose, fecha de tarifas y
versión de reglas. Es preparación manual asistida, no conexión de DeepSeek, BCCR,
ARESEP o un laminador.

La tarifa eléctrica corresponde a la distribuidora/servicio del taller y se verifica
por factura o tarifa oficial aplicable; el tipo BCCR venta es un campo independiente
para los costos USD/kg. No hay tarifas maestras ni actualización automática. La UI
advierte que impuestos, envío y costos no incluidos siguen fuera del total si no se
agregan explícitamente.

### Entrega de cotización por correo — 2026-10-02

El action de envío confirmado registra `REQUEST_QUOTE_EMAIL_SENT` en
`activityLog`, con solicitud, actor, estados y fecha. No crea métricas de venta,
pago ni ingresos. Sin confirmación del webhook, la solicitud queda `QUOTED` y no
se registra envío.

La aprobación pertenece a la app, no al correo. Tras aprobar el cliente, el
comportamiento deseado es enviarle confirmación y notificar al taller con el
alcance aprobado, indicando si todavía falta pago. Los avances se enviarán al
cliente solo a partir de cambios de etapa de un pedido persistidos y deduplicados.
Esto aún no existe en n8n ni en Admin; el correo de prueba `UNKNOWN` no se reintenta
hasta verificarlo junto con el usuario y usar la cuenta de prueba de cliente que
él defina.

## Flujo Admin funcional y tres bots (2026-10-02)

Admin puede cotizar automáticamente perfiles conocidos desde imágenes públicas;
el número es DEMO, se muestra con desglose y la aprobación es una acción separada
del cliente. Email (cliente + copia oculta al taller) requiere Gmail confirmado.
Después de `APPROVED`, fulfillment ofrece registro simulado rotulado o cobro
verificado manualmente; no existe pago real ni cobro automático en esta entrega.
Pedido guarda snapshot de pieza/alcance y cambia por una etapa permitida por vez.

Herramientas: TP general (buscar catálogo publicado, guía de materiales, explicar
proceso); bot Admin (resumen, solicitudes, pedidos, calidad de catálogo, guía
Admin, materiales, perfiles/cálculo DEMO, detalle autorizado); bot cotizador
(perfiles/cálculo DEMO, materiales, proceso y detalle del dueño). La ejecución de
tools ocurre detrás del API después de comprobar la sesión/rol; n8n/DeepSeek
redacta la respuesta y no modifica estados ni dispara emails.

El indicador de ventas cobradas conserva `null` si no existe evidencia. Totales
del pedido, cotizaciones DEMO, aprobaciones e intenciones de pago no se suman
como ingreso confirmado.

## Contrato de fuente del workflow y evidencia operativa — 2026-10-03

El export unificado tiene una sola fuente oficial:
`automation/n8n/vertice-cr-unificado.json`. El generador escribe ahí y el
empaquetador crea el ZIP de importación desde ese archivo y su README. Se retiró
la segunda copia JSON de `automation/vertice-n8n-import/n8n/`; el verificador
comprueba que no vuelva a aparecer. Los nodos HTTP Tool mantienen
`@n8n/n8n-nodes-langchain.toolHttpRequest` v1.1, compatible con la instancia
local según la comprobación comunicada por el usuario.

Esa compatibilidad no prueba por sí sola credenciales, Agents ni herramientas.
El 2026-10-03 la instancia n8n local mostró el workflow publicado y una llamada
desde la UI alcanzó DeepSeek, pero el proveedor rechazó la API key vinculada como
inválida antes de responder o invocar tools. Hacienda respondió en la prueba de
tasas y ARESEP devolvió el conjunto público; sin datos exactos del servicio del
taller no hubo coincidencia tarifaria, que es el resultado esperado. Gmail OAuth
aparece conectado, lo que no demuestra entrega.

Se intentó una única prueba de correo DEMO dirigida solo a la cuenta controlada
del usuario. La app no recibió confirmación y guardó `quoteDeliveries.status`
como `UNKNOWN`, sin `messageId`; Gmail no mostró el correo por la búsqueda del
asunto de prueba y n8n no presentó una ejecución nueva de correo al revisar el
historial. No repetir: el estado podría representar entrega incierta. Para
reconciliarlo, revisar Sent de Gmail y el historial de ejecuciones de n8n antes
de cualquier reintento. Nunca enviar al cliente demo `ana@example.com`.

Activity se verifica con un evento operativo legítimo, nunca con filas sembradas
para que la pantalla parezca poblada.

### Prueba live y estado del correo — 2026-10-03

La app registra el estado `UNKNOWN` como protección contra duplicados cuando el
webhook o su acuse se interrumpen después de que pudo ocurrir un envío. Para esta
prueba no se vio el `messageId` ni se encontró el mensaje en Gmail, así que el
resultado no se declara éxito ni fracaso definitivo. No volver a pulsar ni
reprocesar ese `deliveryKey` hasta reconciliarlo manualmente.

La revisión local de Activity del 2026-10-03 leyó tres eventos ya persistidos
desde JSON Server y confirmó su presentación/enlace en Admin (Light, 1280×720).
No se insertaron filas QA. La matriz visual versionada de `docs/05` no incluye
una captura adicional de Activity.

### Estado actual de asistentes y correo — 2026-10-03

El workflow publicado usa OpenRouter en los tres Agents. Desde la UI pública se
comprobaron respuesta normal, consulta autorizada de `material_guide` para PETG
y rechazo de una instrucción de revelar datos internos. El rol de cotización ya
tenía esas tres pruebas reales en sus ejecuciones #22–24. Una invocación general
con argumentos de comparación no admitidos fue rechazada por el validador como
`TOOL_ARGUMENTS_INVALID`; la llamada válida posterior sí tuvo salida del
dispatcher. El Admin UI todavía no supera la guarda del servidor (`ROLE_REQUIRED`),
así que el Agent Admin no se ha probado desde React en este corte.

La vista Admin fallida estaba en `127.0.0.1:5174`, distinta del origen público
`localhost:5173`; sus sesiones de `localStorage` no se comparten. La causa del
rechazo no está determinada y no se debe eludir la guarda. También se retiró el
fallback silencioso a `DEMO_RULES`: el backend diferencia n8n caído, timeout y
respuesta inválida. Jest prueba los códigos, los mensajes accesibles de
`AssistantPanel` y HTTP simulado; falta observar esos fallos en navegador real.

Los estados loading sí se observaron durante consultas. Error de proveedor
caído, timeout y JSON inválido permanecen pendientes de recorrido real de UI;
los tests locales no sustituyen esas pruebas. Hacienda y ARESEP respondieron en
ejecuciones de tasas anteriores, sin tarifa exacta para el taller. B2 sigue
`UNKNOWN`: la búsqueda reciente en Enviados para asuntos `DEMO`/`PRUEBA` no halló
coincidencia y no se identificó una ejecución de correo; no reenviar hasta
reconciliar Gmail/n8n. El modelo externo no convierte una estimación DEMO en
precio real del taller.

## Tres asistentes por contexto y precio de ficha — 2026-10-03

El asistente público, el copiloto Admin y la ayuda de cotización tienen prompts,
tools y permisos distintos y comparten OpenRouter como proveedor. El copiloto
Admin vive en una ruta/página del Admin, solo lectura; no reutiliza el drawer de
Home. `ROLE_REQUIRED` significa que la API rechazó la sesión y debe permanecer
bloqueado; la UI ofrece reautenticación en el mismo origen sin cambiar guardas.

La ayuda de cotización ya no estima ni guarda una cotización desde el diálogo.
Devuelve un `requestDraft` limitado por esquema; el usuario edita/revisa campos
y manda un intake `PENDING_QUOTE` con adjuntos. El agente tiene cuatro
iteraciones máximas (hasta tres llamadas temporales y una respuesta final) y
herramientas únicamente de guía de material/proceso; no tiene permisos de
cálculo, catálogo Admin o envío. Un tope agotado se expone como error
`ASSISTANT_ITERATION_LIMIT`, no como texto de respuesta al cliente.

El editor de producto Admin añade un calculador separado de precio de catálogo.
Recibe peso/horas explícitos o análogos marcados DEMO, material y postproceso;
no deduce los datos de imágenes. Aplica el monto al borrador, conserva desglose y
exige confirmación antes de publicar una sugerencia DEMO.

OpenRouter es el único proveedor de modelo elegido; no se requiere una clave de
DeepSeek. El copiloto Admin vive en `/admin/asistente`, separado del widget
público. Un `ROLE_REQUIRED` conserva el guard y pide reautenticarse en el mismo
origen; la página de chat no elimina la autorización.

### Regresión UX/lógica observada en navegador — R-H72, 2026-10-03

Enter sí entregó dos instrucciones locales de preparación al intake: la primera
armó el resumen sin llamar n8n; la siguiente completó largo/ancho/cantidad/
material en campos. Se corrigió la contaminación del nombre de pieza por la
frase «para revisarlo». La prueba live de orientación comparativa continuó
usando el runtime antiguo y agotó iteraciones, por lo que no se considera
resuelta en la instancia activa. El API local ahora clasifica esa frase de error
y sirve orientación determinista desde la guía del taller; falta reiniciar el
proceso API y repetir en navegador.

El copiloto Admin permanece diseñado como página autónoma fuera del shell
público. En esta sesión el guard redirigió a login antes de poder capturarla; no
se relajó rol ni se reutilizó el chat flotante. «Cotizar DEMO» se añadió a cada
fila del Catálogo como acceso directo a su calculador. Ni la página del copiloto
ni ese CTA fueron visualmente inspeccionados en una sesión Admin en este corte.
OpenRouter es el único proveedor elegido; no configurar DeepSeek.

Verificación local del corte: lint, Jest (31 suites/177 tests), `check:ui`,
`check:automation` (248 comprobaciones), `build:n8n`, build y `git diff --check`
pasan. El build mantiene aviso de chunk >500 kB. En el cotizador se comprobó a
un viewport de ~1265×710 que Enter actualiza el resumen y las medidas no envían
la solicitud; no equivale a una matriz responsive ni prueba el render de la
respuesta de materiales con el API actualizado. La página Admin sigue pendiente
de captura con sesión válida: su separación respecto del chat Home está
confirmada en rutas/componentes, no en una auditoría visual autenticada.
