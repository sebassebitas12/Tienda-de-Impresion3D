# Vértice CR — Negocio, entidades y estados

> Última actualización: **2026-10-06**.

> **Flujo vigente del MVP:** simulación académica con persistencia en JSON
> Server; no hay cobros reales. Las secciones antiguas de SINPE que contradigan
> el estado `DEMO` descrito aquí son historial de diseño reemplazado.

## Estado del catálogo de presentación (2026-10-05)

La semilla de presentación local conserva 25 fichas `ACTIVE` y sus imágenes;
`ACTIVE` significa visible en la demo, no que haya inventario, un producto
fabricado ni capacidad de entrega confirmada. Los precios de los 25 se marcan
`priceSource: 'DEMO'`: los seis registros iniciales no tienen fuente comercial
trazable y llevan `priceConfirmation: null`; p7–p25 conservan la procedencia de
benchmark ya guardada. Ningún monto de esta semilla debe presentarse como tarifa
vigente del taller.

En p7–p25, `aiProductionEstimate.source: 'DEMO'` y
`verifiedWithSlicer: false` identifican estimaciones analógicas sin laminar. En
p1–p6, `weightGrams` y `estimatedProductionHours` son valores heredados sin
evidencia de laminado asociada. Los campos heredados `stock` y `minStock` no son
inventario operativo y se ignoran para visibilidad y compra.

Las imágenes son referencias visuales de las fichas, no prueba fotográfica de
una pieza fabricada ni verificación de geometría, escala, resistencia o
imprimibilidad. La tienda identifica las imágenes como ilustrativas y precios
como referenciales; el checkout DEMO permite recorrer el proceso, no cobra ni
promete fabricación o entrega. La diferencia intencional de la base local de
casa frente a la semilla remota está en `products`; no se llevan
pedidos/solicitudes/runtime a este seed.

Las descripciones basadas únicamente en imagen expresan una intención de
prototipo, no una garantía de compatibilidad o desempeño. En especial, p12 no
está certificado para contacto alimentario, p13 no es un dispositivo médico,
p24 no está validado para vuelo y las escalas de p21/p25 no están verificadas.

El asistente de solicitud recibe texto, no imágenes/STL/OBJ. Los adjuntos se
guardan con la solicitud y quedan para revisión del Admin; el modelo no los
analiza ni mide en el flujo actual.

## Entidades

### Pago del pedido — flujo vigente (2026-10-05)

El carrito crea un pedido propio `PENDING`/`UNPAID` y abre el checkout en
`/carrito?orderId=...`; crear el pedido no significa haber pagado ni reservado
producción. Solo el cliente propietario puede continuar. La pantalla ofrece tres
modalidades de pago mutuamente excluyentes:

- **PayPal Sandbox:** el servidor crea y captura la orden contra el entorno de
  pruebas de PayPal. Antes de salir se muestra el total CRC, equivalente USD,
  tasa y fecha de actualización. Una captura completada se valida contra monto y
  moneda esperados; entonces el pedido pasa a `CONFIRMED`/`PAID` con evidencia
  Sandbox. Usa fondos de prueba: no es un cobro real.
- **Tarjeta por PayPal Sandbox:** usa los botones alojados por el SDK oficial y
  solo aparece como alternativa operativa si PayPal informa que la cuenta de
  prueba es elegible. Vértice no solicita ni almacena el número/CVV; si no es
  elegible, se explica y quedan PayPal/SINPE como opciones.
- **SINPE Móvil informado por el cliente:** se solicitan referencia, teléfono,
  imagen del comprobante y nota opcional. Esto no consulta BAC ni demuestra una
  transferencia. El taller debe revisar y confirmar manualmente para marcar
  `PAID`; si lo rechaza, el pedido sigue `PENDING` y el cliente puede corregir.

No se permite combinar/alternar métodos una vez iniciada una modalidad o enviado
un comprobante. Errores de proveedor o discrepancias de monto no muestran un
  recibo de éxito ni duplican captura. Las cotizaciones siguen un flujo distinto:
Admin envía la oferta, el cliente la aprueba en la app y solo entonces se crea
el pedido pendiente; el pago se completa en el carrito, no al aprobar ni desde
el detalle de pedido. La vigencia y versión aprobada se vuelven a validar.

