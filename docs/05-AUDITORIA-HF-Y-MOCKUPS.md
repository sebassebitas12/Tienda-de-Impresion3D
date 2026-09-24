# Vértice CR — Auditoría HF y mockups

## Referencia

Auditoría global del 2026-09-24 sobre mockups de mockups/HFcompletos. Commit de referencia: ee144ce.

React continúa bloqueado hasta cerrar los bloqueos.

## Estado

| HF | Pantalla | Estado |
|---|---|---|
| 01 | Home | Ajustar |
| 02 | Catálogo | Ajustar |
| 03 | Detalle producto | Mantener + refinar |
| 04 | Selección solicitud | Mantener |
| 05 | Solicitud con archivo | Ajustar |
| 06 | Asistencia IA | Mantener + refinar |
| 07 | Carrito híbrido | **BLOQUEADOR** |
| 08 | Checkout | **BLOQUEADOR** |
| 09 | Seguimiento | Mantener |
| 10 | Admin Dashboard | Simplificar |
| 11 | Admin productos | Ajustar |
| 12 | Login/Registro | Ajustar tono |
| 13 | Portal usuario | Referencia fuerte |
| 14 | Menú móvil | Rehacer |
| 15 | FAQ | Refinar |
| 16 | About/Contact | Revisar |
| 17 | Biblioteca CAD | Depende del modelo de datos |

## Hallazgos críticos

### HF-07
Separar productos y solicitudes. PENDING_QUOTE no tiene cantidad, precio ni subtotal.

Resumen:
- Total de productos.
- Solicitudes pendientes.
- Total a pagar ahora.

### HF-08
Separar checkout de productos y pago de cotización personalizada aprobada.

### HF-10
Dashboard:
- 4 KPI hero;
- ventas;
- pedidos;
- solicitudes;
- inventario;
- alertas accionables;
- resumen operativo IA.

La IA solo interpreta datos calculados y debe mostrar periodo/origen.

### HF-14
Menú móvil con identidad Vértice, foco, teclado y ayuda.

## Hallazgos transversales de la auditoría reciente

- Dark + Light.
- Ayuda accesible y consistente.
- Endpoint externo real documentado.
- JWT y autorización por roles documentados.
- Resumen Admin con IA.
- Mobile 375 y tablet 768 como mockups posteriores.
- No olvidar estados, reduced motion y accesibilidad.

## Pantallas patrón

HF-03, HF-04, HF-06, HF-09 y HF-13. HF-13 es referencia para aprobación de cotización.

## Criterio de aprobación

Negocio + jerarquía + CTA + estados + accesibilidad + responsive + identidad + consistencia + datos disponibles + feedback/movimiento.

## Secuencia

HF-01/05/06 → HF-07 → HF-08 → Login → menú → HF-17 → revisión global → desktop aprobado → mobile/tablet → Design System → arquitectura → código.


## HF-07 — Auditoría comparativa UXMagic + Gemini (2026-09-24)

La segunda revisión comparó la referencia aprobada de Vértice CR contra la propuesta generada en UXMagic. La conclusión de Gemini fue **ajustes menores**: la estructura general y la separación entre productos de catálogo y solicitudes personalizadas se conservaron correctamente.

### Cambios correctos confirmados

- Layout de doble columna: contenido a la izquierda y resumen de pago a la derecha.
- Separación visual entre **Productos de catálogo** y **Solicitudes de Impresión personalizada**.
- Las solicitudes personalizadas mantienen el estado `PENDIENTE DE COTIZACIÓN`.
- El total a pagar actual corresponde solamente a productos de catálogo.
- No se detectó una regresión que vuelva a tratar la solicitud pendiente como producto con precio fijo.

### Ajustes visuales

- Mejorar nitidez de labels técnicos y exportación de assets.
- Dar mayor jerarquía visual al badge `PENDIENTE DE COTIZACIÓN`.
- Aumentar el aire del resumen lateral, especialmente alrededor de la nota previa al CTA.
- Separar aproximadamente 24px entre cards de solicitudes.
- Usar metadata técnica en 12px monoespaciada cuando corresponda.
- Definir hover con borde/acento Lava sutil, sin glow excesivo.

### Ajustes UX

- `Ver especificación` debe parecer una acción secundaria clara.
- Separar mejor controles de cantidad y precios en productos de catálogo.
- No repetir microcopy idéntico de "sin precio/cantidad/subtotal" bajo cada solicitud; sustituirlo por información o acción útil.

### Estado cotizado/aprobado

HF-07 todavía debe representar el ciclo completo de la solicitud:
- `PENDING_QUOTE`: sin precio final, cantidad ni subtotal.
- `QUOTED`: existe monto presupuestado definido por administración/ingeniería.
- `APPROVED`: el cliente acepta la cotización y puede incorporarla al pago según el flujo definido.
- Una solicitud cotizada/aprobada no debe transformarse visualmente en un producto de catálogo ni usar la lógica de `quantity × unitPrice`.

### Responsive a cerrar posteriormente

- 375px: productos de catálogo pasan de tabla a cards verticales; resumen se convierte en bloque inferior o barra sticky de pago.
- 768px: layout de dos columnas colapsa a una columna; resumen debajo o colapsable.
- Estos mockups se producirán después de aprobar desktop.


## HF-07 — APROBADO Y CONGELADO (2026-09-24)

La segunda iteración de UXMagic fue revisada mediante una validación visual final con Gemini. Resultado: **APROBADO**.

### Criterios cerrados

- Separación inequívoca entre productos de catálogo y solicitudes personalizadas.
- `PENDING_QUOTE` sin precio final, cantidad ni subtotal.
- `QUOTED` con monto presupuestado y acción `Revisar cotización`.
- `APPROVED` con monto aprobado y acción `Pagar cotización`.
- Las solicitudes personalizadas no usan `quantity × unitPrice`.
- El total de productos se mantiene separado del flujo de cotizaciones.
- Navbar de Stitch/Vértice conservado.
- Identidad Obsidian Precision Forge + Lava Orgánica consistente.
- Microcopy redundante eliminado.
- Estructura preparada para responsive 375px/768px.

### Decisión

HF-07 no requiere otra iteración de diseño antes de pasar a la siguiente pantalla. Se considera **pantalla aprobada/congelada** para implementación futura.

### Pendientes trasladados a HF-08

- Revisar el detalle de una cotización disponible.
- Pago de una cotización aprobada.
- Excepciones: cotización rechazada, caducada o no disponible.
- Definir claramente si el flujo de pago de cotización es independiente del checkout de productos.
