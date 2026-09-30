# AGENTS.md — Vértice CR

> **Última actualización:** 2026-09-29  
> **Estado:** ACTIVO  
> **Propósito:** instrucciones operativas para cualquier agente que trabaje en este repositorio.

## 1. Antes de tocar nada

Lee en este orden:

1. `AGENTS.md` — reglas operativas.
2. `AI_CONTEXT.md` — estado actual y punto de continuidad.
3. `docs/00-INDICE-Y-MAPA.md` — mapa y autoridad documental.
4. El/los documentos de dominio necesarios según la tarea.
5. El archivo exacto que vas a modificar.
6. Si la tarea es visual, usa `docs/04` como contrato de diseño y `docs/05` como historial/auditoría de HF.

**No edites por intuición ni por memoria del chat.** Primero inspecciona el estado real de la rama `Pruebas`.

## 2. Jerarquía de autoridad

Cuando exista conflicto:

1. Instrucción explícita y actual del usuario.
2. `AGENTS.md` para reglas operativas.
3. Decisiones vigentes del documento de dominio correspondiente (`docs/01–10`).
4. `AI_CONTEXT.md` como snapshot y punto de continuidad; no lo uses para contradecir una decisión de dominio.
5. `docs/05` y `docs/DECISIONES-POST-AUDITORIA.md` para historial, salvo que una decisión posterior las haya reemplazado.
6. `docs/ANTEPROYECTO_FINAL.md` para contexto académico, no para decisiones técnicas diarias.
7. `docs/auditoriaclaude.md` solo como auditoría histórica, nunca como fuente actual.

`docs/00-INDICE-Y-MAPA.md` sirve para navegar; no inventa decisiones.

Si el conflicto no puede resolverse con esta jerarquía, **detente, identifica el conflicto y no lo normalices silenciosamente**.

## 3. Clasifica la tarea antes de trabajar

Determina si el bloque es principalmente:

- **Visual / UX:** `03 + 04 + 05`.
- **Negocio / estados:** `01 + 02`.
- **Datos / API / auth / N8N:** `02 + 07`.
- **Arquitectura React:** `01 + 02 + 03 + 06 + 07 + 09 + 10`.
- **Admin / métricas / IA:** `02 + 08` y el dominio visual correspondiente.
- **Testing:** `09` y el dominio afectado.
- **Roadmap / planificación:** `10 + AI_CONTEXT`.

Para comenzar React por primera vez, lee como mínimo `01, 02, 03, 04, 06, 07, 09 y 10` además de `AGENTS`, `AI_CONTEXT` y `00`.

## 4. Modo de trabajo obligatorio

Sigue este ciclo:

**Entender → Inspeccionar → Contrastar → Planificar → Implementar → Verificar → Documentar → Entregar.**

Antes de editar, debes poder responder: qué cambia, por qué, qué archivo es la fuente de verdad, qué restricciones existen y cómo se va a verificar.

Haz cambios definitivos; evita parches temporales, código de prueba que se quede dentro del producto o cambios no relacionados.

## 5. No inventar

Nunca inventes:

- precios;
- métricas;
- clientes;
- endpoints;
- capacidades técnicas;
- integraciones;
- estados;
- disponibilidad;
- datos de catálogo;
- resultados de pruebas;
- capturas o inspecciones de navegador.

Cuando un dato sea experimental, márcalo como demo/propuesta. Cuando no esté respaldado, elimínalo o déjalo pendiente.

## 6. Mockups y fidelidad visual

`mockups/hf-01-home-definitivo.html` es el **mockup de máxima fidelidad de la Home** y la fuente visual para React una vez aprobado.

El HTML se evalúa como **artefacto de diseño**, no como implementación de producción.

Al auditarlo pregunta:

- ¿hay bugs visuales reales?
- ¿la identidad se mantiene?
- ¿el producto sigue siendo protagonista?
- ¿algo parece genérico o generado?
- ¿la composición vende?
- ¿la jerarquía funciona?
- ¿el responsive conserva la intención?
- ¿el movimiento tiene propósito?
- ¿qué sobra?
- ¿qué puede elevarse usando referencias externas?

