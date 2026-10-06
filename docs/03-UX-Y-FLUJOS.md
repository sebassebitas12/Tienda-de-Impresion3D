# Vértice CR — UX, navegación y estados

## Cotización conversacional y continuidad — 2026-10-05

Visitante puede preparar su idea con IA; antes de enviar ve acceso explícito a
login con retorno al borrador. En navegador se comprobó conservación de uso,
medidas, material, cantidad y diseño tras login. Envío evita doble clic. Éxito
oculta composer y muestra revisión→oferta→aprobación en Cuenta→checkout común
del carrito. Chat fallido ofrece reintentar la misma pregunta, sin duplicarla
en el hilo. El workflow de correo de oferta tuvo una ejecución fallida antes de
Gmail; su corrección local aún requiere importación/publicación y evidencia live.

## R-H85 — Recorridos visitante/cliente/Admin (2026-10-05)

El detalle de pedido no es una pasarela: ofrece volver/continuar al checkout
central en `/carrito?orderId=...`. El pedido sigue `PENDING` hasta una captura
PayPal Sandbox validada o una confirmación manual del comprobante SINPE. Los
pedidos vinculados a cotización solo se crean después de aprobar la oferta en
Cuenta y llevan al mismo checkout.

### Revisión de coherencia actual (2026-10-05)

El catálogo se puede explorar sin cuenta. Para agregar piezas y abrir el carrito
se requiere sesión customer; login conserva el destino de retorno. El pedido solo
se crea tras autenticar. El carrito crea `PENDING`/`UNPAID`, y el cliente elige
PayPal Sandbox o reporta SINPE para revisión manual. Una cotización personalizada
no depende del catálogo: Admin registra y envía monto/alcance, el cliente
aprueba en la app y continúa al checkout común. Admin no paga por el cliente,
pero sí revisa comprobantes SINPE. Búsqueda y filtros del catálogo se conservan
al abrir la ficha y volver. La rama de correo de pago se dispara después de las
confirmaciones; su acuse está probado con proveedor mock, no con Gmail real.

Las rutas FAQ, Materiales, Requisitos, Términos, Privacidad y Envíos tienen
contenido ES/EN con límites académicos y acciones hacia flujos reales. Las rutas
heredadas `/checkout/productos` y `/checkout/solicitud` redirigen al carrito y a
las cotizaciones de cuenta, respectivamente; no exponen checkout vacío. El
detalle `/pedidos/:id` requiere rol `customer` y lee `/orders/mine`, por lo que
solo presenta pedidos que devuelve el servicio del usuario. Admin que abre
`/cuenta` recibe una derivación clara a Administración; Perfil se declara de
consulta, no de edición.

PayPal Sandbox usa fondos de prueba; no es un cobro real. Reportar SINPE tampoco
confirma una transferencia: Admin revisa datos e imagen antes de marcar el pago.
Una integración bancaria real queda fuera del alcance.
El acceso de visitante queda en el control «Mi espacio» del navbar; su nombre
accesible ahora anuncia el destino y el panel ofrece Iniciar sesión/Crear cuenta.
No se duplica un CTA de login que compita con Cotizar en el header.

Admin puede confirmar o rechazar el comprobante SINPE reportado; el rechazo deja
el pedido pendiente para que el cliente corrija. No hay validación bancaria ni
análisis automático del comprobante con IA.

La ficha Admin conserva la publicación de cotizaciones por el flujo n8n/Gmail
dirigida al correo de la cuenta customer y con copia al taller. El export local
incluye una rama para recibo de pago, pero la app aún no la invoca ni se ha
confirmado entrega. No reintentar un correo con estado `UNKNOWN` sin reconciliarlo.

R-H83: Contacto deriva a rutas ejecutables según pieza/idea/seguimiento; la
redacción evita insinuar un equipo grande y asigna al admin su propia acción.

