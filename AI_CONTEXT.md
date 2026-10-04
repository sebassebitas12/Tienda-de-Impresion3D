# AI_CONTEXT.md — Vértice CR

> **Última actualización:** 2026-10-03
> **Estado:** SNAPSHOT ACTIVO  
> **Rama:** `Pruebas`  
> **No es un diario:** este archivo resume el presente. El historial detallado vive en los documentos de dominio.

## Estado vigente para continuar (2026-10-03)

- Rama `Pruebas`, HEAD `5972088`; GitHub Actions está verde solo para ese commit (run `37149033364`), no para el árbol local. Los cambios locales de este corte no están committeados; no hacer stage/commit/push automático. `db.json` conserva una entrega de correo `UNKNOWN`; no modificar ni reenviar.
- B0 local: `automation/n8n/vertice-cr-unificado.json` es la fuente oficial; `scripts/build-n8n-unified.mjs` genera el export. Se conserva `@n8n/n8n-nodes-langchain.toolHttpRequest` v1.1 y los payloads/placeholder fixes documentados en `docs/08`.
- Proveedor único: OpenRouter; no se usará ni requiere clave de DeepSeek. El runtime local sirve comparaciones de materiales desde la guía controlada y clasifica `Agent stopped due to max iterations` como fallo. Pero la instancia `npm run api` activa en `localhost:3000` todavía sirvió la lógica anterior durante prueba live; reiniciar solo ese proceso y repetir la pregunta en UI. No reiniciar n8n ni Vite por este cambio.
- La nota del workflow local se corrigió y publicó para indicar OpenRouter; solo se editó documentación del canvas, no nodos ni credenciales.
- Admin B1 continúa abierto. El intento de abrir `/admin/asistente` en el origen `127.0.0.1:5174` redirigió a `/login`, por lo que no hay sesión Admin utilizable en el navegador y no se pudo auditar visualmente esa pantalla. El `ROLE_REQUIRED` anterior confirma rechazo de API, pero no su causa exacta; expiración o desajuste de sesión son hipótesis, no diagnóstico confirmado. `localhost:5173` y `127.0.0.1:5174` tienen `localStorage` distinto. Mantener `npm run dev` + `npm run api`, reautenticar en un solo origen; no leer/copiar token ni relajar la guarda.
- El intake local prepara con Enter y actualiza medidas/material posteriores sin pedir otra iteración de n8n; una prueba real pobló el resumen y corrigió la contaminación del nombre por “para revisarlo”. Se formatean listas Markdown de forma segura. La comparación de materiales live demostró que el API activo está desactualizado; guía/error tras recarga aún pendiente.
- Tasas públicas: Hacienda y ARESEP respondieron en ejecuciones previas; no se encontró selección exacta del servicio eléctrico del taller. Mantener cálculo como DEMO si faltan tarifa/mediciones auténticas.
- B2: la prueba de email continúa `UNKNOWN`, sin `messageId`; la búsqueda Gmail más reciente en Enviados para asuntos `DEMO`/`PRUEBA` no halló coincidencias y no se identificó una ejecución de correo. Eso no prueba con certeza que no se enviara. No reintentar hasta reconciliar Gmail/n8n; no mandar a `ana@example.com`.
- Auditoría de lógica: están pendientes fotos propias/galería y intake de archivo; checkout real, rechazo/solicitud de cambios y pedidos del cliente; borradores asistidos; perfil/cuenta completa; rutas informativas. Admin ya tiene transiciones de pedidos secuenciales y auditadas; Clientes consulta historial y Activity presenta eventos existentes.
- Bloque C y su orden siguen preservados en `docs/10-ROADMAP.md`. El asistente para solicitudes es un intake que ordena la idea, acepta referencias y produce un borrador editable; no calcula ni envía sin confirmación. El precio por producto en Admin es una sugerencia DEMO separada. No se reanuda el roadmap completo de C hasta cerrar el gate acordado; esta corrección puntual no depende de DeepSeek.
- Decisión de correo: la aprobación de cotización se registra dentro de la app, no respondiendo al email. Al aprobar, se busca confirmar al cliente y avisar al taller con snapshot/estado correcto; los avances al cliente se disparan por transiciones reales de pedido. No está implementado. B2 queda aparte: el `UNKNOWN` no se reenvía hasta reconciliarlo junto al usuario y usar su correo alternativo de cliente.
- Estimación conversacional (no métrica de producto): ~60% del MVP académico total, rango 55–65%; Auth/Admin y base storefront existen, mientras checkout, archivos y ciclo completo de cuenta/solicitud faltan.
- Verificación visual actual: en sesión anónima limpia a ~1265×710, el árbol accesible confirmó Enter crea el resumen, otro mensaje llena medidas/material y no se envía nada. El viewport no cubre 375/768/1280; respuestas Markdown actualizadas requieren nueva captura. Admin continúa sin sesión visual: `/admin/asistente` es una página distinta del widget público según rutas/código, pero no hubo captura autenticada del copiloto ni del CTA de cotizador por ficha.
- Verificación local del corte actual: `npm run lint`, Jest (31 suites/177 tests), `check:ui`, `check:automation` (248 comprobaciones), `build:n8n`, `build` y `git diff --check` pasan. Build conserva aviso de bundle principal >500 kB. El proceso API live no se reinició y mostró el error de iteraciones sin clasificar. El CI remoto verde se limita al HEAD `5972088`; no hay commit ni cambios enviados a CI.
- Continuación inmediata: reiniciar solo `npm run api` en el puerto 3000 y probar orientación desde el cotizador con OpenRouter; no enviar solicitudes ni correos. Después auditar el copiloto Admin con rol válido, confirmar que se ve la página completa y probar agente/herramienta/inyección. B2 sigue `UNKNOWN`, no reintentar; reconciliarlo con el usuario y usar la cuenta cliente que elija.

