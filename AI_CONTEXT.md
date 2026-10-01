# AI_CONTEXT.md — Vértice CR

> **Última actualización:** 2026-10-01
> **Estado:** SNAPSHOT ACTIVO  
> **Rama:** `Pruebas`  
> **No es un diario:** este archivo resume el presente. El historial detallado vive en los documentos de dominio.

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

Contratos académicos base cerrados para abrir el gate: modelo/estados y auth simulado contra JSON Server. La implementación continúa por slices. El proveedor y contrato de API externa siguen pendientes en `docs/07`; N8N/IA tienen patrón conceptual, pero faltan endpoints/workflows reales. No inventar proveedores o URLs.

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
- **Legibilidad / R-H46:** por el feedback nuevo, el navbar pasa a 16 px en escritorio ancho / 15 px en el tramo horizontal compacto; CTA 16/15 px, idioma 14 px, footer copy/enlaces 16 px, títulos/cierre 14 px y menú compacto 16 px. El navbar colapsa a menú hasta 1000 px para conservar espacio. Screenshot local confirma navbar y footer a 1280×720 Dark; Home se considera cerrada para avance. Revisión 768/375 y Light pospuesta, no bloquea Admin.
- **Admin slice 1:** `/admin` protegido por rol ahora carga resumen de JSON Server a través de service; función pura calcula pedidos activos, solicitudes en revisión y distingue el registro legacy `SUBMITTED`. Datos actuales dan 5 pedidos activos, 1 solicitud oficial en revisión y 1 solicitud fuera del contrato. Ventas muestra sin datos porque no existe evidencia de pagos; no se usa `stock`/`minStock`. Login admin y render local a 1280×720 inspeccionados. Lint, `check:ui`, build y `git diff --check` pasan; no se ejecutaron pruebas automatizadas en este bloque. Las demás páginas Admin aún son placeholders.
- **R-H47 — Acceso/Admin:** collage conserva seis fotos, pero en estado idle ya no atribuye el nombre/material de la primera pieza; ofrece guía y contextualización, y la leyenda de producto aparece tras hover/foco/selección. «Mi cuenta» diferencia invitado, cliente y admin; admin abre `/admin`. El shell identifica la sesión Admin. Navegador local confirmó login admin → tienda → menú «Panel de administración» → `/admin`; a 724 px se observó el reflujo responsive. Pasan 54 tests, lint, `check:ui`, build y `git diff --check`. Sin aprobación visual humana ni cobertura de todos los breakpoints/tema Light. Detalle en `docs/05`.
- **R-H41/R-H42 Home:** R-H41 afirmaba que el líder acababa sobre las cuatro piezas; el usuario comprobó en el render que seguía en el fondo. R-H42 calcula el endpoint midiendo el `object-fit: contain`, paddings y dimensiones naturales del asset; recalcula al redimensionar o cambiar la pieza y conecta desde el rótulo. Inspección local confirma el líder sobre las cuatro piezas a 1280×800 y sobre soporte a 375×812. «Filamento · PETG» contextualiza el material; lattice pasa a «estructura aligerada» también en la tarjeta del soporte. La ProductCard destacada omite su badge flotante; las columnas de precisión pierden índice/chip redundante. Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`; faltan tamaños/temas restantes.
- **Assets del mockup publicados:** `hero-soporte.jpg`, `producto-engranaje.jpg`, `producto-dragon.jpg`, `producto-drone.jpg` y `producto-maqueta.jpg` fueron reutilizados desde `mockups/images/` en `public/images/` sin alterar el mockup congelado.

**Siguiente bloque exacto:** continuar Admin con la cola de solicitudes/cotización: primero determinar las preguntas y tareas del admin, después lista y detalle respaldados por `docs/02`/`07`; no añadir acciones de transición, descarga ni cotización sin contrato y datos suficientes. Investigar referencias sólidas para dashboards de operación/métricas y documentar su patrón y adaptación antes de diseñar los KPI. Cada métrica debe servir a una decisión real, tener fuente y enlazar a los registros cuando haya destino funcional; no stock ni pagos inferidos. IA/N8N queda después de flujos operativos. Iteraciones de Home quedan diferidas. El storefront aún está pendiente según `docs/03`.

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
