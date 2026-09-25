# AGENTS.md — Vértice CR

## Antes de trabajar
1. Leer `AI_CONTEXT.md`.
2. Abrir `docs/00-INDICE-Y-MAPA.md`.
3. Leer solo el documento de dominio que corresponda.
4. Visual: 04 + 05.
5. Negocio/datos: 02 + 07.
6. Arquitectura: 06 + 07.
7. Métricas/Admin: 08.
8. Testing: 09.

## Reglas
- Pensar como product designer + frontend senior + arquitecto.
- No inventar precios, métricas, endpoints, integraciones o capacidades.
- JavaScript/JSX; no TypeScript.
- UI sin lógica de negocio compleja.
- Servicios centralizan APIs.
- Cálculos importantes como funciones puras.
- Estados de carga, éxito, vacío, error, validación y procesamiento son parte del producto.
- No secretos en Git.
- La IA generativa es herramienta; su salida se revisa.
- No convertir automáticamente un mockup en código.
- React está bloqueado hasta aprobación visual, negocio y arquitectura mínima.

## Regla crítica
`PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID`.
Una solicitud pendiente nunca se comporta como producto con precio × cantidad.

## Regla documental
No crear un Markdown nuevo si la información pertenece a uno de los 11 documentos numerados. Si una decisión transversal cambia, actualizar AI_CONTEXT y el documento de dominio. El índice debe seguir siendo corto y navegable.

## Regla de acompañamiento del usuario

El usuario necesita saber **dónde estamos y hacia dónde vamos**. Al cerrar cualquier bloque de trabajo relevante, indicar explícitamente:
- estado actual del proyecto;
- qué se terminó o cambió realmente;
- qué sigue;
- 2–4 siguientes pasos posibles, cuando existan;
- cuál recomendamos y por qué, sin ejecutar un camino distinto al esperado sin avisarlo.

Las instrucciones deben ser prácticas y comprensibles para alguien que no necesita conocer el roadmap completo de memoria.

## Fuentes externas de diseño y desarrollo

Los agentes pueden consultar la biblioteca de referencias registrada en `docs/05-AUDITORIA-HF-Y-MOCKUPS.md` cuando una tarea necesite mejorar diseño, UX, motion, componentes o revisión de código.

- Buscar primero patrones, decisiones y herramientas relevantes en esas fuentes; no asumir que todas aplican al proyecto.
- Usar los repositorios como investigación y material de trabajo, no como permiso para copiar una página completa o introducir una dependencia sin revisión.
- Antes de instalar una skill, librería o CLI, informar qué aporta, revisar licencia, impacto en el stack y necesidad real. No instalar automáticamente.
- Traducir las ideas al sistema existente: JavaScript/JSX, tokens oficiales, Dark/Light, WCAG 2.2 AA, `prefers-reduced-motion` y estados del producto.
- No usar una referencia externa para contradecir las reglas de negocio, el gate de React, la reserva de WebGL para HF-03/HF-05 o la prohibición de inventar datos.
- Si una decisión visual se inspira claramente en una fuente, documentar la adaptación y validar que siga perteneciendo a Vértice CR.
