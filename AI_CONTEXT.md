# AI_CONTEXT.md — Vértice CR

> Punto de entrada obligatorio para cualquier IA. Si no sabes dónde buscar, abre `docs/00-INDICE-Y-MAPA.md`.
> Última actualización: **2026-09-29**.

## Producto

Vértice CR es una tienda costarricense de impresión 3D con dos líneas: productos terminados e impresión personalizada con revisión y cotización.

## Estado del proyecto — 2026-09-26

| Dato | Valor |
|---|---|
| Rama activa | `Pruebas` |
| Fase | 3 — auditoría HF + cierre visual/UX (auditoría visual en curso) |
| React | **BLOQUEADO** hasta cierre de HF desktop + Design System + API/JWT |
| Mockup HTML base preservado | `mockups/hf-01-home.html` (referencia local original, no sobrescribir) |
| Candidato actual de HF-01 | `mockups/hf-01-home-definitivo.html` (EN ITERACIÓN, NO CONGELADO; revisar buscador compacto, menú plegable restaurado, flecha de ficha y switches en navegador) |
| HF-07 / HF-08 | Aprobados a nivel documental (imágenes UXMagic + validación Gemini, sin HTML propio) |
| Siguiente foco de mockups | **Ninguno.** Solo se hará HF-01 en HTML. Una vez aprobado HF-01, se pasará a React para el resto de pantallas. |
| Código en `src/` | Scaffold Vite + prototipo estático descartable — NO es base de implementación |
| `db.json` | JSON válido, pero `r5` usa `SUBMITTED` en vez de `PENDING_QUOTE` (normalizar antes de React) |

## Fuente de verdad documental

| Archivo | Qué contiene |
|---|---|
| `AI_CONTEXT.md` | **Este archivo.** Estado global, decisiones de alto nivel, punto de entrada. |
| `AGENTS.md` | Reglas operativas para agentes. Leer siempre. |
| `docs/00-INDICE-Y-MAPA.md` | Mapa de navegación (tabla "Si te preguntan → Busca en"). |
| `docs/01-PRODUCTO-Y-ALCANCE.md` | Alcance, roles, MoSCoW y principios. |
| `docs/02-NEGOCIO-Y-ESTADOS.md` | Entidades, reglas de negocio, ciclo de solicitudes, carrito y checkout. |
| `docs/03-UX-Y-FLUJOS.md` | Rutas, flujos, estados UX, navbar/footer y responsive. |
| `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` | Identidad visual, tokens Dark/Light, accesibilidad WCAG 2.2, ayuda inline, movimiento, benchmark y **repositorios de skills de diseño**. |
| `docs/05-AUDITORIA-HF-Y-MOCKUPS.md` | Estado de cada HF (17 pantallas), hallazgos y pendientes visuales. |
| `docs/06-ARQUITECTURA.md` | Estructura técnica objetivo. Esqueleto. |
| `docs/07-DATOS-API-AUTH.md` | db.json, API externa, JWT, N8N e IA. |
| `docs/08-METRICAS-ADMIN-E-IA.md` | Dashboard, KPIs, fórmulas y resumen IA. |
| `docs/09-TESTING-Y-CALIDAD.md` | Jest, cobertura y orden de pruebas. |
| `docs/10-ROADMAP.md` | Secuencia de trabajo y gates. |

### Archivos complementarios (no numerados)

| Archivo | Propósito |
|---|---|
| `docs/DECISIONES-POST-AUDITORIA.md` | Registro histórico de decisiones post-auditoría (2026-09-24). Refs corregidas 2026-09-26. |
| `docs/auditoriaclaude.md` | Archivo de trabajo para conclusiones de auditorías de Claude. |
| `docs/ANTEPROYECTO_FINAL.md` | Documento académico de FWD Academy. No es fuente diaria de decisiones técnicas. |

## Decisiones críticas vigentes — 2026-09-26

