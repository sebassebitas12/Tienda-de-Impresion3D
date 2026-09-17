# Vértice CR — Decisión de herramientas para exploración visual

> Documento de seguimiento. Complementa `docs/VISUAL-EXPLORATION.md` y registra una decisión posterior de la etapa de exploración.

**Fecha:** 2026-09-17  
**Rama:** `Pruebas`

---

## 1. Decisión registrada

Después de probar el flujo de acceso a Penpot, **Penpot queda descartado para esta etapa del proyecto**.

La razón práctica es que el acceso/uso requerido no resultó viable para el flujo de trabajo actual. No se convertirá en una dependencia del proyecto ni se invertirá más tiempo en configurarlo en esta fase.

Esto no significa que Penpot sea una herramienta técnicamente inadecuada en general; simplemente queda fuera del flujo seleccionado para Vértice CR.

---

## 2. Estado del documento anterior

`docs/VISUAL-EXPLORATION.md` contiene la exploración previa donde Penpot aparecía como primera herramienta a probar.

Este documento debe interpretarse como una **actualización posterior de decisión**:

```text
Exploración inicial
       ↓
Penpot probado
       ↓
Acceso/flujo no viable
       ↓
Penpot descartado
       ↓
Continuar con alternativas
```

No se debe considerar que Penpot sigue siendo una herramienta activa del flujo actual.

---

## 3. Flujo de herramientas actualizado

La exploración continúa con:

```text
Concepto visual
      ↓
Framer
      ↓
Pruebas de movimiento / composición
      ↓
Spline (solo si aporta valor real)
      ↓
Comparación de conceptos
      ↓
Documentación
      ↓
Libro de marca
      ↓
Design system
      ↓
React + CSS
```

Las herramientas siguen siendo medios de experimentación, no decisiones de branding.

---

## 4. MCP de Penpot

La posibilidad de trabajar con Penpot mediante MCP también queda fuera del flujo actual.

No se tratará MCP de Penpot como requisito ni como dependencia del proyecto.

Una futura integración solamente tendría sentido si:

- existe un servidor confiable y compatible
- las capacidades aportan una ventaja clara
- los permisos son razonables
- el flujo resulta estable
- reduce trabajo en lugar de añadir complejidad

Por ahora, **no investigar ni configurar MCP de Penpot como parte del trabajo principal**.

---

## 5. Próximo paso

La siguiente prueba visual debe centrarse en **Framer**.

El primer objetivo sigue siendo validar un Hero de escritorio y comparar tres lenguajes visuales:

### A — Volcanic Flow

Formas orgánicas, capas y profundidad.

### B — Liquid Light

Luz naranja difusa, reflejos y movimiento ambiental.

### C — Mineral Fabric

Textura material, sombras, reflejos y sensación física.

Referencia de composición:

```text
Header

FABRICACIÓN DIGITAL
CON IDENTIDAD PROPIA

Productos impresos + fabricación personalizada

[ Explorar catálogo ]

                 objeto impreso / elemento 3D
```

---

## 6. Principio que se mantiene

La decisión de descartar Penpot **no cambia el principio principal del proyecto**:

> **Probar antes de formalizar.**

Todavía no se debe cerrar:

- paleta definitiva
- lenguaje final de animación
- uso definitivo de 3D
- libro de marca
- design system
- efectos finales de React

Primero se comparan propuestas y se documenta qué recursos funcionan realmente.
