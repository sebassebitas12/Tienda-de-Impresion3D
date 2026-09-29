# AGENTS.md — Vértice CR

> Última actualización: **2026-09-29**. Cualquier IA que trabaje en este repo debe leer este archivo completo antes de hacer cualquier cambio.

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
- **Documentar es parte obligatoria de cada bloque de trabajo, no una tarea opcional ni algo que se haga solo si el usuario lo pide.** Al tomar una decisión, cambiar código/diseño, investigar una referencia que afecte el producto, verificar un resultado o dejar trabajo pendiente, actualizar en ese mismo bloque `AI_CONTEXT.md` y el documento de dominio correspondiente. No esperar al final del chat ni a que el usuario lo recuerde.
- Para HF-01, registrar decisiones y resultado real en `docs/05-AUDITORIA-HF-Y-MOCKUPS.md`; mantener los criterios visuales reutilizables y las referencias que los fundamentan en `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md`. Actualizar el resumen/estado y punto exacto para retomar en `AI_CONTEXT.md`.
- HF-01 es la especificación visual de referencia más fiel de la página: documentar no solo marca y colores, sino composición, navbar, enlaces, botones, ventanas y overlays, geometría, tipografía, espaciado, iconos, estados, interacciones, comportamiento responsive y accesibilidad. Lo que se construya en React debe reproducir las decisiones aprobadas del mockup, sin reinterpretarlas ni sustituirlas por componentes genéricos. Si algo todavía no está aprobado, señalarlo como pendiente, no como contrato cerrado.
- Diferenciar claramente lo implementado y verificado, lo decidido pero pendiente de implementar y lo aún no aprobado. Registrar referencias concretas consultadas y qué criterio se adaptó cuando hayan influido en el resultado; nunca afirmar una consulta o verificación que no ocurrió.
- Mantener las actualizaciones concisas y en el documento existente de dominio; no crear un Markdown por cada mensaje ni duplicar el historial completo. Al cerrar cada bloque, comprobar que otro agente pueda saber qué cambió, qué falta y dónde continuar sin depender del chat.
- El índice (`00-INDICE-Y-MAPA.md`) debe seguir siendo corto y navegable.
- Archivos complementarios existentes: `DECISIONES-POST-AUDITORIA.md` (histórico), `auditoriaclaude.md` (conclusiones de auditorías).
- `docs/ANTEPROYECTO_FINAL.md` es el documento académico; no es fuente diaria de decisiones técnicas.

## Regla de diseño, craft visual y creatividad (¡LIBERTAD CREATIVA!)

- **Creatividad Visual:** Aunque el orden de ejecución (el *qué* hacer) es estricto y de orden militar, **el diseño visual (el *cómo* se ve) NO está limitado**. Se espera y se fomenta la exploración de CSS, nuevas animaciones, layouts creativos y el uso intensivo de los repositorios de referencia (Godly, Awwwards, Emil Kowalski, etc.) para elevar HF-01.
- Identidad base: **Obsidian Precision Forge + Lava Orgánica** (doc 04), pero se puede iterar y expandir.
- Tokens: usar los definidos en doc 04, pero se pueden proponer mejoras.
- Geometría base: `2px` sharp, `6px` card, `12px` hero, `9999px` pill.
- Tipografía: Space Grotesk + JetBrains Mono (Google Fonts).
- Movimiento: se buscan animaciones fluidas a 60 fps (`transform` y `opacity`), interacciones de hover vivas, y micro-animaciones que den sensación de "premium" y tecnología (siempre respetando `prefers-reduced-motion`).
- Anti-slop: sin gradientes neón genéricos ni texto relleno. Diseños intencionales.
- Accesibilidad: WCAG 2.2 AA mínimo.

## Regla de acompañamiento del usuario

El usuario necesita saber **dónde estamos y hacia dónde vamos**. Al cerrar cualquier bloque de trabajo, indicar explícitamente:
- estado actual del proyecto;
- qué se terminó o cambió realmente;
- qué sigue;
- 2–4 siguientes pasos posibles, cuando existan;
- cuál recomendamos y por qué, sin ejecutar un camino distinto al esperado sin avisarlo.

Las instrucciones deben ser prácticas y comprensibles para alguien que no necesita conocer el roadmap completo de memoria.

## Estado rápido del proyecto — 2026-09-26

- **Fase 3** en curso: cierre visual/UX de HF-01.
- HF-01 Home: 🟡 **EN ITERACIÓN (NO CONGELADO)**. Es el único mockup HTML que se trabajará.
- HF-07/08: ✅ aprobados documental (sin HTML propio).
- **Siguiente foco:** Ninguno aparte de terminar HF-01. Luego se pasa directamente a React.
- Código `src/`: scaffold Vite descartable; no implementar sobre él.
- React: bloqueado.

RESPONDER SIEMPRE CON 1 PÁRRAFO A MENOS QUE SEA NECESARIO EXTENDER EL TEXTO.
