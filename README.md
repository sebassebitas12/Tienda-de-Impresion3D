# Vértice CR — Tienda de Impresión 3D

Frontend escalable para una tienda costarricense de impresión 3D. Combina productos terminados con impresión personalizada y cotización técnica.

> Antes de trabajar: lee `AGENTS.md`. Después usa `AI_CONTEXT.md` y `docs/00-INDICE-Y-MAPA.md` para orientarte.

**Rama de trabajo:** `Pruebas`.

**Estado actual:** Fase 3 — cierre visual/UX de HF-01. React bloqueado.

**Scaffold actual:** React 19 + Vite 8 + JavaScript/JSX + ESLint. El scaffold todavía no contiene router, JSON Server, Recharts, Jest ni Testing Library; esas piezas pertenecen al stack objetivo y se incorporarán durante el preflight/gate de React.

**Stack objetivo documentado:** React 19 + Vite 8 + JavaScript/JSX + React Router DOM + JSON Server + Jest + Testing Library + Recharts + N8N + API externa + servicio de IA.

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
- No implementar React hasta superar el gate documentado.
- HF-01 es el mockup de máxima fidelidad de la Home.

## Desarrollo actual

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Testing

Los scripts de testing se incorporarán durante el preflight de React según `docs/09-TESTING-Y-CALIDAD.md`. **No ejecutar `npm run test` hasta que el script exista en `package.json`.**