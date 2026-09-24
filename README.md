# Vértice CR — Tienda de Impresión 3D

Frontend escalable para una tienda costarricense de impresión 3D. Combina productos terminados con impresión personalizada y cotización técnica.

> Antes de trabajar: lee `AI_CONTEXT.md`. Si buscas un tema concreto, abre `docs/00-INDICE-Y-MAPA.md`.

**Stack:** React 19 + Vite 8 + JavaScript/JSX + React Router DOM + JSON Server + Jest + Testing Library + Recharts.

**Rama de trabajo:** `Pruebas`.

**Estado:** Fase 3 — auditoría HF y cierre visual/UX. React bloqueado.

## Documentación

Los documentos están organizados por dominio para evitar buscar la misma información en varios Markdown:

| Documento | Para qué sirve |
|---|---|
| `AI_CONTEXT.md` | Estado y decisiones globales |
| `AGENTS.md` | Reglas para agentes |
| `docs/00-INDICE-Y-MAPA.md` | Dónde encontrar cada cosa |
| `docs/01-PRODUCTO-Y-ALCANCE.md` | Producto, roles, alcance y rúbrica |
| `docs/02-NEGOCIO-Y-ESTADOS.md` | Entidades, cotizaciones, pedidos y reglas |
| `docs/03-UX-Y-FLUJOS.md` | Rutas, flujos, estados UX y responsive |
| `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` | Identidad, Dark/Light, ayuda y accesibilidad |
| `docs/05-AUDITORIA-HF-Y-MOCKUPS.md` | Auditoría, bloqueadores y mockups |
| `docs/06-ARQUITECTURA.md` | Estructura técnica y capas |
| `docs/07-DATOS-API-AUTH.md` | db.json, API externa, JWT y N8N |
| `docs/08-METRICAS-ADMIN-E-IA.md` | KPIs, gráficos y resumen IA |
| `docs/09-TESTING-Y-CALIDAD.md` | Tests y cobertura |
| `docs/10-ROADMAP.md` | Orden de trabajo |

## Principios
- JavaScript/JSX; no TypeScript.
- Solicitud personalizada sin cotizar = `PENDING_QUOTE`, nunca ₡0.
- Métricas derivadas de datos reales.
- Servicios centralizan APIs.
- Sin secretos en Git.
- React empieza después de aprobar negocio, HF, accesibilidad, temas y contratos técnicos.

## Desarrollo
~~~bash
npm install
npm run dev
npx json-server --watch db.json --port 3001
~~~

## Testing
~~~bash
npm run test
npm run test:watch
npm run test:coverage
~~~