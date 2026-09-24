# Fase 3 — Registro maestro de mockups de alta fidelidad

**Fecha:** 2026-09-19  \
**Rama:** `Pruebas`  \
**Estado:** 🔄 En progreso — deadline urgente 21 de septiembre de 2026

## 1. Objetivo

Completar los mockups HF necesarios para representar la experiencia pública y administrativa definida en Fase 3, con versiones desktop y móvil cuando corresponda.

Los mockups validan UX, identidad visual, jerarquía, interacción, estados, responsive, movimiento y coherencia entre pantallas.

**No son todavía la implementación React definitiva.**

---

## 2. Estado de producción

| ID | Pantalla | Desktop | Móvil | Estado |
|---|---|---:|---:|---|
| HF-01 | Home / Landing | Sí | Sí | 🟡 **Base HTML propia construida — en refinamiento** |
| HF-02 | Catálogo | Sí | Sí | ⏳ Pendiente |
| HF-03 | Detalle de producto | Sí | Sí | ⏳ Pendiente |
| HF-04 | Selección de solicitud | Sí | Sí | ⏳ Pendiente |
| HF-05 | Solicitud — Tengo un archivo | Sí | Sí | ⏳ Pendiente |
| HF-06 | Solicitud — Ayuda de diseño | Sí | Sí | ⏳ Pendiente |
| HF-07 | Carrito híbrido | Sí | Sí | ⏳ Pendiente |
| HF-08 | Checkout de productos | Sí | Sí | ⏳ Pendiente |
| HF-09 | Checkout de solicitud | Sí | Sí | ⏳ Pendiente |
| HF-10 | Login modal / Registro | Sí | Sí | ⏳ Pendiente |
| HF-11 | Cuenta / Dashboard cliente | Sí | Sí | ⏳ Pendiente |
| HF-12 | Detalle de pedido | Sí | Sí | ⏳ Pendiente |
| HF-13 | Admin Dashboard | Sí | Sí | ⏳ Pendiente |
| HF-14 | Admin — Pedidos | Sí | Sí | ⏳ Pendiente |
| HF-15 | Admin — Solicitudes | Sí | Sí | ⏳ Pendiente |
| HF-16 | Admin — Catálogo | Sí | Sí | ⏳ Pendiente |
| HF-17 | Admin — Clientes | Sí | Sí | ⏳ Pendiente |

---

## 3. HF-01 — Home / Landing

### Estado

**Desktop:** 🟡 Base HTML+CSS propia funcional — pendiente de refinamiento visual.  
**Mobile:** ⏳ Pendiente.

La base fue construida directamente con HTML + CSS, sin Gemini, v0 ni generación automática de código. Se utilizó una exploración generada por Gemini únicamente como **referencia visual del showcase oval y su iluminación perimetral**, reinterpretada en estructura propia.

### Dirección visual

**02 — Lava Orgánica** como base de trabajo.

Esto significa:

- carbón/obsidiana;
- lava naranja como acento;
- formas fluidas y orgánicas;
- profundidad y materialidad tipo plástico premium;
- precisión técnica dentro de una composición orgánica;
- glow ambiental controlado;
- producto como protagonista;
- sin estética gamer, infantil o genérica de IA.

**Importante:** esta dirección **no equivale a identidad final aprobada**.

### Estructura aprobada para HF-01

```
Navbar (sticky, blur, translúcido)
↓
Hero
  ├─ izquierda: badge + H1 + subtítulo + 2 CTAs
  └─ derecha: showcase oval orgánico con scroll infinito de productos
↓
Precision (4 bloques técnicos en grid con divisores)
↓
Process (4 pasos con línea SVG orgánica)
↓
Print CTA (copy + flujo visual + badge "Pendiente de cotización")
↓
Footer (logo + copyright en mono)
```

### Decisiones específicas

1. **No existe sección "Productos destacados" en Home.**
   Los productos destacados pertenecen a `/catalogo`.
2. **El showcase oval es el único display de productos en Home.**
3. **No se muestran precios en Home.**
4. El showcase contiene productos ficticios/placeholder hasta disponer de imágenes reales.
5. La navegación incluye Inicio, Catálogo, Impresión personalizada, carrito, cuenta y CTA "Cotizar".
6. La Home conserva la idea de experiencia guiada para impresión personalizada.

### Contenido actual

**Navbar**
- Vértice CR
- Inicio
- Catálogo
- Impresión personalizada
- carrito
- cuenta
- Cotizar

