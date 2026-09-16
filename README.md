# Vértice CR — Tienda de Impresión 3D

Frontend escalable para una tienda real de impresión 3D costarricense. El proyecto combina catálogo de productos terminados con un servicio de impresión personalizada y está diseñado para evolucionar después del curso.

> **Lee `AI_CONTEXT.md` antes de trabajar en este repo.** Ese archivo dice exactamente en qué fase está el proyecto y cuál es el siguiente paso.

**Stack base:** React 19 + Vite 8 + JavaScript/JSX + React Router DOM + JSON Server.

**Rama de trabajo actual:** `Pruebas`.

**Deadline anteproyecto:** 21 de septiembre de 2026.

## Identidad

**Nombre comercial:** Vértice CR
**Valores:** confianza, seguridad, calidad, "encontrarás lo que necesitás"
**Personalidad:** taller creativo de alta tecnología con identidad costarricense
**Tema:** Dark mode por defecto con toggle a light
**Paleta principal:** negro azulado profundo + cian eléctrico (`#00D4FF`)
**Tipografías:** Space Grotesk (interfaz) + JetBrains Mono (datos técnicos)

## Modelo de negocio

### Productos terminados

Catálogo de gadgets, figuras, juguetes, decoración y piezas funcionales con variantes, disponibilidad e inventario.

### Impresión personalizada

El cliente puede cargar un archivo `.stl` / `.obj` o solicitar ayuda para definir una pieza. La solicitud pasa por revisión y cotización antes de convertirse en una operación de producción.

Una solicitud personalizada no se trata como una venta de ₡0: mientras no exista una cotización, su estado económico es `PENDING_QUOTE`.

## Integración de IA

**Asistente de cotización** integrado en la página de solicitud personalizada. El cliente describe en lenguaje natural lo que quiere imprimir y el asistente recomienda material, dimensiones aproximadas, tiempo estimado y rango de precio orientativo — aclarando siempre que el precio final lo confirma el administrador. Implementado en `src/services/aiService.js`.

## Arquitectura

```text
UI
 ↓
Pages / Features
 ↓
Hooks + Services + Utils
 ↓
JSON Server / APIs externas / API de IA
 ↓
db.json
```

Las métricas siguen el mismo principio:

```text
db.json → services → funciones puras de métricas → dashboard
```

No se escriben manualmente las ventas, pedidos, clientes, stock ni tendencias que presenta el panel.

## Dashboard administrativo

Organizado por familias de métricas calculadas desde `db.json` con funciones puras. Librería de gráficos: **Recharts**.

- ventas y resultados
- inventario y eficiencia
- operación de pedidos
- impresión personalizada
- alertas y deficiencias operativas

Las fórmulas están documentadas en [`docs/METRICS.md`](docs/METRICS.md).

## Documentación

| Documento | Propósito |
|---|---|
| [`AI_CONTEXT.md`](AI_CONTEXT.md) | Estado actual del proyecto — leer primero |
| [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) | Requisitos, MoSCoW, criterios de aceptación |
| [`docs/BUSINESS-LOGIC.md`](docs/BUSINESS-LOGIC.md) | Entidades, estados, reglas de negocio |
| [`docs/METRICS.md`](docs/METRICS.md) | KPIs, fórmulas, gráficos y alertas |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Estructura técnica y responsabilidades |
| [`docs/TESTING.md`](docs/TESTING.md) | Estrategia Jest + cobertura mínima 70% |
| [`docs/fase2_investigacion_direccion_visual.md`](docs/fase2_investigacion_direccion_visual.md) | Paleta, tipografía, personalidad de marca |
| [`docs/fase3_ux_user_flows_mockup.md`](docs/fase3_ux_user_flows_mockup.md) | Flujos de usuario y wireframes |

## Rúbrica integrada

- React + React Router DOM
- Componentes y páginas separados
- `services/` para API local, externa y IA
- JSON Server con `db.json`
- Login, registro, sesión y rutas privadas
- Roles: cliente y administrador
- CRUDs: productos, categorías, clientes, pedidos, solicitudes
- Dashboard con métricas derivadas y gráficos (Recharts)
- Jest + Testing Library (cobertura mínima 70%)
- Integración de IA: asistente de cotización
- Dos flujos N8N
- Responsive: 375px, 768px, 1280px+
- Accesibilidad: tema claro/oscuro, texto ajustable, ARIA, estados sin depender solo del color

## Desarrollo

```bash
npm install
npm run dev
npx json-server --watch db.json --port 3001
```

## Testing

```bash
npm run test
npm run test:watch
npm run test:coverage
```

Los tests nunca realizan peticiones HTTP reales.

## Principios permanentes

1. JavaScript/JSX; no TypeScript.
2. La UI no contiene reglas de negocio complejas.
3. Los servicios centralizan las peticiones.
4. Los cálculos importantes son funciones puras y testeables.
5. Ninguna métrica operativa se hardcodea.
6. Una solicitud personalizada sin cotizar siempre es `PENDING_QUOTE`, nunca ₡0.
7. Los errores, cargas y estados vacíos forman parte del producto.
8. No se suben secretos al repositorio.
9. El código generado con IA se revisa, prueba y justifica.
10. La rama estable no se rompe; el trabajo nuevo se valida antes de mergear.
