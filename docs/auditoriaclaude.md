Vértice CR — Auditoría HF / Decisiones para implementación React
Fecha: 2026-09-24
Rama: Pruebas
Estado: 🟢 Listo para iniciar implementación React

0. Resolución de contradicción crítica
fase3_componentes_ui.md menciona Tailwind + shadcn/ui.
El AI_CONTEXT.md y el handoff dicen explícitamente: CSS propio, sin librería de componentes externa.

Decisión tomada: CSS propio. Space Grotesk + JetBrains Mono. Variables CSS como design tokens.
shadcn/ui queda descartado. El sistema visual es parte del diferencial del proyecto.

1. Resolución del db.json
El db.json tiene un conflicto de merge sin resolver (marcadores <<<<<<< HEAD / ======= / >>>>>>>).
Antes de npm run dev o json-server, hay que resolverlo.

Decisión: conservar la versión extendida (users, products completos, orders, etc.) y descartar la versión simple de 5 productos. El db.json completo es el que corresponde a la arquitectura.

2. Design system — tokens definitivos
/* Superficies */
--color-bg:         #0D0B09;
--color-surface:    #141412;
--color-surface-2:  #1E1C19;
--color-surface-3:  #25221E;
--color-border:     #2A2723;

/* Acento térmico */
--color-accent:     #FF5A1F;
--color-accent-dim: #E03D00;
--color-accent-lit: #FF7A45;

/* Texto */
--color-text:       #EDE8E0;
--color-muted:      #8A8884;

/* Estado */
--color-success:    #2ECC71;
--color-error:      #FF4444;
--color-warning:    #F5A623;
--color-pending:    #8A8884;   /* PENDING_QUOTE — nunca color de acción */

/* Tipografía */
--font-display:     'Space Grotesk', system-ui, sans-serif;
--font-mono:        'JetBrains Mono', 'Courier New', monospace;

/* Motion */
--motion-micro:     150ms ease;
--motion-ui:        220ms cubic-bezier(0.4, 0, 0.2, 1);
--motion-reveal:    400ms cubic-bezier(0.4, 0, 0.2, 1);
Regla de color: el naranja se usa en CTA, focus ring, hover de elementos interactivos, y detalles técnicos. No en backgrounds de sección, no en texto de cuerpo, no en iconografía decorativa.

Regla de geometría: border-radius: 2px para elementos técnicos (inputs, badges de datos, tags de código). border-radius: 6px para cards de producto. border-radius: 12px solo para el showcase oval del hero. Sin border-radius universal.

3. Estructura de rutas React Router DOM
/                        → HomePage
/catalogo                → CatalogPage
/producto/:id            → ProductDetailPage
/solicitud               → CustomPrintSelectionPage
/solicitud/archivo       → CustomPrintFilePage
/solicitud/asistencia    → CustomPrintAssistancePage
/carrito                 → CartPage
/checkout/productos      → CheckoutProductsPage
/checkout/solicitud      → CheckoutRequestPage
/cuenta                  → AccountPage  (privada: role=customer)
/pedido/:id              → OrderDetailPage  (privada)
/login                   → LoginPage
/registro                → RegisterPage
/admin                   → AdminDashboardPage  (privada: role=admin)
/admin/pedidos           → AdminOrdersPage
/admin/pedidos/:id       → AdminOrderDetailPage
/admin/solicitudes       → AdminRequestsPage
/admin/solicitudes/:id   → AdminRequestDetailPage
/admin/catalogo          → AdminCatalogPage
/admin/catalogo/nuevo    → AdminProductNewPage
/admin/catalogo/:id/editar → AdminProductEditPage
/admin/clientes          → AdminClientsPage
/admin/clientes/:id      → AdminClientDetailPage
Rutas privadas por rol con ProtectedRoute. Redirect a /login si no hay sesión.

