# Vértice CR — UX, navegación y estados

> Última actualización: **2026-10-01**.

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


## HF-08 Checkout — diseño de flujo (2026-09-24)

### Checkout de productos

`/carrito → /checkout/productos → Datos → Entrega → Pago → Revisión → Confirmación → /pedidos/:id`

### Checkout de cotización

`/carrito → /checkout/solicitud → Resumen técnico → Datos → Entrega → Pago → Revisión → Confirmación → /pedidos/:id`

### Regla visual

Los dos recorridos pueden compartir componentes de checkout (stepper, datos de facturación, entrega, SINPE, revisión), pero deben mantener **contexto visual explícito** sobre qué se está pagando.

### Navbar/footer

Mantener el navbar público derivado de HF-01 con ajustes mínimos. En checkout puede simplificarse únicamente si mejora el foco sin perder navegación, identidad o accesibilidad. Footer comercial completo no es necesario; puede usarse uno técnico compacto. Stitch solo orienta estructura y contenido.

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

## Auditoría de experiencia de compra — 2026-10-01

### Hallazgo de estado actual

La Home separa modelos de catálogo fabricados bajo pedido de piezas propias que requieren revisión y cotización. Sin embargo, el recorrido de compra aún no se puede completar: en `src/app/routes/routes.jsx`, catálogo, detalle, solicitud, carrito, checkout, cuenta/pedidos y rutas Admin se enrutan temporalmente a `ConstructionPage` (login y registro sí tienen pantallas propias). Es una brecha funcional confirmada por código, no un fallo visual de checkout implementado.

### Recorrido recomendado

1. **Home:** ofrecer dos decisiones inequívocas: explorar modelos fabricados bajo pedido o enviar un archivo propio para revisión. Explicar que los modelos no son de entrega inmediata.
2. **Catálogo:** permitir explorar por uso/tipo de pieza y filtrar por materiales confirmados —ASA, PLA, PETG, ABS y TPU— y FDM. No mostrar inventario, “disponible” ni entrega inmediata.
3. **Ficha:** priorizar fotos reales cuando existan, uso previsto, material y variantes confirmadas; mostrar precio de catálogo solo si el contrato de datos lo respalda. La ruta personalizada explica revisión y cotización, sin presentar precio final.
4. **Carrito y checkout de catálogo:** conservar producto/cantidad y resumen editable. Informar costo total y condiciones de entrega antes del pago, cuando existan datos confirmados. No inventar costos ni fechas estimadas.
5. **Solicitud personalizada:** explicar requisitos antes de cargar; dar feedback de formato/progreso/error y permitir revisar lo enviado. Confirmar recepción y siguiente paso. `PENDING_QUOTE` no muestra precio final ni CTA de pago.
6. **Después del envío/compra:** confirmar qué ocurrió y cuál es el paso siguiente; dar acceso al estado del pedido/cotización y ayuda humana.

La incertidumbre se resuelve con estados vacíos, errores y una explicación clara, no con información ficticia. Fuente de checkout: [Baymard, costos de envío en páginas de producto](https://baymard.com/research-articles/show-shipping-costs-on-product-pages). Patrón: aclarar temprano los costos que determinan el total; adaptación: Vértice los mostrará antes del checkout solo cuando tenga condiciones confirmadas.

### Tipografía de chrome global

La auditoría del instructor encontró textos ilegibles por defecto, en especial navbar y footer. El shell React sube navegación pública a 14 px en escritorio y 13 px en tablet; copy/enlaces del footer a 14 px y títulos/metadata secundaria a 12 px. Revisar a escala 100% y 150/200%, además de conservar las explicaciones en lenguaje natural y no reemplazarlas por etiquetas técnicas pequeñas.

**Actualización R-H46 (2026-10-01):** tras comprobar que el primer incremento aún se veía pequeño en la captura del usuario, navbar/CTA suben a 16 px en escritorio ancho y 15 px en la franja compacta, idioma a 14 px, enlaces/copy del footer a 16 px y títulos/cierre a 14 px; menú compacto a 16 px. La navegación horizontal colapsa al menú hasta 1000 px para mantener los labels legibles sin apretarlos. El nuevo render local de escritorio muestra la escala mayor. La revisión en 768/375 px queda pendiente y no bloquea Admin.
