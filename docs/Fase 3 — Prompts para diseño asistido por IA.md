# Fase 3 — Prompts para diseño asistido por IA

## Cómo usar estos prompts

Usar estos textos en v0, ChatGPT u otra herramienta visual para explorar alternativas. La salida de la IA es una propuesta, no una decisión aprobada. Comparar siempre con `fase3_ux_user_flows_mockup.md`, la Fase 1 y la Fase 2.

## Prompt base de contexto

```text
Estoy diseñando una tienda costarricense de impresión 3D llamada “TicoForge”.

El producto tiene dos caminos principales:
1. Comprar productos terminados del catálogo.
2. Solicitar una impresión personalizada con archivo 3D o ayuda de diseño.

La experiencia debe ser tecnológica pero accesible, premium sin ser fría y local con alcance internacional. El usuario casual debe poder explorar y comprar sin conocimientos técnicos. El usuario técnico debe poder solicitar una cotización sin recibir un precio inventado.

Dirección visual:
- Dark mode como experiencia principal.
- Fondo #0A0E1A.
- Paneles #111827.
- Elementos elevados #1F2937.
- Acento cian eléctrico usado con moderación.
- Texto principal #F1F5F9.
- Texto secundario #94A3B8.
- Space Grotesk para UI y títulos.
- JetBrains Mono para precios y datos técnicos.
- Glow sutil únicamente en acciones importantes.
- Sin estética gamer, partículas constantes, arcoíris ni efectos excesivos.
- Mucho espacio, jerarquía clara y composición responsive.

Tecnología objetivo:
- React, JavaScript, Tailwind CSS y shadcn/ui.
- Componentes reutilizables.
- No implementar backend, autenticación real ni pagos.
- Preparar la estructura para conectar una API posteriormente.
```

## Prompt para catálogo

```text
Usa el contexto base anterior. Diseña la vista completa de catálogo para escritorio, tablet y móvil.

Incluye:
- Header responsive con Inicio, Catálogo, Solicitar impresión, Cuenta y carrito.
- Título y descripción del catálogo.
- CTA destacado para solicitar impresión personalizada.
- Búsqueda.
- Filtros por Gadgets, Figuras, Juguetes, Decoración y Piezas funcionales.
- Ordenamiento y contador de resultados.
- Grid de ProductCard responsive.
- Cada tarjeta debe mostrar imagen, nombre, material, precio en colones, disponibilidad, Ver detalle y Agregar al carrito.
- Estados loading, vacío, error y producto no disponible.
- Paginación o Cargar más.
- Botón flotante de WhatsApp.

Usa Button, Card, Badge, Input, Select, Skeleton, Alert, Pagination y Sheet de shadcn/ui cuando correspondan. Explica la jerarquía y divide la solución en componentes. La búsqueda debe representar que q y categoria se reflejarán en la URL. No muestres precios para solicitudes personalizadas.
```

## Prompt para wireframes

```text
Usa el contexto base anterior. Crea wireframes de baja fidelidad, sin definir todavía color final, para estas vistas:
Home, Catálogo, Detalle de producto, Selección de solicitud, Carrito híbrido y Checkout.

Entrega cada vista en versión desktop y móvil. Para cada una indica:
- objetivo;
- contenido principal;
- acción primaria;
- acción secundaria;
- estado vacío;
- estado de error;
- transición a la siguiente pantalla.

No agregues funciones fuera del MVP ni panel administrativo avanzado.
```

## Prompt para detalle de producto

```text
Usa el contexto base anterior. Diseña el detalle de un producto impreso en 3D.

Incluye galería con miniaturas en desktop y carrusel táctil en móvil, nombre, descripción, precio, disponibilidad, material, color, cantidad, dimensiones, tiempo estimado, especificaciones expandibles, Agregar al carrito y Solicitar impresión personalizada.

Define estados de imagen ausente, producto no encontrado, variante incompleta, loading y agregado exitoso. Mantén una jerarquía orientada a conversión sin saturar de información técnica.
```

## Prompt para solicitud personalizada

```text
Usa el contexto base anterior. Diseña el flujo de solicitud personalizada en tres pasos.

Paso 1: elegir Tengo un archivo o Necesito ayuda con el diseño. Para archivo, usa una zona de carga para .stl y .obj con nombre, tamaño, eliminar y continuar. Para ayuda, solicita descripción, uso, dimensiones aproximadas y referencias.

Paso 2: material, color, cantidad, relleno, dimensiones, tolerancias, uso y notas. Permite indicar Necesito asesoría.

Paso 3: revisión editable de contacto, archivo o descripción, requisitos y entrega. Mostrar Precio: Pendiente de cotización. CTA: Agregar solicitud al carrito.

Incluye estados loading, error de formato, archivo pesado, validación, éxito y pérdida de conexión. No inventes cotizaciones.
```

## Prompt de evaluación de una propuesta visual

```text
Evalúa esta propuesta de interfaz para la tienda de impresión 3D contra estos criterios:
1. ¿Presenta claramente compra y solicitud personalizada?
2. ¿La acción principal es evidente?
3. ¿La jerarquía funciona en móvil?
4. ¿El diseño respeta tecnología de precisión sin parecer gamer?
5. ¿El cian está reservado para acciones importantes?
6. ¿Los estados loading, vacío, error y success son claros?
7. ¿La interfaz permite navegación por teclado y foco visible?
8. ¿La solicitud personalizada evita mostrar un precio inventado?

Devuelve hallazgos por severidad: crítico, importante o menor. No propongas funciones nuevas fuera del MVP.
```

## Regla de aprobación

Una propuesta generada por IA solo se incorpora al proyecto después de compararla con los documentos de la Fase 3 y aprobar explícitamente sus pantallas, componentes y comportamiento.
