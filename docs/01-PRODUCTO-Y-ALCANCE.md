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

La siguiente lista consolida la rúbrica académica entregada en `Proyecto_Final_FrontEnd_Actualizado.pdf` con el alcance de Vértice CR. La rúbrica es una fuente de requisitos de entrega; no autoriza a inventar capacidades, endpoints, métricas o datos.

### Arquitectura y front end

- React + Vite + JavaScript/JSX.
- React Router DOM con páginas, rutas públicas y privadas.
- Componentes reutilizables separados de páginas/vistas.
- Carpeta `services/` para endpoints locales, externos e IA.
- Estructura ordenada con componentes, páginas, hooks, context/providers, servicios y utilidades.

### Responsive y accesibilidad

- Validación real en móvil aproximado 375px, tablet 768px y escritorio 1280px o más.
- Cumplir al menos 3 de 4 prácticas: cambio de tema/contraste, tamaño de texto ajustable, HTML semántico + ARIA y estados no comunicados solo por color.
- La documentación interna adopta las 4 como objetivo; no basta con que existan en el mockup, deben demostrarse en React.

### Datos, autenticación y autorización

- JSON Server + `db.json` como backend simulado y servicios HTTP locales.
- Al menos un endpoint externo real consumido desde `services/`, con proveedor, finalidad, método, URL, request, response, errores y variable de entorno documentados.
- Login y Register.
- Persistencia de sesión y protección de rutas privadas.
- Roles guardados en `db.json` y autorización de módulos/acciones según el rol autenticado.

### Operación del sistema

- CRUD completo para cada recurso administrable del proyecto.
- Dashboard de administración con al menos 3 métricas clave y un gráfico.
- Integración de IA consumida desde el front end dentro de un servicio controlado.
- Proyecto N8N entregable con al menos 2 flujos del sistema.

### Evidencias académicas

- Pruebas unitarias de front end con Jest y validación de componentes o lógica crítica.
- Anteproyecto con objetivo general, objetivos específicos, introducción, desarrollo y anexos.
- Anexos con mockups de escritorio y móvil.
- Libro de marca con paleta, contraste, estilo visual y logos.

## Matriz de cumplimiento de la rúbrica

Estados: `DOCUMENTADO` significa que la decisión existe en Markdown; `BASE` significa que hay datos o una base parcial; `PENDIENTE` significa que aún falta implementación o evidencia; `BLOQUEADOR` impide afirmar que la entrega final está lista.

