# AI_CONTEXT.md — Lee esto primero antes de hacer cualquier cosa

> Este archivo es el punto de entrada obligatorio para cualquier IA que trabaje en este repositorio.
> Está actualizado manualmente. Si el estado cambió y este archivo no lo refleja, pregunta al desarrollador antes de asumir nada.

---

## ¿Qué es este proyecto?

Una **tienda de impresión 3D** desarrollada como proyecto final de un curso de frontend. Tiene dos líneas de negocio:

1. **Productos terminados** — catálogo de gadgets, figuras, juguetes, decoración y piezas funcionales.
2. **Impresión personalizada** — cliente sube un archivo 3D o pide ayuda de diseño; el admin cotiza antes de confirmar.

No es un side project libre. Tiene una **rúbrica académica** que exige: React + React Router DOM, JSON Server, servicios locales y externos, autenticación, autorización por roles, CRUD, dashboard con métricas y gráficos, Jest, IA, N8N, responsive y accesibilidad.

**Stack:** React 19 + Vite 8, JavaScript (sin TypeScript), JSON Server (`db.json`), React Router DOM, Jest. Estilos propios (sin librería de componentes externa). Dark mode por defecto con toggle a light.

---

## Estado actual del proyecto

**Última actualización:** 2026-09-17

### Deadlines académicos

| Entregable | Fecha límite |
|------------|-------------|
| Anteproyecto escrito + mockups anexados | **21 de septiembre de 2026** |
| Entrega final del sistema completo | Según calendario del curso |

### Fases y su estado

| Fase | Descripción | Estado |
|------|-------------|--------|
| Fase 0 | Preparación del entorno (repo, Vite, estructura base) | ✅ Completa |
| Fase 1 | Producto y requisitos | ✅ Completa |
| Fase 2 | Investigación y dirección visual | ✅ Investigación completada; identidad todavía en consolidación |
| Fase 3 | UX, user flows y mockups | 🔄 Mockups HF en construcción |
| **Identidad visual** | Concepto, lenguaje visual, interacción y movimiento de Vértice CR | 🔄 En construcción |
| **Anteproyecto** | Documento académico formal — pendientes administrativos/documentales indicados en la documentación | 🔄 En progreso |
| Libro de marca | Formalización de identidad visual validada | ⏳ Posterior a la validación visual |
| Mockups HF | Desktop + mobile de las vistas necesarias | 🔄 **Urgente** antes del 21 de septiembre |
| Fase 4 | Design system en código | ⏳ Pendiente |
| Fase 5 | Arquitectura en código | ⏳ Pendiente |
| Fase 6 | Modelo de datos y contrato de API | ⏳ Pendiente |
| Fase 7–11 | Implementación, optimización, calidad, deploy, docs | ⏳ Pendiente |

---

## Qué hay en el repo ahora mismo

- `src/App.jsx` — **es el template de inicio de Vite**. No hay código de la tienda todavía.
- `db.json` — base de datos simulada completa y lista para JSON Server.
- `docs/` — documentación extensa: requisitos, arquitectura, métricas, UX, wireframes, dirección visual e identidad en construcción.
- No existe todavía: `src/pages/`, `src/features/`, `src/components/`, `src/services/`, `src/hooks/`, `src/context/`, `src/utils/`.

---

## Orden de trabajo vigente

El orden general se mantiene, pero la identidad visual se está refinando sobre el mockup base antes de formalizarla:

1. **Anteproyecto** — completar y dejar coherente con el producto real.
2. **Identidad visual en construcción** — auditar y evolucionar el mockup base hasta consolidar el lenguaje visual.
3. **Mockups de alta fidelidad** — completar desktop + mobile y validar todos los flujos necesarios.
4. **Libro de marca** — formalizar las decisiones visuales que ya hayan sido validadas.
5. **Design system** — convertir las decisiones estables en tokens, componentes y reglas.
6. **Implementación** — recién aquí se empieza a codear usando los mockups y el sistema visual como referencia.

**⚠️ No saltes a codear.** La implementación permanece bloqueada mientras la identidad y los mockups HF no estén aprobados.

Para el detalle exacto del recorrido visual utilizar `docs/IDENTITY-ROADMAP.md`.

---

## Documentos clave y dónde están

| Documento | Ubicación | Para qué sirve |
|-----------|-----------|----------------|
| Roadmap de identidad | `docs/IDENTITY-ROADMAP.md` | Recorrido completo desde Base V0 hasta identidad cerrada y preparación para implementación |
| Identidad visual en construcción | `docs/VISUAL-IDENTITY-WORKING.md` | Criterios visuales vigentes, auditoría y reglas de refinamiento |
| Mockups HF | `docs/fase3_mockups_hf.md` | Registro y estado de cada mockup |
| Documento vivo del proyecto | `docs/PROYECTO_VIVO.md` | Historia completa del proyecto, fases, decisiones |
| Requisitos funcionales | `docs/REQUIREMENTS.md` | 34 RF priorizados con MoSCoW |
| Arquitectura | `docs/ARCHITECTURE.md` | Estructura de carpetas, responsabilidades, flujo de datos |
| Lógica de negocio | `docs/BUSINESS-LOGIC.md` | Reglas del negocio, cálculos, estados |
| Métricas | `docs/METRICS.md` | Fórmulas puras para el dashboard |
| Dirección visual | `docs/fase2_investigacion_direccion_visual.md` | Investigación visual histórica y decisiones de referencia |
| UX y wireframes | `docs/fase3_ux_user_flows_mockup.md` | Flujos de usuario, navegación y criterios UX |
| Testing | `docs/TESTING.md` | Guía de pruebas, cobertura mínima 70% |
| Base de datos | `db.json` | Datos simulados: usuarios, categorías, productos, pedidos |

