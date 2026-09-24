# Vértice CR — Roadmap de identidad visual

> Fuente de verdad para el trabajo de identidad visual desde el mockup base hasta el cierre del lenguaje visual y su preparación para implementación.

**Fecha:** 2026-09-17  
**Rama:** `Pruebas`  
**Estado:** 🔄 En progreso — identidad consolidada conceptualmente; validación HF pendiente

---

## 1. Objetivo final

Construir una identidad visual propia para Vértice CR que pueda aplicarse de forma consistente a la Home, catálogo, producto, cotización, carrito, checkout, autenticación, cuenta y panel administrativo.

La identidad debe conseguir:

- tecnología;
- precisión;
- materialidad;
- profundidad;
- creatividad;
- elegancia;
- movimiento;
- accesibilidad local;
- coherencia entre pantallas.

La meta no es tener muchas animaciones. La meta es que la interfaz completa se sienta intencional, fluida y reconocible.

---

## 2. Punto de partida

El mockup base proviene de v0 y se considera una **Base V0 / referencia visual**, no una implementación final.

Archivo original recibido fuera del repositorio:

`landing-page-vertice-cr.zip`

La base contiene una Home con:

1. Navbar.
2. Hero.
3. ProductShowcase.
4. Catalog.
5. Precision.
6. Process.
7. PrintRequest.
8. CtaFooter.

La salida generativa se considera válida como acelerador de diseño. No se descarta por haber sido generada con IA.

---

## 3. Principio de trabajo

```text
Base generativa fuerte
        ↓
Auditoría de diseño
        ↓
Identidad Vértice
        ↓
Refinamiento visual
        ↓
Sistema de composición
        ↓
Sistema de interacción
        ↓
Sistema de movimiento
        ↓
Responsive
        ↓
Accesibilidad
        ↓
Validación
        ↓
Documentación
        ↓
Mockups HF aprobados
        ↓
Libro de marca / formalización
        ↓
Design system
        ↓
Implementación
```

Cada etapa puede generar decisiones nuevas, pero una decisión no se considera estable hasta quedar documentada.

---

## 4. Etapa actual — Auditoría de la Base V0

### Objetivo

Convertir la Home actual en una referencia de diseño analizada y no solamente en un conjunto de componentes.

### Orden

1. Navbar.
2. Hero.
3. ProductShowcase.
4. Catalog.
5. Precision.
6. Process.
7. PrintRequest.
8. CtaFooter.

### Para cada sección se documentará

- objetivo de la sección;
- contenido;
- jerarquía;
- composición;
- recursos visuales;
- qué funciona;
- qué se percibe genérico;
- qué se conserva;
- qué se mejora;
- qué se reemplaza;
- qué se elimina;
- qué debe añadirse;
- interacción esperada;
- animación esperada;
- comportamiento responsive;
- accesibilidad;
- riesgos de rendimiento;
- dependencias o herramientas posibles;
- estado de aprobación.

**No se salta una sección porque parezca menor.**

---

## 5. Etapa — Definición de identidad

Después de auditar la Base V0 se formalizarán los elementos que deberán repetirse entre pantallas.

### 5.1 Concepto

Debe quedar escrito qué representa Vértice y cómo se relaciona con:

- vértice;
- convergencia;
- fabricación digital;
- capas;
- precisión;
- materialidad;
- identidad costarricense.

### 5.2 Color

Definir y justificar:

- fondo principal;
- superficies;
- elevación;
- acento;
- estados;
- texto;
- bordes;
- glow;
- reglas de proporción y uso.

La paleta experimental naranja/volcánica no será definitiva hasta completar esta revisión.

### 5.3 Tipografía

Definir:

- familias;
- pesos;
- escalas;
- interlineados;
- uso por contexto;
- tratamiento de datos técnicos;
- tratamiento de precios;
- reglas responsive.

### 5.4 Geometría

Definir si Vértice utilizará de forma consistente:

- vértices;
- diagonales;
- capas;
- cortes;
- retículas;
- ejes;
- líneas técnicas;
- formas inspiradas en fabricación.

### 5.5 Materialidad

Definir recursos visuales recurrentes relacionados con:

- plástico;
- filamento;
- capas impresas;
- superficies técnicas;
- roca/obsidiana como referencia ambiental si continúa siendo pertinente.

### 5.6 Iluminación

Definir:

- dirección;
- intensidad;
- glow;
- reflejos;
- profundidad;
- relación entre luz y acento.

### 5.7 Iconografía

Definir cuándo usar iconos y cuándo una forma visual propia debe sustituirlos.

### 5.8 Bordes y superficies

Definir:

- radios;
- grosor de borde;
- transparencia;
- blur;
- sombras;
- tratamiento de paneles.

No se debe asumir que todos los componentes tendrán la misma forma.

---

## 6. Etapa — Sistema de interacción

La interfaz debe responder de manera coherente.

Se documentarán:

- hover;
- focus;
- active;
- pressed;
- disabled;
- loading;
- success;
- error;
- selección;
- expansión;
- drag & drop;
- feedback de carrito;
- transición entre estados.

Cada interacción deberá tener una razón funcional o expresiva.

---

## 7. Etapa — Sistema de movimiento

