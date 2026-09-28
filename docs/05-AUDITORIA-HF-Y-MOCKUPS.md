# Vértice CR — Auditoría HF y mockups

> Última actualización: **2026-09-28**.

## Referencia

Auditoría global del 2026-09-24 sobre mockups de mockups/HFcompletos. Commit de referencia: ee144ce.

React continúa bloqueado hasta cerrar los bloqueos.

## Estado

| HF | Pantalla | Estado |
|---|---|---|
| 01 | Home | 🟡 EN ITERACIÓN (Único mockup HTML en desarrollo, NO congelado) |
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

### HF-01 — Home (Estado: 🟡 EN ITERACIÓN)

La implementación de `mockups/hf-01-home.html` sigue en desarrollo y refinamiento bajo las instrucciones directas del usuario. NO está congelado ni aprobado aún.

#### Cambios consolidados
- Navbar, Hero, pilares, workflow, CTA de cotización y footer conservan la referencia oficial de Stitch/Vértice.
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