HF-01 — Home / Landing
✅ Qué conservar del mockup Stitch
Badge "Fabricación digital · Costa Rica" — conciso y real
División hero: copy izquierda / showcase derecha
Sección Precision con 4 bloques técnicos
Flujo Process con 4 pasos
Print CTA con badge "Pendiente de cotización"
Ausencia de sección "Productos destacados" — correcto
❌ Qué es demasiado básico
El showcase actual (App.jsx) son dos rectángulos con glow genérico
La tipografía no está aplicada (usa system-ui implícita)
No hay motion real — solo CSS estático
"3.6k piezas entregadas" y "24/7 soporte técnico" son datos inventados — sacar
La sección catalog en Home (productos hardcodeados) no debe existir
🔄 Qué cambiaremos
Showcase: 5 tarjetas de productos con scroll infinito pausado al hover. Cada card tiene código técnico (PRT-01), nombre y un placeholder geométrico que representa la categoría del producto (forma SVG simple, no imagen genérica de AI).
Hero H1: "De una idea, a algo real." — más directo que la versión actual
Precision: valores conceptuales como especificaciones de referencia, nunca como claims de marketing definitivos. Aplicar JetBrains Mono en los valores.
Process: los 4 pasos son correctos. Conectar con una línea SVG fina, no con iconos decorativos.
Print CTA: mostrar el flujo Subís archivo → 3D → Cotización visualmente. El badge debe ser visible y decir "Pendiente de cotización".
⚡ Interacción
Navbar: sticky, backdrop-filter: blur(12px), opacidad 90% en scroll
Showcase: animation: scroll-horizontal con pausa en hover y focus-within. @media (prefers-reduced-motion) desactiva la animación y muestra las cards estáticas.
CTA primario ("Explorar catálogo"): hover con shift de 1px + naranja más intenso. Focus ring naranja visible.
Cards del showcase: hover eleva la card 4px, aparece el nombre del producto en overlay.
Precision values: revelan su label con un delay escalonado de 100ms en carga inicial.
📐 Responsive
Mobile (375px): showcase apila en columna única, scroll horizontal táctil. H1 a 36px (Space Grotesk 700). Los 4 bloques Precision van en 2×2.
Tablet (768px): hero en columna única, showcase horizontal pero más pequeño.
Desktop (1280px+): layout split 50/50.
🧩 Componentes que salen de aquí
<Navbar>, <ShowcaseOval>, <ShowcaseCard>, <PrecisionGrid>, <ProcessStepper>, <PrintCTAPanel>, <Footer>

🚫 No hacer
No agregar más secciones (testimonios, blog, logos de clientes)
No poner glow naranja en cada elemento
No animar todo el hero simultáneamente — solo el showcase tiene movimiento continuo
HF-02 — Catálogo
✅ Conservar
Filtros visibles en sidebar izquierdo (desktop)
Grid de productos — densidad correcta
Badge de material y disponibilidad por producto
❌ Mejorar
Las cards son cards genéricas con imagen placeholder gris
No hay estados de filtro activo claramente diferenciados
El sorting está enterrado
🔄 Cambios
Cards de producto con: imagen/placeholder geométrico, código de producto (JetBrains Mono), nombre, precio, material badge, disponibilidad badge
Filtros por: categoría, material, precio (rango), disponibilidad
Sorting visible en toolbar: "Más recientes", "Precio: menor", "Precio: mayor", "Más vendidos"
Búsqueda con debounce de 300ms
Estado vacío específico: "No hay productos con estos filtros" + "Limpiar filtros"
Skeleton loading: 6–8 cards con shimmer mientras carga
⚡ Interacción
Filtro activo: chip naranja con X para eliminar filtro individual
"Agregar al carrito" en hover de card (desktop) — en mobile, botón visible siempre
Disponibilidad "Sin stock": card visualmente atenuada, CTA "Notificar disponibilidad" (estado futuro)
📐 Responsive
Mobile: sidebar de filtros como Sheet (bottom drawer). Cards en 1 columna.
Tablet: 2 columnas, filtros colapsables en top bar.
Desktop: sidebar fijo de 240px + grid de 3 columnas.
🧩 Componentes
<CatalogSidebar>, <FilterGroup>, <ActiveFilters>, <CatalogGrid>, <ProductCard>, <SortingBar>, <SearchInput>

