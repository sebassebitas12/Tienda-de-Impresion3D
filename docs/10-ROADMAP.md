# Vértice CR — Roadmap

## Gate de experiencia final — R-H74 (2026-10-04)

La auditoría de docs/05 confirma cortes de continuidad y discrepancias de estados
cliente/Admin. Prioridad de cierre: preservar tarea durante auth, compartir etapas,
unificar pago catálogo/cotización evitando doble depósito y definir entrega;
después reconciliar catálogo/fichas y completar informativas. Inspección Admin
autenticada y matriz responsive/temas pendientes. Este bloque solo audita.

> **Última actualización:** 2026-10-04
> **Estado:** ACTIVO  
> **Fase actual:** 4 — Fundaciones React.  
> **React:** DESBLOQUEADO (Gate abierto 2026-09-30).

## Fase 3 — Cierre de diseño

### Objetivo

Convertir HF-01 en la referencia visual de máxima fidelidad de la Home y cerrar el contrato mínimo necesario para pasar a React sin improvisar.

### Estado actual

- HF-01: ✅ **CONGELADO** (aprobación del usuario, 2026-09-30).
- Dark/Light: definidos en `04`.
- Accesibilidad: criterios definidos en `04`.
- Referencias de diseño: consolidadas en `04`.
- Mockup HTML de referencia: `mockups/hf-01-home-definitivo.html` (congelado).
- No se crean más mockups HTML para las demás pantallas.

### Pendientes antes del gate

1. Auditoría visual profunda de HF-01.
2. Resolver bugs visuales y rupturas responsive: defectos V-01 y V-04 a V-09 registrados en `05` (V-02 y V-03 pasan a requisitos de React).
3. Cerrar navegación/header, chat y accesibilidad.
4. Verificar que la Home comunique tienda/producto, no solo dirección de arte.
5. Aprobar formalmente HF-01.

## Preflight antes de React — SUPERADO ✅ (2026-09-30)

Todos los requisitos del gate fueron cerrados antes de iniciar React:

1. **Producto/negocio:** alcance, estados y reglas cerrados en `01–02`.
2. **UX:** rutas y flujos estables en `03`.
3. **Diseño:** tokens, responsive y accesibilidad definidos en `04–05`.
4. **Arquitectura:** estructura y límites cerrados en `06`.
5. **Datos/API/auth:** contratos y normalización definidos en `07`.
6. **Testing:** estrategia preparada en `09`.
7. **Dependencias:** se instalan según necesidad documentada.
8. **Gate final:** documentación y repo alineados.

## Fase 4 — Fundaciones React

**Prioridad actual de entrega:** Auth → Admin → IA, indicada por el profesor y adoptada como orden operativo del proyecto.

Orden recomendado:

1. limpiar scaffold Vite;
2. aplicar tokens/estilos globales;
3. crear App shell/layout;
4. routing;
5. providers;
6. services/adapters y acceso a datos;
7. primitives/components compartidos;
8. Home fiel a HF-01;
9. features por flujo de negocio;
10. estados y errores;
11. tests por bloque;
12. revisión visual contra HF-01.

## Secuencia operativa de construcción React

> **Prioridad académica reajustada 2026-09-30:** el profesor indicó **Autenticación → Admin → IA**. Esta instrucción cambia el orden operativo anterior. Con pocos días disponibles, el proyecto se construye por **vertical slices funcionales** y el lenguaje visual HF-01 se integra en cada slice; no se espera a terminar toda la estética del sitio para comenzar funciones.

### Capa 0 — UI Kit ✅
Primitivas, estados base y componentes compartidos.

### Capa 1 — App Shell ✅
Layouts, routing, providers y navegación base.

