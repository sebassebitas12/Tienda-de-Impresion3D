# AI_CONTEXT.md — Vértice CR

> Punto de entrada obligatorio para cualquier IA. Si no sabes dónde buscar, abre `docs/00-INDICE-Y-MAPA.md`.
> Última actualización: **2026-09-28**.

## Producto

Vértice CR es una tienda costarricense de impresión 3D con dos líneas: productos terminados e impresión personalizada con revisión y cotización.

## Estado del proyecto — 2026-09-26

| Dato | Valor |
|---|---|
| Rama activa | `Pruebas` |
| Fase | 3 — auditoría HF + cierre visual/UX |
| React | **BLOQUEADO** hasta cierre de HF desktop + Design System + API/JWT |
| Mockup HTML base preservado | `mockups/hf-01-home.html` (referencia local original, no sobrescribir) |
| Candidato actual de HF-01 | `mockups/hf-01-home-definitivo.html` (EN ITERACIÓN, NO CONGELADO) |
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

## Regla de ciclo de solicitudes (crítica)

```
PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID
```

Salidas: `REJECTED`, `EXPIRED`, `CANCELLED`.

## Skills y repositorios de diseño de referencia

Los siguientes repositorios están documentados en `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` (sección "Sistema de Criterios") y definen las reglas de craft, movimiento, anti-slop y accesibilidad del proyecto:

| Skill | Repo / Fuente | Aplicación |
|---|---|---|
| Físicas y Animación | [Emil Kowalski / skills](https://github.com/emilkowalski/skills) + [Motion.dev](https://motion.dev/) + [GSAP](https://gsap.com/) + [React Spring](https://react-spring.dev/) + [Anime.js](https://animejs.com/) | Curvas, tiempos, físicas de resortes (springs), orquestación compleja, 60 fps, `prefers-reduced-motion` |
| Craft anti-slop | [Impeccable](https://github.com/pbakaus/impeccable) + [stop-slop](https://github.com/hardikpandya/stop-slop) | Prohibiciones de clichés, narrativa editorial, craft visual |
| Layout y tokens | [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) + [taste-skill](https://github.com/senlindesign/taste-skill) + [design.md](https://github.com/google-labs-code/design.md) | Geometría, paleta, spotlight interactivo |
| Accesibilidad | [W3C WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) + [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) | WCAG 2.2 AA, patrones de teclado, contraste |
| Copywriting técnico | [Humanizer](https://github.com/blader/humanizer) | Voz de taller costarricense, sin clichés de IA |
| Referencia visual y UI | [Godly](https://godly.design/sites/) + [Awwwards](https://www.awwwards.com/) + [Refero](https://styles.refero.design/) + [21st.dev](https://21st.dev/) + [React Bits](https://reactbits.dev/) | Dirección de arte, micro-interacciones premium, composición completa y catálogos de React |
| Paneles y accesibilidad | [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) + [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover) + [W3C APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Capas, colisiones, foco, teclado y decisiones modal/no modal |

**Al diseñar o iterar cualquier pantalla, consultar estos repos y aplicar los criterios documentados en doc 04.**

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

### Hito de Diseño Premium y Mandato Reactbits - 2026-09-28
El usuario ha validado exitosamente el nivel de calidad visual y ha establecido una **regla de oro absoluta** para todo el futuro desarrollo en React:
**No se admiten componentes "slop", genéricos o estáticos.**
Cada botón, menú, dropdown, y tarjeta de producto deberá estar infundido con micro-interacciones inspiradas en las referencias documentadas (Reactbits, Emil Kowalski, Godly). Esto incluye:
- **Squircles y Glassmorphism:** Uso mandatorio de `backdrop-filter: blur(40px)`, sombras complejas (sombras externas para levitar, sombras internas / `inset` para dar definición) y radios de borde amplios (12px - 16px).
- **Animaciones y Transiciones Fluidas:** Toda aparición (dropdowns, modales, alertas) debe entrar escalando (`transform: scale(0.96)`) y desvaneciéndose fluidamente, NUNCA apareciendo de golpe con `display: block` sin transición.
- **Interacciones Táctiles:** Cada hover sobre elementos cliqueables debe producir un resultado táctil: íconos SVG que se escalan, se mueven (ej. flechas), o rotan suavemente.
- **Vara de Calidad React:** A partir de ahora, todas las iteraciones de React que reemplacen al HTML puro deberán mantener (o mejorar) este mismo nivel de craft. Este esfuerzo visual es donde el usuario pide "canalizar gran parte de la energía".

### Punto de pausa y traspaso de guardia - Fin de sesión 2026-09-28

**Estado al cerrar la sesión:**
1. **Chatbot (Visual):** El rediseño visual del panel flotante del Vértice Brain fue implementado con éxito en `mockups/hf-01-home-definitivo.html` aislando su CSS con `<style id="ai-chat-style">` (ubicado a partir de la línea ~1059) y aplicando `!important` para sortear el CSS global heredado. El panel ahora tiene dimensiones correctas, usa "Obsidian Precision Forge", se ancla 120px arriba para no tapar los triggers, y el botón de submit recuperó su forma ovalada `pill` con el texto visible. El usuario aprueba esta estética.
2. **Documentación:** Se formalizaron e inyectaron las referencias premium de animación en `AI_CONTEXT.md` y `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` (GSAP, Anime.js, Framer Motion, React Spring, 21st.dev). Se definió a **Framer Motion** como herramienta clave para cumplir el "Mandato Reactbits". El código se comiteó y pusheó a la rama `Pruebas`.

**Qué debe hacer la próxima IA al retomar (Mañana):**
1. **Chatbot (Funcionalidad):** El diseño visual está listo, pero el usuario indicó que falta **iterar la funcionalidad (comportamiento JS/lógica)** del panel de chat y del panel de accesibilidad (ej. que la IA responda, que se abra el panel de ayuda, etc.). *Nota del usuario antes de dormir: "aun debemos iterar el chatbot y accesibilidad pero todavia no"*.
2. Cuando el usuario despierte y pida continuar, pregúntale si quiere **empezar directamente con la lógica JS del chatbot en el HTML** o si quiere avanzar con la arquitectura/React, recordando que React sigue bloqueado hasta tener el HTML y la arquitectura de API cerrados. No toques el CSS del chatbot a menos que el usuario lo pida explícitamente, ya que está aprobado visualmente.