HF-03 — Detalle de Producto
✅ Conservar
Imagen grande / galería a la izquierda
Especificaciones técnicas en la derecha
CTA prominente
❌ Mejorar
Sin variantes de color/material diferenciadas visualmente
Sin indicador de disponibilidad claro
Sin dimensiones en JetBrains Mono
Sin breadcrumb
🔄 Cambios
Layout: galería 55% / info 45% en desktop
Dimensiones y especificaciones con JetBrains Mono (esto distingue visualmente la data técnica)
Selector de material/color: pills con borde naranja cuando seleccionado
Disponibilidad: badge con texto + icono (nunca solo color)
Tiempo estimado de entrega junto al CTA
Tabs para "Descripción" / "Especificaciones" / "Material" si el contenido es extenso
Imagen ausente: placeholder SVG con rejilla tipo CAD sutil, en colores de superficie
⚡ Interacción
Galería: click en thumbnail → zoom/swap de imagen principal con crossfade 200ms
Selector de variante: highlight inmediato sin recarga de página
"Agregar al carrito": cambia a "✓ Agregado" por 1.5s, luego vuelve a estado normal
Cantidad: input +/- con validación de mínimo 1
🧩 Componentes
<ProductGallery>, <VariantSelector>, <SpecTable>, <AvailabilityBadge>, <AddToCartButton>

HF-04/05/06 — Solicitud Personalizada
Pantalla de selección (HF-04)
Dos caminos claros:

[ Tengo un archivo 3D ]     [ Necesito ayuda de diseño ]
   .stl / .obj                 Descripción + referencia
No es un formulario. Es una decisión visual clara. Cards grandes, icono representativo de cada camino.

Upload de archivo (HF-05)
No debe parecer un formulario aburrido.

Estados del dropzone:

idle: área punteada con icono, texto "Arrastrá tu .STL o .OBJ aquí"
drag-over: border naranja, fondo ligeramente iluminado
processing: spinner, "Analizando archivo..."
success: muestra nombre, extensión, tamaño, dimensiones estimadas
error-format: "Este formato no es compatible. Usá .STL o .OBJ."
error-size: "El archivo supera el límite de 50MB."
remove: botón X visible en el estado success
Después del upload exitoso: formulario de especificaciones (material, calidad, notas) con progreso visible de pasos.

Asistencia de IA (HF-06)
Chat-style interface: el usuario describe su pieza, la IA recomienda material y da rango indicativo
La IA NUNCA confirma precio. Siempre termina con "El administrador revisará tu solicitud."
Estado visual del resultado: card con las recomendaciones + badge "PENDING_QUOTE" prominente
⚡ Interacción
Progreso visible entre pasos (no solo steps numerados — progress bar real)
Cada paso conserva los datos si el usuario retrocede
Submit final: "Enviando solicitud..." → confirmación con número de referencia
🧩 Componentes
<RequestPathSelector>, <FileDropzone>, <FilePreview>, <RequestSpecsForm>, <AIAssistantPanel>, <PendingQuoteBadge>

HF-07 — Carrito Híbrido
Separación visual obligatoria
PRODUCTOS (pueden pagarse ahora)
───────────────────────────────
  [imagen] Nombre del producto
           Material · Color
           ₡ precio     [cantidad] [eliminar]

SOLICITUDES PERSONALIZADAS
───────────────────────────────
  [icono] archivo.stl
           Material solicitado: PETG
           ┌──────────────────────────────┐
           │  ⏳ PENDIENTE DE COTIZACIÓN  │
           │  El administrador revisará   │
           │  tu solicitud antes de       │
           │  confirmar el precio.        │
           └──────────────────────────────┘
El total nunca mezcla solicitudes sin cotización con precios reales. Si hay solicitudes pendientes, el total muestra "₡X.XXX (+ solicitudes por cotizar)".

Carrito vacío: ilustración sutil + "Tu carrito está vacío" + "Explorar catálogo".

🧩 Componentes
<CartProductSection>, <CartRequestSection>, <CartItem>, <PendingQuoteNotice>, <CartTotal>, <EmptyCart>

HF-08/09 — Checkout
Checkout de Productos
Progreso: Datos → Pago → Confirmación (3 pasos)
SINPE Móvil: número + banco + monto = ₡X.XXX + instrucciones claras
Confirmación: número de pedido en JetBrains Mono, resumen, "Tu pedido está siendo procesado"
Checkout de Solicitud
No hay pago inmediato
Resumen de la solicitud + archivo + especificaciones
Estado: "PENDIENTE DE COTIZACIÓN — recibirás un correo con el precio y podrás aceptar o rechazar"
Número de referencia de la solicitud
HF-10 — Login / Registro
Decisión de layout
Modal o página dedicada — página dedicada (modal es más complejo de hacer bien, y el rubric exige rutas).

/login y /registro son páginas, no modals
Layout centrado, superficie elevada (--color-surface-2)
Tabs "Iniciar sesión" / "Registrarse" en la misma página
Campos login: email + contraseña + "Recordarme"
Campos registro: nombre, email, contraseña, confirmar contraseña
Validación en tiempo real con mensajes junto al campo, no en toast genérico.

