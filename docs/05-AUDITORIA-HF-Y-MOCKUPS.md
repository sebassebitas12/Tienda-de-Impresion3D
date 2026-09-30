# Vértice CR — Auditoría HF y mockups

> Última actualización: **2026-09-30**.

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
