# Vértice CR — Auditoría HF y mockups

> Última actualización: **2026-10-03**.

## Ficha de producto Admin con asistencia IA — 2026-10-04

Captura real de `/admin/catalogo/nuevo` con sesión Admin en Dark y Light,
ventana aproximada 1344×625. El CTA «✨ Autocompletar ficha con IA» se presenta
dentro de la ficha, alineado con el texto de alcance; no reutiliza el panel
flotante ni duplica el Copiloto Admin. En Light el botón habilitado conserva
contraste con el naranja de marca; para el nombre vacío sigue disponible y
explica la validación al activarlo. La estimación se comunica como propuesta,
antes de los campos de edición y del calculador.

Pendiente: verificar la composición en viewports dedicados 768/375 px. `agent-
browser` no está instalado en el entorno y no se añadió como dependencia para
esta auditoría. La captura de escritorio no se presenta como evidencia
responsive ni como prueba de respuesta real del workflow actualizado.

## Auditoría Admin A3 con render real — 2026-10-03

Se inspeccionaron 78 vistas: 13 rutas/estados en 375, 768 y 1280 px, Dark y Light. Para mantener evidencia útil sin versionar decenas de variantes, el repositorio conserva una captura representativa por pantalla/estado y tema en `automation/evidence/a3-{vista}-1280-{dark,light}.png` (26 archivos). Las capturas de 375/768 px y estados auxiliares quedan en `automation/evidence/_local_archive/`, carpeta local ignorada por Git; no se borraron.

| Vista | Ruta |
| --- | --- |
| resumen | /admin |
| solicitudes | /admin/solicitudes |
| solicitud-revision / solicitud-cotizada | /admin/solicitudes/r1 / r5 |
| pedidos / pedido-detalle | /admin/pedidos / /admin/pedidos/o3 |
| catalogo / producto-detalle | /admin/catalogo / /admin/catalogo/p7 |
| producto-editar / producto-nuevo | /admin/catalogo/p7/editar / /admin/catalogo/nuevo |
| categorias | /admin/catalogo/categorias |
| clientes / cliente-detalle | /admin/clientes / /admin/clientes/u2 |

Defectos corregidos y revalidados: título/acciones de Catálogo desbordaban a 375; Resumen y piezas del pedido ocultaban columnas monetarias; steps cortaban etapas; referencias demasiado estrechas a 768; círculo ornamental de cotización; códigos de estado expuestos en historial de Clientes. Las capturas se toman después de la animación de entrada, sin eliminar movimiento solicitado. No se observó desborde horizontal del documento en las vistas finales.

Estados adicionales: costeo avanzado abierto a 375 Light, búsqueda de fotos vacía, selección con Enter y modal de baja en Dark/Light. Captura enfocada de selector: `a3-image-picker-1280-light.png`; modal de producto: `a-admin-product-delete-confirm.png`. Escape devuelve foco al botón Eliminar tras corregir el disparador asíncrono. CRUD se hizo con datos desechables; no se enviaron correos ni alteraron pedidos originales.

Activity no formó parte de la matriz A3 de 13 vistas. La revisión operativa separada se documenta abajo. Estas capturas no prueban tecnología asistiva real, n8n real, almacenamiento privado o laminado. p2 sigue con placeholder porque su foto registrada falta. Home/HF-01 no se modifican.

### Activity con historial operativo local — 2026-10-03

Se abrió `/admin/actividad` con sesión Admin y JSON Server local. La API devolvió
tres eventos persistidos (`REQUEST_INCORPORATED`, `REQUEST_REVIEW_STARTED`,
`REQUEST_AUTO_QUOTED`); la pantalla los ordenó del más reciente al más antiguo,
mostró transición/actor y permitió abrir la solicitud enlazada. La inspección
visual y del árbol accesible se hizo en Light, 1280×720. No se generaron eventos
de prueba ni se alteró la base durante esta revisión; la captura puntual no se
retuvo como archivo, porque la matriz versionada conserva solo la selección A3.

## Estado oficial

> **HF-01: CONGELADO** (aprobación del usuario, 2026-09-30).  
> **React Gate: ABIERTO.**  
> Las secciones históricas de este documento que digan “EN ITERACIÓN” o “NO CONGELADO” son snapshots del momento en que fueron escritas; no contradicen la decisión de congelación.

## Referencia

Auditoría global del 2026-09-24 sobre mockups de mockups/HFcompletos. Commit de referencia: ee144ce.

## Snapshot operativo — 2026-09-29 (histórico)

- HF-01: **CONGELADO** (actualizado 2026-09-30 por aprobación del usuario).
- Fuente actual: `mockups/hf-01-home-definitivo.html`.
- `mockups/hf-01-home.html` y `mockups/hf-01-home-remoto-pruebas.html` son referencias comparativas; no sobrescribir.
- La auditoría vigente evaluó HF-01 como **mockup de máxima fidelidad para React**, no como código de producción.
- **Defectos visuales (V-01 a V-09):** ver sección «Auditoría visual con render real». V-01 y V-04 a V-09 se implementaron en el mockup; V-02 y V-03 son requisitos de React. Deuda visual conocida se traslada a la implementación React.
## Estado

| HF | Pantalla | Estado |
|---|---|---|
| 01 | Home | ✅ CONGELADO (2026-09-30) |
| 02 | Catálogo | Ajustar |
| 03 | Detalle producto | Mantener + refinar |
| 04 | Selección solicitud | Mantener |
| 05 | Solicitud con archivo | Ajustar |
| 06 | Asistencia IA | Mantener + refinar |
| 07 | Carrito híbrido | ✅ Aprobado documental (UXMagic + validación Gemini, sin HTML propio) |
| 08 | Checkout | ✅ Aprobado documental (UXMagic + validación Gemini, sin HTML propio) |
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


## HF-01 — Reconstrucción, Auditoría y Aprobación Final (2026-09-25)

A partir de la auditoría de 9 capturas de video del usuario de la versión previa de Codex y el análisis del Anteproyecto (FWD Academy), se reconstruyó íntegramente `mockups/hf-01-home.html` recuperando el trabajo previo e integrando los estándares de producción definitivos:

### 1. Estructura Narrativa Editorial
- **01 / SELECCIÓN DE TALLER:** Catálogo curado de 6 piezas reales con metrología de capa (`CAPA 0.08 mm - 0.20 mm`), tags de inventario dinámicos (`EN STOCK`, `BAJO PEDIDO`, `NUEVO LOTE / FALLBACK DEMO`), badges de material de ingeniería (PETG Pro, Nylon PA12-CF, Resina 8K, PLA High Detail) y microiluminación spotlight en cursor con tilt 3D suave.
- **02 / EL MÉTODO:** Split layout editorial que desglosa el protocolo de manufactura aditiva en 4 fases (`01 Análisis de Geometría`, `02 Selección de Material`, `03 Fabricación Paramétrica`, `04 Metrología y Curado ±0.05 mm`) con secuenciador de pulsos en tiempo real (`stepIndexPulse` cada 4s).
- **03 / SEÑALES DE PRECISIÓN:** 3 tarjetas de métricas industriales con números monumentales monoespaciados (`±0.05 mm Ingeniería`, `8K Material`, `24-48 h Cobertura GAM y 7 Provincias`) y ondas concéntricas de radar respirando activamente en el fondo (`radarPulseMotion`).

### 2. Visor Workbench de Doble Entrada (Hero)
- **Fotografía de estudio real como protagonista:** Eliminación completa de falsos wireframes tridimensionales superpuestos; integración de 4 piezas maestras (Soporte Modular Lattice, Engranaje Helicoidal Nylon, Dragón Geométrico de Colección, Chasis Drone) con máscara alfa perimetral que funde bordes en el fondo obsidian (`#0D0B09`).
- **Anotación técnica SVG dinámica (Leader Lines):** Coordenadas nodales vectoriales que se recalculan en tiempo real según la pieza activa, indicando polímero y método de manufactura.
- **Movimiento vivo a 60 fps:**
  - Levitación continua y orgánica de la pieza (`heroFloatIdle`) combinada con parallax de mouse.
  - Pulso respiratorio de la recámara térmica de lava (`thermalPulse`).
  - Barrido dinámico del haz láser de escaneo con glow de acento (`laserSweep`).
  - Retícula de mira giratoria (`crosshair-target`) y marcas de coordenadas (`01° 53' N / 70° 30' W`).
- **Cinta Ticker de Telemetría Técnica AM (Running Marquee):** Banda continua que recorre el ancho de la página con datos de operación en tiempo real (tolerancia ±0.05 mm, cama 110°C, polímeros PA12/PETG/8K, ISO 9001 y despacho nacional).

### 3. Accesibilidad Universal TP (Rúbrica FWD Academy)
- **Dock Flotante Vertical Apilado:**
  - Bolita superior: **Accesibilidad Universal TP (♿, 46px)**.
  - Bolita inferior: **Asistente Técnico Vértice (💬, 54px)** con pulso de lava y baliza en línea verde activa.
- **Panel TP Integrado (`#a11y-drawer`):**
  - Escala tipográfica relativa (`--a11y-font-scale` de 90% a 130%) en unidades `rem`.
  - Modo Alto Contraste nativo (`html.a11y-contrast` con amarillo `#FFE600` sobre negro puro).
  - Modo Dislexia (`html.a11y-dyslexia` con espaciado expandido de glifos).
  - Pausa total de movimiento (`html.a11y-reduce-motion` conforme a `prefers-reduced-motion`).
  - Resaltado de enlaces y foco accesible (`html.a11y-highlights`).

### 4. Reglas de Negocio Verificadas
- **Cero precios en Home:** Toda llamada a cotización personalizada se rige estrictamente por `PENDING_QUOTE / SIN COBRO PREVIO` (docs/02 y AI_CONTEXT).
- **Asistente Técnico Local:** Base de conocimiento técnica instantánea sobre requisitos STL, polímeros de ingeniería, logística de envío a 7 provincias y tolerancias mecánicas.

**Resultado de la auditoría:** HF-01 **NO ESTÁ CONGELADO**. Se revirtió la decisión de congelarlo el 2026-09-26 porque el usuario aún desea iterar sobre él. Es el único mockup HTML que se trabajará.

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
- Navbar funcional conservado; la dirección visual vigente se deriva de HF-01.
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

### HF-01 — Home (Estado: 🟡 EN ITERACIÓN)

La implementación de `mockups/hf-01-home.html` sigue en desarrollo y refinamiento bajo las instrucciones directas del usuario. NO está congelado ni aprobado aún.

#### Cambios consolidados
- Navbar, Hero, pilares, workflow, CTA de cotización y footer forman parte del lenguaje visual de HF-01 que debe expandirse al resto del producto.
- Home no muestra precios.
- Las tarjetas del catálogo destacado usan imágenes reales y metadata técnica.
- Se eliminó completamente la malla SVG triangular, círculos y cotas fijas que fingían una anotación CAD.
- El Hero utiliza fotografías reales: soporte, engranaje, dragón y drone.
- El Leader Line Callout apunta a una característica técnica distinta para cada pieza y actualiza coordenadas/texto al cambiar de miniatura.
- La fotografía tiene fundido perimetral para integrarse con la superficie Obsidian.
- El Hero incorpora un escáner láser visual sutil y badge decorativo ESCANEANDO.
- El Hero incorpora Tilt/Parallax ligero mediante CSS/JavaScript; no utiliza WebGL/Three.js.
- La ficha técnica muestra referencia, tolerancia y datos de la pieza activa.
- Dark/Light y prefers-reduced-motion permanecen contemplados.

#### Verificación realizada en la sesión de Antigravity
1. Carga inicial con images/hero-soporte.jpg y llamada técnica al detalle estructural.
2. Miniatura 02: cambio a engranaje y actualización de la llamada.
3. Miniatura 03: cambio a dragón y actualización de la llamada.
4. Miniatura 04: cambio a drone y actualización de la llamada.
5. Ausencia del overlay triangular/falso CAD en las cuatro piezas.

> La verificación de navegador es evidencia reportada por la sesión de Antigravity. La revisión actual del repositorio confirma que hf-01-home.html contiene las cuatro fuentes de imagen, el estado dinámico del callout y el efecto Tilt/Parallax.

### Decisión de arquitectura del Hero
El Hero queda aprobado como fotografía de alta fidelidad + interactividad ligera. El visor WebGL/Three.js real se reserva para HF-03 Detalle de Producto y HF-05 Solicitud con Archivo 3D.

**Estado: 🟡 EN ITERACIÓN. Se seguirán haciendo ajustes sobre el HTML hasta que el usuario dé la aprobación final.**

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

Continuar iterando **exclusivamente** el HTML de `HF-01` basándose en el feedback directo del usuario.
*(Nota: Ya no se generarán mockups HTML para HF-02, HF-05 ni el resto de pantallas; una vez que HF-01 sea aprobado, el proyecto pasará directamente a su implementación total en React).*

---

## HF-01 — Candidato definitivo y continuidad de trabajo (2026-09-28)

**Estado:** 🟡 EN ITERACIÓN. Es un candidato de aprobación visual; todavía no está congelado.

### Archivos de comparación

| Rol | Archivo | Regla |
|---|---|---|
| Candidato actual | `mockups/hf-01-home-definitivo.html` | Único archivo HTML que se debe editar en la siguiente ronda. |
| Base local | `mockups/hf-01-home.html` | Preservar; usar como referencia visual y de contenido local. |
| Base remota | `mockups/hf-01-home-remoto-pruebas.html` | Preservar; usar como referencia de iteración y menú plegable. |

### Integración realizada

- Del local se conservaron hero, catálogo, workbench, copy principal, footer e iconos flotantes `✦` y `♿`.
- Del remoto se aprovechó la lógica visual del menú plegable, la jerarquía compacta y la idea de acciones de cuenta/búsqueda, adaptadas al sistema Vértice.
- El navbar definitivo se centró mediante una retícula explícita en desktop y se repliega a menú compacto en anchos menores a `1120px`.
- Los paneles de chatbot y accesibilidad conservan los iconos del local y ahora usan drawers compactos con regla lava, etiquetas `01 / ASISTENCIA` y `02 / CONTROL`, controles de mínimo `44px`, estados ARIA, foco y cierre por `Escape`.
- Se retiraron los claims no respaldados por el proyecto: “cámaras industriales”, “grado industrial”, “22µm SLA” y “18 piezas”.

### Revisión realizada

- La URL local del candidato respondió con HTTP `200`.
- Se comprobó desktop y responsive; el navbar quedó centrado en desktop y se confirmó el repliegue en viewport reducido.
- Se probaron menú de cuenta, búsqueda, chatbot y accesibilidad; los paneles abrieron/cerraron y actualizaron sus estados accesibles.
- No se observaron errores de consola en la revisión de navegador.

### Pendiente explícito

El usuario debe decidir la siguiente ronda de botones y acciones del navbar, además de cualquier ajuste de proporción, copy o iconografía que detecte al comparar capturas. No implementar React todavía. La siguiente IA debe leer este registro y `AI_CONTEXT.md`, abrir `hf-01-home-definitivo.html`, y editar solo ese archivo después del feedback del usuario.

## Punto de pausa — auditoría funcional de navegación pendiente (2026-09-28)

Esta auditoría fue iniciada pero pausada por el usuario antes de modificar el HTML. El diseño visual no debe reiniciarse; el siguiente bloque debe concentrarse en comportamiento y navegación del candidato definitivo.

### Hallazgos iniciales para verificar

- Las rutas absolutas del mockup (`/solicitud`, `/login`, `/registro`, `/cuenta`, `/carrito`, `/catalogo/...` y `/`) pueden abandonar el HTML servido localmente y producir destinos inexistentes. No decidir una ruta final sin distinguir entre simulación del mockup y rutas que React implementará después.
- El botón de enviar del chatbot (`#chat-submit`) no tiene todavía una acción demo asociada.
- Búsqueda, cuenta, menú móvil y drawers de asistencia deben probarse juntos para garantizar que no queden dos capas abiertas ni estados ARIA contradictorios.
- Falta verificar de forma sistemática el recorrido de teclado: foco inicial, `Tab`, `Shift+Tab`, `Enter`, `Escape`, flechas del visor y cierre con retorno de foco.
- La traducción ES/EN debe revisarse con todos los nodos existentes; cualquier selector que no corresponda a un elemento real debe limpiarse.
- Se deben probar resultados sin coincidencias, enlaces de búsqueda, fallbacks de imagen y navegación interna con consola limpia.

### Regla de continuidad

No cambiar estilos ni crear otro mockup durante esta auditoría. Primero levantar la matriz elemento → destino → comportamiento esperado; después corregir únicamente `mockups/hf-01-home-definitivo.html`, verificar en navegador y documentar los resultados en esta misma sección.

### Aclaración visual registrada

La captura del navegador interno con el menú plegable y la captura del navegador externo con navbar completo pertenecen al mismo archivo definitivo. La primera usa un viewport responsive menor a `820px`; la segunda usa desktop alrededor de `1365px`. Entre `821px` y `1120px` los enlaces centrales siguen visibles en formato compacto. La ausencia del hamburguesa en desktop y su presencia en el viewport estrecho son comportamiento intencional del CSS, no una diferencia entre local y remoto ni una pérdida del trabajo al hacer push. Comparar ambos mockups con el mismo ancho antes de proponer cambios.

