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
- **R-H48 — Home puntual:** navbar/footer restaurados a la primera iteración R-H45 (nav 14/13 px, CTA 13/12 px, idioma 12 px, footer 14/12 px; menú a 820 px) tras aclaración del usuario de que la captura anterior se observó con zoom 75%. Catálogo ahora se presenta como selección editorial en tendencia sin afirmar popularidad cuantificada. Controles flotantes aumentados a 56 px y paneles móviles separados para evitar solapamiento. HF-01 no se tocó. Pasan lint, 7 suites/60 tests, `check:ui` (48 módulos), build (107 módulos) y diff check. La pestaña local confirmó el texto y controles en árbol accesible, pero no se obtuvo screenshot para comparar tamaños; queda pendiente la inspección visual de escala. Home continúa cerrada como área prioritaria y los cambios posteriores son puntuales.
- **Admin slice 1 (historial):** `/admin` y solicitudes quedaron implementados en slices previos. En este corte se termina `/admin/actividad`; pedidos, catálogo, categorías y clientes conservan placeholders hasta sus slices. El snapshot de pasos anteriores y su evidencia vive en `docs/05`.
- **Admin slice 2–3 + R-H50:** solicitud inicia revisión con transición auditada y contrato de almacenamiento pendiente de proveedor. Dashboard `/admin` rehecho como tablero de flujo: KPI abierto, anillo proporcional calculado sobre pedidos activos por etapa, registro sin paneles enmarcados y cola accionable de solicitudes; referencias documentadas en `docs/04`, `docs/05` y `docs/08`. Home/HF-01 no se editaron. Browser local confirmó el árbol accesible actualizado, no se obtuvo screenshot visual. ESLint, 7 suites/60 tests, `check:ui` (48) y build (108) pasan. `npm run api` requiere reinicio para el endpoint de revisión; el fixture no tiene `PENDING_QUOTE`, así que esa acción no se recorrió. Comparativa visual 1280/768/375 y Light pendiente.
- **R-H47 — Acceso/Admin:** collage conserva seis fotos, pero en estado idle ya no atribuye el nombre/material de la primera pieza; ofrece guía y contextualización, y la leyenda de producto aparece tras hover/foco/selección. «Mi cuenta» diferencia invitado, cliente y admin; admin abre `/admin`. El shell identifica la sesión Admin. Navegador local confirmó login admin → tienda → menú «Panel de administración» → `/admin`; a 724 px se observó el reflujo responsive. Pasan 54 tests, lint, `check:ui`, build y `git diff --check`. Sin aprobación visual humana ni cobertura de todos los breakpoints/tema Light. Detalle en `docs/05`.
- **R-H41/R-H42 Home:** R-H41 afirmaba que el líder acababa sobre las cuatro piezas; el usuario comprobó en el render que seguía en el fondo. R-H42 calcula el endpoint midiendo el `object-fit: contain`, paddings y dimensiones naturales del asset; recalcula al redimensionar o cambiar la pieza y conecta desde el rótulo. Inspección local confirma el líder sobre las cuatro piezas a 1280×800 y sobre soporte a 375×812. «Filamento · PETG» contextualiza el material; lattice pasa a «estructura aligerada» también en la tarjeta del soporte. La ProductCard destacada omite su badge flotante; las columnas de precisión pierden índice/chip redundante. Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`; faltan tamaños/temas restantes.
- **Assets del mockup publicados:** `hero-soporte.jpg`, `producto-engranaje.jpg`, `producto-dragon.jpg`, `producto-drone.jpg` y `producto-maqueta.jpg` fueron reutilizados desde `mockups/images/` en `public/images/` sin alterar el mockup congelado.

**Admin actual:** R-H55/R-H56 extienden atmósfera a rutas de Admin; R-H57 documenta el criterio transversal (no canvas seco ni repetición mecánica de fondos). `/admin/actividad` consulta `activityLog`; pedidos se consultan sin editar etapas ni confirmar pagos. Catálogo: alta/edición de productos, ocultar/publicar y CRUD de categorías usando servicios JSON Server. Publicación `ACTIVE`/`INACTIVE`; baja de producto bloquea referencias históricas, categorías bloquean productos asociados; fotos existentes se preservan, nuevas vacías hasta storage. `stock`/`minStock` no se muestran, escriben ni limitan la cantidad del carrito; `ProductCard` solo ofrece “Bajo pedido” si se solicita. Un material histórico `PLA Silk` se señala para revisión. ESLint, 13 suites/83 tests, `check:ui` (48 módulos), build (119 módulos) y diff check pasan con binarios locales; `npm` global del host apunta a `npm-cli.js` inexistente. Forms no se inspeccionaron visualmente.

**Siguiente bloque exacto:** recorrer en navegador alta/edición/ocultar/borrar producto y CRUD de categorías, probar el bloqueo real por pedidos/productos asociados y auditar el ambiente de formularios/listados a 375/768/1280 Dark/Light. Después Clientes Admin con privacidad, y luego storefront/compra. IA/N8N se reserva hasta cubrir Admin operativo. Acordar storage antes de carga/descarga y contrato de cotización antes de `IN_REVIEW → QUOTED`. CI de GitHub pendiente de publicar el commit final.

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
