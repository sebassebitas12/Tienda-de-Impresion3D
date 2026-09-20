# HF-02 — Catálogo

> Propuesta de alta fidelidad para revisión. No es implementación React ni fija todavía la identidad visual definitiva.

**Fecha:** 2026-09-19  
**Rama:** `Pruebas`  
**Estado:** 🔄 En revisión

## 1. Objetivo

Convertir el catálogo en la principal experiencia de descubrimiento de productos, manteniendo clara la segunda vía de negocio: solicitar una impresión personalizada.

## 2. Usuario y contexto

Usuario público, visitante o cliente autenticado que llega desde Home, una categoría o una búsqueda.

## 3. Ruta

`/catalogo`

Búsqueda:

`/catalogo?q=...`

Categoría:

`/catalogo?categoria=...`

Los filtros avanzados permanecen como estado interno de la interfaz.

## 4. Jerarquía de pantalla

### Desktop

1. Header global.
2. Breadcrumb o contexto de navegación.
3. Título **Catálogo** y descripción breve.
4. CTA visible **Solicitar impresión personalizada**.
5. Barra de descubrimiento:
   - búsqueda;
   - categoría;
   - ordenamiento;
   - conteo de resultados.
6. Grid de productos.
7. Paginación o carga adicional.
8. WhatsApp flotante.

### Mobile

1. Header compacto.
2. Título y CTA.
3. Búsqueda.
4. Filtros/ordenamiento en controles compactos.
5. Conteo de resultados.
6. Productos en una composición de una columna.
7. Navegación adicional sin competir con el CTA principal.
8. WhatsApp flotante.

## 5. Tarjeta de producto

La tarjeta debe priorizar descubrimiento visual.

Contenido obligatorio:

- imagen;
- nombre;
- precio;
- estado cuando corresponda.

El estado de disponibilidad no depende únicamente del color.

Producto no disponible:

- permanece visible;
- muestra estado textual/badge;
- CTA queda deshabilitado.

No se agrega información técnica extensa a la tarjeta; esa información pertenece principalmente al detalle.

## 6. Acciones

Acción primaria de la pantalla:

**Explorar y seleccionar productos.**

Acciones secundarias:

- buscar;
- filtrar por categoría;
- ordenar;
- abrir detalle;
- solicitar impresión personalizada.

La CTA de personalización debe ser visible sin desplazar el catálogo a segundo plano.

## 7. Estados

### Loading

Skeleton para:

- búsqueda;
- filtros;
- conteo;
- tarjetas.

### Empty

Texto:

**No hay productos con estos filtros**

Acción:

**Limpiar filtros**

### Error

Texto:

**No pudimos cargar los productos**

Acción:

**Reintentar**

### Disponible

La tarjeta permite continuar al detalle y agregar desde el contexto permitido.

### No disponible

La tarjeta sigue visible, pero la acción de compra queda deshabilitada con estado textual.

### Agregar al carrito

Feedback inline y actualización del contador del carrito.

## 8. Interacción

- La búsqueda utiliza debounce conceptual.
- Los filtros se conservan durante la consulta.
- Los parámetros `q` y `categoria` permiten recuperar y compartir el contexto.
- El catálogo no debe perder el contexto al volver desde el detalle.
- Las transiciones no deben impedir la navegación ni la lectura.

## 9. Dirección visual en exploración

Se toma como referencia la identidad actualmente documentada:

- dark mode como experiencia principal;
- superficies oscuras con profundidad;
- composición técnica y editorial;
- geometría inspirada en CAD de forma controlada;
- iluminación/acento cálido como hipótesis actual;
- glow solo donde contribuya a jerarquía o interacción.

**Pendiente de decisión:** tokens finales de color, tipografía y tratamiento exacto de superficies. No se fijan en este documento como definitivos.

## 10. Responsive

Desktop debe priorizar:

- descubrimiento por grid;
- controles visibles;
- mayor respiración;
- jerarquía entre catálogo y CTA de personalización.

Mobile debe priorizar:

- búsqueda accesible;
- filtros compactos;
- tarjetas legibles;
- interacción táctil;
- CTA principal claramente identificable.

## 11. Animación

Candidatas para revisión:

- entrada suave de productos;
- hover con profundidad controlada;
- feedback inmediato de acciones;
- transición visual al abrir el detalle.

Se descartan por ahora:

- partículas decorativas;
- efectos permanentes que compitan con el producto;
- animaciones repetitivas sin función.

Estas decisiones quedan sujetas a revisión visual y reduced motion.

## 12. Relación con otras pantallas

Anterior:

**HF-01 Home / Landing**

La Home dirige al catálogo mediante destacados y categorías.

Siguiente:

**HF-03 Detalle de producto**

El catálogo prepara el descubrimiento; el detalle concentra variantes, disponibilidad, especificaciones y acciones de compra/personalización.

## 13. Criterios de revisión

- [ ] Respeta Fase 1.
- [ ] Respeta UX de Fase 3.
- [ ] Mantiene diferenciados compra y personalización.
- [ ] Tiene desktop y mobile.
- [ ] Incluye loading, empty, error y no disponible.
- [ ] No usa color como único indicador de estado.
- [ ] No inventa precio ni datos de producto.
- [ ] Mantiene la identidad visual como propuesta, no como decisión final.
- [ ] Considera teclado y reduced motion.
- [ ] No requiere implementación para validar la propuesta.

## 14. Decisiones pendientes

- tokens visuales finales;
- densidad exacta del grid;
- comportamiento final de paginación vs. carga adicional;
- tratamiento final del CTA de personalización;
- tratamiento visual final de filtros en mobile.

No se implementan hasta quedar documentadas/aprobadas.
