# Vértice CR — Arquitectura

> Última actualización: **2026-09-24**.

## Principio

UI → Pages/Features → Hooks/Services/Utils → APIs → datos.

La UI no accede directamente a JSON Server ni contiene reglas de negocio complejas.

## Stack

React 19, Vite 8, JavaScript/JSX, React Router DOM, JSON Server, Jest + Testing Library, Recharts, N8N, API externa y servicio de IA.

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

### `src/utils/`
Funciones puras, validaciones y cálculos sin efectos secundarios.

### `src/components/`
Solo piezas realmente compartidas entre dominios. Una pieza propia de una feature debe permanecer en su feature.

### `src/styles/`
Tokens, temas y estilos globales derivados de `docs/04`.

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

JSON Server + frontend no equivalen a seguridad empresarial. JWT se incorporará como requisito académico de autenticación/autorización, con responsabilidades separadas.

## Gate

No implementar React hasta:
- HF aprobado;
- Dark/Light definidos;
- accesibilidad definida;
- modelo de negocio estable;
- API/auth definidos;
- contrato de datos listo;
- estrategia de testing preparada.