No conviertas automáticamente el mockup en React. Lo aprobado se reproduce; lo pendiente permanece pendiente.

## 7. Referencias y diseño

Las referencias de `docs/04` sirven para **extraer principios**, no para copiar interfaces.

Cuando una referencia influya en una decisión, registra:

**Fuente → patrón observado → qué se adapta → por qué encaja con Vértice.**

Criterio visual base: **Obsidian Precision Forge + Lava Orgánica**.

Evita AI-slop: tarjetas anidadas sin necesidad, gradientes neón, glassmorphism gratuito, etiquetas decorativas repetitivas, icon tiles genéricos, números ornamentales y movimiento sin propósito.

La creatividad visual es amplia dentro de la identidad; la calidad debe aumentar, no volverse ruido.

## 8. React: reglas no negociables

- JavaScript/JSX; no TypeScript.
- No añadir dependencias sin una razón documentada y compatible con la arquitectura.
- La UI no accede directamente a JSON Server ni contiene reglas de negocio complejas.
- Servicios centralizan APIs y adaptadores.
- Cálculos de negocio importantes deben ser funciones puras.
- Estados `loading / success / empty / error / validation / processing` forman parte del producto.
- No sustituir decisiones visuales aprobadas por componentes genéricos de una librería.
- Mantener separación clara entre páginas, features, hooks, services, utils y estilos según `docs/06`.

## 9. Gate de React

React no comienza hasta que estén cerrados:

- alcance y negocio;
- rutas/flows principales;
- HF-01 aprobado visualmente;
- Dark/Light y accesibilidad definidos;
- arquitectura objetivo;
- contratos API/auth;
- modelo de datos normalizado;
- estrategia de testing.

Cuando el gate se abra, implementar en pequeños bloques verificables, no toda la aplicación de una vez.

## 10. Verificación

Después de cambios funcionales: ejecuta las pruebas disponibles, lint y build.

Después de cambios visuales: inspecciona los estados afectados en los breakpoints relevantes; si hay navegador conectado, úsalo. Si no existe evidencia de navegador, **no afirmes que hubo verificación visual**.

Nunca declares “aprobado”, “funciona” o “verificado” sin evidencia.

## 11. Documentación obligatoria

Cada bloque que cambie una decisión, diseño, código, dato o verificación debe actualizar en el mismo bloque:

- el documento de dominio;
- `AI_CONTEXT.md` con el estado actual y punto exacto para retomar.

No conviertas `AI_CONTEXT.md` en un diario kilométrico. Los detalles históricos viven en el documento de dominio correspondiente.

No crees otro Markdown si la información ya tiene un hogar existente.

## 12. Definition of Done

Un bloque no termina porque el código compile.

Debe quedar:

- correcto funcionalmente;
- coherente con negocio y arquitectura;
- visualmente alineado;
- accesible según el alcance;
- probado en los estados relevantes;
- documentado;
- sin contradicciones nuevas.

## 13. Comunicación

Responde de forma concisa y práctica. Al cerrar un bloque informa:

**Estado → terminado/cambiado → siguiente bloque → recomendación.**

Si existen varias rutas posibles, explica brevemente sus diferencias; no avances por una ruta distinta a la intención del usuario sin indicarlo.

## 14. Estado actual

- Rama de trabajo: `Pruebas`.
- Fase: **4 — Fundaciones React**.
- HF-01: **CONGELADO** (aprobación del usuario, 2026-09-30).
- React Gate: **ABIERTO** (todos los requisitos del gate superados).
- Mockup de referencia visual: `mockups/hf-01-home-definitivo.html` (congelado, no se edita).
- Siguiente bloque: orquestación del UI Kit (primitivas en `src/components/ui/`) y estructura de carpetas según `docs/06`.