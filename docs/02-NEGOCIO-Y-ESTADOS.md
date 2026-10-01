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
- Solo el admin emite la cotización final.
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
`ACTIVE` (publicado) y `INACTIVE` (oculto) como estados de publicación, nunca
disponibilidad. PATCH modifica solo campos autorizados y no escribe campos de
inventario heredados. `images` existentes se conservan al editar y producto
nuevo inicia con `images: []`; carga/cambio de imágenes queda fuera hasta definir
almacenamiento. Una categoría no se elimina si tiene modelos asociados. Un
producto no se elimina definitivamente si aparece en `orderItems`; en ese caso
se oculta para conservar el historial. No se aplica cascada.

La capacidad vigente admite FDM con ASA, PLA, PETG, ABS y TPU. Si un registro
existente tiene otro material, Admin lo señala para revisión sin cambiarlo ni
ocultarlo silenciosamente.

Reglas:
- price >= 0.
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

Conservar requestId, monto, moneda, vigencia, notas, tiempo estimado, fecha y admin emisor.

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