### Decisión posterior: menú único de tres barras — 2026-09-28

El usuario indicó que no desea el botón separado de persona. En el candidato definitivo se eliminó `#account-toggle` y se integró su contenido en `#mobile-menu`. Las tres barras (`#menu-toggle`) son ahora el único acceso al panel plegable tanto en desktop como en responsive; dentro aparecen la navegación pública y el bloque `MI ESPACIO` con iniciar sesión, crear cuenta, cuenta, carrito y nueva cotización. Esta decisión queda como referencia obligatoria para la futura implementación React.

### Refinamiento visual de paneles — 2026-09-28

El primer diseño de los paneles se consideró demasiado genérico y denso. La iteración actual mantiene la lógica y cambia la presentación: el menú de barras se organiza por secciones numeradas y conserva el navbar central cuando el ancho todavía permite mostrarlo; el chatbot usa la identidad `Mesa técnica Vértice`, una frase de entrada y tres consultas rápidas como filas de orientación; accesibilidad usa `Ajustes de lectura`, una introducción breve y controles numerados más sobrios. La dirección se verificó en navegador con apertura, cierre por `Escape`, estados ARIA y consola sin errores. La aprobación visual sigue pendiente del usuario.

### Rediseño visual pass 03 — 2026-09-28

El feedback confirmó que el pass anterior había sido superficial fuera del navbar. Se rehízo la composición de los tres paneles en `mockups/hf-01-home-definitivo.html`: el menú ahora funciona visualmente como drawer de operaciones con cabecera, grupos separados y estados hover; la asistencia técnica usa una entrada editorial, filas de intención e input independiente; accesibilidad usa una introducción con acento lava y un bloque de controles agrupados. Se conservaron los disparadores, iconos, funciones, cierre por `Escape` y estados ARIA. La aprobación visual sigue pendiente.

### Rediseño visual pass 04 — 2026-09-28

Se detectó y corrigió un problema de cascada: el CSS del pass 04 estaba antes del pass 03 y por eso el navegador seguía mostrando la versión anterior. La capa final activa deja el menú como un drawer compacto con cabecera `VÉRTICE / MENÚ PRINCIPAL`, navegación numerada, hover lateral y bloque de cuenta distribuido; la asistencia como una herramienta técnica sobria con frase de entrada, consultas rápidas en filas y campo separado; y accesibilidad como un panel de lectura/control con filas numeradas y acciones compactas. Se mantienen los iconos `✦` y `♿`, los disparadores únicos, los estados ARIA y el cierre por teclado. La marca del navbar usa `3D / CR` para comunicar servicio 3D y Costa Rica en lugar de `CR / AM`. Se verificó apertura y cierre de los tres paneles en navegador limpio; HF-01 continúa en iteración y requiere aprobación visual del usuario.

### Rediseño visual pass 05–06 — 2026-09-28

El feedback del usuario confirmó que los paneles todavía necesitaban una reconstrucción de CSS. Se rehízo la capa final del candidato definitivo: menú de barras como drawer editorial con navegación numerada, cuenta primaria destacada y acciones secundarias; chatbot como flujo visual de orientación, consultas rápidas y pregunta; accesibilidad como panel de lectura con introducción acentuada y controles grandes. El pass 06 corrigió el posicionamiento heredado de `.floating-panel`: antes se calculaba respecto al botón y podía salir por arriba del viewport; ahora chatbot y accesibilidad se anclan al viewport, tienen altura máxima responsiva y scroll interno únicamente si el tamaño disponible lo requiere. Se conservaron la lógica existente, `✦`, `♿`, estados ARIA, foco y `Escape`; no se tocó React.

