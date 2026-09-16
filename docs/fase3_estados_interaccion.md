# Fase 3 — Estados e interacción

## Propósito

Definir el comportamiento visible de las vistas antes de implementarlas. Cada pantalla dependiente de datos debe contemplar carga, éxito, vacío, error y validación.

## Estados globales

| Estado | Comportamiento |
|---|---|
| Loading | Mostrar skeleton o indicador contextual. Deshabilitar acciones que no pueden repetirse. |
| Success | Confirmar la operación cerca del elemento afectado. Usar texto y no solo color. |
| Empty | Explicar qué ocurrió y ofrecer una acción útil. |
| Error | Explicar el problema en lenguaje claro y ofrecer reintentar cuando corresponda. |
| Disabled | Mantener legibilidad e indicar por qué la acción no está disponible. |
| Processing | Cambiar el texto del CTA y evitar envíos duplicados. |
| Focus | Mostrar foco visible en teclado. |
| Reduced motion | Eliminar animaciones no esenciales con `prefers-reduced-motion`. |

## Home

- Carga: skeleton de hero y productos destacados.
- Error de destacados: conservar el hero y mostrar reintentar en la sección.
- Acción CTA: feedback inmediato al navegar.

## Catálogo

- Búsqueda: debounce conceptual, indicador de actualización y preservación de filtros.
- Resultados vacíos: “No hay productos con estos filtros” y acción “Limpiar filtros”.
- Error: “No pudimos cargar los productos” y botón “Reintentar”.
- Producto no disponible: tarjeta visible, badge de estado y CTA deshabilitado.
- Agregar al carrito: botón cambia brevemente a confirmación y actualiza contador.

## Detalle de producto

- Imagen ausente: placeholder con rejilla CAD sutil.
- Producto inexistente: estado dedicado con enlace al catálogo.
- Variante incompleta: mensaje junto al campo, sin desplazar al usuario lejos del error.
- Agregar al carrito: evitar doble incorporación accidental durante procesamiento.

## Solicitud personalizada

### Archivo

- Aceptar inicialmente `.stl` y `.obj`.
- Mostrar nombre, tamaño y acción de eliminar.
- Rechazar formato no compatible con mensaje junto al dropzone.
- Mostrar error si supera el límite configurado.
- No mostrar “subida exitosa” hasta que la operación realmente termine.

### Formulario

- Marcar campos obligatorios con texto y no solo color.
- Permitir “Necesito asesoría” cuando el usuario desconoce un dato técnico.
- Conservar la información al regresar al paso anterior.
- Deshabilitar avance mientras falte un dato obligatorio.

### Revisión

- Cada sección debe tener una acción “Editar”.
- El precio debe mostrar “Pendiente de cotización”.
- El envío debe quedar claro aunque la cotización no tenga precio final.
- Al agregar al carrito, confirmar que la solicitud fue guardada.

## Carrito híbrido

- Vacío: explicar que se pueden explorar productos o solicitar una impresión.
- Productos y solicitudes deben tener encabezados separados.
- El subtotal solo aplica a productos con precio definido.
- La solicitud debe mostrar resumen técnico y “Pendiente de cotización”.
- Las acciones de checkout deben identificar claramente qué grupo se procesa.

## Checkout

### Producto

```text
Datos → Entrega → Revisión → Confirmación
```

- Validación inline en datos y entrega.
- Revisión editable.
- CTA final: confirmar pedido.
- No permitir doble envío.

### Solicitud

```text
Datos → Entrega → Revisión → Enviar solicitud
```

- No mostrar CTA “Pagar”.
- CTA final: “Enviar solicitud de cotización”.
- Confirmación: “Solicitud recibida. En revisión”.

## Autenticación

- El usuario invitado puede explorar y preparar la operación.
- Antes de confirmar o enviar, mostrar login modal sin perder contexto.
- Si el login falla, conservar carrito, formulario y paso actual.
- El registro inicial solicita nombre, correo y contraseña.

## Accesibilidad

- Todos los controles deben tener nombre accesible.
- Inputs deben tener `Label` asociado.
- Errores deben anunciarse cuando sea necesario y quedar vinculados al campo.
- Los modales deben gestionar foco y permitir cierre por teclado.
- Los estados no deben depender solo de color.
- Las imágenes informativas deben tener texto alternativo.

## Criterio de salida

Cada flujo estará listo cuando se haya definido qué ve el usuario en carga, éxito, vacío, error, validación, procesamiento, foco y móvil.
