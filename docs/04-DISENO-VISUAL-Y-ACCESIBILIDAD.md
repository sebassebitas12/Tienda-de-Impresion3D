# Vértice CR — Diseño visual, temas y accesibilidad

Carrito a 761–1100 px apila resumen y líneas para evitar superposición de
controles/precios. Cuenta móvil conserva las tres pestañas visibles, etapas
en rejilla 2 columnas (3 en anchos mayores) y campos sin mínimo que exceda su
contenedor. Se mantienen tokens existentes; ver evidencia R-H78 en docs/05.

> Última actualización: **2026-10-05**.

## Contraste Light en flujos operativos — R-H85

Se oscureció `--dim` de Light a `#6b6259`: contraste calculado 5.26:1 sobre
`--ink` (`#f4f0e9`) y 4.77:1 sobre `--panel` (`#ebe5dc`). En esas superficies,
`--muted` (`#625a52`) da 5.96:1 y 5.40:1; Lava `#b83900`, verde `#176b3a`,
warning `#795000` y error `#b42318` dan 4.63:1, 5.24:1, 5.67:1 y 5.25:1
respectivamente sobre `--panel`. El borde fuerte da 3.53:1 como componente UI.
El warning de pago y la confirmación manual usan esos tokens; los botones de
acción de pedido mantienen al menos 44 px de alto y la ficha de pedido permite
quiebre de referencias y columnas apiladas en móvil.

Son cálculos de colores planos/tokens, no certificación de cada mezcla,
superposición o pantalla. La captura real de Admin Solicitudes fue de escritorio
en Light; 375/768 y navegación completa con tecnología asistiva continúan sin
verificación visual en navegador y no se declaran aprobados.

La ficha de solicitud ya no intercala un formulario de «correo de prueba» entre
la cotización y su seguimiento. El recorrido conserva una acción de envío
orientada al cliente y el taller, reduciendo una bifurcación operativa que no
pertenece a la experiencia final.

## Selección de fotografías y densidad Admin — 2026-10-03

La biblioteca de fotos es un control operativo del formulario, no una reproducción de las tarjetas públicas: preview, búsqueda y grilla scrollable de 4/3/2 columnas para escritorio/tablet/móvil. Usa contain para reconocer el objeto completo; las bandas de miniatura son intencionales y no cambian el tratamiento de Tienda. Tokens Dark/Light existentes, selección visible y foco de teclado; sin dependencias ni estética de Stitch.

En móvil, resumen y detalle de pedido deben mostrar todos los valores importantes sin scroll horizontal de tabla. Los recorridos de seis etapas se distribuyen 3×2. Las referencias del cotizador Admin requieren ancho mínimo 260 px para no fragmentar títulos en tablet. Se elimina el círculo ornamental del panel de cotización, manteniendo superficie y jerarquía.

Las páginas institucionales deben explicar decisiones y próximos pasos reales,
no ocupar espacio con etiquetas numéricas ornamentales ni prometer operaciones
que el taller todavía no respalda. Contacto prioriza rutas accionables y conserva
el asistente en el contexto público existente; no presenta un correo genérico o
un canal no autorizado como soporte confirmado. En Contacto, la jerarquía combina
una orientación breve del proceso con rutas de entrada diferenciadas (archivo,
idea y seguimiento), ayuda contextual y FAQ; comparte tokens sin repetir una
composición. El main de esta ruta no duplica el offset del header fijo. En el
carrito, los estados de carga, vacío, líneas no disponibles y confirmación deben
seguir diferenciables;
la identidad de cuenta debe separar la selección sin cambiar el lenguaje visual
compartido de Tienda.

## Dirección vigente

**Obsidian Precision Forge + Lava Orgánica**.

Obsidian define estructura, precisión, superficies y lenguaje industrial. Lava aporta profundidad, iluminación térmica, materialidad y energía selectiva.

Evitar estética gamer, cyberpunk, exceso de glow, lava literal y UI genérica de IA.

### Atmósfera transversal — ambiente con intención

Cada ruta debe sentirse como un espacio propio de Vértice, no como contenido colocado sobre un canvas oscuro vacío. La atmósfera es parte de la experiencia: compone profundidad, materialidad y orientación antes de añadir decoración. Se resuelve con capas de superficie, luz cálida, retícula/trazos o movimiento sutil elegidos según la tarea; no es obligatorio usar todos esos recursos en cada pantalla.

- Definir para cada página un fondo/campo ambiental, una superficie de contenido y un foco local que ayude a entender dónde mirar o actuar. Las áreas largas pueden cambiar de tratamiento por sección para conservar ritmo.
- No repetir el mismo gradiente radial, retícula o halo en todas las páginas; variar ubicación, densidad, geometría y temperatura con una razón funcional/editorial. Una pantalla puede ser calmada, pero no debe quedar seca por defecto.
- Las superficies operativas conservan lectura y densidad: la atmósfera acompaña el flujo, no compite con datos, formularios ni acciones.
- Mantener tokens y mezcla de color existentes; asegurar contraste en Light/ Dark y alto contraste. Quitar capas decorativas en alto contraste y respetar `prefers-reduced-motion`/preferencia de movimiento.
- Antes de cerrar un slice, revisar la página completa y sus superficies secundarias a 375/768/1280 px: canvas, encabezado, filtros, listas, formularios, vacíos y detalle. Corregir patrones repetidos en toda la ruta, no solo en el elemento señalado.

Fuente → patrón observado: HF-01 compone el taller mediante retícula, luz Lava, planos desplazados y foco sobre la pieza. Adaptación → cada módulo React toma ese lenguaje y lo traduce a su propio propósito y densidad. Razón → dar continuidad emocional al producto sin convertir Admin en una copia del hero.

## Contrato de identidad para todas las interfaces — obligatorio también en React

La paleta por sí sola no hace que un componente pertenezca a Vértice. Cada pantalla y superficie interactiva debe heredar de forma reconocible el sistema completo: isotipo/logotipo oficial, tipografías, geometría, composición editorial, retícula y lenguaje técnico de interfaz, además de colores y estados. Antes de crear un logo, monograma, avatar de marca o símbolo, buscar y reutilizar el recurso aprobado; no sustituir el isotipo por una letra estilizada ni inventar una identidad auxiliar.

- Fuente de marca: `docs/LibroDeMarca_Vertice_CR.pdf` y recursos oficiales versionados (`public/logo.svg`, `public/favicon.svg`, variantes PNG en `public/`). En mockups alojados bajo `mockups/`, usar el asset local correspondiente, actualmente `mockups/favicon.png`.
- El favicon contiene el isotipo facetado “V”; es adecuado como marca compacta/avatar, no como reemplazo del logotipo completo cuando hay espacio para la firma `VÉRTICE CR`.
- Al habilitar React, centralizar los tokens y recursos compartidos y ofrecer una primitiva común de marca (logotipo/isotipo) para evitar recreaciones diferentes por pantalla. Los componentes no deben fijar una paleta, tipografía o estilo genérico separado de los tokens del producto.
- Validar cada componente dentro de la página real, no aislado: comparar navbar, hero, catálogo y controles flotantes; comprobar que su jerarquía, escala, bordes, acentos, iconografía y copy parezcan parte del mismo producto. El chatbot de HF-01 es una iteración de esta regla, aún pendiente de aprobación.

React Gate está abierto (2026-09-30). Esta regla define cómo preservar la identidad al implementar componentes React; los tokens y recursos compartidos deben centralizarse desde el inicio.

## Contrato de fidelidad visual HF-01 → React y documentación continua

HF-01 define la especificación visual de máxima fidelidad para Home, ahora implementada en React. Su identidad y principios siguen informando el producto, pero los demás módulos no deben replicar literalmente su composición workbench. Admin y futuras áreas usan los tokens, tipografía, geometría y principios de marca de este documento, con estructura y densidad propias de tareas operativas.

**Cambio de prioridad aprobado por el usuario (2026-10-01):** Home queda suficientemente completa para avanzar a Admin; las correcciones visuales futuras se atenderán puntualmente después. No se requiere otra revisión integral de Home para iniciar Admin. Esto no altera el estado congelado del archivo `mockups/hf-01-home-definitivo.html` ni autoriza editarlo.

La aprobación es por evidencia: lo que el usuario aún itera (incluidos los paneles no aprobados) se registra como propuesta/pendiente y no se convierte en contrato cerrado para React. Las referencias externas orientan criterios y decisiones; no reemplazan el mockup ni autorizan copiar diseños sin adaptación.

**Documentación continua para todas las IAs:** en cada bloque de trabajo, sin esperar una petición explícita, actualizar `AI_CONTEXT.md` y el documento de dominio correspondiente cuando se tome una decisión, se investigue/aplique una referencia, se cambie o verifique el producto, o se deje una tarea pendiente. Para cambios de HF-01: registrar en doc 05 el cambio real, estado de aprobación y verificación; actualizar aquí los criterios visuales duraderos y referencias; actualizar en `AI_CONTEXT.md` el estado y punto preciso de continuación. Separar hechos implementados/verificados de propuestas, decisiones pendientes y aspectos no aprobados. Mantener la documentación concisa y en su archivo existente, no crear un Markdown por mensaje. Esta obligación está definida también en `AGENTS.md`.

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

### Contrato base

- `border-radius: 2px` — inputs, badges de datos, etiquetas técnicas.
- `border-radius: 6px` — cards de producto y superficies secundarias.
- `border-radius: 12px` — referencia base para superficies hero.
- Sin `border-radius` universal aplicado a todo.

### Fotos de producto en Tienda — decisión R-H64

En las tarjetas del catálogo público, el escenario de imagen ocupa de borde a
borde la superficie superior. Evitar una foto rectangular con margen sobre otra
superficie contrastante: crea el efecto de “tarjeta dentro de tarjeta”. Usar un
escenario oscuro uniforme y `object-fit: contain` para que el producto no se
recorte aunque las fotos tengan distintas proporciones. El zoom compartido de
hover debe desactivarse en estas fotos: al escalar el elemento dentro del
escenario con `overflow: hidden`, vuelve a cortar llaveros y otros productos
cuadrados. Además, el `img` debe tener su caja geométrica limitada al escenario
(por ejemplo, `position:absolute; inset:0; width:100%; height:100%`); `object-fit`
solo controla el contenido dentro de esa caja, no impide que una caja cuadrada
desborde una celda apaisada. Para una fuente cuadrada, conservar la foto original
completa centrada y extender a los lados su mismo fondo mediante una capa
ambiental desenfocada; fundir suavemente solo el borde exterior de la foto para
que no parezca una tarjeta dentro de otra ni franjas negras puras. No usar IA
para reconstruir/alterar la pieza o sus accesorios: la foto tiene que seguir
siendo fiel al modelo. La interacción puede enfatizar la tarjeta, nunca amputar
el objeto.
Este tratamiento es
específico de la grilla de Tienda; no reemplaza las composiciones de Home ni las
miniaturas de Admin.

### Excepciones de HF-01 en evaluación

HF-01 puede usar radios mayores o asimétricos en composiciones facetadas del workbench, chatbot y superficies destacadas cuando la geometría aporte identidad. Estas variantes **no se convierten en tokens globales de React hasta que el usuario apruebe HF-01**. La auditoría debe distinguir entre una excepción intencional de composición y un radio heredado de una iteración anterior.

### Aplicación al dashboard Admin — R-H50

Admin comparte el lenguaje Vértice, pero organiza el trabajo como un registro de taller: métricas abiertas, etapas legibles, tablas sin paneles anidados y solicitudes como una cola accionable. Evitar la cuadrícula de tarjetas KPI gemelas y los contenedores con el mismo peso. Añadir una gráfica solo si deriva de los datos disponibles y ayuda a identificar la distribución operativa; declarar su conjunto en texto y no implicar periodo, meta o pronóstico ausente. Reservar Lava para la tarea que conduce a una acción real; mantener las etapas diferenciables por texto y forma además de color. La animación de entrada debe guiar la lectura, ser breve y desaparecer con `prefers-reduced-motion` y el ajuste de movimiento del sitio.