### Capa 2 — Home HF-01 ✅ CERRADA PARA AVANZAR
- Hero/workbench, catálogo destacado, shell y preferencias globales ya están implementados.
- CI obligatorio activo y verde antes de cada entrega.
- El usuario considera Home suficientemente completa (2026-10-01) y pidió mover el foco a Admin. Iteraciones futuras se atenderán como correcciones puntuales, no como requisito para avanzar.
- R-H26 corregido: rail de piezas pasa a horizontal en tablet/móvil para no cruzarse con controles flotantes; render Dark revisado a 1280/768/374 px.
- Preferencias de lectura ampliadas a 100/150/200% global; Home refluye y navbar se pliega a 200%. Aún faltan esos tamaños en tablet/móvil/rutas secundarias y tecnología de asistencia real.
- R-H34: corregida y comprobada en captura local; en Light la foto de catálogo ya no hereda la máscara radial de Dark y Dark quedó intacto.
- Los defectos visuales nuevos se corrigen, pero **Home ya no bloquea iniciar Auth**.
- HF-01 conserva autoridad visual específica sobre Home; Admin usa los tokens/principios globales de `docs/04` con composición de trabajo propia y sin copiar el workbench.
- La revisión adicional de Home (Light, tamaños menores, escala y tecnología asistiva) se difiere y no bloquea Admin. Prioridad vigente: Admin → IA.
- R-H41 corrige el objetivo visual de Home: se mantiene el scanner horizontal original de HF-01; el líder del material se calibra para acabar sobre la pieza activa. Cards de Home pasan de tarjetas verticales a filas horizontales en dos columnas, sin stock promocional, con imagen provisional completa y ficha enlazada. Navegador local revisó los cuatro endpoints, tarjetas y collage de seis fotos. Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`. Otros breakpoints/temas y aprobación visual todavía pendientes.
- **Corrección posterior R-H42:** la revisión del usuario mostró que los cuatro endpoints R-H41 seguían cayendo en el fondo; no considerar resuelta la anotación. El líder se calcula midiendo el `object-fit: contain` y el tamaño real del objeto por asset al cambiar el viewport o la pieza. La Home aclara «Filamento · PETG», elimina la pastilla material de las destacadas y reduce las columnas de precisión a título + explicación. Render inspeccionado a 1280×800 para las cuatro piezas, y soporte a 375×812; lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check` pasan. Pendiente aprobación visual del usuario y restantes breakpoints/temas.
- **R-H43 a petición del usuario:** el líder del Hero ahora termina en una pieza cercana a la etiqueta para no atravesar el objeto; se mantiene cálculo responsive y scanner horizontal. «5 filamentos disponibles» cambia a «5 materiales definidos». Columnas de precisión ganan línea Lava + desplazamiento breve al hover, con reduced-motion. `docs/04` registra el uso puntual de Codrops Grid Item Reveal. Inspección local: cuatro detalles a 1024×780, Hero/métrica a 375×812 y hover en Dark. Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`; aprobación del usuario y revisión restante de breakpoints/temas pendientes.
- **R-H44 a petición del usuario:** se rediseña el bloque inferior del Hero en dos señales claras («Bajo pedido» y «FDM» + filamentos confirmados), sin el conteo anterior ni el mensaje redundante «Por etapas». El marcador vertical y líder al producto comparten un solo trazo, sin corte en el codo. Render React inspeccionado a 1280×720 y 375×812; pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`; falta aprobación del usuario.
- Capacidad confirmada por el usuario: FDM únicamente, filamentos ASA, PLA, PETG, ABS y TPU. Home/DB/UI no deben seguir anunciando SLA, resina o nylon.
- **R-H45 — legibilidad y customer journey:** navbar/footer recibieron un primer aumento de tamaño y el copy de Home distingue catálogo bajo pedido de la solicitud personalizada. `routes.jsx` confirmó placeholders en el resto del storefront. `docs/03–05` mantienen el análisis y la secuencia de compra recomendada.
- **R-H46 — prioridad nueva del usuario (escala supersedida por R-H48):** Home queda cerrada para avance; no requiere pasada global ni aprobación adicional antes de Admin. El aumento a 16/15 px y el breakpoint 1000 px se revirtieron al aclarar el usuario que la captura se veía con zoom al 75%. Ver `docs/05`.
- **R-H48 — iteración puntual Home:** título de catálogo actualizado para selección editorial en tendencia; botones flotantes de asistencia a 56 px; navbar/footer restaurados a R-H45. Lint, pruebas, `check:ui`, build y diff check pasan; queda pendiente comparar visualmente el tamaño en screenshot. Detalle en `docs/05`.

### Capa 3 — Autenticación ✅ SLICE ACADÉMICO IMPLEMENTADO
Objetivo: tener una autenticación académica real y verificable antes de construir Admin.

Orden:
1. cerrar contrato académico JSON Server + token simulado; ✅
2. implementar `authService`/adapter separado de UI; ✅
3. convertir `AuthProvider` de guest fijo a sesión real; ✅
4. Login con loading/error/invalid session; ✅ base React
5. Registro según contrato disponible; ✅ base React
6. persistencia/restauración de sesión; ✅
7. logout; ✅ interfaz/provider
8. guards de rutas autenticadas; ✅
9. guard de rol admin; ✅
10. tests de login, registro duplicado, logout, sesión expirada/inválida y permisos; ✅
11. aplicar lenguaje HF-01 al AuthLayout sin crear una estética paralela. ✅ base visual

**Estado actual:** `jsonServerAuthAdapter` consulta y crea usuarios en `db.json` a través de JSON Server, persiste la sesión en `localStorage` y emite un token `sim.v1` simulado con expiración, id y rol. La credencial `demoPassword` es explícitamente académica y no es un secreto ni seguridad de producción. Login/restore/logout también se probaron contra JSON Server real. Auth cuenta con base visual React. Tras el acuerdo del usuario de cerrar Home para avanzar, el siguiente bloque es Admin operativo protegido por rol.

