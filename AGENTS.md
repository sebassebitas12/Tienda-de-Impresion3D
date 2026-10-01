# AGENTS.md — Vértice CR

> **Última actualización:** 2026-09-30
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

## 7.1 Skills, repos y referencias aportadas por el usuario

Cuando el usuario comparta una skill, repositorio, página, técnica, comando o workflow externo:

1. evalúa primero si resuelve un problema real del proyecto;
2. contrástalo con stack, arquitectura, licencias y decisiones vigentes;
3. si aporta, adapta solo la parte útil y documenta por qué;
4. si es redundante, incompatible, innecesario o añade complejidad sin beneficio, descártalo explícitamente;
5. no incorporar herramientas solo porque aparezcan en un video, lista o tendencia.

Las skills del proyecto viven preferentemente en `.agents/skills/<nombre>/SKILL.md` y deben ser pequeñas, enfocadas y basadas en tareas/repeticiones reales del proyecto. No crear skills solapadas ni mega-skills que dupliquen `AGENTS.md`.

## 7.2 Autoridad visual: HF-01 vs Stitch

**HF-01 congelado define el lenguaje visual del producto completo, no solo Home.**
Su identidad, geometría, superficies, tipografía, motion, densidad, iconografía y relación producto/interfaz deben expandirse de forma coherente a Tienda, Producto, Solicitud, Carrito, Checkout, Cuenta y Admin.

Los mockups de **Stitch/UXMagic** del repositorio se usan únicamente como referencia de:
- inventario de pantallas/rutas;
- contenido aproximado que necesita cada pantalla;
- estructura funcional y flujos;
- estados/casos de uso que no deben olvidarse.

**Stitch no tiene autoridad sobre estilo visual, componentes, chrome, paneles, botones, tarjetas, spacing ni motion.** No copiar su estética ni usarla para resolver una pantalla cuando HF-01 ya ofrece un lenguaje de diseño extrapolable.

Orden para decisiones visuales:
1. instrucción explícita actual del usuario;
2. decisiones visuales aprobadas registradas en docs/04 y docs/05;
3. HF-01 congelado como fuente visual primaria y sistema a expandir;
4. referencias externas aprobadas solo como apoyo técnico/inspiración puntual;
5. Stitch/UXMagic únicamente para alcance funcional/estructural, nunca como dirección estética.

## 8. React: reglas no negociables

- JavaScript/JSX; no TypeScript.
- No añadir dependencias sin una razón documentada y compatible con la arquitectura.
- La UI no accede directamente a JSON Server ni contiene reglas de negocio complejas.
- Servicios centralizan APIs y adaptadores.
- Cálculos de negocio importantes deben ser funciones puras.
- Estados `loading / success / empty / error / validation / processing` forman parte del producto.
- No sustituir decisiones visuales aprobadas por componentes genéricos de una librería.
- Mantener separación clara entre páginas, features, hooks, services, utils y estilos según `docs/06`.

## 8.1 Autenticación académica — decisión vigente

Por indicación explícita del profesor, Vértice **no tendrá backend real de autenticación** en esta entrega.

Contrato vigente:
- **JSON Server** es el backend académico y fuente local de usuarios/datos.
- `db.json.users` puede almacenar credenciales **demo** para login/registro académico.
- El **JWT es simulado en frontend** para demostrar sesión, expiración, roles y guards.
- El token simulado **no representa seguridad criptográfica real** y debe documentarse como tal.
- Login: buscar usuario por email en JSON Server, comparar credencial demo, validar `status`, generar token simulado y crear sesión.
- Registro: validar email único, crear usuario `customer/ACTIVE` en JSON Server, generar token simulado y crear sesión.
- Restore: leer sesión/token local, validar expiración y volver a consultar el usuario en JSON Server.
- Logout: limpiar token/sesión local.
- Admin: acceso por `role === "admin"` mediante guards.
- **N8N no participa en autenticación**; se reserva para IA/automatizaciones.

Esta decisión **supersede** cualquier instrucción anterior que prohibiera generar JWT simulado o almacenar credenciales demo en `db.json`. Sigue prohibido presentarlo como seguridad de producción.

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

### Gate CI obligatorio antes de entrega

Para cualquier cambio de código en `Pruebas`, no indicar al usuario que haga `pull` hasta que el commit final tenga GitHub Actions **verde** en `.github/workflows/verify.yml`.

El gate debe comprobar como mínimo:
- `npm ci`;
- `npm run lint`;
- `npm test`;
- `npm run check:ui`;
- `npm run build`.

Si falla un check:
1. inspeccionar logs;
2. corregir;
3. esperar una nueva ejecución;
4. repetir hasta verde.

El workflow ejecuta todos los checks aunque uno falle para obtener diagnóstico completo. **No sustituye la aprobación visual humana ni demuestra el render local**, pero sí bloquea entregas con errores de sintaxis, lint, tests o build.

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
- Auth académico ya está implementado y probado localmente; no reiniciar su implementación.
- Siguiente bloque: cerrar revisión visual de Home en Light y con Chat/Accesibilidad abiertos; después iniciar Admin operativo protegido por rol y, más adelante, IA/N8N.
