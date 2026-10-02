# Vértice CR — UX, navegación y estados

> Última actualización: **2026-10-02**.

## Rutas públicas

/, /catalogo, /producto/:id, /solicitud, /solicitud/archivo, /solicitud/ayuda-diseno, /carrito, /checkout/productos, /checkout/solicitud, /registro, /pedidos/:id, /cuenta.

## Rutas administrativas

/admin, /admin/pedidos, /admin/pedidos/:id, /admin/solicitudes, /admin/solicitudes/:id, /admin/catalogo, /admin/catalogo/:id, /admin/catalogo/nuevo, /admin/catalogo/:id/editar, /admin/catalogo/categorias, /admin/clientes, /admin/clientes/:id, /admin/actividad.

## Flujos

### Compra
Home → Catálogo → Producto → Carrito → Checkout productos → Datos → Entrega → Revisión → Confirmación → Pedido.

### Personalizada con archivo
Solicitud → Archivo → Requisitos → Revisión → Pendiente de cotización → Cuenta → Cotización → Aprobación → Pago → Pedido.

### Personalizada sin archivo
Solicitud → Ayuda de diseño → Descripción → Requisitos → Revisión → Pendiente de cotización → Cuenta → Cotización.

### Dos intenciones del cotizador — decisión del usuario (2026-10-02)

La entrada `/solicitud` debe comenzar ofreciendo dos caminos explícitos y no
mezclarlos:

1. **Ya tengo la pieza/archivo:** el cliente entrega su STL/OBJ; el sistema debe
   obtener una cotización y enviarla al taller para revisión/gestión. El asistente
   no debe convertir esta ruta en una conversación de diseño.
2. **Quiero ayuda para crearla:** el chatbot conversa para aclarar uso,
   dimensiones, material y cantidad, orienta el diseño y prepara la cotización.

El estado actual no completa todavía ninguno como flujo real de producción: el
upload seguro y la medición/laminado STL/OBJ no están implementados; el Agent de
cotización solo consulta perfiles y estimaciones DEMO, y no guarda ni envía una
solicitud. La pantalla actual `/solicitud` presenta una calculadora DEMO de
referencias análogas, no estas dos opciones. No afirmar que un archivo fue
recibido, medido, cotizado o enviado hasta que exista evidencia de cada paso.
La ruta de ayuda puede orientar al cliente, pero requiere una acción de guardado
explícita y cálculo del servidor para producir una cotización persistida.

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
categoría, con búsqueda y filtros por publicación/material. Cada fila abre
`/admin/catalogo/:id`, desde donde se edita el modelo. `/admin/catalogo/nuevo`
crea, `/admin/catalogo/:id/editar` actualiza y `/admin/catalogo/categorias`
gestiona las categorías. `ACTIVE` publica y `INACTIVE` oculta; un modelo ligado
a pedido se oculta, no se borra. No se edita la imagen ni inventario. El material
fuera de ASA/PLA/PETG/ABS/TPU se señala para revisión.

**Slice actual de solicitudes:** `/admin` ofrece acceso directo al KPI de
solicitudes que requieren atención (`/admin/solicitudes?fase=workshop`). La
bandeja admite filtros de etapa/búsqueda y cada fila lleva a
`/admin/solicitudes/:id`. En una solicitud `PENDING_QUOTE`, Admin puede iniciar
revisión técnica; el mismo comando cambia a `IN_REVIEW` y registra actor/fecha en
`activityLog`. Estado desactualizado o rol inválido se rechazan. Archivo visible
es solo `fileName` y no descarga hasta conectar almacenamiento privado. El
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

La Home separa modelos de catálogo fabricados bajo pedido de piezas propias que requieren revisión y cotización. El catálogo público, ficha y carrito ya tienen una base funcional para explorar modelos, seleccionar color/cantidad y conservar la selección local; checkout aún no está conectado. El flujo de solicitud personalizada, cuenta y pedidos del cliente conserva páginas pendientes. En Admin existen dashboard, solicitudes con preparación/publicación de cotización, actividad, lectura de pedidos, CRUD de catálogo/categorías y lectura de clientes con historial asociado. Los datos académicos y el token simulado no son controles de seguridad de producción. Login y registro tienen páginas propias.

### Recorrido recomendado

1. **Home:** ofrecer dos decisiones inequívocas: explorar modelos fabricados bajo pedido o enviar un archivo propio para revisión. Explicar que los modelos no son de entrega inmediata.
2. **Catálogo:** permitir explorar por uso/tipo de pieza y filtrar por materiales confirmados —ASA, PLA, PETG, ABS y TPU— y FDM. No mostrar inventario, “disponible” ni entrega inmediata.
3. **Ficha:** priorizar fotos reales cuando existan, uso previsto, material y variantes confirmadas; mostrar precio de catálogo solo si el contrato de datos lo respalda. La ruta personalizada explica revisión y cotización, sin presentar precio final.
4. **Carrito y checkout de catálogo:** conservar producto/cantidad y resumen editable. Informar costo total y condiciones de entrega antes del pago, cuando existan datos confirmados. No inventar costos ni fechas estimadas.
5. **Solicitud personalizada:** explicar requisitos antes de cargar; dar feedback de formato/progreso/error y permitir revisar lo enviado. Confirmar recepción y siguiente paso. `PENDING_QUOTE` no muestra precio final ni CTA de pago.
6. **Después del envío/compra:** confirmar qué ocurrió y cuál es el paso siguiente; dar acceso al estado del pedido/cotización y ayuda humana.

La incertidumbre se resuelve con estados vacíos, errores y una explicación clara, no con información ficticia. Fuente de checkout: [Baymard, costos de envío en páginas de producto](https://baymard.com/research-articles/show-shipping-costs-on-product-pages). Patrón: aclarar temprano los costos que determinan el total; adaptación: Vértice los mostrará antes del checkout solo cuando tenga condiciones confirmadas.

### Tipografía de chrome global

La auditoría del instructor encontró textos ilegibles por defecto, en especial navbar y footer. El shell React sube navegación pública a 14 px en escritorio y 13 px en tablet; copy/enlaces del footer a 14 px y títulos/metadata secundaria a 12 px. Revisar a escala 100% y 150/200%, además de conservar las explicaciones en lenguaje natural y no reemplazarlas por etiquetas técnicas pequeñas. En viewport estrecho deben conservarse carrito, idioma y menú; el buscador puede vivir en el menú cuando no quepa como control de primer nivel.

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
HTTP aislados. Comparten el modelo/credencial DeepSeek, no la identidad ni las
herramientas disponibles.
