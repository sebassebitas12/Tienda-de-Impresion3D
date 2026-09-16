# Arquitectura — Tienda de Impresión 3D

## 1. Principio arquitectónico

El proyecto debe poder crecer sin convertir `App.jsx` en un contenedor de toda la aplicación. La presentación, navegación, estado, servicios, reglas de negocio y métricas tendrán responsabilidades separadas.

La arquitectura conserva JavaScript/JSX y React + Vite.

## 2. Estructura propuesta

```text
Tienda-de-Impresion3D/
├── docs/
├── public/
├── src/
│   ├── assets/
│   ├── app/
│   │   ├── App.jsx
│   │   └── providers/
│   ├── routes/
│   ├── pages/
│   │   ├── public/
│   │   ├── auth/
│   │   ├── customer/
│   │   └── admin/
│   ├── features/
│   │   ├── catalog/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── custom-print/
│   │   ├── orders/
│   │   ├── account/
│   │   └── admin/
│   ├── components/
│   │   ├── layout/
│   │   ├── common/
│   │   └── feedback/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   ├── customPrintService.js
│   │   └── external/
│   ├── utils/
│   │   ├── calculations.js
│   │   ├── metrics.js
│   │   ├── validation.js
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── styles/
│   └── main.jsx
├── db.json
├── jest.config.cjs
├── jest.setup.cjs
└── package.json
```

Las carpetas se crean conforme aparezcan responsabilidades reales; no se crearán directorios vacíos solo para aparentar arquitectura.

## 3. Responsabilidades

### Pages

Componen vistas y coordinan features. No contienen lógica de negocio compleja.

### Features

Agrupan comportamiento de una capacidad concreta del negocio.

### Components

Elementos reutilizables y visuales.

### Services

Toda llamada HTTP local o externa.

### Utils

Funciones puras y reglas reutilizables que no necesitan React.

### Context

Solo para estado compartido transversal que realmente lo necesite, como autenticación, carrito o preferencias.

### Hooks

Encapsulan comportamiento React reutilizable.

## 4. Flujo de datos

```text
Página / Feature
      ↓
Hook o handler
      ↓
Service
      ↓
API / JSON Server / API externa
      ↓
Datos normalizados
      ↓
Reglas de dominio / utils
      ↓
Estado de UI
      ↓
Componente
```

## 5. Dashboard

```text
AdminDashboard
      ↓
admin data hooks
      ↓
services
      ↓
orders + products + users + customPrintRequests
      ↓
metrics.js
      ↓
metric cards / charts / operational tables
```

Los gráficos nunca deben consultar `db.json` directamente.

## 6. Rutas

### Públicas

```text
/
/catalogo
/producto/:id
/solicitud
/carrito
/registro
```

### Cliente autenticado

```text
/checkout/productos
/checkout/solicitud
/pedido/:id
/cuenta
```

### Administrador

```text
/admin
/admin/pedidos
/admin/solicitudes
/admin/catalogo
/admin/clientes
/admin/reseñas
/admin/cupones
```

Los guards verifican autenticación y rol antes de renderizar módulos privados.

## 7. Servicios

Los servicios deben ofrecer una interfaz sencilla para la UI:

```javascript
getProducts(filters)
getProductById(id)
createOrder(payload)
updateOrderStatus(id, status)
createCustomPrintRequest(payload)
getDashboardData(filters)
```

El componente no debe conocer URLs completas ni detalles de `fetch`.

## 8. API externa

Debe existir al menos un servicio externo real porque la rúbrica lo exige. La integración debe tener:

- servicio aislado;
- estado de carga;
- error;
- timeout o cancelación cuando corresponda;
- test con `fetch` mock;
- fallback cuando el servicio no esté disponible.

## 9. Métricas

Las funciones de métricas deben ser puras:

```javascript
calculateSales(orders)
calculateAverageOrderValue(orders)
calculateInventoryHealth(products)
calculateOrderStatusBreakdown(orders)
calculateQuoteMetrics(customPrintRequests)
calculateSalesSeries(orders, range)
```

No deben importar React ni acceder al DOM.

## 10. Regla de dependencia

```text
UI → hooks/features → services/utils
```

Evitar:

```text
UI → fetch directo
UI → db.json
UI → cálculo de negocio
```

## 11. Seguridad conceptual

JSON Server y autenticación frontend forman una simulación académica. No deben presentarse como una arquitectura de producción segura. Si el negocio evoluciona a producción, la autenticación, autorización, almacenamiento de archivos, pagos y datos sensibles deberán migrarse a infraestructura apropiada.