Este estado vigente prevalece sobre los cortes históricos que aparecen más abajo.

## 1. Misión del proyecto

Vértice CR es una tienda costarricense de impresión 3D con dos líneas:

1. modelos de catálogo que se fabrican después de recibir el pedido, sin promesa de entrega inmediata;
2. impresión personalizada con revisión y cotización antes de producción/pago.

Stack objetivo: React + Vite + JavaScript/JSX, con las integraciones definidas en `06` y `07`.

## 2. Estado actual

- Fase: **4 — Implementación React (Acomodo y Base)**.
- HF-01: **CONGELADO** (Aprobación final dada el 2026-09-30).
- React: **DESBLOQUEADO** (Gate Abierto).
- Dark/Light: definidos.
- Identidad: **Obsidian Precision Forge + Lava Orgánica**.
- El objetivo visual no es “más efectos”; es una Home con identidad fuerte que venda por producto, composición y percepción.
- Capacidad confirmada por el usuario: impresión FDM únicamente, con filamentos ASA, PLA, PETG, ABS y TPU.

## 3. Autoridad

Para conflictos usa:

**usuario → AGENTS → dominio vigente → AI_CONTEXT → historial → académico.**

Este archivo no puede reemplazar una decisión de `docs/01–10`.

## 4. Qué leer según la tarea

- Home/visual: `03 + 04 + 05`.
- Negocio: `01 + 02`.
- API/datos/auth/N8N: `02 + 07`.
- Arquitectura React: `01 + 02 + 03 + 06 + 07 + 09 + 10`.
- Admin/IA: `02 + 08` + visual del área.
- Testing: `09` + dominio afectado.

## 5. Contratos no negociables

- JavaScript/JSX; no TypeScript.
- No inventar datos, claims, endpoints, métricas, capacidades o resultados de pruebas.
- Solicitud personalizada no es producto de catálogo.
- Flujo oficial de solicitud:
  `PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID`
  con salidas `REJECTED`, `EXPIRED`, `CANCELLED`.
