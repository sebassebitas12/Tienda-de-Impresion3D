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