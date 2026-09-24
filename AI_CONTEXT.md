# AI_CONTEXT.md — Vértice CR

> Punto de entrada obligatorio. Si no sabes dónde buscar, abre `docs/00-INDICE-Y-MAPA.md`.

## Producto
Vértice CR es una tienda costarricense de impresión 3D con dos líneas: productos terminados e impresión personalizada con revisión y cotización.

## Estado
Última actualización: 2026-09-24. Rama: `Pruebas`. Fase: auditoría HF + cierre visual/UX. **React permanece bloqueado.**

## Fuente de verdad documental
- `AI_CONTEXT.md`: estado global y decisiones de alto nivel.
- `AGENTS.md`: reglas operativas para agentes.
- `docs/00-INDICE-Y-MAPA.md`: mapa único.
- `docs/01-PRODUCTO-Y-ALCANCE.md`: alcance y rúbrica.
- `docs/02-NEGOCIO-Y-ESTADOS.md`: entidades, reglas y estados.
- `docs/03-UX-Y-FLUJOS.md`: rutas, flujos y estados UX.
- `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md`: identidad, Dark/Light y accesibilidad.
- `docs/05-AUDITORIA-HF-Y-MOCKUPS.md`: hallazgos y pendientes visuales.
- `docs/06-ARQUITECTURA.md`: arquitectura técnica.
- `docs/07-DATOS-API-AUTH.md`: db.json, API externa, JWT y N8N.
- `docs/08-METRICAS-ADMIN-E-IA.md`: dashboard, fórmulas y resumen IA.
- `docs/09-TESTING-Y-CALIDAD.md`: pruebas y cobertura.
- `docs/10-ROADMAP.md`: siguiente trabajo.

`docs/ANTEPROYECTO_FINAL.md`, si se necesita, es el documento académico; no es la fuente diaria de decisiones técnicas.

## Decisiones críticas
- JavaScript/JSX, sin TypeScript.
- Obsidian Precision Forge + Lava Orgánica.
- Dark + Light son requisitos.
- CRC es moneda principal; USD solo como equivalente configurado.
- Home no muestra precios.
- Solicitud personalizada no es producto.
- `PENDING_QUOTE` no tiene precio final, cantidad ni subtotal.
- Solo una cotización aprobada puede pagarse.
- IA orienta; admin confirma precio.
- Admin: KPIs reales, gráficos útiles y resumen IA basado en datos existentes.
- Ayuda accesible y consistente.
- API externa real y JWT deben quedar definidos antes de implementación.
- Mobile 375 y tablet 768 se mockupean después de cerrar desktop.
- No inventar datos, endpoints, capacidades ni métricas.

## Orden de trabajo
1. Corregir HF según auditoría.
2. Cerrar Dark/Light, ayuda y accesibilidad.
3. Cerrar HF-07/HF-08.
4. Ajustar Admin + IA.
5. Definir API externa + JWT.
6. Aprobar desktop.
7. Crear mockups mobile/tablet.
8. Aprobar HF.
9. Design System.
10. Arquitectura/datos/API.
11. React.
12. Testing/integraciones/calidad.

## Regla
Si un documento contradice una decisión posterior, prevalece la decisión posterior registrada aquí y en el documento de dominio. No crear nuevos Markdown si el tema ya tiene un hogar.