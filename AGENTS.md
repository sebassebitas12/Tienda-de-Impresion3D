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

## 14. Forma de trabajar con el usuario

El usuario prefiere respuestas breves y prácticas, normalmente de un párrafo salvo que el trabajo requiera más.

Pero el agente debe **trabajar de verdad**, no llenar la respuesta con teoría.

Si tiene acceso al repositorio:

- inspeccionar primero;
- modificar directamente cuando la tarea esté suficientemente definida;
- verificar el resultado;
- informar exactamente qué se hizo.

No decir que algo fue implementado si solo se explicó.

## 15. Criterio de seniority

No optimizar para "más features".

Optimizar para:

**menos contradicciones + mejor UX + datos reales + arquitectura limpia + estados completos + identidad memorable.**

Una solución sencilla y coherente es preferible a una solución grande pero artificial.

## 16. Regla de continuidad

Antes de continuar una sesión, revisar el estado real del repositorio y no confiar únicamente en el último mensaje del usuario.

Después de cada cambio importante:

- dejar el repositorio en un estado coherente;
- actualizar la documentación relevante;
- indicar el siguiente paso lógico.

### Estado conocido de esta etapa

Rama de trabajo: `Pruebas`.

La implementación React sigue bloqueada hasta cerrar la fase visual y las decisiones de negocio pendientes.

El siguiente trabajo prioritario es continuar la corrección de los mockups según la auditoría, empezando por las pantallas críticas de carrito/checkout y después las restantes, antes de pasar a Design System y React.
