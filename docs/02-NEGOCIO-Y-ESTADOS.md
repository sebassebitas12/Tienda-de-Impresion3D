# Vértice CR — Negocio, entidades y estados

> Última actualización: **2026-09-24**.

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
- El rango de IA es orientativo.
- Solo el admin emite la cotización final.
- Solo una cotización aprobada puede pagarse.
- El pedido pagado conserva requestId.
- Solicitud y pedido son entidades relacionadas, no la misma entidad.

## Producto

Campos mínimos: id, name, slug, description, categoryId, images, price, currency, material, availableColors, dimensions, weightGrams, stock, minStock, estimatedProductionHours, status, featured, createdAt, updatedAt.

Reglas:
- price >= 0.
- stock >= 0.
- minStock define alerta.
- Sin stock puede seguir visible, pero no se vende.

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
