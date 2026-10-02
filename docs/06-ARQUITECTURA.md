# Vértice CR — Arquitectura

> Última actualización: **2026-10-01**.

## Principio

UI → Pages/Features → Hooks/Services/Utils → APIs → datos.

La UI no accede directamente a JSON Server ni contiene reglas de negocio complejas.

## Stack

React 19, Vite 8, JavaScript/JSX, React Router DOM, JSON Server, Jest + Testing Library, Recharts, N8N, API externa y servicio de IA.

### Dependencias de verificación de fundaciones (2026-09-30)

Se incorporan Jest, babel-jest, jest-environment-jsdom, @babel/preset-env,
@babel/preset-react, @testing-library/react, @testing-library/user-event y
@testing-library/jest-dom para ejecutar la estrategia de `docs/09`: interacciones
de teclado, formularios, doble envío y separación de precios/cotizaciones.
Babel se limita a los tests JSX; Vite sigue compilando la aplicación.

## Estructura objetivo

~~~text
src/
  app/
    routes/
    layout/
    providers/
    App.jsx
  components/
  features/
    auth/
    catalog/
    cart/
    checkout/
    customRequests/
    orders/
    profile/
    admin/
    chatbot/
  pages/
  hooks/
  services/
  utils/
  styles/
~~~

## Responsabilidades de capas

### `src/app/`
Arranque de la aplicación, rutas, layout global y providers. No contiene reglas de negocio específicas.

### `src/pages/`
Composición de páginas/rutas. Orquesta features; no debe convertirse en capa de acceso directo a APIs.

### `src/features/`
Lógica y UI específica del dominio: `auth`, `catalog`, `cart`, `checkout`, `customRequests`, `orders`, `profile`, `admin`, `chatbot`, etc.

### `src/hooks/`
Hooks reutilizables de interacción/estado. No esconder reglas complejas de dominio que deberían vivir en funciones o servicios.

### `src/services/`
Acceso a JSON Server, API externa, auth, IA y N8N. Cada servicio normaliza respuestas hacia modelos utilizables por la UI.

### Operaciones académicas con escritura coordinada

`npm run api` inicia `scripts/api-server.js`: conserva las rutas REST de JSON
Server y añade `POST /admin/actions/start-review`. Este comando valida el estado
esperado y el rol académico, y escribe juntos el cambio de solicitud y su evento
de `activityLog` mediante un único reemplazo atómico del archivo JSON, protegido por cola
secuencial dentro del proceso. El reemplazo reintenta errores transitorios de
lock (`EPERM`, `EACCES`, `EBUSY`) en Windows sin escribir el JSON destino a
medias. No se usa una secuencia de dos llamadas desde el
navegador. La API sigue siendo una simulación académica local y no es una frontera
de seguridad de producción; una implementación real debe aplicar autorización y
transacción en el servidor de negocio.

### `src/utils/`
Funciones puras, validaciones y cálculos sin efectos secundarios.

### Catálogo Admin de consulta
`features/admin/AdminCatalog.jsx` consume `useAdminCatalog`, que delega lectura
de `products` y `categories` a `adminCatalogService` y relación/filtros a
`utils/adminCatalog.js`. `features/admin/AdminCatalogManagement.jsx` gestiona el
formulario de alta/edición de producto y el CRUD de categorías. Las mutaciones
REST se centralizan en `adminCatalogService`; nunca se escriben desde el JSX.
`ACTIVE`/`INACTIVE` representan publicación/ocultamiento. El alta crea `images`
vacío y la edición preserva imágenes registradas; upload/cambio espera contrato
de storage. La baja de producto consulta `orderItems` y se bloquea si existe una
referencia; la baja de categoría se bloquea si productos la usan. Los campos
heredados `stock`/`minStock` no entran al modelo de pantalla ni a payloads.

### `src/components/` (UI Kit y Compartidos)
Solo piezas realmente compartidas entre dominios. Una pieza propia de una feature debe permanecer en su feature.

#### UI Kit base implementado (2026-09-30)
`src/components/ui/` contiene las primitivas visuales iniciales derivadas de HF-01 y tokens actuales: MonoLabel, Badge, Button, IconButton, LinkText, StatusIndicator, PriceTag, Card, Input, Checkbox, Switch, NavLink, BrandLogo, ThemeToggle, SectionKicker, SignalMetric, Skeleton, EmptyState, Panel y Drawer. Se exportan desde `src/components/ui/index.js`. No añade dependencias.