**Hero**
- Badge: "Fabricación digital · Costa Rica"
- H1: "De una idea, a algo real."
- Subtítulo: "Productos impresos en 3D y soluciones personalizadas, diseñadas para convertir ideas en objetos."
- CTA: "Explorar catálogo"
- CTA: "Solicitar impresión"

**Showcase**
- PRT-01 — Organizador
- ARQ-04 — Arquitectura
- RPT-03 — Mecánica
- DEC-05 — Decorativo
- HOG-06 — Funcional
- scroll infinito y pausa en hover

**Precision**
- Tolerancia dimensional — ±0.2 mm
- Altura de capa — 0.1 mm
- Materiales — PLA · PETG · Resina
- Entrega express — 48 h

> Estas métricas proceden de la base del prototipo y deben validarse contra requisitos/datos reales antes de presentarse como capacidades definitivas del negocio.

**Process**
- 01 Elige
- 02 Personaliza
- 03 Solicita
- 04 Recibe
- conexión mediante path SVG orgánico

**Print CTA**
- "¿Tenés una idea?"
- "Contanos qué necesitás y revisamos tu solicitud."
- Subís archivo → Objeto 3D → Cotización
- "Pendiente de cotización"
- "Solicitar impresión"

**Footer**
- Vértice CR
- "© 2026 Vértice CR · Fabricación digital · Costa Rica"

### Tokens experimentales usados en el mockup

```css
--bg:        #0D0B09;
--surface:   #141412;
--surface-2: #1E1C19;
--border:    #2A2420;
--text:      #EDE8E0;
--muted:     #6B6560;
--accent:    #FF5A1F;
--magma:     #E03D00;
--ember:     #FF8C5A;
```

Tipografía:
- Space Grotesk
- JetBrains Mono

Estos colores son **experimentales**, no tokens definitivos del libro de marca.

### Pendientes de refinamiento

- reemplazar placeholders geométricos por imágenes reales de productos cuando estén disponibles;
- aumentar profundidad visual del showcase oval;
- usar como referencia el marco oval iluminado de la exploración de Gemini;
- evaluar H1 más grande/agresivo en desktop;
- reforzar glow ambiental del hero sin saturarlo;
- completar hover/focus/disabled/processing;
- explorar iconografía técnica en Precision;
- construir y validar versión mobile;
- validar accesibilidad y reduced motion;
- revisar las métricas contra fuentes definitivas antes de tratarlas como datos reales.

---

## 4. Referencia visual externa de esta iteración

La exploración de Gemini se utilizó exclusivamente como referencia visual para:

- marco oval;
- iluminación naranja perimetral;
- profundidad del showcase;
- atmósfera cálida.

No se copió código ni se adoptó automáticamente la salida generativa.

---

## 5. Orden inmediato

```
HF-01 Desktop — refinamiento
↓
HF-01 Mobile
↓
HF-02 Catálogo
↓
HF-13 Admin Dashboard
↓
Actualizar Anteproyecto
↓
Revisión HF global
```

---

## 6. Criterio de aprobación

HF-01 solo podrá pasar a ✅ Aprobado después de revisar:

1. requisitos;
2. dirección visual vigente;
3. UX/user flows;
4. estados e interacción;
5. desktop + mobile;
6. accesibilidad;
7. coherencia con las demás pantallas.

**Lo que no está documentado no se considera aprobado.**


---

## Actualización 2026-09-24 — Decisiones posteriores a auditoría

La auditoría HF del 2026-09-24 supersede las decisiones visuales que entren en conflicto con los mockups actuales.

### Dirección visual vigente

**Obsidian Precision Forge** es el lenguaje visual principal y **Lava Orgánica** funciona como capa de materialidad, iluminación y energía. El showcase oval deja de ser obligatorio; puede conservarse cuando aporte valor a la composición.

### Ajustes obligatorios antes de aprobación

- HF-01 elimina precios del Home.
- HF-05 y HF-06 refuerzan la jerarquía de "orientativo / sujeto a validación" para cualquier rango generado por IA.
- HF-07 separa visual y funcionalmente productos de catálogo de solicitudes personalizadas.
- HF-08 utiliza dos flujos conceptuales: productos y solicitudes cotizadas.
- HF-12 elimina terminología de infraestructura del login de cliente.
- HF-14 se rehace con lenguaje visual Vértice.
- HF-17 requiere revisión posterior al cierre del modelo de datos de solicitudes.

La implementación continúa bloqueada hasta cerrar estos cambios y validar desktop/mobile/estados/accesibilidad.