### Capa 4 — Admin
🟠 **EN IMPLEMENTACIÓN — slices 1–2.** Entra después de Auth porque depende de identidad/rol. Admin usa una composición operativa propia dentro de tokens Vértice; no debe replicar la Home.

Prioridad:
- guard `admin`;
- shell/dashboard;
- pedidos;
- solicitudes/cotizaciones;
- catálogo;
- clientes;
- métricas desde datos reales del repo;
- loading/empty/error/permisos;
- diseño operativo propio con tokens y principios de Vértice (`docs/04`), sin clonar la composición de Home ni usar un dashboard genérico.

El primer slice del dashboard muestra pedidos activos, solicitudes `PENDING_QUOTE`/`IN_REVIEW`, cinco pedidos activos recientes y registros que usan estados legados por separado. No informa ventas cobradas si no hay evidencia de pagos; el modelo actual no contiene `payments` ni `paidAt`. No usa `stock`/`minStock` para ninguna alerta.

**Slice 2 — solicitudes, acción inicial y dashboard rehecho:** `GET /customPrintRequests` + `GET /users`, filtros, diagrama de fases, detalle y transición auditada `PENDING_QUOTE → IN_REVIEW`. `POST /admin/actions/start-review` valida rol/estado, cambia estado y agrega `REQUEST_REVIEW_STARTED` en una sola escritura. `/admin` usa carril de KPI, gráfica SVG sobre estados reales, registro de pedidos abierto y cola accionable; no se replica estructura Stitch ni se editó Home. Referencias/decisiones en `docs/04`, `docs/05`, `docs/08`. Descarga de archivo no disponible hasta escoger proveedor. No hay precio para `PENDING_QUOTE`/`IN_REVIEW`. Verificación local de código pasa; comparación visual responsive/Light queda pendiente.

**Slice completado:** `/admin/actividad` consulta y ordena `activityLog`, permite el filtro `?solicitud=<id>` desde el detalle y representa estados loading/error/empty; no crea muestras ficticias. El sidebar de escritorio permite desplazarse dentro del panel cuando sus enlaces no caben en la altura disponible; móvil conserva navegación horizontal. Contratos/límites en `docs/07` y `docs/08`.

**Slice completado:** Admin de pedidos de solo lectura con registro, búsqueda, filtros por grupo de estado, asociación con cliente/productos/líneas y detalle con etapa/importe de origen. El dashboard enlaza por ID. Estados desconocidos quedan en “Por aclarar”; no hay acciones de mutación hasta definir transiciones/actor/evento. Diseño de superficies más suaves en `docs/04`, auditoría R-H52 en `docs/05` y contratos en `docs/02`, `docs/07`, `docs/08`.

**Slice actual — CRUD esencial de catálogo:** el requisito Must de `01` exige CRUD principal y `ANTEPROYECTO_FINAL.md` concreta productos/categorías, pero las rutas ya declaradas `/admin/catalogo/nuevo`, `/admin/catalogo/:id/editar` y `/admin/catalogo/categorias` seguían en `ConstructionPage`. Se cerró el contrato mínimo: producto ACTIVE/INACTIVE; baja lógica preferida; baja definitiva bloqueada ante `orderItems`; categoría no se borra si tiene productos; no inventario ni storage. Implementados formularios de producto y CRUD de categorías sobre servicios JSON Server. Pendiente completar verificación funcional de mutations, escenario de datos con referencia histórica, inspección visual/responsive y CI.

**Corte 2026-10-02:** `/admin/clientes` y detalle de solo lectura quedaron implementados: lista/filtro de clientes, conteos y relaciones a pedidos/solicitudes; no incluye credenciales demo ni edición de PII. El pull ya contenía incorporación del legacy `SUBMITTED`, preparación/publicación de cotizaciones con actor/actividad y filtros combinables; no rehacer esas capacidades. Fondos Admin ya no usan anillos decorativos; el anillo de distribución por etapa permanece porque expresa datos. Buscador global ofrece coincidencias reales de catálogo ACTIVE, selector ES/EN segmentado. La última revisión dio a Pedidos y Clientes superficies de registro distintas pero coherentes, un editor contextual para categorías y una explicación explícita del estado `SUBMITTED`; la leyenda del resumen se refluye según su ancho útil. Activity se deja para más adelante a pedido del usuario. Responsive global, Light y GitHub Actions siguen pendientes.

