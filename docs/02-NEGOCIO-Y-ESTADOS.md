# Vértice CR — Negocio, entidades y estados

> Última actualización: **2026-10-01**.

## Entidades

users, products, categories, orders, orderItems, customPrintRequests, reviews, coupons, notifications, activityLog, settings.

## Solicitud personalizada

NO es un producto de catálogo.

Ciclo:
~~~text
PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID
~~~

Salidas: REJECTED, EXPIRED, CANCELLED.

Reglas:
- PENDING_QUOTE no tiene precio final.
- Solo `role: admin` puede iniciar `PENDING_QUOTE → IN_REVIEW`; el cambio y el evento con actor/fecha se registran juntos en `activityLog`.
- El rango de IA es orientativo.
- En el MVP actual, solo el admin emite la cotización final. Meta de producto indicada por el usuario: automatizar los casos FDM estándar y dejar intervención del taller para excepciones; ver condiciones y datos pendientes en `docs/07`. Esta meta no cambia el flujo operativo hasta implementar y validar el motor.
- Solo una cotización aprobada puede pagarse.
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

La pantalla Admin de pedidos actual es de lectura. Presenta los estados, líneas
de `orderItems`, datos de cliente y montos registrados sin convertir `total` en
prueba de pago. No ofrecer cambios de estado hasta acordar los permisos,
transiciones terminales/alternativas y su escritura auditada.

## Cotización

La entrada del cliente distingue **pieza/archivo existente** de **ayuda para
crear una pieza**. El primer camino entrega el archivo y datos técnicos al
taller; el segundo usa el chatbot para completar especificaciones. Ambos deben
crear/actualizar una solicitud `PENDING_QUOTE`, no saltar a precio final ni a
checkout. En este MVP Admin conserva la emisión de la cotización final; el bot
puede asistir, pero no decide ni envía un monto como oferta.

La calculadora de perfiles en `/solicitud` es una DEMO. No mide archivos ni debe
mandarse como cotización final. Antes de una automatización real por archivo se
requiere almacenamiento privado, lectura/laminado STL/OBJ y costos calibrados.
La ruta del chatbot necesita una acción confirmada para guardar los requisitos
como solicitud; su conversación por sí sola no crea un encargo.

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
- pago pendiente de validación;
- comprobante SINPE inválido;
- formulario incompleto;
- error de envío;
- confirmación exitosa.

Una solicitud `PENDING_QUOTE` nunca muestra CTA de pago.

Una solicitud `QUOTED` debe llevar primero a revisión/aprobación.

Una solicitud `APPROVED` puede llevar al pago de cotización.

El usuario debe saber en todo momento si está comprando un producto o pagando una cotización técnica.

## Cotización y fulfillment DEMO (2026-10-02)

`src/utils/quoteAutomation.js` ofrece perfiles análogos para los modelos
conocidos. Gramos, horas, desgaste, energía y costos son **DEMO estimado**: no
provienen del STL, laminador, inventario físico ni lectura eléctrica. La fórmula
determinista guarda desglose, versión/fecha y validez; el snapshot no acredita
precio comercial ni fabricación. La cotización puede generarse desde Admin o
`/solicitud`; el cliente aprueba el alcance vigente desde `/cuenta`.

La etapa `PAID` de esta entrega solo representa una verificación manual o un
registro `DEMO` rotulado. DEMO crea un pedido `PENDING` con snapshot de alcance y
referencia `SIMULATED-NO-REAL-PAYMENT`; no acredita SINPE, no mueve dinero ni
inicia producción. Idempotencia de solicitud→pedido evita duplicar el encargo en
reintentos. Los asistentes no ejecutan mutaciones; herramientas de cotización
calculan y el servidor aplica roles al invocarlas.