**Referencias → patrón → adaptación → razón:** [Impeccable](https://github.com/pbakaus/impeccable) identifica las tarjetas repetidas/anidadas como cliché y recomienda variar jerarquía; Admin reemplaza paneles gemelos por un anillo de distribución real, una tabla y una cola abierta para que cada bloque tenga peso según su tarea. [taste-skill](https://github.com/senlindesign/taste-skill) documenta el porqué y el trade-off de cada token; aquí Lava es solo la llamada accionable y no pinta todas las etapas. [Emil Kowalski / skills](https://github.com/emilkowalski/skills) enseña a escoger duración, curva y propiedades según intención; el anillo y las filas entran con movimiento corto, sin física decorativa y con reduced-motion. Solo se adoptan criterios; no se copia código, no se ejecuta una instalación específica de Claude y no se añade dependencia.

### R-H59 — Fondos de Admin sin círculos ornamentales

El usuario rechaza los círculos concéntricos/halos usados como textura de fondo en
las capturas del tablero. Se conservan los gráficos circulares que codifican
distribuciones reales (por ejemplo, el anillo de pedidos por etapa); se eliminan
las circunferencias decorativas. Las superficies Admin usan veladuras diagonales
y trazos lineales de plano de fabricación, con bajo contraste y sin añadir
dependencias. Alto contraste apaga las texturas. El lenguaje se varía por
superficie; no se aplica una retícula idéntica a toda ruta.

**Fuente → patrón → adaptación → razón:** Codrops, referencia de composición y
`background-blend-mode` ya registrada en este documento → construir profundidad
combinando capas CSS → geometría angular y rayado diagonal con tokens existentes,
sin anillos → conservar atmósfera industrial y sacar el motivo circular que el
usuario identificó como repetido. También se eliminó una regla global de
`shop.css` que ocultaba el selector de idioma y sobrescribía el grid del navbar
en todos los viewports bajo 1100 px; la regla queda limitada al grid de Tienda.
La aprobación visual de Admin en render queda pendiente.

### R-H60 — Registros Admin y claridad de datos — 2026-10-02

La revisión del usuario pidió que Pedidos y Clientes recuperen un acabado de
registro coherente con el resumen, sin duplicar una plantilla: Pedidos enfatiza
etapa, fecha e importe de origen en una tabla de producción; Clientes prioriza
identidad, estado y conteos de relaciones en filas de solo lectura. Ambos
comparten jerarquía, divisores, superficies y feedback Vértice, con composición
propia. En móvil la tabla de Pedidos refluye a fichas con etiquetas por campo.

En Categorías, editar se abre en contexto debajo del elemento elegido y separa
claramente la alta nueva del cambio existente; una vista previa muestra el
nombre, slug y conteo real de modelos asociados antes de guardar. El aviso del
dashboard explica que `SUBMITTED` es un valor heredado, no lo equipara
automáticamente con `PENDING_QUOTE` y conduce a revisar la ficha antes de
incorporarlo. La leyenda del gráfico de etapas ajusta sus columnas al espacio
disponible para evitar que las etiquetas choquen cuando el sidebar reduce el
ancho útil. No se alteran registros al inspeccionar estas pantallas.

**Fuente → patrón → adaptación → razón:** HF-01 y tokens vigentes de Vértice →
registros técnicos con lectura por tarea, jerarquía tipográfica y superficies
con intención → tabla de producción, registro de cuentas y editor contextual
comparten lenguaje, no disposición → dar continuidad visual al Admin sin
convertir páginas diferentes en copias ni confundir valores históricos con el
flujo actual. Sin dependencias nuevas ni contenido/datos inventados.

### Selector de idioma — alcance local

La preferencia representa idioma de interfaz, no ubicación. Por ahora se
mantienen Español (Costa Rica) e Inglés, en un control segmentado con botones
independientes y estado accesible. La región se usa solo al formatear
moneda/fechas y no debe cambiarse mediante geolocalización. No agregar idiomas
por ranking global sin público objetivo o traducciones completas revisadas.
Para una ampliación futura, agregar locales explícitos (p. ej. `es-CR` y
`en-US`) y fallback definido, manteniendo la selección manual.


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
- Fabricación: cuando sea relevante, comunicar `Bajo pedido` con texto claro. No crear estados de disponibilidad ni referirse a stock; los datos demo no representan la operación.

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

El navbar público y el resto del chrome deben seguir el lenguaje visual de HF-01. Stitch puede ayudar a recordar rutas, acciones y contenido funcional, pero no define la estética del navbar, footer, paneles ni controles.

El footer de marca funciona como componente de contexto público. No debe forzarse dentro de dashboards administrativos cuando reduzca el espacio útil o compita con la operación. El admin puede utilizar un footer técnico compacto o prescindir de él.

La reutilización visual se logra mediante tokens y componentes compartidos, no mediante copiar literalmente toda la estructura de una página a otra.

En Home, la lista destacada puede ser una selección editorial «en tendencia», siempre que no se presente como popularidad medida, ranking de ventas ni dato analítico sin fuente. Los controles flotantes de asistencia deben conservar un blanco táctil visible; en React se usa diámetro de 56 px y sus paneles móviles se sitúan por encima de la columna de controles.

## Home React — scanner y tarjetas destacadas (2026-10-01)

- El haz de escaneo del Hero debe atravesar el área visible de la pieza activa, no recorrer franjas vacías de la fotografía. La zona se calibra por imagen en metadatos del Hero; al reemplazar/agregar una foto se debe actualizar su encuadre de escaneo. No se presenta como detección automática por IA/visión.
- Las tarjetas destacadas de Home priorizan fotografía, categoría, nombre, material y acceso a la ficha. No muestran conteos ni badges de existencias. El catálogo se fabrica bajo pedido; no hay promesa de entrega inmediata ni consulta de cantidades para la tienda.
- La tarjeta puede usar un único badge de material; evitar repetir proceso/material y disponibilidad en varias etiquetas.
- Aplica a tienda, carrito y Admin. Los campos heredados `stock`/`minStock` de `db.json` no representan una condición operativa: no se muestran, no limitan cantidades y no determinan publicación, compra o mensajes.


## Sistema de Criterios, Repositorios de Referencia y Benchmark Técnico

Esta sección reúne fuentes para investigar diseño, ingeniería visual y accesibilidad. Una referencia externa no es por sí misma una regla de Vértice: solo las decisiones aprobadas por el usuario y registradas aquí se convierten en criterios de implementación.

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
| **React Bits** | Componentes UI / GitHub | [Catálogo](https://reactbits.dev/) · [Repositorio y licencia](https://github.com/DavidHDev/react-bits) | Estudiar componentes, animaciones y variantes. Su licencia combina MIT + Commons Clause: revisar el texto completo y las restricciones concretas antes de reutilizar o distribuir código. |
| **Refero Styles** | Galería UX | [styles.refero.design](https://styles.refero.design/) | Pantallas de productos digitales para benchmark de patrones. |
| **Awwwards** | Galería Web | [awwwards.com](https://www.awwwards.com/) | Vanguardia de diseño web interactivo y dirección de arte. |
| **Awwwards / Menu Navigation** | Galería de patrones | [Colección Menu Navigation](https://www.awwwards.com/inspiration/menu-navigation-disrupt) · [Navegación Fourmeta](https://www.awwwards.com/inspiration/interactive-site-navigation-fourmeta-agency) | Contrastar navegación desplegable, jerarquía y movimiento en sitios publicados; tomar estructura y ritmo, no efectos por sí solos. |
| **Siteinspire** | Galería Web | [siteinspire.com](https://www.siteinspire.com/) | Comparar sitios reales por tipografía, minimalismo, grillas y comercio electrónico; útil para soluciones completas, no solo capturas de componentes. |
| **Land-book** | Galería Web | [land-book.com](https://land-book.com/) | Contrastar jerarquía, densidad de contenido y llamadas a la acción en landing pages y comercio. |
| **Godly / Sites** | Galería Web | [godly.design/sites](https://godly.design/sites/) | Explorar composiciones oscuras con contraste y carácter sin trasladar efectos ajenos al producto. |
| **Radix Primitives** | GitHub / componentes | [Repositorio](https://github.com/radix-ui/primitives) · [Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) · [Popover](https://www.radix-ui.com/primitives/docs/components/popover) | Referencia de comportamiento para capas, colisiones, Escape y manejo de foco; no agrega dependencia al mockup HTML. |
| **Motion Primitives** | GitHub / componentes | [Repositorio](https://github.com/ibelick/motion-primitives) · [Documentación](https://motion-primitives.com/docs) | Inspeccionar transiciones y su relación con origen/posición; aplicar movimiento solo cuando ayude a orientarse. |
| **Magic UI** | Componentes React | [Catálogo y documentación](https://magicui.design/docs) · [Repositorio](https://github.com/magicuidesign/magicui) | Referencia de componentes animados y estados; filtrar efectos para evitar el estilo genérico de landing y revisar licencia/dependencias por componente. |
| **Aceternity UI** | Componentes React | [Catálogo](https://ui.aceternity.com/components) | Referencia visual para composición, efectos y patrones interactivos; no trasladar glow/neón por defecto ni asumir que todos los bloques son libres de uso. |
| **shadcn/ui** | Componentes y patrones React | [Documentación](https://ui.shadcn.com/) · [Repositorio](https://github.com/shadcn-ui/ui) | Consultar composición, estados y patrones de interfaz; sus ejemplos no definen la estética Vértice y se adaptan a los tokens aprobados. |
| **21st.dev** | Catálogo de componentes | [21st.dev](https://21st.dev/) | Explorar soluciones concretas de UI y microinteracción; revisar procedencia, licencia y dependencias de cada pieza. |
| **Base UI** | Primitivas React accesibles | [Documentación](https://base-ui.com/react/overview/about) · [Repositorio](https://github.com/mui/base-ui) | Referencia headless para comportamiento y accesibilidad sin imponer una capa visual. |
| **React Aria** | Primitivas React accesibles | [Documentación](https://react-aria.adobe.com/) · [Repositorio](https://github.com/adobe/react-spectrum) | Referencia de interacción con teclado, lector de pantalla, toque, internacionalización y estados accesibles. |
| **Vercel Agent Skills** | Skills para agentes de código | [Repositorio](https://github.com/vercel-labs/agent-skills) · [React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) · [Web Design Guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) | Evaluar como listas de revisión para rendimiento React y auditoría UI; contrastar cada regla con JavaScript/JSX, arquitectura y decisiones de este proyecto. |
| **Vercel Web Interface Guidelines** | Guía de calidad frontend | [Repositorio](https://github.com/vercel-labs/web-interface-guidelines) · [Reglas](https://vercel.com/design/guidelines) | Contrastar accesibilidad, estados, rendimiento y detalles de interfaz en una auditoría; usar la versión vigente al momento de revisar. |
| **Anthropic frontend-design** | Skill de diseño frontend | [Skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design) · [Repositorio de skills](https://github.com/anthropics/skills) | Referencia para dirección visual distintiva y construcción de UI con agentes; verificar términos del repositorio antes de adoptar o redistribuir. |
| **Vercel AI Elements** | Componentes para interfaces de IA | [Repositorio](https://github.com/vercel/ai-elements) | Estudiar estados de conversación, mensajes, streaming y controles de chat para una fase React futura. Está ligado a Next.js, Vercel AI SDK, shadcn/ui y Tailwind; no es una integración directa para el mockup HTML ni para el scaffold actual sin aprobación arquitectónica. |
| **W3C WAI-ARIA APG** | Estándar Oficial | [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg/) | Patrones accesibles de teclado, roles, estados y diálogos WCAG. |
| **MDN Web Accessibility** | Estándar Oficial | [developer.mozilla.org/Web/Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) | Ratios de contraste WCAG 2.2 AA y navegación accesible. |
| **DGtalic (CR)** | Competidor Local | [dgtalic.com](https://dgtalic.com/) | Benchmark mercado nacional Costa Rica. |
| **3DCR (CR)** | Competidor Local | [impresion3dcr.com](https://www.impresion3dcr.com/) | Benchmark mercado nacional Costa Rica. |
| **3D-ego (CR)** | Competidor Local | [3degocr.com](https://www.3degocr.com/) | Benchmark mercado nacional Costa Rica. |
| **Acro 3D Print (CR)** | Competidor Local | [acro3dprint.com](https://acro3dprint.com/) | Benchmark mercado nacional Costa Rica. |
| **Factory 3D CR (CR)** | Competidor Local | [factory3dcr.com](https://factory3dcr.com/) | Benchmark mercado nacional Costa Rica. |
| **GSAP** | Librería de Animación | [gsap.com](https://gsap.com/) | Secuencias de animación complejas, scroll triggers y manipulación avanzada del DOM a 60fps. |
| **Anime.js** | Librería de Animación | [animejs.com](https://animejs.com/) | Animaciones ligeras basadas en keyframes, SVG paths y orquestación de timelines. |
| **Motion.dev (Framer Motion)** | Librería React | [motion.dev](https://motion.dev/) | Físicas de resorte (springs), animaciones de layout compartidas, exit animations y micro-interacciones para React. |
| **React Spring** | Librería React | [react-spring.dev](https://react-spring.dev/) | Físicas puras basadas en resortes fluidos, ideal para interpolaciones físicas reactivas. |
| **21st.dev** | Componentes React | [21st.dev](https://21st.dev/) | Repositorio de micro-interacciones avanzadas, inspiración en craft de código y diseño premium. |

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
  * ❌ Prohibidos textos de relleno abstractos ("innovación sin límites", "revolucionando el futuro"). Toda descripción debe indicar datos de la pieza respaldados por el catálogo, material disponible, proceso FDM o destino logístico; no inventar tolerancias.

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

La aplicación toma como objetivo los lineamientos del Anteproyecto de FWD Academy (Sebastián Flores Miranda), con requisitos para personas con discapacidad visual, motora y dificultades de lectura. Esta intención no constituye por sí sola una garantía de conformidad ni reemplaza pruebas con tecnologías asistivas y personas usuarias:

* **Las 4 Prácticas Obligatorias de Accesibilidad del Anteproyecto:**
  1. **Control de Tema Claro/Oscuro:** Alternancia accesible entre Dark Mode (Obsidian) y Light Mode (marfil industrial `#F5F3F0`) asegurando ratios de contraste ≥ 4.5:1 en textos normales y ≥ 3:1 en componentes UI.
  2. **Tipografía Escalable en Unidades Relativas:** Todos los tamaños definidos con escala relativa (`rem` / `em`) y controlados mediante la variable global `--a11y-font-scale` (ajustable de 90% a 130% desde el panel TP) sin romper la retícula ni truncar contenedores.
  3. **Semántica HTML y Soporte Completo para Lectores de Pantalla:** Estructura semántica nativa (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) con atributos ARIA enriquecidos (`role="tablist"`, `role="tab"`, `role="dialog"`, `aria-expanded`, `aria-label`, `aria-live="polite"` en el carrito y mensajes de chat).
  4. **Diferenciación de Estados Independiente del Color:** Cada estado de publicación o cotización combina texto explícito, color semántico e iconografía SVG diferenciada:
     * *Publicado/Oculto:* se presenta como acción/estado editorial en Admin; no implica unidades listas.
     * *Bajo Pedido:* texto claro que describe cuándo inicia la fabricación, sin conteo de unidades.
     * *Pendiente de Cotización:* Gris neutro + Texto "PENDIENTE DE COTIZACIÓN · SIN COBRO PREVIO" + Ícono de reloj de arena.

* **Panel Especial de Accesibilidad Universal TP (Dock Flotante):**
  * **Botón flotante accesible (`fab-a11y-btn`):** Bolita redonda con ícono internacional ♿ ubicada verticalmente sobre el asistente técnico, con tamaño de toque accesible de 46px × 46px.
  * **Modo Alto Contraste (`html.a11y-contrast`):** Fondo negro absoluto (`#000000`), bordes amarillos de alta visibilidad (`#FFE600`) y tipografía blanca pura para usuarios con baja visión severa.
  * **Modo Dislexia (`html.a11y-dyslexia`):** Sustitución de fuentes por familias de alta legibilidad humanista, interlineado expandido a 1.7 y espaciado de letras (`letter-spacing: 0.05em`) para evitar aglutinamiento visual.
  * **Pausa Total de Animaciones (`html.a11y-reduce-motion`):** Detiene en un clic todos los láseres, ondas de radar, tickers y carruseles para personas con trastornos vestibulares o epilepsia fotosensible.
  * **Resaltado de Navegación y Foco (`html.a11y-highlights`):** Subrayado obligatorio de enlaces y contornos de foco de 2.5px visibles para navegación por teclado.

---

### Decisión vigente de accesibilidad para HF-01 / React — 2026-09-30

La especificación expandida anterior de TP (90–130 %, modo dislexia, resaltado separado y contraste amarillo/negro) corresponde a una etapa previa de exploración y **no es el contrato visual actual de Home**.

El HF-01 definitivo congelado establece para Home:

- selector global de idioma ES/EN desde el navbar;
- tema Dark/Light;
- panel flotante de preferencias con tres escalas: **A / A+ / A++**;
- **Más contraste** como refuerzo de texto, bordes y foco respetando Dark/Light;
- **Menos movimiento**, compatible además con `prefers-reduced-motion`;
- **Restablecer preferencias**;
- persistencia global de estas preferencias en React.

No añadir modo dislexia, resaltado independiente ni controles adicionales a Home sin nueva decisión del usuario. Esos conceptos pueden conservarse como antecedentes/futuras ampliaciones de accesibilidad, pero no deben interpretarse como pendientes obligatorios de Capa 2.

### 5. Dirección de Arte, Componentes y Telemetría Industrial (Ref: [Godly](https://godly.design/) + [React Bits](https://reactbits.dev/) + [Refero](https://styles.refero.design/))

* **Visor Workbench de Doble Entrada:**
  * Combinación de visualización central de alta resolución con riel vertical de miniaturas de 4 piezas (`vertical-thumbnails-rail`).
  * Auto-ciclo temporal suave (6.5 segundos) con pausa automática al posicionar el cursor sobre el visor (`mouseenter`) o enfocarlo por teclado.

* **Cinta Ticker de Telemetría Técnica AM (Running Marquee):**
  * Si se usa una banda de telemetría, debe comunicar solo especificaciones respaldadas por producto y operación vigentes. No publicar tolerancias, temperaturas de cama, certificaciones ISO, tiempos de entrega ni materiales (por ejemplo, PA12-CF o resina) sin una fuente aprobada. La oferta de fabricación vigente se limita a FDM y ASA/PLA/PETG/ABS/TPU.
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
| **DGtalic** | [dgtalic.com](https://dgtalic.com/) | Visualmente plana, sin especificaciones de tolerancia ni modo accesible. | Enfoque de ingeniería con estética workbench y panel TP; no anunciar tolerancias garantizadas sin datos operativos confirmados. |
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

Siguiente paso histórico: HF-01 ya había sido consolidado y verificado en esa fecha. La decisión posterior vigente es mantener HF-01 en iteración hasta aprobación explícita; no pasar todavía a HF-02/HF-05 ni a React.

---

## Aplicación verificada en `hf-01-home-definitivo.html` — 2026-09-28

Esta sección registra cómo se tradujeron los criterios en el candidato actual. No sustituye las reglas anteriores; documenta su aplicación práctica.

| Criterio consultado | Aplicación comprobable en el candidato |
|---|---|
| Emil Kowalski / motion | Transiciones cortas con curvas suaves, preferencia por `transform` y `opacity`, y respeto a `prefers-reduced-motion`; el movimiento acompaña la interfaz y no compite con el hero. |
| Impeccable + stop-slop | Se evitaron gradientes neón genéricos, copy de marketing vacío, tarjetas anidadas sin función y controles con apariencia de plantilla; se mantuvieron la geometría `2px / 6px / 12px` y la jerarquía de taller técnico. |
| taste-skill + UI/UX Pro Max + design.md | Se trabajó con tokens de superficie, línea y lava; se revisó la retícula del navbar en desktop y se priorizaron contraste, foco y densidad legible antes de agregar decoración. |
| Godly + Awwwards + Refero + React Bits | Se tomaron como referencias de composición editorial, superficies oscuras y micro-interacciones selectivas; no se copió código ni se agregó una dependencia externa. |
| W3C APG + MDN | Los toggles actualizan `aria-expanded`, los paneles `aria-hidden`, los drawers tienen rol de diálogo, los controles tienen foco visible y el teclado puede cerrar con `Escape`; los objetivos principales parten de `44px`. |
| Humanizer | El copy se mantuvo técnico y cercano al taller; se retiraron afirmaciones que el proyecto no define. |

### Decisiones visuales ya tomadas por el usuario

- Mantener los visuales del local que funcionan mejor, especialmente hero, composición general e iconos flotantes.
- Mantener la forma plegable del menú del remoto, pero no sus claims técnicos no definidos.
- Rediseñar chatbot y accesibilidad: conservar los iconos del local y usar paneles más compactos, intencionales y coherentes con el remoto.
- No dar por bueno el diseño actual de los botones del navbar: queda abierto a una siguiente ronda de criterio visual.
- Mantener el navbar centrado en desktop y aceptar su repliegue responsive en anchos menores.

### Regla para futuras iteraciones

El archivo de trabajo es `mockups/hf-01-home-definitivo.html`. Las referencias `mockups/hf-01-home.html` y `mockups/hf-01-home-remoto-pruebas.html` se consultan en modo comparativo y no se sobrescriben. Cualquier nueva propuesta debe distinguir claramente entre contenido definido por el proyecto y contenido experimental; si un dato no aparece en la documentación o no lo valida el usuario, no se inventa.

### Protocolo de referencias para rehacer menú, asistencia y accesibilidad

La investigación del 2026-09-28 amplía el directorio con la colección de navegación de Awwwards, Siteinspire, Land-book y la galería de sitios de Godly. Se revisan sitios completos y estados interactivos: Awwwards/Godly para composición y transiciones; Siteinspire/Land-book para jerarquía, tipografía, densidad y versión móvil. Las referencias técnicas son [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog), [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover), [WAI-ARIA APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) y [Emil Kowalski / skills](https://github.com/emilkowalski/skills); sirven para validar colisiones, foco, Escape, semántica y movimiento. No se trasladan componentes ni efectos como decoración.

Para la siguiente propuesta de HF-01, tratar por separado: (1) hamburger como control centrado de tres barras; (2) navegación y cuenta como un menú con grupos claros y sin acceso de inicio de sesión duplicado; (3) asistencia como flujo de pregunta y sugerencias, no como tarjeta genérica de chat; (4) accesibilidad como ajustes directos, fáciles de leer y accionar. Quitar numeración ornamental, etiquetas y frases repetidas si no agregan información. Ninguna superficie queda aprobada hasta la revisión visual del usuario.

### Aplicación del rediseño de paneles — 2026-09-28

La investigación anterior se convirtió en una propuesta concreta en `mockups/hf-01-home-definitivo.html`: menú como drawer de dos zonas en desktop y una columna en móvil; navegación pública separada de accesos de cuenta y un solo inicio de sesión; chatbot con sugerencias agrupadas y campo de pregunta independiente; panel de accesibilidad claro para distinguirlo del chatbot; control hamburguesa centrado que se convierte en X. Se quitó la nota técnica repetitiva del chatbot. Se mantienen los iconos que el usuario indicó conservar y los comportamientos existentes.

La colección de inspiración incluye [Awwwards Navigation](https://www.awwwards.com/inspiration/menu-navigation-disrupt), [Siteinspire](https://www.siteinspire.com/), [Land-book](https://land-book.com/), [Godly Sites](https://godly.design/sites/), [Emil Kowalski / skills](https://github.com/emilkowalski/skills) y [Motion Primitives](https://motion-primitives.com/docs/). Para interacción y accesibilidad: [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog), [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover) y [WAI-ARIA APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Son referencias para composición, foco, Escape, colisiones, movimiento y lectura; no se copia código ni se añade dependencia.

Verificado tras este ajuste: el estado cerrado muestra tres barras centradas; falta revisar el estado abierto de cada panel y la adaptación móvil. No se considera aprobado ni congelado hasta que el usuario revise el resultado.

### Biblioteca ampliada de referencias y criterio de uso — 2026-09-28

Las fuentes se agrupan por el tipo de evidencia que aportan; no se tratan como inspiración intercambiable ni como instrucciones para copiar:

| Grupo | Fuentes | Qué revisar |
|---|---|---|
| Sitios completos y dirección visual | [Awwwards](https://www.awwwards.com/), [CSS Design Awards](https://www.cssdesignawards.com/), [The FWA](https://thefwa.com/), [Godly](https://godly.design/sites/), [Siteinspire](https://www.siteinspire.com/), [Land-book](https://land-book.com/), [CSS Nectar](https://cssnectar.com/), [Curated](https://curated.design/), [Httpster](https://httpster.net/), [Minimal Gallery](https://minimal.gallery/) | Composición real, tipografía, ritmo, contraste, responsive y calidad de ejecución. |
| Landing pages, portfolio y comercio | [Lapa Ninja](https://www.lapa.ninja/), [One Page Love](https://onepagelove.com/inspiration), [Commerce Cream](https://commercecream.com/) | Orden del contenido, presentación de producto, CTA, páginas completas y patrones de compra. |
| UX de productos y navegación | [Mobbin](https://mobbin.com/), [Refero](https://refero.design/), [Navbar Gallery](https://www.navbar.gallery/type/dropdowns), [Codrops](https://tympanus.net/codrops/) | Flujos reales, estados, navegación, componentes y demostraciones de interacción. |
| Accesibilidad, interacción y posicionamiento | [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/), [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog), [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover), [React Spectrum](https://react-spectrum.adobe.com/), [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility), [Floating UI](https://floating-ui.com/) | Semántica, teclado, foco, escape, anuncios, ubicación y colisiones; aplicar al HTML actual sin agregar dependencias automáticamente. |
| Repositorios frontend para estudiar patrones/craft | [Radix Primitives](https://github.com/radix-ui/primitives), [Adobe React Spectrum](https://github.com/adobe/react-spectrum), [Floating UI](https://github.com/floating-ui/floating-ui), [Headless UI](https://github.com/tailwindlabs/headlessui), [Motion](https://github.com/motiondivision/motion), [Motion Primitives](https://github.com/ibelick/motion-primitives), [Storybook](https://github.com/storybookjs/storybook), [Emil Kowalski / skills](https://github.com/emilkowalski/skills) | Estudiar implementación, accesibilidad, animación, composición de componentes y documentación visual. Revisar README/docs y ejemplos; no instalar ni adoptar arquitectura en el mockup. |

Las galerías muestran trabajo de calidades y propósitos distintos: un sitio premiado puede sacrificar claridad, rendimiento o accesibilidad por dirección de arte. Para cada decisión de HF-01, guardar en esta sección el enlace al sitio/patrón específico, el detalle observado, qué se adapta (no copia), cómo funciona en móvil y teclado, y el motivo de la decisión. Combinar al menos una referencia de sitio completo con una fuente de patrones o documentación técnica; probar la interacción real cuando exista, no concluir por una miniatura. No añadir referencias como lista ornamental: cada nueva fuente debe cubrir una necesidad aún no cubierta.

### Investigación adicional: componentes, UI con IA y agentes frontend — 2026-09-29

La investigación amplía el banco anterior y separa las fuentes según el problema que ayudan a resolver:

| Necesidad | Fuentes a consultar | Uso recomendado |
|---|---|---|
| Sitios completos y dirección visual | [Awwwards](https://www.awwwards.com/), [CSS Design Awards](https://www.cssdesignawards.com/), [The FWA](https://thefwa.com/), [Godly](https://godly.design/sites/), [Siteinspire](https://www.siteinspire.com/), [Land-book](https://land-book.com/), [CSS Nectar](https://cssnectar.com/), [Curated](https://curated.design/), [Httpster](https://httpster.net/), [Minimal Gallery](https://minimal.gallery/) | Contrastar página completa, ritmo, responsive, tipografía y dirección de arte; Awwwards/Godly/FWA no sustituyen pruebas de claridad o accesibilidad. |
| Pantallas y flujos de productos reales | [Mobbin](https://mobbin.com/), [Refero](https://refero.design/), [Pageflows](https://pageflows.com/), [Lapa Ninja](https://www.lapa.ninja/), [One Page Love](https://onepagelove.com/inspiration), [Commerce Cream](https://commercecream.com/) | Investigar patrones de navegación, búsqueda, onboarding, formularios y comercio con estados y contexto, no solo una captura aislada. |
| Componentes React y movimiento | [React Bits](https://reactbits.dev/), [Motion Primitives](https://motion-primitives.com/docs), [Magic UI](https://magicui.design/docs), [Aceternity UI](https://ui.aceternity.com/components), [shadcn/ui](https://ui.shadcn.com/), [21st.dev](https://21st.dev/) | Examinar una pieza específica y extraer su comportamiento/estructura útil; rediseñarla con la identidad aprobada. Revisar licencia y dependencias antes de copiar código. React Bits usa MIT + Commons Clause; Motion Primitives declara MIT y está en beta. |
| Base accesible y posicionamiento | [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/), [Radix](https://www.radix-ui.com/primitives), [Base UI](https://base-ui.com/react/overview/about), [React Aria](https://react-aria.adobe.com/), [Headless UI](https://headlessui.com/), [Floating UI](https://floating-ui.com/) | Validar semántica, teclado, foco, lector de pantalla, comportamiento modal/no modal y colisiones; no asumir que un ejemplo visual garantiza accesibilidad. |
| Revisión asistida por IA y frontend React | [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills), [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines), [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Considerar sus listas y métodos al auditar o construir; leer el contenido y licencia vigentes y reconciliarlo con `AGENTS.md`, el sistema visual y JavaScript/JSX del proyecto. No instalar skills automáticamente. |
| Interfaces conversacionales con IA | [Vercel AI Elements](https://github.com/vercel/ai-elements) | Referencia futura para estados de conversación y controles. Su stack Next.js + Vercel AI SDK + shadcn/ui + Tailwind no se debe introducir al mockup ni al proyecto sin aprobación arquitectónica. |

**Protocolo para usar estas fuentes:** partir de una necesidad observada en HF-01; comparar al menos una referencia de sitio/pantalla completa y otra de patrón o implementación; anotar componente exacto, evidencia (captura o demo), adaptación a la marca, teclado/móvil/movimiento reducido, licencia y dependencias. Una fuente no obliga a copiar el patrón ni a animar cada control. Mantener los tokens, geometría, assets y decisiones aprobadas de Vértice como autoridad; respetar `AGENTS.md` (React Gate abierto, JavaScript/JSX, sin dependencias nuevas no aprobadas). No se instaló ni integró código, paquete o skill durante esta investigación.

### Búsqueda de catálogo: descubrimiento rápido sin tapar la página — 2026-09-29

Para el buscador de HF-01 se contrastó [Algolia Autocomplete](https://www.algolia.com/blog/ux/replicating-the-algolia-documentation-search-with-autocomplete) (resultados sugeridos, patrón accesible de combobox y operación por teclado) y la composición por campo/lista/estados vacíos del [command menu de shadcn/ui](https://github.com/shadcn-ui/ui/blob/main/apps/v4/components/command-menu.tsx). Adaptación propia a Vértice: popover corto anclado al botón, isotipo oficial, código de catálogo en JetBrains Mono, resultados compactos con material y referencia en una sola línea, sin oscurecer ni cubrir el hero completo; Escape y teclado deben seguir operativos. No se copia el modal expansivo de Algolia ni se adopta dependencia. La propuesta de estilo está implementada en el HTML, pero su captura abierta y la interacción aún deben verificarse; no aprobar todavía.

Verificación visual posterior: captura a 948×572 del buscador abierto confirma escala compacta, marca presente y metadatos alineados; captura del menú abierto confirma lista vertical plegable sin overlay completo; captura del catálogo confirma una única acción “Ver ficha ↗”. Revisión móvil y validación completa de Escape/foco quedan pendientes; esto no equivale a aprobación final de HF-01.

### Corrección de alcance visual — 2026-09-28

El usuario rechazó explícitamente el diseño actual del menú desplegable y pidió quitar ese menú; indicó conservar el botón de tres barras. Por tanto, el panel desplegable actual no está aprobado y no debe describirse como diseño definitivo ni seguir refinándose en la misma dirección. El botón se conserva en el navbar, pero el estado cerrado/abierto y la función posterior quedan por resolver con el usuario; no inventar una función sustituta. Los diseños recientes de asistencia y accesibilidad también requieren validación y no se consideran aprobados por este registro.

### Chatbot: concepto de conversación espaciosa — 2026-09-29

El usuario eligió como referencia para explorar la silueta achaflanada de la ventana Gemini (esquinas facetadas, intermedias entre corte recto y curva) y pidió una conversación reconocible como chat, no un formulario compacto. Adaptación implementada en HF-01: encabezado sobrio, bienvenida en burbuja, respuestas iniciales claras y campo de mensaje anclado abajo. Se conserva la paleta del sitio y se integra el isotipo auténtico con `mockups/favicon.png` tanto en la firma del panel como en el avatar del mensaje; el encabezado usa el código de marca `VÉRTICE CR / ASISTENCIA`. Se omiten métricas decorativas, supuestos de IA/en línea y capacidades no confirmadas. La ventana se coloca junto a los dos botones flotantes en escritorio y por encima de ellos en móvil; probar que no los cubra en las dimensiones objetivo. La captura es una iteración para feedback, no aprobación final.

### Chatbot: integración con el workbench — 2026-09-29

La primera versión todavía se percibía genérica aunque usara marca y color. En `mockups/hf-01-home-definitivo.html`, la capa `chat-identity-pass-02` trata el panel como extensión del workbench del hero, no como widget ajeno: contorno con esquinas facetadas y trazo cobre, superficie ahumada de alta opacidad con blur y retícula técnica tenue, resplandor lava muy contenido, el isotipo en una montura facetada, la bienvenida como burbuja de conversación con borde asimétrico y una línea de guía que conecta con tres opciones numeradas sin tarjetas. El compositor queda anclado abajo con el mismo corte diagonal en input/acción. Se añadió un barrido lineal lento en la cabecera y una entrada corta del mensaje/panel; `prefers-reduced-motion` los elimina. Se reforzó el contraste tras comprobar que la transparencia inicial dejaba demasiado visible la fotografía detrás. No cambian la paleta, el contenido funcional, la posición junto a los botones, el comportamiento de sugerencias, ARIA ni la lógica de envío demo.

**Criterio de referencia y adaptación:** el propio workbench/retícula de HF-01 define el lenguaje visual. [Triol — diseño para ingeniería industrial](https://theqream.com/case-study/triol) aporta el criterio de mantener la identidad de una marca técnica en toda superficie, priorizar claridad y espacio y mostrar ingeniería sin ruido; se adapta sin copiar su composición. [Godly](https://godly.design/) se usó como galería de exploración de dirección visual, no como patrón literal. [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) se consulta únicamente para preservar la semántica y el comportamiento de panel/foco/teclado; no define el estilo. HF-01 y el chatbot siguen **en iteración, sin aprobación final**.

### Remates aprobados para iterar — 2026-09-29

El usuario indicó que le gusta la dirección actual del chatbot y pidió conservarla, completando el trazo en las esquinas achaflanadas para que no parezca interrumpido. Tras la última revisión pidió que no haya recortes de esquina en el marco exterior: el borde debe ser continuo, con radios asimétricos suaves, manteniendo la geometría de marca en elementos interiores. El usuario también pidió el icono de luna junto al sol que ya existía: en tema oscuro se muestra el sol (acción para cambiar a claro) y en tema claro, la luna (acción para cambiar a oscuro); el nombre accesible anuncia el destino del cambio. Para eliminar flechas diagonales repetidas, conservar marcas circulares de registro en la página principal y el retículo facetado en la lista de proceso. En las opciones del chatbot sí se conserva una flecha diagonal de apertura, pero debe ser un icono SVG fino, centrado en su celda derecha, de bajo contraste y con énfasis sutil en hover/foco; no usar círculos ni caracteres tipográficos como sustitutos. Referencia consultada: patrón `IconArrowUpRight` que aparece al hover en [shadcn/ui `directory-list.tsx`](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/components/directory-list.tsx); se adapta a una pista visible también en reposo para que sea descubrible en touch. Conservar flechas con significado direccional real, como bajar a una sección, subir o enviar. La aprobación es específica al concepto del chatbot, no aprueba HF-01 completo ni el panel de accesibilidad.

### Animación y controles del panel de accesibilidad — 2026-09-29

Se agregó al final del CSS de `mockups/hf-01-home-definitivo.html` una composición renovada para el panel: cabecera alineada a la marca, introducción visible, escala A/A+/A++, switches compactos de contraste y movimiento, y restablecimiento claramente separado. Sus controles táctiles tienen al menos 44 px en el eje corto. Se corrigió un fallo de cascada que ocultaba la introducción y se quitó el tratamiento de etiqueta tipo píldora. Entrada del panel y aparición escalonada de sus secciones usan `transform`/`opacity`; las sugerencias del chatbot entran con una secuencia discreta. Se eliminan esos desplazamientos tanto con la preferencia manual como con `prefers-reduced-motion`, manteniendo las señales de estado. Criterios contrastados con la recomendación de movimiento reducido de [Emil Kowalski — review animations](https://github.com/emilkowalski/skills/blob/d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128/skills/review-animations/SKILL.md) y [MDN — media queries de accesibilidad](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using_for_accessibility).

Los controles de contraste y movimiento exponen `role="switch"` + `aria-checked`, nombre y descripción estables; el nombre no cambia cuando se activa, de acuerdo con [WAI-ARIA APG Switch Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/). La escala mantiene `aria-pressed` exclusivo para la selección A/A+/A++. El diálogo es no modal: `Tab` sigue el orden natural y puede salir del panel; `Escape` lo cierra y devuelve el foco al disparador. Se probó con teclado la escala, el contraste en tema claro, estado de switches, restablecimiento, `Escape` y salida con `Tab`; se comprobó el nombre y estado ARIA en el DOM. **Pendiente:** comprobación del panel a 390 px/viewport móvil y revisión manual con lector de pantalla; esto no equivale a certificación WCAG. HF-01 continúa en iteración y el panel aún necesita aprobación visual del usuario.

### Auditoría visual de HF-01 — detalles de controles y búsqueda (2026-09-29)

En respuesta a las anotaciones del navegador se detectó en captura que cada switch mostraba una segunda perilla fantasma: el CSS heredado pintaba `::after` además de la perilla real (`i`). Se anuló ese pseudo-elemento; falta confirmar visualmente el resultado en estados activo e inactivo y a viewport móvil. En CTAs “Cotizar STL” y “Tengo un archivo” se restituye la flecha diagonal real, con pequeño desplazamiento de hover, y en la lista del método se centra el marcador romboidal eliminando su punto interno. Se añadieron reglas de una búsqueda más ancha, centrada, opaca, con campo destacado, resultados en filas y comportamiento responsive; la referencia de composición/teclado es el command dialog de [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/registry/new-york-v4/ui/command.tsx), adaptado a la identidad Vértice y sin sumar datos ni funciones. **No dar por aprobados estos detalles ni cerrar HF-01** hasta fotografiar y revisar los estados reales de búsqueda y switches en el navegador, validar filtro/sin resultados/cierre con Escape y comprobar las vistas 739 px y móvil.

### Continuación de verificación del buscador — 2026-09-29

La captura de escritorio confirmó que el buscador es un popover compacto con marca/isotipo y no cubre el hero. Las pruebas reales de filtro detectaron y corrigieron una colisión de cascada: el `display:grid !important` de la lista anulaba el comportamiento nativo de `[hidden]`. Ahora la consulta `nylon` deja visible solo “Engranaje Helicoidal 60T”; una consulta sin coincidencias oculta todas las filas y muestra “No encontramos piezas con ese término.”, comprobado con captura. El filtro y el estado vacío quedan verificados visualmente en escritorio; siguen pendientes viewport móvil, Escape/retorno de foco, lector de pantalla y las anotaciones de switches/rombos/CTA antes de cerrar HF-01.

### Desplegable Mi Espacio y breakpoint — 2026-09-29

El patrón aprobado para anchos tablet/desktop es el popover compacto “Mi Espacio” (estado de cliente y accesos de sesión/soporte/configuración), no repetir la lista de navegación dentro del navbar. El disparador conserva la lista de navegación completa únicamente bajo `821px`; entre `821px` y `1120px` el navbar ya mantiene los enlaces principales, así que se reutiliza el popover de cuenta igual que en desktop. Esta decisión alinea el comportamiento al breakpoint real de navegación, elimina redundancia y mantiene la lista plegable en móvil.
### Entrada coherente de paneles — 2026-09-29

El panel de asistencia y el de accesibilidad comparten la misma animación de entrada: `a11y-panel-arrive`, 300 ms, `cubic-bezier(.2,.75,.25,1)`, con opacidad y desplazamiento vertical leve. El escalonado de las sugerencias del chat permanece como animación interna independiente. La preferencia manual de menos movimiento y `prefers-reduced-motion` desactivan ambas entradas.

### Ajustes globales en React y alcance del mockup — 2026-09-29

En HF-01, idioma y tamaño de texto son interacciones de demostración limitadas a esta página y no representan una infraestructura global. Requisito para React: idioma debe localizar consistentemente toda la interfaz (incluidos etiquetas, estados, errores y accesibilidad), y escala tipográfica debe aplicarse transversalmente con tokens/unidades relativos sin romper componentes, persistiendo la preferencia según la arquitectura aprobada. No declarar estas funciones globales hasta verificar navegación entre rutas y controles dinámicos. Los switches del mockup usan `role="switch"` con `aria-checked` como única fuente semántica de estado; el valor activo debe diferenciarse visualmente, además de anunciarse.

#### Escala de lectura React — mínimo de accesibilidad

Un ajuste que solo agranda títulos no es suficiente para personas mayores o con baja visión. La escala debe alcanzar **todo el texto visible**, incluidos párrafos, etiquetas, botones, campos y ayudas, y poder llegar al 200% sin pérdida de contenido o función, conforme a [WCAG 2.2, criterio 1.4.4](https://www.w3.org/TR/WCAG22/#resize-text). La interfaz ofrece 100%, 150% y 200%, comunica esos valores y conserva la elección al navegar. En Home, el modo 200% apila el workbench debajo del texto para evitar que ambos bloques se monten; el navbar pasa a su navegación plegable para conservar espacio.

La implementación escala los tamaños declarados en las hojas CSS de la aplicación, incluidos valores absolutos y fluidos. **Verificación realizada 2026-09-30:** el navegador mostró párrafo de 16→32 px y heading de 94→188 px a escala 200%; en Home escritorio se confirmó que copy y workbench no se solapan, los controles muestran los porcentajes y la selección se guarda. Hay pruebas automáticas para persistencia/estado de las tres opciones, además de lint, tests, `check:ui` y build. **Pendiente:** inspección de 150%/200% en tablet y móvil, revisión de rutas secundarias a 200% y prueba con personas usuarias/tecnología asistiva. No declarar conformidad WCAG por esta verificación parcial.

#### Escala tipográfica de viewport amplio y lectura en voz alta — React

El marco de escritorio no solo amplía columnas: desde 1440 CSS px la tipografía completa crece gradualmente hasta un factor máximo de 1.12 en el viewport ancho. El control accesible 100/150/200% multiplica ese tamaño base y conserva su significado relativo al viewport; ninguna preferencia debe perderse en resize o navegación. Los metadatos técnicos pueden seguir siendo visualmente secundarios, pero nunca bajar de un tamaño legible ni ser el único medio para entender una acción.

La ayuda de lectura ofrece dos acciones explícitas: pronunciar el fragmento que la persona selecciona con ratón o teclado, o leer el contenido de `main`; también permite detener la voz, usa el idioma activo y comunica estados/fallos. No lee automáticamente al pasar el cursor ni al seleccionar: la persona inicia la acción desde el panel. Es una ayuda opcional de escucha y **no es un lector de pantalla ni lo sustituye**: semántica, nombres accesibles, teclado y compatibilidad con tecnologías asistivas siguen siendo requisitos independientes que deben probarse aparte. Si el navegador no expone síntesis de voz, se informa sin bloquear la página. Fuente técnica → [SpeechSynthesisUtterance / MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance), [SpeechSynthesis.speak / MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/speak), [SpeechSynthesis.cancel / MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/cancel); patrón adaptado → síntesis nativa del navegador, sin servicio externo ni dependencia, por soporte y control del usuario.

#### Preferencias globales y estado local en React

`AppProviders` envuelve el router con providers compartidos. Por tanto, el contrato global de preferencias es: tema Dark/Light, idioma seleccionado, escala de texto 100/150/200%, alto contraste y movimiento reducido. Se persisten en el dispositivo con claves `vertice-theme`, `vertice-language`, `vertice-text-scale`, `vertice-high-contrast` y `vertice-no-motion`; al cambiar de ruta deben conservarse. La persistencia de idioma no implica que todos los textos de todas las rutas estén traducidos: cobertura incompleta se considera deuda, no una función terminada.

Son estados locales/transitorios: apertura de menú, buscador, panel de accesibilidad/chat; término de búsqueda; conversación en curso; pieza seleccionada en el visor y acordeones/disclosures de una página. No se persisten ni se convierten en preferencia global salvo decisión expresa.

#### Marco responsive compartido React — 2026-09-30

La geometría global se concentra en `src/index.css`: `--page-gutter` y `--page-gutter-compact` controlan márgenes fluidos; `--layout-max-wide` limita el chrome y las composiciones amplias; `--layout-max-content` limita secciones editoriales. Home y navbar reutilizan esos tokens para crecer en monitores grandes, conservar márgenes cómodos y no estirar párrafos indefinidamente. Formularios y paneles mantienen máximos propios cuando la lectura o el flujo requieren una columna estrecha. Breakpoints actuales (820/560 px para composición Home y shell; 1120 px para la grilla del Hero/navbar) son puntos de reorganización, no tamaños de dispositivo garantizados. Validar en anchos reales e intermedios, zoom y escala de texto; “adaptable a cualquier resolución” significa fluido, sin desbordamiento y con jerarquía preservada, no ocupar cada pixel a la fuerza.

#### Tratamiento de fotografías del workbench en Light — React

En tema Light, las superficies que pertenecen a la interfaz (marco, viñetas, degradado inferior, sombra y soporte de miniaturas) deben pasar a tonos cálidos claros y sombras suaves. No se deben trasladar al tema claro las sombras/degradados negros fijos de Dark. La fotografía del objeto conserva sus colores y fondo capturados; ese fondo oscuro no es un panel de interfaz y no se blanquea mediante filtros agresivos que alteren la lectura de la geometría o el material. Si se decide usar fotografía alternativa para Light, debe representar el mismo producto sin inventar detalles y registrarse como asset aparte. La primera adaptación React se documenta en R-H32 de `docs/05`.

En imágenes del catálogo sobre fondos claros, una máscara radial que funde bordes con la superficie oscura de Dark puede parecer opacidad accidental. Para Light se retira esa máscara; la transparencia u opacidad de estados semánticos (por ejemplo, un producto realmente no disponible) se conserva por separado y solo cuando el estado de negocio lo indique.

---

## Auditoría visual orientada a fidelidad HF-01 → React — 2026-09-29

Esta revisión trata `hf-01-home-definitivo.html` exclusivamente como **mockup de máxima fidelidad para el futuro React**. No se evalúa con el estándar de código de producción: la pregunta es si la experiencia visual, la composición, la identidad y los estados están suficientemente bien resueltos como para convertirse en la fuente de verdad del frontend.

### Criterio usado

Se cruzó el mockup actual con:
- el mood aprobado **Obsidian Precision Forge + Lava Orgánica**;
- el criterio anti-slop de Impeccable y los principios de frontend-design de Anthropic: evitar plantillas, adornos sin función, movimiento genérico y composición repetitiva;
- taste-skill y UI/UX Pro Max como referencia para decisiones concretas de spacing, jerarquía, densidad y design DNA;
- Godly, Awwwards, Siteinspire, Land-book, Commerce Cream, Mobbin, Refero, Pageflows y Codrops como benchmark de páginas completas, ecommerce, navegación y experiencias de producto;
- Radix / React Aria / Vercel Web Interface Guidelines para que los comportamientos previstos puedan trasladarse después a React sin romper la experiencia.

### Lo que ya funciona

**La identidad existe.** No parece una tienda genérica de impresión 3D: el workbench, la paleta oscura, el Lava, la retícula, la tipografía y los detalles técnicos forman un lenguaje propio.

**El hero tiene un concepto reconocible.** La pieza grande, el panel técnico, el riel de miniaturas y el movimiento de pointer hacen que el objeto se sienta físico. Esto está alineado con el principio de Anthropic de abrir la página con la característica más propia del dominio, no con un hero SaaS genérico.

**El catálogo tiene material para vender visualmente.** Las fotografías/product shots, tags de material y microinteracciones ya generan una sensación de taller/producto. El siguiente salto no es agregar más tarjetas: es elevar la presentación de cada objeto.

**Los paneles ya dejaron de sentirse completamente genéricos.** Chat y accesibilidad tienen una firma visual propia y el chatbot está integrado al lenguaje de workbench. Esto es más valioso que añadir efectos adicionales.

### Hallazgos visuales que sí importan

**1. El hero todavía concentra demasiadas señales simultáneas.** Scan line, estado, coordenadas, nota técnica, línea de líder, meta inferior, riel y parallax son buenos ingredientes individualmente. Juntos, existe riesgo de que el usuario mire primero la interfaz y después el producto. La dirección correcta es que el producto gane la batalla visual y que la instrumentación aparezca como evidencia secundaria. Codrops muestra ejemplos recientes donde la interactividad 3D y los efectos se usan para profundizar la percepción del objeto, no para competir con él. citeturn360901search1turn360901search2

**2. El catálogo aún se siente algo panel de piezas y no suficiente tienda.** Los códigos REF, tolerancias, etiquetas de material y categorías construyen credibilidad técnica, pero la presentación debe hacer que uno quiera tocar/comprar/abrir la ficha. Una mejora futura para React es reforzar la relación **imagen → nombre → beneficio/uso → acción**, dejando los metadatos técnicos como segunda capa.

**3. El sexto producto con `placeholder-product.jpg` y `FALLBACK DEMO` es un bug visual del mockup, aunque no sea un bug de producción.** Al verse dentro del mismo grid, rompe la ilusión de catálogo final. Para una maqueta que debe representar el futuro sitio, este estado debe desaparecer o ser convertido en un estado deliberadamente diseñado como “próximamente”, no como fallback técnico.

**4. La geometría sí está creando identidad, pero hay demasiadas excepciones.** No hace falta que todo tenga el mismo radio —eso sería genérico—, pero las variantes deben sentirse intencionales. Conviene separar visualmente tres familias: superficies estructurales, controles y cantos facetados de Vértice. La irregularidad debe parecer diseñada, no acumulada.

**5. El uso de micro-etiquetas técnicas necesita más disciplina.** El proyecto ya documenta que labels, numeración y divisores deben comunicar información y no simplemente decorar. El mockup tiene varias capas de WORKBENCH, REF, tags, separadores y nomenclatura. No hay que eliminarlos todos; hay que asegurar que cada uno responda una pregunta real del usuario.

**6. El movimiento necesita una jerarquía.** Actualmente hay hero entrance, reveal sections, parallax, scan, pulse y micro-hover. La referencia correcta no es más animación, sino mejor coreografía. Impeccable y Anthropic coinciden en evitar la suma de pequeños movimientos genéricos y reservar el movimiento para orientar, confirmar o crear un momento memorable. urlImpeccablehttps://impeccable.style/

**7. El CTA principal todavía puede sentirse más de ecommerce especializado.** `Explorar piezas` funciona, pero la página debería producir rápidamente una sensación de “quiero ver qué venden” y no solamente “quiero explorar este experimento visual”. La respuesta no necesariamente es cambiar el texto: puede ser hacer que la primera interacción con el hero y el catálogo revele producto/uso con más fuerza.

### Oportunidades fuertes para el futuro React

**Producto primero.** El componente de producto debería poder cambiar de estado con imagen, variante, material y acción sin perder la composición visual.

**Hover/interaction con consecuencia.** En vez de agregar más efectos a las tarjetas, una interacción podría revelar un segundo ángulo, material, pequeña ficha técnica o transición de imagen. Codrops tiene referencias actuales de grids de producto donde el movimiento cambia la percepción del producto y no solo desplaza una tarjeta. citeturn360901search0turn360901search7

**Descubrimiento progresivo.** El hero puede seguir siendo editorial, pero el usuario debería entender muy rápido que está ante una tienda. La experiencia ideal es: impacto visual → descubrir objeto → entender para qué sirve → entrar a ficha/cotizar.

**Profundidad visual sin Three.js en el hero.** La decisión documentada sigue siendo correcta: usar composición, fotografía, parallax ligero, máscaras, motion y microinteracciones en Home; reservar el visor WebGL real para las rutas de producto y solicitud.

**Responsive como reinterpretación, no reducción.** En 375/768 el objetivo no es encoger el desktop: hay que conservar la firma visual y elegir qué elementos sobreviven. El riel vertical, metadatos, copy y decoraciones pueden cambiar de composición sin perder la identidad.

### Referencia anti-slop

La revisión de Impeccable es especialmente útil porque identifica como señales de diseño generado: exceso de tarjetas, sombras repetidas, etiquetas decorativas, icon tiles y movimientos distribuidos sin propósito. El propio skill recomienda gastar la audacia en un lugar y mantener el resto disciplinado. Ese principio encaja muy bien con Vértice: **el objeto/proceso debe ser el gran protagonista; la interfaz tiene que sostenerlo, no competir con él.** urlImpeccablehttps://github.com/pbakaus/impeccable

### Referencia de diseño distintivo

Anthropic frontend-design plantea que la identidad debe salir del dominio y que los elementos estructurales solo deben existir cuando transmiten información. Para Vértice eso significa que la retícula, geometría, numeración técnica y nomenclatura deben parecer nacidas del taller, no pegadas encima como decoración. urlAnthropic frontend-designhttps://github.com/anthropics/skills/tree/main/skills/frontend-design

### Estado

**HF-01 sigue EN ITERACIÓN.**

El mockup ya tiene una identidad visual fuerte. El siguiente salto no consiste en meter más cosas: consiste en **afinar jerarquía, producto, composición, movimiento y deseo comercial**. Antes de congelarlo, la auditoría debe buscar específicamente bugs visuales, desequilibrios de espacio, elementos que compitan con el producto, responsive defectuoso y estados que parezcan placeholders.

### Criterios visuales derivados del render real — 2026-09-29

Reglas duraderas que salen de los hallazgos V-01 a V-09 de `docs/05`. Aplican al mockup y a React.

- **Los controles flotantes no pueden tapar contenido** en ningún ancho, ni en reposo ni durante el scroll. En HF-01 se resuelve ocultándolos parcialmente hacia el borde mientras hay scroll; no se reubican los botones ni los paneles que abren junto a ellos.
- **Móvil es reinterpretación:** en React, el producto debe verse en la primera pantalla de 375 px; no basta con apilar la columna de texto y dejar el producto debajo.
- **Excepción responsive React del rail de Home:** si el rail vertical coincide con los botones flotantes en tablet/móvil, puede convertirse en fila horizontal con targets táctiles de al menos 44×44 px, dejando un margen libre para Chat/Accesibilidad. El cambio afecta solo al selector, no mueve ni oculta las herramientas flotantes.
- **Catálogo real en React:** no se replica el placeholder ni la etiqueta de fallback del mockup; un producto sin foto es un estado diseñado, no un fallback técnico.
- **Las fotos deben integrarse a la superficie** (fundido o encuadre intencional); un rectángulo visible pegado dentro de la tarjeta se considera defecto.
- **Popovers y menús sobre el hero son casi opacos** (95 % o más) con desenfoque de fondo fuerte: nada del fondo debe leerse detrás de texto interactivo.
- **Un idioma por pantalla:** etiquetas técnicas de interfaz en el idioma activo; no mezclar inglés en la versión en español.
---

## Uso de referencias externas: páginas y repositorios — 2026-09-30

Las referencias externas no tienen la misma función ni autoridad que HF-01. Se usan para **extraer patrones concretos**, nunca para sustituir la identidad de Vértice ni para copiar una solución completa sin contraste.

### Páginas / showcases

Sirven principalmente para estudiar **resultado y comportamiento**: composición, jerarquía, tratamiento de producto, motion, scroll, hover, transiciones, ecommerce, navegación, responsive y densidad.

Flujo de uso: identificar el problema → observar un patrón concreto → describir qué aporta y qué se descarta → adaptarlo a Obsidian Precision Forge + Lava Orgánica → implementar con el stack actual → verificarlo dentro de Vértice.

### Repositorios / código abierto

Sirven principalmente para estudiar **cómo está construido** un patrón: estructura de componentes, estado, interacción, animación, scroll, canvas/WebGL, accesibilidad, reduced motion, teclado, foco, rendimiento y tests.

Antes de reutilizar código o una dependencia: verificar que el repo sea realmente la fuente esperada, revisar licencia, dependencias/bundle, compatibilidad con React 19 + Vite + JS/JSX, extraer la técnica mínima y preferir las primitivas actuales si una librería nueva no está justificada.

**Regla:** una página puede justificar una dirección visual; un repositorio puede justificar una técnica de implementación. Ninguno invalida HF-01 congelado, el dominio ni la arquitectura.

### Scrolltide

**Fuente:** https://www.scrolltide.co/

Se incorpora como referencia de **motion cinematográfico y producto interactivo**. Su biblioteca pública muestra templates, componentes, secciones, UI, shaders y experiencias scroll-driven orientadas a stacks como React/Vite/Next.js, Framer Motion, GSAP, Three.js, WebGL y shaders.

Aplicación útil para Vértice:
- estudiar heroes donde el movimiento profundiza la percepción del objeto;
- estudiar carouseles/depth interactions para producto sin convertir el sitio en una demo;
- estudiar fondos/shaders como referencia de iluminación y profundidad, **no** para introducir lava literal;
- estudiar prompts que especifican layout, tipografía, motion y comportamiento para evitar resultados genéricos de IA;
- usar su Academy como referencia de proceso: construir efectos por etapas y auditar fallos.

No instalar GSAP, Three.js, WebGL, Lenis, Framer Motion ni otra dependencia solo porque aparezca en Scrolltide. La Home mantiene la decisión de usar fotografía, CSS, máscaras, parallax ligero y motion; WebGL real queda para rutas donde aporte valor funcional.

**Repositorios:** no se verificó desde el sitio un repositorio público oficial de Scrolltide. Si aparece uno concreto, debe evaluarse con la regla anterior antes de registrarlo como fuente oficial. No atribuir repositorios externos a Scrolltide sin evidencia.


### Rol de Stitch/UXMagic en implementación — corrección 2026-09-30

Stitch/UXMagic **no es referencia visual** para la implementación React. Se conserva únicamente como apoyo para inventario de páginas, contenido esperado, flujos y estados. El diseño de cualquier pantalla debe derivarse del sistema visual de HF-01 y de las decisiones aprobadas del proyecto.

Para hamburger, menús, popovers, chat, accesibilidad, botones y cualquier otra superficie compartida:
- primero se consulta HF-01 y su historial aprobado en docs/05;
- después se adapta ese lenguaje a React y a la accesibilidad;
- Stitch puede confirmar qué acciones/contenido deberían existir, pero no cómo deben verse.


### Referencias aplicadas en la pasada React Home — 2026-09-30

**Autoridad visual:** HF-01 congelado. Las fuentes externas solo se usaron para elevar motion/craft sin alterar composición, identidad ni stack.

- **Codrops — Grid Item Reveal Animation on Hover / Animated Product Grid Preview:** patrón observado = movimiento de producto como respuesta secundaria al hover, no animación permanente. Adaptación Vértice = escala/rotación mínima de la imagen dentro de ProductCard, elevación corta de tarjeta y estado de foco/hover; sin GSAP ni preview fullscreen.
- **Scrolltide — componentes/sections + Academy:** patrón observado = construir sección por sección, usar profundidad con una jerarquía clara y evitar que todos los elementos compitan por atención. Adaptación Vértice = Hero mantiene una sola experiencia fuerte (producto + parallax/scan), mientras cards/método/especificaciones reciben microinteracciones discretas.
- **Scrolltide shaders / Magma Flow:** evaluado pero **no adoptado**. Vértice ya tiene Lava Orgánica mediante color, luz y materialidad; un shader GPU añadiría ruido, dependencia y protagonismo decorativo innecesario.

No se agregaron dependencias. Todo el polish se implementó con React existente + CSS + IntersectionObserver.


### Reauditoría de chrome / navbar — 2026-09-30

Tras capturas reales del usuario se corrigió una deriva del shell React.

Decisiones vigentes:
- los botones flotantes de Chat/Accesibilidad **se retraen hacia la derecha durante scroll**, bajan opacidad y desactivan pointer-events; al detenerse el scroll reaparecen. Este comportamiento ya existía en HF-01;
- el navbar no trata todos sus controles como la misma tarjeta genérica: búsqueda y tema usan controles técnicos compactos, idioma se lee como selector tipográfico y el CTA conserva jerarquía primaria;
- hamburger permanece como marca funcional limpia, sin caja pesada;
- Search y Mi Espacio tienen superficies independientes; no comparten accidentalmente padding/radio/composición;
- las referencias externas pueden aportar principios de interacción, no identidad. Navbar Gallery refuerza el uso de dropdowns contenidos y escaneables; Motion Primitives sirve como referencia para feedback de selección/hover suave. No se añadió dependencia.

Referencias aplicadas:
- https://www.navbar.gallery/blog/best-dropdown-navigation-bar-designs
- https://motion-primitives.com/docs/animated-background


### Banco de microinteracciones por componente — 2026-09-30

Las referencias externas se investigan por **problema concreto**, no por estética completa.

| Componente | Patrón útil | Fuente | Adaptación Vértice |
| --- | --- | --- | --- |
| Botón primario | relleno/feedback sutil en hover, sin animar toda la página | Codrops — Button Hover Animations | lavado luminoso corto dentro del CTA + elevación mínima; sin partículas ni WebGL |
| Listas / menús | fondo de selección que guía el foco entre filas | Motion Primitives — Animated Background | fondo tenue por fila, desplazamiento de 2 px y flecha funcional; implementación CSS propia |
| Búsqueda | sugerencias/acciones inmediatas mientras se escribe | Algolia autocomplete/search UX | no inventar productos: mostrar acción de búsqueda real + accesos a Catálogo, Materiales y Requisitos |
| Apertura de búsqueda | entrada con carácter sin overlay invasivo | Codrops — Search UI Effects | mantener popover anclado al navbar y enriquecer estados/foco, no fullscreen |
| Scroll / utilidades | esconder controles que invaden contenido durante desplazamiento | HF-01 congelado | flotantes se retraen lateralmente y desactivan pointer-events durante scroll |

Referencias:
- https://tympanus.net/codrops/2021/02/17/ideas-for-css-button-hover-animations/
- https://motion-primitives.com/docs/animated-background
- https://www.algolia.com/blog/ux/autocomplete-how-search-suggestions-increase-conversions
- https://www.algolia.com/blog/ux/the-3-key-search-box-ux-design-elements
- https://tympanus.net/codrops/2017/02/08/inspiration-search-ui-effects/

Regla: extraer **una interacción reusable** por referencia; rechazar demos que añadan dependencia, ruido o falsos datos.


#### Aplicación 02 — enlaces, navegación y focus-within

Patrones extraídos:
- **Motion Primitives / Animated Background:** la interacción debe ayudar a seguir el elemento activo/hover, no llamar atención por sí sola.
- **Codrops / CSS line + button hover:** una línea, desplazamiento o relleno interno corto puede dar respuesta táctil sin cambiar la geometría base.

Aplicación Vértice:
- NavLink: micro-lift de 1 px + línea lava con easing, equivalente en hover y focus-visible.
- LinkText: subrayado que se revela + flecha que se desplaza 2 px.
- IconButton: hover/focus coherentes y press más físico.
- ProductCard, Método y Precisión: `:focus-within` recibe el mismo feedback visual que hover para no privilegiar mouse.
- Sin librerías nuevas; todo CSS y respetando reduced motion.


#### Aplicación 03 — utility button de tema

El usuario pidió recuperar específicamente el control de tema del HF-01 porque su lenguaje técnico compacto sí aporta identidad.

Patrón aplicado:
- 42×42;
- borde lava fino;
- fondo casi negro con brillo radial mínimo;
- geometría compacta/asimétrica;
- sol/luna exclusivos según el destino del cambio;
- hover con rotación/escala muy corta del icono;
- active con compresión física mínima;
- focus-visible comparte feedback con hover.

Referencias externas usadas solo para comportamiento:
- Codrops / Creative Button Styles: efectos CSS simples y sutiles por hover/click.
- Codrops / Subtle Click Feedback Effects: feedback táctil corto para controles de icono.

El patrón **no se replica automáticamente en todos los botones**. Se considera una familia de utility controls para acciones compactas donde el icono es el protagonista.
### Referencias aplicadas al rediseño de Acceso y Asistencia React — 2026-10-01

**Acceso / login**

- [Pageflows — Canva, Logging in (Web)](https://pageflows.com/post/desktop-web/logging-in/canva/): el recorrido observado pone el acceso como tarea principal y presenta sus pasos de forma secuencial. Se adapta como una sola tarjeta de formulario centrada, con email y contraseña en orden conocido; **no** se copia la autenticación de Canva por código ni se agregan proveedores sociales, porque el contrato académico de Vértice exige credenciales demo contra JSON Server.
- [Refero — Login UI Design Guide](https://refero.design/blog/login-ui-design-guide-creating-an-intuitive-user-experience/): patrón consultado = etiquetas reconocibles y campos previsibles, sin depender de placeholders. Se mantiene el formulario etiquetado de Vértice dentro de una superficie delimitada y se conserva intacta su lógica de login.
- Adaptación visual propia: se muestra una galería limpia con fotografías de piezas reales ya presentes en Home; solo conserva el nombre de la pieza y controles funcionales, sin retícula, llamadas técnicas, etiquetas inventadas ni datos ornamentales. El formulario sigue siendo la tarea principal y mantiene etiquetas visibles y su flujo académico intacto.
- **Actualización R-H39:** a petición del usuario, esa galería lineal se reemplaza por un collage de cuatro piezas en marcos editoriales superpuestos. El elemento bajo el puntero sube de capa y escala; foco/selección de teclado da el mismo realce y en touch se puede elegir. La leyenda identifica pieza/material solo tras interacción; el estado inicial guía la exploración sin adjudicar una pieza no seleccionada. El collage guía estructura y solapamiento, no su marca de agua/bordes blancos; se adapta a Obsidian + Lava, con una retícula ambiental muy tenue tomada del lenguaje industrial HF-01. El formulario no cambia.
- **Actualización R-H41:** el collage contiene seis fotografías disponibles, incluida la maqueta y el visual «producto próximamente»; conserva el mismo realce interactivo.
- **Actualización R-H47:** sobre el collage se incorpora un encabezado editorial breve y debajo una instrucción de interacción. La leyenda idle deja de mostrar por defecto el nombre/material del primer elemento; la ficha solo aparece con hover, foco o selección. Se mantiene la composición existente de seis marcos, sin sumar tags decorativos ni claims de catálogo.
- [Framer Marketplace — Spotlight Collage](https://www.framer.com/marketplace/components/spotlight-collage/): patrón observado = pieza multimedia bajo hover sube/escala para aislarse; interacción disponible también por tap. Adaptación = elevar z-index, enderezar y ampliar el marco con CSS; no se instala su componente ni Framer.
- Accesibilidad de la interacción: cada imagen es un botón con nombre localizado y estado `aria-pressed`; el foco visible comparte el énfasis visual y movimiento respeta `prefers-reduced-motion` y la preferencia local.
- Fondo de Acceso: se añade luz cálida de muy baja intensidad y retícula fina usando tokens del tema. La variación rompe la planicie del fondo sin competir con las piezas ni alterar la tarjeta del formulario; ambos temas deben conservar legibilidad.

**Admin / primera expansión del sistema visual (2026-10-01):** se usa la identidad, tipografía, radios y estados del sistema, con jerarquía compacta de trabajo. [Motion Primitives — Animated Background](https://motion-primitives.com/docs/animated-background) aporta el patrón de una selección que orienta dentro de una lista; en Admin se conserva como feedback suave para navegación activa/foco, sin convertir filas estáticas en falsas acciones ni añadir librería. La tarjeta de sesión identifica al operador autenticado y la señal de color siempre acompaña texto.

**KPIs Admin / evolución desde el feedback del usuario:** no resolver las señales operativas como tres tarjetas rectangulares idénticas. Disponerlas en un carril tipográfico abierto, separado por reglas finas; solo una cifra con destino de navegación real recibe regla Lava animada en hover/foco. No animar barras que sugieran un máximo o proporción sin una base de datos válida. Referencia interna → las líneas técnicas y jerarquía de HF-01; adaptación → ritmo abierto y una única señal interactiva; razón → concentrar al operador en la cola accionable sin copiar Stitch ni decorar cifras.

**Navegación e historial Admin — R-H51:** cuando la barra lateral fija exceda el alto del viewport, se desplaza su contenido internamente para mantener accesibles las siete rutas, “Ver tienda” y “Cerrar sesión”. El foco de teclado también desplaza su contenedor. En móvil la barra vuelve al flujo normal de página y sus rutas mantienen scroll horizontal. La actividad usa una línea de tiempo vertical de eventos persistidos, con actor, acción, hora y enlace al registro relacionado; el vacío es un estado explicado y nunca se rellena con ejemplos ficticios.

**Referencia aportada → patrón → adaptación → razón:** las capturas del usuario (2026-10-01) muestran un menú lateral continuo y una línea de tiempo de eventos; se adapta el acceso al menú en ventanas bajas y el orden cronológico inverso para Admin. Se conserva el sistema Vértice y se limita el contenido a eventos presentes en `activityLog`; no se replican paletas de plantillas ni datos demostrativos.

### Dashboard y pedidos menos rígidos — R-H52

El feedback vigente dice que el dashboard funciona, pero se siente cuadrado. La
respuesta aplica geometría existente en tokens, no un set nuevo: la franja KPI
se lee como una sola superficie cálida de radio workbench, el panel de flujo
usa la esquina asimétrica `--radius-panel`, y la leyenda deja de parecer una
fila de cinco celdas. Solo las capas principales reciben superficie;
registro/solicitudes permanecen abiertos. Hover/foco del ID de pedido comunica
la navegación al detalle con un indicador discreto.

**Referencia → patrón → adaptación → razón:** capturas de Admin del usuario →
jerarquía de etapas, registro y detalle → tomar el contenido sin su estética;
los radios `--radius-workbench` y `--radius-panel` del sistema de Vértice suavizan
la silueta sin encerrar cada sección en una tarjeta. Los filtros de pedidos usan
tabs redondeadas con estado de foco/pulsación; la ficha conserva lectura y no
ofrece mutaciones cuyo contrato de negocio aún no existe. Se respeta movimiento
reducido.

### Movimiento Admin de solicitudes — 2026-10-01

La primera bandeja y su detalle extienden los tokens Vértice con jerarquía de
operación, sin copiar el workbench de Home: indicador compartido que recorre la
leyenda activa, anillo SVG proporcionado por estados oficiales, entradas breves
escalonadas de resultados/pasos y acento lateral en la fila que abre detalle.

- [Motion — Layout animations for React](https://motion.dev/docs/react-layout-animations): el elemento de selección acompaña la pestaña activa y el layout responde al cambio de filtro. Adaptación CSS con `transform`; no se incorporó Motion como dependencia.
- [Apache ECharts — transitions](https://echarts.apache.org/handbook/en/how-to/animation/transition/) y [pie proportions](https://echarts.apache.org/handbook/en/how-to/chart-types/pie/basic-pie/): segmentos proporcionalmente ligados al dato, con actualización temporal breve. Adaptación como cuatro arcos SVG filtrables; ECharts no se instala por la pequeña visualización específica.
- [Codrops — Hover Motion Intro](https://tympanus.net/codrops/2024/05/29/hover-motion-intro-animation/): el feedback de movimiento debe hacer perceptible la selección. Adaptación como rail, borde y desplazamiento ligero de la fila hacia su detalle; se descartan tilt, escala de imagen y GSAP por no servir a la revisión.

Accesibilidad: grupos identificados y filtrables con botones de teclado,
`aria-pressed`, estados de solicitud legibles sin depender de color, foco global
visible y alternativa textual/cantidad junto al gráfico. Las entradas animadas y
el indicador de selección se desactivan con `prefers-reduced-motion` y con el ajuste global. El
alcance/datos y las limitaciones del slice están en `docs/08-METRICAS-ADMIN-E-IA.md`.

**Actualización R-H41 — Home:** las tarjetas destacadas se leen como filas horizontales en dos columnas; la miniatura conserva completo el placeholder de catálogo (`object-fit: contain`) en lugar de recortar sus rótulos. Stock sigue fuera de las cards promocionales. La afirmación anterior sobre el punto terminal del líder quedó rechazada tras la inspección del usuario y se corrige en R-H42.

**Actualización R-H42 — Home:** el líder se calcula con las dimensiones naturales de cada foto, sus paddings y su ajuste `contain`; ResizeObserver recalcula el endpoint al cambiar viewport, pieza o tamaño del rótulo. Así el punto terminal cae sobre las coordenadas elegidas para el objeto y la línea nace junto al rótulo. La etiqueta aclara «Filamento · PETG» (o el material de la pieza) y “lattice” se traduce como «estructura aligerada». Las destacadas omiten la pastilla flotante del material, conservada en contextos de catálogo donde sí aporta. La sección de precisión pasa de tres cajas con índice/título/descripción/chip repetitivos a tres columnas editoriales con un título y una descripción, separadas por líneas sobrias.

**Actualización R-H43 — Hero y hover de precisión:** la línea mantiene el ajuste dinámico de R-H42, pero el extremo se calibra a un detalle cercano al borde del objeto para que el trazo sea una llamada corta, no una diagonal que lo atraviesa. La métrica de materiales dice «5 materiales definidos»; describe el alcance FDM confirmado, no existencias. Para las tres tarjetas planas, se aplica el movimiento selectivo de [Codrops — Grid Item Reveal](https://tympanus.net/codrops/2020/03/31/grid-item-reveal-animation-on-hover/): una línea Lava crece en el borde bajo y el titular toma acento/desplazamiento corto al hover. La adaptación evita desplazar una imagen inexistente y conserva el contenido quieto; focus-within comparte feedback y reduced-motion elimina transiciones.

**Actualización R-H44 — señales de Hero y conector continuo:** el usuario detectó que cambiar solo el texto dejó intacto el bloque de métricas. Se reemplaza el conteo por dos señales de servicio: fabricación bajo pedido y FDM con ASA/PLA/PETG/ABS/TPU; se retiran la cifra aislada y la frase redundante «Por etapas». El acento vertical junto al rótulo y el líder pasan a un mismo trazo SVG, con uniones redondeadas, para eliminar el corte visual antes del codo. La jerarquía sigue el principio de HF-01: etiqueta técnica secundaria, dato útil primero; sin claims de disponibilidad. Render React comprobado a 1280×720 y 375×812.

**Asistencia / chat**

- [Vercel AI Elements — Message](https://github.com/vercel/ai-elements/blob/main/skills/ai-elements/references/message.md) y [Conversation](https://github.com/vercel/chatbot/blob/main/components/ai-elements/conversation.tsx): separación observada entre hilo conversacional y compositor, estados del mensaje y área de conversación con desplazamiento propio. Se adapta a la bienvenida, nota honesta de demo, temas rápidos y campo fijo abajo; el chat conserva foco, etiqueta de campo, grupo accesible y respuesta de error local.
- No se instala AI Elements ni su stack: el repositorio exige Next.js, AI SDK, shadcn/ui y Tailwind, que no corresponden al scaffold Vite/CSS actual. Tampoco se añade streaming o respuestas simuladas. La interfaz informa que la respuesta automática aún no está conectada y enlaza al flujo real `/solicitud`.

La referencia externa influye en jerarquía y respuesta de interacción, no reemplaza la autoridad visual HF-01. Estas pantallas React siguen sujetas a revisión del usuario; la inspección con NVDA/VoiceOver/TalkBack continúa pendiente y no se declara conformidad WCAG por este rediseño.

### Auditoría de legibilidad global — 2026-10-01

El usuario informó que al instructor le costaba leer los textos pequeños por defecto, especialmente navbar y footer. Regla de implementación React: reservar JetBrains Mono y tamaños compactos para metadata verdaderamente secundaria; navegación pública y texto de lectura no deben caer por debajo de 14 px al tamaño base. El shell puede usar 13 px en navegación tablet por limitación de ancho, con controles táctiles conservados; labels secundarios pueden ser 12 px, nunca copy principal.

Cambio aplicado a `src/styles/shell.css`: navbar 14 px escritorio / 13 px tablet; CTA 13/12 px; footer cuerpo y enlaces 14 px, títulos y metadata 12 px; idioma 12 px; enlaces de footer con altura mínima 24 px. Los tamaños escalan con `--a11y-font-scale`. Se sustituyó el estado hover naranja de texto por texto de superficie más subrayado Lava para mantener legibilidad del enlace en ambos temas. Esto corrige valores de CSS detectados; requiere completar inspección visual en 768/375 px, Light y escalas 150/200%, y prueba con tecnología asistiva.

Contraste base recalculado para texto: Dark `--dim` da 2.92:1 sobre `--ink`
(`#0d0c0a`) y 2.62:1 sobre `--panel` (`#1b1915`), por lo que se reserva a
decoración/metadata prescindible; `--muted` da 6.20:1 sobre `--ink`. Light
`--dim` da 5.26:1 sobre `--ink` y 4.77:1 sobre `--panel`; `--muted` da 5.96:1
y 5.40:1. Estos ratios de tokens no auditan overlays ni certifican la UI
completa. Preferir `--muted` o `--paper` para copy esencial en Dark.

### Geometría Admin — corrección R-H54 (2026-10-01)

La expansión de HF-01 al dashboard conserva un lenguaje de superficies más
orgánico: usar `--radius-workbench` en superficies largas de resumen/flujo y
radios de esquina derivados de `--radius-control` donde se quiera variar el
ritmo. `--radius-panel` es un token de cuatro esquinas; no se puede insertar
como valor de una esquina dentro del shorthand `border-radius`. El navegador
descarta la declaración completa y el componente queda cuadrado. Para geometría
asimétrica combinar las propiedades longhand (`border-top-left-radius`, etc.)
con tokens de valor único. La curva no debe volverse decoración: contenedor
principal, flujo y medios; los registros internos conservan divisores abiertos.

Referencia → patrón → adaptación → razón: [W3C WCAG 2.2, contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) fija 4.5:1 para texto normal y 3:1 para texto grande; [W3C, ampliar texto a 200%](https://www.w3.org/WAI/WCAG22/Techniques/general/G178.html) sirve como técnica para verificar reflow/legibilidad. Aplicación: no depender solo de ampliar la preferencia global; el tamaño base del chrome debe ser legible. La comprobación de tokens solo cubre los colores nombrados y no certifica WCAG de toda la interfaz.

### Atmósfera del dashboard Admin — R-H55 (2026-10-01)

El usuario aprobó la composición del resumen, pero señaló que los fondos del Admin seguían planos y repetidos. El lienzo del resumen mezcla dos veladuras cálidas con una retícula técnica amplia; el encabezado recibe luz propia; la franja KPI tiene un sustrato tonal; y el panel de distribución suma arcos grabados de baja intensidad detrás de la leyenda. Las zonas de tareas conservan aire y un resplandor local para orientar hacia solicitudes.

**Fuente → patrón → adaptación → razón:** [Codrops — background-blend-mode](https://tympanus.net/codrops/css_reference/background-blend-mode/) → componer fondos por capas en vez de repetir una textura única → gradientes y geometría CSS tintados con tokens Vértice, con intensidades y escalas distintas por función → dar profundidad de taller y guiar la lectura sin competir con los datos. No se copió una interfaz ni código, ni se añadieron dependencias o movimiento. En contraste alto se retiran las texturas ornamentales.

La captura conectada de `/admin` en viewport estrecho Dark confirma el lienzo y los arcos detrás de los datos, con el árbol accesible sin cambios. Falta inspección visual en Light y en anchos desktop/tablet antes de declarar cerrada la revisión visual.

### Extensión visual Admin y claridad de estados — R-H56 (2026-10-01)

La observación del usuario abarca todas las vistas Admin, no solo el resumen.
El fondo ambiental común se extiende al lienzo y al sidebar; cada ruta mantiene
su firma de superficie: el resumen, su retícula amplia; Pedidos, una luz
editorial en el encabezado y filtros-cápsula con conteos; Solicitudes, superficies
de trabajo cálidas con esquinas asimétricas y un trazado circular propio. Los
filtros de Pedidos se envuelven en tablet/escritorio estrecho y se desplazan como
una fila táctil únicamente en móvil.

**Lenguaje de estados:** se sustituye “Por aclarar” por **“Estado no reconocido”**.
El resumen, la bandeja y la ficha explican que el valor original no coincide con
las etapas actuales, se conserva sin recodificar y no se incluye en sus métricas.
Los grupos y conteos no cambian.

**Fuente → patrón → adaptación → razón:** HF-01 (capas de retícula y luz en el
workbench) + tokens de superficie/radio existentes → atmósfera compartida pero
capas particulares según tarea → extender la marca por Admin sin repetir un
fondo idéntico en todos los paneles; mantener la cifra/contexto pegados a cada
filtro para que la barra se lea como navegación operativa. No se incorporan
dependencias ni datos nuevos.

### Customer journey de compra — criterio incorporado

En checkout, [Baymard](https://baymard.com/research-articles/show-shipping-costs-on-product-pages) observa la necesidad de conocer costos de envío que afectan el total antes de llegar al final de compra. Vértice debe hacer visibles costo total y condiciones de entrega antes del pago cuando esos datos estén definidos; no se deben inventar montos ni plazos. El recorrido catálogo (producto con precio definido) permanece separado de solicitud `PENDING_QUOTE` (sin precio final ni pago hasta cotizar). Contrato UX completo y estado de implementación: `docs/03-UX-Y-FLUJOS.md`.

### R-H61 — Regla permanente de pasada visual real

Por indicación explícita del usuario, **toda modificación de interfaz se revisa
en el navegador antes de darla por terminada**, aunque el usuario no vuelva a
pedir auditoría. La revisión se repite después de cada ajuste visual y sobre el
render final. Las pantallas relacionadas deben compartir sistema (tokens,
tipografía, superficies, ritmo y respuesta) sin copiarse entre sí; cada una
mantiene una atmósfera/composición adecuada a su tarea. En responsive se apunta a
1280/768/375 px; cualquier tamaño que el navegador no permita probar queda
declarado pendiente, nunca inferido como aprobado.

### Admin — envío de cotización con destinatarios visibles

El paso de correo se integra en la superficie de costeo existente: mostrar
destinatario cliente y copia ciega al taller como texto operativo, dar una única
acción primaria clara y exponer el estado de envío/error. No crear un panel Gmail
genérico ni afirmar éxito antes de la respuesta del servidor. Mantener el CTA
deshabilitado cuando las direcciones son de muestra/no entregables; seguir usando
tokens, tipografía y superficies de Admin, con movimiento reducido respetado.

### Responsive Admin y navegación de cotización (2026-10-02)

La pasada real detectó compresión de sidebar en tablet y filtros demasiado altos
en móvil; Admin ahora adopta navegación compacta intermedia y dos columnas para
filtros operativos estrechos. Clientes y Pedidos conservan tratamientos de lista
distintos bajo la misma escala de marca. En el shell público, logo/navegación/
utilidades usan columnas intrínsecas para evitar el choque de Contáctenos con
Buscar. El cotizador colapsa a una columna bajo 860 px y usa el atributo vigente
`data-motion="reduced"` además de respetar la preferencia del sistema.

## Corrección de recorridos y referencias — 2026-10-02

Fuente: cuatro anotaciones del usuario del 2026-10-02 → patrón: continuidad de tarea y referencias reconocibles → adaptación: conversación integrada, superficies cálidas de marca y selector visual con búsqueda, selección persistente y foco visible → motivo: definir una pieza requiere espacio de trabajo, no una ventana de soporte. Este patrón se comparte entre cotizador y Admin; no obliga a reemplazar selects pequeños y acotados, como cinco materiales. Sin dependencias nuevas.

### Copiloto operativo Admin — decisión visual vigente (2026-10-03)

El copiloto Admin es una herramienta de trabajo y orientación, no la variante
administrativa del popup de Home. Se presenta como ruta de pantalla completa con
alcance/permisos separados del hilo de consulta; mantiene una composición de
operaciones propia, pero conserva tipografía, superficies, contraste y acento
Vértice. No debe reducirse a una ventana flotante repetida ni copiar la página
de cotización. Fuente → patrón → adaptación → por qué: solicitud explícita del
usuario → los asistentes viven en contextos y tareas distintos → navegación de
alcance + área de conversación dentro del shell Admin → distingue permisos y
evita cubrir las tareas que el operador está consultando. La evidencia visual
del copiloto aún está pendiente por sesión no válida; esta regla no declara la
implementación aprobada.
