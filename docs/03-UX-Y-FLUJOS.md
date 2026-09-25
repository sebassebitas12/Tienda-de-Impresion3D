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


## Navbar y footer: regla global

### Navbar público

El navbar visual de Stitch se conserva como **referencia base oficial de la navegación pública**. No se reemplaza por otro concepto visual durante esta fase. Solo se permiten ajustes de:
- labels y rutas reales;
- estado autenticado/no autenticado;
- acceso a cuenta/carrito;
- accesibilidad, foco y teclado;
- Dark/Light;
- pequeños refinamientos de spacing, iconografía o responsive.

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


## HF-08 Checkout — diseño de flujo (2026-09-24)

### Checkout de productos

`/carrito → /checkout/productos → Datos → Entrega → Pago → Revisión → Confirmación → /pedidos/:id`

### Checkout de cotización

`/carrito → /checkout/solicitud → Resumen técnico → Datos → Entrega → Pago → Revisión → Confirmación → /pedidos/:id`

### Regla visual

Los dos recorridos pueden compartir componentes de checkout (stepper, datos de facturación, entrega, SINPE, revisión), pero deben mantener **contexto visual explícito** sobre qué se está pagando.

### Navbar/footer

Mantener el navbar público de Stitch/Vértice con ajustes mínimos. En checkout puede simplificarse únicamente si mejora el foco sin perder navegación, identidad o accesibilidad. Footer comercial completo no es necesario; puede usarse uno técnico compacto.

### Estados de pago

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
