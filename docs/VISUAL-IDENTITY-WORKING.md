# Vértice CR — Identidad visual vigente

> Fuente visual de trabajo: dirección, principios, tokens experimentales y evolución hacia el Design System.

**Fecha:** 2026-09-19  \
**Rama:** `Pruebas`  \
**Estado:** 🔄 En construcción

## 1. Propósito

Vértice CR utiliza herramientas generativas como aceleradores de exploración visual. La fuente de verdad es la documentación revisada por el desarrollador.

La regla de trabajo:

```
Generación rápida
↓
Auditoría
↓
Identidad Vértice
↓
Refinamiento
↓
Interacción
↓
Animación
↓
Responsive
↓
Validación
↓
Documentación
```

Una salida generada por IA no es una decisión aprobada hasta documentar qué se conserva, mejora, reemplaza o elimina.

---

## 2. Dirección actual de trabajo

### Ruta Obsidian Precision Forge + Lava Orgánica

**Estado:** 🔄 Base de trabajo para HF-01; identidad final pendiente.

Características actualmente adoptadas para la exploración:

- fondos carbón/obsidiana;
- naranja/lava como acento;
- formas fluidas y orgánicas;
- profundidad espacial;
- materialidad inspirada en plástico premium y superficies volcánicas;
- iluminación cálida controlada;
- precisión técnica dentro de una composición orgánica;
- productos físicos como protagonistas;
- lenguaje premium pero accesible.

La ruta no debe convertirse en una estética de "lava" literal o fantástica. El concepto es una traducción visual de precisión + materialidad + calidez.

---

## 3. Paleta experimental vigente

```
--bg:        #0D0B09  /* carbón volcánico */
--surface:   #141412  /* obsidiana */
--surface-2: #1E1C19  /* ceniza oscura */
--accent:    #FF5A1F  /* lava */
--magma:     #E03D00  /* magma */
--ember:     #FF8C5A  /* brasa */
--text:      #EDE8E0  /* papel volcánico */
--muted:     #6B6560  /* humo */
--border:    #2A2420  /* escoria */
```

**No son tokens definitivos.** No trasladarlos a implementación como design system final todavía.

---

## 4. HF-01 como primera aplicación de la dirección

La primera aplicación propia de Lava Orgánica es **HF-01 Home Desktop**.

### Decisiones de composición

- Navbar sticky, translúcido y con blur.
- Hero dividido: comunicación a la izquierda y producto/showcase a la derecha.
- Showcase oval/orgánico como protagonista visual único.
- Sin cards de productos en Home.
- Precision con cuatro bloques técnicos.
- Process con cuatro pasos conectados por una línea SVG orgánica.
- Print CTA como experiencia guiada.
- Footer simple.

### Decisiones de producto

El showcase debe representar objetos físicos de impresión 3D, no hologramas ni formas abstractas sin relación con el negocio.

Hasta disponer de fotografía/render final, los placeholders se consideran temporales.

---

## 5. Auditoría de recursos de la iteración

| Recurso | Estado | Motivo |
|---|---|---|
| Ruta 02 Lava Orgánica | **CONSERVAR** | Es la dirección seleccionada para continuar trabajando |
| Fondo carbón/obsidiana | **CONSERVAR** | Refuerza profundidad y materialidad |
| Naranja/lava | **CONSERVAR** | Funciona como fuente de atención; no debe dominar |
| Formas orgánicas | **CONSERVAR** | Diferencian la ruta de una estética técnica genérica |
| Showcase oval | **CONSERVAR / MEJORAR** | Es el protagonista visual de Home; necesita más profundidad |
| Iluminación naranja perimetral | **MEJORAR** | Referencia útil de Gemini, debe mantenerse controlada |
| Glow ambiental hero | **MEJORAR** | Debe ser más perceptible sin saturar |
| Placeholders geométricos | **REEMPLAZAR** | Son temporales; se requieren productos visualmente creíbles |
| H1 actual | **MEJORAR** | Explorar mayor presencia en desktop |
| Cards de productos en Home | **ELIMINAR** | Decisión: catálogo será responsable de mostrar productos en cards |
| Cyan eléctrico | **REEMPLAZAR** | Corresponde a una exploración histórica de Fase 2 |
| Emojis como UI | **ELIMINAR** | No corresponden al lenguaje visual definido |
| Efectos gamer/partículas | **ELIMINAR** | No aportan identidad ni función |
| Datos/métricas sin validación | **MEJORAR** | Deben verificarse antes de tratarlos como capacidades reales |

---

## 6. Movimiento

Para HF-01:

- showcase vertical: movimiento continuo y controlable;
- pausa al hover;
- microinteracciones claras en CTAs;
- iluminación ambiental sutil;
- reduced motion obligatorio;
- no añadir movimiento decorativo solo para demostrar capacidad técnica.

---

## 7. Criterio visual

La calidad se evalúa como:

```
Identidad
+
Composición
+
Jerarquía
+
Interacción
+
Movimiento
+
Accesibilidad
+
Responsive
+
Rendimiento
```

El objetivo es aumentar intención visual, no cantidad de efectos.

---

## 8. Roadmap de cierre

```text
Auditoría HF → validación visual → tokens definitivos → Design System → implementación
```

La identidad no se considera cerrada hasta validar Home, catálogo, producto, cotización, carrito, checkout, cuenta y administración en desktop/mobile, estados y accesibilidad.

## 9. Estado

**Identidad visual definitiva:** pendiente.  
**Ruta 02 Lava Orgánica:** base de trabajo actual.  
**HF-01 Desktop:** base funcional en refinamiento.  
**HF-01 Mobile:** pendiente.  
**HF-02:** pendiente.  
**HF-13:** pendiente.  
**Libro de marca:** pendiente.  
**Design system:** pendiente.  
**Implementación:** bloqueada hasta aprobación HF/identidad.
