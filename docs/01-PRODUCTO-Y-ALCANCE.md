# Vértice CR — Producto y alcance

> Última actualización: **2026-10-05**.

## Producto

Tienda costarricense de impresión 3D con dos líneas:

1. Catálogo de modelos que se fabrican al recibir pedidos; no se ofrecen como entrega inmediata.
2. Impresión personalizada: archivo 3D o ayuda de diseño; revisión y cotización antes de producción/pago.

El catálogo presenta modelos y opciones. La compra de un modelo inicia su producción; la ficha o tarjeta no debe prometer disponibilidad inmediata ni usar etiquetas o cantidades de existencias.

### Capacidad de fabricación vigente

- Proceso disponible: **FDM únicamente**.
- Filamentos disponibles: **ASA, PLA, PETG, ABS y TPU**.
- No ofrecer SLA, resina, nylon u otros procesos/materiales como capacidad del taller en esta entrega.
- La selección final del filamento depende de la revisión técnica de cada pieza; no implica compatibilidad garantizada sin revisar diseño y uso.
- No publicar tolerancia dimensional garantizada ni plazos de entrega hasta contar con datos de operación aprobados. El `±0.05 mm` de HF-01 es texto del mockup congelado, no un compromiso de fabricación confirmado.

## Roles

### Cliente
Registro, login, sesión, catálogo, búsqueda, filtros, detalle, variantes, carrito, compra, solicitudes personalizadas, cotizaciones, pedidos, actividad y datos personales.

### Administrador
Dashboard operativo, productos, categorías, pedidos y su producción, solicitudes/cotizaciones, clientes, actividad, métricas y resumen operativo asistido por IA. El manejo de existencias de productos terminados no forma parte del modelo actual.

## Requisitos obligatorios

- React + Vite + JavaScript/JSX.
- React Router DOM.
- JSON Server + db.json.
- Services para API local, externa e IA.
- Autenticación y autorización por roles.
- CRUD principal.
- Dashboard + Recharts.
- IA.
- Dos flujos N8N.
- Responsive: 375 / 768 / 1280+.
- Accesibilidad.
- Jest + Testing Library.
- Cobertura mínima objetivo 70%.

## MoSCoW

### Must
Autenticación, roles, catálogo, productos, carrito, pedidos, solicitudes, cotización, CRUD, dashboard, métricas, API externa, IA integrada a los flujos (incluida la preparación automática de solicitudes/cotizaciones desde referencias compatibles), N8N, responsive, accesibilidad y testing.

**Alcance operativo del requisito CRUD (aclaración 2026-10-01):** CRUD completo en Admin para `products` y `categories`. Productos permiten alta, lectura, edición, publicación/ocultamiento y baja definitiva solo sin referencias históricas; si ya forman parte de un pedido, se ocultan para conservar el registro. Categorías permiten alta, lectura, edición y baja solo sin productos asociados. Ninguna de estas operaciones administra inventario ni carga de medios. Pedidos son registros históricos: su creación ocurre en el flujo de compra y la edición de etapa será una operación de dominio auditada, nunca CRUD genérico ni borrado. Las solicitudes se crean en el flujo del cliente y usan el ciclo de cotización de `02`; usuarios se registran desde Auth y no se crean/eliminan desde Admin. No interpretar “CRUD” como permiso para modificar/borrar indiscriminadamente todas las entidades.

### Should
Reseñas, cupones, ajuste de texto y WhatsApp.

### Could
Recomendaciones avanzadas, predicción, comparador y analítica avanzada.

### Won't en esta entrega
Pagos reales, facturación fiscal real, logística integrada y garantizar geometría, escala o fabricabilidad a partir de una sola imagen. La generación/visualización image-to-3D es una capacidad opcional aparte, no sustituye inspección ni laminado.

### Promesa de IA del producto — prioridad vigente (2026-10-05)

La diferencia central que se va a presentar es asistencia de IA integrada para
orientar al cliente, preparar solicitudes/cotizaciones desde la conversación y
ayudar al Admin a operar catálogo y solicitudes. La meta es no exigir al cliente
que conozca o escriba gramos, horas, desgaste, energía o costos; la IA y las
herramientas deben proponer esos datos a partir de archivos compatibles y
parámetros trazables, con acciones claras para continuar.

No se simulará precisión que la entrada no permite: una imagen no determina
escala ni interior de la pieza; un STL sí necesita inspección geométrica y
laminado con perfil de material/impresora para estimar tiempo y material. Si el
modelo no puede medir con evidencia suficiente, la interfaz pide solo la
aclaración indispensable o marca qué falta, en vez de pedir al usuario datos
técnicos arbitrarios o inventar una cotización. El flujo vigente de `02` se
mantiene: solicitud del cliente → propuesta asistida → revisión/validación del
taller con acciones concretas → aprobación del cliente → pago DEMO.

## Principios

- JavaScript/JSX; nunca TypeScript.
- No inventar métricas, precios, capacidades o integraciones.
- UI sin reglas de negocio complejas.
- Cálculos importantes como funciones puras.
- Estados como parte del producto.
- Sin secretos en Git.