La animación se definirá como un sistema, no como efectos aislados.

### Nivel 1 — Microinteracciones

Botones, links, toggles, controles y feedback.

### Nivel 2 — Componentes

Profundidad, desplazamiento, iluminación, expansión o despiece.

### Nivel 3 — Secciones

Revelado, parallax, capas y transformaciones al entrar/salir del viewport.

### Nivel 4 — Narrativa

Continuidad de movimiento entre una sección y la siguiente.

### Para cada animación se registrará

- disparador;
- propiedad animada;
- duración;
- easing;
- dirección;
- estado inicial;
- estado final;
- fallback;
- impacto en rendimiento;
- comportamiento con `prefers-reduced-motion`.

---

## 8. Etapa — Aplicación a la Home

Después de definir identidad, interacción y movimiento se reconstruirá conceptualmente la Home V1.

La Home V1 no se aprobará por tener más efectos que V0. Debe superar V0 en:

- identidad;
- coherencia;
- jerarquía;
- fluidez;
- claridad;
- profundidad;
- responsive;
- accesibilidad.

---

## 9. Etapa — Expansión a los demás mockups

La identidad validada en Home se aplicará a:

### Públicas

- Catálogo.
- Detalle de producto.
- Selección de solicitud.
- Solicitud con archivo.
- Solicitud con ayuda de diseño.
- Carrito híbrido.
- Checkout de productos.
- Checkout de solicitud.

### Auth

- Login modal.
- Registro.

### Cliente

- Cuenta.
- Pedidos.
- Detalle de pedido.
- Perfil.

### Admin

- Dashboard.
- Pedidos.
- Solicitudes.
- Catálogo.
- Clientes.

No se considera terminado un mockup si únicamente tiene una captura estática del estado normal. Deben contemplarse los estados que afecten la experiencia relevante de esa pantalla.

---

## 10. Etapa — Auditoría de coherencia global

Antes de cerrar la identidad se compararán todas las pantallas.

### Se comprobará

- misma marca;
- misma jerarquía tipográfica;
- misma lógica de color;
- misma familia geométrica;
- misma lógica de superficies;
- misma personalidad de interacción;
- misma lógica de movimiento;
- consistencia desktop/mobile;
- estados coherentes;
- accesibilidad visual;
- ausencia de patrones genéricos repetidos sin intención.

### Pregunta central

> ¿Podemos reconocer Vértice CR aunque el logo y el color principal se retiren?

Si no, la identidad todavía no está suficientemente definida.

---

## 11. Etapa — Formalización

Cuando la identidad esté validada visualmente se trasladarán las decisiones estables al **libro de marca**.

El libro deberá recoger únicamente decisiones suficientemente comprobadas.

Después se preparará el **design system** con:

- tokens;
- tipografía;
- colores;
- spacing;
- radios;
- sombras;
- motion tokens;
- componentes;
- estados;
- reglas responsive.

---

## 12. Etapa — Preparación para implementación

Antes de comenzar código se verificará:

- todos los mockups necesarios existen;
- desktop y mobile están revisados;
- los flujos coinciden con Fase 3;
- la identidad está formalizada;
- componentes recurrentes identificados;
- animaciones importantes descritas;
- recursos externos identificados;
- no existen decisiones visuales críticas sin documentación.

Solo entonces se pasa a implementación.

---

## 13. Regla sobre IA generativa

Las herramientas como v0, Framer u otras IA pueden producir una primera versión excelente y compleja. Eso se considera una ventaja.

La IA generativa no decide por sí sola:

- la identidad final;
- el alcance funcional;
- las dependencias;
- las reglas de UX;
- la arquitectura;
- la accesibilidad;
- el rendimiento;
- la aceptación final.

La salida puede convertirse en referencia, pero toda decisión relevante debe pasar por auditoría y quedar documentada.

---

## 14. Registro de decisiones pendientes

| Área | Estado | Decisión |
|---|---|---|
| Concepto de marca | 🔄 | Pendiente de consolidar a partir de la auditoría |
| Paleta | 🟡 | Obsidian + thermal orange + calibrated emerald; formalización final pendiente de validación HF |
| Tipografía | 🟡 | Space Grotesk + JetBrains Mono como base vigente; falta formalizar tokens |
| Geometría | 🔄 | Pendiente de consolidar |
| Materialidad | 🔄 | Pendiente de consolidar |
| Iluminación | 🔄 | Pendiente de consolidar |
| Interacciones | 🔄 | Pendiente de sistema común |
| Movimiento | 🔄 | Pendiente de sistema común |
| Home V1 | ⏳ | Después de auditoría |
| Mockups públicos | ⏳ | Pendientes |
| Mockups cliente | ⏳ | Pendientes |
| Mockups admin | ⏳ | Pendientes |
| Libro de marca | ⏳ | Después de validar identidad |
| Design system | ⏳ | Después del libro de marca |
| Implementación | ⏳ | Posterior a mockups e identidad aprobados |

---

## 15. Regla de documentación

**Si una decisión, duda, cambio, descarte, experimento o criterio puede afectar al diseño o a la implementación futura, debe quedar registrado en `docs/`.**

No se permite depender de contexto verbal o memoria de una conversación para conservar una decisión del proyecto.
