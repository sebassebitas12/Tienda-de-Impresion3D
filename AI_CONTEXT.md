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

**Última actualización:** 2026-09-16

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
| Fase 2 | Investigación y dirección visual | ✅ Completa (documentada, pendiente de formalizar en libro de marca) |
| Fase 3 | UX, user flows y mockups | ✅ Documentada en `docs/fase3_ux_user_flows_mockup.md`, pendiente de mockups de alta fidelidad |
| **Anteproyecto** | Documento académico formal — borrador generado con Gemini, pendiente de: nombre del estudiante, definir IA como asistente de cotización, adjuntar mockups | 🔄 **En progreso** |
| Libro de marca | Formalización de identidad visual | ⏳ Después del anteproyecto |
| Mockups HF | Alta fidelidad basada en wireframes existentes — **requeridos como anexo del anteproyecto antes del 21 de sept.** | 🔄 **Urgente** |
| Fase 4 | Design system en código | ⏳ Pendiente |
| Fase 5 | Arquitectura en código | ⏳ Pendiente |
| Fase 6 | Modelo de datos y contrato de API | ⏳ Pendiente |
| Fase 7–11 | Implementación, optimización, calidad, deploy, docs | ⏳ Pendiente |

### Qué hay en el repo ahora mismo

- `src/App.jsx` — **es el template de inicio de Vite**. No hay código de la tienda todavía.
- `db.json` — base de datos simulada completa y lista para JSON Server.
- `docs/` — documentación extensa: requisitos, arquitectura, métricas, UX, wireframes, dirección visual.
- No existe todavía: `src/pages/`, `src/features/`, `src/components/`, `src/services/`, `src/hooks/`, `src/context/`, `src/utils/`.

---

## Orden de trabajo acordado

El desarrollador acordó este orden antes de tocar código:

1. **Anteproyecto** — documento académico completo y coherente con lo que realmente se va a desarrollar.
2. **Libro de marca** — formalizar nombre, concepto, paleta, tipografías, logo, iconografía a partir de la dirección visual ya investigada.
3. **Mockups de alta fidelidad** — convertir los wireframes existentes en pantallas reales con la identidad del libro de marca.
4. **Implementación** — recién aquí se empieza a codear, usando los mockups como referencia.

**⚠️ No saltes a codear.** Si el anteproyecto, libro de marca o mockups no están marcados como completos arriba, la siguiente tarea es trabajar en el primero que esté pendiente.

---

## Documentos clave y dónde están

| Documento | Ubicación | Para qué sirve |
|-----------|-----------|----------------|
| Documento vivo del proyecto | `docs/Tienda de impresión 3D — Documento vivo del proyecto.md` | Historia completa del proyecto, fases, decisiones |
| Requisitos funcionales | `docs/REQUIREMENTS.md` | 34 RF priorizados con MoSCoW |
| Arquitectura | `docs/ARCHITECTURE.md` | Estructura de carpetas, responsabilidades, flujo de datos |
| Lógica de negocio | `docs/BUSINESS-LOGIC.md` | Reglas del negocio, cálculos, estados |
| Métricas | `docs/METRICS.md` | Fórmulas puras para el dashboard |
| Dirección visual | `docs/fase2_investigacion_direccion_visual.md` | Paleta, tipografía, personalidad de marca |
| UX y wireframes | `docs/fase3_ux_user_flows_mockup.md` | Flujos de usuario, wireframes, componentes UI |
| Testing | `docs/TESTING.md` | Guía de pruebas, cobertura mínima 70% |
| Base de datos | `db.json` | Datos simulados: usuarios, categorías, productos, pedidos |

---

## Decisiones tomadas y confirmadas

Estas decisiones ya fueron discutidas y aprobadas. No se reabren salvo que el desarrollador lo indique explícitamente.

| Fecha | Decisión |
|-------|----------|
| 2026-09-16 | Se crea `AI_CONTEXT.md` como archivo de orientación obligatorio para cualquier IA |
| 2026-09-16 | Orden de trabajo: anteproyecto → libro de marca → mockups HF → implementación |
| 2026-09-16 | Integración de IA definida: **asistente de cotización para impresión personalizada** |
| 2026-09-16 | El asistente de IA orienta al cliente (material, dimensiones, tiempo, precio orientativo) pero nunca da precio final — eso lo confirma el admin |
| 2026-09-16 | Librería de gráficos para el dashboard: **Recharts** |
| 2026-09-16 | Anteproyecto redactado con Gemini 2.0 Flash Thinking; revisión y ajustes pendientes |

---

## Integración de IA — Detalle

**Qué hace:** Asistente conversacional en la página de solicitud de impresión personalizada.

**Flujo:**
1. Cliente describe en lenguaje natural lo que quiere imprimir.
2. El asistente responde con: material recomendado y justificación, dimensiones aproximadas, tiempo estimado de producción, rango de precio orientativo.
3. El asistente aclara siempre que el precio final lo confirma el administrador (`PENDING_QUOTE`).
4. El cliente puede continuar el diálogo para ajustar detalles antes de enviar la solicitud formal.

**Implementación:** Llamada a API de IA (Claude o Gemini) con system prompt definido, desde `src/services/aiService.js`. No expone la API key en el cliente.

**Por qué esta integración:** Es útil para el modelo de negocio real, es demostrable en presentación, y conecta directamente con la regla de `PENDING_QUOTE`. Cumple el requisito de "obligatorio y lo más importante" de la rúbrica.

---

## Reglas que el desarrollador ya definió y no se negocian

1. JavaScript/JSX. Sin TypeScript.
2. Una solicitud de impresión personalizada nunca tiene precio `0` ni precio inventado. Su estado inicial es `PENDING_QUOTE`.
3. Los KPIs del dashboard se calculan desde `db.json` con funciones puras. Nunca números hardcodeados en componentes.
4. La UI no contiene lógica de negocio compleja.
5. Ninguna rama estable se rompe. El trabajo nuevo se valida antes de mergear.
6. Sin secretos en el repositorio.
7. La IA explica cada cambio que propone. No se acepta código que el desarrollador no pueda leer y mantener.

---

## Tareas pendientes concretas (próximos pasos)

En este orden exacto:

1. **Mockups HF** — generar al menos vista escritorio y vista móvil antes del 21 de sept. Herramienta: Stitch u otra IA. Se adjuntan como Anexo A y Anexo B del anteproyecto.
2. **Anteproyecto** — completar el borrador de Gemini: poner nombre del estudiante, cambiar "alguna librería de gráficos" por Recharts, precisar la IA como asistente de cotización, definir los 2 flujos N8N, adjuntar mockups.
3. **Libro de marca** — después de entregar el anteproyecto.
4. **Implementación** — después de tener libro de marca y mockups HF aprobados.

---

## Cómo actualizar este archivo

Cuando termines una fase o entregable, actualiza la tabla de estado arriba cambiando el emoji:

- `⏳ Pendiente` — no ha comenzado
- `🔄 En progreso` — trabajo activo ahora mismo
- `👀 En revisión` — hecho, verificando
- `✅ Completa` — verificada y cerrada
- `🚫 Bloqueada` — falta algo antes de continuar (anota qué)

Y actualiza la fecha de "Última actualización" al inicio de la sección de estado.