La Capa 0 se amplió con SectionBlock, SearchInput, Select, FileDropzone, ErrorState,
Toast (alias Notification), LanguageToggle, RevealOnScroll, ProductCard,
HelpDisclosure, CartItem, StepperBar, QuoteSummaryPanel y SinpePaymentBlock.
Los paneles son no modales por defecto; Drawer usa dialog nativo modal, bloqueo
del fondo, ciclo de foco, Escape y retorno al disparador. Las reglas monetarias,
de archivos y elegibilidad de cotizaciones viven en utils. El límite de archivo
y destino SINPE se reciben por props: no se inventan valores operativos.

Tokens: geometría base 2/6/12 px; el radio de 28 px del workbench tiene su propio
token para conservar la excepción visual de HF-01. Los controles usan al menos
44 px, tamaños tipográficos relativos y movimiento completamente desactivable.
Los estilos compartidos se importan también al consumir una primitiva individual.

Verificación Capa 0: 21 pruebas Jest/Testing Library, lint y compilación Vite de
todas las exportaciones; cobertura statements 79.64 %, branches 77.31 %,
functions 83.51 %, lines 89.62 %. Dev sirve el barrel con HTTP 200.
No hay navegador conectado: queda pendiente la inspección visual 375/768/1280
y el contraste real de ambos temas. No equivale a certificación de accesibilidad.

Para Capa 1 se añade react-router-dom, solicitado en el prompt maestro, para
createBrowserRouter, layouts con Outlet y enlaces SPA. `AuthProvider` restaura
la sesión académica mediante el adapter de JSON Server; el frontend no se presenta
como autenticación de producción.
Para optimizar el desarrollo y mantener coherencia global, esta capa incluye el **UI Kit (Primitivas)** extraído del mockup congelado HF-01 y de los contratos documentados en `docs/02–04`:

#### Interacción y controles
- `Button` — Variantes: `primary` (CTA lava), `ghost` (borde), `pill` (redondeado), `full-width`. Estados: `default`, `hover`, `active`, `disabled`, `loading` (spinner + deshabilitado para evitar dobles envíos).
- `IconButton` — Controles cuadrados/redondos de 42–50 px: cerrar panel (×), flechas del visor (`.rail-arrow`), hamburguesa, tema, búsqueda, carrito y botones flotantes (`floating-button`).
- `LinkText` — Enlace con affordance de flecha (“Ver ficha ↗”, `.text-link`). Variantes: inline y standalone.

#### Datos y estado
- `Badge` — Etiquetas de material (`.material-tag`), chips de especificación (`.spec-chip`), modo de producción opcional `Bajo pedido` (`.production-tag`) y estados de solicitud (`PENDIENTE DE COTIZACIÓN`, `APROBADO`, etc.). No representar inventario ni disponibilidad inmediata: el catálogo se fabrica después de recibir el pedido.
- `StatusIndicator` — Punto vivo con pulso (`.chat-status i`, `.visual-status i`) para estados en línea y alarmas.
- `PriceTag` — Precio en CRC con moneda y formato mono. Nunca se usa para solicitudes PENDING_QUOTE.
- `MonoLabel` — Texto técnico pequeño en JetBrains Mono (`.mono-label`, coordenadas, índices, referencias PRT).

#### Superficies y contenedores
- `Card` — Superficie base con variantes de radio (sharp 2px, card 6px, hero 12px) y hover con elevación. Se usa para productos, procesos, specs y resumen.
- `Panel` / `Drawer` — Contenedor flotante para chatbot, accesibilidad, menú móvil, búsqueda y cuenta. Incluye: cabecera con título/cierre, cuerpo con scroll, animación de entrada, `aria-hidden`/`aria-expanded`, cierre por Escape y retorno de foco.
- `SectionBlock` — Wrapper de sección con título, subtítulo y mono-label de kicker (patrón `.section` + `.section-heading` + `.mono-label`).

#### Formularios
- `Input` — Campo de texto con label explícito, placeholder, estados (focus, error, disabled) y `aria-describedby` para errores.
- `SearchInput` — Campo de búsqueda con popover de resultados, estado vacío y teclado.
- `Select` — Selector con opciones.
- `Checkbox` / `Switch` — Controles de accesibilidad (`.a11y-toggle`, `.a11y-control-buttons button`) con `aria-checked`/`aria-pressed`.
- `FileDropzone` — Upload de archivos 3D con estados: idle, drag-over, processing, success, error-format, error-size. (Feature de HF-05, pero el componente base se comparte).

