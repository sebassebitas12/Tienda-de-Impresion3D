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

## Servicios

auth, products, categories, orders, custom requests, users, metrics, external API, AI y N8N cuando corresponda.

## Flujo

Component/Page → Hook/Feature → Service → API local/externa/IA/N8N → normalización → UI state.

## Métricas

db.json → service → funciones puras → dashboard.

Nunca números operativos escritos directamente en Dashboard.jsx.

## Seguridad académica

JSON Server + frontend no equivalen a seguridad empresarial. JWT se incorporará como requisito académico de autenticación/autorización, con responsabilidades separadas.

## Gate

No implementar React hasta:
- HF aprobado;
- Dark/Light definidos;
- accesibilidad definida;
- modelo de negocio estable;
- API/auth definidos;
- contrato de datos listo.
