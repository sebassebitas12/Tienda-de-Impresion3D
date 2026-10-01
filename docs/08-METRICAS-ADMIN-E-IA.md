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

### Siguiente slice: solicitudes que ayudan a operar

Antes de añadir controles, definir qué necesita resolver el admin al revisar una solicitud: identificar el caso y cliente, entender material/cantidad/archivo disponible, reconocer el estado vigente y llegar al siguiente paso permitido. La lista y el detalle deben mostrar únicamente datos respaldados por el contrato; no ofrecer descarga si no hay URL/archivo accesible, ni introducir una cotización hasta tener inputs y transición definidos. Mantener `SUBMITTED` separado del flujo oficial.

Las métricas de Admin se trabajarán junto con referencias especializadas de dashboards operativos. Investigar fuentes y patrones visuales en el bloque de diseño; documentar **fuente → patrón → adaptación → por qué ayuda al taller** antes de aplicarlos. Cada KPI debe contestar una pregunta operativa y llevar a sus registros fuente cuando haya una vista que los soporte. No incorporar conteos decorativos, inventario, pagos deducidos ni gráficas sin dato/decisión detrás. Respetar estados loading, empty, error y actualización/frescura del origen.