R-H81: titular del carrito sin insignia técnica de sesión. Cuenta prioriza
piezas del pedido antes de pago. Verificación del pago y comienzo de producción
son pasos separados. Nombre histórico manda; si falta, se puede mostrar el
nombre vigente identificado como referencia del catálogo actual.

R-H80: catálogo filtra por categoría real además de material; ficha usa solo
muestras de color (teclado por flechas), galería y acceso a modificaciones por
solicitud. QUOTED/CHANGES_REQUESTED explican el siguiente paso sin habilitar
acciones impropias. Correo lleva a cuenta para decisión; el acuse no equivale
a aprobación/pago. Versiones importadas y render Gmail requieren verificación.

## Recorrido carrito y pago — revisión vigente (2026-10-05)

La compra de catálogo exige sesión y crea `PENDING`/`UNPAID`; el checkout ofrece
PayPal Sandbox o SINPE manual. Un fallo conserva el pedido y permite retomarlo
desde carrito/detalle. Solo captura Sandbox coincidente o verificación Admin
SINPE puede moverlo a `CONFIRMED`/`PAID`. Para una cotización, la aprobación en
`/cuenta` precede la creación del pedido y redirige al mismo checkout. La vista
distingue fondos de prueba y comprobante revisado. Entrega e impuestos no
confirmados siguen pendientes; el correo posterior al pago ya integra el
outbox con API/n8n. Falta comprobar entrega Gmail en vivo.

> Última actualización: **2026-10-05**.

## Rutas públicas

/, /catalogo, /producto/:id, /solicitud, /solicitud/archivo, /solicitud/ayuda-diseno, /checkout/productos, /checkout/solicitud, /registro, /nosotros, /contacto.

`/carrito` y `/pedidos/:id` requieren una sesión con rol `customer`; `/cuenta`
requiere sesión autenticada y también puede orientar a Admin hacia su panel.
Admin y visitantes no pueden abrir carrito ni detalle de pedido; el guard envía
al visitante a login con el destino preservado.

## Rutas administrativas

/admin, /admin/pedidos, /admin/pedidos/:id, /admin/solicitudes, /admin/solicitudes/:id, /admin/catalogo, /admin/catalogo/:id, /admin/catalogo/nuevo, /admin/catalogo/:id/editar, /admin/catalogo/categorias, /admin/clientes, /admin/clientes/:id, /admin/actividad.

## Flujos

### Compra
Home → Catálogo → Producto → (visitante: login/registro → volver al producto) → Carrito customer → Pagar · DEMO → `/pedidos/:id` (recibo) → seguimiento.

### Personalizada con archivo
Solicitud → Archivo → Requisitos → Revisión → Pendiente de cotización → Admin define alcance/monto → Cuenta → Cliente aprueba → Pago · DEMO → Pedido/recibo.

### Personalizada sin archivo
Solicitud → Ayuda de diseño → Descripción → Requisitos → Revisión → Pendiente de cotización → Cuenta → Cotización.

### Dos intenciones del cotizador — decisión del usuario (2026-10-02)

La entrada `/solicitud` ahora presenta dos caminos explícitos y no los mezcla:

1. **Ya tengo la pieza/archivo:** el cliente solicita revisión técnica de su
   STL/OBJ para cotizarlo. Esta ruta debe entregar el archivo al taller; no debe
   convertirse en una conversación de diseño.
2. **Quiero ayuda para definirla:** el chatbot parte de lo que la persona ya
   sabe y organiza sus mensajes en un resumen de solicitud. Uso, dimensiones,
   material y cantidad pueden quedar sin definir; no se debe bloquear a quien
   solo sabe nombrar la pieza y explicar para qué la necesita. El asistente no
   fija el precio final ni inicia producción.

