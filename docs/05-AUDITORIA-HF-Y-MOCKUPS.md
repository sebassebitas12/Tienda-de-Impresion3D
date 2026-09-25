# Vértice CR — Auditoría HF y mockups

## Referencia

Auditoría global del 2026-09-24 sobre mockups de mockups/HFcompletos. Commit de referencia: ee144ce.

React continúa bloqueado hasta cerrar los bloqueos.

## Fuentes externas y repositorios de referencia

Revisión documental realizada el 2026-09-25:

- No se encontraron URLs externas ni enlaces Markdown a repositorios de referencia en los documentos del proyecto.
- Sí existen menciones textuales a Stitch, UXMagic, Gemini y GitHub, pero no son enlaces verificables.
- `http://localhost:3001` aparece como URL de desarrollo local del mock backend; no es una fuente visual ni un repositorio externo.
- Los enlaces oficiales de referencia quedan pendientes de recibir para agregarlos aquí sin inventar destinos.

> Nota de continuidad: el bloque preliminar anterior registra el estado antes de recibir los enlaces. El estado vigente y la biblioteca completa estan en la seccion siguiente.

## Biblioteca de referencias para agentes y diseno

Esta seccion actualiza la nota preliminar anterior: las URLs proporcionadas por el usuario ya fueron registradas y analizadas como referencias externas.

Actualizacion 2026-09-25. Estas fuentes son referencias de investigacion y herramientas potenciales. No son contratos visuales ni autorizan copiar una interfaz completa. Las ideas que se adopten deben pasar por los tokens de Vertice CR, accesibilidad, rendimiento y revision humana.

### Skills, criterio visual y vibe coding

- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill): skills portables para anti-slop, analisis de diseno, image-to-code y rediseno de proyectos existentes. Util para preparar briefs y auditorias visuales.
- [senlindesign/taste-skill](https://github.com/senlindesign/taste-skill): extraccion de Design DNA desde sitios, con tokens y razones de diseno. Util para estudiar referencias concretas sin copiar solo valores aislados.
- [emilkowalski/skills](https://github.com/emilkowalski/skills): criterio para animacion, revision de motion, oportunidades de animacion y seleccion de componentes. Util para el hero y microinteracciones.
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable): flujo de init, shape, critique, audit, animate, polish y live browser. Util como checklist de revision antes de congelar una pantalla.
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): generacion de sistemas de diseno y recomendaciones de estilos, colores, tipografia y patrones. Util como exploracion inicial, no como autoridad sobre Vertice.
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md): coleccion de `DESIGN.md` de marcas reales. Util para comparar como expresar tokens y reglas que un agente pueda leer.
- [google-labs-code/design.md](https://github.com/google-labs-code/design.md): especificacion y CLI para un `DESIGN.md` con tokens, rationale, componentes y lint de contraste. Util cuando se desbloquee el Design System; no crear todavia un archivo paralelo mientras React siga bloqueado.

### Texto, comprension del repositorio y control de calidad

- [blader/humanizer](https://github.com/blader/humanizer): revision de prosa con apariencia generada por IA. Usarlo solo para textos, documentacion y microcopy; nunca para codigo, datos o reglas de negocio.
- [offline2k-coder/stop-slob](https://github.com/offline2k-coder/stop-slob): patrones y frases a evitar en prosa generada.
- [hardikpandya/stop-slop](https://github.com/hardikpandya/stop-slop): skill de limpieza de senales de escritura de IA. Usarlo como revision opcional y no como filtro automatico de contenido del producto.
- [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything): grafo interactivo para explorar codigo, relaciones y dependencias. Util cuando el repositorio crezca; no sustituye la lectura de AGENTS, AI_CONTEXT ni los documentos de dominio.

### Inspiracion visual y patrones de producto

- [Godly Design](https://godly.design/): galeria curada de sitios, hero, CTA y otros patrones visuales. Util para comparar composicion y direccion de arte.
- [Awwwards](https://www.awwwards.com/): referencia de direccion visual y sitios destacados. Usarlo para estudiar ideas, no para perseguir efectos por moda.
- [Mobbin](https://mobbin.com/): patrones y flujos reales de apps y web. Util para catalogo, carrito, checkout, cuenta y responsive.
- [Refero Styles](https://styles.refero.design/): biblioteca de estilos y `DESIGN.md` legibles por IA. Util para contrastar sistemas existentes y estudiar referencias industriales o editoriales.

### Componentes, motion y 3D

- [React Bits](https://reactbits.dev/): componentes animados para React. Revisar licencia, dependencia y accesibilidad antes de adaptar cualquier pieza despues del gate de React.
- [Skiper UI](https://skiper-ui.com/): componentes y patrones para shadcn/ui, con ejemplos de image reveal, cursor trail y dynamic island. Util para prototipos posteriores, no para el HTML actual.
- [Spline](https://spline.design/): escenas 3D interactivas, materiales, estados, eventos y particulas. El uso potencial queda limitado a HF-03/HF-05; HF-01 conserva fotografia e interactividad ligera.
- [GSAP](https://gsap.com/): animacion profesional de UI, SVG, texto y scroll. Evaluarlo solo cuando CSS/JS nativo no sea suficiente y exista una necesidad concreta de secuenciacion o rendimiento.

### Como se usaran en este proyecto

1. Investigar: elegir 2-3 referencias por pantalla y anotar que problema resuelve cada una.
2. Extraer: convertir solo las decisiones utiles a tokens, componentes y reglas propias de Vertice CR.
3. Prototipar: probar una variante localizada en el mockup o componente correspondiente.
4. Auditar: revisar negocio, jerarquia, accesibilidad, responsive, reduced motion, rendimiento y coherencia con Obsidian Precision Forge + Lava Organica.
5. Congelar: documentar la decision aprobada antes de llevarla a React.

### Limites de uso

- No copiar paginas completas, branding, textos, imagenes o codigo sin revisar licencia y atribucion.
- No instalar skills, CLI, paquetes ni plugins automaticamente.
- No introducir React, WebGL, Spline o GSAP en HF-01 solo porque una referencia los use.
- No permitir que una herramienta de diseno invente precios, metricas, endpoints, estados o capacidades.

## HF-01 — rediseño reabierto por decisión del usuario — 2026-09-25

La conversación de continuidad solicita rehacer el Home porque la primera exploración se percibía demasiado cuadrada y demasiado cercana a un cyberpunk genérico. Por eso HF-01 vuelve a exploración visual controlada: conserva la fotografía real, el visor de piezas, el callout técnico y la separación entre catálogo y cotización, pero se ajustan composición, radios, jerarquía de motion, responsive y controles táctiles.

La regla de negocio no cambia: Home no muestra precios ni convierte una solicitud pendiente en producto comprado. Esta iteración tampoco incorpora WebGL, Spline, dependencias nuevas ni assets externos; cualquier referencia de la biblioteca se usa como criterio de análisis, no como copia.

### Resultado de la reconstrucción desde cero

`mockups/hf-01-home.html` fue reemplazado por una composición nueva de laboratorio editorial: hero asimétrico, producto como protagonista, motion reducido a escaneo + tilt sutil, tarjetas de catálogo estables y una narrativa de método/precisión antes de la cotización. Las referencias externas guiaron la composición, los tokens, el ritmo de interacción, la accesibilidad y la crítica visual; no se copiaron páginas, assets ni dependencias.

La validación actual es estática y de build: JavaScript parseable, `vite build` correcto, assets locales existentes, cuatro piezas interactivas, seis tarjetas, responsive en tres cortes y ausencia de precios/WebGL en el Home. Falta todavía la comprobación visual manual en navegador a 375px, 768px y desktop.

### Interacciones añadidas — 2026-09-25

- El hero responde al puntero con inclinación, parallax mínimo, foco radial y desplazamiento independiente del callout; `prefers-reduced-motion` deja la composición estática.
- El navbar recupera un menú plegable de cuenta con `/login`, `/registro`, `/cuenta`, `/carrito` y `/solicitud`, usando únicamente rutas contempladas por el alcance/documentación.
- El menú tiene cierre por selección, clic fuera y tecla `Escape`, además de `aria-expanded`, `aria-controls` y targets táctiles de 44px.

### Criterios de cierre de esta iteración

- Hero con una silueta más editorial y técnica: menos contenedores decorativos, acento vertical, visor con retícula discreta y CTA con geometría controlada.
- Scanner y callout como lenguaje de estado; el producto sigue siendo el foco y la animación no debe competir con él.
- Riel de piezas y controles de navegación con áreas táctiles de al menos 44px.
- Hero adaptable a desktop, tablet y móvil; en móvil el riel pasa a una tira horizontal.
- Badges de material y disponibilidad separados en las tarjetas para que no se solapen ni recorten el texto.

## Auditoria ChatGPT — HF-01 Home

Fecha: 2026-09-25
Alcance: `mockups/hf-01-home.html`, documentacion visual vigente y biblioteca de referencias externa.
Tipo: auditoria heuristica de producto, frontend y direccion visual. No sustituye una prueba con usuarios ni una medicion real en navegador.

### Veredicto

La direccion **Obsidian Precision Forge + Lava Organica** es consistente y tiene personalidad. El hero ya comunica manufactura tecnica mediante fotografia, callout, scanner y ficha de pieza. La pantalla puede seguir usandose como referencia visual, pero debe pasar por un cierre tecnico antes de llamarse congelada para implementacion.

### Lo que funciona

- La fotografia es el foco y no se reincorpora el overlay CAD ficticio.
- El callout contextual cambia junto con la pieza activa y ahora incluye un pulso de datos controlado.
- La paleta naranja sobre obsidiana es reconocible sin depender de gradientes neon.
- La ficha tecnica flotante mejora la lectura sin convertir la fotografia en una tarjeta de producto.
- `prefers-reduced-motion` esta contemplado en CSS y en la logica JavaScript del hero.
- El mockup conserva la separacion entre producto visual y cotizacion: Home no muestra precios.

### Hallazgos prioritarios

| Prioridad | Hallazgo | Riesgo | Accion recomendada |
|---|---|---|---|
| P0 | El layout del hero necesita validacion real en 375px/768px después de incorporar sus breakpoints. | Sin prueba visual pueden quedar saltos de altura, recortes o lectura rota. | Revisar el mockup en navegador en 375px, 768px y desktop antes del gate de React. |
| P0 | Tema, menu y flechas del riel ya tienen area base de 44x44px. | Falta comprobar el target en navegador y con zoom/texto ampliado. | Mantener el area tactil y validar foco, orden de tabulacion y contraste. |
| P1 | La geometria de hero se decidio en `--radius-hero: 24px` y ya fue sincronizada con el documento visual. | Un cambio posterior sin token puede volver a fragmentar la fuente de verdad. | Usar el token; no fijar radios aislados en componentes nuevos. |
| P1 | Hay varias animaciones simultaneas: laser, badge, pulso de linea, pulso de punto, crosshair y tilt. | El hero puede sentirse mas cyberpunk que industrial y competir con el producto. | Mantener una animacion primaria de escaneo, una secundaria de callout y dejar el resto estatico o mas lento. |
| P1 | Las imagenes del hero y las miniaturas no declaran estrategia de carga ni dimensiones explicitas. | LCP y layout shift pueden empeorar al pasar a produccion. | Hero principal con prioridad y dimensiones; contenido bajo el pliegue con lazy loading cuando aplique. |
| P2 | Los iconos de los pilares usan caracteres de texto/emoji. | Inconsistencia de rendering entre plataformas y menor control de marca. | Sustituir por SVG consistente antes de implementar el Design System. |
| P2 | Los CTAs usan geometria mixta: capsula en el hero, control tecnico redondeado en navbar y otros botones compactos. | La jerarquia de acciones puede sentirse accidental. | Definir variantes explicitas: `primary`, `secondary`, `technical` y `icon-control`. |

### Auditoria de accesibilidad y estados

- Bien: existe `:focus-visible`, `aria-label` en controles de icono, `aria-selected` en el riel y texto alternativo en fotografias.
- Pendiente: comprobar contraste real en Dark y Light, especialmente texto muted, badge `ESCANEANDO`, ficha tecnica y boton primario.
- Pendiente: validar teclado completo del riel, incluyendo flechas, orden de tabulacion y estado activo visible.
- Pendiente: verificar que el contenido inferior no se solape al aumentar el texto al 200%.
- El estado `ESCANEANDO` es decorativo y esta oculto a tecnologia asistiva; si en el futuro representa un estado real del sistema, debe dejar de ser solo decorativo y anunciarse textualmente.

### Como aplicar la biblioteca de referencias

- HF-01: usar [emilkowalski/skills](https://github.com/emilkowalski/skills) para revisar easing y jerarquia de motion; [Godly Design](https://godly.design/) y [Awwwards](https://www.awwwards.com/) para composicion, no para copiar efectos.
- HF-02/HF-03: usar [Mobbin](https://mobbin.com/) y [Refero Styles](https://styles.refero.design/) para filtros, catalogo, detalle, estados y responsive.
- HF-05: estudiar [Spline](https://spline.design/) solo para el visor 3D funcional reservado a esta pantalla; no trasladarlo al Home.
- Sistema transversal: usar [Impeccable](https://github.com/pbakaus/impeccable), [taste-skill](https://github.com/Leonxlnx/taste-skill) y [DESIGN.md](https://github.com/google-labs-code/design.md) como herramientas de critica y formalizacion, no como sustitutos de las decisiones de Vértice.

### Plan recomendado

1. Validar en navegador el responsive del hero para 375px, 768px y desktop.
2. Comprobar targets tactiles, foco y contraste en ambos temas.
3. Hacer una pasada de motion con una sola animacion dominante de scanner.
4. Congelar los tokens visuales y preparar el Design System despues del gate de React.

**Resultado de auditoria:** direccion visual aprobada como exploracion; implementacion y congelado tecnico pendientes de P0/P1.

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

### HF-01 — Home (Estado: exploración visual reabierta; base funcional consolidada)

La implementación final de mockups/hf-01-home.html fue revisada en navegador durante la sesión de Antigravity del 2026-09-25. El resultado coincide con la dirección visual aprobada y elimina el overlay CAD ficticio.

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

**Estado vigente:** referencia visual reabierta para cerrar responsive, targets tactiles, contraste y jerarquia de motion. La base funcional permanece consolidada y el visor WebGL/Three.js sigue reservado para HF-03/HF-05.

### HF-01 — Accesibilidad, ayuda y navegación (2026-09-25)

Se incorporó en `mockups/hf-01-home.html` el cierre transversal visible en la referencia de Home:

- Navbar con `Inicio`, `Tienda`, `Sobre nosotros`, `Contáctenos`, `Preguntas frecuentes`, cotizador y menú de cuenta.
- Botón flotante de accesibilidad abajo a la derecha con tamaño de texto normal/grande/muy grande, alto contraste, reducción de movimiento y restaurar ajustes.
- Preferencias de accesibilidad persistidas localmente para conservar la elección durante la sesión del mockup.
- Botón flotante de asistencia técnica con sugerencias y campo de pregunta. En HF-01 es una superficie visual preparada; no ejecuta IA real ni inventa respuestas. La conexión pertenece al flujo técnico HF-06.
- Ambos controles tienen etiquetas ARIA, foco nativo, estados de apertura y cierre, y adaptación básica para viewport móvil.
- La microcopy evita tecnicismos: cada ajuste explica qué cambia y los estados usan `Activar`/`Activado`; el chat ofrece preguntas guía antes de pedir texto libre.
- La capa visual se refinó como parte del sistema Vértice: paneles elevados con acento Lava, tarjetas de acción numeradas, estados activos visibles y selector `ES / EN` persistente en el navbar.
- El incremento de texto escala también los paneles flotantes y sus controles; queda pendiente comprobar el comportamiento al 200% en navegador antes del cierre final.

**Estado:** implementado en mockup; pendiente de validación manual en 375/768/1280 antes de congelar Home.

### Auditoría de coherencia y cierre de HF-01 — 2026-09-25

**Veredicto:** HF-01 es coherente como guía visual del producto y debe convertirse en la fuente de verdad para el Design System, componentes y páginas React. La dirección `Obsidian Precision Forge + Lava Orgánica` se mantiene consistente en hero, navbar, cards, CTA, superficies flotantes, tema Dark/Light y estados técnicos.

**Comprobación realizada:** revisión estática del HTML/CSS/JS, cruce con la rúbrica y build de Vite exitoso. No fue posible ejecutar una inspección visual automatizada en navegador en este entorno porque no hay una superficie de navegador disponible; por eso no se registra como evidencia final de viewport ni de lector de pantalla.

**Lo que HF-01 cubre como base visual:**

- composición desktop, hero fotográfico, callout técnico, cards y CTA sin precios inventados;
- navbar de referencia con cuenta, tema, idioma y cotización;
- controles de accesibilidad visibles con texto ajustable, contraste, reduced-motion y estados no dependientes solo del color;
- asistencia técnica presentada como chatbot visual, sin simular una IA conectada;
- estructura semántica básica, nombres ARIA, foco visible y CSS responsive inicial.

**Lo que no debe darse por cerrado todavía:**

- validación real a 375, 768, 1280+ y texto al 200% con inspección visual;
- foco atrapado y retorno de foco al abrir/cerrar paneles;
- anuncio de apertura, cambios de estado y respuestas mediante `aria-live` para lector de pantalla;
- `skip link`, landmarks completos y labels explícitos en todos los formularios de producción;
- navegación completa sin mouse y pruebas con lector de pantalla real;
- sustitución de símbolos/emoji por iconos con nombre accesible y soporte de alto contraste del sistema;
- implementación React, servicios, sesión, IA y estados reales exigidos por la rúbrica.

**Decisión:** no rehacer HF-01 ni abrir otra ronda de mockup. HF-01 queda aprobado como referencia visual base con backlog de accesibilidad técnica para la implementación.

**Herramienta de continuidad:** se creó el plugin local `plugins/vertice-browser-audit`, con una skill de auditoría y un script estático. Puede usar navegador cuando la sesión exponga una pestaña conectada; mientras tanto reporta explícitamente los gaps que requieren validación real.

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

No abrir otra iteración de mockup para HF-01. Extraer sus tokens y componentes al Design System, construir el shell/Home en React y trasladar después las reglas de accesibilidad técnica —focus management, `aria-live`, lector de pantalla y texto al 200%— a la implementación real.
