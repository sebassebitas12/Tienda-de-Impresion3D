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
| 07 | Carrito híbrido | ✅ CONGELADO |
| 08 | Checkout | ✅ CONGELADO |
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


## HF-08 — Auditoría visual de primera propuesta (2026-09-24)

La primera propuesta de HF-08 generada en UXMagic fue revisada como un flujo compuesto por:
1. checkout de productos;
2. checkout de cotización aprobada;
3. confirmación.

Gemini clasificó el flujo como **AJUSTES IMPORTANTES**. La estructura y la identidad visual son consistentes, pero existen correcciones necesarias antes de congelar.

### Correcciones prioritarias

1. **Destino SINPE visible:** el bloque de pago debe indicar de forma explícita el número/cuenta y titular de destino. En mockup puede usarse un valor claramente marcado como demostrativo/configurable; no inventar el dato real de producción.
2. **Separar logística y pago:** SINPE debe vivir en una sección propia, no dentro del bloque de despacho.
3. **Unificar formularios:** en checkout de cotización separar `Contacto` y `Facturación electrónica`, manteniendo coherencia con el checkout de productos.
4. **Vigencia visible:** el checkout de cotización debe mostrar claramente la fecha de vencimiento de la cotización.
5. **Stepper contextual:** evitar `01 Items` en el flujo de cotización; usar `01 Cotización` o `01 Resumen`.

### Correcciones secundarias

- Mejorar contraste de placeholders.
- Dar mayor jerarquía al estado `PAGO PENDIENTE DE VALIDACIÓN`.
- Indicar formatos/tamaño para el comprobante de SINPE.
- Contemplar cotización caducada y comprobante rechazado/inválido.
- Mantener preparada la adaptación a 375px y 768px.

### Nota sobre entrega

Gemini señaló que el costo de entrega podría mostrarse si ya es calculable con la dirección. Esto queda condicionado a que exista una regla/fuente de cálculo definida. Mientras no exista, `Por confirmar` es válido si la interfaz explica cuándo se conocerá el monto. No introducir un costo inventado.

### Estado por pantalla

- HF-08 Productos: **Ajustes**
- HF-08 Cotización: **Ajustes**
- HF-08 Confirmación: **Aprobado con refinamiento visual**

HF-08 completo sigue **NO APROBADO / PENDIENTE DE ITERACIÓN**.


## HF-08 — Auditoría visual de segunda propuesta (2026-09-25)

La segunda iteración de UXMagic fue auditada visualmente con zoom en secciones críticas.
Resultado: **APROBADO CON OBSERVACIÓN MENOR**.

### Criterios verificados

| # | Criterio | Veredicto |
|---|---|---|
| 1 | SINPE tiene sección propia `04 / Método de Pago` con bloque `DESTINO DEL PAGO`, titular `Vértice CR`, número demostrativo `+506 XXXX-XXXX`, monto dinámico, referencia, formatos `PDF / JPG / PNG · MÁXIMO X MB` y botón `Adjuntar comprobante` | ✅ |
| 2 | Entrega y Método de Pago son tarjetas separadas en ambos checkouts | ✅ |
| 3 | Checkout de cotización tiene `02 / Contacto` (nombre, correo, teléfono) y `Facturación Electrónica` (tipo ID, número, nombre/razón social, correo) como secciones independientes | ✅ |
| 4 | Sidebar del checkout de cotización muestra monto aprobado `¢112,000` y vigencia `30/09/2026` de forma visible | ✅ |
| 5 | Stepper del checkout de cotización usa `01 Cotización`; checkout de productos conserva `01 Items` | ✅ |

### Elementos adicionales verificados

- Bloque SINPE incluye nota: *"Dato demostrativo configurable. No corresponde a la coordinación de entrega."* — separa conceptualmente pago de logística.
- Estado `Archivo no válido` preparado visualmente en sección comprobante.
- Badge de confirmación `PAGO PENDIENTE DE VALIDACIÓN` con fondo sutil.
- Checkout de cotización incluye sección de entrega (`Preparación posterior al pago`) con opciones `Entrega a domicilio` / `Retiro`, provincia, cantón, distrito y dirección.

### Observación menor pendiente

En el checkout de cotización, las secciones Contacto, Facturación y Entrega podrían compartir el mismo número de paso (`02`) en lugar de avanzar de forma progresiva (`02 / Contacto`, `03 / Facturación`, `04 / Entrega`). Verificar numeración antes de congelar.

### Estado

- HF-08 Checkout de productos: **APROBADO Y CONGELADO**
- HF-08 Checkout de cotización: **APROBADO Y CONGELADO**
- HF-08 Confirmación: **APROBADO Y CONGELADO**

