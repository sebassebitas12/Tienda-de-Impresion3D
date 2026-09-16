# Sistema de métricas — Dashboard administrativo

## 1. Objetivo

El dashboard debe funcionar como herramienta de operación, no como una colección de números decorativos.

**Fuente de verdad:** `db.json`, consumido mediante servicios. Los componentes no contienen cifras fijas para representar ventas, pedidos, clientes, inventario o rendimiento.

Flujo obligatorio:

```text
db.json
  ↓
services
  ↓
normalización
  ↓
metricas.js / funciones puras
  ↓
Dashboard
  ↓
Cards + tablas + gráficos + alertas
```

## 2. Familias de métricas

El dashboard se dividirá en cinco familias para observar resultados, eficiencia y deficiencias.

### A. Ventas y resultados

| KPI | Cálculo | Fuente |
|---|---|---|
| Ventas brutas | suma de `total` de pedidos válidos | orders |
| Pedidos confirmados | cantidad de orders en estados operativos | orders |
| Ticket promedio | ventas brutas / pedidos con total | orders |
| Unidades vendidas | suma de `quantity` en orderItems de pedidos válidos | orderItems |
| Descuento otorgado | suma de descuentos aplicados | orders |
| Ventas por periodo | ventas agrupadas por fecha | orders |
| Ventas por categoría | ventas agrupadas por categoría | orders + products |
| Producto más vendido | máximo de unidades por producto | orderItems |

### B. Conversión y comportamiento

Estas métricas requieren eventos si se quiere medir comportamiento real. No se deben inventar a partir de pedidos.

| KPI | Fuente futura |
|---|---|
| Tasa de conversión | activityLog / analytics events |
| Abandono de carrito | cart events |
| Tiempo hasta compra | session/activity events |
| Productos vistos vs comprados | activityLog |

Si todavía no existe la entidad de eventos, el dashboard debe mostrar `No disponible` en lugar de fabricar una tasa.

### C. Inventario y eficiencia

| KPI | Cálculo |
|---|---|
| Productos activos | products con status `ACTIVE` |
| Productos agotados | stock = 0 |
| Productos con stock bajo | 0 < stock <= minStock |
| Cobertura de inventario | stock actual / ventas promedio del periodo |
| Valor estimado de inventario | suma(stock × price) |
| Producción estimada pendiente | horas de producción de pedidos en estados productivos |
| Capacidad comprometida | horas de producción asociadas a órdenes abiertas |

La cobertura de inventario requiere suficiente histórico. Si no existe, debe mostrarse como no disponible.

### D. Operación de pedidos

| KPI | Cálculo |
|---|---|
| Pedidos pendientes | `PENDING` |
| Pedidos en producción | `IN_PRODUCTION` |
| Pedidos listos | `READY` |
| Pedidos enviados | `SHIPPED` |
| Pedidos entregados | `DELIVERED` |
| Cancelación | cancelados / pedidos creados |
| Tiempo promedio de ciclo | entrega - creación |
| Pedidos atrasados | fecha esperada < fecha actual y no entregado |

### E. Impresión personalizada

| KPI | Cálculo |
|---|---|
| Solicitudes recibidas | cantidad de requests |
| Solicitudes en revisión | `IN_REVIEW` |
| Cotizaciones emitidas | `QUOTED` |
| Cotizaciones aprobadas | `APPROVED` |
| Tasa de aprobación de cotizaciones | aprobadas / cotizadas |
| Solicitudes rechazadas | `REJECTED` |
| Tiempo medio de respuesta | `quotedAt - submittedAt` |
| Valor cotizado | suma de `quotedPrice` |
| Valor aprobado | suma de cotizaciones aprobadas |

## 3. Métricas de salud

Cada KPI puede tener una interpretación operativa, pero el sistema no debe esconder el dato detrás de una puntuación arbitraria.

Ejemplo:

```text
Stock bajo: 7 productos
→ alerta operacional
```

No:

```text
Salud del inventario: 82/100
```

salvo que posteriormente exista una fórmula documentada, configurable y testeada.

## 4. Indicadores de deficiencia

El dashboard debe hacer visibles problemas accionables:

- productos agotados;
- productos bajo stock mínimo;
- pedidos pendientes durante demasiado tiempo;
- pedidos cancelados;
- solicitudes personalizadas sin respuesta;
- cotizaciones próximas a vencer;
- productos sin ventas durante el periodo seleccionado;
- categorías con baja participación;
- acumulación de trabajo en producción;
- clientes con pedidos problemáticos.