Las dos confirmaciones crean un outbox de recibo en la misma persistencia del
pago y lo despachan después, sin mantener bloqueada la cola de operaciones.
Un acuse válido registra `SENT` y `messageId`; fallos inciertos quedan `UNKNOWN`
y no se reintentan automáticamente. El pago permanece registrado aunque falle
el correo. La integración está probada con HTTP/Gmail mock, no entrega real.
Admin envía la fecha del comprobante abierto: evidencia reemplazada devuelve
`PAYMENT_PROOF_OUTDATED`, sin cobrar ni enviar. El correo de oferta
mantiene su rama separada en Gmail/n8n; la publicación local del export tampoco
prueba por sí sola la instancia activa. No guardar secretos PayPal ni de Header
Auth en frontend/repositorio.

### Preservación de solicitud personalizada durante autenticación (E01, 2026-10-04)

El formulario de solicitud personalizada (`/solicitud`) guarda de forma reactiva el borrador en almacenamiento de sesión/local (`vertice.quote.draft`), incluyendo campos manuales, interpretaciones del asistente y nombres de archivos seleccionados. Si un visitante no autenticado redacta su solicitud y navega a `/login` o `/registro`, el estado `from` preserva la ruta con retorno transparente; al volver, el formulario restaura íntegramente los campos y despliega un aviso informativo que aclara que, por políticas de seguridad del navegador, los archivos binarios adjuntos deben seleccionarse nuevamente antes del envío.

### Reseñas y revisión de ofertas (2026-10-04)

Customer activo puede reseñar un producto existente: rating entero 1–5,
título 1–100 y comentario 10–2000 caracteres tras recortar espacios.
No exige compra verificada ni promete moderación. Autoría: nombre de la cuenta.
Admin atiende CHANGES_REQUESTED en la bandeja del taller, ve el motivo y guarda
una nueva oferta QUOTED con quoteVersion incrementada. quoteHistory conserva
las ofertas reemplazadas y el motivo. Solo el envío confirmado por el proveedor
vuelve a AWAITING_APPROVAL; guardar no envía ni aprueba.

users, products, categories, orders, orderItems, customPrintRequests, reviews, coupons, notifications, activityLog, settings.

## Solicitud personalizada

NO es un producto de catálogo.

Ciclo:
~~~text
PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID
                                             ├→ CHANGES_REQUESTED
                                             └→ REJECTED
~~~

Salidas: REJECTED, EXPIRED, CANCELLED.

Reglas:
- PENDING_QUOTE no tiene precio final.
- Solo `role: admin` puede iniciar `PENDING_QUOTE → IN_REVIEW`; el cambio y el evento con actor/fecha se registran juntos en `activityLog`.
- El rango de IA es orientativo.
- En el MVP actual, solo el admin emite la cotización final. Meta de producto indicada por el usuario: automatizar los casos FDM estándar y dejar intervención del taller para excepciones; ver condiciones y datos pendientes en `docs/07`. Esta meta no cambia el flujo operativo hasta implementar y validar el motor.
- Solo una cotización aprobada puede pagarse.
- El cliente solo puede decidir una cotización propia cuando la solicitud está `AWAITING_APPROVAL` y la versión coincide con la oferta enviada. Aprobar exige vigencia activa; pedir cambios o rechazar exige un motivo breve y registra actor, motivo, fecha y transición en `activityLog`.
- `CHANGES_REQUESTED` requiere una nueva revisión del taller. No crea un pedido ni aprueba la versión anterior; Admin debe emitir y enviar una oferta nueva para volver a `AWAITING_APPROVAL`.
- El pedido pagado conserva requestId.
- Solicitud y pedido son entidades relacionadas, no la misma entidad.

## Producto

Campos mínimos: id, name, slug, description, categoryId, images, price, currency, material, availableColors, dimensions, weightGrams, estimatedProductionHours, status, featured, createdAt, updatedAt.

### Fabricación de catálogo

- `material` usa uno de los filamentos disponibles: `ASA`, `PLA`, `PETG`, `ABS`, `TPU`.
- El proceso de producción vigente es `FDM`; no anunciar ni asignar `SLA` en fichas o UI.
- Los productos del catálogo se fabrican después de recibir el pedido; no se ofrecen como productos de entrega inmediata.
- No mostrar en el storefront etiquetas ni cantidades que indiquen existencias, disponibilidad inmediata o falta de existencias.
- `status` controla la publicación del producto en el catálogo; no representa disponibilidad física.
- Los campos heredados `stock` y `minStock` que aún aparezcan en datos demo no son fuente válida de disponibilidad y no deben determinar visibilidad, compra ni mensajes al cliente. Su eliminación del contrato/dataset requiere una migración explícita.