**R-H67 — Cotizador manual (2026-10-02):** en la ficha `/admin/solicitudes/:id`, el monto aislado se reemplaza por costeo editable para un operador. Captura mediciones por unidad, material confirmado, precios USD/kg, cambio CRC/USD, energía/tarifa, mano de obra/postprocesado, diseño, otros costos y recargo; presenta desglose y guarda un snapshot que el servidor recalcula con la cantidad de la solicitud y deja versionado. Fuentes de tarifas quedan documentadas en `docs/07`; aún no hay valores reales cargados ni consulta externa/laminador automáticos. La prueba visual local comprobó la ficha real en Dark y Light a 1265×633. Lint, 19 suites/101 tests, `check:ui` (48 módulos), build (134 módulos) y `git diff --check` pasan; falta revisar viewport estrecho y el recorrido con costos operativos auténticos sin guardar cotizaciones ficticias.

**R-H68 — Envío de cotización por correo (2026-10-02):** desde una cotización guardada se puede enviar al cliente y copiar al operador autenticado por BCC mediante webhook privado n8n + Gmail. Solo una respuesta confirmada cambia a `AWAITING_APPROVAL` y registra actividad; errores mantienen `QUOTED`. Se bloquean direcciones demo. La conexión de Gmail OAuth y Webhook no quedó verificada; no se asume configurada. En el corte inicial faltaban Header Auth, `.env`, publicación y prueba controlada. Hacienda ofrece tipo de cambio USD público sin token (usar venta para reposición en USD); BCCR indicador 318 requiere suscripción y queda como alternativa. ARESEP publica tarifas por empresa/tipo/bloque, a seleccionar según recibo. Ninguna fuente está conectada a Admin. Lint, `check:ui`, build, `git diff --check` y 22 suites/106 tests pasan. Captura visual Admin e integración de extremo a extremo pendientes.

**R-H70 — Paquete n8n unificado (2026-10-02):** se genera un solo JSON importable con cinco entradas Webhook (tres roles IA, tasas, cotización por correo). Las ramas IA convergen en un único nodo HTTP Request/DeepSeek; tasas y Gmail permanecen en ramas independientes del mismo workflow. El ZIP ofrece solo el JSON unificado y la guía, para no obligar a importar cinco workflows. Los módulos por capacidad siguen como fuentes internas. Credenciales no se exportan; falta asignarlas, configurar `.env`, activar el workflow y validar APIs/correo reales. OpenRouter no se añade: DeepSeek ya es el proveedor del contrato actual y no se necesita segundo proveedor para esta prueba.

**Siguiente bloque:** importar una vez el workflow unificado, asignar Header Auth/DeepSeek/Gmail dentro de sus nodos, configurar las cinco URLs y el mismo token en `.env`, activar y probar asistentes más un correo dirigido a una cuenta propia. Después cerrar el recorrido CRUD de catálogo/categorías y guardia de referencias históricas; Activity queda aplazada a pedido del usuario. No dividir la experiencia de importación en cinco workflows.

**Checkpoint R-H64 (2026-10-02):** Auth continúa cerrado como slice académico; el
foco no se mueve todavía a IA. Admin ya tiene dashboard, solicitudes/revisión
inicial, Pedidos, CRUD Catálogo/Categorías y lectura de Clientes. Para dar por
cerrado Admin falta el recorrido manual en navegador de crear/editar/ocultar y
el bloqueo de baja con referencias históricas; la auditoría responsive y de
tema en 375/768/1280; y una prueba explícita de `/admin/actividad`, que está
implementada pero el usuario pidió dejar para después. Datos de los 19 borradores
de producto siguen pendientes de confirmación, sin bloquear ni falsear lo que
está publicado. Al cerrar Admin, el siguiente módulo será IA/N8N; allí se
construirán los tres asistentes separados y se evaluará DeepSeek de pago antes de
integrarlo. El asistente Admin pertenece a esa capa de IA, no es una capacidad ya
implementada del dashboard. CI de GitHub sigue siendo gate antes de recomendar
pull.

### Capa 5 — IA / N8N
Entra después de que Auth + Admin tengan contratos y datos suficientes.

Primero:
- `aiService.js`;
- webhook N8N normalizado;
- chatbot `mode: "chat"`;
- resumen admin `mode: "admin_summary"`;
- errores/timeouts/loading;
- etiqueta **ORIENTATIVO · SUJETO A VALIDACIÓN** donde corresponda;
- IA nunca inventa números ni emite cotización final.

### Capa 6 — Tienda / Catálogo
Listado, búsqueda/filtros, ProductCard y estados reales.

### Capa 7 — Detalle de producto
`/producto/:id` con datos reales y estados.

### Capa 8 — Solicitud personalizada
Upload, revisión y ciclo de cotización según docs/02.

### Capa 9 — Carrito + Checkout
Separar catálogo de solicitud/cotización aprobada.

