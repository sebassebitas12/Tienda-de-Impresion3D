# Decisiones HF posteriores a auditoría — 2026-09-24

## Estado

Rama: `Pruebas`
Commit de referencia de mockups: `ee144ce`
Implementación React: **sigue bloqueada**.

Este documento cierra las decisiones que la auditoría HF dejó pendientes y establece la secuencia para terminar Fase 3 sin saltar prematuramente a código.

## 1. Identidad visual vigente

### Decisión

La dirección de trabajo vigente pasa a ser:

**Obsidian Precision Forge** como lenguaje visual principal + **Lava Orgánica** como capa de materialidad, iluminación y energía.

No son dos identidades separadas.

- Obsidian Precision Forge define estructura, precisión, superficies, tipografía, densidad técnica y lenguaje industrial.
- Lava Orgánica define momentos de profundidad, iluminación térmica, formas fluidas y protagonismo material del producto.

La familia de PNG actual es la referencia visual vigente para evolucionar los HF.

La antigua decisión del 2026-09-19 que describía el showcase oval/orgánico como requisito exclusivo de Home queda **supersedida** por esta decisión. El oval puede conservarse si aporta valor al hero, pero deja de ser una restricción arquitectónica o visual obligatoria.

## 2. Regla de Home y precios

Se conserva la decisión de negocio del 2026-09-19:

**HF-01 Home no muestra precios.**

El precio visible en el PNG actual se considera un error de mockup y debe eliminarse en la siguiente iteración.

El Home presenta producto, materialidad, precisión y rutas de acción; la comparación de precios pertenece al Catálogo y Detalle.

## 3. Convención monetaria

La moneda operativa de Vértice CR es **CRC**.

- CRC es el valor principal en Catálogo, Detalle, Carrito, Checkout, Pedidos y Cuenta.
- USD puede aparecer como equivalente secundario únicamente cuando exista una fuente de tipo de cambio definida en datos/configuración.
- No se deben hardcodear conversiones dentro de componentes.
- Home no muestra precios, por lo tanto tampoco conversiones.

El componente reutilizable será conceptualmente `PriceTag`, con variantes para CRC solamente o CRC + equivalente USD.

## 4. Solicitudes personalizadas: ciclo de negocio definitivo

Una solicitud personalizada NO es un producto de catálogo.

### Ciclo MVP

`PENDING_QUOTE`
→ `IN_REVIEW`
→ `QUOTED`
→ `AWAITING_APPROVAL`
→ `APPROVED`
→ `PAID`
→ conversión a pedido de producción

Ramas de salida:

- `REJECTED`
- `EXPIRED`
- `CANCELLED`

Reglas:

- `PENDING_QUOTE` no tiene precio final.
- Una IA puede generar orientación técnica o un rango indicativo, pero no fija el precio final.
- `QUOTED` contiene una cotización emitida por el admin.
- Solo una cotización aprobada por el cliente puede pasar al flujo de pago.
- El pago de una solicitud personalizada crea/activa un pedido real vinculado a `requestId`.
- La solicitud y el pedido permanecen relacionados pero no son la misma entidad conceptual.

## 5. Carrito híbrido

El carrito puede contener dos familias visualmente separadas:

### Productos de catálogo

- cantidad editable;
- precio unitario;
- subtotal;
- participan en el total pagable.

### Solicitudes personalizadas

- no tienen selector de cantidad del carrito;
- muestran estado de cotización;
- `PENDING_QUOTE` queda fuera del total pagable;
- `QUOTED/AWAITING_APPROVAL` muestra la acción de revisar/aprobar;
- `APPROVED` puede entrar al flujo de pago;
- nunca se renderiza como una tarjeta de producto normal.

El resumen debe separar:

- **Total de productos**
- **Solicitudes pendientes de aprobación/cotización**
- **Total a pagar ahora**

## 6. Checkout

Se mantienen dos rutas conceptuales:

- `/checkout/productos` — compra directa de catálogo.
- `/checkout/solicitud` — pago de una cotización personalizada ya aprobada.