La bandeja Admin del catálogo consulta modelos y categorías y permite buscar y
filtrar por los valores de publicación/material presentes en el origen. CRUD de
catálogo: Admin puede crear/editar productos y categorías; los productos usan
`ACTIVE` (publicado), `INACTIVE` (oculto con ficha completa) y `DRAFT`
(incompleto y no visible en la tienda) como estados de publicación, nunca
disponibilidad. Un borrador puede tener `price: null` y `material: null`; no se
puede publicar hasta confirmar nombre, categoría, precio no negativo y un
filamento FDM vigente. PATCH modifica solo campos autorizados y no escribe campos de
inventario heredados. `images` existentes se conservan al editar y producto
nuevo inicia con `images: []`; carga/cambio de imágenes queda fuera hasta definir
almacenamiento. Una categoría no se elimina si tiene modelos asociados. Un
producto no se elimina definitivamente si aparece en `orderItems`; en ese caso
se oculta para conservar el historial. No se aplica cascada.

La capacidad vigente admite FDM con ASA, PLA, PETG, ABS y TPU. Si un registro
existente tiene otro material, Admin lo señala para revisión sin cambiarlo ni
ocultarlo silenciosamente.

Reglas:
- `price >= 0` para cualquier producto publicado; `null` solo se admite en `DRAFT`.
- el precio publicado corresponde al modelo de catálogo y no implica existencia física previa al pedido.

## Carrito híbrido

Producto:
~~~text
quantity × unitPrice = subtotal
~~~

Solicitud personalizada:
~~~text
subtotal = no definido mientras esté PENDING_QUOTE
~~~

Resumen:
- Total de productos.
- Solicitudes pendientes.
- Total a pagar ahora.

Nunca representar una solicitud pendiente como ₡0 ni como cantidad × precio.

## Pedidos

~~~text
PENDING → CONFIRMED → IN_PRODUCTION → READY → SHIPPED → DELIVERED
~~~

Alternativos: CANCELLED, REJECTED.

Admin permite avanzar una etapa por vez con `expectedStatus` y `expectedUpdatedAt`:
`PENDING → CONFIRMED → IN_PRODUCTION → READY → SHIPPED → DELIVERED`. Desde
`PENDING` o `CONFIRMED` se puede cerrar como `CANCELLED` o `REJECTED`, con motivo
obligatorio. Cada transición exige rol Admin, valida el estado/versionado y
registra `ORDER_STATUS_CHANGED` en `activityLog`. No se permite saltar etapas ni
alterar pedidos desde los asistentes. El total registrado sigue sin ser prueba
de pago; el modelo no tiene evidencia de cobro comercial automáticamente
confirmada. Contrato técnico en `docs/07`.

### Compra de productos de catálogo — C-P4 (2026-10-05)

`Pagar · DEMO` desde `/carrito` completa la compra simulada solo para una
sesión `customer`. El servidor valida producto publicado, variante y cantidad,
ignora precios enviados por el navegador y recalcula cada precio unitario,
subtotal y subtotal CRC con el catálogo vigente. Guarda el snapshot tanto en
`orders[].orderItems` como en `orderItems`, registra `CATALOG_ORDER_CREATED` y
usa una clave idempotente para que reintentar no duplique pedido ni pago. Marca
`CONFIRMED`/`PAID` con `paymentMode: 'DEMO'`, registra el evento de compra, limpia
el carrito y lleva directamente a `/pedidos/:id`. No valida ni reserva stock;
`pricingScope: CATALOG_SUBTOTAL_ONLY` indica que entrega e impuestos no están
incluidos. El recibo lo aclara y el taller coordina esos detalles aparte.

## Cotización

La entrada del cliente distingue **pieza/archivo existente** de **ayuda para
crear una pieza**. El primer camino entrega el archivo y datos técnicos al
taller; el segundo usa el chatbot para completar especificaciones. Ambos deben
crear/actualizar una solicitud `PENDING_QUOTE`, no saltar a precio final ni a
checkout. En este MVP Admin conserva la emisión de la cotización final; el bot
puede asistir, pero no decide ni envía un monto como oferta.

La calculadora de perfiles en `/solicitud` es una DEMO. No mide archivos ni debe
mandarse como cotización final. `/solicitud/archivo` ya acepta referencias y
adjuntos con sesión activa y confirmación, y crea `PENDING_QUOTE`; los bytes se
guardan en `.local-data` fuera de `db.json` con lectura autorizada. Esta solución
local no es almacenamiento de producción. Cotizar automáticamente un archivo
sigue requiriendo análisis/laminado verificable y costos calibrados. En la ruta
de ayuda de diseño, una acción explícita de revisión/envío crea el intake; la
conversación por sí sola no crea un encargo.