La implementación React muestra ambas opciones y separa la ruta de ayuda
(`/solicitud/ayuda-diseno`) del intake de archivo (`/solicitud/archivo`). En la
ruta de archivo el cliente puede adjuntar hasta cinco imágenes PNG/JPG/WebP/GIF
o archivos STL/OBJ de hasta 5 MiB cada uno; dimensiones, uso, material deseado
y cantidad son opcionales. En medidas, la unidad seleccionada (mm/cm/in) se
aplica a números sin unidad; unidades escritas explícitamente se respetan. El
campo vacío es válido, pero texto ilegible, cero o unidades no admitidas bloquean
el envío tanto en UI como en API. Con sesión de cliente y confirmación explícita,
crea una solicitud `PENDING_QUOTE`, no un pedido ni un precio. Admin puede leer
los adjuntos solo con acceso autorizado; no se laminan ni se miden
automáticamente. El agente recibe texto, no los bytes de las fotos/STL/OBJ; por
ahora esas referencias se conservan para revisión del taller. El asistente general está disponible en esta ruta;
el chat flotante se oculta únicamente en `/solicitud/ayuda-diseno`, que tiene su
asistente de cotización integrado.

El asistente de cotización responde al flujo real y, ante la petición de preparar
la solicitud, devuelve un resumen estructurado editable a partir de los mensajes.
La persona lo revisa, agrega referencias y confirma el envío. La ruta no exige
que conozca medidas o material para una idea como «solo un brazo robótico para
una simulación de banda transportadora». La cotización económica y la decisión
de fabricación continúan sujetas a revisión del taller. La calculadora de
perfiles sigue rotulada DEMO y no envía montos como oferta.

El compositor compartido de los tres asistentes envía con `Enter`; `Shift+Enter`
inserta una nueva línea. El botón de envío permanece disponible como alternativa
de puntero y táctil.

### Recorrido de compra de una pieza personalizada

1. Cliente elige archivo existente o ayuda para definir una pieza.
2. El archivo o los requisitos llegan como **solicitud pendiente**, nunca como
   pedido listo para pagar.
3. El taller revisa geometría, uso, material, cantidad y costos; Admin guarda
   la cotización final.
4. Admin envía la cotización al cliente con un enlace para verla en su cuenta y
   copia oculta al taller. Solo la confirmación de entrega del proveedor avanza
   a `AWAITING_APPROVAL`; recibir el correo no equivale a aceptar.
5. Desde `/cuenta`, el cliente puede aprobar la versión vigente o solicitar
   cambios/rechazar con un motivo. La app registra la decisión; responder el
   correo no aprueba nada. Admin puede leer el motivo y preparar una versión
   nueva. La app no debe permitir aprobar una versión vencida o desactualizada.
6. Tras la aprobación, el cliente completa el pago DEMO desde su cuenta; recién
   entonces se crea el pedido y su recibo. Admin registra después las etapas del
   taller. El email actual entrega la cotización inicial; las notificaciones
   automáticas de aprobación/cambios y los avisos de cada avance por correo no
   están implementados, aunque la app conserva estado/historial.

Hoy están implementados el intake conversacional/de archivo, la propuesta
económica DEMO revisada por Admin, el email de cotización inicial, la decisión
del cliente en la app y el pago DEMO que crea un pedido. Siguen pendientes el
análisis de imágenes/archivos por IA, el procesamiento/laminado real, el pago
real y los correos transaccionales de aprobación y avance. Una cifra DEMO no es
un precio real ni una promesa de fabricación/entrega.

### Páginas institucionales y contexto de sesión — 2026-10-04