Observación de numeración resuelta: Contacto y Facturación son sub-secciones del paso `02 Datos`; `03 Entrega` y `04 Método de Pago` son pasos propios. Numeración correcta.

**HF-08: CONGELADO — 2026-09-25.**




## HF-08 — Iteración 2: registro histórico (2026-09-25)

> Esta sección documenta el estado intermedio antes de la auditoría visual con zoom. La auditoría visual posterior confirmó que los cinco puntos estaban resueltos en el mockup real. HF-08 quedó congelado.


## HF-01, HF-02, HF-05 — Ajustes pendientes (2026-09-25)

Pendientes de iteración en UXMagic aplicando las reglas del cierre transversal de desktop.

### HF-01 — Home (Estado: Se ve bien pero NO terminado / En iteración)

Iteración implementada en `mockups/hf-01-home.html` con base oficial en Stitch (`mockups/mainpage.jpg` y `mockups/HFcompletos/Figura_1_Home_Landing Page.png`).

**Puntos aprobados y consolidados:**
- **Navbar oficial de Stitch:** Monograma `V` oficial (`favicon.png`), nombre `VÉRTICE CR`, navegación horizontal (*Inicio*, *Tienda*, *Sobre nosotros*, *Contáctenos*, *Preguntas frecuentes*), botón de cotización técnica y menú de usuario desplegable (`mockups/lista plegable.jpg`).
- **Hero de Stitch:** Título *"De una idea, a algo real."*, badge *IDEAS QUE SE CONVIERTEN EN OBJETOS*, pilares de ingeniería (*Alta precisión*, *Materiales resistentes*, *Diseño a medida*) y botón *Ver catálogo*.
- **Pie de página oficial de Stitch:** 4 columnas (marca con tolerancia $\pm 0.05\text{ mm}$, navegación, ubicación en San José con envíos a las 7 provincias, y métodos de pago con factura electrónica oficial).
- **Regla de negocio crítica respetada:** En la sección de solicitud a medida, badge `PENDIENTE DE COTIZACIÓN · SIN COBRO PREVIO` claramente visible y sin inventar `precio × cantidad`.