- Una solicitud pendiente nunca se trata como `precio × cantidad`.
- La UI no accede directamente a APIs/datos; usa las capas definidas en `06`.
- Estados de carga, vacío, error, validación y procesamiento forman parte de la UX.

## 6. Contrato visual

Dirección: **Obsidian Precision Forge + Lava Orgánica**.

Vértice debe sentirse técnico, industrial y contemporáneo sin caer en gamer/cyberpunk/neón ni UI genérica de IA.

Principios:
- el producto es protagonista;
- precisión = evidencia, no ruido;
- geometría y tipografía deben sentirse propias;
- cada ruta necesita atmósfera con intención: variar capas/superficies por tarea sin repetir fondos secos ni pegar la misma retícula/halo en todas partes;
- movimiento con propósito;
- evitar decoración repetitiva;
- mobile es reinterpretación, no simple reducción.

Las referencias externas sirven para extraer principios. Registrar fuente, patrón, adaptación y razón cuando una referencia influya en una decisión.

## 7. HF-01 actual

### Fuerte
- Hero workbench con producto grande.
- Riel vertical de piezas.
- Tipografía Space Grotesk + JetBrains Mono.
- Retícula y acento Lava.
- Catálogo con materialidad y estados.
- Chatbot con lenguaje visual integrado al workbench.
- Panel de accesibilidad con controles definidos.
- Search compacto con estado sin resultados.
- Dark/Light y reduced motion contemplados.

### Defectos visuales cerrados e implementados (render real, 2026-09-29)
Detalle, decisiones del usuario, orden de trabajo y criterio de cierre en `docs/05`, sección «Auditoría visual con render real».
- **Implementados en el mockup** (V-01, V-04 a V-09): ✅ V-04 fundido en fotos; ✅ V-01 scroll en botones flotantes; ✅ V-05 opacidad en «Mi Espacio»; ✅ V-06 buscador simplificado; ✅ V-07 chat (flechas y hueco); ✅ V-08 título y botón cerrar en móvil; ✅ V-09 etiquetas español en Precisión y footer.
- **Requisitos de React, no se tocan en el mockup:** V-02 (en móvil el producto debe verse en la primera pantalla); V-03 (PRT-006 y las demás tarjetas son ejemplos del mockup; el catálogo real vendrá con datos reales).
- Idioma y tamaño de texto globales no entran en el mockup; están documentados como requisito de React en `docs/04`.

### Deuda visual conocida (se resuelve en React, no bloquea congelación)
- Responsive real (V-02: en 375 px el producto debe verse en la primera pantalla).
- Datos de catálogo reales vs. ejemplos de mockup (V-03).
- Equilibrio final entre producto y telemetría decorativa del hero.
- Comportamiento final del hamburger (funcionalidad React, no HTML estático).
- Validación de accesibilidad con tecnología asistiva real.

### Regla
No tratar como contrato React algo que aún esté marcado como pendiente.

## 8. Navegación

Rutas públicas y administrativas: `docs/03`.

El navbar mantiene la identidad pública de Vértice. El hamburger se conserva; su comportamiento final sigue pendiente donde el historial registra rechazo del menú anterior. No resucitar una variante rechazada por asumir que un snapshot antiguo era definitivo.

## 9. Arquitectura objetivo

Referencia: `docs/06`.

Capas:

**UI → Pages/Features → Hooks/Services/Utils → APIs → datos**

La UI no contiene reglas de negocio complejas ni accede directamente a JSON Server.

## 10. Datos e integraciones

Referencia: `docs/07`.

Contratos académicos base cerrados para abrir el gate: modelo/estados y auth simulado contra JSON Server. La implementación continúa por slices. El proveedor externo y credenciales reales de n8n siguen pendientes en `docs/07`; el webhook único y callback de herramientas ya están implementados y verificados localmente con servicios mock.

## 11. Calidad

Referencia: `docs/09`.