## 5. Indicadores de eficiencia

- ticket promedio;
- tiempo promedio de procesamiento;
- tiempo de respuesta de cotizaciones;
- pedidos completados;
- unidades por pedido;
- utilización estimada de capacidad de producción;
- porcentaje de solicitudes que llegan a cotización;
- porcentaje de cotizaciones aprobadas.

## 6. Visualizaciones

El dashboard debe usar varios estilos, siempre que cada gráfico responda una pregunta concreta.

### Cards KPI

Para valores puntuales:

- ventas;
- pedidos;
- clientes;
- solicitudes;
- stock crítico.

### Línea

Para evolución temporal:

- ventas por día/semana/mes;
- pedidos por periodo;
- solicitudes recibidas.

### Barras

Para comparar:

- ventas por categoría;
- productos más vendidos;
- pedidos por estado;
- solicitudes por estado.

### Barra apilada

Para composición temporal:

- estados de pedidos por mes;
- pedidos entregados vs pendientes.

### Donut / circular

Solo para pocas categorías claramente diferenciadas:

- distribución de estados;
- distribución de categorías.

No usar gráficos circulares cuando haya demasiadas categorías.

### Tabla operacional

Para detectar problemas concretos:

- stock crítico;
- pedidos pendientes;
- solicitudes sin cotizar;
- productos con baja rotación.

### Ranking

Para:

- top productos;
- top categorías;
- clientes con mayor actividad.

### Sparklines

Para mostrar tendencia compacta dentro de una KPI card. La tendencia debe calcularse con datos del periodo anterior, no escribirse manualmente.

## 7. Filtros del dashboard

Las métricas deben poder consultarse por:

- periodo;
- categoría;
- estado;
- producto;
- tipo de operación.

Periodo inicial:

```text
Hoy
7 días
30 días
90 días
Este año
Personalizado
```

El filtro debe afectar de forma consistente cards, gráficos y tablas que dependan del mismo periodo.

## 8. Comparaciones

Cuando exista histórico suficiente:

```text
periodo actual vs periodo anterior equivalente
```

Ejemplo conceptual:

```text
Ventas
₡245 000
vs ₡210 000 periodo anterior
```

El porcentaje de cambio será:

```text
((actual - anterior) / anterior) × 100
```

Si el periodo anterior es cero, no se muestra una división artificial.

## 9. Estados sin datos

Una métrica puede devolver:

```text
VALUE
ZERO
NO_DATA
```

No deben confundirse.

- `VALUE`: existe información.
- `ZERO`: existe información y el resultado real es cero.
- `NO_DATA`: no hay suficientes datos para calcularla.

## 10. Reglas de calidad

- Ningún KPI hardcodeado.
- Ninguna fórmula dentro de JSX.
- Funciones puras para cálculos.
- Todas las fórmulas importantes con tests.
- Fechas normalizadas antes de agrupar.
- Moneda formateada únicamente en la capa de presentación.
- Datos faltantes tratados explícitamente.
- Pedidos cancelados/rechazados excluidos de ventas válidas según la regla definida.
- Las métricas de comportamiento requieren eventos; no se deducen arbitrariamente de pedidos.

## 11. Arquitectura propuesta

```text
src/
├── services/
│   ├── orderService.js
│   ├── productService.js
│   ├── customPrintService.js
│   └── userService.js
│
├── utils/
│   ├── metrics.js
│   ├── metricFilters.js
│   ├── dateGrouping.js
│   └── calculations.js
│
└── features/admin/
    ├── components/
    │   ├── MetricCard.jsx
    │   ├── SalesChart.jsx
    │   ├── InventoryHealth.jsx
    │   ├── OperationalAlerts.jsx
    │   └── MetricsTable.jsx
    └── pages/
        └── AdminDashboard.jsx
```

## 12. Testing de métricas

Cada familia debe tener pruebas unitarias.

Casos mínimos:

- dataset normal;
- dataset vacío;
- valores cero;
- pedidos cancelados;
- fechas inválidas;
- producto sin ventas;
- stock cero;
- stock bajo;
- solicitud sin cotización;
- cotización aprobada;
- periodo sin datos;
- comparación con periodo anterior igual a cero.

Las pruebas no deben hacer HTTP real. Los servicios se mockean y las funciones de métricas reciben datos preparados.
