# Fase 3 — Wireframes

## Propósito

Este documento traduce las decisiones de `fase3_ux_user_flows_mockup.md` en estructuras de pantalla. No define todavía colores, tipografías finales ni detalles del design system.

## Alcance inicial

La primera iteración cubrirá seis vistas públicas prioritarias en escritorio y móvil:

1. Home.
2. Catálogo.
3. Detalle de producto.
4. Selección de solicitud personalizada.
5. Carrito híbrido.
6. Checkout.

## Reglas generales

- Cada vista debe tener una acción principal visible.
- El contenido debe conservar la jerarquía en móvil.
- Los estados de carga, vacío y error deben ocupar la misma estructura que el contenido final.
- Compra de catálogo y solicitud personalizada deben diferenciarse sin parecer productos distintos.
- El layout no debe depender únicamente del color para comunicar estados.

## 1. Home

### Desktop

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo │ Inicio │ Catálogo │ Solicitar impresión │ Cuenta 🛒   │
├──────────────────────────────────────────────────────────────┤
│                 HERO                                         │
│ Título y propuesta de valor       Imagen/render producto     │
│ [Comprar productos] [Solicitar impresión]                    │
├──────────────────────────────────────────────────────────────┤
│ Manifiesto / propuesta local                                 │
├──────────────────────────────────────────────────────────────┤
│ Productos destacados                     [Ver catálogo]      │
│ [Card] [Card] [Card] [Card]                                  │
├──────────────────────────────────────────────────────────────┤
│ Categorías                                                   │
│ [Gadgets] [Figuras] [Juguetes] [Decoración] [Funcionales]   │
└──────────────────────────────────────────────────────────────┘
```

### Móvil

```text
┌─────────────────────────┐
│ Logo             ☰  🛒  │
├─────────────────────────┤
│ Título                  │
│ Propuesta de valor      │
│ Imagen                  │
│ [Comprar productos]     │
│ [Solicitar impresión]   │
├─────────────────────────┤
│ Destacados              │
│ [Card horizontal]       │
├─────────────────────────┤
│ Categorías desplazables │
└─────────────────────────┘
```

## 2. Catálogo

### Estructura

- Header.
- Breadcrumb o título contextual.
- Título, descripción y CTA de solicitud personalizada.
- Búsqueda.
- Filtros por categoría.
- Ordenamiento.
- Conteo de resultados.
- Grid de productos.
- Paginación o carga adicional.
- WhatsApp flotante.

### Estados

- Loading: skeleton del buscador, filtros y tarjetas.
- Vacío: explicación y acción para limpiar filtros.
- Error: mensaje y botón de reintento.
- Producto no disponible: tarjeta visible, acción deshabilitada y estado textual.

## 3. Detalle de producto

### Desktop

```text
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├──────────────────────────┬───────────────────────────────────┤
│ Galería principal        │ Nombre                            │
│ Miniaturas               │ Descripción                       │
│                          │ Precio                            │
│                          │ Disponibilidad                    │
│                          │ Material / color / cantidad       │
│                          │ [Agregar al carrito]              │
│                          │ [Solicitar personalización]       │
├──────────────────────────┴───────────────────────────────────┤
│ Especificaciones expandibles                                │
│ Productos relacionados                                       │
└──────────────────────────────────────────────────────────────┘
```

### Móvil

La galería aparece primero, seguida por nombre, precio, variantes, CTA principal y especificaciones expandibles. El CTA debe mantenerse visible después de seleccionar variantes.

## 4. Selección de solicitud personalizada

La vista debe presentar dos opciones de igual importancia:

```text
Solicita una impresión personalizada

┌────────────────────────────┐  ┌────────────────────────────┐
│ Tengo un archivo            │  │ Necesito ayuda con diseño  │
│ Ya tengo mi modelo 3D      │  │ No tengo modelo terminado  │
│ [Continuar]                │  │ [Continuar]                │
└────────────────────────────┘  └────────────────────────────┘
```

## 5. Formulario de solicitud

### Paso 1: entrada

- Con archivo: dropzone, nombre, tamaño, formato, eliminar y continuar.
- Ayuda de diseño: descripción, uso, dimensiones aproximadas y referencias.

### Paso 2: requisitos

- Material.
- Color.
- Cantidad.
- Relleno.
- Dimensiones.
- Tolerancias.
- Uso.
- Notas.
- Opción “Necesito asesoría”.

### Paso 3: revisión

- Datos de contacto.
- Archivo o descripción.
- Requisitos técnicos.
- Entrega.
- Estado: “Pendiente de cotización”.
- Edición por sección.
- CTA: “Agregar solicitud al carrito”.

## 6. Carrito híbrido

```text
┌──────────────────────────────────────────────────────────────┐
│ Carrito                                                      │
├──────────────────────────────────────────────────────────────┤
│ PRODUCTOS                                                    │
│ Producto · variante · cantidad · precio · subtotal          │
│                                                              │
│ SOLICITUDES DE COTIZACIÓN                                    │
│ Solicitud · resumen técnico · Pendiente de cotización       │
├──────────────────────────────┬───────────────────────────────┤
│ [Continuar compra]            │ [Continuar con solicitud]    │
└──────────────────────────────┴───────────────────────────────┘
```

La primera versión debe definir qué ocurre con el otro tipo de elemento al iniciar un checkout. Recomendación: conservarlo en el carrito y procesar únicamente el grupo seleccionado.

## 7. Checkout

### Compra de productos

```text
Datos → Entrega → Revisión → Confirmación
```

### Solicitud personalizada

```text
Datos → Entrega → Revisión → Enviar solicitud
```

En móvil, el stepper puede ser compacto y mostrar únicamente el paso actual con progreso textual. El CTA final debe permanecer asociado al resumen visible.

## Criterio de salida

Los wireframes estarán listos cuando cada vista tenga una versión desktop y móvil, una acción principal, estados esenciales y una transición clara hacia la siguiente pantalla.