### Capa 10 — Cuenta / Pedidos + páginas públicas secundarias
Cuenta, pedidos, FAQ, Sobre nosotros, Contacto, Materiales, Requisitos, etc.

### Capa 11 — Auditoría y cierre global
Coverage, lint, build, responsive 375/768/1280, Dark/Light, accesibilidad, estados y revisión visual transversal.

### Regla de avance reajustada

No usar “terminar toda la estética primero” ni “hacer toda la lógica primero”.

El flujo es:
**contrato → slice funcional → estados → tests/CI → identidad HF-01 → aprobación → siguiente slice**.

Home puede seguir recibiendo correcciones visuales durante Auth/Admin si el usuario detecta defectos, pero no debe absorber días completos mientras faltan funciones obligatorias.

## Fase 5 — Integraciones

- API externa.
- JWT/auth.
- JSON Server.
- N8N.
- IA.
- archivos 3D.

Cada integración entra después de que exista su contrato y una prueba mínima.

## Fase 6 — Cobertura del producto

Completar las rutas y features restantes directamente en React, siguiendo `03`, `06` y los flujos de `02`.

No crear una segunda colección de mockups HTML.

## Fase 7 — Calidad y cierre

- lint;
- tests relevantes;
- coverage objetivo definido en `09`;
- build;
- responsive;
- accessibility;
- estados vacíos/error/loading/processing;
- revisión visual;
- documentación final.

## Definition of Done de React

Una feature queda terminada solo si:
- respeta el dominio;
- usa las capas de `06`;
- cubre estados relevantes;
- funciona por teclado cuando aplica;
- conserva identidad visual;
- tiene tests relevantes;
- pasa lint/build;
- documenta decisiones nuevas.

## Regla

No avanzar por “tener algo funcionando”. Avanzar cuando el bloque actual tiene evidencia suficiente para no contaminar el siguiente.

## Continuidad vigente — 2026-10-02

Admin funcional y sus revisiones responsive señaladas se cierran en este corte.
Un único workflow n8n se entrega importable, inactivo y documentado; sigue
pendiente que el operador lo importe, asigne credenciales y publique para la
prueba real DeepSeek/Gmail. Los valores del motor continúan DEMO hasta calibrar
los costos físicos del taller. Activity es el siguiente módulo que el usuario
reservó para después. No se bloquea el uso local esperando la integración real.

### Bloque reabierto por el usuario — cotizador / asistentes (2026-10-02)

React ya diferencia “Ya tengo la pieza” de “Quiero ayuda para crearla” y el
estimador se identifica como DEMO. El JSON de importación ahora se genera junto
al workflow canónico e incluye tres AI Agent nativos separados para público,
Admin y cotización. Verificación local: 121 tests, lint, `check:ui`, build y 194
checks de automatización pasan; la inspección del navegador confirma los estados
de entrada de cotizador. Build conserva el warning de chunk mayor de 500 kB.

**Para cerrar realmente el flujo antes de pedir credenciales al usuario:**
1. Implementar la solicitud transaccional desde el bot de diseño y confirmar el
   envío de aviso al taller; no guardar nada solo en historial conversacional.
2. Implementar upload privado STL/OBJ, lectura autorizada desde Admin y retención
   del archivo. No hay laminado/medición ni costos calibrados, así que el Admin
   conserva el precio final; no prometer cotizador automático por geometría.
3. Mantener correo comercial solo después de guardar una cotización de Admin;
   correo al cliente con copia oculta al taller, confirmación idempotente y
   aprobación explícita del cliente. Checkout/pago real sigue pendiente.
4. Importar el workflow en una instancia n8n real, asignar DeepSeek API, Gmail
   OAuth2 y Header Auth, y verificar URLs/callback. CI remoto de este bloque queda
   pendiente después de commit.

## Auditoría lógica y handoff vigente — 2026-10-03

La lista de Claude se contrastó con rutas, componentes, servicios y estados del
checkout, no se tomó como diagnóstico ya confirmado:

| # | Área | Resultado comprobado | Bloque |
|---|---|---|---|
| 1 | Fotos de catálogo | Admin permite cargar hasta seis fotos comprimidas, ordenarlas y elegir portada; JSON Server persiste data URLs en `images`. | C-P2 implementado localmente; revisión visual autenticada pendiente |
| 2 | Archivo de solicitud | `/solicitud/archivo` recibe hasta cinco referencias (imagen/STL/OBJ), crea intake idempotente `PENDING_QUOTE` y mantiene los bytes fuera de `db.json`. | C-P3 implementado localmente; inspección visual autenticada pendiente |
| 3 | Prueba de correo | `QuoteEmailTest` está limitada a cuenta propia con `[DEMO][PRUEBA]`; conservar para defensa, rotular y hacer secundaria. | C-P8 |
| 4 | Compra | `/carrito` puede crear un encargo `PENDING` del catálogo con precios recalculados, snapshot, actividad e idempotencia; no cobra, reserva stock ni define entrega. Pago/checkout de cotización y detalle `/pedidos/:id` permanecen pendientes. | C-P4 implementado localmente; falta recorrido visual con sesión autenticada y CI |
| 5 | Rutas en construcción | También `/pedidos/:id`, `/nosotros`, `/contacto`, `/faq`, `/materiales`, `/requisitos`, `/terminos`, `/privacidad` y `/envios` siguen usando el placeholder. | C-P4/P7 |
| 6 | Cotización cliente | `/cuenta` permite aprobar una oferta vigente o pedir cambios/rechazar con motivo; Admin aún debe completar el retorno operativo de `CHANGES_REQUESTED`. No hay pago tras aprobar. | C-P5 implementado localmente; integración Admin pendiente |
| 7 | Transiciones Admin | Sí hay transiciones secuenciales, control por rol/estado/versionado, motivo para cierre temprano y evento `ORDER_STATUS_CHANGED`. La frase vieja “Pedidos solo lectura” era obsoleta; corregida en `docs/02`. | Implementado; probar recorrido |
| 8 | Borradores + bot | La ficha Admin puede pedir propuestas de descripción/material/colores y estimaciones básicas al agente general; requiere revisión y confirmación del operador. | C-P1 implementado localmente; prueba live con export actualizado pendiente |
| 9 | Clientes/Actividad | Clientes permite buscar y consultar pedidos/solicitudes asociados; Activity es historial de eventos existentes, no solo una pantalla vacía. Son superficies de consulta, no gestión integral de perfil. | Implementado; límites deliberados |
| 10 | Cuenta | `/cuenta` muestra cotizaciones y acuse del encargo recién creado; aún no lista historial de pedidos ni permite editar perfil. `/pedidos/:id` sigue en construcción. | C-P4/P5 implementados localmente; historial/perfil en C-P7 |

Estimación de avance global: **55–65% (centro aproximado 60%) del MVP académico**,
no una métrica calculada. Auth, la base storefront y Admin operativo ya existen;
checkout, archivos propios, cuenta completa y algunos ciclos de cliente siguen
sin cerrar. Admin está más avanzado que el recorrido de compra extremo a extremo.

### Bloque C — lógica de producto + Playwright (handoff de Claude)

Empezar **solo después** de cerrar B1/B2 (n8n real + correo) con CI verde. Rama
`Pruebas`. Leer `AGENTS.md`, `AI_CONTEXT.md`, `docs/02`, `06`, `07`, `08`, `09`.
Cada punto requiere su propio commit, tests, documentos de dominio,
`AI_CONTEXT.md` actualizado y CI verde. Origen: auditoría lógica de Claude
(2026-10-03). No inventar precios, datos ni capacidades.

#### Decisiones ya tomadas

- **Fotos:** guardar en `db.json` como data URL comprimida en navegador (canvas →
  WebP/JPEG, lado mayor 1200 px, máximo aproximado 300 kB por foto y 6 fotos por
  producto). Sin dependencias ni cuenta externa. Es una decisión académica
  offline, no almacenamiento escalable de producción; documentar en `docs/07`.
- **QuoteEmailTest:** se conserva para la defensa, rotulado como herramienta de
  **Demostración**.

#### C-P1 — Autocompletar ficha de producto con IA

**Implementado localmente — 2026-10-04.** En crear/editar producto, el botón
«✨ Autocompletar ficha con IA» envía únicamente el nombre a
`/assistants/chat` como tarea Admin `catalog_product_draft` por el agente general.
El prompt devuelve descripción, material y colores sugeridos, gramos/horas muy
básicos y sus supuestos; el backend exige Admin, desactiva las tools y valida la
salida. La respuesta rellena campos editables, sin guardar ni publicar.

No hay precio de IA. Los gramos/horas del modelo se señalan como estimación y no
se usan en el cálculo hasta que el operador los contraste con el laminador y lo
confirme; elegir un perfil análogo DEMO sigue siendo una acción separada. La
calculadora existente se conserva.

Pruebas locales dirigidas: `adminCatalogForm` (13) y `quoteAutomation` (24),
lint, `check:ui` y build del export n8n pasan. **La prueba real del botón contra
n8n queda pendiente de importar/publicar este export actualizado**; el usuario
confirmó que B1/B2 (los tres agentes OpenRouter y correo) funcionan en vivo, lo
cual no prueba por sí solo este nuevo formato `productDraft`.

#### C-P2 — Subir fotos de producto