---

## Decisiones confirmadas

Estas decisiones ya fueron discutidas y aprobadas. No se reabren salvo que el desarrollador lo indique explícitamente.

| Fecha | Decisión |
|-------|----------|
| 2026-09-16 | Se crea `AI_CONTEXT.md` como archivo de orientación obligatorio para cualquier IA |
| 2026-09-16 | Nombre comercial de la tienda: **Vértice CR** |
| 2026-09-16 | Integración de IA definida: **asistente de cotización para impresión personalizada** |
| 2026-09-16 | El asistente orienta al cliente (material, dimensiones, tiempo, precio orientativo) pero nunca da precio final — eso lo confirma el admin |
| 2026-09-16 | Librería de gráficos para el dashboard: **Recharts** |
| 2026-09-16 | Proyecto de dos personas: desarrollador frontend + especialista en impresión 3D |
| 2026-09-16 | Valores de marca: confianza, seguridad, calidad, "encontrarás lo que necesitás" |
| 2026-09-17 | El mockup de v0 se considera **Base V0 / referencia visual**, no implementación final |
| 2026-09-17 | La creatividad de herramientas generativas se puede conservar si aporta valor; se audita y adapta en lugar de descartarla por su origen |
| 2026-09-17 | La identidad final se construye mediante auditoría, refinamiento, interacción, movimiento, validación y documentación |
| 2026-09-17 | Cada decisión, duda, descarte o experimento que pueda afectar diseño o implementación debe quedar documentado |

---

## Identidad visual — reglas vigentes

Vértice CR busca una identidad elegante, futurista, técnica, industrial y creativa, con sensación premium y lenguaje accesible.

La dirección actualmente explorada parte de una estética oscura con naranja/lava y materialidad volcánica, pero **la paleta final todavía no está cerrada**.

La identidad no dependerá únicamente de color. Debe construirse con:

```text
color
+
materialidad
+
geometría
+
tipografía
+
profundidad
+
iluminación
+
interacción
+
movimiento
```

El mockup base de v0 es un benchmark visual válido. No se debe migrar mecánicamente de TypeScript a JSX: primero se estudian y documentan sus decisiones visuales y técnicas, y posteriormente se reconstruyen en el stack real.

---

## Integración de IA — Detalle

**Qué hace:** Asistente conversacional en la página de solicitud de impresión personalizada.

**Flujo:**
1. Cliente describe en lenguaje natural lo que quiere imprimir.
2. El asistente responde con: material recomendado y justificación, dimensiones aproximadas, tiempo estimado de producción, rango de precio orientativo.
3. El asistente aclara siempre que el precio final lo confirma el administrador (`PENDING_QUOTE`).
4. El cliente puede continuar el diálogo para ajustar detalles antes de enviar la solicitud formal.

**Implementación:** Llamada a API de IA (Claude o Gemini) con system prompt definido, desde `src/services/aiService.js`. No expone la API key en el cliente.

**Por qué esta integración:** Es útil para el modelo de negocio real, es demostrable en presentación, y conecta directamente con la regla de `PENDING_QUOTE`.

---

## Reglas que el desarrollador ya definió y no se negocian

1. JavaScript/JSX. Sin TypeScript.
2. Una solicitud de impresión personalizada nunca tiene precio `0` ni precio inventado. Su estado inicial es `PENDING_QUOTE`.
3. Los KPIs del dashboard se calculan desde `db.json` con funciones puras. Nunca números hardcodeados en componentes.
4. La UI no contiene lógica de negocio compleja.
5. Ninguna rama estable se rompe. El trabajo nuevo se valida antes de mergear.
6. Sin secretos en el repositorio.
7. La IA explica cada cambio que propone. No se acepta código que el desarrollador no pueda leer y mantener.
8. No se asume una decisión que no esté documentada.

---

## Tareas actuales

### Prioridad 1 — Identidad visual + mockups HF

Seguir `docs/IDENTITY-ROADMAP.md` en este orden:

1. Auditar las ocho piezas de la Base V0.
2. Consolidar concepto, color, tipografía, geometría, materialidad e iluminación.
3. Definir sistema de interacción.
4. Definir sistema de movimiento.
5. Construir conceptualmente Home V1.
6. Completar mockups públicos.
7. Completar auth, cliente y admin.
8. Ejecutar auditoría de coherencia global.
9. Formalizar libro de marca.
10. Preparar design system.

### Prioridad 2 — Anteproyecto

Mantenerlo sincronizado con las decisiones reales y adjuntar los mockups requeridos.

### No hacer todavía

- implementar la tienda;
- migrar el código de v0 directamente;
- instalar dependencias solo porque aparezcan en un mockup;
- cerrar prematuramente la paleta o las animaciones;
- crear funciones fuera del MVP.

---

## Cómo actualizar este archivo

Cuando cambie el estado real del proyecto, actualizar la fecha, la tabla de fases, las tareas actuales y las decisiones relevantes.

Estados permitidos:

- `⏳ Pendiente`
- `🔄 En progreso`
- `👀 En revisión`
- `✅ Completa`
- `🚫 Bloqueada`

**Regla:** si algo cambió en el proyecto y este archivo no lo refleja, el contexto está desactualizado.
