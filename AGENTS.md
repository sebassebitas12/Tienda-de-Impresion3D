# AGENTS.md — Vértice CR

## Propósito

Este archivo es el contrato operativo para cualquier agente de IA que trabaje en `Tienda-de-Impresion3D`. Su objetivo no es decirle al agente qué código escribir, sino **cómo pensar, decidir, revisar y trabajar** para mantener continuidad con el proyecto.

## 1. Antes de tocar nada

Leer primero, en este orden:

1. `AI_CONTEXT.md`
2. `docs/DECISIONES-HF-POST-AUDITORIA-2026-09-24.md`
3. `docs/IDENTITY-ROADMAP.md`
4. `docs/VISUAL-IDENTITY-WORKING.md`
5. `docs/fase3_mockups_hf.md`
6. Los documentos específicos de requisitos, lógica, métricas, arquitectura o testing solo cuando la tarea los necesite.

No asumir que un documento antiguo sigue siendo válido solo porque existe. Si dos documentos contradicen una decisión posterior, prevalece la decisión más reciente registrada en `AI_CONTEXT.md` o en las decisiones HF.

## 2. Filosofía de trabajo

Piensa como un **product designer + frontend senior + arquitecto**, no como un generador de código.

Antes de implementar, responde mentalmente:

- ¿Qué problema real resuelve esto?
- ¿El usuario entiende qué puede hacer?
- ¿La acción principal está clara?
- ¿El estado de la interfaz coincide con el estado real del negocio?
- ¿Los datos necesarios existen realmente?
- ¿Esta decisión afecta otras pantallas?
- ¿Estoy agregando complejidad porque aporta valor o porque "se ve profesional"?
- ¿La solución sigue funcionando en móvil, teclado, estados de error y reduced motion?
- ¿Esto pertenece al MVP?

Cuando haya varias soluciones posibles, elige la que tenga mejor relación entre **claridad, utilidad, coherencia y complejidad**. No agregues funciones solo para hacer el proyecto más grande.

## 3. Regla de oro: no inventar

Nunca inventar:

- precios finales;
- métricas;
- conversiones monetarias;
- disponibilidad;
- estados de pedidos;
- capacidades de IA;
- integraciones externas;
- datos de clientes;
- resultados de negocio.

Los datos mostrados en dashboards deben poder derivarse de `db.json` o de una fuente explícitamente definida.

Las funciones de cálculo deben ser puras y testeables.

## 4. Regla crítica de cotizaciones

Una solicitud personalizada **NO es un producto de catálogo**.

Ciclo MVP:

`PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID`

Salidas:

`REJECTED`, `EXPIRED`, `CANCELLED`

Reglas:

- `PENDING_QUOTE` no tiene precio final.
- Un rango generado por IA es orientativo.
- Solo el admin emite la cotización final.
- Solo una cotización aprobada puede entrar al pago.
- Una solicitud pendiente nunca puede aparecer como producto con precio × cantidad.
- El pedido generado después del pago debe conservar `requestId`.
- Carrito y checkout deben distinguir productos de catálogo de solicitudes personalizadas.

La referencia visual para este patrón es HF-13.

## 5. Identidad visual

Dirección vigente:

**Obsidian Precision Forge + Lava Orgánica**

No son dos temas separados.

### Obsidian Precision Forge

Define:

- estructura;
- precisión;
- superficies;
- tipografía;
- densidad técnica;
- lenguaje industrial.

### Lava Orgánica

Aporta:

- profundidad;
- iluminación térmica;
- materialidad;
- formas fluidas selectivas;
- energía visual.

Paleta conceptual:

- obsidiana/carbono para fondos;
- superficies carbón cálidas;
- naranja térmico como acento;
- verde calibrado para estados funcionales.

Tipografía conceptual:

- **Space Grotesk** para comunicación y estructura.
- **JetBrains Mono** para datos técnicos, estados, medidas y telemetría.

Evitar:

- estética gamer;
- exceso de glow;
- interfaces genéricas de IA;
- arcoíris;
- partículas decorativas constantes;
- apariencia de DevOps interno;
- literalidad de "lava" como fantasía.