Conservar requestId, monto, moneda, vigencia, notas, tiempo estimado, fecha y admin emisor.
El Admin calcula el costo con datos técnicos por pieza y tarifas vigentes introducidos
por una persona; el cliente ve el monto total y alcance, no una tarifa inventada ni
un rango de IA. Guardar entradas, desglose, fecha de revisión de tarifas y versión
de fórmula como snapshot de esa cotización. Una actualización de tarifas futura no
cambia una oferta ya guardada.

Para el primer cálculo manual FDM: gramos y horas son por unidad; filamento y desgaste
se registran en USD/kg y se convierten a CRC con el tipo de cambio ingresado; la
electricidad se deriva de horas por pieza × potencia media (kW) × tarifa CRC/kWh;
postprocesado se escala por cantidad; diseño es por pedido; otros costos son un
monto por pedido. Un recargo explícito se aplica al
costo total y se distingue de margen bruto. El monto final se redondea a colones.
Costos no incluidos (por ejemplo impuestos, envío o comisiones) deben declararse en
condiciones o sumarse a “otros costos”; el cálculo no los presume incluidos.

### Envío de cotización

Una cotización guardada (`QUOTED`) se entrega desde Admin en un único correo: el
cliente es `To` y la dirección del administrador autenticado es `BCC` (el cliente
no ve la copia interna). Solo después de que el proveedor confirme la aceptación
del mensaje la solicitud avanza a `AWAITING_APPROVAL`; también se guarda fecha,
destinatarios y evento `REQUEST_QUOTE_EMAIL_SENT`. Una dirección incompleta o de
dominio reservado de ejemplo (`example.*`, `.test`, `.invalid`, `.localhost`)
bloquea el envío. Si el proveedor no está configurado/falla, la cotización sigue
en `QUOTED` para poder corregir configuración y reintentar. El envío de correo no
calcula ni modifica el precio.

**Decisión del usuario (2026-10-03):** el correo informa la cotización y lleva al
cliente a su cuenta; no aprueba la oferta por responder o pulsar una acción en el
email. La decisión vinculante se registra dentro de la app en la cotización
vigente. La aprobación debe confirmar al cliente y avisar al taller con una
instantánea de la solicitud y la cotización aceptada; mientras no exista pago
verificado, ese aviso no debe decir que el pedido está pagado ni que ya entró a
producción. Una vez exista un pedido, los cambios reales de etapa pueden generar
correos de avance al cliente. El aviso al taller y los correos de avance todavía
no están implementados. En C-P5, aprobación, rechazo y solicitud de cambios se
registran en `/cuenta`; el soporte de Admin para tomar/revisar solicitudes en
`CHANGES_REQUESTED` todavía requiere completar ese recorrido operativo.

## IA

Puede recomendar material, dimensiones, tiempo, rango indicativo y advertencias. Nunca autoriza el precio final.

Etiqueta obligatoria:
**ORIENTATIVO · SUJETO A VALIDACIÓN**

## Checkout

Productos: /checkout/productos.

Solicitud: /checkout/solicitud.

Una solicitud PENDING_QUOTE nunca llega al pago.


## HF-08 Checkout — reglas de negocio cerradas (2026-09-24)

El checkout no trata todos los elementos del carrito de la misma manera.

### Compra de productos de catálogo

Ruta conceptual: `/checkout/productos`

Puede contener:
- productos terminados;
- cantidad;
- precio unitario;
- subtotal;
- entrega;
- facturación;
- pago;
- confirmación.

El total es calculable porque son productos con precio definido.

### Pago de cotización personalizada

Ruta conceptual: `/checkout/solicitud`

Solo puede entrar una solicitud que:
- tenga estado `APPROVED`;
- tenga monto aprobado;
- conserve referencia al archivo/especificaciones;
- tenga condiciones/validez de la cotización.

No utiliza la lógica de `quantity × unitPrice`.

### Estados y excepciones

La interfaz debe contemplar como mínimo:
- cotización pendiente de aprobación;
- cotización aprobada;
- cotización caducada;
- cotización rechazada/cancelada;
- pago DEMO pendiente;
- pago DEMO completado con recibo;
- formulario incompleto;
- error de envío;
- confirmación exitosa.

Una solicitud `PENDING_QUOTE` nunca muestra CTA de pago.

Una solicitud `QUOTED` debe llevar primero a revisión/aprobación.

Una solicitud `APPROVED` puede llevar al pago de cotización.

El usuario debe saber en todo momento si está comprando un producto o pagando una cotización técnica.

## Cotización y fulfillment DEMO (actualizado 2026-10-05)