**Implementado localmente — 2026-10-04.** `ImagePicker` ahora combina subida
real JPG/PNG/WebP con la biblioteca del taller y presenta una galería con
reordenamiento, portada y eliminación. El navegador procesa con canvas, limita
el lado mayor a 1200 px y comprime cada foto a <=300 KiB; el producto admite
hasta seis fotos. El formato persistido sigue siendo `products.images` con
data URLs, `images[0]` conserva la portada y los componentes de tienda existentes
la leen sin un formato paralelo. El API local permite un JSON de hasta 3 MiB
(seis data URLs codificadas); esta decisión es académica/local, aumenta `db.json`
y no debe presentarse como almacenamiento de producción.

Pruebas añadidas: tamaño/dimensiones/tipo, compresión, galería y formulario; el
check HTTP aislado persiste seis imágenes de 300 KiB sin modificar el `db.json`
real. La autenticación del navegador se redirigió a `/login`, por lo que queda
pendiente capturar Admin Dark/Light y breakpoints estrechos antes de afirmar una
auditoría visual completa.

#### C-P3 — `/solicitud/archivo` recibe el archivo

**Implementado localmente — contrato en `docs/07`.** El formulario pide
descripción/uso, dimensiones con unidad explícita mm/cm/in, material/cantidad,
enlace HTTPS opcional y hasta cinco fotos PNG/JPG/WebP/GIF o archivos STL/OBJ
de 5 MiB máximo cada uno. Tras revisión y envío con sesión de cliente, crea
`PENDING_QUOTE` con idempotencia; metadatos van a JSON Server y bytes a
`.local-data/quote-attachments/`, nunca a `db.json`. Admin y dueño pueden leer
adjuntos por el endpoint autorizado; otra cuenta recibe 404. No hay medición de
STL, cotización, precio ni correo automático.

Se habilitó el asistente general flotante en `/solicitud/archivo`; queda oculto
solo en `/solicitud/ayuda-diseno` para no mostrar dos asistentes en esa ruta.
Tests de UI cubren el asistente, las unidades y el envío de PNG+STL; `check:automation`
prueba multipart, autenticación, idempotencia y lectura autorizada sobre una
base/almacenamiento temporal. La captura visual Admin autenticada sigue pendiente.

#### C-P4 — Encargo de productos desde el carrito

Implementado localmente: cuando las líneas son válidas, una cuenta `customer`
puede confirmar el encargo desde `/carrito`. El servidor valida catálogo y
variante, ignora precios del cliente, recalcula CRC, persiste el pedido como
`PENDING`, sus líneas (embebidas y normalizadas) y el evento de actividad. Una
clave idempotente evita duplicados al reintentar. Tras éxito, el cliente vuelve
a `/cuenta` con acuse y el carrito se limpia; si falla, se conserva. Admin puede
leer el nuevo pedido con el mismo adaptador de Pedidos.

Límite explícito: `subtotalCrc` y los campos compatibles `subtotal`/`total` son
el subtotal del catálogo, no prueba de cobro ni precio final con entrega. No se
reserva stock ni se promete fecha. Checkout de solicitud aprobada, pago,
comprobante, historial completo de pedidos y `/pedidos/:id` siguen pendientes;
ningún pago real forma parte de este slice.

#### C-P5 — El cliente aprueba, rechaza o pide cambios

Implementado: `/cuenta` presenta monto, vigencia, notas y desglose de
`AWAITING_APPROVAL`; el servidor limita aprobación a cliente/propietario/versión
vigente. Pedir cambios o rechazar exige motivo y deja evento auditado.
`CHANGES_REQUESTED` espera revisión/respuesta del taller; integración de esa
transición en la vista Admin permanece en trabajo paralelo.

#### C-P6 — Cotizar una variante

En `/producto/:id`, añadir acción que abra el asistente con producto como contexto
(nombre, material y dimensiones) para pedir otro tamaño/color/material.

#### C-P7 — Contenido faltante

- `/cuenta`: pestañas Cotizaciones/Pedidos/Perfil. Perfil permite editar nombre y
  teléfono; email solo lectura.
- Crear contenido informativo sobrio para nosotros, contacto, FAQ, materiales,
  requisitos, términos, privacidad y envíos, usando únicamente información
  respaldada por el proyecto. Políticas/plazos/precios sin respaldo quedan
  pendientes; si no hay contenido útil, quitar el enlace en vez de “En construcción”.

#### C-P8 — Etiquetar la demostración de correo

Rotular “Demostración: prueba de correo”, aclarar que no avanza la solicitud y
ubicarlo al final como acción secundaria.

#### C-P9 — Playwright E2E y regresión visual

- Añadir `@playwright/test` como devDependency con justificación en `docs/09`:
  Jest no comprueba recorridos completos/render real; reemplaza capturas manuales.
- `playwright.config.js` levanta `npm run api` y `npm run dev` sobre copia temporal
  de fixture; nunca usa ni altera el `db.json` real.