| Requisito de la rúbrica | Estado actual | Evidencia o faltante | Hogar documental |
|---|---|---|---|
| React + componentes + páginas + Router | BASE / BLOQUEADOR | Vite y React existen, pero `src/` aún es una demo inicial y no hay Router ni estructura objetivo implementada. | 06, 10 |
| Componentes reutilizables y `services/` | DOCUMENTADO / PENDIENTE | La arquitectura define la separación, pero esas carpetas/capas aún no existen en el repositorio actual. | 06 |
| Responsive 375 / 768 / 1280+ | BASE / PENDIENTE | HF-01 contiene cortes CSS, pero falta revisión manual y faltan mockups móviles/tablet del sistema completo. | 03, 04, 05 |
| Accesibilidad mínima 3 de 4 | BASE / PENDIENTE | Hay Dark/Light, HTML/ARIA, reduced-motion y reglas de estados; falta demostrar texto ajustable al 200% y auditoría en React. | 04, 09 |
| JSON Server + servicios locales | BASE / PENDIENTE | `db.json` existe; no hay JSON Server configurado como dependencia ni servicios HTTP implementados. | 06, 07 |
| Endpoint externo real | BLOQUEADOR | Está exigido y mencionado, pero aún falta escoger proveedor, contrato, errores y variable de entorno. No tratar las menciones del anteproyecto como integración existente. | 07, 10 |
| Login/Register, sesión y rutas privadas | DOCUMENTADO / BLOQUEADOR | El alcance y los flujos lo contemplan; falta implementación, persistencia, expiración y guard de rutas. | 03, 07 |
| Roles y autorización | BASE / BLOQUEADOR | `db.json` ya contiene `admin` y `customer`; faltan guards y autorización real de acciones/módulos. | 02, 06, 07 |
| CRUD completo | DOCUMENTADO / BLOQUEADOR | Se definen recursos y pantallas admin, pero no existen páginas, servicios ni operaciones CRUD en React. | 01, 06 |
| Dashboard con 3 métricas y gráfico | DOCUMENTADO / PENDIENTE | El diseño y las fórmulas están descritos; falta dashboard funcional con datos de `db.json` y gráfico. | 08 |
| Jest + Testing Library | DOCUMENTADO / BLOQUEADOR | El objetivo está escrito, pero `package.json` no tiene dependencias ni scripts de test. | 09 |
| IA obligatoria | DOCUMENTADO / PENDIENTE | Existe contrato conceptual para chatbot/resumen IA; faltan proveedor/endpoint real, servicio, estados y evidencia funcional. | 07, 08 |
| Dos flujos N8N | DOCUMENTADO / BLOQUEADOR | Hay contratos propuestos, pero falta entregar/exportar los dos workflows y probar respuestas/errores. | 07, 10 |
| Anteproyecto escrito | BASE / VERIFICAR | Existe `docs/Anteproyecto_Vertice_CR.pdf`; debe conservar objetivos, introducción, desarrollo y anexos verificables contra esta rúbrica. | 01, 10 |
| Mockups desktop + móvil | BASE / PENDIENTE | HF-01 desktop está reconstruido; falta producir y auditar versión móvil/tablet del sistema, no solo responsive CSS. | 03, 05, 10 |
| Libro de marca | BASE / VERIFICAR | Existe `docs/LibroDeMarca_Vertice_CR.pdf`; falta comprobar que incluya colores con contraste, estilos y logos exigidos. | 04, 10 |

### Lectura de la matriz

HF-01 puede considerarse la base visual desktop del sistema cuando termine su validación manual y tenga su variante móvil/tablet. Eso no equivale a que el proyecto completo cumpla la rúbrica: los bloqueadores técnicos de React, servicios, auth, CRUD, tests, API externa, IA y N8N deben cerrarse en sus documentos y luego implementarse.

### Decisión de continuidad — 2026-09-25

HF-01 se adopta como guía visual del sistema completo. No se abrirá otra ronda de mockups para rehacer Home: el siguiente trabajo es convertir sus tokens, navbar, cards, paneles de ayuda, estados y reglas de accesibilidad en un Design System y después en arquitectura React. La auditoría visual del mockup no acredita por sí sola la rúbrica; la evidencia final deberá salir de la aplicación implementada, sus servicios y sus pruebas.

### Evidencia documental revisada

- `docs/Anteproyecto_Vertice_CR.pdf` existe y contiene objetivo general, objetivos específicos, introducción, desarrollo y anexos de mockups; incluye referencias a vistas desktop y al menú mobile. Falta validar la versión final contra el calendario y conservar evidencia de la entrega.
- `docs/LibroDeMarca_Vertice_CR.pdf` existe y contiene logotipo, paleta, tipografías, contraste WCAG AA y reglas de uso. Falta vincularlo formalmente al Design System implementado.
- El PDF de rúbrica indica como fecha del anteproyecto el 21 de septiembre; esa fecha debe confirmarse contra el calendario real del curso antes de la entrega final.
- No se encontró un proyecto/exportación de N8N en el repositorio actual. La documentación describe los flujos, pero eso no sustituye el entregable.

## MoSCoW

### Must
Autenticación, roles, catálogo, productos, carrito, pedidos, solicitudes, cotización, CRUD, dashboard, métricas, API externa, IA, N8N, responsive, accesibilidad y testing.

### Should
Reseñas, cupones y WhatsApp.

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
