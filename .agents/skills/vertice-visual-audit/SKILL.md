---
name: vertice-visual-audit
description: Audita la implementación visual de Vértice CR contra HF-01 y el contrato visual vigente. Úsala cuando el usuario diga "audita", "se ve mal", "hay inconsistencias", "no está fiel", "faltan detalles", "compará con HF-01" o antes de pedir aprobación visual.
compatibility: Proyecto Vértice CR. Requiere acceso al mockup congelado, docs visuales y código React/CSS.
metadata:
  project: vertice-cr
  version: "1.0"
---

# Auditoría visual Vértice CR

## Fuentes obligatorias

Antes de auditar:

1. `AGENTS.md`
2. `AI_CONTEXT.md`
3. `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md`
4. `docs/05-AUDITORIA-HF-Y-MOCKUPS.md`
5. `mockups/hf-01-home-definitivo.html` cuando se audite Home
6. implementación React/CSS real afectada

HF-01 congelado es la referencia visual de máxima fidelidad para Home.

## Orden de auditoría

Busca primero problemas estructurales, después acabado.

### 1. Estructura
- spacing acumulado o duplicado;
- layout/grid/flex incorrectos;
- elementos aprobados ausentes;
- elementos ocultos por breakpoints;
- orden móvil;
- overlays/popovers mal posicionados;
- z-index y stacking contexts.

### 2. Fidelidad de componentes
- header/navbar;
- hero/workbench;
- catálogo/cards;
- chatbot;
- accesibilidad;
- search;
- menú/hamburger;
- footer;
- dark/light.

### 3. CSS real
Compara los selectores del mockup con las clases renderizadas por React.

Busca especialmente:
- clases HF que ya no aplican porque React usa otras clases;
- media queries duplicadas o contradictorias;
- reglas genéricas que pisan reglas específicas;
- atributos de estado sin CSS que los implemente;
- estilos aprobados que quedaron solo dentro del HTML congelado.

### 4. Comportamiento
- hover/focus/active;
- teclado;
- reduced motion;
- idioma;
- contraste;
- cambio de tema;
- persistencia de preferencias;
- paneles desplegables.

### 5. Responsive
Revisar como mínimo:
- 1280 px;
- 768 px;
- 375 px.

Mobile es reinterpretación, no reducción mecánica.

## Evidencia

Distingue siempre:

- **Hallazgo estático confirmado:** demostrado por código/mockup.
- **Hallazgo visual confirmado:** demostrado por render/captura/browser.
- **Hipótesis visual:** necesita render para confirmarse.

Sin navegador o captura no digas "verificado visualmente".

## Priorización

Entrega hallazgos en este orden:

1. bloqueo/ruptura;
2. contradicción directa con HF-01;
3. inconsistencia visual fuerte;
4. accesibilidad/estado;
5. polish.

Corrige causas raíz antes que parches cosméticos.

## Después de corregir

- ejecuta tests/lint/build disponibles;
- actualiza `docs/05` con defectos relevantes y resolución;
- actualiza `AI_CONTEXT.md` con estado y siguiente bloque;
- el usuario solo tiene que aprobar o rechazar el resultado.
