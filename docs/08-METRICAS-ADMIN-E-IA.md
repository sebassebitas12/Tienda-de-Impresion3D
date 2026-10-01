# Vértice CR — Métricas, Admin e IA operativa

> Última actualización: **2026-10-01**.

## Principio

Admin debe ayudar a decidir y actuar diariamente, no demostrar cantidad de widgets.

## KPIs principales

1. Ventas cobradas en el período.
2. Pedidos activos.
3. Solicitudes pendientes de revisión/cotización.

## Gráficas

- ventas por día/semana;
- pedidos por estado;
- solicitudes por estado;
- productos más vendidos.

## Panel operativo

- pedidos que requieren atención;
- solicitudes pendientes;
- actividad reciente si existe activityLog.

## Filtro

Periodo global: hoy, 7 días, 30 días y rango personalizado cuando corresponda.

## Fórmulas

Ventas = suma de importes efectivamente cobrados dentro del período.

Pedidos activos = pedidos que no están en estados terminales.

Pendientes = solicitudes en estados que requieren acción administrativa.

Más vendidos = cantidades de orderItems asociadas a pedidos válidos según la regla de datos definitiva.

## Resumen operativo IA

Módulo compacto: **Resumen operativo IA**.

Entrada: métricas ya calculadas.

Puede sintetizar:
- alertas;
- cuellos de botella;
- solicitudes atrasadas;
- tendencias observables.

Reglas:
- nunca inventar números;
- no inventar causas;
- mostrar periodo;
- separar dato de interpretación;
- permitir ver los datos origen;
- si no hay datos suficientes, decirlo.

La IA no modifica datos ni sustituye KPIs.

## Usuario

Priorizar pedidos activos, cotizaciones pendientes, solicitudes en revisión, archivos, historial y contacto/facturación.

No usar LTV, churn, saldo SINPE u otros indicadores sin fuente y significado real.

## Funciones puras

calculateDashboardMetrics(data, period) sin React, HTTP ni efectos secundarios.

## Criterio

Una gráfica entra al MVP solo si ayuda a detectar un problema, comparar evolución o ejecutar una acción.


## Integración del resumen IA con N8N

El módulo **Resumen operativo IA** puede implementarse mediante un Webhook de N8N consumido desde React.

Flujo:
1. Dashboard calcula KPIs y datos de origen.
2. React solicita `mode: "admin_summary"`.
3. N8N recibe período + métricas.
4. AI Agent resume únicamente la información recibida/consultada mediante herramientas autorizadas.
5. React muestra la respuesta en un módulo compacto.

Reglas del resumen:
- nunca reemplaza los KPI;
- nunca inventa cifras;
- debe indicar el período;
- distingue datos de interpretación;
- debe permitir volver a los datos origen;
- ante información insuficiente, declara la limitación.

El chatbot general puede usar el mismo patrón con `mode: "chat"`; ambos casos siguen siendo capacidades distintas aunque compartan workflow/infraestructura.

## Admin — primer dashboard React (2026-10-01)

El dashboard inicial lee `orders`, `customPrintRequests` y `users` mediante un service de solo lectura contra JSON Server. Muestra pedidos activos usando los estados no terminales conocidos; cuenta para revisión únicamente solicitudes `PENDING_QUOTE`/`IN_REVIEW`; el estado legacy `SUBMITTED` se reporta como dato fuera del flujo y queda excluido hasta una decisión/migración explícita.

El conjunto demo actual no incluye entidad `payments`, `paidAt` ni comprobantes de cobro que permitan demostrar pago. La métrica de ventas cobradas debe mostrar “Sin datos de cobros”, nunca sumar automáticamente los totales de pedidos como ingreso efectivo. `activityLog` existe vacío y su contrato de eventos está pendiente; no se inventa una actividad reciente.

El `activityLog` actual está vacío; el slice no genera eventos ni los presenta como recientes. No usar `stock`/`minStock` en el dashboard ni inferir disponibilidad material de piezas: el catálogo se fabrica bajo pedido. Admin puede gestionar catálogo/publicación cuando ese slice se implemente, pero las cifras heredadas de inventario no son señal operativa vigente.

### Identidad y entrada al dashboard

El shell Admin mantiene una navegación de tareas distinta al navbar comercial, pero comparte tokens, tipografía y estados de Vértice. La sesión autenticada identifica al operador en la barra lateral. El feedback de selección se aplica a navegación real; filas tabulares y solicitudes no deben parecer botones si aún no tienen una acción implementada. No sumar métricas decorativas ni datos de inventario.

