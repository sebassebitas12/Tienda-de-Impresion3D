# Vértice CR — Diseño visual, temas y accesibilidad

> Última actualización: **2026-09-25**.

## Dirección vigente

**Obsidian Precision Forge + Lava Orgánica**.

Obsidian define estructura, precisión, superficies y lenguaje industrial. Lava aporta profundidad, iluminación térmica, materialidad y energía selectiva.

Evitar estética gamer, cyberpunk, exceso de glow, lava literal y UI genérica de IA.

## Tipografía

- Space Grotesk: interfaz, titulares y comunicación.
- JetBrains Mono: IDs, medidas, estados técnicos y datos.

Fuentes cargadas desde Google Fonts. No reemplazar por system-ui en producción.


## Tokens — Tema Dark (referencia de marca)

~~~css
/* Superficies */
--color-bg:         #0D0B09;
--color-surface:    #141412;
--color-surface-2:  #1E1C19;
--color-surface-3:  #25221E;
--color-border:     #2A2723;

/* Acento térmico */
--color-accent:     #FF5A1F;
--color-accent-dim: #E03D00;
--color-accent-lit: #FF7A45;

/* Texto */
--color-text:       #EDE8E0;
--color-text-muted: #8A8884;

/* Estado */
--color-success:    #2ECC71;
--color-error:      #FF4444;
--color-warning:    #F5A623;
--color-pending:    #8A8884;

/* Tipografía */
--font-display:     'Space Grotesk', system-ui, sans-serif;
--font-mono:        'JetBrains Mono', 'Courier New', monospace;

/* Motion */
--motion-micro:     150ms ease;
--motion-ui:        220ms cubic-bezier(0.4, 0, 0.2, 1);
--motion-reveal:    400ms cubic-bezier(0.4, 0, 0.2, 1);

/* Geometría */
--radius-sharp:     2px;   /* inputs, badges técnicos, tags */
--radius-card:      6px;   /* cards de producto */
--radius-hero:      12px;  /* showcase hero oval */
~~~


## Tokens — Tema Light

El Light es un tema completo con identidad Vértice, no inversión de colores.
Conserva la calidez tostada, el acento térmico y la tipografía. Las superficies son cálidas (marfil industrial), no blanco neutro.

~~~css
/* Superficies */
--color-bg:         #F5F3F0;
--color-surface:    #FFFFFF;
--color-surface-2:  #EDEAE6;
--color-surface-3:  #E4E0DB;
--color-border:     #CEC9C2;

/* Acento térmico (ligeramente más oscuro para contraste sobre claro) */
--color-accent:     #D94400;
--color-accent-dim: #B83900;
--color-accent-lit: #FF5A1F;

/* Texto */
--color-text:       #1A1816;
--color-text-muted: #6B6560;

/* Estado (mismo semántico) */
--color-success:    #1A8C4E;
--color-error:      #CC2200;
--color-warning:    #C07B00;
--color-pending:    #6B6560;

/* Tipografía y motion: idénticos al dark */
~~~

Reglas de aplicación Light:
- Las cards mantienen sombra sutil (`box-shadow: 0 1px 3px rgba(0,0,0,0.10)`) en lugar de borde oscuro.
- El navbar en Light usa `--color-surface` con `backdrop-filter: blur(12px)`.
- No usar blanco puro (`#FFFFFF`) como fondo de página — usar `--color-bg: #F5F3F0`.
- El acento naranja en Light debe tener ratio de contraste ≥ 3:1 sobre superficies claras para elementos de UI y ≥ 4.5:1 para texto.


## Reglas de color transversales