`/nosotros` explica el alcance del taller, el recorrido de una pieza de catálogo
y una solicitud personalizada, y diferencia las estimaciones iniciales de una
cotización confirmada. `/contacto` funciona como enrutador de ayuda: archivo o
referencias → `/solicitud/archivo`; idea por desarrollar → `/solicitud/ayuda-diseno`;
seguimiento → `/cuenta` para cliente, `/admin` para Admin y `/login` para
visitante con retorno a su cuenta. Desde Contacto se puede abrir el asistente
general ya presente en el chrome público. No se publica un correo ni se afirma
un canal directo hasta contar con autorización y un destino confirmado. La página
explica qué recibe el taller, qué no ocurre al enviar y cómo se sigue la decisión;
no simula una bandeja de contacto ni muestra una dirección sin buzón. Un correo
corporativo real requiere dominio/buzón configurado fuera de la app. Si se necesita
contacto general por mensaje, queda pendiente implementar un formulario conectado
a un destino interno confirmado; las solicitudes de fabricación existentes no se
deben disfrazar como consultas generales.

La selección del visitante puede prepararse localmente desde una ficha de
producto, pero no se muestra ni se abre el carrito hasta iniciar sesión como
cliente. El aviso de agregado ofrece login/registro y explica que la selección
queda guardada en ese navegador. Al volver a `/carrito`, la sesión customer
combina explícitamente esa selección con su carrito de cuenta. El icono del
navbar solo aparece para clientes autenticados; Admin no compra desde ese
chrome. El cambio de cuenta o logout no debe mostrar a otra persona las líneas
anteriores. Esto es persistencia local, no sincronización entre dispositivos ni
un pedido real.

### Admin
Login → Dashboard → bandeja → detalle → acción → actividad.

**Pedidos:** Dashboard → `/admin/pedidos` → filtro por grupo/etapa o búsqueda →
`/admin/pedidos/:id`. La ficha relaciona cliente, piezas (`orderItems`), estado,
fechas y montos de origen. En este slice es de consulta: no permite mutar el
estado ni marca pagos. Las etapas futuras requieren confirmar la transición y
actor antes de sumar acciones.

**Actividad:** `/admin/actividad` muestra eventos guardados en `activityLog`; el
detalle de solicitud puede abrir el historial filtrado con `?solicitud=<id>`.

**Catálogo:** `/admin/catalogo` lista modelos de `products` enriquecidos con la
categoría, con búsqueda y filtros por publicación/material. El formulario de
producto permite subir hasta seis fotos comprimidas, elegir la portada y ordenar
la galería; la primera imagen es la que se muestra en listas y fichas. También
conserva la biblioteca local del taller como fuente alternativa. Cada fila abre
`/admin/catalogo/:id`, desde donde se edita el modelo. `/admin/catalogo/nuevo`
crea, `/admin/catalogo/:id/editar` actualiza y `/admin/catalogo/categorias`
gestiona las categorías. `ACTIVE` publica y `INACTIVE` oculta; un modelo ligado
a pedido se oculta, no se borra. La galería vive en el `db.json` académico y no
es almacenamiento de producción. El material
fuera de ASA/PLA/PETG/ABS/TPU se señala para revisión.

**Slice actual de solicitudes:** `/admin` ofrece acceso directo al KPI de
solicitudes que requieren atención (`/admin/solicitudes?fase=workshop`). La
bandeja admite filtros de etapa/búsqueda y cada fila lleva a
`/admin/solicitudes/:id`. En una solicitud `PENDING_QUOTE`, Admin puede iniciar
revisión técnica; el mismo comando cambia a `IN_REVIEW` y registra actor/fecha en
`activityLog`. Estado desactualizado o rol inválido se rechazan. El intake guarda
metadatos en JSON Server y bytes fuera de `db.json`; Admin autorizado puede
consultarlos desde el almacenamiento privado local. El
registro `SUBMITTED` y estados desconocidos se revisan aparte sin recodificarlos.

En `IN_REVIEW`, el operador prepara y guarda el costeo/cotización. En `QUOTED`,
Admin muestra el correo del cliente y el correo del administrador autenticado, y
ofrece **Enviar al cliente y copiarme**. Un único correo va al cliente y lleva
copia oculta al taller; un envío confirmado por n8n cambia el estado a
`AWAITING_APPROVAL` y registra la entrega en actividad. Si no hay proveedor,
fallan las direcciones o n8n no confirma, la cotización permanece `QUOTED` y la
interfaz explica el motivo. Las direcciones de ejemplo no se aceptan como reales.
En la interfaz se identifican como **Estado no reconocido**; la explicación
indica que el origen lo conserva, que no pertenece a las etapas vigentes y que
queda separado de sus métricas.