Objetivo de coverage y orden de pruebas se definen en `docs/09`. Los scripts actuales viven en `package.json`; verificar los resultados de la rama antes de reportarlos.

## 12. Gate de React — SUPERADO (2026-09-30)

El gate está abierto y React está en curso. Las listas de preflight describen los criterios que se cerraron, no una prohibición actual. Las integraciones que aún no tienen proveedor/URL deben concretarse antes de su slice correspondiente.

## 13. Orden de arranque de React

Cuando el gate abra: → **ABIERTO (2026-09-30)**

1. limpiar scaffold Vite;
2. aplicar tokens/global styles;
3. crear App shell/layout;
4. routing;
5. providers;
6. services/adapters;
7. primitives/components compartidos;
8. Home fiel a HF-01;
9. features por flujo;
10. estados y errores;
11. tests por bloque;
12. auditoría visual global.

## 14. Referencias maestras

El banco vivo está en `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md`.

Fuentes principales:
- Impeccable
- Anthropic frontend-design
- taste-skill
- UI/UX Pro Max
- Godly
- Awwwards
- Siteinspire
- Land-book
- Commerce Cream
- Mobbin
- Refero
- Pageflows
- Codrops
- Radix / React Aria
- Vercel Web Interface Guidelines
- Scrolltide — motion, scroll-driven interaction, componentes/shaders y proceso de construcción por etapas

No instalar ni copiar una referencia por aparecer en esta lista.

## 15. Cómo continuar

Antes de editar:
1. inspecciona el estado real;
2. identifica la fuente de verdad;
3. detecta contradicciones;
4. define el cambio mínimo que resuelve el problema;
5. implementa;
6. verifica;
7. documenta.

**Punto actual:** HF-01 **CONGELADO**, React Gate **ABIERTO**; Auth académico implementado y verificado localmente.