El producto debe ser el protagonista.

## 6. Diseño antes que código

React permanece bloqueado mientras las decisiones visuales y de negocio necesarias para una pantalla no estén cerradas.

Orden correcto:

`problema → flujo → estados → mockup → revisión → design system → arquitectura → implementación`

No convertir automáticamente un mockup en código.

Un mockup es una referencia visual, no un contrato de datos.

## 7. Auditoría de pantallas

Al revisar una pantalla, comprobar siempre:

1. Jerarquía visual.
2. Acción principal.
3. Utilidad real.
4. Coherencia con el modelo de negocio.
5. Estados: loading, success, empty, error, disabled, processing.
6. Responsive: ~375 / ~768 / 1280+.
7. Accesibilidad.
8. Motion y reduced motion.
9. Consistencia monetaria.
10. Consistencia de marca.

Si una pantalla es bonita pero representa mal el negocio, **se corrige el negocio antes que la estética**.

## 8. Dashboards

El dashboard admin es una herramienta diaria, no una demostración de gráficos.

KPIs principales:

- ventas cobradas en el período;
- pedidos activos;
- solicitudes personalizadas pendientes;
- productos con stock bajo.

Gráficas:

- ventas por período;
- pedidos por estado;
- solicitudes por estado;
- productos más vendidos.

Agregar un gráfico solo si responde una pregunta operativa concreta.

No usar métricas como CAC, LTV, churn, payback o rentabilidad si el modelo no contiene los datos necesarios.

El dashboard de usuario debe mostrar únicamente información útil para ese usuario: pedidos, cotizaciones, solicitudes en revisión, archivos/modelos y datos de cuenta/facturación.

## 9. Moneda

La moneda operativa es **CRC**.

- CRC es principal.
- USD solo como equivalente secundario cuando exista fuente de tipo de cambio.
- Nunca hacer conversiones hardcodeadas dentro de componentes.
- Home no muestra precios.

## 10. Arquitectura futura

Objetivo:

`UI → Pages / Features → Hooks + Services + Utils → JSON Server / APIs / IA → db.json`

Reglas:

- UI sin lógica de negocio compleja.
- Services centralizan acceso a datos.
- Utils contienen cálculos puros.
- Hooks orquestan comportamiento reutilizable.
- No duplicar llamadas HTTP en componentes.
- No mezclar contrato de API con presentación.
- JavaScript/JSX solamente; **no TypeScript**.
- React + Vite.
- React Router DOM.
- JSON Server para MVP.
- Recharts para gráficas.
- Jest + React Testing Library.
- No Redux/Zustand salvo necesidad real posterior.

## 11. Calidad

Antes de declarar una tarea terminada:

- revisar imports;
- revisar rutas;
- revisar estados;
- revisar responsive;
- revisar accesibilidad;
- revisar errores y estados vacíos;
- revisar que no haya datos hardcodeados incorrectamente;
- ejecutar/validar tests cuando corresponda;
- comprobar que el cambio no rompe otra pantalla;
- actualizar documentación solo cuando la decisión sea relevante.

No esconder problemas para que "se vea terminado".

## 12. Documentación

Evitar crear Markdown por cada decisión pequeña.

Preferir:

- `AI_CONTEXT.md` para contexto y continuidad;
- `docs/DECISIONES-HF-POST-AUDITORIA-2026-09-24.md` para decisiones HF;
- documentos específicos existentes para requisitos, negocio, métricas, arquitectura y testing.

Antes de crear un nuevo documento, comprobar si la información pertenece a uno existente.

La documentación debe explicar **por qué** existe una decisión, no repetir todo el proyecto.

## 13. Cómo manejar contradicciones

Si encuentras una contradicción:

1. Identificarla.
2. Buscar la decisión más reciente.
3. Determinar qué archivos dependen de ella.
4. Corregir la fuente secundaria.
5. No crear otra versión paralela de la verdad.
6. Si la contradicción cambia el negocio o arquitectura, documentarla explícitamente.