La revisión tomó criterios de [Emil Kowalski](https://github.com/emilkowalski/skills), [Radix Primitives](https://www.radix-ui.com/primitives), [Motion Primitives](https://motion-primitives.com/docs), [Impeccable](https://github.com/pbakaus/impeccable), [Godly](https://godly.design/) y [React Bits](https://reactbits.dev/): jerarquía clara, superficies no genéricas, objetivos táctiles amplios, movimiento corto y estados de foco visibles. Son referencias de criterio, no código copiado. HF-01 continúa **EN ITERACIÓN** hasta aprobación visual del usuario.

### Rediseño de menú y herramientas — 2026-09-28

Tras el feedback de que los estilos previos no habían cambiado lo suficiente, se reestructuró la composición en `mockups/hf-01-home-definitivo.html`: drawer de navegación/cuenta a dos columnas en escritorio y una columna en móvil; se quitó el acceso redundante a iniciar sesión; las tres líneas del menú quedaron centradas; el chatbot organiza las consultas rápidas en tarjetas y separa el campo de pregunta; accesibilidad adopta una superficie clara y controles agrupados. También se retiró la nota técnica del chatbot que repetía información de implementación. Tras el último CSS, se verificó visualmente el botón de tres líneas cerrado; los paneles abiertos y la versión móvil aún requieren una pasada visual. La investigación y enlaces de referencia quedaron en doc 04 y AI_CONTEXT. HF-01 sigue **EN ITERACIÓN** y necesita revisión/aprobación del usuario.

### Corrección del usuario: retirar el menú desplegable — 2026-09-28

El usuario rechazó el panel/lista que abre el botón de tres barras y pidió quitar ese menú, pero conservar el botón. No continuar ajustando ni volver a mostrar el panel rechazado como si fuera una propuesta aceptada. Al retomar, confirmar qué comportamiento debe tener el botón conservado; no inventar destinos ni desplegables alternativos. Chatbot y accesibilidad siguen sin aprobación y requieren rediseño/validación. Para reanudar, consultar la biblioteca ampliada y el protocolo de referencias de `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md`; revisar los cambios locales pendientes y comprobar el resultado en el navegador del usuario.

### Iteración del chatbot — 2026-09-29

En `mockups/hf-01-home-definitivo.html` se reemplazó la tarjeta apretada de asistencia por una ventana de chat más amplia: esquinas achaflanadas asimétricas inspiradas en la referencia que eligió el usuario, saludo en burbuja, tres temas para iniciar y compositor inferior. Se retiraron claims y temas técnicos no definidos (“IA técnica”, “en línea”, análisis de STL/tolerancias). Tras feedback del usuario, se integró el isotipo auténtico desde `mockups/favicon.png` en cabecera y avatar, en vez de una letra V genérica, y la etiqueta se cambió a `VÉRTICE CR / ASISTENCIA`. Escritorio: ventana ubicada a la izquierda de los botones flotantes. Móvil: ventana encima de ellos con separación visual. Prueba visual realizada a 898×572 y 390×844; en ambas se distinguen los controles sin solapamiento tras ajustar la posición móvil. La apertura por teclado y el cierre con Escape cambiaron `aria-expanded`; no se vieron errores de consola. Falta revisión del usuario y, si lo solicita, corregir proporciones/copy; no implica aprobación de HF-01 ni de accesibilidad.

### Iteración visual del chatbot: identidad workbench — 2026-09-29

En respuesta a que el panel aún se sentía genérico, se rehízo su tratamiento visual con la capa CSS `chat-identity-pass-02` del mismo HTML: vidrio ahumado casi opaco (se redujo la transparencia al comprobar legibilidad), retícula alineada al hero, silueta facetada con borde cobre, marca oficial en marco facetado, bienvenida en burbuja con borde asimétrico, línea guía y consultas como filas numeradas en vez de tarjetas, y compositor fijo con cantos a juego. Se incorporó un barrido muy tenue de cabecera y una entrada breve; ambas respetan `prefers-reduced-motion`. No se modificaron navbar, botones flotantes, panel de accesibilidad ni lógica/funcionalidad del chat.

**Verificación:** en navegador local `http://127.0.0.1:5173/mockups/hf-01-home-definitivo.html`, vista 900×570, se confirmó visualmente el panel abierto junto a los controles, borde/retícula, marca, sugerencias y compositor. La prueba de teclado abrió el panel y `Escape` lo cerró devolviendo `aria-expanded=false` y `aria-hidden=true`; la consola no reportó errores. Falta revisar con el ancho de escritorio del navegador externo del usuario y revisar móvil en navegador; diseño aún **NO APROBADO**. Las referencias y criterios aplicados están anotados en doc 04.

### Remates del chatbot, tema e iconografía — 2026-09-29

El usuario aprobó la dirección visual actual del chatbot y solicitó tres remates: mantener el panel y completar la línea en todos los cantos achaflanados; añadir el icono de luna al control de tema junto al sol existente; y sustituir flechas diagonales ornamentales repetidas por una marca de registro/caligrafía técnica coherente con el workbench. Implementado en `mockups/hf-01-home-definitivo.html`: dos contornos poligonales compensados para cerrar visualmente las aristas; iconos de sol/luna según el tema al que cambia y etiqueta accesible sincronizada; marca circular cobre en navegación, opciones y enlaces de ficha, y retículo facetado en el proceso. Se mantienen intactas las flechas con significado direccional (scroll, envío y etapas). **Verificación visual:** navegador local, 900×570, chatbot abierto: ventana junto a los controles, retícula y cantos trazados; la línea del panel no presenta interrupciones visibles y las sugerencias ya no muestran flechas diagonales. Se alternó entre tema claro (luna visible) y oscuro (sol visible); también se ajustó y comprobó el contraste del texto del chatbot en tema claro. La consola no mostró errores. Vista móvil sigue pendiente. El usuario aprobó el chatbot como concepto con estos remates solicitados, pero HF-01 no está congelado; accesibilidad aún no aprobada y React continúa bloqueado.

El usuario aclaró después que el círculo marcador en las opciones del chatbot no le gusta; mantener las marcas circulares de la página principal y cambiar únicamente las opciones del chat. Una primera escuadra abierta no resolvió el pedido y aún se percibía un motivo tipo flecha por reglas CSS antiguas que prevalecían en la cascada. La iteración de trazo horizontal fue rechazada expresamente: el usuario pidió conservar una flecha, pero respaldada por referencias reales, y señaló que el marco aún tenía recortes de esquina.

### Remate visual — flecha referenciada y marco continuo — 2026-09-29

Se reemplazó el guion decorativo de las filas de consulta por un SVG lineal de flecha diagonal hacia arriba-derecha, centrado en la columna de acción, tenue en reposo y con movimiento/contraste sutil en hover y foco. La decisión toma como referencia el uso de `IconArrowUpRight` como affordance de navegación en [shadcn/ui `directory-list.tsx`](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/components/directory-list.tsx); se conserva visibilidad en reposo para que no dependa del hover. Las marcas circulares de la página principal no se modificaron.

El marco exterior de `#chat-panel` deja de usar `clip-path` y pseudo-elementos poligonales que interrumpían visualmente el borde. Se aplica contorno continuo con radio asimétrico suave; se mantienen retícula sutil y lenguaje angular en detalles interiores. La lógica del chatbot, su contenido, paleta y ubicación no cambian. Pendiente comprobar visualmente en navegador el panel abierto en escritorio y móvil; HF-01 permanece en iteración, no congelado.

### Animaciones y cierre funcional de accesibilidad — 2026-09-29

En `mockups/hf-01-home-definitivo.html` se completó otra pasada del panel de accesibilidad, manteniendo colores e identidad de HF-01: se eliminó la etiqueta tipo píldora heredada, se hizo visible la introducción y se organizaron los controles de tamaño, contraste y movimiento con jerarquía y objetivos de 44 px. Se añadieron entrada breve del panel y aparición escalonada de sus bloques; las opciones del chatbot también aparecen en secuencia. Movimiento reducido manual/sistema elimina transformaciones de entrada, conservando estados distinguibles. Las decisiones siguen la referencia de [Emil Kowalski / skills](https://github.com/emilkowalski/skills/blob/d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128/skills/review-animations/SKILL.md), [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using_for_accessibility) y [W3C APG Switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/).

Se terminaron los estados accesibles de los ajustes: switches con `aria-checked` y etiqueta estable, descripciones asociadas, escala con un solo `aria-pressed`, preferencias guardadas/restablecidas y nombres del control sincronizados con ES/EN. Al ser un diálogo no modal, se quitó el ciclo forzado de foco: `Tab` puede salir siguiendo el orden del documento; `Escape` y el botón de cierre restauran el foco al disparador. Revisión de navegador a 900×570: entrada animada visible, descripción presente, botones/switch/cierre/restablecer con área mínima requerida, contraste comprobado en tema claro, escala A+/A++ comprobada, cambios de idioma comprobados, movimiento reducido comprobado (`animation-name:none`), reset vuelve a valores iniciales y Escape sincroniza `aria-hidden`/`aria-expanded` y foco. No se observaron fallos en estas interacciones. No se verificó a 390 px ni con tecnología asistiva real; por ello no se afirma certificación WCAG y el panel sigue sin aprobación visual final.

### Corrección del selector de tema — 2026-09-29

El usuario señaló correctamente que la captura seguía mostrando ambos iconos simultáneamente. La regla CSS anterior no garantizaba exclusividad frente a los estilos heredados. Se corrigió reforzando la visibilidad con `!important` y sincronizando directamente la visibilidad de los dos SVG con el estado actual. Revisión posterior en el navegador: en tema oscuro queda visible únicamente el sol (cambio a claro); en tema claro, únicamente la luna (cambio a oscuro). Se dejó el navegador en tema oscuro para revisión. La prueba móvil continúa pendiente.

### Entrada unificada del chatbot y accesibilidad — 2026-09-29

Se igualó la aparición del panel de chat a la de accesibilidad reutilizando `a11y-panel-arrive` (300 ms, misma curva y desplazamiento). Se conserva el stagger de las opciones de conversación. La regla de movimiento reducido ahora desactiva también la entrada del panel de chat, tanto por preferencia del sistema como por el ajuste manual. Pendiente confirmar visualmente ambos paneles en desktop/móvil; HF-01 sigue en iteración.

### Anotaciones de accesibilidad y ruido de numeración — 2026-09-29

En respuesta a las anotaciones se corrigió un fallo concreto: una regla heredada ocultaba el indicador `<i>` del switch y los manejadores alternaban `aria-pressed` pese a usar `role="switch"`. Ahora el indicador vuelve a mostrarse y el estado único es `aria-checked`, con contraste/posición distintos al activarse. Verificado en navegador a 739×572: ambos switches alternan, el thumb aparece y se desplaza al activar y “Restablecer preferencias” sincroniza ambos a apagado. Se quitaron índices editoriales redundantes (secciones, etapas, chat y accesos); se mantienen referencias PRT, medidas y cantidades que comunican datos reales. El panel aclara que idioma/tamaño son solo demo de esta página: en React deberán funcionar globalmente por rutas y contenido dinámico, requisito pendiente de implementación y pruebas. Sigue pendiente validar viewport móvil estrecho y aprobación visual; HF-01 continúa sin congelar.

### Auditoría visual anotada — 2026-09-29 (abierta)

Se recibieron seis anotaciones nuevas: sustituir los puntos de “Tengo un archivo” y “Cotizar STL” por flechas; corregir el aspecto de los switches de contraste/movimiento; centrar los marcadores de la lista del método; rehacer la búsqueda. En el HTML se añadieron overrides para restituir flechas, centrar rombos y retirar el pseudo-elemento duplicado de los switches. La búsqueda se rediseñó como panel fijo centrado, opaco, con cabecera/campo/resultados más amplios y adaptación a móvil, manteniendo los tres resultados que ya estaban.

**Capturas verificadas hasta ahora:** se revisó el hero y la captura confirmó la flecha real en “Cotizar STL”; también se inspeccionaron vistas parciales del catálogo y método. Captura previa del panel de accesibilidad confirmó el problema de doble perilla. Tras el override nuevo, el navegador controlado no permitió abrir de forma fiable la búsqueda ni accesibilidad, así que aún no hay prueba visual posterior de búsqueda/switches; tampoco se ha confirmado en captura la flecha del segundo botón o el centrado de los rombos. Esta auditoría no es completa ni autoriza congelar HF-01.

**Pendiente bloqueante antes de declarar “mockup definitivo”:** recapturar búsqueda abierta, filtrado con y sin resultados y Escape; switches encendidos/apagados/reset; los dos CTA y rombos en método; viewport 739 px y móvil; una pasada visual de página completa con header/footer. La búsqueda y controles deben quedar funcionales y legibles, no basta con que el CSS esté escrito. React continúa bloqueado.

### Anotaciones de búsqueda, flecha de ficha y menú plegable — 2026-09-29

El usuario rechazó la búsqueda centrada por genérica y obstructiva, pidió “Ver ficha” con flecha y aclaró que sí quiere conservar la antigua lista plegable del botón hamburguesa, no el drawer a pantalla completa. En `mockups/hf-01-home-definitivo.html` se cambió la búsqueda a un popover anclado al header (máx. 388 px, altura limitada, marca/favicon visible, metadatos alineados en una sola fila); “Ver ficha” recupera `↗`; el menú vuelve a ser una lista compacta desplegable, conserva cuenta/navegación y oculta el scrim de pantalla completa. La navegación, paleta y composición global quedan intactas.

Referencias de búsqueda contrastadas: [Algolia Autocomplete](https://www.algolia.com/blog/ux/replicating-the-algolia-documentation-search-with-autocomplete) para resultados sugeridos/teclado y [shadcn/ui command menu](https://github.com/shadcn-ui/ui/blob/main/apps/v4/components/command-menu.tsx) para separación de campo y lista; adaptadas sin copiar ni añadir dependencias (criterios ampliados en doc 04). **Estado de verificación:** CSS y estructura editados. La herramienta de navegador no logró ejecutar los clics de los disparadores en esta pasada, así que no se obtuvo una captura del buscador abierto ni del menú abierto que confirme el resultado; no declarar esos estados visual/funcionalmente verificados ni aprobación del usuario. Próximo paso: capturas reales en navegador de ambos paneles, “Ver ficha” en tarjeta y validación a 390 px; revisar `Escape`, teclado/foco y destinos sin navegación externa accidental. HF-01 sigue EN ITERACIÓN; React bloqueado.

**Verificación posterior por teclado/captura — 2026-09-29:** se abrió el buscador con Enter y se capturó a 948×572: popover compacto alineado al área de acciones del header, isotipo visible y referencias/materiales legibles en una línea; no cubre el hero completo. Se abrió el menú con Enter y se vio el desplegable de lista vertical junto al header, sin scrim ni drawer de pantalla completa, con navegación y cuenta. La primera captura del catálogo detectó que “Ver ficha” se duplicaba al mostrar tanto el texto real como el pseudo-elemento; se ajustó para renderizar una sola etiqueta y `↗`. La captura posterior confirma una sola “Ver ficha ↗” en las tarjetas. Estas vistas se comprobaron en desktop; viewport móvil, búsqueda sin resultados y lector de pantalla siguen pendientes. El menú responde al teclado y el estado ARIA cambia a expandido; completar Escape/retorno de foco y revisar destinos antes de aprobar HF-01.

**Verificación adicional — 2026-09-29:** capturas desktop del buscador abierto con consulta coincidente (`nylon`) y sin coincidencias. Se detectó que `display:grid !important` mantenía visibles enlaces marcados `[hidden]`; se añadió una regla específica para respetar el estado oculto. `nylon` presenta únicamente el engranaje correspondiente; una consulta imposible oculta las filas y muestra “No encontramos piezas con ese término.”. El menú se abrió como lista junto al header, sin scrim; `Escape` lo cierra, restablece `aria-expanded=false` y devuelve el foco al disparador. El buscador también cierra con Escape y deja el foco en el botón. No están cubiertos aún vista móvil, lector de pantalla ni revisión completa de anotaciones. HF-01 permanece EN ITERACIÓN.

**Banco de referencias para el cierre — 2026-09-29:** doc 04 amplió y clasificó las fuentes de sitios completos, flujos de producto, componentes/movimiento, primitivas accesibles y skills para agentes frontend. La auditoría pendiente debe consultarlas por necesidad y comparar capturas/estados concretos; no copiar estéticas ni agregar dependencias por defecto. Esta investigación documental no equivale a una auditoría visual completa: siguen pendientes viewport móvil, recorrido extremo a extremo y revisión de todos los estados/capturas antes de recomendar congelar HF-01.

### Alineación de “Mi Espacio” entre anchos — 2026-09-29

La diferencia que reportó el usuario era por breakpoint, no por archivos: la ventana local medía 937 px y el código solo mostraba el popover “Mi Espacio” por encima de 1120 px. En `821–1120px` los enlaces principales ya están visibles pero el botón abría una segunda lista de navegación, mientras que en Brave desktop aparecía el popover compacto de la captura elegida. Se cambió la condición de interacción a `>820px`: en tablet/desktop el botón abre “Mi Espacio”; bajo `821px` conserva la lista de navegación plegable. Pendiente capturar tras el cambio a 937 px y comprobar Escape/foco y móvil; no declarar visualmente verificado hasta obtener esas capturas.

**Verificación:** en navegador local a 937×572, el botón abrió `#account-menu-panel` (296×274 px), con “Mi Espacio”, estado de cliente y los cuatro accesos de la referencia; no abrió la lista de navegación. Captura inspeccionada tras completar la animación. `Escape` cerró el panel, dejó `aria-expanded=false`/`aria-hidden=true` y devolvió foco al botón. La rama móvil (`<=820px`) aún requiere captura; HF-01 sigue en iteración.

---

## Auditoría visual de fidelidad HF-01 → React — 2026-09-29

Esta pasada toma `hf-01-home-definitivo.html` como **mockup visual**, no como implementación productiva. El criterio principal es: ¿puede este archivo convertirse en la referencia más fiel del futuro React sin que la identidad o la calidad percibida se degraden?

### Resuelto / fuerte
- Identidad visual Vértice reconocible: Obsidian Precision Forge + Lava Orgánica.
- Hero con producto dominante y lenguaje de workbench.
- Catálogo con estructura comercial y estética técnica.
- Chatbot con tratamiento visual propio, no widget genérico.
- Panel de accesibilidad integrado al mismo lenguaje visual.
- Search compacto y estados de vacío ya considerados.
- Movimiento reducido y estados interactivos ya contemplados en el mockup.

### Hallazgos visuales de prioridad
1. El hero tiene suficientes elementos distintivos, pero debe verificarse que el producto siga siendo el foco cuando coinciden scan, estado, líder, meta, riel y parallax.
2. El catálogo necesita sentirse más tienda y menos inventario técnico: la información técnica debe apoyar el producto, no competir con él.
3. `PRT-006` con `placeholder-product.jpg` / `FALLBACK DEMO` rompe la ilusión de catálogo final y debe resolverse como pieza real o estado visual intencional.
4. La geometría de radios/cantos necesita una revisión de consistencia: mantener las asimetrías que forman firma de marca y recortar las que solo sobrevivieron de iteraciones anteriores.
5. El motion debe tener jerarquía: una o dos experiencias memorables + feedback de interacción, no animación distribuida por todo el documento.
6. Los micro-labels técnicos deben sobrevivir solo cuando aporten lectura: no eliminar el lenguaje técnico, depurarlo.
7. La experiencia debe comunicar “tienda especializada” dentro del primer scroll y no parecer principalmente una demo de dirección de arte.
8. La versión mobile debe reinterpretar la composición y conservar la firma, no simplemente apilar desktop.

### Referencias aplicadas
- Impeccable: anti-slop, jerarquía, restraint y craft. https://github.com/pbakaus/impeccable
- Anthropic frontend-design: identidad específica al dominio, movimiento con propósito y estructura que comunica. https://github.com/anthropics/skills/tree/main/skills/frontend-design
- Taste Skill: extraer decisiones concretas de diseño en vez de describir una página como “moderna”. https://github.com/senlindesign/taste-skill
- UI UX Pro Max: sistemas de layout, responsive y composición. https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Codrops: interacciones de producto, grids, motion y 3D como extensión del contenido. citeturn360901search0turn360901search1turn360901search2
- Galerías del banco de doc 04: Godly, Awwwards, Siteinspire, Land-book, Commerce Cream, Mobbin, Refero, Pageflows y Codrops.

### Próximo bloque recomendado

**Auditoría de dirección comercial + visual:** recorrer Hero → catálogo → método → precisión → cotización preguntando en cada sección: “¿esto hace que quiera seguir explorando/comprar?” y “¿qué elemento sobra porque está compitiendo con el producto?”. Después revisar 375/768/1280 y Dark/Light para detectar rupturas visuales.

**Estado: HF-01 EN ITERACIÓN / NO CONGELADO.**

---

## Auditoría visual con render real — 2026-09-29

**Alcance:** solo diseño visual del mockup `mockups/hf-01-home-definitivo.html`. No se evalúa código, rutas, enlaces ni accesibilidad técnica (el mockup no es producción).

**Evidencia:** capturas reales del archivo servido en local y renderizado con Chromium sin interfaz.
- Oscuro: 1280×800, 768×1024 y 375×812 (hero y página completa).
- Claro: 1280 y 375 (hero y catálogo).
- Paneles abiertos (chat, accesibilidad, buscador, menú) en 1280 y 375, tema oscuro.
- Es evidencia de una sesión de IA, **no aprobación del usuario**. Las capturas no están versionadas; para verificar un hallazgo, abrir el HTML en ese ancho.

### Lo que se ve bien (no tocar sin razón)
- Hero desktop: producto grande como protagonista, firma Obsidian + Lava reconocible.
- Catálogo, método, precisión y CTA final: legibles y consistentes en desktop.
- Tema claro coherente en desktop y móvil.
- Buscador y accesibilidad: misma familia visual; switches con una sola perilla.

### Decisiones del usuario sobre los hallazgos — 2026-09-29

**Se corrigen en el mockup:** V-01, V-04, V-05, V-06, V-07, V-08, V-09.
**No se tocan en el mockup, pasan a requisito de React:** V-02 y V-03.
**Regla general:** cambios mínimos; el desktop que hoy se ve bien no debe cambiar salvo lo que pida cada punto. No mover ni rediseñar lo que no aparece en esta lista.

| ID | Dónde | Qué se ve (defecto) | Vista | Decisión |
|---|---|---|---|---|
| V-04 | Fotos del hero y del catálogo | Se percibe el borde rectangular de la foto sobre el fondo; el fundido perimetral que describe la documentación no se nota. Las fotos parecen pegadas. | 1280 / 375 | ✅ **Implementado.** (Pendiente revisión y aprobación del usuario). Fundir el borde de la foto con la superficie que la contiene (máscara o degradado hacia el color de fondo), sin cambiar el encuadre ni el recorte de las piezas. Mostrar antes/después en 1280 y 375 para que el usuario apruebe antes de seguir. |
| V-01 | Botones flotantes ✦ y ♿ (`.floating-tools`, fijos abajo a la derecha) | Tapan contenido: en 1280 la flecha ↓ del riel, en 768 las miniaturas 2 y 3, en 375 el texto «Revisión por etapas» y la etiqueta «EN STOCK» de la primera tarjeta. | 1280 / 768 / 375 | ✅ **Implementado.** (Pendiente revisión y aprobación del usuario). Los botones se ocultan parcialmente hacia el borde derecho mientras hay scroll y vuelven al detenerse. Conservar iconos ✦ y ♿, tamaño, esquina y la posición donde abren chat y accesibilidad. **No reubicar botones ni paneles de forma que la ventana abra en el lado opuesto o separada de su botón** (el usuario lo considera un error visual). No ocultar mientras haya un panel abierto ni con el botón enfocado. Con movimiento reducido (sistema o ajuste manual), sin animación de ocultado. **Comprobar también en reposo** (arriba, sin scroll): si en 1280×800 o 768 el botón sigue tapando la flecha ↓ o las miniaturas, ajustar mínimamente la posición del riel. |
| V-05 | Menú «Mi Espacio» | Panel translúcido: texto del hero («REVISIÓN ACTIVA») se transparenta detrás de las filas «Iniciar sesión» y «Crear cuenta». | 1280 | ✅ **Implementado.** (Pendiente revisión y aprobación del usuario). Fondo casi opaco (95 % o más) con desenfoque de fondo fuerte, de modo que el hero se intuya como color pero no se lea texto detrás. Mantener borde, regla lava y colores del panel. |
| V-06 | Cabecera del buscador | Dos etiquetas seguidas y redundantes («VÉRTICE / CATÁLOGO» y «CATÁLOGO / BÚSQUEDA»). Los metadatos de cada resultado (material · PRT) son diminutos y casi ilegibles. | 1280 / 375 | ✅ **Implementado.** (Pendiente revisión y aprobación del usuario). Dejar una sola etiqueta (conservar isotipo y el título «Buscar una pieza»). Subir el tamaño de los metadatos hasta que se lean sin zoom (sugerencia: no bajar de 11 px). |
| V-07 | Chat | Las flechas ↗ de las tres opciones quedan pegadas abajo a la derecha de cada fila. Hay un hueco grande entre la última opción y la caja de escritura. | 1280 / 375 | ✅ **Implementado.** (Pendiente revisión y aprobación del usuario). Centrar verticalmente la flecha en cada fila y acercar la caja de escritura a las opciones. No cambiar marco, paleta, marca ni copy del chat (ya aprobados como concepto). |
| V-08 | Menú en móvil | Título «¿Qué querésexplorar?» sin espacio entre líneas (en el HTML lleva un `<br />` que en la vista móvil no separa). Botón de cerrar con un círculo dentro de un cuadrado. | 375 | ✅ **Implementado.** (Pendiente revisión y aprobación del usuario). Devolver el espacio entre «querés» y «explorar» y dejar el botón de cerrar con una sola forma. |
| V-09 | Sección Precisión y footer | Etiquetas en inglés (`A / DIMENSIONAL`, `B / MATERIALS`, `C / DELIVERY`) en una página en español. En el footer, «Contacto técnico por correo» tiene tamaño y estilo distintos al resto de enlaces. | 1280 | ✅ **Implementado.** (Pendiente revisión y aprobación del usuario). Traducir el texto visible de las tres etiquetas y dar al enlace del footer el mismo estilo que los demás. **No construir idioma ni tamaño de texto globales en el mockup:** esos ajustes son demo de esta página y su requisito para React ya está documentado en `docs/04` («Ajustes globales en React y alcance del mockup»). |
| V-02 | Hero en móvil | En la primera pantalla solo hay titular, texto, botones y estadísticas; el producto queda fuera y el workbench empieza al borde inferior. | 375 (y parcialmente 768) | **No se toca en el mockup. Requisito de React:** en 375 el producto debe verse en la primera pantalla; reinterpretar la composición móvil, no apilar la de desktop. Ver `docs/03` (Responsive). |
| V-03 | Catálogo, tarjeta PRT-006 | Wireframe naranja, etiqueta `FALLBACK DEMO` y texto «Fallback oficial en wireframe…». | todas | **No se toca en el mockup.** Las seis tarjetas del mockup son ejemplos ilustrativos. **Requisito de React:** el catálogo mostrará productos reales con datos reales; no se replica el placeholder. Esta observación reemplaza la de la auditoría anterior que la trataba como bug bloqueante. |

### No verificado en esta pasada
- Movimiento: scan, parallax, entradas y hover (las capturas son estáticas).
- Paneles abiertos en 768 y en tema claro.
- Cambio a las piezas 2, 3 y 4 del hero.
- Dispositivo móvil físico, anchos intermedios (por ejemplo 739 o 937) y lector de pantalla.
- Posible anomalía sin confirmar: con el menú abierto en 1280, la 4.ª miniatura del riel se vio vacía; no se reprodujo en las demás capturas.

### Orden de trabajo para la siguiente IA
1. Leer `AGENTS.md`, `AI_CONTEXT.md` y esta sección. Editar **solo** `mockups/hf-01-home-definitivo.html`.
2. Capturar el «antes» en 1280×800, 768×1024 y 375×812, oscuro y claro.
3. **V-04 primero.** Mostrar antes/después al usuario y esperar su aprobación antes de continuar.
4. Luego V-01, V-05, V-06, V-07, V-08 y V-09, un cambio por defecto.
5. Recapturar los mismos anchos y temas, y comprobar que el desktop no cambió salvo lo pedido.
6. Actualizar esta sección (estado real de cada ID con la evidencia) y `AI_CONTEXT.md`. No declarar «verificado» ni «aprobado» sin capturas y sin aprobación explícita del usuario.

---

## CONGELAMIENTO OFICIAL HF-01 (2026-09-30)
Tras la implementación de las correcciones `V-01` a `V-09`, unificación visual del sistema de botones (círculos y píldoras) y reestructuración del footer, **el usuario ha dado su aprobación final**. 
El mockup `mockups/hf-01-home-definitivo.html` queda oficialmente **CONGELADO**. 
Toda futura iteración de interfaz, componentes, y flujos de usuario se trabajará exclusivamente en el entorno React (JSX), utilizando como referencia estricta el `manual_sistema_diseno_react.md` extraído del HTML.
El **Gate de React** está abierto.

### Criterio para congelar HF-01 (solo lo visual)
1. V-01 y V-04 a V-09 corregidos y recapturados en 1280, 768 y 375, oscuro y claro.
2. Ningún control flotante tapa contenido, ni en movimiento ni en reposo.
3. Los hallazgos de jerarquía comercial de la auditoría anterior (hero con demasiadas señales, catálogo más tienda, disciplina de micro-etiquetas y movimiento) revisados con el usuario.
4. Aprobación explícita del usuario registrada aquí. Hasta entonces: **EN ITERACIÓN / NO CONGELADO**.

---

## Implementación React — Capa 2 Home (2026-09-30)

- Se preserva `mockups/hf-01-home-definitivo.html` como artefacto **CONGELADO**; no fue editado.
- El panel derecho del Hero fue trasladado a `src/pages/Home.jsx` con la estructura aprobada: fotografía principal, `.scan-line`, estado, anotación técnica + leader line SVG, telemetría y `.thumb-rail`.
- Las cuatro piezas del visor usan los assets aprobados de HF-01 publicados en `public/images/`.
- El movimiento de puntero replica el tilt/parallax del mockup y se desactiva con `prefers-reduced-motion`.
- V-02 pasa a implementación React: en móvil el orden del Hero se reinterpreta para mostrar el workbench antes del bloque de texto secundario/acciones/señales, evitando que el producto quede completamente fuera del primer viewport.
- Las seis `ProductCard` del destacado conservan material, referencia y estado visual de stock de HF-01, pero usan `/images/producto-temporal.png` porque el usuario aún no dispone de fotografías reales de catálogo. Este raster es un placeholder visual intencional y temporal; no debe confundirse con evidencia de producto real.
- `ProductCard` acepta ahora un estado `order`/label explícito para representar “BAJO PEDIDO” sin forzarlo a “SIN STOCK”.

**Verificación pendiente:** build/lint/tests y captura visual del React real en 1280/768/375, dark/light. No se declara cierre visual de Capa 2 hasta esa evidencia.


---

## Auditoría estática React — Capa 2 (2026-09-30, pasada 2)

Comparación realizada contra `mockups/hf-01-home-definitivo.html` congelado y la implementación actual de React/CSS.

### Hallazgos estructurales confirmados

- **R-H01 — doble offset superior del Home:** `#main-content` añadía 78 px y el Hero conservaba el padding superior del HF. Corregido: Home no suma ese offset adicional.
- **R-H02 — hamburger visualmente ausente en desktop:** el JSX existía, pero `.hamburger` estaba oculto y solo reaparecía bajo breakpoint. Corregido: vuelve a existir como acceso persistente al panel, con estado abierto/cerrado.
- **R-H03 — herramientas flotantes sin comportamiento visual HF:** `.floating-tools` no tenía posicionamiento fixed específico en React. Corregido: chat/accesibilidad vuelven al borde inferior derecho.
- **R-H04 — chatbot y accesibilidad renderizados como Panel genérico:** no reproducían posición, escala ni jerarquía del HF. Corregido mediante styling específico del shell manteniendo la primitiva accesible `Panel`.
- **R-H05 — search y Mi Espacio sin popover HF:** los paneles existían funcionalmente pero sin composición/posicionamiento equivalente. Corregido como paneles compactos anclados al header.
- **R-H06 — breakpoint de navbar contradictorio:** React ocultaba links desde 1120 px mientras HF final conserva navegación entre 821–1120 px. Corregido.
- **R-H07 — media queries móviles contradictorias:** coexistían dos bloques `max-width:560px` que redefinían altura del workbench, insets y spacing. Se consolidó una única interpretación móvil React.
- **R-H08 — alto contraste sin efecto visual:** el provider sí escribía `data-contrast`, pero no existían tokens CSS asociados. Corregido para dark/light y focus visible.
- **R-H09 — clases HF antiguas vs. clases `v-*`:** varios acabados del catálogo permanecían definidos sobre `.product-card/.product-image` mientras React renderiza `.v-product-card/.v-product-image`. Se alinearon cards, imágenes, hover y headings del catálogo.
- **R-H10 — pills no aplicadas:** Home pasaba una clase `btn-pill` heredada del mockup, pero el componente React usa la prop/clase `v-button--pill`. Corregido usando la API real de `Button`.
- **R-H11 — localización incompleta de ProductCard:** Home ya enviaba labels traducidos, pero `ProductCard` los ignoraba. Corregido para CTA, fallback de imagen y alt temporal.

### Estado de verificación

Estos son **hallazgos estáticos confirmados por código**. No se declara todavía verificación visual final porque no hubo navegador conectado/render real de esta pasada. La aprobación visual sigue correspondiendo al usuario después de recibir el build local.

### Próxima comprobación

Revisar render real de Home en 1280 / 768 / 375, dark/light y paneles abiertos. Si aparecen defectos visuales adicionales, corregir antes de declarar Capa 2 cerrada.


### Corrección adicional de Capa 2 — hamburger / lista plegable

- **R-H12 — hamburger mal maquetado:** `IconButton` envuelve el contenido en un `span`, pero el CSS anterior trataba las tres barras como hijos directos del botón. Resultado: el icono no reproducía el hamburger aprobado. Corregido usando el wrapper real y posiciones absolutas de las tres barras.
- **R-H13 — panel plegable demasiado genérico:** el menú React usaba el `Panel` genérico con cabecera y navegación duplicada en desktop. La corrección visual debe derivarse de HF-01; los mockups Stitch solo sirven para comprobar qué opciones/acciones necesita contener.
- **R-H14 — duplicación de navegación:** en anchos >820 px se oculta la navegación dentro del popover porque el navbar ya la presenta. Bajo 821 px, la lista principal reaparece dentro del desplegable.
- Stitch no aporta patrón visual aquí; únicamente inventario funcional/contenido. La apariencia debe permanecer dentro del sistema HF-01.

**Verificación pendiente:** render local del estado cerrado/abierto del hamburger en desktop, 768 y 375; foco/Escape siguen cubiertos por la primitiva `Panel` pero requieren evidencia visual antes de cierre.


### Corrección de jerarquía visual React — HF-01 sobre Stitch

Se corrigió una desviación de implementación detectada por el usuario: React estaba tomando patrones visuales de Stitch para hamburger/paneles, cuando Stitch solo debe informar alcance funcional/estructural.

Cambios:
- se eliminó la dependencia visual de Stitch en hamburger/lista plegable;
- se retiraron iconos/patrones de dashboard genérico del menú React;
- se eliminaron índices editoriales decorativos `01 / ...`, `02 / ...` de chat/accesibilidad;
- chatbot vuelve a identidad HF-01: isotipo real, superficie workbench, retícula sutil, geometría asimétrica, filas sobrias y flecha funcional;
- accesibilidad vuelve a una superficie utilitaria del mismo sistema visual, sin telemetría decorativa;
- popovers de header y menú se derivan de HF-01; Stitch queda únicamente para inventario de rutas, contenido y estados.

Esta corrección refuerza la regla de producto: **HF-01 define el lenguaje visual a expandir a todas las rutas**.


### Pasada visual React — acercamiento fuerte a HF-01 (2026-09-30)

Objetivo del bloque: llevar Home React a una composición mucho más cercana al HF-01 congelado y eliminar acumulación de CSS/parches de iteraciones anteriores.

#### Cambios estructurales
- `src/styles/home.css` fue reconstruido como **una única capa React** derivada de HF-01; se eliminaron selectores legacy de `.product-card/.product-image` y overrides superpuestos.
- `src/styles/shell.css` fue reconstruido como **una única capa de shell**, eliminando breakpoints duplicados que producían resultados distintos según ancho.
- Se restauró el encabezado completo de **Señales de precisión** que faltaba en React.
- El método dejó de renderizar numeración editorial redundante, en línea con la limpieza aprobada del HF.
- El CTA final recuperó copy/intención del mockup: revisión técnica primero, cotización después.

#### Fidelidad / craft
- Hero mantiene retícula, producto protagonista, marco rotado, scan, callout, ficha técnica, riel y parallax ligero.
- ProductCard se alinea al HF en proporciones, materialidad, badges, fundido de imagen y hover corto.
- Método recibe interacción lineal discreta; no se añadieron tarjetas nuevas.
- Precisión recupera heading, grid continuo y feedback sutil por tarjeta.
- CTA final conserva composición del HF y una única línea de acento.
- Chat, accesibilidad, hamburger, search y Mi Espacio permanecen dentro del lenguaje HF-01, sin numeraciones decorativas ni estética Stitch.

#### Motion
- `RevealOnScroll` implementa ahora realmente la prop `delay`; antes se filtraba al DOM y el stagger no existía.
- Reveal, hover y entradas respetan `prefers-reduced-motion` y el ajuste global `data-motion="reduced"`.
- Referencias Codrops/Scrolltide se usaron para criterio de profundidad y timing, no para copiar demos ni añadir GSAP/Three/WebGL.

#### Verificación disponible
- Auditoría estática: no quedan breakpoints duplicados en Home/shell ni selectores legacy de ProductCard.
- No existe evidencia de navegador conectado para esta pasada, por lo que **no se declara fidelidad visual verificada ni Capa 2 cerrada**.
- Siguiente evidencia necesaria: render local 1280 / 768 / 375, Dark/Light, Hero completo y paneles abiertos; el usuario aprueba/rechaza el resultado visual.


- **R-H15 — regresión de sintaxis en RevealOnScroll:** una actualización automática escribió secuencias literales `\n` dentro de `src/components/ui/RevealOnScroll.jsx`, provocando `Invalid Unicode escape sequence` en Vite. Se corrigió reescribiendo el archivo con saltos de línea reales y se comprobó que ya no contiene escapes `\n` literales. El build/render local debe volver a ejecutarse por el usuario tras pull.


### Gate automatizado de entrega — GitHub Actions

Tras la regresión de sintaxis de `RevealOnScroll.jsx`, se añadió `.github/workflows/verify.yml` para verificar cada push a `Pruebas`.

Checks:
- instalación limpia con `npm ci`;
- lint;
- Jest;
- build aislado del UI Kit (`check:ui`);
- build de producción Vite.

La primera ejecución detectó un error adicional real en `Home.jsx` (`react-hooks/set-state-in-effect`) antes de una nueva entrega. Se eliminó el efecto innecesario. La segunda ejecución consiguió lint/tests/UI build/build en success.

Regla durable: no solicitar `git pull` para cambios de código hasta tener el commit final con el gate verde. La aprobación visual del usuario sigue siendo independiente del CI.


- **R-H16 — regresión visual del menú de cuenta:** el panel React se alejó del desplegable compacto ya resuelto en HF-01 y apareció como una lista genérica con flechas repetidas y contenido extra. Se restauró la composición compacta del HF-01: cabecera Mi Espacio/estado, iconos reales por fila, login/registro, divisor, ayuda y preferencias. Se retiró Carrito del panel desktop y se mantuvo la navegación principal solo para móvil. CI obligatorio ejecutado tras el cambio.


- **R-H17 — chrome React y flotantes no coincidían con HF-01:** capturas reales mostraron los botones flotantes invadiendo el workbench durante scroll y un navbar donde búsqueda/idioma/tema parecían variantes del mismo control genérico. Se restauró el auto-hide lateral de HF-01 (`translateX(60px)`, opacidad reducida, sin pointer-events mientras hay scroll), se diferenciaron los roles visuales de búsqueda/idioma/tema/CTA/hamburger y se separaron completamente las reglas de Search y Mi Espacio.
- **R-H18 — colisión Search/Mi Espacio:** una edición anterior dejó `.search-panel,.account-panel-dropdown` compartiendo propiedades específicas de cuenta. Se corrigió: ambos popovers conservan anclaje común pero tienen geometría, padding y contenido propios.
- Referencias externas usadas únicamente como criterio: Navbar Gallery para dropdown compacto/escaneable y Motion Primitives para feedback ligero de selección/hover. Sin dependencias nuevas ni cambio de identidad.


- **R-H19 — scrollbar horizontal accidental en Mi Espacio:** `overflow:auto` habilitaba ambos ejes en el popover. Se cambió Search/Mi Espacio a `overflow-y:auto` + `overflow-x:hidden`, overscroll contenido y scrollbar vertical fino.
- **R-H20 — búsqueda visualmente vacía:** el popover era solo input + hint + botón. Se enriqueció sin inventar catálogo: estado vacío con accesos reales a Catálogo/Materiales/Requisitos; estado con query ofrece una única acción contextual para buscar ese término. Se añadió feedback de foco/hover y jerarquía visual propia.
- **R-H21 — microinteracciones como sistema:** se inició un banco por componente en docs/04. Primer patrón aplicado a botón primario: lavado interno corto + sombra contenida; sin librerías nuevas.


- **R-H22 — scroll anidado en popovers:** además del `overflow:auto` del panel externo, la primitiva `.v-panel__body` añadía un segundo scroll interno. En Search/Mi Espacio se desactivó ese overflow interno, se mantuvo un único eje vertical externo y se añadieron `min-width:0` / `overflow-wrap:anywhere` en filas para impedir desbordes horizontales.


- **R-H23 — microinteracciones sin equivalencia de teclado:** varias mejoras solo respondían a `:hover`. Se añadió `:focus-visible` / `:focus-within` equivalente en nav links, links de acción, icon buttons, ProductCard, Método y Precisión.
- **R-H24 — feedback de enlaces demasiado plano:** NavLink y LinkText mantienen la geometría HF-01, pero ahora añaden reveal de línea, micro-lift y desplazamiento de flecha de 1–2 px; no se añadieron elementos decorativos permanentes.


- **R-H25 — control de tema perdió el carácter del HF-01:** React había convertido el selector de tema en un icon button genérico. Se restauró el lenguaje del control aprobado: 42×42, borde lava fino, fondo oscuro técnico, icono exclusivo sol/luna y microinteracción de rotación/escala/press. Se mantiene accesibilidad y reduced-motion global.

### Auditoría responsive de Auth React — 2026-09-30

En la ruta `/login`, la revisión visual efectiva a 768 px confirmó que el panel editorial y el formulario se apilan según el breakpoint, sin desbordamiento horizontal. La navegación por teclado alcanzó los campos y mostró foco visible. En el breakpoint móvil (`max-width:560px`) el CSS ocultaba el texto de `.auth-back-link` con `font-size:0`, dejando únicamente la flecha; se cambió a una etiqueta compacta visible con flecha separada. Render posterior a 374 px confirmó el texto completo visible y ausencia de desbordamiento horizontal. No se probó con lector de pantalla real.

### R-H26 — rail de piezas se cruzaba con herramientas flotantes en tablet/móvil

**Evidencia:** render real de Home a 768 px y 374 px CSS, tema oscuro. En 768 px, los botones fijos de Chat/Accesibilidad se superponían al rail vertical al llegar al workbench; a 374 px tapaban miniaturas y parte de la ficha del producto. En 374 px, el producto principal ya aparece dentro del primer viewport (imagen termina en y≈753 de 812 px).

**Corrección:** en anchos ≤820 px el rail pasa a una fila horizontal de miniaturas. En tablet se conservan flechas anterior/siguiente; en móvil se priorizan las cuatro miniaturas táctiles (48×48 px) y queda un margen lateral reservado para los flotantes. Escritorio mantiene el rail vertical. No se movieron ni ocultaron Chat/Accesibilidad.

**Verificación:** a 374 px las cuatro miniaturas quedan separadas de los botones flotantes, la ficha no queda cubierta y el producto sigue visible en el primer viewport; a 768 px rail horizontal y flotantes tienen zonas distintas; en 1280 px se había confirmado rail vertical y separación. Solo se revisó Dark; Light, estados abiertos de panel y lector de pantalla real continúan pendientes. El HTML congelado no se modificó.

### Revisión visual Home React — Light y paneles — 2026-09-30

**Evidencia:** render real en navegador local, tema Light, viewport reportado por el navegador de 2560×1254. La jerarquía del Hero y el producto se mantienen legibles sobre la superficie clara; las miniaturas y flechas conservan contraste. El panel de Chat abre anclado abajo a la derecha, con su entrada y acciones visibles; el panel de Accesibilidad usa la misma ancla y mantiene separados encabezado, opciones y botón de reinicio.

**Comprobación funcional/visual:** los controles de tamaño aparecen como opciones seleccionables; al elegir «Texto grande», el título y el contenido de Home aumentan visiblemente y refluye la composición sin clipping observable. «Tamaño normal» revierte el cambio. El árbol de accesibilidad expone títulos, nombres de botones, campo de texto, opciones y switches. No se probó con lector de pantalla real ni se recorrió el panel con teclado completo. No se identificó un defecto que justifique alterar estilos en esta pasada.

**Límites:** esta inspección cierra únicamente la comprobación de Light y paneles en escritorio ancho. No equivale a aprobación visual del usuario ni cierra Capa 2: falta validar ambos paneles en viewport móvil/tablet y realizar la revisión con tecnología de asistencia real. No se modificó el HTML congelado.

### R-H27 — aumento de texto apenas perceptible y parcial

**Causa confirmada:** el control ofrecía solo 112,5% y 125%, mientras numerosos tamaños `px` en Home, shell, UI Kit y Auth no dependían de `--a11y-font-scale`. El resultado agrandaba principalmente títulos basados en `rem`; no era útil como ayuda de lectura transversal. El usuario reportó que una persona mayor no podía leerlo adecuadamente.

**Corrección:** escala explícita 100/150/200%; porcentajes visibles y nombres accesibles con el valor; preferencias persisten en el dispositivo. Se conectaron tamaños `font-size` y shorthand `font` de las hojas CSS de la app al factor global. Para 200%, Home apila Hero-copy y workbench; el navbar oculta los enlaces horizontales y los conserva en el menú plegable.

**Verificación:** pruebas nuevas confirman que las tres opciones aplican y persisten; suite completa: 44 tests, lint, `check:ui`, build y `git diff --check` pasan. En render real de Home a escala 200%, el texto de párrafo sube de 16 a 32 px y el heading de 94 a 188 px; el workbench queda debajo del texto, sin solaparse, y el documento no crea overflow horizontal en el escritorio probado. **No afirmar cierre WCAG:** falta probar 150/200% en 375/768 px, rutas secundarias, teclado/lector de pantalla y validación con personas usuarias. WCAG 2.2 1.4.4 requiere que el texto pueda ampliarse hasta 200% sin pérdida de contenido o funcionalidad.

La pasada anterior había tratado el cambio visual del título como evidencia suficiente; eso fue incorrecto. No se rediseñó ni modificó el HTML HF-01 congelado. Los detalles Light que el usuario anticipó permanecen pendientes de inspección/corrección.

### R-H28 — Home y chrome demasiado contenidos en monitor ancho — 2026-09-30

**Hallazgo:** comparación del screenshot del usuario (1920×1080) y CSS confirmó máximos independientes y estrechos: Hero 1440 px, navbar 1480 px y secciones 1320 px. En el monitor ancho la pieza y la composición quedaban demasiado centradas/pequeñas respecto al área disponible. No era un fallo de resolución ni debía resolverse estirando todos los textos.

**Corrección:** tokens compartidos en `src/index.css` (`--page-gutter`, `--page-gutter-compact`, `--layout-max-wide`, `--layout-max-content`). Hero/navbar comparten marco de hasta 1680 px; secciones de Home/footer hasta 1520 px; gutters fluidos se reutilizan también en shell y layouts compactos. Se conservan máximos menores para páginas de lectura/formularios y paneles. No se modificó el HTML HF-01 congelado ni el flujo React.

**Verificación:** HMR en navegador local a viewport de escritorio ancho mostró el Hero ampliado, producto más dominante y sección destacada extendida, sin pérdida de márgenes ni cambio de identidad. No se pudo obtener una medición numérica fiable del viewport mediante la API de evaluación del navegador; el screenshot aportado por el usuario es 1920×1080. Pendiente revisión real en 1280, 820/768, 560/375 px, resolución ultrawide, Light y escalas 150/200%; no se declara ausencia universal de overflow.

**Unificación de preferencias:** doc 04 ahora distingue preferencias compartidas/persistidas (tema, idioma, escala, contraste, movimiento) de estados locales/transitorios (paneles, búsqueda, chat y selección de pieza). La cobertura de traducción completa sigue pendiente y no se declara terminada por existir un provider global.

### R-H29 — tipografía general se percibía de tamaño laptop en monitor ancho — 2026-09-30

**Hallazgo:** la ampliación anterior cambió marcos de contenido, pero muchos textos, botones y señales aún usaban escalas base/caps fijos. El usuario confirmó que la página seguía sintiéndose pequeña en su monitor, aunque se veía adecuada en laptop.

**Corrección:** `PreferencesProvider` calcula un factor fluido entre 1.0 y 1.12 a partir del viewport CSS (inicia desde 1440 px), actualiza el factor en resize y lo multiplica por la preferencia elegida de 100/150/200%. Como el factor alimenta las declaraciones tipográficas existentes, amplía de forma coordinada titulares, cuerpo, controles y metadatos sin cambiar el espaciado geométrico por separado.

**Pruebas:** se añadió test para escala 1.1 a 1920 CSS px; en esta iteración la suite completa pasa con 48 tests. Aún falta verificar visualmente en el monitor real, laptop, 1280/768/375 y con las tres preferencias; el límite no declara que cada resolución física se haya probado.

### R-H30 — faltaba una acción explícita de lectura en voz alta

El control ♿ abría ajustes de lectura (tamaño, contraste, movimiento), pero no pronunciaba el contenido. Se añadieron en ese panel «Leer selección», «Leer página completa» y, durante la reproducción, «Detener lectura», con voz/idioma del navegador según idioma activo, estado accesible y manejo de falta/error de soporte. La selección se lee solo cuando la persona activa el botón; no se dispara al pasar el cursor ni por seleccionar. Fuente: SpeechSynthesis API documentada por MDN; no se instala dependencia ni se envía texto fuera del dispositivo.

**Alcance importante:** esto no es un lector de pantalla, no navega por controles ni reemplaza NVDA/VoiceOver/TalkBack del sistema. La compatibilidad semántica con esas tecnologías sigue siendo un requisito separado; no se declara probada con lector real. Los tests automatizados comprueban contenido, idioma, estado y detener lectura; escuchar y revisar el panel en navegador real queda pendiente.

### R-H31 — lectura de selección y correcciones semánticas — 2026-09-30

Se incorporó «Leer selección» para escuchar solo el texto marcado mediante selección normal de ratón o teclado, bajo demanda; «Leer página completa» queda separado. Si no hay selección, el estado explica cómo continuar. No se usa hover ni se intenta capturar una pulsación prolongada, comportamiento poco fiable y excluyente para usuarios de teclado/movilidad. La lectura cancela cualquier voz anterior y se detiene al cambiar de ruta o al solicitarlo.

Durante la auditoría se encontró que el selector de piezas usaba `tablist`/`tab` sin el patrón de teclado/`tabpanel` correspondiente; se cambió a grupo de botones con `aria-pressed`, operable con Tab y Enter/Espacio. También se retiró `aria-label` de un `div` visual sin rol y se hizo explícito el grupo semántico de herramientas/señales. Tests cubren lectura de selección y ausencia de selección; no equivalen a una prueba con lector de pantalla. La prueba manual de teclado se registra debajo; queda pendiente validación con tecnología asistiva real y revisar el panel en los dispositivos/escalas indicados en el punto actual.

**Prueba manual posterior en navegador (2026-09-30):** Tab alcanzó los CTA y miniaturas; Espacio activó la segunda pieza, actualizó imagen, título, metadatos y estado seleccionado en el árbol de accesibilidad. La sesión no contó con un lector de pantalla del sistema, así que no se declara validación con tecnología asistiva real.

### R-H32 — superficies de workbench seguían negras en tema Light — 2026-09-30

**Hallazgo visual:** en el render Light de Home el panel exterior de la fotografía conservaba fondo `#15120f`; encima, viñetas, degradado inferior, sombras de miniaturas/tarjetas y la píldora «REVISIÓN ACTIVA» usaban negros fijos. La captura hacía que partes de la interfaz parecieran placas oscuras pegadas sobre la superficie clara.

**Corrección:** en Light el soporte usa la superficie cálida de imagen, se reducen las viñetas oscuras y el degradado inferior, se cambian las sombras de miniaturas/tarjetas por tonos cálidos y se levanta levemente la luz de la foto. La píldora «REVISIÓN ACTIVA» usa tokens claros del tema. No se cambiaron las imágenes ni sus contenidos. El fondo oscuro que aún se ve dentro de la fotografía es parte de los píxeles del JPG, no una superficie del tema; se conserva para no falsear el aspecto de la pieza ni alterar archivos originales.

**Verificación:** render local en navegador en tema Light, escritorio ancho, después de HMR. El workbench cambió a marco cálido claro y mantuvo la imagen distinguible; Home conserva texto y controles legibles. Debe revisarse el resultado en el viewport del usuario y validar los estados de hover/foco y tamaños menores antes de dar por cerrado Light. No se tocó Auth ni se modificaron datos/archivos de imagen.

### R-H33 — composición editorial de Acceso demasiado vacía en su parte superior

En `/login`, el rótulo quedaba cerca del borde superior mientras el mensaje principal se anclaba abajo, dejando un vacío excesivo. Se cambió la distribución a un bloque editorial verticalmente centrado y con separación controlada; en tablet/móvil la separación se reduce. La inspección visual local en Light confirmó el rótulo y titular con jerarquía y sin solapamiento. No se modificó el formulario ni el flujo de autenticación.

### R-H34 — fotografía de catálogo parecía deslavada en Light — 2026-10-01

**Causa confirmada:** la imagen mantiene una máscara radial aprobada para fundirse con el fondo oscuro de Dark. En Light, sus píxeles gradualmente transparentes dejan ver la superficie clara y hacen que la foto parezca tener opacidad reducida. No era el estado `data-unavailable`: la tarjeta mostrada tenía stock y estado activo; tampoco era el reveal de scroll.

**Corrección:** las imágenes de las tarjetas de catálogo dejan de usar la máscara radial en Light. Dark conserva la máscara y las reglas semánticas de disponibilidad siguen intactas. No se cambió ni reemplazó ningún archivo de imagen.

**Verificación:** captura local en Light de las tarjetas de catálogo posterior a HMR confirma que la imagen vuelve a verse nítida y con contraste, mientras la superficie de la tarjeta sigue clara. Dark quedó sin cambios por especificidad de tema; tests, lint, `check:ui` y build pasan. Hover a distintas resoluciones queda dentro de la revisión Home pendiente.
### R-H35 — asistencia se leía como listado decorativo, no como interfaz conversacional — 2026-10-01

**Hallazgo:** en Home React, las tres acciones de ayuda eran filas de navegación bajo un globo genérico. La superficie no establecía el estado demo al abrirse y el campo no se percibía como compositor persistente.

**Cambio:** bienvenida editorial breve, aviso visible de que la respuesta automática no está conectada, enlace directo a `/solicitud`, temas de inicio como controles agrupados y compositor separado/anclado. Se amplió la superficie y se retiró la retícula de fondo que competía con Home. El aviso aparece al abrir y después del intento; nunca se fabrican respuestas.

**Referencia → patrón → adaptación → razón:** Vercel AI Elements Message/Conversation separa conversación, mensajes y entrada. Solo se adaptó esa jerarquía al stack existente; no se importó su stack (Next.js/AI SDK/shadcn/Tailwind) ni dependencias. Pageflows/Refero se usaron para la tarea única y claridad de etiquetas del acceso, según el registro de `docs/04`.

**Verificación:** tests nuevos cubren aviso demo, destinos de solicitud, relleno del campo desde tema y estado al enviar. Render local verificado en Dark escritorio, Light escritorio y Light móvil; en móvil las tres opciones quedan visibles sin scroll interno del hilo. La prueba no verifica tecnologías asistivas reales.

### R-H36 — acceso necesitaba producto y eliminar el vacío editorial — 2026-10-01

**Hallazgo:** el login se apoyaba en un gran campo vacío y un lema desplazado, por lo que la composición parecía incompleta y no evidenciaba el uso de referencias externas solicitado.

**Cambio:** se rehízo el panel editorial con `hero-soporte.jpg`, retícula, marcas de pieza y especificaciones ya documentadas; el formulario queda como tarea central en una superficie clara y delimitada. Se conserva login email/contraseña, registro, errores, estado de carga, rutas y adapter académicos; AuthLayout compartido aplica el mismo panel también a registro.

**Referencia → patrón → adaptación → razón:** Pageflows Canva sign-in inspira la jerarquía de una sola tarea, no su acceso por código; Refero Login UI Guide informa etiquetas convencionales siempre visibles. Esto se ajusta al contrato académico de Vértice, con pasos y credenciales existentes, sin agregar OAuth o funciones no definidas.

**Verificación:** render local de `/login` en Dark escritorio y Light móvil, sin desbordamiento horizontal observado en el viewport probado. Falta revisión del usuario y prueba con lector de pantalla real. No se tocó el HTML HF-01 congelado.

**Corrección de criterio:** el usuario rechazó el resultado por su retícula, elipse y exceso de rótulos técnico-editoriales, correctamente señalados como una desviación hacia Stitch. Esa composición no debe considerarse aprobada; queda reemplazada por R-H37.

### R-H37 — acceso: galería de producto sin chrome inventado — 2026-10-01

**Hallazgo:** el panel de R-H36 vistió las fotografías como una consola ficticia: `VÉRTICE / ACCESO`, ubicación, estado, material, referencia, lema, procesos, retícula y elipse. No era contenido requerido ni un patrón visual autorizado por HF-01; imitaba el chrome de Stitch pese a la regla explícita de que Stitch solo informa alcance/estructura.

**Cambio:** se eliminaron esos rótulos y adornos, también el overline redundante del formulario. El acceso ahora muestra una galería automática de cuatro fotos de producto ya usadas por Home, el nombre real localizado y controles anterior/siguiente/pausa. La autenticación, el formulario y el HTML HF-01 congelado no cambiaron.

**Referencia → patrón → adaptación → razón:** [W3C APG Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) aporta control de rotación, pausa al recibir foco y hover, y región viva solo cuando no rota; [W3C WAI Images Tutorial](https://www.w3.org/WAI/tutorials/images/) sustenta textos alternativos informativos. Se adaptan a React/CSS existente, sin instalar dependencias ni trasladar estética de referencias. Reduced Motion desactiva la rotación automática y mantiene el cambio manual.

**Verificación:** cuatro tests cubren nombres alternativos, navegación, rotación, pausa por foco/puntero y movimiento reducido. Capturas reales: 1920×1080 Dark; 1280×800, 768×900 y 374×812 en ambos temas. Sin desbordamiento horizontal en las medidas inspeccionadas; a 768/374 el formulario queda debajo de la galería y requiere desplazamiento vertical normal. El tema Light conserva las fotos sin máscaras, mezcla ni opacidad añadida; los fondos oscuros dentro de las fotos son parte de los JPG. No se declara prueba con lector de pantalla real ni aprobación visual del usuario. Admin permanece para después del cierre de Home.

### R-H38 — scanner del Hero y tarjetas destacadas — 2026-10-01

**Solicitud del usuario:** mantener el scanner, pero colocar su línea sobre la pieza activa para cualquiera de las imágenes del carrusel; rediseñar las tarjetas de Home y reevaluar el badge/conteo de stock. La captura del usuario muestra la línea de referencia pasando bajo el soporte, por fuera del objeto.

**Criterio aplicado en esta iteración:** cada fotografía Hero lleva una región de escaneo calibrada en sus metadatos. El barrido se limita a esa región; esto es ajuste explícito por asset, no detección automática por visión. Una imagen nueva debe incluir calibración. Las tarjetas destacadas no muestran stock ni disponibilidad sin fuente vigente; la ficha/checkout conserva disponibilidad que afecte la compra.

**Implementación React:** scanner con área/barrido calibrado por las cuatro imágenes actuales; tarjeta destacada de Home con material, categoría, nombre, descripción y acceso a ficha, sin referencias/cantidades/estado de stock. Se mantiene `stock` como dato de inventario y Admin. Se corrigieron claims previos de SLA/resina/nylon al alcance confirmado de FDM y filamentos ASA, PLA, PETG, ABS y TPU. Se retiró de React la tolerancia `±0.05 mm` y logística no confirmada; esos textos aún visibles en HF-01 quedan como contenido de mockup y no como promesas operativas. HF-01 congelado no se editó.

**Verificación local:** lint, Jest (54 tests), check UI (48 módulos), build y `git diff --check` pasan. **Pendiente:** inspección del render React en 1280/768/375 px, Dark/Light y selección de las cuatro piezas, además de aprobación visual del usuario. No se declara fidelidad visual verificada sin esa inspección.

### R-H39 — Acceso: collage interactivo de piezas — 2026-10-01

**Nueva dirección del usuario:** la galería lineal del login no comunicaba el collage deseado. El fondo sólido también se sentía demasiado plano. La imagen compartida sirve como referencia estructural de marcos fotográficos superpuestos; las fotos de producto pueden seguir siendo provisionales.

**Cambio:** `/login` y `/registro` comparten un collage de cuatro fotos existentes, con variación leve de giro y superposición. Bajo el puntero cada marco se eleva y amplía; el foco/selección de teclado refleja el mismo énfasis y se actualiza la leyenda de pieza/material. Se conserva acceso a todas las piezas como botones nombrados, sin rotación automática ni controles de carrusel redundantes. El fondo gana una retícula muy baja y luz cálida discreta a partir de tokens; Dark y Light conservan formulario legible. No cambian Auth, rutas ni HF-01.

**Referencia → patrón → adaptación → razón:** [Framer Marketplace — Spotlight Collage](https://www.framer.com/marketplace/components/spotlight-collage/) muestra medios superpuestos que suben y escalan bajo hover/tap. Se lleva esa respuesta al collage propio con CSS y z-index, sin Framer ni dependencia; la composición del usuario aporta el solapamiento editorial. El panel de acceso mantiene la jerarquía de una tarea del contrato de Pageflows/Refero en docs/04.

**Verificación visual local:** capturas en navegador a 1366×768 Dark y 390×844 Dark/Light; el dragón seleccionado sube sobre las otras fotos. Sin overflow horizontal en las vistas capturadas. Tests cubren cantidad/nombres, hover, selección y foco con teclado; lint y build pasan localmente junto con 53 tests y check UI. No hubo lector de pantalla real ni aprobación visual final.

### R-H40 — Home: segunda pasada visual de scanner y tarjetas — 2026-10-01

**Corrección de auditoría:** el usuario rechazó R-H38 con razón: la primera pasada cambió metadatos del scanner, pero la línea seguía casi imperceptible y cerca del borde/base; las tarjetas agrandaban seis veces la misma imagen «producto próximamente». La revisión real del navegador confirmó esas dos causas.

**Cambio:** la línea usa 2 px, Lava más luminoso y mayor presencia, con calibración vertical alta y por asset en las cuatro imágenes. Featured ProductCard vuelve a imagen panorámica de 170–200 px, elimina máscara radial/filtro que oscurecían el placeholder y conserva cuerpo compacto con categoría, nombre, descripción y ficha. No se sustituyeron las fotos ni se editó HF-01 congelado.

**Verificación visual local:** capturas Dark a 1366×768 muestran el barrido sobre soporte, engranaje, dragón y brazo; Home se revisó también con la sección de tarjetas en vista. Login recibió pasada Dark/Light escritorio/móvil. Los 53 tests, lint, check UI y build pasan. Aprobación visual del usuario y pruebas de tecnologías asistivas quedan pendientes.

### R-H41 — corrección de objetivo visual: anotación Hero, collage y cards — 2026-10-01

**Aclaración del usuario:** el problema del Hero no era el scanner horizontal. La referencia compartida señala la anotación que identifica el material (rótulo PETG, líder naranja y punto terminal); se restaura el barrido original y se recalibra el endpoint para que el líder toque la pieza. También se precisó que el collage de acceso debía tener seis fotos, no cuatro, y que la anterior composición de tarjetas todavía se percibía igual.

**Cambio:** el scanner se restaura al comportamiento original de HF-01/React, sin stage ni recorrido/calibración por imagen. Los endpoints de la anotación de material se ajustan por pieza. Acceso incorpora seis assets distintos del repositorio: soporte, engranaje, dragón, drone, maqueta y el placeholder permitido. Home cambia de tarjetas verticales en tres columnas a piezas horizontales en dos columnas, con imagen reducida a miniatura, material/categoría/título/descripción y enlace; conserva sin stock promocional y no sustituye datos provisionales por productos inventados.

**Verificación local:** en navegador se inspeccionaron los cuatro estados del Hero; los puntos terminales del líder quedaron sobre la superficie de cada pieza y el scanner horizontal conserva el recorrido original. En Home se revisaron las filas horizontales de producto con el placeholder completo; en Acceso se inspeccionó el collage con las seis fotos. Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`. Mantener separado: imágenes disponibles para el collage ≠ fotos reales del catálogo; las seis cards de Home siguen usando el mismo placeholder autorizado. Aprobación visual del usuario y revisión en breakpoints/temas adicionales quedan pendientes.

### R-H42 — Home: corregir líder de material y retirar rótulos redundantes — 2026-10-01

**Hallazgo del usuario:** en el render real el punto de la línea naranja terminaba en el fondo y no sobre el objeto. PETG aparecía como sigla sin contexto; “lattice” tampoco se entendía. Las destacadas aún tenían una insignia diminuta arriba a la izquierda. En las tres columnas de precisión se repetía el mismo concepto en índice, titular, descripción y chip.

**Causa:** el líder R-H41 conservaba un SVG fijo (185×130) desacoplado del área de imagen, aunque la foto cambia de proporción según el viewport. La separación de coordenadas no podía mantener el punto terminal en el mismo lugar de la pieza. El badge era general al componente ProductCard y las columnas conservaban cuatro niveles de texto.

**Cambio:** ResizeObserver mide foto, paddings, `object-fit: contain` y rótulo; el SVG del marco recalcula en cada tamaño/selección y traza desde el rótulo al punto de imagen guardado para cada pieza. Es calibración por asset, no detección automática. La etiqueta dice «Filamento · PETG/PLA/ASA» y el descriptor del soporte dice «estructura aligerada». ProductCard mantiene material en usos estándar y lo omite en las promocionales. Precisión queda en tres columnas sin índices ni chips, cada una con título informativo y una descripción breve.

**Verificación:** inspección local del navegador confirma la línea conectada desde el rótulo y su punto sobre soporte, engranaje, dragón y drone a 1280×800; soporte revisado también a 375×812. Las tarjetas destacadas no muestran insignia y las tres columnas de precisión conservan un título y una explicación sin índices/chips. Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`. HF-01 permanece congelado e intacto. Falta revisar el resto de breakpoints, Light y la aprobación del usuario.

### R-H43 — Home: llamada corta del Hero, métrica veraz y hover de precisión — 2026-10-01

**Hallazgo del usuario:** la línea de R-H42 aún parecía cruzar todo el producto en lugar de señalar un detalle. «5 filamentos disponibles» sugería inventario actual no confirmado. Las tarjetas de precisión necesitaban respuesta al pasar el cursor.

**Cambio:** se mantienen el cálculo del endpoint desde el lienzo real de la foto y el scanner horizontal independiente, pero cada endpoint se acerca al borde superior/izquierdo del detalle seleccionado: soporte (truss), engranaje (diente/placa), dragón (cabeza) y drone (viga). El trazo termina ahí sin recorrer el objeto entero. El rótulo del Hero queda «5 materiales definidos», que comunica el conjunto confirmado sin hablar de stock. Las tarjetas de precisión responden con acento Lava en el título, un desplazamiento leve y una regla que se despliega bajo esa columna; `prefers-reduced-motion`/preferencia local anula transiciones.

**Referencia → patrón → adaptación → razón:** Codrops, Grid Item Reveal, recomienda que la interacción de una grilla se active solo en el ítem bajo el cursor y destaque su contenido. Sin imagen de producto en estas tarjetas, Vértice adapta la respuesta a la regla inferior y el titular; así hay feedback local visible sin elevar una superficie completa ni sumar datos decorativos. Sin dependencias nuevas.

**Verificación:** render local a 1024×780 confirma los cuatro endpoints directamente sobre los detalles señalados; captura Dark con hover confirma la regla y el cambio del titular. A 375×812 se revisó el Hero con el punto sobre el soporte y la métrica «5 materiales definidos» (sin afirmar inventario disponible). Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`. HF-01 sigue congelado; aprobación visual final y revisión restante de breakpoints/temas siguen pendientes.

### R-H44 — Home: reemplazo de señales genéricas y líder continuo — 2026-10-01

**Hallazgo del usuario:** el cambio anterior solo ajustó una frase y dejó visualmente igual el bloque inferior izquierdo; la línea del rótulo aún mostraba un corte antes de continuar en horizontal/diagonal.

**Cambio:** se quita el conteo y el texto repetitivo «Por etapas». El bloque ahora comunica «Bajo pedido» con su explicación y «FDM» junto a la lista ASA · PLA · PETG · ABS · TPU, en dos columnas separadas. El indicador vertical del rótulo y su línea hacia el objeto son una sola trayectoria SVG continua, con joins redondeados; se elimina el borde CSS independiente que daba lectura de segmentos separados. HF-01 permanece congelado.

**Referencia → patrón → adaptación → razón:** se usa HF-01 como autoridad del trazo técnico y `docs/04` como criterio para que cada microetiqueta responda a una pregunta real. La información del bloque aclara el modelo de producción y proceso/materiales sin sugerir disponibilidad inmediata; no se añade referencia externa porque la composición es una continuidad del lenguaje ya aprobado.

**Verificación:** render local inspeccionado a 1280×720 y 375×812; el bloque aparece como dos señales claras y el líder queda visualmente unido desde el marcador hasta el objeto. Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`. HF-01 intacto. Pendientes la aprobación visual del usuario y revisión general de Home en otros temas/escala/breakpoints.

### R-H45 — legibilidad del chrome y brechas del recorrido de compra — 2026-10-01

**Hallazgo del usuario/instructor:** el tamaño por defecto de varios textos era demasiado pequeño para leer, en especial navbar y footer. También se solicita revisión del recorrido de compra completo.

**Hallazgos estáticos confirmados:** `shell.css` tenía navegación de 10–11 px, idioma de 9 px y enlaces/copy del footer de 12 px. Las rutas registradas de catálogo, detalle, solicitud, carrito, checkout, cuenta/pedido, soporte y Admin apuntan a `ConstructionPage`; solo Home, login y registro tienen pantallas específicas. Por lo tanto, la Home presenta dos entradas distintas (catálogo bajo pedido vs. archivo para cotización), pero hoy el frontend no permite completar los recorridos de venta.

**Cambio implementado:** navbar pasa a 14 px en escritorio y 13 px entre 821–1120 px; idioma a 12 px; CTA a 13/12 px; cuerpo y enlaces del footer a 14 px; títulos/metadata de footer a 12 px. El hover de enlaces usa color de texto principal con subrayado Lava. `homeContent.js` distingue que cada modelo se fabrica por encargo de la revisión/cotización de piezas propias. No se menciona stock.

**Auditoría customer journey:** `docs/03` describe Home → catálogo → ficha → carrito/checkout → postcompra y el flujo separado de solicitud personalizada; identifica transparencia de costos/envíos únicamente cuando se confirmen y soporte postventa. En checkout se aplica el principio de [Baymard](https://baymard.com/research-articles/show-shipping-costs-on-product-pages): explicitar temprano costos que cambian el total; no se agrega ninguna estimación al sitio. `docs/04` fija criterio de legibilidad y referencias W3C para contraste/aumento de texto.

**Inspección disponible:** el árbol accesible local a 1280×720 confirma labels del navbar y contenido de Home; screenshot Dark escritorio muestra los tamaños mayores del navbar. CSS confirma los tamaños del footer, pero no se obtuvo inspección renderizada del footer, ni de viewport 768/375, tema Light o escalas 150/200% en esta pasada. Lector de pantalla real y aprobación visual siguen pendientes. No afirmar conformidad WCAG global.

**Criterio y siguiente paso:** conservar Space Grotesk para lectura y reservar JetBrains Mono compacto para datos técnicos secundarios; jerarquizar producto, uso, material, precio respaldado y fabricación bajo pedido; no sugerir inventario ni entrega inmediata. El siguiente bloque funcional es Admin operativo protegido por rol y luego IA/N8N. Home aún requiere revisión visual pendiente.

### R-H46 — Home cerrada para avance, segundo aumento de tipografía y dashboard Admin — 2026-10-01

**Decisión del usuario:** Home se considera suficientemente completa. HF-01 deja de ser requisito para permanecer iterando la Home o bloquear la siguiente área; cualquier ajuste posterior será puntual. Admin empieza ahora. Esto no cambia el estado congelado del HTML HF-01 y no significa que se edite.

**Tipografía:** la captura aportada confirmó que 14 px en navbar y footer aún se leían pequeños a tamaño por defecto. En `shell.css` se aumenta navbar a 16 px desktop / 15 px en el tramo compacto, menú a 16 px, idioma a 14 px, CTA a 16/15 px; footer copy/enlaces a 16 px, títulos y cierre a 14 px; links de footer ganan mayor área vertical. El CTA lleva `white-space: nowrap` para mantener su etiqueta íntegra al crecer. La navegación colapsa al menú compacto hasta 1000 px para que los labels grandes mantengan espacio. El tamaño sigue sumando la preferencia global 100/150/200%.

**Render observado:** 1280×720 Dark en browser local: navbar (incluido CTA sin salto de línea) y footer muestran la nueva escala. La sección del footer se inspeccionó desplazando hasta el final de Home. Home no se sometió otra vez a revisión completa; el usuario la da por cerrada para avanzar.

**Primer slice Admin:** `/admin` ahora presenta resumen operativo protegido por el guard existente. Su service lee de JSON Server pedidos, solicitudes y usuarios; el dashboard muestra 5 pedidos activos y 1 solicitud en revisión según el contrato actual, pedidos recientes con totales registrados y un aviso aparte para la solicitud legacy `SUBMITTED`. No trata ese estado como `PENDING_QUOTE`, no usa `stock`/`minStock` y muestra ventas cobradas como sin datos porque el modelo no aporta evidencia de pagos. `activityLog` está vacío y no se consulta ni se completa con eventos ficticios. Los demás destinos de navegación Admin permanecen pendientes.

**Identidad Admin:** se adopta una composición de trabajo propia, legible y densa, basada en tokens Vértice. No replica el workbench de Home ni toma la estética de Stitch. Sin nuevas dependencias.

**Verificación:** login admin académico y conexión real local a JSON Server observados en browser a 1280×720; árbol accesible incluyó métricas, filas de pedidos, cola de solicitudes y advertencia de dato legado. Lint, `check:ui`, build y `git diff --check` pasan. No se ejecutaron pruebas automatizadas en este bloque. Responsivo 768/375, Light, cobertura de acciones Admin y aprobación visual continúan pendientes.

### R-H47 — login sin ficha fantasma y continuidad Admin — 2026-10-01

**Hallazgos confirmados:** aunque los seis marcos del collage tenían `aria-pressed="false"` al cargar, la leyenda usaba el primer producto como respaldo y mostraba nombre/material sin selección. La composición dejaba espacio visual sin una explicación del collage. En navegación, Navbar apuntaba a `/cuenta` para cualquier usuario autenticado; por eso una sesión Admin que volvía a la tienda no tenía acceso directo al dashboard desde «Mi cuenta». El login ya conservaba en `location.state.from` la ruta protegida solicitada.

**Cambios:** estado idle con instrucción neutral; título editorial breve para contextualizar las seis imágenes; nombre/material solo con hover, foco o selección. El menú público ahora muestra «Panel de administración» y va a `/admin` para admin, conserva «Mi cuenta» → `/cuenta` para cliente y «Iniciar sesión» → `/login` para invitado. El shell Admin identifica al operador en la barra lateral. No se altera HF-01 ni se crean acciones para registros que no las tienen.

**Referencia → patrón → adaptación → razón:** Framer Marketplace — Spotlight Collage: medios editoriales elevados al interactuar; se conserva su selección con CSS propio y se añade orientación antes/después de la interacción para evitar una leyenda de producto arbitraria. Motion Primitives — Animated Background: feedback de selección que ubica en una lista; se mantiene en navegación Admin, sin hacer que filas estáticas parezcan enlaces. Ambas referencias ya formaban parte del banco de `docs/04`; no se añadieron dependencias.

**Auditoría de recorrido:** invitado → login; cliente autenticado → `/cuenta`; admin autenticado → `/admin`; acceso directo a ruta protegida → login → retorno a ruta solicitada; logout Admin → Home. En navegador local se completó login Admin → tienda → menú → `/admin`; el render del collage idle confirma que no se presenta ficha de pieza. A 724 px se inspeccionó el flujo refluido; la aprobación visual humana y revisión de Light/otros tamaños quedan pendientes. Pasan 54 tests, lint, `check:ui`, build y `git diff --check`.

### R-H48 — Home: catálogo editorial, controles flotantes y restitución de R-H45 — 2026-10-01

**Corrección del usuario:** el ajuste R-H46 se había motivado por una captura visualizada con zoom del navegador al 75%; solicita volver al primer incremento R-H45. También pide que el título del catálogo abarque selección en tendencia (no solo piezas funcionales) y que los controles de asistencia se perciban mejor en Brave.

**Cambio:** navbar restaurado a 14 px escritorio / 13 px tramo 821–1120 px, CTA 13/12 px e idioma 12 px; footer a 14 px de lectura y 12 px títulos/cierre. La navegación vuelve a plegarse a 820 px. Los dos controles flotantes pasan a 56×56 px; los paneles móviles se separan por encima de su columna. El catálogo ahora dice «Lo que está en tendencia» / “What's in the spotlight”, como curaduría editorial y sin claims de pedidos, ventas ni popularidad medida.

**Criterio visual:** se conserva HF-01 y la escala tipográfica R-H45, y se da al control flotante más área perceptible/táctil sin cambiar su forma ni lenguaje. El título permite convivir a piezas funcionales, mecánicas, artísticas y de colección. No se agregan datos, dependencias ni cambios al mockup congelado.

**Verificación:** lint pasa; suite 7/7 y 60/60; `check:ui` transforma 48 módulos; build Vite transforma 107 módulos; `git diff --check` pasa. La pestaña local recargada expone en el árbol accesible el nuevo título, contenido de Home, navegación/footer y ambos botones de herramientas. No se modificó el zoom del navegador. No se obtuvo screenshot para comparar visualmente la escala de los botones ni navbar/footer; esa inspección visual queda pendiente. Aprobación visual final pendiente del usuario.

### R-H49 — Admin: señal KPI abierta y transición auditada — 2026-10-01

**Hallazgo del usuario:** los KPIs de pedidos/solicitudes/cobros son rectángulos del mismo tamaño y superficie, reconocibles como dashboard genérico de Stitch. La solicitud pendiente de revisión debe convertirse en trabajo real del taller, con actor e historial, y el archivo no debe mostrar una descarga ficticia.

**Cambio visual:** KPIs pasan de tarjetas enmarcadas a un carril de tres señales tipográficas abiertas con reglas de separación. Solo «Solicitudes por revisar» es un enlace real y recibe la línea Lava que crece con hover/foco; pedidos y cobros no aparentan ser interactivos. «Sin datos de cobros» conserva el límite del modelo. No se añaden gauges ni barras con máximos inventados.

**Operación:** Admin puede iniciar revisión desde `PENDING_QUOTE`. El nuevo endpoint académico valida rol Admin activo y estado esperado; serializa acciones concurrentes en proceso y persiste `status: IN_REVIEW`, `reviewStartedAt`, `reviewStartedBy`, `updatedAt` y `REQUEST_REVIEW_STARTED` en `activityLog` mediante un reemplazo atómico del archivo JSON. Conflictos devuelven estado 409; errores/éxito se anuncian; el detalle muestra actor y hora. `npm run api` usa el bootstrap local `scripts/api-server.js`, que conserva el CRUD de JSON Server.

**Archivos:** definido en `docs/07` el contrato de `fileStorageService`, metadatos opacos y descarga temporal autorizada. Proveedor/credenciales no están definidos y por eso no hay acción de descarga en UI. JSON Server/token académico no se presentan como seguridad real ni como transacción de producción.

**Verificación:** ESLint, `check:ui` (48 módulos) y build Vite (108 módulos) pasan. Pruebas automatizadas y smoke de API no ejecutados. El endpoint se coloca antes del middleware comodín de JSON Server para que la ruta anidada no termine en 404. Los datos actuales no incluyen solicitudes `PENDING_QUOTE`, por lo que la acción no se pudo recorrer sin alterar fixtures. El servidor local anterior puede requerir reinicio con `npm run api`. La inspección visual del KPI en 719/768/1280 px y tema Light queda pendiente; no declarar la apariencia aprobada.

### R-H50 — Admin: tablero de flujo de taller, no plantilla de tarjetas — 2026-10-01

**Hallazgo del usuario:** quitar las cajas a los KPI no cambió suficientemente la sensación Stitch del dashboard: seguían la composición espejo de paneles rectangulares, encabezados dentro de cajas, tabla enmarcada y solicitudes como tarjeta secundaria. El usuario pide una auditoría y un rediseño completo del dashboard; Home sigue cerrada.

**Auditoría estática del estado anterior:** KPI iguales por columna; `.admin-queue` dibujaba superficies idénticas; la tabla añadía otro rectángulo en el interior; avisos legacy replicaban el mismo patrón; los estados eran pastillas con borde en cada fila. No había una vista de distribución de pedidos por etapa en `/admin` aunque el dataset sí tenía estados para calcularla.

**Cambio:** `/admin` ahora presenta KPIs como carril abierto; agrega una visualización SVG circular con distribución proporcional de pedidos activos por `PENDING`, `CONFIRMED`, `IN_PRODUCTION`, `READY` y `SHIPPED`; ofrece leyenda con cantidades legibles; trata la tabla como registro sin panel contenedor, la cola de solicitudes como vía de acción y el estado legacy como nota abierta. Los estados de pedido se distinguen por texto y punto semántico, las filas enlazadas reciben movimiento/acentuación en hover/foco. No se presentan periodos, metas, ventas, inventario ni previsiones que no estén en los datos. No se añaden dependencias. Home y el mockup HF-01 permanecen sin cambios.

**Referencias → patrón → adaptación → razón:** [Impeccable](https://github.com/pbakaus/impeccable) → evitar tarjetas repetidas/anidadas → variar densidad según tarea → que gráfica, registro y cola se lean como herramientas distintas. [taste-skill](https://github.com/senlindesign/taste-skill) → explicar el trade-off detrás de cada token → Lava solo destaca la ruta accionable y el resto usa estado semántico → mantener carácter sin saturar. [Emil Kowalski / skills](https://github.com/emilkowalski/skills) → escoger movimiento y curva por intención → entrada breve del anillo y de las filas, retirada para `prefers-reduced-motion`/preferencia global → orientar sin animación de showcase. Se estudiaron repos de Claude como fuentes de criterio; no se copiaron interfaces/código, ejecutaron comandos de Claude ni instalaron librerías.

**Verificación:** el browser local a `/admin` actualizó el árbol accesible e incluye flujo por las cinco etapas, cuentas reales, tabla/solicitudes. ESLint, 7 suites/60 tests, `check:ui` (48 módulos), build Vite (108 módulos) pasan. No se obtuvo captura para inspección de composición; por eso la auditoría visual de pantalla no se da por aprobada. Responsive de 1280/768/375 y tema Light quedan pendientes de comparación visual.

### R-H51 — Admin: navegación accesible y actividad trazable — 2026-10-01

**Hallazgo:** el usuario reportó que el panel izquierdo no llegaba hasta las opciones inferiores. El render de `/admin/actividad` también mostraba “Página en construcción”, aunque iniciar revisión ya persiste `REQUEST_REVIEW_STARTED`.

**Cambio:** el sidebar de escritorio conserva su posición y obtiene scroll vertical interno si el contenido supera el alto disponible; el scroll de página no deja enlaces/logout fuera de alcance. En móvil sigue en flujo normal con lista horizontal. `/admin/actividad` consulta `activityLog`, ordena eventos por fecha reciente, muestra actor, cambio de etapa y un enlace al detalle de la solicitud. El detalle permite abrir el historial ya filtrado por solicitud. Estados loading/error/empty son explícitos; el log demo está vacío, por lo que no se inventan eventos. No se agregaron dependencias.

**Referencia → patrón → adaptación → razón:** capturas de Admin provistas por el usuario → actividad secuencial y panel lateral completo → timeline vertical y navegación con scroll propio si hace falta → identificar quién hizo qué y asegurar que cada ruta/acción siga accesible. El dashboard sigue usando la identidad Vértice; los mocks aportan contenido funcional, no paleta/estilo. El siguiente bloque es Admin de pedidos.

**Verificación:** navegador local en `/admin/actividad` confirma el shell protegido, los siete enlaces, el mensaje vacío y la explicación sin actividad inventada. El viewport conectado esta vez usa el layout estrecho; no se ha capturado el modo desktop con sidebar interno desplazado, así que ese punto queda cubierto por la regla CSS, aún pendiente de verificación renderizada. Responsive 375/768 y tema Light completos siguen pendientes. Pasaron 9 suites / 66 tests, ESLint, `check:ui` (48 módulos), build Vite (110 módulos) y `git diff --check`. Se ejecutaron binarios locales del proyecto con Node empaquetado porque el `npm` global del host apunta a un `npm-cli.js` que no existe.

### R-H52 — Admin: superficie orgánica y flujo de pedidos — 2026-10-01

**Feedback:** el usuario está satisfecho con funciones/fluidez, pero el dashboard todavía se siente cuadrado. Se acerca una exposición el martes; avanzar por slices funcionales verificables es prioritario.

**Cambio visual:** los tres KPI se reúnen en una superficie cálida con radio workbench; el panel circular usa radio asimétrico de token Vértice; la leyenda de etapas queda abierta y no se subdivide en cinco cajas. Solo las superficies principales toman forma. Conteos y funciones previas se preservan.

**Pedidos:** `/admin/pedidos` muestra los ocho registros actuales con búsqueda por ID/cliente/correo/pieza/material y filtros Todos, En producción, Entregados, Cerrados y Por aclarar. Los IDs del dashboard enlazan al detalle. `/admin/pedidos/:id` asocia cliente, productos, líneas, flujo, fechas y desglose de montos del origen. Estados no reconocidos se explican sin recodificarlos. Es de solo lectura; no ofrece cambio de etapa ni confirma pagos. Transiciones condicionadas a definir actor, conflicto y evento auditado.

**Fuente → patrón → adaptación → razón:** capturas funcionales de Admin suministradas por el usuario → resumen/etapa/registro y tarea identificable → contenido aprovechado sin copiar estética; radios existentes `--radius-workbench` y `--radius-panel` → más personalidad sin poner cada sección en su propia caja. No se añadieron dependencias.

**Verificación:** el navegador conectado recorrió Admin → Pedidos → pedido o8; confirmó los ocho renglones, relación con Engranaje funcional 60T/PETG, etapa “Listo”, ₡6 800 registrado y la nota de que el dato no confirma pago. No se obtuvo screenshot; composición visual desktop/Light y scroll interno del sidebar en viewport desktop bajo siguen pendientes. Pasaron 11 suites / 73 tests, ESLint, `check:ui` (48 módulos), build Vite (114 módulos) y `git diff --check`.

### R-H53 — Admin: bandeja y ficha de catálogo — 2026-10-01

**Necesidad de operación:** localizar el modelo que pregunta una persona y comprobar sus datos de catálogo sin confundirlos con piezas físicas disponibles.

**Cambio:** `/admin/catalogo` lee `products`/`categories`, busca por texto y filtra por los valores de estado/material presentes. Cada modelo abre `/admin/catalogo/:id`, con categoría, precio publicado, colores, dimensiones, peso y duración estimada. Se conserva “ACTIVE” como valor literal del origen y no hay botón de cambio, alta o edición. `stock`/`minStock` no entran a la UI. Los datos actuales contienen `PLA Silk`, ajeno a la capacidad acordada de ASA/PLA/PETG/ABS/TPU; se presenta como revisión pendiente y no se corrige en silencio. La ficha explica producción bajo pedido.

**Decisión visual:** usar filas de densidad editorial, acento de foco lateral y superficies asimétricas con radios existentes para suavizar el panel cuadrado que incomodaba al usuario. La referencia son los tokens Vértice y el feedback del usuario, no una plantilla Stitch.

**Límite y siguiente decisión:** las rutas actuales de alta/edición siguen cerradas. Falta acordar transición/publicación de producto y carga/gestión de fotos antes de escribir `products` o tocar `images`.

**Verificación:** Jest de la bandeja, filtros, categoría, material fuera de capacidad e inventario excluido, además del servicio de lectura. Inspección en navegador estrecho detectó que los paths demo `/products/*.jpg` no existen en `public`; el componente ahora sustituye fotos que fallan por “Sin foto”. La bandeja y ficha se volvieron a inspeccionar en el navegador estrecho después del fallback. No se declara aprobación visual general; faltan escritorio, tema Light y otros breakpoints.

### R-H54 — Admin: radios efectivos en dashboard móvil — 2026-10-01

**Hallazgo visual:** el usuario seguía viendo superficies cuadradas. La inspección del viewport estrecho confirmó que la regla móvil asignaba `--radius-card` (6px) al carril KPI. Además, el valor `--radius-panel` (cuatro valores) estaba compuesto como si fuera un único valor de esquina dentro del shorthand `border-radius`; el navegador descartaba toda la declaración de `/admin` y fichas de Admin afectadas.

**Cambio:** carril KPI móvil usa `--radius-workbench`; distribución por etapa, pedido y superficies grandes de catálogo usan longhand por esquina con `--radius-workbench` + `--radius-control`. Esto aplica radios válidos en Dark/Light y todos los breakpoints. Los separadores de datos permanecen abiertos.

**Verificación:** captura conectada de `/admin` a viewport estrecho Dark después del cambio muestra curva amplia en el carril KPI y panel de etapas; la captura de ficha Catálogo también confirma la superficie de fallback y especificaciones. Falta revisión en 375/768/1280, tema Light y aprobación humana. Sin dependencias.

### R-H55 — Atmósfera del dashboard Admin — 2026-10-01

**Feedback:** el usuario aprobó el diseño general del resumen y pidió dejar de repetir fondos secos y sin vida.

**Cambio:** sin tocar la distribución ni las métricas, el lienzo del dashboard incorpora veladuras cálidas y una retícula amplia de baja intensidad; el título tiene luz localizada, el carril KPI gana variación tonal y el panel de etapas una geometría circular grabada detrás de los datos. La cola de solicitudes recibe una luz tenue localizada. Contraste alto apaga las texturas; no hay animación ni dependencia.

**Fuente → patrón → adaptación → razón:** [Codrops — background-blend-mode](https://tympanus.net/codrops/css_reference/background-blend-mode/) → profundidad por composición de capas → gradientes y trazos generados en CSS con tokens de Vértice, variando escala e intensidad por tarea → crear una atmósfera de banco de trabajo y dejar la información legible. No se usa Stitch como dirección visual ni se copia su estética.

**Verificación:** navegador conectado `/admin`, viewport estrecho Dark: el lienzo y el panel de distribución muestran capas visibles; las métricas y el orden de lectura permanecen intactos en el árbol accesible. Pendiente: Light, 375/768/1280 y revisión visual humana.

### R-H56 — Extensión de identidad Admin y estados comprensibles — 2026-10-01

**Feedback auditado:** la atmósfera de R-H55 quedó confinada al resumen; en
Pedidos la barra de grupos parecía una hilera recortada de tabs; en Solicitudes
el panel volvió a sentirse cuadrado y el rótulo “Por aclarar” no explicaba el
contenido. El usuario aclara que su feedback se debe propagar a elementos
equivalentes de las otras pantallas.

**Cambio:** se extiende la luz ambiental al canvas compartido Admin y se matiza el
sidebar. Pedidos mantiene la función de filtro pero sus controles ahora tienen
forma de cápsula, conteos contenidos y estado seleccionado cálido; se envuelven
en el ancho estrecho y reservan scroll horizontal a móvil. Solicitudes recibe
tratamiento tonal de mapa/bandeja, radios asimétricos y anillos técnicos detrás
del contenido. “Por aclarar” pasa a “Estado no reconocido” en Pedidos,
Solicitudes y el resumen. La explicación dice que el valor recibido no pertenece
a las etapas configuradas y se conserva separado, sin modificar métricas.

**Verificación:** navegador conectado a 818 px Dark mostró la nueva barra de
Pedidos en dos filas, los conteos y estado activo visibles; la bandeja de
Solicitudes mostró superficies con radios amplios y explicación legible del
estado `SUBMITTED`. El árbol accesible mantiene los filtros y registros. Build,
lint, `check:ui` (48 módulos) y `git diff --check` pasan. No se ejecutó la suite
de tests. Light y 375/768/1280 siguen pendientes.

### R-H57 — Ambiente transversal y cierre de brecha CRUD — 2026-10-01

**Feedback:** el usuario describe la cualidad que busca como «la atmósfera, el
ambiente» y no quiere rutas secas o vacías. También encontró CRUDs esenciales
ausentes aunque figuren en el alcance Must.

**Criterio transversal:** `docs/04` formaliza ambiente con intención en todas las
rutas: canvas/capas, superficies y foco local con tratamiento distinto por tarea;
no repetir una misma retícula/halo en todas las páginas. Se audita la página
completa y sus estados y breakpoints, conservando contraste y movimiento reducido.

**Causa del CRUD faltante:** `01` declaraba «CRUD principal», `ANTEPROYECTO_FINAL`
concretaba productos/categorías, pero `06/07/10` detenían ambas escrituras junto
con upload de fotos y transiciones de pedidos. El acoplamiento trasladó una
dependencia de medios a funciones de catálogo que sí podían realizarse con el
modelo y JSON Server disponibles. `01/02/03/06/07/10` separan ahora CRUD de
productos/categorías, archivo histórico de pedidos, datos personales y storage.

**Implementación:** rutas declaradas `/admin/catalogo/nuevo`,
`/admin/catalogo/:id/editar` y `/admin/catalogo/categorias` dejan de caer en
construcción. Productos se crean/editan con campos del contrato, categorías se
crean/editan/eliminan si no están en uso, y un producto se oculta cuando conserva
referencias en pedidos. Las mutaciones viven en el servicio. Las imágenes
existentes se preservan, las nuevas quedan vacías, y nunca se serializa stock.

La auditoría transversal también detectó que `CartItem` limitaba cantidad y
deshabilitaba la compra a partir de `product.stock`, y `ProductCard` podía inferir
“En stock/Sin stock”. Se retiró esa inferencia: el carrito valida cantidad mínima
y el catálogo solo puede comunicar `Bajo pedido`; estado `ACTIVE` es publicación.

**Verificación:** ESLint, 13 suites / 83 tests, `check:ui` (48 módulos), build
(119 módulos) y `git diff --check` pasan mediante binarios locales, porque el
launcher npm global del host sigue apuntando a un `npm-cli.js` inexistente. La
suite cubre REST de alta/edición/baja y protege la lista contra los nuevos
enlaces de gestión. Falta recorrer create/edit/category/remove en navegador,
probar el bloqueo real con referencias, y revisar Responsive/Light; no se declara
aprobación visual.

### R-H60 — Registros de Pedidos/Clientes y editor de Categorías — 2026-10-02

**Feedback:** las listas de Pedidos y Clientes seguían sintiéndose antiguas y
sin una gramática visual compartida con el Resumen; editar categoría reutilizaba
el formulario de alta, sin contexto ni una señal clara del resultado. El aviso
de la captura no explicaba el estado de la solicitud que quedaba fuera del flujo.

**Cambio:** Pedidos recibe un registro de producción delimitado con filtros,
conteo y tabla legible en escritorio; hasta 760 px cada fila se convierte en una
ficha con nombre accesible por campo. Clientes usa otra composición de registro:
monograma derivado del nombre, estado real y conteos de pedidos/solicitudes. No
se añaden datos personales ni de negocio. La categoría se edita debajo de su
propia fila, con alta separada, preview del slug y conteo de modelos enlazados.
El aviso denomina la anomalía como registro fuera del flujo, explica que
`SUBMITTED` es un valor anterior y exige revisar la ficha; no lo convierte ni lo
suma como etapa actual. Además, el layout de la leyenda del resumen ahora
responde al ancho disponible en vez de imponer cinco columnas.

**Evidencia visual:** screenshots del navegador local en `/admin`,
`/admin/pedidos`, `/admin/clientes` y `/admin/catalogo/categorias` confirmaron
el aviso explicativo, el registro de Pedidos, la jerarquía propia de Clientes y
el editor contextual abierto sin guardar cambios. En `/admin` se confirmó que
la leyenda se reordena en tres columnas y segunda fila, sin superposición, en el
viewport conectado. Las anotaciones y acciones expuestas se mantienen legibles
en el árbol accesible observado. La Activity no se recorrió por decisión del
usuario. Esto es evidencia visual local, no aprobación humana ni CI verde.

### R-H61 — Pasada comparativa de Clientes y Pedidos — 2026-10-02

**Revisión real:** se capturaron `/admin/clientes` y `/admin/pedidos` al mismo
ancho integrado (~1166 px). Ambas vistas conservan sidebar, encabezado, lenguaje
de tipografía, acento Lava, superficies cálidas y radios Vértice. Clientes se
lee como registro de cuentas con búsqueda, estado y conteos; Pedidos como mesa
de producción con filtros de etapa y tabla de fechas/importes. La gramática está
unificada y las composiciones no son copia-pega. No encontré un defecto visual
que justificara retocar esas dos vistas en este corte; se preservó el trabajo.

El intento de viewport 768 px no alteró el tamaño real del documento (`innerWidth`
siguió en 1166); por eso 768/375 y Light quedan pendientes, no verificados. No se
tocaron datos ni Activity. La regla de screenshots tras cada iteración queda
permanente en `docs/04`, R-H61 y en el contexto del proyecto.

### R-H62 — Tema Light, navbar y fotografías del catálogo — 2026-10-02

**Revisión visual real:** con la sesión académica local se inspeccionaron en
Light `/admin/clientes` y `/admin/catalogo/categorias`, además de `/catalogo`,
al ancho integrado de aproximadamente 1166 px. Clientes y Categorías conservaron
contraste, jerarquía y lectura de sus registros; no se justificó un retoque
visual adicional. El catálogo mostró las nuevas fotografías que sí coinciden
con los productos cargados.

**Corrección puntual:** en Home, el navbar se encimaba cerca de 1166 px porque
la variante compacta solo se activaba hasta 1120 px. Se amplió ese rango hasta
1220 px; una captura posterior en el mismo ancho confirmó la navegación y las
acciones separadas, sin solapamiento.

**Imágenes:** se vincularon en `db.json` las fotos correspondientes para
organizador (p1), dragón (p3), maceta (p4), engranaje (p5) y llavero (p6), usando
archivos reales de `public/images`. El soporte para audífonos (p2) conserva su
fallback: las fotos nuevas de soporte para laptop y celular no representan ese
producto. No se asignó una imagen engañosa.

**Límite y verificación:** el navegador conectado no expone control de viewport;
por tanto 768/375 px siguen pendientes de inspección renderizada y no se declara
cierre responsive. En el ancho disponible, ESLint, 18 suites/96 tests,
`check:ui` (48 módulos), build (133 módulos) y `git diff --check` pasan. No se
guardaron datos durante la verificación. Activity sigue fuera de alcance por
decisión del usuario. La preferencia por DeepSeek de pago y por automatizar la
cotización sin revisión humana obligatoria se registró como objetivo a evaluar
en `docs/07`; no es una integración ni promesa actual.

### R-H63 — Productos aportados y animación de listas Admin — 2026-10-02

**Corrección del alcance:** antes solo se habían sustituido fotos en cinco
fichas; no se había convertido el resto de las imágenes en productos. Se
añadieron 19 borradores (`p7`–`p25`) a `db.json`, cada uno con una foto existente
de `public/images/`. Permanecen fuera de la tienda; no se inventaron precio,
material ni especificaciones. Admin los identifica como borradores y bloquea la
publicación hasta completar nombre, slug, categoría, precio y material FDM
permitido. Placeholders temporales no se incorporaron. Las seis fichas activas
anteriores permanecen publicadas.

**Motion:** se restauró la entrada breve y escalonada para las filas de Clientes
y Categorías, usando `admin-row-enter` y `--row-index`; respeta la preferencia
compartida `data-motion="reduced"` y `prefers-reduced-motion: reduce`.

**Evidencia:** en navegador Light al ancho integrado (~1166 px) se inspeccionaron
`/admin/clientes`, `/admin/catalogo/categorias` y `/admin/catalogo`. En la captura
de Categorías se ve la secuencia de entrada; Catálogo muestra 25 registros (6
publicados, 19 borradores) y las fotos cargadas en Admin. No se publicó ningún
producto ni se alteraron otros datos. Responsive a 768/375 px y completar las
fichas con información comercial/técnica real siguen pendientes. Activity
continúa fuera del alcance por decisión del usuario.

### R-H64 — Fotografía encajada dentro de la tarjeta de Tienda — 2026-10-02

**Hallazgo visual confirmado:** la foto del engranaje aparecía insetada con
márgenes sobre una superficie clara de la tarjeta. El fondo oscuro rectangular
de la fotografía parecía otro recuadro dentro de la tarjeta y cortaba la
composición.

**Causa y corrección:** el componente compartido daba a `.v-product-image`
30 px de padding y 230 px de alto fijo; en Tienda la foto quedaba reducida y
aislada dentro del plano claro. La grilla de Tienda ahora presenta un escenario
oscuro a sangre, con proporción 1.8:1, sin padding ni máscara radial. Se usa
`object-fit: contain` para conservar las piezas completas aunque las fuentes
varíen de formato. Home y Admin no cambian.

**Evidencia:** capturas reales de `/catalogo` en Light y Dark (~1150 px): el
escenario oscuro ocupa el ancho de la tarjeta, sin otra superficie clara que
encuadre la foto. El engranaje llega a los bordes laterales; llavero y maceta
quedan completos y contenidos. No se probaron 768/375 px porque el navegador
conectado no permite controlar ese viewport.

### R-H65 — Tarjetas de tienda, recorte al hover y borradores accionables (2026-10-01)

**Hallazgo confirmado por anotación y código:** `ProductCard` aplica un zoom
`scale(1.06)` al pasar el cursor. Aunque la imagen se dibuja con
`object-fit: contain`, el escenario de Tienda tiene `overflow: hidden`. El
navegador midió la caja cuadrada del `<img>` en 338×338 dentro de un escenario
338×187, incluso sin hover: `object-fit` no corrige el desborde de la caja. Al
pasar el cursor, la regla compartida `scale(1.06)` agregaba otro recorte. La
fuente del llavero es 1024×1024 y muestra el objeto entero; el asset no era la
causa.

**Cambio:** la caja de la foto ahora cubre exactamente su escenario; `contain`
reduce la imagen cuadrada para conservarla completa y se anula el zoom
únicamente en las tarjetas de `/catalogo`, sin quitar la respuesta visual
compartida de la tarjeta. Admin deja de tener el
enlace naranja «Ver tienda» aislado: era redundante con el logotipo, que ya lleva
al sitio público. Sesión y cierre quedan agrupados al final del sidebar; en
móvil también aparecen en un orden explícito.

**Cambio funcional:** el aviso de borradores explica que las fichas se mantienen
fuera de la tienda hasta confirmar sus datos y enlaza a un filtro directo
«Revisar borradores». La acción filtra `estado=DRAFT`; no publica ni rellena
precio/material. Se agregó cobertura del filtro y de la ausencia del enlace
duplicado.

**Cotización investigada:** `docs/07` contiene política de automatización por
casos estándar, esquema de costos que requiere tarifas del taller, fronteras
LLM/laminador/motor y prompt inicial. El precio depende de mediciones de slice y
tarifas reales; no se añadieron importes ni se activó emisión automática. Las
fuentes enlazadas se verificaron el 2026-10-01.

**Verificación visual y técnica:** screenshots locales revisados en Light para
Tienda (~1150, 768 y 375 px), Admin Catálogo (~1150 px) y Admin Resumen
(1280, 768 y 375 px). En Tienda se comprobó que la caja de cada `<img>` coincide
con el escenario en los tres tamaños, conserva `object-fit: contain` y no recibe
transformación de zoom; a 375 px no hay desbordamiento horizontal. La forma
cuadrada de la fuente queda completa y centrada dentro del escenario ancho, por
lo que aparecen márgenes laterales: es el costo explícito de no cortar el
producto. Admin Catálogo muestra el CTA; al activarlo quedan seleccionados los
19 borradores y solo esas 19 fichas aparecen. En el sidebar del Admin no existe
el enlace duplicado «Ver tienda»; a 375 px logout sigue visible y no hay
desbordamiento horizontal. La primera captura de Admin Resumen a 768 px mostró
colisión entre etiquetas de etapa; se corrigió la leyenda de tres a dos columnas
en ese rango. El nuevo screenshot confirma etiquetas legibles, números en su
propia línea y ausencia de colisión. El shell/nav y las métricas también caben.
Esto cierra el defecto responsive detectado en el gráfico, pero no equivale a
una auditoría integral de todas las rutas Admin.

**Verificación automatizada:** ESLint, 18 suites/98 pruebas, `check:ui` (48
módulos), build (133 módulos) y `git diff --check` pasan. Cambios locales; no
se han committeado ni pusheado.

### R-H66 — Catálogo: coherencia entre fondos de foto (2026-10-02)

**Aclaración del usuario:** una anotación de imagen representa el patrón del
catálogo completo; hay que revisar todas las tarjetas relacionadas, no limitarse
al elemento seleccionado. En el catálogo hay cuatro productos con foto: el
engranaje horizontal (1024×559) y tres fuentes cuadradas (llavero, maceta y
organizador, 1024×1024). El quinto producto usa un placeholder.

**Hallazgo visual:** la caja anterior conservaba completa la fuente cuadrada,
pero dejaba ver su marco vertical dentro del escenario apaisado; el fondo negro
del escenario se leía como una tarjeta insertada y contrastaba con Light.
**Cambio:** el escenario ahora extiende el fondo de la misma foto mediante una
capa ambiental desenfocada; la imagen original se mantiene centrada, completa y
sin zoom/crop. Solo se difuminan suavemente los bordes laterales de las fuentes
cuadradas para fundir el cambio de proporción. El engranaje horizontal conserva
su composición edge-to-edge. El fallback sin imagen no crea una capa ambiental.

Se exploró outpainting de producto como alternativa, pero se descartó: una
variante alteraba divisores/herramientas del organizador. No se reemplazaron ni
modificaron los assets originales; la fidelidad del modelo tiene prioridad sobre
una edición generativa que pueda falsear la pieza.

**Verificación visual:** screenshots reales del catálogo en Light a ~1135 px,
768 px y 375 px, y Dark a 375 px y ~1135 px. Se revisaron las cuatro fotos y el
placeholder, incluida la segunda fila; el fondo deja de ser una franja negra
lisa y no se observa un marco cuadrado duro. En 375 px no hay scroll horizontal
(documento 360 px, viewport 375 px). La caja de cada fuente cuadrada es 1:1 y
coincide con la altura del escenario; se conserva `object-fit: contain`, sin
recorte ni zoom. El placeholder usa la superficie de panel y color de texto
según tema, no el falso bloque negro de foto.

**Verificación automatizada:** ESLint, 18 suites/98 tests, `check:ui` (48
módulos), build (133 módulos) y `git diff --check` pasan. Cambios locales; no
se han committeado ni pusheado.

**Cotización — alcance corregido:** la investigación/prompt de `docs/07` no era
una implementación y el usuario ya indicó que primero quiere el costeo manual,
antes del bot de IA. Ese slice está implementado abajo; no hay cotización
automática ni tarifas operativas cargadas.

### R-H67 — Cotizador manual Admin (2026-10-02)

**Cambio funcional con pasada visual real:** la ficha Admin sustituye el monto
libre por una hoja de costeo manual FDM, con unidades explícitas y desglose
previo. No crea tarifas de ejemplo ni modifica el catálogo/demo.

**Hallazgo Light:** la primera captura mostró que el selector/campos aún tenían
fondo oscuro en el panel claro. Se invirtieron los tokens de superficie/texto de
entrada para Light y se recapturó; controles y texto ya contrastan con la
superficie. Dark se comprobó también en la misma ficha. Capturas reales a
1265×633: no se ingresaron cifras ni se guardó una oferta ficticia.

**Cobertura visual pendiente:** no se capturaron viewports estrechos 768/375; el
CSS cambia a dos columnas <=900 px y una columna <=760 px, pero la pasada
responsive queda pendiente. Tampoco se probó aún con datos tarifarios reales ni
se guardó/publicó un cálculo contra el API real. La suite automatizada cubre la
aritmética y el recálculo/validación de la acción.

**Verificación local de código:** ESLint, 19 suites/101 tests, `check:ui` (48
módulos), build (134 módulos) y `git diff --check` pasan. No hay tarifas reales
del taller ni credencial BCCR/DeepSeek añadida.

### R-H68 — Envío de cotización al cliente y copia al taller (2026-10-02)

**Cambio:** desde `QUOTED`, Admin presenta al cliente como destinatario y al
administrador autenticado como copia oculta. La acción envía el desglose guardado
por un webhook n8n privado (token solo de servidor) y Gmail; el envío confirmado
mueve a `AWAITING_APPROVAL` y escribe el evento. Un error/configuración ausente
mantiene `QUOTED`. Destinatarios inválidos o de muestra se bloquean. Se añadió
workflow importable, `.env.example` y carga de `.env` solo para el API local.

**Criterio visual:** CTA único “Enviar al cliente y copiarme”, direcciones
visibles antes de enviar y explicación cuando el fixture `example.*` lo bloquea.
Conservar el lenguaje y la densidad de la hoja de costeo; no simular conectividad.

**Pendiente de verificación/cierre:** capturas reales del CTA en Dark/Light,
probar el endpoint con n8n/Gmail configurados y correo de prueba controlado; no
usar las direcciones `example.*`. No se han transmitido correos. Responsive
375/768 pendiente si el navegador no permite fijar viewport.

### R-H69 — Cotizador DEMO, tres asistentes y última pasada Admin (2026-10-02)

El flujo se extiende con cálculo reproducible desde perfiles análogos basados en
los assets de producto conocidos, cuenta de cliente, aprobación por versión,
fulfillment `DEMO` explícito, transición serializada de pedidos y tres contextos
de asistente. Esta simulación no mide archivos, confirma stock/pago ni habilita
producción. Se añadió además el workflow independiente de tasas de Hacienda y
ARESEP, con sustitución de DEMO solo ante dato reciente y selección exacta.

La revisión visual guardó capturas en `automation/evidence/`: Clientes
1280×930 Dark/Light, 768 Light y 375 Dark; Pedidos 1280/768 Light y 375 Light;
Categorías 375 Dark/Light y 768 Light; Cotización 768 Light y vista pública
1280 Light; más los cortes finales Resumen/Pedidos/R5 a 375 Light. La vista
1280 de `/solicitud` después del ajuste confirmó navegación sin choque, perfiles
cargados y tema claro completo. Se recorrieron en móvil Resumen, Pedidos,
Solicitudes, detalle cotizado R5, Catálogo, Categorías y Clientes; se recorrieron
roles, versiones, duplicados, cierre/cancelación e idempotencia en la integración.
No se pudo certificar el proveedor real de DeepSeek o la entrega real de Gmail:
el check usa proveedores simulados y los workflows requieren importación y
publicación en n8n. Activity continúa en el bloque que el usuario reservó.

## Corrección de recorridos y referencias — 2026-10-02

Defectos confirmados en React: mezcla de intenciones/DEMO con archivo no recibido, chat modal que cubría la tarea y dropdown largo sin búsqueda, repetido en Admin. Corregidos. Evidencia de navegador: diseño Dark en 1280/768/375, diseño Light en 375, archivo Light en 375 y selector Admin Light en 1280 con búsqueda soporte. Chat integrado sin dialog; diseño móvil sin overflow horizontal (375 de viewport/360 de contenido). No se verificó en esta pasada todo Admin móvil ni Gmail/n8n real. No se reaudita HF-01.

## R-H71 — Intake de cotización y copiloto Admin independiente — 2026-10-03

El usuario pidió explícitamente que el copiloto administrativo no reutilice el
chat flotante de Home ni parezca otra ventana emergente. La pantalla se separó
en `/admin/asistente`: encabezado de tarea, rail de alcance/permisos y área de
conversación de solo lectura. El widget flotante público no ofrece `mode: admin`.
La ayuda de cotización se mantiene integrada en su página, junto a un resumen
editable y el control para adjuntar referencias; no es una cotización automática.

**Evidencia visual disponible:** captura del navegador real en Light, ancho
aproximado 720 px, en `/solicitud/ayuda-diseno`. Se vieron el chat integrado,
el compositor y el inicio del formulario; el árbol accesible confirmó resumen,
medidas, material, cantidad, adjuntos y confirmación. No se observó overflow
horizontal en el viewport visible. No equivale a recorrer el formulario completo
ni confirma 375/768/1280. El CTA de revisión/foco fue añadido después de esa
captura y no quedó inspeccionado visualmente en navegador.

**Admin pendiente:** la navegación real a `/admin/asistente` en el mismo origen
`127.0.0.1:5174` redirigió a `/login`; por ello no hay captura del nuevo copiloto
ni del cotizador por producto en esta sesión. CSS/JSX confirman que son
superficies propias, pero eso es evidencia estática, no aprobación visual. No se
leyó ni alteró el token para recuperar acceso. Retomar tras iniciar sesión en
ese mismo origen y revisar Dark/Light, 1280/768/375, incluida la navegación Admin.

## R-H72 — Regresión de cotización y Admin — 2026-10-03

En una sesión anónima limpia de localhost:5174, viewport aproximado 1265×710,
el formulario mantiene la conversación y la ficha editable en paralelo. Probé
con una pieza inocua: Enter con «prepará el resumen» creó un borrador local, sin
enviar ni llamar al agente; un segundo mensaje con largo, ancho, cantidad y PETG
actualizó las casillas correctas y dejó la solicitud sin enviar. La primera
prueba reveló que «para revisarlo» contaminaba el nombre; se corrigió y el
recorrido repetido mostró el nombre limpio. Solo se inspeccionó esta anchura y
la apariencia que devolvió esa sesión; no equivale a una matriz 375/768/1280.

La siguiente consulta live de orientación de materiales reveló que el proceso
`npm run api` activo todavía servía lógica anterior: la UI mostró literalmente
«Agent stopped due to max iterations» como respuesta. El runtime local se
actualizó para detectar esa salida y usar la guía controlada, pero la instancia
activa no se reinició ni se volvió a verificar; el resultado correcto en
navegador sigue pendiente. No se envió solicitud ni correo.

Admin: código y tests confirman que `/admin/asistente` usa una página propia y no
`AssistantPanel`/widget público. No hubo sesión Admin en el origen del navegador
para inspeccionar el render real, así que el diseño no se declara aprobado
visualmente. Se requiere inicio de sesión válido en el mismo origen y capturas
Light/Dark en 1280/768/375. Tampoco se inspeccionó visualmente el CTA «Cotizar
DEMO» de las filas del catálogo.