**Prioridad académica nueva:** por indicación del profesor, el orden operativo es **Autenticación → Admin → IA**. Se trabaja por slices funcionales con identidad/tokens vigentes; Admin no debe copiar la composición Home.
- **Auth académico implementado:** login/registro/restore/logout contra JSON Server. Sesión guardada sin verificar por fallo de red no autentica rutas, pero se puede borrar localmente. Cliente y Admin probados manualmente en desktop; salida existe en navbar público y sidebar Admin. Token `sim.v1` es académico, no seguridad de producción. AuthLayout muestra seis fotos como collage superpuesto; hover, foco y tap elevan/agrandan una pieza y su leyenda. Fondo con retícula y luz cálida de baja intensidad. Tests cubren nombres, selección y teclado. Dark/Light en más breakpoints y aprobación visual pendientes. GitHub Actions debe quedar verde en el commit de entrega antes de recomendar pull.
- **Capa 0 (UI Kit):** Completada y testeada (100%).
- **Capa 1 (App Shell):** Completada (100%). Layouts (`PublicLayout`, `AdminLayout`, `AuthLayout`), Routing (`react-router-dom`), Providers y estilos base (`shell.css`) implementados. El error de NPM (`brace-expansion`) fue parcheado y el servidor levanta en `localhost:5173`.
- **Capa 2 (Home — cerrada para avanzar, 2026-10-01):** Hero/workbench, scanner, tarjetas, bloque «Bajo pedido»/FDM y contenido actual están implementados. A petición del usuario se posponen las iteraciones restantes; HF-01 ya no bloquea Admin. No significa cambiar ni editar el HTML congelado.
- **Marco global responsive:** tokens `--page-gutter`, `--page-gutter-compact`, `--layout-max-wide` (1680px) y `--layout-max-content` (1520px) centralizados en `src/index.css`; Home/navbar comparten el ancho amplio y las secciones el ancho de lectura. R-H28 documenta el aumento tras el reporte de encogimiento en 1920×1080. Render de escritorio ancho confirmado por screenshot; tablet/móvil y ultrawide continúan pendientes.
- **Alcance de preferencias:** tema, idioma seleccionado, escala tipográfica, contraste y movimiento son preferencias compartidas por providers y persistidas en localStorage; paneles abiertos, query/conversación y pieza seleccionada son estados locales. La traducción integral de todas las rutas aún no se declara completa. Contrato en `docs/04`.
- **Iteración visual React (2026-10-01):** Acceso cambió de carrusel rechazado a collage según R-H39/R-H41. Asistencia se reorganizó como bienvenida + temas rápidos + compositor; se informa que la respuesta automática no está conectada y se ofrece `/solicitud`. Referencias y criterio en `docs/04`, auditoría en `docs/05`. Aprobación visual de Acceso/Asistencia y prueba con tecnología asistiva real pendientes. Home se cierra para avance; el siguiente orden es Admin → IA/N8N.
- **R-H48 — Home puntual:** navbar/footer restaurados a la primera iteración R-H45 (nav 14/13 px, CTA 13/12 px, idioma 12 px, footer 14/12 px; menú a 820 px) tras aclaración del usuario de que la captura anterior se observó con zoom 75%. Catálogo ahora se presenta como selección editorial en tendencia sin afirmar popularidad cuantificada. Controles flotantes aumentados a 56 px y paneles móviles separados para evitar solapamiento. HF-01 no se tocó. Pasan lint, 7 suites/60 tests, `check:ui` (48 módulos), build (107 módulos) y diff check. La pestaña local confirmó el texto y controles en árbol accesible, pero no se obtuvo screenshot para comparar tamaños; queda pendiente la inspección visual de escala. Home continúa cerrada como área prioritaria y los cambios posteriores son puntuales.
- **Admin slice 1 (historial):** `/admin` y solicitudes quedaron implementados en slices previos. En este corte se termina `/admin/actividad`; pedidos, catálogo, categorías y clientes conservan placeholders hasta sus slices. El snapshot de pasos anteriores y su evidencia vive en `docs/05`.
- **Admin slice 2–3 + R-H50:** solicitud inicia revisión con transición auditada y contrato de almacenamiento pendiente de proveedor. Dashboard `/admin` rehecho como tablero de flujo: KPI abierto, anillo proporcional calculado sobre pedidos activos por etapa, registro sin paneles enmarcados y cola accionable de solicitudes; referencias documentadas en `docs/04`, `docs/05` y `docs/08`. Home/HF-01 no se editaron. Browser local confirmó el árbol accesible actualizado, no se obtuvo screenshot visual. ESLint, 7 suites/60 tests, `check:ui` (48) y build (108) pasan. `npm run api` requiere reinicio para el endpoint de revisión; el fixture no tiene `PENDING_QUOTE`, así que esa acción no se recorrió. Comparativa visual 1280/768/375 y Light pendiente.
- **R-H47 — Acceso/Admin:** collage conserva seis fotos, pero en estado idle ya no atribuye el nombre/material de la primera pieza; ofrece guía y contextualización, y la leyenda de producto aparece tras hover/foco/selección. «Mi cuenta» diferencia invitado, cliente y admin; admin abre `/admin`. El shell identifica la sesión Admin. Navegador local confirmó login admin → tienda → menú «Panel de administración» → `/admin`; a 724 px se observó el reflujo responsive. Pasan 54 tests, lint, `check:ui`, build y `git diff --check`. Sin aprobación visual humana ni cobertura de todos los breakpoints/tema Light. Detalle en `docs/05`.
- **R-H41/R-H42 Home:** R-H41 afirmaba que el líder acababa sobre las cuatro piezas; el usuario comprobó en el render que seguía en el fondo. R-H42 calcula el endpoint midiendo el `object-fit: contain`, paddings y dimensiones naturales del asset; recalcula al redimensionar o cambiar la pieza y conecta desde el rótulo. Inspección local confirma el líder sobre las cuatro piezas a 1280×800 y sobre soporte a 375×812. «Filamento · PETG» contextualiza el material; lattice pasa a «estructura aligerada» también en la tarjeta del soporte. La ProductCard destacada omite su badge flotante; las columnas de precisión pierden índice/chip redundante. Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`; faltan tamaños/temas restantes.
- **Assets del mockup publicados:** `hero-soporte.jpg`, `producto-engranaje.jpg`, `producto-dragon.jpg`, `producto-drone.jpg` y `producto-maqueta.jpg` fueron reutilizados desde `mockups/images/` en `public/images/` sin alterar el mockup congelado.

**Admin actual:** `/admin/actividad` consulta `activityLog`; el usuario pidió dejar su prueba para más adelante. Pedidos son de solo lectura; las solicitudes pueden preparar/publicar cotizaciones e incorporar el legacy `SUBMITTED` mediante registro explícito. Catálogo tiene CRUD de productos/categorías con bajas protegidas por referencias; sin stock ni storage. `/admin/clientes` y ficha son lectura de usuarios `customer`, búsqueda y relaciones a pedidos/solicitudes; no exponen credenciales ni editan PII. En este corte, el aviso del resumen explica `SUBMITTED` sin convertirlo por defecto, la leyenda adapta columnas al ancho disponible, Categorías ofrece edición contextual con preview, y Pedidos/Clientes tienen registros visualmente diferenciados dentro del lenguaje Admin. Buscador global ofrece coincidencias reales de modelos ACTIVE. Idioma ES/EN en selector segmentado; no se amplían locales sin traducciones completas y público objetivo. El asistente Admin debe también enseñar cómo recorrer el panel, explicar secciones/estados y orientar al operador sin ejecutar cambios; este requisito responde a que el uso del dashboard todavía no es autoevidente.

**Cotización y asistentes (dirección vigente):** usar exclusivamente OpenRouter hasta que el usuario indique lo contrario (la API de DeepSeek pertenece al profesor y no está disponible en fin de semana). El asistente de diseño organiza los datos que el cliente declara y prepara un resumen editable con referencias; no fuerza dimensiones, no interpreta una imagen como medición, no calcula precio ni envía sin revisión/confirmación explícita. El cálculo de precio de catálogo por producto en Admin es DEMO y requiere entradas y confirmación. El asistente Admin es una página operativa separada y de solo lectura, no el popup público; su render requiere recuperar sesión válida para inspeccionarlo.

**Regla visual permanente (indicación del usuario, 2026-10-02):** cada cambio de UI exige screenshots y revisión en navegador tras cada iteración y en el render final, comparando rutas relacionadas para conservar un sistema común sin copiar su composición. Responsive se comprueba en 1280/768/375; si el navegador impide un tamaño, dejarlo explícitamente pendiente y no afirmar que se revisó.

**Verificación más reciente:** ESLint, 18 suites/98 tests, `check:ui` (48 módulos), build (133 módulos) y `git diff --check` pasan localmente. Capturas de `/catalogo` Light/Dark (~1150 px) verifican el tratamiento de imagen full-bleed R-H64. La captura de Admin en el corte R-H63 muestra 25 modelos, 6 publicados y 19 borradores con fotos; Clientes/Categorías Light también fueron revisadas. No hay control del viewport integrado: 768/375 siguen pendientes. Se añadieron 19 fichas DRAFT; no se editaron datos ajenos a esas fichas. Activity no se recorrió por decisión del usuario. GitHub Actions no está confirmado verde.

**Siguiente bloque exacto:** actualizar y probar el workflow único OpenRouter en la instancia n8n existente; verificar que Enter entrega el mensaje y que cada agente responde sin error de iteraciones. Después, reautenticar y revisar el copiloto Admin independiente y el calculador por producto. No declarar B1/B2 cerrados ni recomendar `pull` hasta que exista evidencia live y CI verde para el commit correspondiente. Activity continúa aplazada por el usuario.

**R-H63 — Productos y motion Admin (2026-10-02):** se agregaron 19 borradores `p7`–`p25` a `db.json`, asociados a 19 fotos identificables en `public/images`; no se inventaron datos comerciales/técnicos, todos tienen precio/material sin confirmar, no aparecen en la tienda y su publicación está bloqueada hasta completar lo requerido. Los seis productos activos preexistentes siguen publicados. Clientes y Categorías recuperan entrada escalonada `admin-row-enter`; ambas preferencias de movimiento reducido la desactivan. Navegador Light (~1166 px) inspeccionado: `/admin/clientes`, `/admin/catalogo/categorias`, `/admin/catalogo`; Catálogo muestra 25 registros, 6 publicados, 19 borradores. Todas las rutas de imagen están presentes. Lint, 18 suites/98 tests, `check:ui` (48 módulos), build (133 módulos) y `git diff --check` pasan. No se tocó Activity. Responsive 768/375 y completar datos de fichas pendientes; sin commit/push ni confirmación de CI.

**R-H64 — Tienda, fotografía de producto (2026-10-02):** se quitó el marco
visual anidado de las imágenes de `/catalogo` haciendo que la foto llene la zona
superior de su tarjeta (1.8:1, sin padding ni máscara). El render Light/Dark se
inspeccionó a ~1150 px; responsive móvil/tablet pendiente. El orden sigue siendo
Auth → Admin → IA.

**Skills de proyecto activas:** `.agents/skills/vertice-continuity/SKILL.md` y `.agents/skills/vertice-visual-audit/SKILL.md`. Nuevas skills/referencias aportadas por el usuario se evalúan por utilidad real; no se incorporan automáticamente.

**Referencia nueva:** Scrolltide queda registrada en `docs/04` como banco para motion cinematográfico, scroll, componentes y proceso de construcción. Regla: páginas sirven para estudiar resultado/comportamiento; repositorios sirven para estudiar implementación/licencia/dependencias. Ninguna referencia sustituye HF-01 ni justifica instalar una librería automáticamente.

**Contexto confirmado por el usuario:** entrega académica frontend, con visión
de migrar a servicios reales. Pagos/facturación reales fuera del alcance actual.
La rúbrica académica ya se compartió; sus requisitos se implementan según los
contratos existentes en Markdown. Pagos reales y facturación fiscal real quedan
fuera de esta entrega.
`docs/07` ya detalla Auth y almacenamiento académico. SINPE continúa pendiente de
contrato; `db.json` conserva un estado histórico `SUBMITTED` que debe resolverse
explícitamente antes de conectar solicitudes.

**Fabricación:** FDM únicamente; filamentos ASA, PLA, PETG, ABS y TPU. Home no
debe afirmar SLA, resina o nylon como capacidades disponibles.

**Modelo del catálogo:** los modelos se imprimen bajo pedido y no hay productos
para entrega inmediata. Ninguna ficha, tarjeta, Admin o métrica debe inferir
disponibilidad de los campos demo `stock`/`minStock`. Admin va antes de IA/N8N;
este orden se conserva en `docs/10`.

**Claims aún no confirmados:** la tolerancia `±0.05 mm` de HF-01 y los plazos/
cobertura logística no son compromisos operativos. React los omite hasta que se
definan con datos reales.

**Corte de anotaciones (2026-10-01):** hallada y corregida la causa del recorte
de fotos de Tienda (zoom de hover compartido + escenario con `overflow:hidden`),
sin alterar el asset completo. El aviso de borradores ahora explica que falta
confirmar la ficha y enlaza al filtro `DRAFT`; no completa ni publica nada.
«Ver tienda» se quitó del pie aislado de Admin porque duplicaba el enlace del
logotipo; sesión y cierre quedan como grupo terminal. Se documentó en `docs/07`
una primera política/prompt investigados para cotizar FDM de forma automática
en los casos comprobables y derivar excepciones al taller; faltan tarifas y
perfiles reales, no hay integración activa.

**Verificado localmente:** screenshots en navegador Light: Tienda ~1150/768/375,
Admin Catálogo ~1150 y Admin Resumen 1280/768/375. Las cajas de imagen empatan
con sus escenarios, contain muestra productos completos y 375 no desborda; el
CTA filtra exactamente 19 borradores sin publicarlos. Logout y navegación del
sidebar responden en móvil. 18 suites/98 pruebas, lint, `check:ui` (48 módulos),
build (133 módulos) y `git diff --check` pasan. El screenshot inicial de 768 px
reveló choque de etiquetas en la leyenda del gráfico; se cambió a dos columnas
para ese rango y el screenshot posterior muestra etiquetas/números legibles,
sin colisión. La revisión no cubre aún todas las rutas de Admin. No commit ni
push en este corte.

**Siguiente bloque:** revisar visualmente y probar el cotizador manual de
`/admin/solicitudes/:id`, traer los inputs reales del taller (sin sustituirlos por
datos demo) y confirmar recorrido Guardar → Publicar. Luego seguir con los
pendientes de cierre de Admin; Activity se mantiene para el bloque que el usuario
reservó. Después de Admin, avanzar a asistentes separados y automatizar laminado/
cotización solo cuando perfiles, tarifas y privacidad estén resueltos. R-H66 revisa las
cuatro fotos y el placeholder del catálogo: las fuentes cuadradas siguen
completas y ahora prolongan su fondo para no quedar como una caja negra inserta;
assets originales intactos. También se unificó el placeholder sin foto. Light
validado a ~1135/768/375 y Dark a ~1135/375; no hay overflow horizontal en móvil.

**R-H67 — Cotizador manual Admin (2026-10-02):** `RequestNextAction` reemplaza el
monto libre por captura guiada de material FDM, gramos/horas por pieza, filamento
y desgaste USD/kg, cambio BCCR, potencia media de impresora y tarifa eléctrica,
postprocesado, diseño, otros costos y recargo. Una función pura calcula costos y
total; la acción de servidor recalcula y persiste valores, desglose, cantidad,
fecha y versión de regla con la cotización. Las tarifas se copian manualmente por
solicitud; sin AI, API BCCR/ARESEP en vivo ni integración de laminador. No hay
importes precargados. Impuestos/envío solo se consideran si se agregan o se
explican en condiciones. En captura local la ficha real ya se revisó en Dark y
Light a 1265×633; al detectar los campos negros en Light se corrigió el uso de
tokens y se recapturó. Lint, 19 suites/101 tests, `check:ui` (48 módulos), build
(134 módulos) y `git diff --check` pasan. Responsive estrecho y el recorrido
manual contra tarifas verdaderas/API siguen pendientes; no se guardó una oferta
de ejemplo.

**Cotización por email (R-H68, 2026-10-02):** en `QUOTED`, Admin tiene un único
CTA para enviar al cliente y copiar al operador por BCC; el servidor hace el
dispatch a n8n, registra actividad y avanza a `AWAITING_APPROVAL` solo tras 2xx.
Direcciones `example.*` se bloquean. La conexión de Gmail OAuth y Webhook no
quedó verificada; no se asume conectada. Falta generar el secreto compartido
Header Auth, guardarlo en `.env`, publicar el workflow y probar un correo
controlado; no se envió ningún correo. Hacienda ofrece un endpoint
oficial sin token para USD compra/venta (usar venta para reposición en USD); BCCR
(indicador 318, con suscripción/token) queda como alternativa. ARESEP publica
tarifas por empresa/tipo/bloque de la factura. Ninguna fuente está conectada a la
calculadora. El cotizador se inspeccionó en sesión real local: el registro R5 está
En revisión y el formulario no tiene datos de costos reales, así que no se guardó
una cotización ni se forzó el CTA de email. Cierre de código local: 22 suites/106
tests, lint, `check:ui`, build y diff check; no hay commit/push. Próximo:
configuración de Header Auth y publicación del workflow, integrar Hacienda y
definir la tarifa ARESEP exacta a partir de la factura, además del cierre
CRUD/responsive de Admin antes de IA y los tres asistentes.
