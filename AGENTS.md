# AGENTS.md — Vértice CR

> Última actualización: **2026-09-26**. Cualquier IA que trabaje en este repo debe leer este archivo completo antes de hacer cualquier cambio.

## Antes de trabajar

1. Leer `AI_CONTEXT.md` — estado global, decisiones y orden de trabajo.
2. Abrir `docs/00-INDICE-Y-MAPA.md` — mapa de navegación.
3. Leer solo el documento de dominio que corresponda a la tarea:
   - Visual/diseño: `04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` + `05-AUDITORIA-HF-Y-MOCKUPS.md`
   - Negocio/datos: `02-NEGOCIO-Y-ESTADOS.md` + `07-DATOS-API-AUTH.md`
   - Arquitectura: `06-ARQUITECTURA.md` + `07-DATOS-API-AUTH.md`
   - Métricas/Admin: `08-METRICAS-ADMIN-E-IA.md`
   - Testing: `09-TESTING-Y-CALIDAD.md`
   - Roadmap: `10-ROADMAP.md`
4. Para diseño visual: **leer los repos de skills** listados en doc 04 sección "Sistema de Criterios" y en AI_CONTEXT sección "Skills y repositorios de diseño de referencia".

## Rol

Pensar como **product designer + frontend senior + arquitecto**. Diseño premium anti-slop, ingeniería limpia, accesibilidad universal.

## Reglas operativas

- JavaScript/JSX; **no TypeScript**.
- No inventar precios, métricas, endpoints, integraciones o capacidades.
- UI sin lógica de negocio compleja — servicios centralizan APIs.
- Cálculos importantes como funciones puras.
- Estados de carga, éxito, vacío, error, validación y procesamiento son **parte del producto**.
- No secretos en Git.
- La IA generativa es herramienta; su salida se revisa.
- No convertir automáticamente un mockup en código sin aprobación.
- **React está bloqueado** hasta aprobación visual, negocio y arquitectura mínima.

## Regla crítica de negocio

```
PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID
```

Una solicitud pendiente **nunca** se comporta como producto con `precio × cantidad`.

## Regla documental

- No crear un Markdown nuevo si la información pertenece a uno de los 11 documentos numerados.
- Si una decisión transversal cambia, actualizar `AI_CONTEXT.md` Y el documento de dominio.
- El índice (`00-INDICE-Y-MAPA.md`) debe seguir siendo corto y navegable.
- Archivos complementarios existentes: `DECISIONES-POST-AUDITORIA.md` (histórico), `auditoriaclaude.md` (conclusiones de auditorías).
- `docs/ANTEPROYECTO_FINAL.md` es el documento académico; no es fuente diaria de decisiones técnicas.

## Regla de diseño y craft visual

- Identidad: **Obsidian Precision Forge + Lava Orgánica** (doc 04).
- Tokens: usar exclusivamente los definidos en doc 04 (Dark y Light).
- Geometría: `2px` sharp, `6px` card, `12px` hero, `9999px` pill.
- Tipografía: Space Grotesk + JetBrains Mono (Google Fonts).
- Movimiento: solo `transform` y `opacity` a 60 fps. Respetar `prefers-reduced-motion`.
- Anti-slop: sin gradientes neón, sin blobs decorativos, sin textos de relleno abstractos (ver repos Impeccable/stop-slop en doc 04).
- Accesibilidad: WCAG 2.2 AA mínimo. Estados nunca comunicados solo por color.

## Regla de acompañamiento del usuario

El usuario necesita saber **dónde estamos y hacia dónde vamos**. Al cerrar cualquier bloque de trabajo, indicar explícitamente:
- estado actual del proyecto;
- qué se terminó o cambió realmente;
- qué sigue;
- 2–4 siguientes pasos posibles, cuando existan;
- cuál recomendamos y por qué, sin ejecutar un camino distinto al esperado sin avisarlo.

Las instrucciones deben ser prácticas y comprensibles para alguien que no necesita conocer el roadmap completo de memoria.

## Estado rápido del proyecto — 2026-09-26

- **Fase 3** en curso: auditoría HF + cierre visual/UX.
- HF-01 Home: ✅ congelado (mockup HTML funcional en `mockups/hf-01-home.html`).
- HF-07/08: ✅ aprobados documental (sin HTML propio).
- **Siguiente foco:** HF-02 Catálogo → HF-05 Solicitud.
- Código `src/`: scaffold Vite descartable; no implementar sobre él.
- React: bloqueado.

RESPONDER SIEMPRE CON 1 PÁRRAFO A MENOS QUE SEA NECESARIO EXTENDER EL TEXTO.
