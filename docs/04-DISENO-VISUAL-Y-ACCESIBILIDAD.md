# Vértice CR — Diseño visual, temas y accesibilidad

## Dirección vigente

**Obsidian Precision Forge + Lava Orgánica**.

Obsidian define estructura, precisión, superficies y lenguaje industrial. Lava aporta profundidad, iluminación térmica, materialidad y energía selectiva.

Evitar estética gamer, cyberpunk, exceso de glow, lava literal y UI genérica de IA.

## Tipografía

- Space Grotesk: interfaz, titulares y comunicación.
- JetBrains Mono: IDs, medidas, estados técnicos y datos.

## Temas

### Dark
Tema principal y referencia de marca.

### Light
Tema completo, no simple inversión de colores.

Ambos deben conservar jerarquía, identidad, estados, legibilidad, foco y componentes equivalentes.

Los tokens definitivos se fijarán después de aprobar HF.

## Paleta experimental

- #0D0B09 fondo
- #141412 superficie
- #1E1C19 superficie secundaria
- #FF5A1F acento térmico
- #EDE8E0 texto
- #6B6560 texto secundario
- #2A2420 borde

Son referencias de exploración, no contrato final.

## Accesibilidad

Objetivo: WCAG 2.2 como referencia.

Requisitos:
- contraste suficiente;
- no comunicar estado solo por color;
- foco visible;
- navegación por teclado;
- nombres accesibles;
- labels;
- texto alternativo;
- errores comprensibles;
- targets táctiles adecuados;
- resize de texto;
- reduced motion;
- ayuda consistente.

La ayuda no es solo para una discapacidad concreta: debe servir a distintas necesidades y a usuarios que necesiten orientación.

## Ayuda

En tareas complejas puede existir un control **Ayuda** consistente. Debe poder explicar la acción actual sin sacar al usuario del flujo. Si existe contenido de audio/video, se deben contemplar alternativas apropiadas.

## Movimiento

Solo para jerarquía, feedback, comprensión y continuidad. Respetar prefers-reduced-motion.

## Componentes conceptuales

Badge, StatusBadge, PriceTag, ProductCard, Gallery, selectors, FileDropzone, QuoteSummaryPanel, RangeEstimateBadge, ChatBubble, CartCatalogItem, CartCustomRequestItem, CheckoutStepCard, SinpePaymentBlock, OrderProgressStepper, KpiCard, ChartCard, AdminDataTable, ProductFormPanel, AuthFormField, QuoteApprovalCard.

## Regla visual

Producto e información útil son protagonistas. Los efectos nunca deben ocultar estados, precios, acciones o accesibilidad.
