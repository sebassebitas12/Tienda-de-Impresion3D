# Fase 3 — Registro maestro de mockups de alta fidelidad

> Documento de control de la etapa HF. Registra qué pantallas existen, cuáles faltan, qué referencia se utiliza y qué debe aprobarse antes de implementación.

**Fecha:** 2026-09-17  
**Rama:** `Pruebas`  
**Estado:** 🔄 En progreso  

---

## 1. Objetivo

Completar los mockups de alta fidelidad necesarios para representar la experiencia pública y administrativa definida en Fase 3, con versiones desktop y móvil cuando corresponda.

Los mockups deben validar simultáneamente:

- UX y navegación;
- identidad visual;
- jerarquía;
- interacción;
- estados;
- responsive;
- lenguaje de movimiento;
- coherencia entre pantallas.

Los mockups son referencia de diseño. No son todavía la implementación React definitiva.

---

## 2. Mockup base existente

### Home / Landing — V0 de referencia

**Fuente:** mockup generado con v0 y entregado como `landing-page-vertice-cr.zip`.  
**Estado:** 🟡 Base recibida — pendiente de refinamiento y aprobación HF.

### Secciones presentes

1. Navbar sticky con blur y menú hamburger móvil.
2. Hero con titular, gradiente naranja, halos ambientales y dos CTAs.
3. ProductShowcase con carrusel vertical y efecto de despiece 3D en hover mediante CSS.
4. Catalog con productos destacados, precios en colones y hover.
5. Precision con cuatro métricas técnicas y divisores.
6. Process con cuatro pasos conectados visualmente.
7. PrintRequest con drag & drop, material, calidad, color y resumen sticky.
8. CtaFooter.

### Tratamiento

La propuesta se considera una **base visual fuerte**, no un diseño definitivo.

Se conserva como referencia la capacidad de interacción, profundidad y composición. Se auditará para convertirla en una experiencia propia de Vértice CR.

No se hará una conversión mecánica de TypeScript a JSX.

---

## 3. Matriz de pantallas HF

| ID | Pantalla | Desktop | Móvil | Estado |
|---|---|---:|---:|---|
| HF-01 | Home / Landing | Sí | Sí | 🟡 Base V0 recibida |
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

La cantidad exacta de pantallas puede ajustarse si una pantalla HF representa varios estados de una misma ruta sin perder claridad para la revisión académica.

---

## 4. Orden de producción

Se trabajará en este orden:

```text
HF-01 Home
↓
HF-02 Catálogo
↓
HF-03 Detalle
↓
HF-04–06 Solicitud personalizada
↓
HF-07 Carrito
↓
HF-08–09 Checkout
↓
HF-10 Auth
↓
HF-11–12 Cuenta / pedidos
↓
HF-13–17 Administración
```

El orden puede cambiar únicamente si una dependencia UX lo justifica y queda documentado.

---

## 5. Ficha obligatoria de cada mockup

Cada pantalla deberá registrar antes de considerarse aprobada:

- objetivo de la pantalla;
- usuario/contexto;
- ruta prevista;
- acción primaria;
- acciones secundarias;
- contenido requerido;
- estados necesarios;
- comportamiento responsive;
- comportamiento de interacción;
- animaciones previstas;
- elementos de identidad utilizados;
- elementos descartados y motivo cuando sea relevante;
- relación con pantallas anteriores y siguientes.

No se deben asumir detalles faltantes.

Si algo todavía no está definido, debe anotarse como **pendiente de decisión**.

---

## 6. Auditoría visual del mockup V0

### Conservables inicialmente

- profundidad espacial del ProductShowcase;
- interacción de despiece;
- navegación sticky con blur;
- atmósfera oscura;
- iluminación cálida/naranja;
- PrintRequest como experiencia interactiva;
- uso de información técnica como parte de la composición;
- estructura editorial de la Home.

### Pendientes de refinamiento

- identidad visual propia de Vértice CR;
- consistencia geométrica entre secciones;
- variedad controlada de superficies y formas;
- jerarquía del glow;
- relación entre luz, producto y fondo;
- continuidad del movimiento entre secciones;
- responsive de las interacciones complejas;
- estados completos;
- accesibilidad y reduced motion;
- coherencia con los flujos definitivos de Fase 3.

### No debe asumirse

- que la paleta naranja ya es definitiva;
- que todos los efectos actuales deben conservarse;
- que las métricas mostradas son datos reales;
- que la estructura técnica de Next.js/TypeScript será utilizada en el proyecto;
- que una dependencia utilizada por v0 debe instalarse en Vértice.

---

## 7. Proceso de aprobación

Una pantalla pasa de `⏳ Pendiente` a `🔄 En revisión` cuando existe una propuesta HF completa.

Pasa a `✅ Aprobada` cuando se revisa contra:

1. requisitos de Fase 1;
2. dirección visual de Fase 2;
3. UX y user flows de Fase 3;
4. `VISUAL-IDENTITY-WORKING.md`;
5. estados e interacción;
6. desktop y móvil;
7. accesibilidad relevante.

Si falla un criterio, permanece en revisión y se registra el cambio requerido.

---

## 8. Regla contra decisiones implícitas

Toda nueva decisión visual, interacción, animación, componente, contenido, estado o herramienta que se incorpore al diseño debe quedar registrada en este documento o en el documento específico correspondiente.

**Lo que no está documentado no se considera aprobado.**

---

## 9. Relación con implementación

No iniciar implementación definitiva mientras los mockups HF necesarios no estén aprobados.

Una vez aprobados, se usarán como referencia para construir el design system y posteriormente la implementación en React + Vite + JavaScript/JSX.