`src/utils/quoteAutomation.js` ofrece perfiles análogos para los modelos
conocidos. Gramos, horas, desgaste, energía y costos son **DEMO estimado**: no
provienen del STL, laminador, inventario físico ni lectura eléctrica. La fórmula
determinista guarda desglose, versión/fecha y validez; el snapshot no acredita
precio comercial ni fabricación. La cotización puede generarse desde Admin o
`/solicitud`; el cliente aprueba el alcance vigente desde `/cuenta`.

La etapa `PAID` con `paymentMode: 'DEMO'` es una simulación, no una verificación
bancaria. Una cotización aprobada todavía no crea orden: el cliente debe
registrar el pago desde su cuenta. Entonces se crea el pedido confirmado, con
snapshot del alcance libre escrito por Admin (sin exigir producto de catálogo),
y se muestra el recibo. La operación es idempotente. Los asistentes no ejecutan
mutaciones; el servidor aplica rol, propiedad, vigencia y versión.

## Intake de solicitud y cotizador de catálogo — 2026-10-03

El asistente de `/solicitud/ayuda-diseno` prepara un resumen editable; no es el
cotizador ni envía la solicitud por el cliente. Debe conservar medidas tal como
las expresa la persona, no repetir preguntas contestadas y permitir dejar datos
desconocidos vacíos. Después de revisar, una persona con sesión de cliente envía
el intake: el estado inicial es `PENDING_QUOTE`, sin monto, envío de correo ni
aprobación implícitos. Adjuntos y enlace de referencia explican el encargo; no
son mediciones de laminador.

La cotización de una pieza nueva del catálogo es un flujo distinto y pertenece
al formulario Admin del producto. El perfil análogo puede proponer un cálculo
DEMO, pero no mide una foto/STL ni conoce tarifas reales. El operador debe
revisar y confirmar antes de publicar. La meta vigente del usuario es retirar
la carga manual de datos técnicos mediante IA + herramientas; hoy esa
automatización multimodal todavía no existe y ningún precio se actualiza por
una respuesta de texto del bot.

En la ayuda de diseño, una orden explícita de preparar/enviar la solicitud
termina la entrevista y genera un borrador con los datos disponibles; los
campos opcionales desconocidos no bloquean el intake. «Flexible» puede guardarse
como preferencia TPU y «tamaño promedio» como descripción aproximada, nunca como
medidas inventadas ni garantía de seguridad. El cliente revisa, adjunta sus
referencias y confirma el envío.

**Ajuste de continuidad — 2026-10-03:** solo una instrucción reciente y
explícita puede iniciar la preparación. Una intención vieja no debe interceptar
una pregunta nueva; sí permite que el siguiente mensaje sin interrogación y con
detalles estructurados complete el borrador. La guía determinista del taller es
la única fuente para comparar materiales en la conversación: no se agregan
temperaturas, precios ni claims de seguridad que no estén en ella. Las
referencias adjuntas se guardan para la solicitud y el Admin puede consultarlas,
pero el agente actual recibe solo mensajes de texto: todavía no analiza las
imágenes ni extrae geometría de STL/OBJ. No afirmar lo contrario.

Para fichas del catálogo, el operador llega al cálculo DEMO desde «Cotizar DEMO»
en la lista de modelos. El resultado no se considera precio confirmado hasta
que el operador lo revise y lo guarde explícitamente.

En el formulario de producto, Admin puede pedir al agente general una propuesta
de ficha usando únicamente el nombre escrito. La respuesta incluye descripción,
material y colores sugeridos, además de gramos/horas muy aproximados; no consulta
stock, no mide la pieza, no propone precio ni publica/guarda por sí sola. El
operador revisa y edita cada campo. Antes de usar peso/horas estimados en el
calculador debe contrastarlos con el laminador; el perfil análogo DEMO continúa
siendo una alternativa explícita distinta.

### Aislamiento del carrito por identidad

El carrito es persistencia local del navegador, no un carrito remoto ni un
pedido. La clave de visitante (`vertice-cart-v2:guest`) se separa de la clave
por usuario (`vertice-cart-v2:user:<id>`), por lo que cerrar sesión no mezcla
selecciones entre cuentas. Entrar o registrarse desde `/carrito` como cliente
incorpora explícitamente las líneas del visitante a su carrito, combinando
variantes iguales; iniciar sesión desde otro punto no transfiere esa selección.
El carrito global anterior se migra únicamente como carrito de visitante porque
no existe dato fiable para atribuirlo a una cuenta. Admin también tiene un
espacio aislado y no recibe líneas de cliente. Los cambios se sincronizan entre
pestañas del mismo navegador; no sincronizan dispositivos ni sustituyen el
pedido confirmado en la API.
