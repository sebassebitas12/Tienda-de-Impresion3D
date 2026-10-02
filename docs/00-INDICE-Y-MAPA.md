# Vértice CR — Índice de documentación

> **Última actualización:** 2026-10-02
> **Estado:** ACTIVO  
> **Uso:** mapa rápido para humanos y agentes.

## Arranque de un agente

Lee primero:

1. `AGENTS.md`
2. `AI_CONTEXT.md`
3. este índice
4. el dominio de la tarea
5. el archivo exacto que se va a tocar

Para la primera implementación de React, leer además `01, 02, 03, 04, 06, 07, 09 y 10`.

## Mapa por pregunta

| Necesitas saber | Fuente principal |
|---|---|
| Producto, alcance, roles, rúbrica | `01-PRODUCTO-Y-ALCANCE.md` |
| Entidades, estados, carrito, checkout, cotizaciones | `02-NEGOCIO-Y-ESTADOS.md` |
| Rutas, flujos, navbar, responsive, estados UX | `03-UX-Y-FLUJOS.md` |
| Identidad, tokens, referencias, accesibilidad, motion | `04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` |
| Estado y auditoría de HF/mockups | `05-AUDITORIA-HF-Y-MOCKUPS.md` |
| Arquitectura React y límites entre capas | `06-ARQUITECTURA.md` |
| Datos, API, JWT, N8N, archivos 3D | `07-DATOS-API-AUTH.md` |
| Admin, métricas y IA operativa | `08-METRICAS-ADMIN-E-IA.md` |
| Testing, cobertura y calidad | `09-TESTING-Y-CALIDAD.md` |
| Orden de ejecución y gates | `10-ROADMAP.md` |

## Autoridad documental

La autoridad se resuelve así:

**Usuario → `AGENTS.md` → documento de dominio vigente → `AI_CONTEXT.md` → historial → académico.**

No uses un documento histórico para invalidar una decisión vigente.

`00` solo navega; no define reglas de negocio o diseño.

## Tipos de documentación

### Activa

`01–10` son la base de trabajo. Sus decisiones vigentes deben mantenerse concisas y aplicables directamente.

### Snapshot

`AI_CONTEXT.md` resume el estado actual, decisiones críticas y punto de continuación. No debe convertirse en un diario de sesiones.

### Auditoría / historial

`05-AUDITORIA-HF-Y-MOCKUPS.md` conserva evidencia, hallazgos y evolución de mockups.

El workflow n8n unificado y su guía de importación están en `automation/n8n/`. Los cinco JSON fuente por capacidad son componentes internos para generar/verificar ese único workflow; no se importan por separado. La arquitectura IA vigente está registrada en `docs/07-DATOS-API-AUTH.md`.

`DECISIONES-POST-AUDITORIA.md` y `auditoriaclaude.md` son referencias históricas y deben estar marcadas como tales.

### Académica

`ANTEPROYECTO_FINAL.md` sirve para documentación académica y evidencia formal; no es fuente diaria de implementación.

## Regla documental

No crear otro Markdown para una decisión que ya tenga hogar.

Cada cambio importante debe dejar:
- una decisión durable en el documento de dominio;
- un snapshot breve en `AI_CONTEXT.md`;
- historial detallado solo cuando la evolución lo necesite.