**Cambios aplicados — 2026-09-25 (iteración 2):**
1. **Toggle "CAD RAYOS-X" eliminado:** Reemplazado por un badge decorativo animado `● ESCANEANDO` en la esquina superior derecha del visor. No es interactivo (no confunde). La capa de anotaciones CAD ahora siempre está visible con opacidad 18%, sube al 32% en hover del frame — puramente decorativa.
2. **Imagen fallback oficial generada:** `mockups/placeholder-product.jpg` — cubo isométrico wireframe naranja (Lava) sobre fondo oscuro (#0D0B09), con texto "SIN IMAGEN" en monospace.
3. **Todos los `onerror`** actualizados de `placeholder-product.svg` → `placeholder-product.jpg` en hero, thumbnails y product cards.

**Cambios aplicados — 2026-09-25 (iteración 3 — Reconstrucción con imágenes reales auditadas):**
1. **Eliminación total de screenshots de software de diseño (`mainpage.jpg` y `tienda.jpg`):** Se reemplazaron todos los recortes con las 5 imágenes fotorrealistas de alta resolución auditadas en `mockups/images/`:
   - `images/hero-soporte.jpg`: Soporte modular lattice PETG negro (Hero principal + Miniatura 01 + Card 01).
   - `images/producto-engranaje.jpg`: Engranaje helicoidal Nylon PA12 gris oscuro (Miniatura 02 + Card 02).
   - `images/producto-dragon.jpg`: Dragón low-poly PLA SILK iridiscente (Miniatura 03 + Card 03).
   - `images/producto-drone.jpg`: Brazo de chasis drone ASA negro carbono (Miniatura 04 + Card 04).
   - `images/producto-maqueta.jpg`: Maqueta arquitectónica de rascacielos PLA High Detail (Card 05).
   - `placeholder-product.jpg`: Card 06 demostrativa con el fallback oficial wireframe en acción.
2. **Eliminación estricta de precios en Home (`AI_CONTEXT.md` / Regla crítica #33):**
   - Se removieron los precios (`₡8.500`, etc.) que estaban indebidamente presentes en la propuesta anterior.
   - Cada tarjeta ahora muestra metadatos de ingeniería: código en JetBrains Mono (`REF: PRT-001`), tolerancias dimensionales (`±0.05 mm`), material, stock y acción `Ver detalles →`.
3. **Hero Workbench interactivo fiel a Stitch (Corrección de diseño crítica):**
   - **Eliminación total del SVG triangular hardcodeado:** Se eliminó la capa artificial que dibujaba un triángulo con cotas y círculos fijos sobre piezas no triangulares (como el engranaje helicoidal circular).
   - **Línea de llamada técnica auténtica (*Leader Line Callout*):** Fiel a Stitch (`mainpage.jpg`), una línea fina naranja con punto térmico pulsante apunta con precisión al detalle técnico característico de cada pieza (`PETG PRO / ESTRUCTURA LATTICE`, `NYLON PA12 / MÓDULO 2.0 HELICOIDAL`, `PLA SILK / ARTICULACIÓN PRINT-IN-PLACE`, `ASA CARBON / ESTRUCTURA AEROESPACIAL`), actualizando sus coordenadas SVG suavemente al alternar de pieza.
   - **Fusión perimetral de fotografías:** Aplicación de viñeta radial suave (`mask-image`) para eliminar cualquier corte rectangular visible de la imagen contra el fondo Obsidian.
   - **Interactividad física táctil:** Parallax 3D suave (`perspective` / `rotateX` / `rotateY`) sensible al movimiento del mouse a 60 FPS, pausa automática en `hover` o `prefers-reduced-motion`, y rayo láser de escaneo metrológico sutil ($\pm 0.05\text{ mm}$).
4. **Decisión arquitectónica — Ubicación del Visor 3D real:**
   - **En el Hero:** No se utiliza motor 3D pesado (Three.js/WebGL) para no degradar la velocidad de carga (LCP/FCP), optimizar el rendimiento y maximizar el gancho visual y la conversión inicial con fotografía de estudio de alta definición.
   - **Visor 3D interactivo real (WebGL / Three.js con rotación 360°, órbita y vista de capas):** Se reserva exclusivamente para:
     1. **HF-03 Detalle de Producto (`/producto/:id`):** Inspección geométrica, verificación de texturas y selección de variantes.
     2. **HF-05 Solicitud con Archivo 3D (`/solicitud/archivo`):** Validación de mallas STL/STEP/OBJ, dimensiones y orientación antes de cotizar.
5. **Verificación visual en navegador completada:** Auditoría con subagente de navegador confirmando carga limpia, alternancia suave en las 4 piezas con reubicación dinámica de la línea técnica, cero errores 404 y renderizado perfecto de las 6 tarjetas y footer.

**Estado actual:**
- Mockup `mockups/hf-01-home.html` completado con estructura fiel a Stitch, imágenes reales, tokens Obsidian/Lava y sin gráficos falsos. Queda como referencia visual aprobada del Hero y Home.

### HF-02 — Catálogo

Correcciones obligatorias:
- Moneda principal en CRC, no USD. Si aparece equivalente USD debe tener fuente definida.
- Filtros con estado activo claramente diferenciado (chip naranja con X para eliminar filtro individual).
- Sorting visible en toolbar, no enterrado.

Refinamientos visuales:
- Cards de producto: imagen/placeholder geométrico + código en JetBrains Mono + nombre + precio en CRC + badge de material + badge de disponibilidad.
- Filtros por: categoría, material, precio (rango), disponibilidad.
- Búsqueda con indicación de debounce visual.
- Estado vacío específico: "No hay productos con estos filtros" + "Limpiar filtros".
- Skeleton loading en 6–8 cards mientras carga.

Accesibilidad aplicada:
- Disponibilidad comunicada con texto + badge, nunca solo color.
- "Sin stock": card visualmente atenuada + texto "Sin stock" visible.
- Filtros accesibles por teclado. Checkboxes con label explícito.

### HF-05 — Solicitud con archivo

Correcciones obligatorias:
- Eliminar cualquier precio o rango de precio en pantalla de upload — la pantalla es pre-cotización.
- Si aparece un estimado de IA, debe llevar badge `ORIENTATIVO · SUJETO A VALIDACIÓN` prominente, nunca como texto secundario.

Refinamientos visuales:
- Dropzone con estados claros: idle, drag-over (borde naranja), processing (spinner + texto), success (nombre + extensión + tamaño), error-format, error-size.
- Progreso visible entre pasos del formulario de especificaciones.
- Datos técnicos del archivo en JetBrains Mono.

Accesibilidad aplicada:
- Todos los estados del dropzone comunicados textualmente (no solo visualmente).
- Botón de remove/replace accesible con `aria-label`.
- `HelpDisclosure` junto al dropzone explicando formatos aceptados y cómo preparar el archivo.
- Formulario de especificaciones: cada campo con `<label>` explícito, no solo placeholder.

### Siguiente acción

Generar iteración en UXMagic para HF-01, HF-02 y HF-05 con estas correcciones. Auditar con zoom en los puntos críticos antes de congelar.
