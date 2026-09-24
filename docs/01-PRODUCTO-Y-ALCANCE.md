# Vértice CR — Producto y alcance

## Producto

Tienda costarricense de impresión 3D con dos líneas:

1. Productos terminados: catálogo de piezas listas para comprar.
2. Impresión personalizada: archivo 3D o ayuda de diseño; revisión y cotización antes de producción/pago.

## Roles

### Cliente
Registro, login, sesión, catálogo, búsqueda, filtros, detalle, variantes, carrito, compra, solicitudes personalizadas, cotizaciones, pedidos, actividad y datos personales.

### Administrador
Dashboard operativo, productos, categorías, pedidos, solicitudes/cotizaciones, clientes, inventario, actividad, métricas y resumen operativo asistido por IA.

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
