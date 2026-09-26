# AI_CONTEXT.md — Vértice CR

> Punto de entrada obligatorio para cualquier IA. Si no sabes dónde buscar, abre `docs/00-INDICE-Y-MAPA.md`.
> Última actualización: **2026-09-26**.

## Producto

Vértice CR es una tienda costarricense de impresión 3D con dos líneas: productos terminados e impresión personalizada con revisión y cotización.

## Estado del proyecto — 2026-09-26

| Dato | Valor |
|---|---|
| Rama activa | `Pruebas` |
| Fase | 3 — auditoría HF + cierre visual/UX |
| React | **BLOQUEADO** hasta cierre de HF desktop + Design System + API/JWT |
| Mockup HTML oficial | Solo `mockups/hf-01-home.html` (aprobado y congelado 2026-09-25) |
| HF-07 / HF-08 | Aprobados a nivel documental (imágenes UXMagic + validación Gemini, sin HTML propio) |
| Siguiente foco de mockups | HF-02 Catálogo → HF-05 Solicitud con archivo |
| Código en `src/` | Scaffold Vite + prototipo estático descartable — NO es base de implementación |
| `db.json` | JSON válido, pero `r5` usa `SUBMITTED` en vez de `PENDING_QUOTE` (normalizar antes de React) |

## Fuente de verdad documental

| Archivo | Qué contiene |
|---|---|
| `AI_CONTEXT.md` | **Este archivo.** Estado global, decisiones de alto nivel, punto de entrada. |
| `AGENTS.md` | Reglas operativas para agentes. Leer siempre. |
| `docs/00-INDICE-Y-MAPA.md` | Mapa de navegación (tabla "Si te preguntan → Busca en"). |
| `docs/01-PRODUCTO-Y-ALCANCE.md` | Alcance, roles, MoSCoW y principios. |
| `docs/02-NEGOCIO-Y-ESTADOS.md` | Entidades, reglas de negocio, ciclo de solicitudes, carrito y checkout. |
| `docs/03-UX-Y-FLUJOS.md` | Rutas, flujos, estados UX, navbar/footer y responsive. |
| `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` | Identidad visual, tokens Dark/Light, accesibilidad WCAG 2.2, ayuda inline, movimiento, benchmark y **repositorios de skills de diseño**. |
| `docs/05-AUDITORIA-HF-Y-MOCKUPS.md` | Estado de cada HF (17 pantallas), hallazgos y pendientes visuales. |
| `docs/06-ARQUITECTURA.md` | Estructura técnica objetivo. Esqueleto. |
| `docs/07-DATOS-API-AUTH.md` | db.json, API externa, JWT, N8N e IA. |
| `docs/08-METRICAS-ADMIN-E-IA.md` | Dashboard, KPIs, fórmulas y resumen IA. |
| `docs/09-TESTING-Y-CALIDAD.md` | Jest, cobertura y orden de pruebas. |
| `docs/10-ROADMAP.md` | Secuencia de trabajo y gates. |

### Archivos complementarios (no numerados)

| Archivo | Propósito |
|---|---|
| `docs/DECISIONES-POST-AUDITORIA.md` | Registro histórico de decisiones post-auditoría (2026-09-24). Refs corregidas 2026-09-26. |
| `docs/auditoriaclaude.md` | Archivo de trabajo para conclusiones de auditorías de Claude. |
| `docs/ANTEPROYECTO_FINAL.md` | Documento académico de FWD Academy. No es fuente diaria de decisiones técnicas. |

## Decisiones críticas vigentes — 2026-09-26