Nunca "resolver" una contradicción simplemente ignorándola.

## 14. Protocolo de respuesta del agente

Toda respuesta al usuario debe separar claramente:

**TRABAJO HECHO**
- Cambios realmente realizados en el repositorio, archivos, commits, investigación o validaciones.
- Nunca afirmar implementación si solo se razonó o propuso algo.

**EXPLICACIÓN**
- Contexto, hallazgos, decisiones o recomendaciones cuando no hubo modificación real.

Si hubo ambas cosas, usar ambas secciones. Mantener la respuesta breve y práctica. El usuario quiere saber cuánto trabajo real se hizo frente a cuánto se explicó.

Cuando el agente investigue referencias externas, indicar qué fuentes se consultaron y qué decisión concreta aportó cada una. No usar una referencia solo por popularidad.

## 15. Investigación y referencias externas

El agente tiene permiso para investigar a fondo antes de tomar decisiones de diseño, UX, arquitectura o implementación cuando la investigación pueda mejorar el resultado.

Jerarquía:

1. Documentación oficial / repositorio original.
2. Implementaciones reales de productos reconocidos.
3. Estudios, guías técnicas y fuentes especializadas.
4. Galerías de inspiración.
5. Redes sociales como fuente de descubrimiento, nunca como prueba de calidad.

Para referencias de diseño:

- Analizar **qué problema resuelve** el patrón.
- Separar inspiración de evidencia.
- No copiar una marca completa.
- Extraer principios, composición, interacción, motion, accesibilidad y trade-offs.
- Verificar licencia antes de reutilizar código/assets.
- Registrar referencias útiles en el documento de referencias del proyecto.
- Si una herramienta promete "mejor UI" pero no hay evidencia suficiente, tratarla como experimento, no como autoridad.

Fuentes de inspiración visual como Instagram, TikTok, Awwwards o galerías sirven para descubrir patrones; no convierten automáticamente un patrón en una buena decisión para Vértice.

## 16. Stack de criterio recomendado

Estas referencias han sido auditadas para este proyecto:

### Incorporar como criterio

- **Emil Kowalski / skills** — motion, microinteractions y decisiones de animación. Útil especialmente para transiciones, hover, enter/exit y reduced motion. urlRepositorio oficialhttps://github.com/emilkowalski/skills
- **Impeccable** — auditoría anti-slop, lenguaje de diseño, refinamiento y detección de patrones genéricos. Muy útil para revisar Vértice antes de implementar. urlRepositorio oficialhttps://github.com/pbakaus/impeccable
- **UI/UX Pro Max** — catálogo estructurado de estilos, paletas, tipografías, UX, charts, iconografía y stacks. Útil como fuente de búsqueda, no como identidad automática. urlRepositorio oficialhttps://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **senlindesign/taste-skill** — reverse engineering de sitios: tokens + decisiones + razones. Especialmente útil cuando encontremos una referencia real que queramos estudiar sin copiarla. urlRepositorio oficialhttps://github.com/senlindesign/taste-skill
- **Google DESIGN.md** — formato para mantener identidad visual persistente entre agentes. Es la referencia conceptual para nuestro futuro `DESIGN.md`. urlEspecificación oficialhttps://github.com/google-labs-code/design.md
- **VoltAgent/awesome-design-md** — biblioteca de DESIGN.md basados en productos reales; útil para estudiar patrones y comparar sistemas. urlColección oficialhttps://github.com/VoltAgent/awesome-design-md
- **Spec Kit** — disciplina spec → plan → tasks → implementación → verificación. Útil para la fase de arquitectura e implementación, no para decidir estética. urlRepositorio oficialhttps://github.com/github/spec-kit
- **React Bits** — biblioteca de componentes/animaciones React. Útil como catálogo de ideas y componentes candidatos; usar solo lo que encaje con la identidad y nuestro stack JS. urlSitio oficialhttps://reactbits.dev/
- **Refero Styles** — referencias de sistemas visuales reales y extracción de DESIGN.md/tokens. Útil para estudiar marcas y patrones concretos. urlRefero Styleshttps://styles.refero.design/
- **Godly** — galería curada de sitios reales para descubrir layout, ecommerce, motion y composición. Útil para investigación visual. urlGodlyhttps://godly.design/
- **Awwwards** — fuente de inspiración y tendencias; útil para descubrir ideas, pero no tratar sus ganadores como autoridad UX por sí solos. urlAwwwardshttps://www.awwwards.com/