1. JavaScript/JSX, sin TypeScript.
2. Obsidian Precision Forge + Lava Orgánica (no son dos identidades separadas).
3. Dark + Light son requisitos. Tokens definidos en doc 04.
4. CRC es moneda principal; USD solo como equivalente configurado con fuente de tipo de cambio.
5. Home no muestra precios.
6. Solicitud personalizada NO es producto — nunca usa `quantity × unitPrice`.
7. `PENDING_QUOTE` no tiene precio final, cantidad ni subtotal.
8. Solo una cotización aprobada puede pagarse.
9. IA orienta; admin confirma precio. Etiqueta: `ORIENTATIVO · SUJETO A VALIDACIÓN`.
10. Admin: KPIs reales, gráficos útiles y resumen IA basado en datos existentes.
11. Ayuda accesible e inline (HelpDisclosure), no modales de pantalla completa.
12. API externa real y JWT deben quedar definidos antes de implementación.
13. Mobile 375 y tablet 768 se mockupean después de cerrar desktop.
14. No inventar datos, endpoints, capacidades ni métricas.
15. Navbar público de Stitch conservado como base visual; cambios quirúrgicos solamente.
16. Footer completo es para páginas públicas; dashboards pueden omitirlo.
17. React puede consumir un Webhook de N8N directamente para chatbot y resumen IA.
18. **Identidad transversal para HTML y React:** conservar la marca completa, no solo los colores. Reutilizar logo/isotipo, tipografías, geometría y tokens oficiales; jamás inventar un monograma o avatar de reemplazo. Al autorizar React, centralizar assets/tokens y validar cada componente dentro del contexto real de HF-01. Ver contrato obligatorio en `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md`.
19. **Documentación continua obligatoria:** cada agente actualiza `AI_CONTEXT.md` y el documento de dominio en el mismo bloque en que toma decisiones, cambia/valida algo o deja pendientes; nunca espera a que el usuario lo pida. Para HF-01, doc 05 registra el cambio y su estado, doc 04 conserva el sistema visual y las referencias, y este archivo deja el estado/punto de continuación. HF-01 es la especificación visual de máxima fidelidad para React: preservar las decisiones aprobadas de composición, navbar, botones, paneles, tipografía, geometría, espaciado, iconografía, estados, interacciones, responsive y accesibilidad; no limitar la continuidad a paleta/logo ni reemplazarla por UI genérica. Véase el protocolo de `AGENTS.md` y el contrato visual en docs 04/05.

## Regla de ciclo de solicitudes (crítica)

```
PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID
```

Salidas: `REJECTED`, `EXPIRED`, `CANCELLED`.

## Skills y repositorios de diseño de referencia

Las siguientes fuentes informan la investigación de diseño, revisión frontend y accesibilidad; no son mandatos visuales por sí mismas. Las reglas del proyecto están en `AGENTS.md` y doc 04, y las decisiones visuales aprobadas en HF-01 prevalecen:

| Skill | Repo / Fuente | Aplicación |
|---|---|---|
| Físicas y Animación | [Emil Kowalski / skills](https://github.com/emilkowalski/skills) + [Motion.dev](https://motion.dev/) + [GSAP](https://gsap.com/) + [React Spring](https://react-spring.dev/) + [Anime.js](https://animejs.com/) | Curvas, tiempos, físicas de resortes (springs), orquestación compleja, 60 fps, `prefers-reduced-motion` |
| Craft anti-slop | [Impeccable](https://github.com/pbakaus/impeccable) + [stop-slop](https://github.com/hardikpandya/stop-slop) | Prohibiciones de clichés, narrativa editorial, craft visual |
| Layout y tokens | [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) + [taste-skill](https://github.com/senlindesign/taste-skill) + [design.md](https://github.com/google-labs-code/design.md) | Geometría, paleta, spotlight interactivo |
| Accesibilidad | [W3C WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) + [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) | WCAG 2.2 AA, patrones de teclado, contraste |
| Copywriting técnico | [Humanizer](https://github.com/blader/humanizer) | Voz de taller costarricense, sin clichés de IA |
| Galerías de sitios | [Godly](https://godly.design/sites/) + [Awwwards](https://www.awwwards.com/) + [Siteinspire](https://www.siteinspire.com/) + [Land-book](https://land-book.com/) + [CSS Design Awards](https://www.cssdesignawards.com/) + [The FWA](https://thefwa.com/) + [CSS Nectar](https://cssnectar.com/) + [Curated](https://curated.design/) + [Httpster](https://httpster.net/) + [Minimal Gallery](https://minimal.gallery/) | Composición y dirección de arte; validar aparte claridad, mobile y accesibilidad |
| Flujos y pantallas de producto | [Mobbin](https://mobbin.com/) + [Refero](https://refero.design/) + [Pageflows](https://pageflows.com/) + [Lapa Ninja](https://www.lapa.ninja/) + [One Page Love](https://onepagelove.com/inspiration) + [Commerce Cream](https://commercecream.com/) | Estados reales de búsqueda, navegación, onboarding, formularios y compra |
| Componentes y movimiento React | [React Bits](https://reactbits.dev/) + [Motion Primitives](https://motion-primitives.com/docs) + [Magic UI](https://magicui.design/docs) + [Aceternity UI](https://ui.aceternity.com/components) + [shadcn/ui](https://ui.shadcn.com/) + [21st.dev](https://21st.dev/) | Ideas de componentes y movimiento: adaptar con criterio; revisar licencia (React Bits MIT + Commons Clause) y dependencias |
| Primitivas accesibles React | [Radix](https://www.radix-ui.com/primitives) + [Base UI](https://base-ui.com/react/overview/about) + [React Aria](https://react-aria.adobe.com/) + [Headless UI](https://headlessui.com/) + [Floating UI](https://floating-ui.com/) + [W3C APG](https://www.w3.org/WAI/ARIA/apg/) | Teclado, foco, semántica, lector de pantalla y posicionamiento; la documentación oficial sigue siendo autoridad |
| Skills y guías para agentes | [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) + [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) + [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Insumos potenciales para diseño/revisión asistidos por IA; no instalados, verificar versión/licencia y reconciliar con las reglas locales |
| UI conversacional con IA (futuro) | [Vercel AI Elements](https://github.com/vercel/ai-elements) | Referencia de estados de chat; usa Next.js, AI SDK, shadcn/ui y Tailwind: no integrar al HTML/Vite sin aprobación arquitectónica |
| Paneles y accesibilidad | [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) + [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover) + [W3C APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Capas, colisiones, foco, teclado y decisiones modal/no modal |

**Al diseñar o iterar cualquier pantalla, consultar estos repos y aplicar los criterios documentados en doc 04.**

El banco ampliado, el protocolo de comparación y las advertencias de licencias/compatibilidad están en la sección **“Investigación adicional: componentes, UI con IA y agentes frontend”** de doc 04. Consultar fuentes según la pregunta concreta; no adoptar de forma automática sus estética, paquetes o skills.

## Registro de continuidad — HF-01 definitivo — 2026-09-28

Este registro permite continuar el trabajo en un chat nuevo sin depender del historial de conversación.

### Archivos y regla de preservación

- **Candidato que se debe abrir y continuar:** `mockups/hf-01-home-definitivo.html`.
- **Referencia local original preservada:** `mockups/hf-01-home.html`.
- **Referencia remota preservada:** `mockups/hf-01-home-remoto-pruebas.html`.
- Los dos archivos de referencia no deben sobrescribirse ni editarse como parte de la siguiente iteración. El definitivo combina decisiones de ambos y es el único HTML de trabajo.

### Qué se hizo realmente

- Se conservó del local la dirección visual que el usuario prefirió: hero, catálogo, workbench, copy principal, footer y los iconos flotantes `✦` (chat) y `♿` (accesibilidad).
- Se incorporó del remoto la sensación más iterada: menú plegable de cuenta, jerarquía compacta, búsqueda, acciones de navbar y densidad de información.
- El navbar del definitivo usa una retícula de tres columnas para mantener los enlaces centrados en desktop; entre `821px` y `1120px` conserva los enlaces en formato compacto y solo por debajo de `820px` se repliega al menú.
- Chatbot y accesibilidad conservan los iconos del local, pero sus paneles ahora usan drawers compactos de geometría Vértice: regla superior lava, etiquetas `01 / ASISTENCIA` y `02 / CONTROL`, controles cuadrados, foco visible y botones táctiles de al menos `44px`.
- Se añadieron estados de apertura con `aria-expanded`/`aria-hidden`, roles de diálogo, gestión básica de foco y cierre con `Escape`. El cierre también está disponible mediante el botón de cierre o el mismo disparador; el cierre por clic externo no es una dependencia de este candidato.
- Se eliminó del copy del definitivo cualquier afirmación no definida por el proyecto, incluyendo “cámaras industriales”, “grado industrial”, “22µm SLA” y “18 piezas”. No inventar reemplazos técnicos sin validación del usuario o de los documentos.
- No se inició React, no se agregaron dependencias y no se convirtió automáticamente el mockup en componentes.
- Decisión posterior de navbar: el icono de persona no se usa como acceso separado; las tres barras son el único disparador del panel plegable y ese panel contiene navegación pública y todas las acciones de cuenta.
- Refinamiento visual posterior: el panel de barras usa las secciones `01 / NAVEGACIÓN` y `02 / MI ESPACIO`; el chatbot se presenta como `Mesa técnica Vértice` con consultas rápidas en filas verticales; accesibilidad se presenta como `Ajustes de lectura` con controles numerados y agrupados. No se agregaron capacidades de backend.
- Refinamiento visual pass 03: menú, asistencia y accesibilidad recibieron una composición propia, no solo cambios de copy: el menú ahora es un drawer de operaciones con jerarquía y estados hover, la asistencia usa una entrada editorial y filas de intención, y accesibilidad usa una introducción destacada más un bloque de controles agrupados. La revisión visual en navegador sigue pendiente de aprobación.

### Rediseño visual pass 04 — 2026-09-28

El diseño del pass 04 no estaba llegando al navegador porque sus reglas quedaban antes del pass 03 y eran sobrescritas. Se corrigió la cascada dejando el pass 04 como capa final activa en `mockups/hf-01-home-definitivo.html`. El menú plegable ahora es un drawer compacto de navegación y cuenta con cabecera `VÉRTICE / MENÚ PRINCIPAL`, numeración, estados hover y cuenta secundaria en dos columnas; el chatbot ahora es una herramienta de orientación con entrada acentuada, consultas como filas y zona de escritura separada; accesibilidad ahora es un panel utilitario de controles numerados, sin tarjetas anidadas innecesarias. Se mantuvieron los iconos locales `✦` y `♿`, el navbar centrado, el cierre por `Escape`, los estados ARIA y el comportamiento existente. El código de marca visible pasó a `3D / CR`: `3D` comunica el servicio y `CR` identifica Costa Rica, evitando la abreviatura ambigua `CR / AM`.

### Rediseño visual pass 05–06 — 2026-09-28

El feedback posterior pidió rehacer el CSS de las tres superficies, no solo cambiar textos. Se añadió una capa final en `mockups/hf-01-home-definitivo.html`: el menú usa un drawer editorial con cabecera, numeración, filas de navegación más legibles, cuenta primaria destacada y acciones secundarias; el chatbot usa una jerarquía de orientación → consultas → pregunta, con tipografía mayor y filas limpias; accesibilidad usa una introducción acentuada y controles de lectura/contraste/movimiento con objetivos táctiles amplios. El pass 06 corrigió la colisión de posicionamiento que dejaba chatbot y accesibilidad parcialmente fuera de la pantalla: ahora ambos paneles se anclan al viewport y limitan su altura de forma responsiva, manteniendo scroll solo cuando el viewport realmente lo exige. Se preservaron comportamiento, iconos `✦`/`♿`, estados ARIA, foco y cierre por `Escape`; no se inició React ni se agregaron dependencias.

La dirección visual se contrastó con criterios de [Emil Kowalski](https://github.com/emilkowalski/skills), [Radix Primitives](https://www.radix-ui.com/primitives), [Motion Primitives](https://motion-primitives.com/docs), [Impeccable](https://github.com/pbakaus/impeccable), [Godly](https://godly.design/) y [React Bits](https://reactbits.dev/). Se tomaron criterios de jerarquía, drawers, foco, movimiento y superficies; no se copió código ni se agregaron capacidades inexistentes.

### Cómo se aplicaron las skills y referencias

La skill local `asistente-desarrollo-web` se usó como criterio de revisión: cambios localizados, HTML/CSS/JS legible, comportamiento existente preservado y verificación en navegador. `Emil Kowalski/skills` orientó curvas, transiciones con `transform`/`opacity` y `prefers-reduced-motion`; `Impeccable` y `stop-slop` orientaron la eliminación de clichés, gradientes neón, copy genérico y tarjetas innecesariamente redondeadas; `taste-skill`, `UI/UX Pro Max` y `design.md` orientaron tokens, retícula, contraste y jerarquía; W3C APG/MDN orientaron teclado, foco y ARIA; Humanizer orientó una voz técnica cercana; Godly, Awwwards, Refero y React Bits se consultaron como referencias de dirección, composición y micro-interacción, no como código copiado. También se inspeccionaron Godly y React Bits en navegador para confirmar el tipo de jerarquía editorial y movimiento selectivo buscado.

### Verificación de esta iteración

- `mockups/hf-01-home-definitivo.html` respondió correctamente en `http://127.0.0.1:5173/mockups/hf-01-home-definitivo.html`.
- Se revisó visualmente en viewport desktop y en viewport reducido; en desktop el navbar queda centrado y en viewport reducido se activa el comportamiento responsive.
- Se abrieron y revisaron el menú de cuenta, búsqueda, chatbot y accesibilidad; los paneles cambiaron correctamente sus estados ARIA, la composición final se confirmó visualmente en navegador y no se observaron errores de consola durante la revisión.
- La pestaña del definitivo quedó marcada como entregable para revisión visual del usuario, pero el mockup sigue **NO CONGELADO**.

### Protocolo para la siguiente IA

1. Leer `AGENTS.md`, este archivo, `docs/00-INDICE-Y-MAPA.md`, `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` y `docs/05-AUDITORIA-HF-Y-MOCKUPS.md`.
2. Abrir el candidato definitivo en navegador y, si hace falta, comparar solo lectura con los dos archivos preservados.
3. Esperar el feedback visual del usuario y editar únicamente `mockups/hf-01-home-definitivo.html`, salvo que el usuario indique expresamente otra cosa.
4. No pasar a React ni crear HTML para HF-02/HF-05 hasta que el usuario apruebe HF-01 y exista el cierre mínimo de arquitectura/API indicado en los documentos.

### Punto de pausa — auditoría funcional pendiente — 2026-09-28

El usuario pausó antes de corregir navegación y funciones del HTML. **No se aplicaron cambios de código en esta auditoría.** El siguiente chat debe continuar desde `mockups/hf-01-home-definitivo.html` y revisar primero estos puntos:

- Varias rutas de demostración usan rutas absolutas (`/solicitud`, `/login`, `/registro`, `/cuenta`, `/carrito`, `/catalogo/...` y `/`); con el servidor estático del mockup pueden salir de la pantalla o devolver una ruta inexistente. Decidir con el usuario si deben simular navegación, apuntar a secciones existentes o quedar como rutas preparadas para React.
- `#chat-submit` tiene apariencia de acción funcional, pero todavía no tiene comportamiento conectado: debe mostrar una respuesta demo, un estado de procesamiento o quedar claramente marcado como preparación para React.
- Revisar coordinación entre búsqueda, menú de cuenta, menú móvil y paneles flotantes: al abrir uno, los demás deben cerrarse y sus estados `aria-expanded`/`aria-hidden` deben quedar sincronizados.
- Revisar foco y teclado en búsqueda, cuenta, menú móvil, pestañas del hero, chatbot y accesibilidad; comprobar `Escape`, `Tab`, `Shift+Tab`, `Enter` y flechas del visor.
- Revisar que el idioma no deje selectores o textos desincronizados y que los enlaces internos actualicen correctamente el estado visual de navegación.
- Verificar estados vacíos de búsqueda y errores de imagen/ruta sin romper la página.

### Cambio funcional aplicado después de la pausa

En `mockups/hf-01-home-definitivo.html` se eliminó `#account-toggle` y el menú de cuenta separado. `#menu-toggle` quedó visible también en desktop y abre el único panel plegable `#mobile-menu`, que contiene la navegación secundaria y el bloque `MI ESPACIO` con `Iniciar sesión`, `Crear cuenta`, `Mi cuenta`, `Carrito de productos` y `Nueva cotización`; la CTA principal `Cotizar STL` permanece en el navbar. El panel mantiene `aria-expanded`/`aria-hidden`, cierre por el mismo disparador, enlaces y `Escape`. Esta decisión responde directamente al feedback del usuario y debe trasladarse a React.

### Orden recomendado para retomar

1. Hacer una matriz de navegación del definitivo: elemento, destino actual, destino esperado y estado demo/real.
2. Probar cada interacción en navegador con consola limpia antes de editar.
3. Corregir primero rutas y estados de apertura/cierre; luego mejorar chatbot y teclado.
4. Volver a revisar desktop y responsive y registrar el resultado aquí y en doc 05.

### Aclaración de continuidad — desktop vs responsive — 2026-09-28

La diferencia observada entre el navegador externo y el navegador interno no corresponde a archivos distintos ni a un push incompleto. Ambos apuntan a `mockups/hf-01-home-definitivo.html`; el navegador externo estaba en desktop, aproximadamente `1365px`, y mostró navbar completo, búsqueda, CTA, hero visual y rail de piezas. El navegador interno tenía un viewport estrecho, aproximadamente `500px`, y activó el breakpoint responsive: los enlaces centrales se conservan entre `821px` y `1120px`, y se ocultan únicamente por debajo de `820px`, donde aparece el botón hamburguesa. Al abrirlo aparece el menú con navegación secundaria y el bloque de cuenta; la CTA `Cotizar STL` permanece en el navbar. No cambiar esta lógica por supuesto error de sincronización. Para futuras comparaciones visuales, usar el mismo ancho de viewport en ambos navegadores.

## Orden de trabajo vigente — 2026-09-26

1. **→ Iterar HF-01 Home.** ← ESTAMOS AQUÍ (NO ESTÁ CONGELADO). Es el único mockup HTML que se hará.
2. ~~Cerrar Dark/Light, ayuda y accesibilidad.~~ ✅ Definidos en doc 04.
3. Definir API externa + JWT concretamente (y arquitectura base).
4. **React.** (El resto de pantallas, incluyendo HF-02 y HF-05, se construirán directamente en React basándose en el diseño y la fundación técnica de HF-01).
5. Mockups mobile 375 / tablet 768 (o responsive en React directamente).
6. Design System formal en código.
7. Testing/integraciones/calidad.

## Orden Militar vs. Creatividad Visual

- **Ejecución y Flujo (Orden Militar):** Las reglas de negocio, la secuencia de mockups (solo HF-01), y el bloqueo de React son INQUEBRANTABLES.
- **Craft Visual y CSS (Libertad Creativa):** La IA tiene libertad para proponer e implementar layouts audaces, nuevas animaciones, micro-interacciones, y elevar el diseño usando las referencias de `Godly`, `Awwwards` y `Emil Kowalski`. No hay límites para hacer que HF-01 se vea espectacular y premium, siempre y cuando se mantenga dentro del mood general "Obsidian Precision Forge + Lava Orgánica".

## Regla de precedencia

Si un documento contradice una decisión posterior, prevalece la decisión posterior registrada aquí y en el documento de dominio. No crear nuevos Markdown si el tema ya tiene un hogar en los 11 documentos numerados.

## Regla de acompañamiento

Al cerrar cualquier bloque de trabajo, indicar:
- estado actual del proyecto;
- qué se terminó o cambió;
- qué sigue;
- 2–4 opciones posibles;
- cuál se recomienda y por qué.

RESPONDER SIEMPRE CON 1 PÁRRAFO A MENOS QUE SEA NECESARIO EXTENDER EL TEXTO.

### Iteración visual de menú y paneles — 2026-09-28

Esta iteración se registró como propuesta, pero el usuario rechazó el diseño del menú desplegable y pidió quitarlo, conservando el botón de tres barras. No reutilizar el panel ni presentarlo como aprobado. El botón queda; la función/estado siguiente debe confirmarse al retomar. Asistencia y accesibilidad tampoco están aprobadas. Las referencias ampliadas y el criterio para aplicarlas están en `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md`; HF-01 sigue NO CONGELADO y React sigue bloqueado.

Siguiente al retomar: decidir qué estado/función acompaña al botón de tres barras sin recrear el panel rechazado; después rediseñar y validar chatbot y accesibilidad con referencias específicas, en desktop y móvil, antes de pedir aprobación visual para congelar HF-01.

### Iteración del chatbot basada en referencias visuales — 2026-09-29

El usuario eligió del concepto generado por Gemini la ventana de geometría achaflanada (esquinas cortadas, ni totalmente cuadradas ni redondas) y pidió una conversación real, espaciosa, como el ejemplo de chat adjunto, no un bloque de opciones comprimido. Se actualizó solo el panel de chatbot en `mockups/hf-01-home-definitivo.html`: encabezado propio, mensaje de bienvenida, tres sugerencias como respuestas iniciales y compositor fijo inferior; se retiraron afirmaciones no confirmadas como “IA técnica”, “en línea” y funciones técnicas inventadas. En escritorio el panel queda a la izquierda de los botones flotantes; en móvil, encima de ellos para evitar colisión. En una segunda corrección se sustituyó la letra “V” provisional por el isotipo real de Vértice desde `mockups/favicon.png`, también usado en el avatar del mensaje; el microcopy del encabezado ahora sigue la firma “VÉRTICE CR / ASISTENCIA”, y el label dejó de usar forma de píldora genérica. Diseño aún pendiente de feedback explícito; no congela HF-01. No se cambió accesibilidad ni se inició React.

### Iteración visual chatbot: unión con workbench — 2026-09-29

Se añadió al final de `mockups/hf-01-home-definitivo.html` la capa `chat-identity-pass-02`: vidrio ahumado casi opaco y con blur, retícula tenue tomada del hero, contorno cobrizo facetado, montura para el isotipo, burbuja de bienvenida con borde asimétrico, rutas numeradas sin tarjetas y compositor inferior facetado. Se añadió movimiento discreto de borde/entrada con respeto a reducción de movimiento; sin cambio de paleta ni de funciones. Verificación a 900×570: composición junto a botones, `Escape` cierra y restablece ARIA, sin errores de consola. Pendiente revisión en navegador externo a ancho desktop y móvil, y aprobación del usuario; React sigue bloqueado. Referencias y justificación en docs 04/05.

### Corrección de criterio de referencias y movimiento — 2026-09-29

Queda supersedida la nota histórica “Mandato Reactbits” del 2026-09-28 en cuanto imponía glassmorphism/`blur(40px)`, radios de 12–16 px, escalado fijo y microinteracciones obligatorias en cada control. Esas reglas no fueron una aprobación visual del usuario y contradicen los tokens y la geometría de doc 04. Las referencias sirven para comparar soluciones concretas; ningún efecto, librería o estilo se vuelve obligatorio por aparecer en React Bits u otra galería. El movimiento se usa cuando informa o confirma una acción y respeta `prefers-reduced-motion`; cada componente React futuro debe derivarse de decisiones aprobadas en HF-01 y del sistema visual, una vez superados los gates.

### Banco ampliado de referencias frontend — 2026-09-29

Se investigaron galerías de sitios y flujos, bibliotecas de componentes/movimiento, primitivas accesibles y repositorios de skills para agentes; el inventario, su propósito y el protocolo de selección están en doc 04. No se modificó el mockup, no se inició React, no se instalaron dependencias ni skills. React Bits usa MIT + Commons Clause, por lo que hay que revisar su texto completo; Vercel AI Elements está ligado a un stack Next.js/AI SDK/shadcn/Tailwind y queda como referencia, no como integración aprobada. HF-01 sigue EN ITERACIÓN y no congelado. Próxima prioridad: retomar la auditoría de extremo a extremo con capturas inspeccionadas por vista/estado, usando estas fuentes para resolver dudas puntuales y registrando brechas antes de recomendar congelar.

### Punto de pausa y traspaso de guardia - Fin de sesión 2026-09-28

**Estado al cerrar la sesión:**
1. **Chatbot (Visual):** El rediseño visual del panel flotante del Vértice Brain fue implementado con éxito en `mockups/hf-01-home-definitivo.html` aislando su CSS con `<style id="ai-chat-style">` (ubicado a partir de la línea ~1059) y aplicando `!important` para sortear el CSS global heredado. El panel ahora tiene dimensiones correctas, usa "Obsidian Precision Forge", se ancla 120px arriba para no tapar los triggers, y el botón de submit recuperó su forma ovalada `pill` con el texto visible. El usuario aprueba esta estética.
2. **Documentación:** Se formalizaron e inyectaron las referencias premium de animación en `AI_CONTEXT.md` y `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` (GSAP, Anime.js, Framer Motion, React Spring, 21st.dev). Se definió a **Framer Motion** como herramienta clave para cumplir el "Mandato Reactbits". El código se comiteó y pusheó a la rama `Pruebas`.

**Qué debe hacer la próxima IA al retomar (Mañana):**
1. **Chatbot (Funcionalidad):** El diseño visual está listo, pero el usuario indicó que falta **iterar la funcionalidad (comportamiento JS/lógica)** del panel de chat y del panel de accesibilidad (ej. que la IA responda, que se abra el panel de ayuda, etc.). *Nota del usuario antes de dormir: "aun debemos iterar el chatbot y accesibilidad pero todavia no"*.
2. Cuando el usuario despierte y pida continuar, pregúntale si quiere **empezar directamente con la lógica JS del chatbot en el HTML** o si quiere avanzar con la arquitectura/React, recordando que React sigue bloqueado hasta tener el HTML y la arquitectura de API cerrados. No toques el CSS del chatbot a menos que el usuario lo pida explícitamente, ya que está aprobado visualmente.

### Continuación actual — 2026-09-29

El chatbot conserva la dirección que gustó al usuario. En la última iteración pidió flecha real para cada opción (no guion, círculo ni carácter tipográfico) y un marco exterior sin recortes. Se implementó una flecha SVG ascendente-diagonal inspirada en el affordance de navegación de shadcn/ui; permanece tenue en reposo y gana énfasis al hover/foco. Se quitó el `clip-path` del marco exterior y se le dio borde continuo con radios asimétricos suaves; las marcas circulares de la página principal se dejaron intactas. Esta iteración requiere confirmación visual en navegador con panel abierto, especialmente en móvil. El selector de tema conserva el comportamiento verificado: oscuro muestra sol para cambiar a claro y claro muestra luna para cambiar a oscuro. HF-01 no está congelado, accesibilidad sin aprobar y React continúa bloqueado.

### Movimiento y accesibilidad — continuación 2026-09-29

Se renovó el panel de accesibilidad y se reforzó la interacción en `mockups/hf-01-home-definitivo.html`: entrada/realce secuencial sutil para el panel, sus grupos y sugerencias del chat; control manual y respeto a `prefers-reduced-motion`; escala A/A+/A++; alto contraste que se adapta a Dark/Light; switches semánticos con `aria-checked`, etiqueta estable y descripción; preferencias persistentes y reset sincronizado; idioma ES/EN también para nombres accesibles. Los diálogos no modales ya no atrapan `Tab`; `Escape` y cierre restauran foco. Revisado por teclado en navegador desktop 900×570: escala, contraste claro, restablecimiento, apertura/cierre, atributos ARIA y desactivación de animación. Fuentes: [Emil Kowalski — review animations](https://github.com/emilkowalski/skills/blob/d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128/skills/review-animations/SKILL.md), [MDN — reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using_for_accessibility), [W3C APG — switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/). Pendiente: prueba visual en viewport móvil y revisión con lector de pantalla; sin afirmar conformidad WCAG completa. HF-01 sigue en iteración, accesibilidad todavía espera aprobación visual y React continúa bloqueado.

### Continuación visual — animación compartida de paneles — 2026-09-29

En HF-01, chatbot y accesibilidad usan ahora la misma entrada de panel (300 ms, misma curva y desplazamiento); el stagger de las sugerencias del chat se mantiene. El ajuste manual de movimiento reducido y `prefers-reduced-motion` desactivan ambas entradas. Aún falta validar los paneles en móvil; HF-01 no está congelado, accesibilidad requiere aprobación visual y React continúa bloqueado.

### Anotaciones del panel de accesibilidad — 2026-09-29

Se detectó que una regla heredada ocultaba el thumb del switch y que se mezclaban `aria-pressed` con `role="switch"`; se mostró el indicador y se unificó el estado en `aria-checked`. Verificado en navegador a 739×572: ambos controles alternan visual/semánticamente y reset los apaga. Se retiró numeración decorativa repetida de secciones, proceso, chat, accesos y panel, conservando datos técnicos reales. El texto aclara que idioma/tamaño son demo acotada a HF-01: en React, traducción y escala tipográfica deberán ser globales en todas las rutas y contenido dinámico, con persistencia acordada; no dar esto por cumplido por el comportamiento parcial del prototipo. Pendiente viewport móvil estrecho/aprobación visual. HF-01 sigue en iteración y React bloqueado.

### Continuación — búsqueda, menú y enlaces — 2026-09-29

En HF-01 se rehízo el buscador como popover pequeño anclado al header con marca Vértice; se restauró el menú como lista plegable (el usuario rechazó la pantalla completa) y se recuperó la flecha de “Ver ficha”. Se consultaron Algolia Autocomplete y el command menu de shadcn/ui; los criterios aplicados están en doc 04 y la auditoría en doc 05. El CSS está escrito pero falta captura verificable con paneles abiertos porque los disparadores no respondieron mediante el navegador de prueba. Retomar con screenshot de búsqueda abierta, menú abierto, enlace de ficha y viewport móvil; no marcar aprobado/congelado hasta revisión del usuario. React continúa bloqueado.

**Actualización de verificación del mismo bloque:** el buscador y el menú se abrieron por teclado y se capturaron en desktop a 948×572. La búsqueda presenta isotipo/material/referencia sin invadir el hero; el menú es una lista vertical compacta, sin scrim completo. La captura de fichas permitió corregir y verificar “Ver ficha ↗” una sola vez. Pendiente viewport móvil, Escape/retorno de foco, estados de resultados y pase global; HF-01 continúa sin congelar.

**Verificación de búsqueda completada parcialmente — 2026-09-29:** capturas de escritorio confirman que `nylon` filtra a un resultado y que una consulta sin coincidencias oculta resultados y muestra un estado vacío. Se corrigió la cascada que ignoraba `[hidden]`. El menú compacto y una sola flecha “Ver ficha ↗” también se capturaron en desktop. Aún faltan pruebas de Escape/retorno de foco, 390 px, lector de pantalla y auditoría visual global; no congelar HF-01 ni desbloquear React por este bloque.

### Diferencia del menú entre Brave y navegador local — 2026-09-29

La captura elegida es el popover “Mi Espacio” ya presente en el HTML; el navegador local estaba a 937 px y caía en la variante de navegación completa, activada hasta 1120 px. Como a 821–1120 px los enlaces centrales siguen visibles, se ajustó el breakpoint de interacción: `>820px` usa el popover de cuenta y `<=820px` conserva la lista plegable móvil. Captura posterior a 937 px y prueba móvil/Escape pendientes. Mantener el dropdown elegido como la referencia del estado tablet/desktop; HF-01 sigue EN ITERACIÓN y React bloqueado.

**Verificación posterior:** a 937×572 se capturó el panel compacto abierto (296×274 px), sin la lista de navegación duplicada. `Escape` actualizó los estados ARIA a cerrado y devolvió el foco al disparador. Falta revisar la rama `<=820px` con captura; HF-01 no está congelado.

### Punto de pausa y traspaso de guardia local — 2026-09-29

**Estado actual:**
El usuario iteró los detalles visuales faltantes del Chatbot, Accesibilidad y Menú en `mockups/hf-01-home-definitivo.html` (comiteado bajo el mensaje `hmtlhome01 para revicion de congelamiento`) y solicitó una **auditoría estrictamente visual** (espaciado, estética, alineación según "Obsidian Precision Forge") para determinar si la pantalla ya puede "congelarse". Debido a una limitación de red con Playwright, se pausó la revisión para continuar en otro entorno local.

**Qué hacer al retomar (Siguiente IA):**
1. Realizar o solicitar la revisión visual del Chatbot, Accesibilidad y Menú Hamburguesa. Validar que no haya textos muy grandes, botones deformes ni exceso de bordes (anti-slop).
2. Si la revisión es aprobada por el usuario, **declarar HF-01 formalmente CONGELADO**.
3. Iniciar el traspaso a React (Fase 4 del Roadmap) o definir el cierre de Arquitectura/API (Fase 3), según la prioridad del usuario.