### Entrada a cuenta según rol

- Invitado: `Navbar → Mi cuenta → /login`.
- Cliente autenticado: `Navbar → Mi cuenta → /cuenta`.
- Admin autenticado: `Navbar → Panel de administración → /admin`.
- Si un visitante llega a una ruta protegida, el guard conserva la ruta de origen en el estado de navegación; tras el login vuelve a esa ruta. Sin ruta de origen, el admin entra a `/admin` y el cliente a `/cuenta`.
- Logout del menú público o del shell Admin limpia la sesión y devuelve a Home. La ruta `/admin/*` sigue protegida por rol.

## Estados globales

Toda pantalla dependiente de datos contempla:
- loading;
- success;
- empty;
- error;
- validation;
- processing;
- disabled;
- focus;
- reduced motion.

## Upload

Idle, drag-over, processing, success, invalid format, oversized, error, remove/replace.

## Checkout

Producto: Datos → Entrega → Revisión → Confirmación.

Solicitud: Datos → Entrega → Revisión → Enviar solicitud.

La solicitud no muestra CTA de pago hasta tener cotización aprobada.

## Ayuda accesible

El producto tendrá un mecanismo de ayuda consistente. Puede ofrecer explicación escrita, instrucciones visuales, alternativas textuales para multimedia y contacto humano.

WCAG 2.2 incorpora Consistent Help (3.2.6) y requisitos sobre texto alternativo, contraste y uso de color. 

## Responsive

375px móvil, 768px tablet, 1280px+ desktop.

Requisito de la Home en móvil (auditoría visual 2026-09-29, V-02 en `docs/05`): en 375 px el producto debe verse en la primera pantalla; la composición móvil se reinterpreta, no apila la de desktop.

Mobile/tablet se mockupearán después de cerrar desktop, pero la estructura debe soportarlos desde el inicio.

## Regla

La interfaz nunca representa una capacidad técnica que backend/datos no puedan sostener.


## Navbar y footer: regla global

### Navbar público

HF-01 congelado define el lenguaje visual del navbar público. Stitch informa únicamente el inventario funcional, rutas y contenido; no define estilo, geometría ni chrome. No se reemplaza por otro concepto visual durante esta fase. Solo se permiten ajustes de:
- labels y rutas reales;
- estado autenticado/no autenticado;
- acceso a cuenta/carrito;
- accesibilidad, foco y teclado;
- Dark/Light;
- pequeños refinamientos de spacing, iconografía o responsive.

En HF-01 se conserva un único disparador de tres barras y no se muestra un botón de persona separado. El usuario rechazó el panel desplegable actual y pidió quitarlo; hasta que se defina su siguiente comportamiento, no tratar el contenido actual del panel como aprobado. El navbar central conserva `Inicio`, `Tienda`, `Sobre nosotros` y `Contáctenos` hasta el breakpoint responsive de `820px`.

No se debe reconstruir el navbar desde cero salvo que una prueba real de usabilidad demuestre un problema.

### Navegación administrativa

Los dashboards y pantallas `/admin/*` usan navegación administrativa propia y orientada a tareas. No necesitan copiar el navbar comercial del cliente ni sus CTAs de compra.

### Footer público

El **footer completo de marca** aplica a páginas públicas/cliente donde la navegación comercial y el contenido institucional tienen sentido: Home, Catálogo, Producto, Solicitud, FAQ, About, Contacto y páginas públicas equivalentes.

### Footer en dashboards

El footer comercial completo **no es obligatorio en dashboards**. En `/admin/*` la prioridad es densidad informativa, operaciones y foco; puede existir un footer técnico compacto (versión, soporte, privacidad, accesibilidad) o no existir cuando la interfaz no lo necesite.

