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

**Última actualización:** 2026-09-24

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
| **Anteproyecto** | Documento académico formal — mockups incorporados; pendientes administrativos y N8N | 🔄 En progreso |
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

1. **Anteproyecto** — completar y dejar coherente con el producto real.
2. **Identidad visual en construcción** — auditar y evolucionar el mockup base hasta consolidar el lenguaje visual.
3. **Mockups de alta fidelidad** — completar desktop + mobile y validar todos los flujos necesarios.
4. **Libro de marca** — formalizar las decisiones visuales que ya hayan sido validadas.
5. **Design system** — convertir las decisiones estables en tokens, componentes y reglas.
6. **Implementación** — recién aquí se empieza a codear usando los mockups y el sistema visual como referencia.

**⚠️ No saltes a codear.** La implementación permanece bloqueada mientras la identidad y los mockups HF no estén aprobados.

Para el detalle exacto del recorrido visual utilizar `docs/IDENTITY-ROADMAP.md`.

---

## Documentos activos y dónde están

| Documento | Propósito |
|---|---|
| `AI_CONTEXT.md` | Fuente principal de estado y decisiones |
| `docs/DECISIONES-HF-POST-AUDITORIA-2026-09-24.md` | Decisiones cerradas de la auditoría HF y siguiente secuencia |
| `docs/fase3_mockups_hf.md` | Registro maestro de mockups HF |
| `docs/IDENTITY-ROADMAP.md` | Proceso de cierre de identidad |
| `docs/VISUAL-IDENTITY-WORKING.md` | Lenguaje visual vigente |
| `docs/fase3_ux_user_flows_mockup.md` | UX, rutas y flujos |
| `docs/REQUIREMENTS.md` | Requisitos funcionales |
| `docs/BUSINESS-LOGIC.md` | Reglas de negocio |
| `docs/METRICS.md` | Métricas y fórmulas |
| `docs/ARCHITECTURE.md` | Arquitectura objetivo |
| `docs/TESTING.md` | Estrategia de pruebas |
| `docs/PROYECTO_VIVO.md` | Historial del proyecto |

Los demás documentos de exploración que no sean fuente activa fueron retirados para evitar contradicciones y duplicación.

---

## Decisiones confirmadas

Estas decisiones ya fueron discutidas y aprobadas. No se reabren salvo que el desarrollador lo indique explícitamente.

| Fecha | Decisión |
|-------|----------|
| 2026-09-16 | Se crea `AI_CONTEXT.md` como archivo de orientación obligatorio |
| 2026-09-16 | Nombre comercial: **Vértice CR** |
| 2026-09-16 | Integración de IA: **asistente de cotización para impresión personalizada** |
| 2026-09-16 | El asistente orienta, pero nunca da precio final — lo confirma el admin |
| 2026-09-16 | Librería de gráficos: **Recharts** |
| 2026-09-16 | Proyecto de dos personas: frontend + especialista en impresión 3D |
| 2026-09-16 | Valores de marca: confianza, seguridad, calidad, "encontrarás lo que necesitás" |
| 2026-09-17 | El mockup de v0 se considera **Base V0 / referencia visual**, no implementación final |
| 2026-09-17 | La creatividad generativa se puede conservar si aporta valor; se audita y adapta |
| 2026-09-17 | La identidad final se construye mediante auditoría, refinamiento, interacción, movimiento, validación y documentación |
| 2026-09-17 | Cada decisión, duda, descarte o experimento que afecte diseño o implementación debe documentarse |
| 2026-09-19 | **HF-01 adopta 02 Lava Orgánica como base de trabajo visual; no es identidad final aprobada** |
| 2026-09-19 | **HF-01 adopta una base visual experimental que luego fue supersedida por la consolidación Obsidian Precision Forge + Lava Orgánica** |
| 2026-09-24 | **La dirección visual vigente es Obsidian Precision Forge + Lava Orgánica como sistema combinado** |
| 2026-09-24 | **HF-01 Home no muestra precios y no tiene una sección independiente de productos destacados** |
| 2026-09-24 | **Las solicitudes personalizadas siguen un ciclo económico separado del catálogo** |