El checkout personalizado debe mostrar claramente archivo/modelo, especificaciones relevantes, cotización emitida, vigencia, método de pago y referencia de solicitud.

No se mezclan productos de catálogo y solicitudes pendientes como si fueran líneas homogéneas.

## 7. IA de cotización

La IA sigue siendo un **asistente de orientación**.

Puede sugerir:

- material;
- dimensiones aproximadas;
- tiempo estimado;
- rango indicativo;
- advertencias técnicas.

Nunca puede afirmar que el rango es el precio final.

Visualmente se reutiliza `RangeEstimateBadge` con una etiqueta principal inequívoca como:

**ORIENTATIVO · SUJETO A VALIDACIÓN**

La etiqueta no puede quedar relegada a texto secundario mientras la cifra domina visualmente.

## 8. Login / Registro

El acceso de clientes adopta lenguaje de e-commerce de Vértice.

Se eliminan del flujo de cliente final:

- LDAP;
- GitHub Enterprise;
- terminología de infraestructura;
- “terminal” como metáfora dominante.

Puede mantenerse una estética técnica, pero el lenguaje debe hablar de cuenta, pedidos, cotizaciones, archivos y seguimiento.

Un futuro acceso administrativo puede utilizar una variante más técnica separada.

## 9. Admin Dashboard

El dashboard se reorganiza en dos capas:

1. cuatro KPI hero de lectura inmediata;
2. módulos secundarios agrupados por Ventas, Operación, Cotización y Clientes.

Los gráficos relevantes deben ser gráficos reales de Recharts, no barras decorativas disfrazadas de gráficos.

El rango de fechas debe ser un control global del dashboard.

El admin utiliza el mismo lenguaje de marca, pero con menor atmósfera y mayor densidad informativa que el sitio público.

## 10. Menú móvil

El menú desplegable móvil deja de considerarse un componente genérico externo.

Debe usar:

- superficie obsidiana;
- tipografía Vértice;
- acento térmico naranja;
- estado activo inequívoco;
- transición corta de entrada/salida;
- foco visible;
- cierre por Escape y selección.

## 11. Pantallas que sirven como referencia interna

Conservar como patrones de calidad:

- HF-03 Detalle de Producto;
- HF-04 Selección de Solicitud;
- HF-06 Asistencia Técnica e IA;
- HF-09 Seguimiento de Pedido;
- HF-13 Portal de Usuario.

Especialmente HF-13 debe ser la fuente visual del patrón `QuoteApprovalCard` para resolver HF-07 y HF-08.

## 12. Componentes de diseño que ya se consideran conceptualmente aprobados

`Badge`
`StatusBadge`
`PriceTag`
`StatBlock`
`ProcessStep`
`ProductHeroCard`
`ProductCard`
`FilterGroup`
`EmptyState`
`Pagination`
`MaterialSelector`
`SwatchSelector`
`InfillSelector`
`SpecSheet`
`Gallery`
`ChoiceCard`
`TrustBadgeRow`
`FileDropzone`
`QuoteSummaryPanel`
`RangeEstimateBadge`
`ChatBubble`
`AITypingIndicator`
`AIDisclaimerBadge`
`CartCatalogItem`
`CartCustomRequestItem`
`OrderSummaryPanel`
`QuoteApprovedBadge`
`CheckoutStepCard`
`SinpePaymentBlock`
`InvoiceFiscalForm`
`OrderProgressStepper`
`OrderItemRow`
`DeliveryInfoCard`
`KpiCard`
`ChartCard`
`DateRangeFilter`
`RankedListCard`
`AdminDataTable`
`ProductFormPanel`
`AuthTabs`
`AuthFormField`
`SocialLoginButton`
`AccountKpiRow`
`OrderCard`
`QuoteApprovalCard`
`AccountTabs`

Esto no autoriza todavía su implementación.

## 13. Secuencia antes de React