En `/cuenta` y pantallas autenticadas orientadas al cliente puede usarse un footer compacto si no interfiere con pedidos, cotizaciones y acciones principales.

### Regla de los mockups

Que los mockups de Stitch/UXMagic muestren footer en todas las pantallas **no obliga a implementarlo literalmente en todas las rutas**. El mockup es referencia visual; la implementación respeta el contexto de cada área.

### Clave de consistencia

El usuario debe sentir que público, cuenta y admin pertenecen a Vértice CR mediante:
- misma identidad Obsidian + Lava;
- mismos tokens y estados;
- tipografía coherente;
- componentes compartidos;
- navegación específica por contexto.

La consistencia no significa que todas las áreas tengan exactamente la misma densidad ni el mismo chrome.


## HF-08 Checkout — propuesta histórica, reemplazada (2026-09-24)

El diseño de formularios separados de datos/entrega/SINPE descrito a
continuación no corresponde al MVP vigente. El flujo actual usa pago DEMO
directo y recibo; se conserva este título como referencia de diseño anterior.

### Checkout de productos

`/carrito → /checkout/productos → Datos → Entrega → Pago → Revisión → Confirmación → /pedidos/:id`

### Checkout de cotización

`/carrito → /checkout/solicitud → Resumen técnico → Datos → Entrega → Pago → Revisión → Confirmación → /pedidos/:id`

### Regla visual

Los recorridos mantienen contexto visual explícito sobre catálogo o cotización,
pero no muestran un formulario de facturación, entrega o SINPE.

### Navbar/footer

Mantener el navbar público derivado de HF-01 con ajustes mínimos. En checkout puede simplificarse únicamente si mejora el foco sin perder navegación, identidad o accesibilidad. Footer comercial completo no es necesario; puede usarse uno técnico compacto. Stitch solo orienta estructura y contenido.

### Estados de pago anteriores

- idle;
- form invalid;
- processing;
- esperando comprobante;
- comprobante recibido;
- validando;
- pago confirmado;
- error;
- cotización caducada/no disponible.

### Mobile posterior

375px: bloques del checkout en secuencia vertical, resumen colapsable/sticky y CTA accesible.

768px: una columna principal con resumen debajo o panel colapsable.

## Auditoría de experiencia de compra — 2026-10-01

### Hallazgo de estado actual

La Home separa modelos de catálogo fabricados bajo pedido de piezas propias que requieren revisión y cotización. El catálogo público, ficha y carrito ya tienen una base funcional para explorar modelos, seleccionar color/cantidad y conservar la selección local; checkout aún no está conectado. El flujo de solicitud personalizada, cuenta y pedidos del cliente conserva páginas pendientes. En Admin existen dashboard, solicitudes con preparación/publicación de cotización, actividad, lectura de pedidos, CRUD de catálogo/categorías y lectura de clientes con historial asociado. Los datos académicos y el token simulado no son controles de seguridad de producción. Login y registro tienen páginas propias.

### Recorrido recomendado

1. **Home:** ofrecer dos decisiones inequívocas: explorar modelos fabricados bajo pedido o enviar un archivo propio para revisión. Explicar que los modelos no son de entrega inmediata.
2. **Catálogo:** permitir explorar por uso/tipo de pieza y filtrar por materiales confirmados —ASA, PLA, PETG, ABS y TPU— y FDM. No mostrar inventario, “disponible” ni entrega inmediata.
3. **Ficha:** priorizar fotos reales cuando existan, uso previsto, material y variantes confirmadas; mostrar precio de catálogo solo si el contrato de datos lo respalda. La ruta personalizada explica revisión y cotización, sin presentar precio final.
4. **Carrito y encargo de catálogo:** conservar producto/color/cantidad y resumen editable. “Confirmar encargo” registra un pedido `PENDING` con precios recalculados por servidor y lleva a `/cuenta`; no es pago ni confirma envío, stock o fecha. Esas condiciones siguen pendientes hasta que el taller las confirme.
5. **Solicitud personalizada:** explicar requisitos antes de cargar; dar feedback de formato/progreso/error y permitir revisar lo enviado. Confirmar recepción y siguiente paso. `PENDING_QUOTE` no muestra precio final ni CTA de pago.
6. **Después del envío/encargo:** confirmar qué ocurrió y cuál es el paso siguiente; dar acceso al estado del pedido/cotización y ayuda humana. El encargo de catálogo aún no tiene pago, entrega ni fecha confirmados.