---

## Identidad visual — reglas vigentes

Vértice CR busca una identidad elegante, futurista, técnica, industrial y creativa, con sensación premium y lenguaje accesible.

La dirección vigente es **Obsidian Precision Forge + Lava Orgánica**: Obsidian define estructura, precisión, superficies y lenguaje industrial; Lava Orgánica aporta materialidad, iluminación térmica, profundidad y formas fluidas selectivas. **Los tokens definitivos se formalizarán después de la validación HF.**

La identidad no dependerá únicamente de color. Debe construirse con:

```
color + materialidad + geometría + tipografía + profundidad + iluminación + interacción + movimiento
```

---

## Estado de reorganización — 2026-09-24

La auditoría global de mockups ya fue realizada. La documentación histórica redundante fue depurada. La referencia vigente está consolidada en este archivo y en `docs/DECISIONES-HF-POST-AUDITORIA-2026-09-24.md`.

### Orden actual
1. Corregir los HF según la auditoría global.
2. Validar dashboards con métricas realmente derivables de `db.json`.
3. Cerrar estados, responsive y accesibilidad.
4. Aprobar visualmente Fase 3.
5. Crear Design System.
6. Definir arquitectura y contrato de datos.
7. Implementar React.

### Documentación
Los documentos históricos eliminados ya no forman parte del flujo de trabajo. No crear nuevos Markdown para decisiones que puedan mantenerse en `AI_CONTEXT.md` o en el documento de decisiones de la auditoría.

---

## Reglas que no se negocian

1. JavaScript/JSX. Sin TypeScript.
2. Una solicitud personalizada nunca tiene precio `0` ni precio inventado. Estado inicial: `PENDING_QUOTE`.
3. Los KPIs se calculan desde `db.json` con funciones puras.
4. La UI no contiene lógica de negocio compleja.
5. Ninguna rama estable se rompe.
6. Sin secretos en el repositorio.
7. La IA explica cada cambio que propone.
8. No se asume una decisión que no esté documentada.

**Regla:** si algo cambió en el proyecto y este archivo no lo refleja, el contexto está desactualizado.


---

# CHECKPOINT ACTUAL — 2026-09-24

> Este bloque supersede cualquier estado anterior que contradiga estas decisiones.

## Estado actual

La auditoría HF realizada el 2026-09-24 identificó contradicciones entre documentación y PNG reales. La referencia visual vigente pasa a ser la familia actual de mockups, con **Obsidian Precision Forge como lenguaje principal y Lava Orgánica como capa de materialidad/energía**.

La implementación React continúa bloqueada.

### Decisiones cerradas

- **Home:** no muestra precios.
- **Identidad:** Obsidian Precision Forge + Lava Orgánica como sistema combinado.
- **Moneda:** CRC principal; USD solo como equivalente secundario desde configuración/datos.
- **Solicitudes personalizadas:** `PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID`, con salidas REJECTED/EXPIRED/CANCELLED.
- **Carrito:** catálogo y solicitudes personalizadas permanecen separados; `PENDING_QUOTE` nunca entra al total pagable.
- **Checkout:** `/checkout/productos` y `/checkout/solicitud` son flujos conceptualmente separados.
- **IA:** orienta, no fija precio final.
- **Login cliente:** lenguaje e-commerce, no LDAP/GitHub Enterprise.
- **Admin:** KPIs hero + módulos secundarios; Recharts real.
- **Menú móvil:** debe rehacerse con identidad Vértice.

### Incidencia del repositorio

`db.json` en `Pruebas` fue verificado después de la reorganización y actualmente es JSON válido. No hay marcadores de conflicto Git pendientes.

### Siguiente trabajo

Corrección de mockups HF → revisión global → aprobación visual → Design System → Arquitectura → consolidación de `db.json`/API → React.