HF-11/12/13 — Cuenta del Cliente
Portal de usuario (/cuenta)
Tabs: "Mis pedidos" / "Mis solicitudes" / "Perfil"
Pedidos: tabla con número, fecha, estado (con texto + icono), total
Solicitudes: tabla con referencia, archivo, estado, acciones
Detalle de pedido (/pedido/:id)
Timeline visual del estado del pedido (Processing → Produced → Shipped → Delivered)
Cada estado tiene fecha/hora
El timeline usa texto + color, nunca solo color
Biblioteca de archivos (/cuenta tab "Mis archivos" o sub-ruta)
Lista de .stl y .obj subidos por el usuario
Nombre, tamaño, fecha de subida, pedido/solicitud asociado
Opción de reutilizar en nueva solicitud
HF-13+ — Admin
Dashboard Admin (/admin)
Regla absoluta: ningún número hardcodeado.

Familias de KPIs (en orden visual):

Ventas hoy / semana / mes con sparkline (Recharts LineChart)
Pedidos por estado (BarChart)
Solicitudes pendientes de cotización (número grande + acción directa "Ver solicitudes")
Top 5 productos más vendidos (tabla)
Alertas: productos con stock < 3
Gestión de Productos (/admin/catalogo)
Tabla con: imagen thumb, nombre, categoría, precio, stock, estado
Acciones por fila: editar, desactivar
Botón "Nuevo producto" prominente
CRUD completo: crear, leer, actualizar, archivar (soft delete, no hard delete)
Gestión de Clientes (/admin/clientes)
Tabla: nombre, email, fecha de registro, pedidos totales, estado
Detalle de cliente: historial de pedidos y solicitudes
Gestión de Solicitudes (/admin/solicitudes)
Tabla: referencia, cliente, archivo, estado, fecha
Acción key: "Cotizar" → input de precio → confirmar → notificación al cliente (vía N8N)
4. Componentes globales reutilizables
<Navbar>              sticky, blur, con carrito badge y cuenta
<Footer>              simple, brand + copyright
<ProtectedRoute>      redirección por rol
<PageShell>           max-width 1280px, padding horizontal
<Button>              variantes: primary, secondary, ghost, danger
<Badge>               variantes: material, status, pending, success, error
<StatusBadge>         texto + icono, nunca solo color
<Skeleton>            loading placeholder con shimmer
<EmptyState>          ilustración + texto + acción
<ErrorState>          texto de error + reintentar
<Modal>               para confirmaciones y detalles breves
<Toast>               feedback breve post-acción
<ProgressBar>         para flows multi-paso
<DataTable>           tabla reutilizable admin con sort y filtros
5. Lo que NO necesitamos documentar más
La arquitectura en docs/ARCHITECTURE.md está bien definida.
El db.json completo (rama correcta, sin conflicto) está bien estructurado.
Los estados e interacción en docs/fase3_estados_interaccion.md son correctos y aplicables directamente.

No hay que producir más documentos antes de React.

6. Orden de implementación
1. Resolver conflicto db.json
2. Instalar deps: react-router-dom, recharts, json-server
3. Estructura de carpetas (arquitectura ya definida)
4. Design tokens en src/styles/tokens.css
5. Componentes globales: Navbar, Footer, Button, Badge, PageShell
6. Rutas en App.jsx con React Router DOM
7. AuthContext (login/logout/roles)
8. LoginPage + RegisterPage
9. HomePage (HF-01) — primera pantalla real, establece el lenguaje visual
10. CatalogPage + ProductCard (HF-02)
11. ProductDetailPage (HF-03)
12. CustomPrint flow (HF-04/05/06)
13. CartPage (HF-07)
14. CheckoutPages (HF-08/09)
15. AccountPages (HF-11/12/13)
16. Admin pages (HF-13+)
17. Jest + React Testing Library
18. N8N flows
19. Polish, accesibilidad, reduced-motion, dark/light toggle
7. Decisión final: ¿Empezamos React?
Sí.

La identidad está definida. Los componentes están identificados. Las rutas están mapeadas. Los estados están documentados. El design system tiene tokens concretos.

El siguiente paso es el código.

Documento generado: 2026-09-24 | Claude Sonnet 4.6 | Repositorio: Pruebas @ ee144ce