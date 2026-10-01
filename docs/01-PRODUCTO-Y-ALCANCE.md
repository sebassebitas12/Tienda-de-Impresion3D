# Vértice CR — Producto y alcance

> Última actualización: **2026-10-01**.

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
Autenticación, roles, catálogo, productos, carrito, pedidos, solicitudes, cotización, CRUD, dashboard, métricas, API externa, IA, N8N, responsive, accesibilidad y testing.

### Should
Reseñas, cupones, ajuste de texto y WhatsApp.

### Could
Recomendaciones avanzadas, predicción, comparador y analítica avanzada.

### Won't en esta entrega
Pagos reales, facturación fiscal real, visor 3D avanzado, cotización geométrica automática con slicer y logística integrada.

## Principios

- JavaScript/JSX; nunca TypeScript.
- No inventar métricas, precios, capacidades o integraciones.
- UI sin reglas de negocio complejas.
- Cálculos importantes como funciones puras.
- Estados como parte del producto.
- Sin secretos en Git.