- Simular n8n con `page.route` (respuesta correcta, error, timeout y JSON inválido);
  CI no llama modelos de pago ni Gmail.
- Flujos mínimos: login Admin + guard; crear borrador → subir foto → asistente
  simulado → publicar; archivo cliente → cotización Admin → aprobación/rechazo;
  carrito → checkout → pedido.
- Capturas `toHaveScreenshot` de Home, Catálogo, Producto, Resumen Admin y
  formulario producto a 375/768/1280 en Dark/Light. Baselines Linux/CI para reducir
  diferencias de fuente.
- Añadir `npm run test:e2e` y job en `.github/workflows/verify.yml`; subir reporte y
  trace como artifact si falla.

#### Orden y DoD de C

Orden acordado: **B1/B2 → P1 → P2 → P3 → P5 → P4 → P6 → P8 → P7 → P9**. P9 puede
prepararse en paralelo después de P3 usando recorridos ya existentes.

Cada punto debe pasar lint, tests, `check:ui`, `check:automation`, build y CI
verde; actualizar dominio y `AI_CONTEXT.md`; completar auditoría visual a
375/768/1280 Dark/Light con evidencia real.

**Estado del gate:** C está documentado, no iniciado. B1 sigue abierto por
autorización Admin y recorridos UI pendientes; B2 sigue abierto por entrega
`UNKNOWN`. No tratar el workflow publicado, el correo ambiguo ni el CI del HEAD
anterior como cierre de estos gates.

### Repriorización de Bloque C por el usuario — 2026-10-03

No iniciar C hasta cerrar B1/B2 en vivo. Cuando se abra, el orden acordado es:
**C-P2 → C-P3 → C-P5 → C-P4 → C-P8 → C-P7 → C-P9**. C-P9 queda al final para
cubrir los flujos construidos. **C-P1** (asistente en el formulario de producto)
se aparca hasta que el usuario decida retomarlo y B1/B2 estén cerrados en vivo;
ya no depende de una clave de DeepSeek. **C-P6** no fue priorizado en este orden y queda diferido, sin
insertarlo por inferencia. Esta instrucción reemplaza el orden anterior de C, no
el gate de B1/B2.

El usuario también confirmó para el flujo de cotización: aceptación en la app;
correo como aviso y seguimiento, con confirmación al cliente y aviso al taller
después de aceptar, y avances al cliente conforme cambien etapas reales del
pedido. Esos avisos todavía no están implementados. El envío de prueba B2 queda
aparte hasta verificar el intento `UNKNOWN` junto al usuario y escoger su cuenta
alternativa de cliente; no repetir ni duplicar ese envío.

### Ajuste puntual pedido por el usuario — 2026-10-03

El usuario aclaró que DeepSeek ya no se usará: OpenRouter es el único proveedor
de modelo. Antes del cierre live de B1/B2 pidió corregir el comportamiento del
asistente de cotización, terminar el cotizador DEMO por producto en Admin y
separar/rediseñar el copiloto administrativo. Esta es una re-priorización
puntual del árbol local, no cierre de B1/B2 ni inicio general de Bloque C.
El asistente de solicitud organiza y devuelve un resumen editable con
referencias; no cotiza ni crea la solicitud hasta la confirmación del cliente.
El precio por producto es una sugerencia DEMO que requiere datos explícitos y
confirmación para publicar. El export n8n debe actualizarse en la instancia
existente sin crear un duplicado activo; su prueba con OpenRouter y la prueba
B2 de correo siguen pendientes.

### Estado del corte local — intake quote / precio de catálogo / copiloto Admin (2026-10-03)

Esta corrección puntual no abre ni completa B1/B2. La ayuda de diseño prepara
una solicitud editable con adjuntos y no calcula; el formulario de cada producto
Admin tiene su propia sugerencia de precio DEMO, y el copiloto Admin cuenta con
una página de consulta separada del popup Home. El export oficial captura
OpenRouter y normaliza el texto exacto `Agent stopped due to max iterations` a
un error recuperable. El navegador comprobó solamente el intake quote Light a
~720 px. Admin volvió a `/login`, así que su revisión visual sigue bloqueada por
la sesión y no se declara cerrada. Los gates locales del árbol sucio y el CI
remoto del HEAD anterior no equivalen a CI verde de este corte.

### Avance C-P5/P4 — 2026-10-04

P5 y P4 tienen implementación, pruebas unitarias y checks locales. No declarar
el ciclo customer→Admin de cambios solicitado cerrado hasta integrar
`CHANGES_REQUESTED` en la bandeja Admin. La revisión visual autenticada de
`/carrito` y `/cuenta`, CI para los commits nuevos y el checkout/pago permanecen
pendientes. La confirmación de P4 registra un encargo, no una compra pagada.