#### Navegación
- `NavLink` — Enlace de navegación con underline animado y `aria-current="page"` (`.nav-links a`).
- `BrandLogo` — Isotipo + nombre de marca. Variantes: completo y compacto (solo isotipo).
- `ThemeToggle` — Botón sol/luna con cambio de tema y `aria-label` sincronizado.
- `LanguageToggle` — Selector ES/EN (`.language-toggle`).

#### Feedback
- `Skeleton` — Shimmer de carga para cards de producto, textos y imágenes.
- `EmptyState` — Mensaje de estado vacío con CTA (“No hay productos con estos filtros” + “Limpiar filtros”).
- `ErrorState` — Mensaje de error con acción de reintentar.
- `Toast` / `Notification` — Feedback breve no bloqueante.

#### Tipografía y decoración
- `SectionKicker` — Numeración de sección (`01 / SELECCIÓN DE TALLER`) en mono naranjo.
- `SignalMetric` — Número monoespaciado grande con label debajo (`.signal-value` + `.signal-text`).
- `RevealOnScroll` — Wrapper con `IntersectionObserver` para entrada animada (`.reveal`).

#### Comercio (componentes compartidos entre features)
- `ProductCard` — Compone `Card` + imagen + nombre + descripción + acceso a ficha; el badge de material es opcional por contexto y `Bajo pedido` solo aparece si el contexto lo solicita. No lee `stock` para visibilidad, cantidad o disponibilidad. Referencias y conteos no deben ser datos ficticios.
- `HelpDisclosure` — Inline disclosure con trigger `?` y `aria-expanded`. Definido en `docs/04`.
- `QuoteSummaryPanel` — Resumen lateral de cotización con monto, vigencia y CTA.
- `CartItem` — Base para item de carrito (variantes: catálogo y solicitud personalizada).
- `StepperBar` — Indicador de pasos de checkout con `aria-current="step"`.
- `SinpePaymentBlock` — Bloque de pago SINPE con destino, comprobante y estados.

### `src/styles/`
Tokens, temas y estilos globales derivados de `docs/04`. Incluye variables CSS de la identidad Obsidian Precision Forge + Lava Orgánica, tipografías, motion tokens y clases utilitarias base.

## Dirección de dependencias

La dependencia debe ir hacia abajo:


`app/pages/features → hooks/services/utils → APIs/datos`

Evitar:
- una feature importando lógica interna de otra feature sin contrato claro;
- services importando componentes;
- utils accediendo a React o HTTP;
- páginas haciendo `fetch()` directo;
- componentes calculando reglas críticas de negocio.

## Servicios

auth, products, categories, orders, custom requests, users, metrics, external API, AI y N8N cuando corresponda.

## Flujo

`Page/Component → Feature/Hook → Service → API local/externa/IA/N8N → normalización → UI state`.

## Métricas

db.json → service → funciones puras → dashboard.

Nunca números operativos escritos directamente en un componente de dashboard.

## Seguridad académica

JSON Server + frontend no equivalen a seguridad empresarial. El requisito académico
se implementa con el token `sim.v1` generado en frontend: es una simulación para
demostrar expiración, sesión y guards, no una firma criptográfica ni seguridad de
producción. `jsonServerAuthAdapter` consulta/crea usuarios en JSON Server; el rol
actual se revalida contra los datos locales. N8N no participa en Auth. Contrato y
estado detallado: `docs/07-DATOS-API-AUTH.md`.

## Gate — SUPERADO ✅ (2026-09-30)

Requisitos cerrados antes de iniciar React:
- HF aprobado y congelado;
- Dark/Light definidos;
- accesibilidad definida;
- modelo de negocio estable;
- API/auth definidos;
- contrato de datos listo;
- estrategia de testing preparada.

## Corrección de recorridos y referencias — 2026-10-02

ReferencePicker vive en features/customRequests y comparte búsqueda/selección visual entre QuoteRequestPage y AutomaticQuote. AssistantPanel acepta embedded para cotización: conserva servicio, permisos y estados, pero usa section dentro del flujo; soporte general/Admin conservan Panel. UI no guarda solicitudes ni envía correos mediante este cambio.