- El naranja se usa en: CTA primario, focus ring, hover de elementos interactivos y detalles técnicos.
- El naranja NO se usa en: fondos de sección, texto de cuerpo, iconografía decorativa.
- `--color-pending` (#8A8884 Dark / #6B6560 Light) identifica visualmente `PENDING_QUOTE` — nunca usa naranja ni verde.
- El estado nunca se comunica solo por color — siempre acompañado de texto o icono.


## Reglas de geometría

- `border-radius: 2px` — inputs, badges de datos, etiquetas técnicas.
- `border-radius: 6px` — cards de producto y secciones.
- `border-radius: 12px` — showcase oval del hero únicamente.
- Sin `border-radius` universal aplicado a todo.


## Accesibilidad — reglas concretas

Objetivo: WCAG 2.2 AA como mínimo. AAA en texto de cuerpo cuando sea posible.

### Contraste
- Texto normal: ratio ≥ 4.5:1.
- Texto grande (≥ 18px regular o ≥ 14px bold): ratio ≥ 3:1.
- Componentes de UI e iconografía informativa: ratio ≥ 3:1.
- Verificar en ambos temas (Dark y Light) antes de congelar componente.

### Foco visible
- Focus ring: `outline: 2px solid var(--color-accent); outline-offset: 2px;`
- Nunca suprimir el outline sin reemplazarlo por un indicador visible equivalente.
- Navegación por teclado debe seguir un orden lógico (Tab y Shift+Tab).
- Elementos interactivos dentro de modals y drawers deben quedar con foco atrapado mientras están abiertos.

### Targets táctiles
- Mínimo 44×44px para cualquier elemento interactivo.
- En elementos pequeños (iconos, badges con acción), añadir padding invisible para alcanzar el mínimo.

### Nombres accesibles
- Todos los inputs deben tener `<label>` asociado explícitamente, no solo placeholder.
- Botones de icono deben tener `aria-label` descriptivo.
- Imágenes de producto: `alt` con nombre del producto y material.
- Imágenes decorativas: `alt=""` y `role="presentation"`.

### Estados comunicados sin depender solo del color
- Errores: icono + texto de error junto al campo. Nunca solo borde rojo.
- Éxito: icono + texto. Nunca solo borde verde.
- Estado de solicitud: badge con texto del estado (`PENDIENTE DE COTIZACIÓN`, `APROBADO`, etc.) y opcionalmente icono. Nunca solo color del badge.
- Disponibilidad: texto (`Disponible` / `Sin stock`) + badge. Nunca solo color.

### Resize de texto
- La UI debe funcionar correctamente con texto al 200% sin pérdida de funcionalidad ni truncamiento de información crítica.

### Reduced motion
~~~css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
~~~
El showcase del hero (scroll infinito) debe detenerse completamente en reduced-motion y mostrar las cards estáticas.

### Errores comprensibles
- Mensajes de error en lenguaje natural, junto al campo que los genera.
- No usar solo códigos de error ni mensajes genéricos como "Error 400".
- En formularios con múltiples campos, resumir los errores al inicio del formulario además de marcar cada campo.

### Pantallas con requisitos de accesibilidad específicos

| Pantalla | Requisito adicional |
|---|---|
| HF-05 FileDropzone | Estado drag-over, success, error y oversized comunicados textualmente. Botón de remove visible y accesible. |
| HF-06 Chatbot IA | Región live (`aria-live="polite"`) para respuestas del asistente. Indicador de "escribiendo" con texto alternativo. |
| HF-07 Carrito | Badge `PENDIENTE DE COTIZACIÓN` con texto visible, no solo color muted. |
| HF-08 Checkout | Pasos del stepper con `aria-current="step"`. Errores de formulario con `aria-describedby`. |
| HF-08 SINPE | Número de teléfono de destino anunciado como texto, no solo visual. |
| HF-10 Admin | Tablas con `<caption>` y headers con `scope`. Gráficas de Recharts con texto alternativo de resumen. |
| HF-12 Login | Mensajes de error de autenticación próximos al campo correspondiente. |


## Ayuda — mecanismo definido

### Patrón: Inline disclosure

El mecanismo de ayuda es un **disclosure inline** — no un modal, no solo un tooltip, no una página separada.

Trigger: botón `?` con `aria-label="Ayuda sobre [nombre de la sección]"` ubicado junto al título de la sección o del campo que necesita explicación.

Comportamiento:
- Al activar: expande un bloque de texto debajo del trigger con la explicación.
- `aria-expanded` actualizado en el trigger.
- El foco permanece en el área actual — no desplaza la vista ni interrumpe el flujo.
- Escape o clic nuevamente en `?` cierra el bloque.
- El bloque puede contener texto, lista de pasos o un enlace a más información.

### Dónde aparece

| Pantalla / Sección | Qué explica |
|---|---|
| HF-05 Upload archivo 3D | Formatos aceptados, tamaño máximo, cómo preparar el archivo. |
| HF-06 Asistencia IA | Qué tipo de información da la IA, qué significa ORIENTATIVO. |
| HF-08 SINPE | Cómo realizar el SINPE, dónde encontrar el número de comprobante. |
| HF-08 Facturación electrónica | Qué es cédula jurídica vs física vs DIMEX, para qué sirve el correo de factura. |
| HF-08 Comprobante | Formatos aceptados, qué parte del comprobante adjuntar. |
| HF-07 Cotización aprobada | Qué significa `APROBADO`, qué pasa al hacer clic en "Pagar cotización". |

### Lo que la ayuda NO hace
- No reemplaza un label claro o un placeholder útil.
- No aparece por defecto abierta (salvo primera visita con onboarding si se decide implementar).
- No es un chatbot en el flujo de pago.
- No es un modal de pantalla completa para explicaciones simples.


## Movimiento

Solo para jerarquía, feedback, comprensión y continuidad.

Reglas:
- El showcase del hero: `animation: scroll-horizontal` con pausa en `hover` y `focus-within`.
- Transiciones de paso en checkout: slide horizontal suave, 220ms.
- Estados de carga: shimmer/skeleton, no spinner giratorio en contenido principal.
- Micro-animaciones de CTA: `transform: translateY(-1px)` en hover, `scale(0.98)` en active.
- Glow: solo en el elemento que tiene foco, nunca como decoración permanente.
- Respetar `prefers-reduced-motion` (ver regla en sección de accesibilidad).


## Componentes conceptuales

Badge, StatusBadge, PriceTag, ProductCard, Gallery, selectors, FileDropzone, QuoteSummaryPanel, RangeEstimateBadge, ChatBubble, CartCatalogItem, CartCustomRequestItem, CheckoutStepCard, SinpePaymentBlock, OrderProgressStepper, KpiCard, ChartCard, AdminDataTable, ProductFormPanel, AuthFormField, QuoteApprovalCard, HelpDisclosure.

`HelpDisclosure` es el componente de ayuda inline definido en este documento.

## Regla visual

Producto e información útil son protagonistas. Los efectos nunca deben ocultar estados, precios, acciones o accesibilidad.


## Chrome de aplicación: navbar y footer

El navbar público tomado de Stitch se conserva como referencia visual aprobada. Los cambios deben ser quirúrgicos: rutas, autenticación, accesibilidad, tema y pequeños ajustes de espaciado/iconografía. No crear una estética de navegación nueva sin una razón UX documentada.

El footer de marca funciona como componente de contexto público. No debe forzarse dentro de dashboards administrativos cuando reduzca el espacio útil o compita con la operación. El admin puede utilizar un footer técnico compacto o prescindir de él.

La reutilización visual se logra mediante tokens y componentes compartidos, no mediante copiar literalmente toda la estructura de una página a otra.


## Sistema de Criterios, Repositorios de Referencia y Benchmark Técnico

Esta sección consolida las decisiones de diseño, ingeniería visual y accesibilidad extraídas de los repositorios y fuentes maestras del proyecto, transformándolas en reglas obligatorias de implementación para todas las pantallas de Vértice CR.

### Directorio Maestro de Enlaces Directos a Repositorios y Fuentes

| Fuente | Tipo | Enlace Directo | Aplicación en Vértice CR |
|---|---|---|---|
| **Emil Kowalski / skills** | GitHub Repo | [github.com/emilkowalski/skills](https://github.com/emilkowalski/skills) | Físicas de animación, microinteracciones, cubic-beziers y `prefers-reduced-motion`. |
| **Impeccable (Paul Bakaus)** | GitHub Repo | [github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Auditoría anti-slop, craft visual y eliminación de clichés de IA. |
| **UI/UX Pro Max Skill** | GitHub Repo | [github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Catálogo maestro de layouts, espaciados y sistemas de componentes. |
| **senlindesign / taste-skill** | GitHub Repo | [github.com/senlindesign/taste-skill](https://github.com/senlindesign/taste-skill) | Ingeniería inversa estética y extracción metrológica de tokens. |
| **Leonxlnx / taste-skill** | GitHub Repo | [github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | Exploración y refinamiento de decisiones de diseño industrial. |
| **Google Labs / design.md** | GitHub Repo | [github.com/google-labs-code/design.md](https://github.com/google-labs-code/design.md) | Especificación de diseño persistente e identidades visuales. |
| **VoltAgent / awesome-design-md** | GitHub Repo | [github.com/VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | Colección de design tokens y arquitecturas de diseño reales. |
| **GitHub / spec-kit** | GitHub Repo | [github.com/github/spec-kit](https://github.com/github/spec-kit) | Metodología de especificación: spec → plan → tasks → verificación. |
| **hardikpandya / stop-slop** | GitHub Repo | [github.com/hardikpandya/stop-slop](https://github.com/hardikpandya/stop-slop) | Criterios para evitar elementos sobrecargados o artificiales. |
| **Humanizer (blader / humanizer)** | GitHub Repo | [github.com/blader/humanizer](https://github.com/blader/humanizer) | Copywriting técnico con voz humana natural y sin clichés. |
| **Godly** | Galería / Design | [godly.design](https://godly.design/) | Referencia internacional de sitios oscuros, minimalismo industrial y CAD. |
| **React Bits** | Componentes UI | [reactbits.dev](https://reactbits.dev/) | Catálogo de componentes interactivos y microefectos modernos. |
| **Refero Styles** | Galería UX | [styles.refero.design](https://styles.refero.design/) | Pantallas de productos digitales para benchmark de patrones. |
| **Awwwards** | Galería Web | [awwwards.com](https://www.awwwards.com/) | Vanguardia de diseño web interactivo y dirección de arte. |
| **W3C WAI-ARIA APG** | Estándar Oficial | [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg/) | Patrones accesibles de teclado, roles, estados y diálogos WCAG. |
| **MDN Web Accessibility** | Estándar Oficial | [developer.mozilla.org/Web/Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) | Ratios de contraste WCAG 2.2 AA y navegación accesible. |
| **DGtalic (CR)** | Competidor Local | [dgtalic.com](https://dgtalic.com/) | Benchmark mercado nacional Costa Rica. |
| **3DCR (CR)** | Competidor Local | [impresion3dcr.com](https://www.impresion3dcr.com/) | Benchmark mercado nacional Costa Rica. |
| **3D-ego (CR)** | Competidor Local | [3degocr.com](https://www.3degocr.com/) | Benchmark mercado nacional Costa Rica. |
| **Acro 3D Print (CR)** | Competidor Local | [acro3dprint.com](https://acro3dprint.com/) | Benchmark mercado nacional Costa Rica. |
| **Factory 3D CR (CR)** | Competidor Local | [factory3dcr.com](https://factory3dcr.com/) | Benchmark mercado nacional Costa Rica. |

---

### 1. Sistema de Movimiento, Físicas y Microinteracciones (Ref: [Emil Kowalski / skills](https://github.com/emilkowalski/skills))

El movimiento en Vértice CR no es cosmético; es un instrumento metrológico para orientar al usuario, confirmar estados y dar peso físico a la manufactura aditiva.

* **Curvas y Tiempos de Transición (Tokens Oficiales):**
  * **Micro-interacciones táctiles (`150ms ease`):** Para cambios de color de borde, foco en inputs, estados `:hover` y `:active` de botones. Proporciona respuesta reactiva inmediata (<100ms perceptuales).
  * **Transiciones de interfaz y paneles (`220ms–280ms cubic-bezier(0.16, 1, 0.3, 1)`):** Curva elástica/spring suave inspirada en interfaces mecánicas de precisión. Se aplica a modales, drawer de accesibilidad, drawer de chat y tarjetas de producto.
  * **Entradas y revelado on-scroll (`400ms–650ms cubic-bezier(0.16, 1, 0.3, 1)`):** Entrada fluida con `translateY(22px) → translateY(0px)` y `opacity: 0 → 1` mediante `IntersectionObserver`.
  * **Ciclos de vida ambiental y levitación (`4s–6s ease-in-out infinite alternate`):** Levitación suave de piezas en visor 3D, pulso térmico de lava y barrido de láser.

* **Reglas de Rendimiento a 60 fps (Criterio Emil Kowalski):**
  * **Solo animar propiedades compuestas por GPU:** `transform` y `opacity`. Prohibido terminantemente animar `top`, `left`, `width`, `height`, `padding` o `margin` para evitar recálculos de layout (*jank* o *reflow*).
  * **Uso obligatorio de `will-change: transform, opacity`** en elementos de animación continua (visor 3D, haz láser, cinta ticker y ondas de radar).
  * **Aislamiento de Stacking Context:** Los elementos flotantes y badges sobre imágenes deben tener `z-index` explícito y máscaras alfa radiales (`-webkit-mask-image: radial-gradient(...)`) para eliminar artefactos rectangulares sin solapar badges ni cotas.

* **Cumplimiento Estricto de `prefers-reduced-motion`:**
  * Toda animación continua se desactiva mediante regla CSS universal:
    ```css
    @media (prefers-reduced-motion: reduce), (html.a11y-reduce-motion) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
      }
    }
    ```
  * En JavaScript, los timers automáticos (carrusel de piezas) se pausan automáticamente al detectar `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.

---

### 2. Criterio Anti-Slop, Craft Editorial y Jerarquía de Información (Ref: [Impeccable](https://github.com/pbakaus/impeccable) + [stop-slop](https://github.com/hardikpandya/stop-slop))

Para evitar que la plataforma caiga en la estética genérica de "plantilla de IA", se establecen prohibiciones y estándares de artesanía visual:

* **Clichés Prohibidos (Banned AI Slop):**
  * ❌ Prohibidos los gradientes morados/azul neón genéricos ("AI purple").
  * ❌ Prohibidos los blobs o esferas flotantes decorativas sin función física.
  * ❌ Prohibidas las tarjetas con sombras desmedidas que no correspondan a una superficie industrial real.
  * ❌ Prohibidos textos de relleno abstractos ("innovación sin límites", "revolucionando el futuro"). Toda descripción debe indicar material técnico, tolerancias dimensionales, tecnología (FDM/SLA) o destino logístico.

* **Principios de Craft Editorial:**
  * **Narrativa técnica numerada:** Las secciones principales se organizan con indexación metrológica clara (`01 / SELECCIÓN DE TALLER`, `02 / EL MÉTODO`, `03 / SEÑALES DE PRECISIÓN`).
  * **Anotaciones técnicas activas (Leader Lines):** Las piezas del visor incorporan líneas guía SVG (`callout-leader-svg`) con coordenadas vectoriales exactas que apuntan a puntos nodales de la malla, identificando el polímero y la técnica estructural.
  * **Retículas CAD y marcas de calibración:** Uso de mallas milimétricas sutiles (`24px × 24px`), retículas en cruz giratorias (`crosshair-target`) y marcas de coordenadas (`01° 53' N / 70° 30' W`) que sitúan al usuario en una estación de manufactura real.
  * **Tratamiento fotográfico de estudio:** Las fotografías de producto se integran mediante fundido perimetral suave que disuelve los bordes del fondo contra el color de superficie obsidian (`#0D0B09`), logrando un acabado sin cortes duros.

---

### 3. Sistema de Tokens, Geometría y Layout (Ref: [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) + [taste-skill](https://github.com/senlindesign/taste-skill) + [design.md](https://github.com/google-labs-code/design.md))

* **Geometría Graduada según Función:**
  * `--radius-sharp: 2px`: Reservado para elementos técnicos de ingeniería: inputs de formulario, badges de material, cotas numéricas, chips de telemetría y coordenadas.
  * `--radius-card: 6px`: Tarjetas de catálogo de producto, pasos del método y paneles informativos.
  * `--radius-hero: 12px`: Marco principal del visor 3D workbench y banners de cotización.
  * `--radius-pill: 9999px`: Botones de acción flotantes (bolitas), selector de idioma y toggles de accesibilidad.

* **Paleta Obsidian Precision + Lava Orgánica:**
  * **Obsidian (Superficies):** `#0D0B09` (Base fondo), `#141412` (Superficie 1), `#1E1C19` (Superficie 2), `#25221E` (Superficie 3), `#2A2723` (Borde estructural).
  * **Lava (Acento Térmico):** `#FF5A1F` (Acento principal), `#FF7A45` (Acento iluminado hover), `#E03D00` (Acento activo/dim), `rgba(255, 90, 31, 0.28)` (Halo térmico de foco).
  * **Texto:** `#EDE8E0` (Principal alta legibilidad), `#8A8884` (Secundario metrológico), `#5C5852` (Dim/cotas decorativas).

* **Micro-Iluminación Interactiva (Cursor Spotlight):**
  * Las tarjetas de producto implementan un spotlight sutil (`radial-gradient` posicionado mediante variables CSS `--mouse-x` y `--mouse-y`) que simula la reflexión de luz sobre polímeros industriales al mover el cursor, combinado con un tilt sutil en 3D (`perspective(1000px) rotateY(...) rotateX(...)`).

---

### 4. Accesibilidad Universal TP (Todo Público) — Estándares [WCAG 2.2 AA](https://www.w3.org/WAI/ARIA/apg/) y Rúbrica FWD Academy

La aplicación responde a los lineamientos del Anteproyecto de FWD Academy (Sebastián Flores Miranda), garantizando inclusión universal para personas con discapacidad visual, motora y dificultades de lectura:

* **Las 4 Prácticas Obligatorias de Accesibilidad del Anteproyecto:**
  1. **Control de Tema Claro/Oscuro:** Alternancia accesible entre Dark Mode (Obsidian) y Light Mode (marfil industrial `#F5F3F0`) asegurando ratios de contraste ≥ 4.5:1 en textos normales y ≥ 3:1 en componentes UI.
  2. **Tipografía Escalable en Unidades Relativas:** Todos los tamaños definidos con escala relativa (`rem` / `em`) y controlados mediante la variable global `--a11y-font-scale` (ajustable de 90% a 130% desde el panel TP) sin romper la retícula ni truncar contenedores.
  3. **Semántica HTML y Soporte Completo para Lectores de Pantalla:** Estructura semántica nativa (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) con atributos ARIA enriquecidos (`role="tablist"`, `role="tab"`, `role="dialog"`, `aria-expanded`, `aria-label`, `aria-live="polite"` en el carrito y mensajes de chat).
  4. **Diferenciación de Estados Independiente del Color:** Cada estado de inventario o cotización combina texto explícito, color semántico e iconografía SVG diferenciada:
     * *En Stock:* Verde + Texto "EN STOCK (N)" + Checkmark.
     * *Bajo Pedido:* Ámbar + Texto "BAJO PEDIDO" + Ícono de reloj/engranaje.
     * *Pendiente de Cotización:* Gris neutro + Texto "PENDIENTE DE COTIZACIÓN · SIN COBRO PREVIO" + Ícono de reloj de arena.

* **Panel Especial de Accesibilidad Universal TP (Dock Flotante):**
  * **Botón flotante accesible (`fab-a11y-btn`):** Bolita redonda con ícono internacional ♿ ubicada verticalmente sobre el asistente técnico, con tamaño de toque accesible de 46px × 46px.
  * **Modo Alto Contraste (`html.a11y-contrast`):** Fondo negro absoluto (`#000000`), bordes amarillos de alta visibilidad (`#FFE600`) y tipografía blanca pura para usuarios con baja visión severa.
  * **Modo Dislexia (`html.a11y-dyslexia`):** Sustitución de fuentes por familias de alta legibilidad humanista, interlineado expandido a 1.7 y espaciado de letras (`letter-spacing: 0.05em`) para evitar aglutinamiento visual.
  * **Pausa Total de Animaciones (`html.a11y-reduce-motion`):** Detiene en un clic todos los láseres, ondas de radar, tickers y carruseles para personas con trastornos vestibulares o epilepsia fotosensible.
  * **Resaltado de Navegación y Foco (`html.a11y-highlights`):** Subrayado obligatorio de enlaces y contornos de foco de 2.5px visibles para navegación por teclado.

---

### 5. Dirección de Arte, Componentes y Telemetría Industrial (Ref: [Godly](https://godly.design/) + [React Bits](https://reactbits.dev/) + [Refero](https://styles.refero.design/))

* **Visor Workbench de Doble Entrada:**
  * Combinación de visualización central de alta resolución con riel vertical de miniaturas de 4 piezas (`vertical-thumbnails-rail`).
  * Auto-ciclo temporal suave (6.5 segundos) con pausa automática al posicionar el cursor sobre el visor (`mouseenter`) o enfocarlo por teclado.

* **Cinta Ticker de Telemetría Técnica AM (Running Marquee):**
  * Banda continua animada a 60 fps que recorre el ancho completo de la pantalla con especificaciones operativas reales: tolerancia ±0.05 mm, temperatura de cama 110°C, materiales PA12-CF/PETG/Resina 8K, despacho a las 7 provincias de Costa Rica y verificación metrológica ISO 9001.
  * Desvanecimiento perimetral en los extremos mediante degradados laterales y pausa táctil al interactuar (`hover`).

* **Dock Flotante de Doble Bolita Vertical:**
  * Disposición en columna (`floating-buttons-column`) en la esquina inferior derecha:
    * Bolita superior: Accesibilidad Universal TP (♿).
    * Bolita inferior: Asistente Técnico Vértice (💬) con baliza de estado en línea verde intermitente y pulso de acento térmico.
  * Los paneles modales se despliegan directamente sobre la columna con animación `slideUpDock` (250ms ease) y manejo de foco por teclado.

---

### 6. Copywriting Técnico y Voz Humana (Ref: [Humanizer](https://github.com/blader/humanizer))

* Tono de taller costarricense profesional, riguroso pero cercano.
* Cero promesas falsas de cálculo automático de precios en piezas complejas:
  * Las cotizaciones personalizadas siempre muestran el estado **`PENDIENTE DE COTIZACIÓN · SIN COBRO PREVIO`**.
  * Se explica que cada archivo pasa por revisión humana de malla, cálculo volumétrico e inspección de tolerancias.

---

### 7. Benchmark de Competidores Nacionales (Costa Rica)

| Empresa | Enlace | Brecha Detectada | Diferenciación de Vértice CR |
|---|---|---|---|
| **DGtalic** | [dgtalic.com](https://dgtalic.com/) | Visualmente plana, sin especificaciones de tolerancia ni modo accesible. | Enfoque de ingeniería con tolerancias garantizadas (±0.05 mm), estética workbench y panel TP. |
| **3DCR** | [impresion3dcr.com](https://www.impresion3dcr.com/) | Flujo de cotización opaco, sin trazabilidad de estados. | Pipeline formal documentado (`PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID`). |
| **3D-ego** | [3degocr.com](https://www.3degocr.com/) | Sin diferenciación entre producto físico y manufactura técnica bajo demanda. | Separación estricta: Catálogo de piezas funcionales vs. Solicitud técnica personalizada sin cobro previo. |
| **Acro 3D Print** | [acro3dprint.com](https://acro3dprint.com/) | Falta de interactividad, sin soporte de previsualización técnica. | Visor interactivo con líder dinámico (Leader Lines SVG), especificaciones de capa y telemetría en vivo. |
| **Factory 3D CR** | [factory3dcr.com](https://factory3dcr.com/) | Sin estándares de accesibilidad WCAG ni soporte para personas con discapacidad visual. | Inclusión universal completa (TP), selector de escala tipográfica, dislexia y modo alto contraste nativo. |



## Estado de cierre transversal desktop — 2026-09-25

| Bloque | Estado |
|---|---|
| Tokens Dark | ✅ Definidos y confirmados |
| Tokens Light | ✅ Definidos — verificar ratio de contraste al implementar |
| Reglas de color | ✅ Cerradas |
| Reglas de geometría | ✅ Cerradas |
| Accesibilidad WCAG 2.2 | ✅ Reglas concretas definidas por pantalla |
| Mecanismo de ayuda | ✅ Inline disclosure definido, pantallas mapeadas |
| Reduced motion | ✅ Regla CSS definida |
| Movimiento/animación | ✅ Reglas cerradas |

Siguiente paso: HF-01 ya fue consolidado y verificado. El siguiente foco es revisar HF-02 y HF-05 con estas reglas aplicadas.

