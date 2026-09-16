# Lógica de negocio — Tienda de Impresión 3D

## 1. Principio

La interfaz representa decisiones del negocio, no las inventa. Las reglas que afectan precios, estados, stock, pedidos, solicitudes y métricas deben estar centralizadas y ser reutilizables.

## 2. Entidades principales

```text
users
products
categories
orders
orderItems
customPrintRequests
reviews
coupons
notifications
activityLog
settings
```

Relaciones principales:

```text
users ───────────────┬── orders
                    ├── customPrintRequests
                    └── reviews

products ────────────┬── orderItems
                     └── reviews

orders ──────────────── orderItems
products ─────────────── categories
```

## 3. Producto

Un producto comercial debe tener como mínimo:

- id
- name
- slug
- description
- categoryId
- images
- price
- currency
- material
- availableColors
- dimensions
- weightGrams
- stock
- minStock
- estimatedProductionHours
- status
- featured
- createdAt
- updatedAt

### Reglas

- `price` debe ser mayor o igual a cero.
- `stock` nunca puede ser negativo.
- Un producto `ACTIVE` puede venderse si existe stock suficiente.
- Un producto sin stock permanece visible, pero no permite agregar nuevas unidades.
- `minStock` define el umbral de alerta de inventario.

## 4. Carrito

El carrito puede contener dos tipos de elementos:

```text
PRODUCT
QUOTE_REQUEST
```

### Producto

```text
quantity × unitPrice = subtotal
```

La cantidad no puede superar el stock disponible.

### Solicitud personalizada

No tiene subtotal definitivo mientras esté pendiente de cotización.

```text
subtotal = no definido
status = PENDING_QUOTE
```

## 5. Pedido de catálogo

Estados:

```text
PENDING
→ CONFIRMED
→ IN_PRODUCTION
→ READY
→ SHIPPED
→ DELIVERED
```

Estados alternativos:

```text
CANCELLED
REJECTED
```

### Reglas de transición

- `PENDING` → `CONFIRMED`: pedido validado.
- `CONFIRMED` → `IN_PRODUCTION`: producción iniciada.
- `IN_PRODUCTION` → `READY`: fabricación terminada.
- `READY` → `SHIPPED`: entregado al operador logístico.
- `SHIPPED` → `DELIVERED`: recibido.
- Un pedido cancelado no vuelve a un estado operativo sin intervención administrativa explícita.

## 6. Solicitud personalizada

Estados:

```text
DRAFT
→ SUBMITTED
→ IN_REVIEW
→ QUOTED
→ APPROVED
→ IN_PRODUCTION
→ READY
→ COMPLETED
```

Alternativos:

```text
REJECTED
CANCELLED
```

### Regla económica

Hasta `QUOTED`, el precio es desconocido para el cliente.

Después de `QUOTED`, la cotización puede almacenar:

- quotedPrice
- currency
- quoteValidUntil
- quotedAt

Solo una solicitud `APPROVED` puede convertirse en una orden de producción.

## 7. Cotización personalizada

El precio debe considerar, cuando la operación lo permita:

```text
material
+ consumo estimado
+ tiempo de máquina
+ complejidad
+ cantidad
+ postprocesado
+ entrega
- descuentos
= precio cotizado
```

En la primera implementación, estos factores pueden permanecer como datos administrativos y no como cálculo geométrico automático. No se debe simular una precisión inexistente.

## 8. Inventario

### Venta

Al confirmar una compra, el stock reservado/vendido debe quedar trazable.

### Alertas

```text
stock = 0             → OUT_OF_STOCK
0 < stock <= minStock → LOW_STOCK
stock > minStock      → HEALTHY
```

Las métricas de inventario deben distinguir productos agotados de productos con inventario saludable.

## 9. Cancelaciones

La política exacta de reembolso no se implementa mientras no exista un proveedor de pago real. En el frontend se debe representar el estado de cancelación sin inventar una transacción financiera.

## 10. Clientes

Un usuario con rol `customer` puede consultar y modificar únicamente sus datos permitidos. Un administrador puede consultar y gestionar clientes según los permisos del panel.

## 11. Reseñas

Una reseña debe asociarse a un usuario y producto. La implementación puede exigir que exista una compra previa del producto para evitar reseñas no verificadas.

Campos sugeridos:

```text
id
userId
productId
orderId
rating
comment
status
createdAt
updatedAt
```

## 12. Cupones

Reglas mínimas:

- código único;
- fecha de inicio y vencimiento;
- activo/inactivo;
- tipo de descuento;
- valor;
- mínimo de compra opcional;
- máximo de uso opcional.

Nunca permitir un total negativo.

## 13. Cálculo del checkout

```text
subtotal
+ shipping
+ taxes
- discount
= total
```

Las tasas, costos de envío y descuentos deben provenir de configuración o reglas explícitas. No deben quedar enterrados en un componente.

## 14. Autenticación

La autenticación académica debe representar una sesión persistente y roles guardados en `db.json`. La solución no debe presentarse como seguridad empresarial real mientras JSON Server y el frontend sean la infraestructura.

## 15. Métricas

Las métricas son una capa de lectura sobre los datos operativos. No deben almacenarse como números duplicados salvo que exista una razón explícita de auditoría.

```text
API / db.json
      ↓
normalización
      ↓
funciones de dominio
      ↓
KPI / series / alertas
      ↓
componentes del dashboard
```

## 16. Principios para evitar inconsistencias

- Un mismo concepto debe tener una única definición.
- No duplicar cálculos en tarjetas diferentes.
- No hardcodear KPIs.
- No calcular negocio dentro de JSX.
- No usar `0` para representar datos desconocidos.
- No confundir solicitud de cotización con pedido pagado.
- No confundir stock con disponibilidad comercial.
- No presentar una predicción de IA como dato histórico.
