---
name: vertice-continuity
description: Resume y continúa trabajo en Vértice CR desde el estado real del repositorio. Úsala cuando el usuario diga "seguimos", "continúa", "retoma", "donde quedamos", "cerrá la capa", "seguí con Home/Tienda" o pida continuar sin repetir contexto.
compatibility: Proyecto Vértice CR. Requiere acceso al repositorio y lectura de Markdown/código.
metadata:
  project: vertice-cr
  version: "1.0"
---

# Continuidad Vértice CR

## Objetivo

Permitir que el usuario dé una intención corta y que el agente recupere por sí mismo el contexto operativo correcto.

El usuario no debe reconstruir contexto, repetir stack, explicar el roadmap ni volver a listar decisiones ya documentadas.

## Fuente de verdad

Antes de actuar:

1. Lee `AGENTS.md`.
2. Lee `AI_CONTEXT.md`.
3. Lee `docs/00-INDICE-Y-MAPA.md`.
4. Lee `docs/10-ROADMAP.md` si la petición implica continuidad o avance de fase/capa.
5. Lee únicamente los documentos de dominio aplicables.
6. Inspecciona los archivos reales que vas a modificar.

Respeta la jerarquía de autoridad definida en `AGENTS.md`.

## Flujo obligatorio

**Entender → Inspeccionar → Contrastar → Planificar → Implementar → Verificar → Documentar → Entregar**

Cuando el usuario diga simplemente `seguimos`, `continúa` o equivalente:

1. detecta la capa actual desde `AI_CONTEXT.md` + `docs/10-ROADMAP.md`;
2. identifica el primer bloque pendiente real;
3. confirma que no contradice una decisión vigente;
4. trabaja ese bloque sin pedir al usuario que repita contexto;
5. verifica lo verificable;
6. documenta el nuevo estado en su documento de dominio y en `AI_CONTEXT.md`;
7. no saltes a la siguiente capa hasta que la actual cumpla su Definition of Done.

## Rol del usuario

El usuario:
- define intención;
- aporta recursos/datos que solo él posee;
- aprueba o rechaza resultados visuales/funcionales.

El agente:
- inspecciona;
- decide el procedimiento técnico;
- implementa;
- revisa;
- prueba;
- corrige;
- documenta.

No conviertas al usuario en QA técnico ni le devuelvas trabajo que el agente puede realizar.

## Gotchas

- Rama activa de trabajo: `Pruebas`, salvo instrucción explícita contraria.
- No asumir que algo está terminado porque "ya se ve".
- No inventar verificaciones, datos o resultados.
- No pedir aclaraciones si el repo ya contiene la respuesta.
- No convertir `AI_CONTEXT.md` en diario; historial detallado va al documento de dominio.
- Si una tarea visual necesita aprobación humana, el agente prepara una versión técnicamente revisada y el usuario solo decide aprobar/no aprobar.
