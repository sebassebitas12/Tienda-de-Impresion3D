# Vértice CR — Métricas, Admin e IA operativa

## Principio

Admin debe ayudar a decidir y actuar diariamente, no demostrar cantidad de widgets.

## KPIs principales

1. Ventas cobradas en el período.
2. Pedidos activos.
3. Solicitudes pendientes de revisión/cotización.
4. Productos con stock bajo.

## Gráficas

- ventas por día/semana;
- pedidos por estado;
- solicitudes por estado;
- productos más vendidos.

## Panel operativo

- pedidos que requieren atención;
- solicitudes pendientes;
- productos bajo mínimo;
- actividad reciente si existe activityLog.

## Filtro

Periodo global: hoy, 7 días, 30 días y rango personalizado cuando corresponda.

## Fórmulas

Ventas = suma de importes efectivamente cobrados dentro del período.

Pedidos activos = pedidos que no están en estados terminales.

Pendientes = solicitudes en estados que requieren acción administrativa.

Stock bajo = stock <= minStock.

Más vendidos = cantidades de orderItems asociadas a pedidos válidos según la regla de datos definitiva.

## Resumen operativo IA

Módulo compacto: **Resumen operativo IA**.

Entrada: métricas ya calculadas.

Puede sintetizar:
- alertas;
- cuellos de botella;
- solicitudes atrasadas;
- riesgo de stock;
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
