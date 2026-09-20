# HF-01 Home — Sesión de trabajo — 2026-09-19

## Origen

Sesión de trabajo realizada con Claude para construir la primera base propia de HF-01 en HTML + CSS puro.

Archivo local reportado por Claude:
`/mnt/user-data/outputs/vertice-cr-hf01-home.html`

Artefacto interactivo reportado:
`https://claude.ai/artifact/3MF77HptRyqksE9dKnDfu8`

> Estos recursos fueron reportados por la sesión externa. El archivo/artefacto no se incorpora automáticamente al repositorio como implementación React.

## Estado

**HF-01 Desktop:** 🟡 Base HTML funcional — pendiente de refinamiento visual.  
**HF-01 Mobile:** ⏳ Pendiente.  
**Identidad:** 🔄 En construcción.  
**Dirección de trabajo:** 02 — Lava Orgánica.

## Decisiones registradas

- Home no incluye sección “Productos destacados”; esa responsabilidad corresponde a `/catalogo`.
- El showcase oval/orgánico es el único display de productos en Home.
- No se muestran precios en Home.
- El showcase utiliza placeholders geométricos mientras no existan imágenes reales.
- La paleta experimental aplicada es carbón/obsidiana + lava naranja.
- Tipografía: Space Grotesk + JetBrains Mono.
- La exploración de Gemini se utilizó solo como referencia del marco oval y su iluminación naranja perimetral.
- No se migró código de Gemini/v0.
- La base fue construida en HTML + CSS propio.

## Estructura HF-01

```
Navbar
↓
Hero
  ├─ badge + H1 + subtítulo + 2 CTAs
  └─ showcase oval orgánico con scroll infinito
↓
Precision
↓
Process
↓
Print CTA
↓
Footer
```

## Contenido registrado

### Navbar

- Logo Vértice CR
- Inicio
- Catálogo
- Impresión personalizada
- Carrito
- Cuenta
- Cotizar

### Hero

- “Fabricación digital · Costa Rica”
- “De una idea, a algo real.”
- “Productos impresos en 3D y soluciones personalizadas, diseñadas para convertir ideas en objetos.”
- “Explorar catálogo”
- “Solicitar impresión”

### Showcase

- PRT-01 — Organizador
- ARQ-04 — Arquitectura
- RPT-03 — Mecánica
- DEC-05 — Decorativo
- HOG-06 — Funcional

### Precision

- Tolerancia dimensional — ±0.2 mm
- Altura de capa — 0.1 mm
- Materiales — PLA · PETG · Resina
- Entrega express — 48 h

> Estas métricas provienen del prototipo y quedan sujetas a validación antes de presentarse como capacidades definitivas.

### Process

01 Elige → 02 Personaliza → 03 Solicita → 04 Recibe

### Print CTA

- “¿Tenés una idea?”
- “Contanos qué necesitás y revisamos tu solicitud.”
- Subís archivo → Objeto 3D → Cotización
- “Pendiente de cotización”
- “Solicitar impresión”

### Footer

- Vértice CR
- “© 2026 Vértice CR · Fabricación digital · Costa Rica”

## Pendientes

1. Mejorar profundidad del showcase oval.
2. Usar como referencia el marco oval iluminado de Gemini.
3. Evaluar H1 más grande en desktop.
4. Reforzar glow ambiental sin saturarlo.
5. Definir hover/focus/disabled/processing.
6. Explorar iconografía técnica de Precision.
7. Sustituir placeholders por imágenes reales cuando estén disponibles.
8. Construir Mobile.
9. Validar accesibilidad y reduced motion.
10. Validar las métricas antes de convertirlas en contenido definitivo.

## Regla

Este documento registra la sesión y sus decisiones. La implementación React continúa bloqueada hasta la aprobación correspondiente de mockups e identidad.

**Lo que no está documentado no se considera aprobado.**
