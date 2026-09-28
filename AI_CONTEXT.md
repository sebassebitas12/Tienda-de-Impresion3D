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
| Físicas de animación | [Emil Kowalski / skills](https://github.com/emilkowalski/skills) | Curvas, tiempos, `will-change`, 60 fps, `prefers-reduced-motion` |
| Craft anti-slop | [Impeccable](https://github.com/pbakaus/impeccable) + [stop-slop](https://github.com/hardikpandya/stop-slop) | Prohibiciones de clichés, narrativa editorial, craft visual |
| Layout y tokens | [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) + [taste-skill](https://github.com/senlindesign/taste-skill) + [design.md](https://github.com/google-labs-code/design.md) | Geometría, paleta, spotlight interactivo |
| Accesibilidad | [W3C WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) + [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) | WCAG 2.2 AA, patrones de teclado, contraste |
| Copywriting técnico | [Humanizer](https://github.com/blader/humanizer) | Voz de taller costarricense, sin clichés de IA |
| Referencia visual | [Godly](https://godly.design/) + [Awwwards](https://www.awwwards.com/) + [Refero](https://styles.refero.design/) + [React Bits](https://reactbits.dev/) | Dirección de arte, componentes, dark mode industrial |

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
- El navbar del definitivo usa una retícula de tres columnas para mantener los enlaces centrados en desktop; desde `1120px` se repliega intencionalmente a menú compacto.
- Chatbot y accesibilidad conservan los iconos del local, pero sus paneles ahora usan drawers compactos de geometría Vértice: regla superior lava, etiquetas `01 / ASISTENCIA` y `02 / CONTROL`, controles cuadrados, foco visible y botones táctiles de al menos `44px`.
- Se añadieron estados de apertura con `aria-expanded`/`aria-hidden`, roles de diálogo, gestión básica de foco y cierre con `Escape`. El cierre también está disponible mediante el botón de cierre o el mismo disparador; el cierre por clic externo no es una dependencia de este candidato.
- Se eliminó del copy del definitivo cualquier afirmación no definida por el proyecto, incluyendo “cámaras industriales”, “grado industrial”, “22µm SLA” y “18 piezas”. No inventar reemplazos técnicos sin validación del usuario o de los documentos.
- No se inició React, no se agregaron dependencias y no se convirtió automáticamente el mockup en componentes.

### Cómo se aplicaron las skills y referencias

La skill local `asistente-desarrollo-web` se usó como criterio de revisión: cambios localizados, HTML/CSS/JS legible, comportamiento existente preservado y verificación en navegador. `Emil Kowalski/skills` orientó curvas, transiciones con `transform`/`opacity` y `prefers-reduced-motion`; `Impeccable` y `stop-slop` orientaron la eliminación de clichés, gradientes neón, copy genérico y tarjetas innecesariamente redondeadas; `taste-skill`, `UI/UX Pro Max` y `design.md` orientaron tokens, retícula, contraste y jerarquía; W3C APG/MDN orientaron teclado, foco y ARIA; Humanizer orientó una voz técnica cercana; Godly, Awwwards, Refero y React Bits se consultaron como referencias de dirección, composición y micro-interacción, no como código copiado. También se inspeccionaron Godly y React Bits en navegador para confirmar el tipo de jerarquía editorial y movimiento selectivo buscado.

### Verificación de esta iteración

- `mockups/hf-01-home-definitivo.html` respondió correctamente en `http://127.0.0.1:5173/mockups/hf-01-home-definitivo.html`.
- Se revisó visualmente en viewport desktop y en viewport reducido; en desktop el navbar queda centrado y en viewport reducido se activa el comportamiento responsive.
- Se abrieron y revisaron el menú de cuenta, búsqueda, chatbot y accesibilidad; los paneles cambiaron correctamente sus estados ARIA y no se observaron errores de consola durante la revisión.
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

### Orden recomendado para retomar

1. Hacer una matriz de navegación del definitivo: elemento, destino actual, destino esperado y estado demo/real.
2. Probar cada interacción en navegador con consola limpia antes de editar.
3. Corregir primero rutas y estados de apertura/cierre; luego mejorar chatbot y teclado.
4. Volver a revisar desktop y responsive y registrar el resultado aquí y en doc 05.

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
