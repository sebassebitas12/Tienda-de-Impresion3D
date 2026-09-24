# Vértice CR — UX, navegación y estados

## Rutas públicas

/, /catalogo, /producto/:id, /solicitud, /solicitud/archivo, /solicitud/ayuda-diseno, /carrito, /checkout/productos, /checkout/solicitud, /registro, /pedidos/:id, /cuenta.

## Rutas administrativas

/admin, /admin/pedidos, /admin/pedidos/:id, /admin/solicitudes, /admin/solicitudes/:id, /admin/catalogo, /admin/catalogo/nuevo, /admin/catalogo/:id/editar, /admin/catalogo/categorias, /admin/clientes, /admin/clientes/:id, /admin/actividad.

## Flujos

### Compra
Home → Catálogo → Producto → Carrito → Checkout productos → Datos → Entrega → Revisión → Confirmación → Pedido.

### Personalizada con archivo
Solicitud → Archivo → Requisitos → Revisión → Pendiente de cotización → Cuenta → Cotización → Aprobación → Pago → Pedido.

### Personalizada sin archivo
Solicitud → Ayuda de diseño → Descripción → Requisitos → Revisión → Pendiente de cotización → Cuenta → Cotización.

### Admin
Login → Dashboard → bandeja → detalle → acción → actividad.

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

Mobile/tablet se mockupearán después de cerrar desktop, pero la estructura debe soportarlos desde el inicio.

## Regla

La interfaz nunca representa una capacidad técnica que backend/datos no puedan sostener.