1. Corregir HF-01 según la decisión de identidad y eliminar precio de Home.
2. Corregir HF-05/HF-06 para jerarquía de cotización orientativa.
3. Rediseñar HF-07 Carrito Híbrido con separación real de solicitudes.
4. Separar HF-08 en los dos checkout conceptuales.
5. Recalibrar HF-12 Login/Registro.
6. Rehacer HF-14 Menú móvil con identidad Vértice.
7. Completar auditoría profunda de HF-17 Biblioteca CAD.
8. Revisión global de estados, mobile, accesibilidad y reduced motion.
9. Aprobar identidad + HF.
10. Recién entonces convertir decisiones en Design System y Arquitectura.
11. Después, corregir/consolidar `db.json` y contrato de API conforme al modelo aprobado.
12. Solo después comienza React.

## 14. Incidencia técnica detectada

`db.json` en la rama `Pruebas` contiene actualmente marcadores de conflicto Git (`<<<<<<< HEAD`, `=======`, `>>>>>>> ...`).

Por tanto, el archivo **no debe consumirse como JSON válido** hasta resolver el conflicto. La resolución se hará después de cerrar el modelo de solicitudes personalizado definido arriba.

## 15. Regla de continuidad

Cualquier IA que continúe el proyecto debe leer:

- `AI_CONTEXT.md`
- `docs/IDENTITY-ROADMAP.md`
- `docs/VISUAL-IDENTITY-WORKING.md`
- `docs/fase3_mockups_hf.md`
- este documento

y debe asumir que:

**React continúa bloqueado hasta la aprobación visual y de negocio.**


---

## 16. Revisión global de dashboards y datos — 2026-09-24

### Principio

Los dashboards no deben intentar demostrar que el sistema es sofisticado mostrando métricas que el MVP no puede calcular. El criterio será **utilidad operativa diaria + datos realmente disponibles**.

### Admin: tablero diario

El dashboard administrativo queda reducido a:

**KPIs principales**
- Ventas cobradas en el período.
- Pedidos activos.
- Solicitudes personalizadas pendientes de revisión/cotización.
- Productos con stock bajo.

**Gráficas útiles**
- Ventas por día/semana del período seleccionado.
- Pedidos por estado.
- Solicitudes personalizadas por estado.
- Productos más vendidos por unidades o ingresos.

**Panel operativo**
- Pedidos que requieren atención.
- Solicitudes que requieren cotización/revisión.
- Productos bajo mínimo.
- Actividad reciente cuando exista `activityLog`.

**Filtros**
- período global;
- opcionalmente estado/categoría según la gráfica.

Se eliminan del dashboard MVP métricas que requieren fuentes no modeladas actualmente, como CAC, LTV, Payback, churn, benchmarks externos, conexión ficticia con Hacienda, “rentabilidad” si no existe costo real, y cualquier porcentaje presentado como dato operativo sin fórmula y fuente.

### Usuario: información diaria

El portal del usuario prioriza:
- pedidos activos y su estado;
- cotizaciones pendientes de aprobación;
- solicitudes en revisión;
- acceso a archivos/modelos guardados;
- historial de pedidos;
- datos de facturación/contacto.

Los KPI personales deben derivarse de datos existentes. No se crearán “saldo SINPE”, LTV u otros indicadores que no tengan significado operativo para un cliente.

### Regla para gráficas

Cada gráfica debe responder una pregunta concreta:

| Pregunta diaria | Visualización |
|---|---|
| ¿Cómo van las ventas? | línea/barras por período |
| ¿Qué pedidos requieren atención? | distribución por estado + lista accionable |
| ¿Cuántas solicitudes están trabadas en cada etapa? | barras por estado |
| ¿Qué productos se venden más? | barras horizontales |
| ¿Qué productos necesitan reposición? | lista priorizada / barras de stock |

Si una gráfica no ayuda a tomar una acción o detectar un problema, no entra al MVP.

### Fuente de datos

Las métricas se calculan desde `db.json` mediante funciones puras. No se permiten números decorativos hardcodeados en la UI.

### Estado del mockup

Los mockups de dashboard se consideran **referencia visual, no contrato de métricas**. La siguiente iteración debe simplificar la densidad y sustituir datos ficticios por métricas derivables del modelo real.