### Útiles, pero no parte del núcleo

- **Leonxlnx/taste-skill** — potente para evitar interfaces genéricas y explorar estilos, pero su alcance es amplio y la versión actual se describe como experimental. Usarlo como referencia secundaria, no como regla absoluta. urlRepositorio oficialhttps://github.com/Leonxlnx/taste-skill
- **hardikpandya/stop-slop** — útil como idea anti-slop; no lo convertir en autoridad de diseño. Revisar antes de adoptar reglas. urlRepositorio oficialhttps://github.com/hardikpandya/stop-slop
- **Egonex-AI/Understand-Anything** — útil cuando el proyecto crezca y necesitemos comprender un codebase grande mediante grafo; no aporta directamente al diseño actual. urlRepositorio oficialhttps://github.com/Egonex-AI/Understand-Anything
- **Humanizer** — útil para texto generado por IA, no para UI/UX. No debe alterar el tono técnico de Vértice automáticamente. urlRepositorio oficialhttps://github.com/blader/humanizer

### No convertir en dependencias del proyecto ahora

Estas referencias se usarán como investigación/catálogo, no se instalarán automáticamente. No agregar skills, librerías, CLI, MCPs o dependencias solo porque aparezcan en una referencia.

## 17. DESIGN.md

El proyecto debe tener un `DESIGN.md` como fuente visual persistente cuando la identidad esté suficientemente cerrada. Debe contener tokens + intención + reglas de uso + anti-patrones, no una copia de una marca externa.

Debe complementar a `AGENTS.md`:

- `AGENTS.md` = cómo pensar y trabajar.
- `DESIGN.md` = cómo debe verse y comportarse visualmente.
- `AI_CONTEXT.md` = estado y memoria del proyecto.

No duplicar el contenido completo entre los tres.

## 18. Criterio de selección de referencias

Una referencia entra al proyecto solo si aporta al menos uno de:

- mejor jerarquía;
- mejor interacción;
- mejor accesibilidad;
- mejor responsive;
- mejor motion;
- mejor conversión/claridad;
- mejor consistencia de sistema;
- mejor comprensión del negocio.

La pregunta no es "¿se ve bonito?", sino **"¿qué aprendemos de esto y dónde lo aplicamos?"**.

## 19. Forma de trabajar con el usuario

El usuario prefiere respuestas breves y prácticas, normalmente de un párrafo salvo que el trabajo requiera más.

Pero el agente debe **trabajar de verdad**, no llenar la respuesta con teoría.

Si tiene acceso al repositorio:

- inspeccionar primero;
- modificar directamente cuando la tarea esté suficientemente definida;
- verificar el resultado;
- informar exactamente qué se hizo.

No decir que algo fue implementado si solo se explicó.

## 20. Criterio de seniority

No optimizar para "más features".

Optimizar para:

**menos contradicciones + mejor UX + datos reales + arquitectura limpia + estados completos + identidad memorable.**

Una solución sencilla y coherente es preferible a una solución grande pero artificial.

## 21. Regla de continuidad

Antes de continuar una sesión, revisar el estado real del repositorio y no confiar únicamente en el último mensaje del usuario.

Después de cada cambio importante:

- dejar el repositorio en un estado coherente;
- actualizar la documentación relevante;
- indicar el siguiente paso lógico.

### Estado conocido de esta etapa

Rama de trabajo: `Pruebas`.

La implementación React sigue bloqueada hasta cerrar la fase visual y las decisiones de negocio pendientes.

El siguiente trabajo prioritario es continuar la corrección de los mockups según la auditoría, empezando por las pantallas críticas de carrito/checkout y después las restantes, antes de pasar a Design System y React.