Desde el navbar público, «Mi cuenta» dirige a `/admin` para `role === admin` y a `/cuenta` para clientes; para invitados dirige a `/login`. Los guards conservan la ruta solicitada durante el login y la redirección por defecto usa el rol. Contrato de flujo completo en `docs/03-UX-Y-FLUJOS.md`.

### Admin — bandeja y detalle de solicitudes React (2026-10-01)

La ruta `/admin/solicitudes` lee solicitudes y usuarios desde JSON Server. La
bandeja agrupa el ciclo oficial en cuatro preguntas operativas: ¿requiere acción
del taller? (`PENDING_QUOTE`, `IN_REVIEW`), ¿espera al cliente? (`QUOTED`,
`AWAITING_APPROVAL`), ¿está aprobada/pagada? (`APPROVED`, `PAID`) o ¿cerró?
(`REJECTED`, `EXPIRED`, `CANCELLED`). El filtro de cada etapa conserva su estado
en `?fase=`; búsqueda por id, cliente, archivo, material y descripción refina el
conjunto. `Todas` lista únicamente estados del flujo oficial; legacy se abre por
separado y no altera el conteo de resultados del flujo. Desde el KPI del dashboard, `Solicitudes por revisar` abre la
etapa del taller; filas abren `/admin/solicitudes/:id`.

El SVG circular resume proporciones de solicitudes reconocidas y su leyenda filtra
la bandeja. No suma `SUBMITTED` ni otros estados desconocidos; estos se muestran
aparte con su valor real. La gráfica no afirma tendencias ni volumen suficiente
para proyecciones. Si el conjunto oficial está vacío, se omite el anillo. El
detalle presenta cliente/origen/material/cantidad/fecha y progreso solo para el
ciclo conocido; precio se muestra solo con `quotedPrice` CRC real y nunca para
`PENDING_QUOTE`/`IN_REVIEW`. `fileName` es metadato, no enlace de descarga. Ver
contrato de lectura y límites de escritura en `docs/07-DATOS-API-AUTH.md`.

El bloque es de consulta: no cambia estados ni escribe `activityLog`. Aunque el
flujo de negocio enumera estados, el repo aún no define una operación atómica que
registre transición, operador y evento de auditoría; no ofrecer una falsa acción
administrativa hasta cerrar ese contrato. La ruta Admin de actividad sigue
pendiente porque su colección carece de eventos/shape usable.

#### Referencias de movimiento y datos

- **Motion — [Layout animations for React](https://motion.dev/docs/react-layout-animations):** transición compartida que sigue selección y cambios de distribución; adaptación: un indicador recorre la leyenda accionable hasta el grupo activo y la lista entra en una secuencia corta al filtrar. No se añadió Motion; CSS usa `transform`/`opacity` y respeta movimiento reducido.
- **Apache ECharts — [Data Transition](https://echarts.apache.org/handbook/en/how-to/animation/transition/) y [Basic Pie Chart](https://echarts.apache.org/handbook/en/how-to/chart-types/pie/basic-pie/):** segmentos expresan proporción sobre un total y cambian cuando lo hacen los datos; adaptación: anillo SVG con cuatro grupos mutuamente excluyentes y leyenda accionable que filtra exactamente la bandeja. No se instaló ECharts porque el conjunto pequeño, estático y de cuatro valores no necesita una dependencia completa.
- **Codrops — [Hover Motion Intro](https://tympanus.net/codrops/2024/05/29/hover-motion-intro-animation/):** el movimiento hace legible la selección de un elemento dentro de una composición; adaptación Admin: franja de selección, acento lateral y avance al detalle mediante hover/foco. Se descartaron GSAP, la inclinación de puntero y el zoom de imagen porque son efectos de showcase y no aportan lectura operativa.

El anillo resume distribución del conjunto actual, no constituye una métrica temporal ni un pronóstico. Todos los grupos muestran cantidades además de color y tienen controles de filtro por teclado. `prefers-reduced-motion` y el ajuste global eliminan entradas/transiciones.

### Siguiente slice: operación con auditoría

Definir una acción administrativa transaccional para iniciar revisión/cotizar y
el evento de `activityLog` que debe acompañarla. También concretar URL/almacenamiento
del archivo antes de ofrecer apertura/descarga. Las siguientes métricas se añaden
solo junto a fuente real, decisión que ayudan a tomar y destino funcional cuando
exista; IA/N8N se mantiene después del flujo operativo.
