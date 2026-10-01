# Vértice CR — Tienda de Impresión 3D

Frontend escalable para una tienda costarricense de impresión 3D. Combina productos terminados con impresión personalizada y cotización técnica.

> Antes de trabajar: lee `AGENTS.md`. Después usa `AI_CONTEXT.md` y `docs/00-INDICE-Y-MAPA.md` para orientarte.

**Rama de trabajo:** `Pruebas`.

**Estado actual:** Fase 4 — Fundaciones React. React Gate abierto; HF-01 congelado.

**Implementación presente:** React 19 + Vite 8 + JavaScript/JSX, React Router DOM, JSON Server, Jest + Testing Library, UI Kit, App Shell, Home HF-01 y slice académico de autenticación. Home sigue en estabilización visual; Admin e IA/N8N están pendientes.

**Stack del proyecto:** React 19 + Vite 8 + JavaScript/JSX + React Router DOM + JSON Server + Jest + Testing Library. Recharts, API externa, N8N y servicio de IA se incorporan cuando se implementen sus respectivos contratos.

## Documentación

| Documento | Propósito |
|---|---|
| `AGENTS.md` | Reglas operativas para agentes |
| `AI_CONTEXT.md` | Snapshot del estado actual |
| `docs/00-INDICE-Y-MAPA.md` | Navegación y autoridad |
| `docs/01-PRODUCTO-Y-ALCANCE.md` | Producto, roles y alcance |
| `docs/02-NEGOCIO-Y-ESTADOS.md` | Entidades y reglas |
| `docs/03-UX-Y-FLUJOS.md` | Rutas y experiencia |
| `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` | Identidad y accesibilidad |
| `docs/05-AUDITORIA-HF-Y-MOCKUPS.md` | Auditoría y estados de mockups |
| `docs/06-ARQUITECTURA.md` | Arquitectura React |
| `docs/07-DATOS-API-AUTH.md` | Datos, API, auth y N8N |
| `docs/08-METRICAS-ADMIN-E-IA.md` | Admin, métricas e IA |
| `docs/09-TESTING-Y-CALIDAD.md` | Pruebas y calidad |
| `docs/10-ROADMAP.md` | Orden de ejecución |

## Principios

- JavaScript/JSX; no TypeScript.
- Solicitud personalizada sin cotizar = `PENDING_QUOTE`, nunca `₡0`.
- Métricas derivadas de datos reales.
- Servicios centralizan APIs.
- Sin secretos en Git.
- React Gate abierto; seguir el estado y el siguiente bloque de `AI_CONTEXT.md` y `docs/10-ROADMAP.md`.
- HF-01 es el mockup de máxima fidelidad de la Home.

## Desarrollo actual

```bash
npm ci
npm run dev
npm run api
npm run lint
npm test
npm run check:ui
npm run build
```

Ejecuta `npm run dev` y `npm run api` en terminales separadas para iniciar la interfaz y JSON Server.
