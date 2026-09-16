# Requisitos del proyecto final — Tienda de Impresión 3D

## 1. Propósito

La aplicación será el frontend escalable de una tienda real de impresión 3D. El proyecto conserva las decisiones de las fases de producto, dirección visual y UX ya documentadas, pero deja de tratarse como un MVP descartable: la arquitectura debe permitir evolucionar hacia un negocio real.

La rúbrica exige React + React Router DOM, JSON Server, servicios locales y externos, autenticación, autorización por roles, CRUD, panel administrativo con métricas y gráfico, Jest, IA, N8N, responsive y accesibilidad. Estas exigencias se integran al modelo de negocio en lugar de aparecer como funcionalidades aisladas.

## 2. Modelo de negocio

La tienda tiene dos líneas principales:

### A. Productos terminados

Venta de productos impresos y disponibles en catálogo: gadgets, figuras, juguetes, decoración y piezas funcionales.

### B. Impresión personalizada

Servicio para clientes que tienen un archivo 3D o necesitan ayuda para definirlo. La solicitud se revisa antes de cotizar.

**Regla crítica:** una solicitud personalizada nunca se representa como una venta con precio `0` ni con un precio inventado. Su estado económico inicial es `PENDING_QUOTE`.

## 3. Roles

### Cliente

- Registrarse e iniciar sesión.
- Consultar catálogo.
- Buscar, filtrar y ordenar.
- Consultar detalle y variantes.
- Agregar productos al carrito.
- Crear pedidos.
- Consultar historial y estado de pedidos.
- Crear solicitudes personalizadas.
- Consultar estado de sus solicitudes.
- Editar sus datos permitidos.
- Publicar reseñas sobre productos adquiridos.

### Administrador

- Consultar dashboard.
- Gestionar productos y categorías.
- Gestionar clientes.
- Gestionar pedidos.
- Gestionar solicitudes personalizadas.
- Gestionar reseñas.
- Gestionar cupones.
- Consultar inventario.
- Consultar métricas y tendencias.
- Consultar actividad operacional.

## 4. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | Registro de clientes | Must |
| RF-02 | Inicio y cierre de sesión | Must |
| RF-03 | Persistencia de sesión | Must |
| RF-04 | Protección de rutas privadas | Must |
| RF-05 | Autorización por rol | Must |
| RF-06 | Catálogo consultable | Must |
| RF-07 | Búsqueda y filtros | Must |
| RF-08 | Detalle de producto | Must |
| RF-09 | Variantes de producto | Must |
| RF-10 | Carrito persistente durante la sesión | Must |
| RF-11 | Checkout de productos | Must |
| RF-12 | Confirmación e historial de pedidos | Must |
| RF-13 | Solicitud personalizada con archivo o ayuda de diseño | Must |
| RF-14 | Validación de extensión y tamaño del archivo | Must |
| RF-15 | Estado de solicitud y cotización pendiente | Must |
| RF-16 | CRUD de productos | Must |
| RF-17 | CRUD de categorías | Must |
| RF-18 | CRUD de clientes desde administración | Must |
| RF-19 | Gestión de pedidos | Must |
| RF-20 | Gestión de solicitudes personalizadas | Must |
| RF-21 | Gestión de reseñas | Should |
| RF-22 | Gestión de cupones | Should |
| RF-23 | Dashboard administrativo | Must |
| RF-24 | Métricas calculadas desde `db.json` | Must |
| RF-25 | Gráficos derivados de datos reales | Must |
| RF-26 | Integración de IA | Must |
| RF-27 | Integración de API externa real | Must |
| RF-28 | Dos flujos N8N | Must |
| RF-29 | WhatsApp de contacto | Should |
| RF-30 | Tema claro/oscuro | Must |
| RF-31 | Ajuste de tamaño de texto | Should |
| RF-32 | HTML semántico, labels y ARIA | Must |
| RF-33 | Estados diferenciados sin depender solo del color | Must |
| RF-34 | Pruebas unitarias y de integración frontend | Must |

## 5. Requerimientos no funcionales

- JavaScript/JSX; no TypeScript.
- React + Vite.
- React Router DOM.
- JSON Server mediante `db.json`.
- Servicios separados para endpoints locales y externos.
- Componentes reutilizables separados de páginas.
- Responsive en aproximadamente 375 px, 768 px y 1280 px+.
- Accesibilidad mínima de 3 de las 4 prácticas indicadas por la rúbrica.
- Ningún KPI operativo debe depender de un número escrito manualmente en el componente.
- Las fórmulas de métricas deben ser funciones puras y testeables.
- Los tests no deben realizar peticiones HTTP reales.
- Cobertura objetivo mínima: 70 % en branches, functions, lines y statements, siguiendo `testing-guide.md`.
- Estados de carga, éxito, vacío, error, validación y procesamiento.
- Sin secretos en el repositorio.
- La UI no contiene reglas de negocio complejas.

## 6. MoSCoW

### Must

Autenticación, roles, catálogo, carrito, pedidos, solicitudes personalizadas, CRUD principales, dashboard, métricas desde datos, gráfico, API externa, IA, N8N, responsive, accesibilidad y testing.

### Should

Reseñas, cupones, ajuste de tamaño de texto, WhatsApp y métricas operativas avanzadas.

### Could

Predicción asistida por IA, recomendaciones avanzadas, comparador de productos, seguimiento enriquecido y herramientas de análisis de producción.

### Won't for current delivery

Pagos reales, facturación fiscal real, visor 3D avanzado, cotización geométrica automática mediante slicer y logística integrada con transportistas.

## 7. Criterios de aceptación generales

1. Un visitante puede explorar el catálogo sin autenticarse.
2. Un cliente puede registrarse y conservar su sesión.
3. Un cliente puede completar una compra de catálogo.
4. Un cliente puede enviar una solicitud personalizada sin recibir un precio inventado.
5. Un administrador puede realizar los CRUD definidos.
6. El dashboard cambia cuando cambian los datos de `db.json`.
7. Los gráficos y KPIs se derivan de los mismos datos que muestran las operaciones.
8. Las pruebas validan cálculos, servicios y estados de componentes.
9. Los errores de API y formularios tienen una respuesta visible y recuperable.
10. Las funciones principales son utilizables en móvil, tablet y escritorio.

## 8. Relación con la rúbrica

| Rúbrica | Implementación |
|---|---|
| React + Router | Arquitectura de páginas y rutas |
| Services | `src/services/` para API local y externa |
| JSON Server | `db.json` |
| Auth + roles | usuarios, sesión y guards |
| CRUD | productos, categorías, clientes, pedidos, solicitudes y otros recursos aplicables |
| Dashboard | KPIs, tablas, alertas y gráficos |
| Jest | lógica, servicios, hooks y componentes |
| IA | servicio de IA y experiencia de asistencia |
| N8N | automatizaciones de pedidos y solicitudes |
| Responsive | mobile/tablet/desktop |
| Accesibilidad | tema, texto, semántica/ARIA y estados no dependientes del color |
