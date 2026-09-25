# Vértice CR — Diseño visual, temas y accesibilidad

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

Siguiente paso: revisar HF-01, HF-02, HF-05 con estas reglas aplicadas.