1. JavaScript/JSX, sin TypeScript.
2. Obsidian Precision Forge + Lava Orgánica (no son dos identidades separadas).
3. Dark + Light son requisitos. Tokens definidos en doc 04.
4. CRC es moneda principal; USD solo como equivalente configurado con fuente de tipo de cambio.
5. Home no muestra precios.
6. Solicitud personalizada NO es producto — nunca usa `quantity × unitPrice`.
7. `PENDING_QUOTE` no tiene precio final, cantidad ni subtotal.
8. Solo una cotización aprobada puede pagarse.
9. IA orienta; admin confirma precio. Etiqueta: `ORIENTATIVO · SUJETO A VALIDACIÓN`.
10. Admin: KPIs reales, gráficos útiles y resumen IA basado en datos existentes.
11. Ayuda accesible e inline (HelpDisclosure), no modales de pantalla completa.
12. API externa real y JWT deben quedar definidos antes de implementación.
13. Mobile 375 y tablet 768 se mockupean después de cerrar desktop.
14. No inventar datos, endpoints, capacidades ni métricas.
15. Navbar público de Stitch conservado como base visual; cambios quirúrgicos solamente.
16. Footer completo es para páginas públicas; dashboards pueden omitirlo.
17. React puede consumir un Webhook de N8N directamente para chatbot y resumen IA.

## Regla de ciclo de solicitudes (crítica)

```
PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID
```

Salidas: `REJECTED`, `EXPIRED`, `CANCELLED`.

## Skills y repositorios de diseño de referencia

Los siguientes repositorios están documentados en `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` (sección "Sistema de Criterios") y definen las reglas de craft, movimiento, anti-slop y accesibilidad del proyecto:

| Skill | Repo / Fuente | Aplicación |
|---|---|---|
| Físicas de animación | [Emil Kowalski / skills](https://github.com/emilkowalski/skills) | Curvas, tiempos, `will-change`, 60 fps, `prefers-reduced-motion` |
| Craft anti-slop | [Impeccable](https://github.com/pbakaus/impeccable) + [stop-slop](https://github.com/hardikpandya/stop-slop) | Prohibiciones de clichés, narrativa editorial, craft visual |
| Layout y tokens | [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) + [taste-skill](https://github.com/senlindesign/taste-skill) + [design.md](https://github.com/google-labs-code/design.md) | Geometría, paleta, spotlight interactivo |
| Accesibilidad | [W3C WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) + [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) | WCAG 2.2 AA, patrones de teclado, contraste |
| Copywriting técnico | [Humanizer](https://github.com/blader/humanizer) | Voz de taller costarricense, sin clichés de IA |
| Referencia visual | [Godly](https://godly.design/) + [Awwwards](https://www.awwwards.com/) + [Refero](https://styles.refero.design/) + [React Bits](https://reactbits.dev/) | Dirección de arte, componentes, dark mode industrial |

**Al diseñar o iterar cualquier pantalla, consultar estos repos y aplicar los criterios documentados en doc 04.**

## Orden de trabajo vigente — 2026-09-26

1. ~~Corregir HF según auditoría.~~ ✅ HF-01 congelado (HTML), HF-07/08 aprobados (documental).
2. ~~Cerrar Dark/Light, ayuda y accesibilidad.~~ ✅ Definidos en doc 04.
3. **→ Iterar HF-02 Catálogo.** ← ESTAMOS AQUÍ
4. Iterar HF-05 Solicitud con archivo (visor 3D real).
5. Completar pantallas restantes desktop (HF-03, 06, 09–17).
6. Ajustar Admin + IA (HF-10/11).
7. Definir API externa + JWT concretamente.
8. Aprobar desktop completo.
9. Mockups mobile 375 / tablet 768.
10. Design System formal.
11. Arquitectura/datos/API/contratos.
12. React.
13. Testing/integraciones/calidad.

## Regla de precedencia

Si un documento contradice una decisión posterior, prevalece la decisión posterior registrada aquí y en el documento de dominio. No crear nuevos Markdown si el tema ya tiene un hogar en los 11 documentos numerados.

## Regla de acompañamiento

Al cerrar cualquier bloque de trabajo, indicar:
- estado actual del proyecto;
- qué se terminó o cambió;
- qué sigue;
- 2–4 opciones posibles;
- cuál se recomienda y por qué.

RESPONDER SIEMPRE CON 1 PÁRRAFO A MENOS QUE SEA NECESARIO EXTENDER EL TEXTO.