La incertidumbre se resuelve con estados vacíos, errores y una explicación clara, no con información ficticia. Fuente de checkout: [Baymard, costos de envío en páginas de producto](https://baymard.com/research-articles/show-shipping-costs-on-product-pages). Patrón: aclarar temprano los costos que determinan el total; adaptación: Vértice los mostrará antes del checkout solo cuando tenga condiciones confirmadas.

### Decisión del cliente sobre una cotización — C-P5 (2026-10-04)

En `/cuenta`, `AWAITING_APPROVAL` muestra monto, vigencia, notas y desglose de
la versión enviada. El cliente puede aprobar (solo si sigue vigente), o elegir
“Solicitar cambios”/“Rechazar” con motivo obligatorio. La cuenta propia y la
versión son validadas por el servidor; la respuesta no se ejecuta desde el email.

### Encargo desde el carrito — C-P4 (2026-10-04)

La página y el acceso del navbar requieren una cuenta `customer`; visitantes son
llevados a login/registro y vuelven a la ficha del producto. El CTA aparece
cuando las líneas son válidas. El servidor recalcula el subtotal y registra
pago DEMO; el éxito limpia el carrito y navega al recibo. Si el API falla, el
carrito se conserva para corregir o reintentar. El recibo explica que no hubo
cobro real y que entrega/impuestos siguen por coordinar.

### Tipografía de chrome global

La auditoría del instructor encontró textos ilegibles por defecto, en especial navbar y footer. El shell React sube navegación pública a 14 px en escritorio y 13 px en tablet; copy/enlaces del footer a 14 px y títulos/metadata secundaria a 12 px. Revisar a escala 100% y 150/200%, además de conservar las explicaciones en lenguaje natural y no reemplazarlas por etiquetas técnicas pequeñas. En viewport estrecho deben conservarse idioma y menú para cualquier visitante; el acceso al carrito solo aparece con sesión customer. El buscador puede vivir en el menú cuando no quepa como control de primer nivel.

**Actualización R-H46 (2026-10-01; supersedida en R-H48):** navbar/CTA a 16/15 px, footer a 16 px y colapso de navegación a 1000 px se revirtieron cuando el usuario aclaró que la captura se observó con zoom al 75%. Se restaura la primera iteración R-H45: navbar 14/13 px, CTA 13/12 px, idioma 12 px, footer 14 px con secundarios a 12 px y menú a partir de 820 px. La revisión de otros breakpoints y escalas sigue pendiente.

## Solicitud/cotización DEMO y asistentes por contexto (2026-10-02)

`/solicitud` deja a cualquier visitante calcular una estimación desde un perfil
análogo. La cuenta customer la puede guardar, consultar en `/cuenta` y aprobar
por versión vigente. Admin también puede generar la simulación y enviarla al
cliente con copia al taller; solo respuesta Gmail confirmada registra envío.
Errores y direcciones no entregables no se presentan como éxito.

TP vive en el shell público; el asistente operativo aparece en Admin, y la
orientación de cotización en `/solicitud`. Cada uno usa prompt y herramientas
permitidas del backend. No se mezclan cuentas, no se autoriza al modelo a cambiar
estados y el monto sale del motor reproducible.

La conexión técnica mantiene esos tres puntos de entrada: el botón flotante
público manda `mode: general`, Admin muestra su botón solo dentro de la ruta
protegida y manda `mode: admin`, y el botón de `/solicitud` manda `mode: quote`.
Cada webhook llega a su propio AI Agent nativo en n8n, con prompt y herramienta
HTTP aislados. Comparten OpenRouter como proveedor, no la identidad ni las
herramientas disponibles. La selección vigente del usuario excluye DeepSeek.

## Corrección de recorridos y referencias — 2026-10-02

Las cuatro anotaciones del usuario se aplican como reglas de recorrido: /solicitud solo elige intención; /archivo tiene requisitos y comunica recepción pendiente sin mezclar un estimador de otra pieza; /ayuda-diseno integra la conversación en la página, sin modal. La simulación opcional tiene referencias visuales buscables y ninguna preseleccionada. Admin comparte ese selector. Home enlaza directamente al camino de archivo y no promete una carga disponible. No sustituir una función ausente por un enlace a Contacto, que sigue en construcción. Pendiente: recepción/medición del archivo y envío transaccional del brief a Admin.

## Cotización como preparación de solicitud — 2026-10-03

El flujo actual ofrece dos caminos: enviar modelo/fotos/referencias o describir
una idea con ayuda del asistente. En el segundo, el chat vive dentro de la ruta y
completa un formulario de revisión; no comparte el drawer del asistente general,
no estima precio y no envía hasta que el cliente confirme el resumen. Un mismo
formulario permite adjuntar imágenes y STL/OBJ, dar dimensiones/unidades,
material/cantidad/uso, pedir diseño y agregar referencia HTTPS. La solicitud
recibida queda identificada como pendiente de cotización.

El asistente Admin es una pantalla completa bajo `/admin/asistente`, no una
ventana flotante ni el bot de Home. Es de consulta/orientación y no ejecuta
mutaciones. Si el backend devuelve `ROLE_REQUIRED`, la UI lo explica, ofrece
volver a iniciar sesión y conserva la guarda: el diseño no oculta ni resuelve
por sí mismo un rechazo de sesión.

Cuando la ayuda de cotización recibe un `requestDraft`, muestra «Revisar el
resumen y adjuntar referencias». El control desplaza y enfoca el título del
formulario para que el cliente llegue directamente a editar la ficha, subir
imágenes/modelos y enviar; respeta movimiento reducido.

La orden explícita de preparar/enviar detiene las preguntas opcionales. “Tamaño
promedio” permanece como aproximación textual, y “largo 15, ancho 3” conserva
ambos ejes exactamente como fueron declarados; el asistente no lo convierte en
diámetro ni interpola límites. Si la conversación devuelve un límite de
iteraciones de n8n, la UI debe anunciar fallo recuperable y mantener el resumen,
no presentar el texto técnico como respuesta normal.

### R-H72 — Mensajería e intake de cotización — 2026-10-03

Una intención antigua de preparar no debe interceptar una pregunta nueva. La
misma intención sí permite que el siguiente mensaje sin interrogación y con
detalles estructurados complete el borrador. La respuesta confirma que no se
envió nada. Las respuestas del asistente presentan párrafos, énfasis y listas
como contenido legible, no como asteriscos Markdown literales.

El camino Admin es `/admin/asistente`, una página con composición, navegación y
alcance propios, fuera de `PublicLayout` y del widget flotante. Ante
`ROLE_REQUIRED` permanece en esa superficie, explica el rechazo y solo cierra
sesión si el operador elige volver a autenticarse; no elimina la protección por
rol. El Catálogo Admin ofrece «Cotizar DEMO» en cada ficha y lleva al calculador
de esa pieza. Sigue siendo una sugerencia local: no mide imágenes ni cambia un
precio publicado por sí sola. La validación estática y los tests pasaron; la
inspección visual del copiloto requiere una sesión Admin en el mismo origen.
