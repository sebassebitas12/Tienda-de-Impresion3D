# Vértice CR — Datos, API externa, JWT y N8N

> Última actualización: **2026-10-01**.

## Propósito

Este es el documento para responder: **¿de dónde salen los datos y cómo se conectan los servicios?**

## JSON Server

db.json es la fuente académica local.

Recursos:
users, products, categories, orders, orderItems, customPrintRequests, reviews, coupons, notifications, activityLog, settings.

## API externa

La rúbrica exige una API externa real.

Antes de implementar debe quedar definido:
- proveedor;
- finalidad;
- método;
- URL;
- request;
- response;
- errores;
- variable de entorno.

No inventar endpoint ni poner secretos en Git.

## Auth académico vigente

No se construye un backend real de autenticación para esta entrega. El flujo
implementado es `Login/Register → AuthProvider → authService →
jsonServerAuthAdapter → JSON Server/users`; el adapter compara credenciales demo,
valida `status`, persiste la sesión y genera un token `sim.v1` en frontend. El
token permite demostrar expiración, restore y guards, pero no tiene firma
criptográfica ni es seguridad de producción. Restore vuelve a consultar el
usuario en JSON Server para validar existencia, estado y rol actual. N8N se
reserva para IA/automatizaciones y no participa en login. El frontend ocultando
botones no sustituye los guards de rutas.

## N8N

Cada uno de los dos flujos documentará:
- trigger;
- payload;
- webhook/endpoint;
- nodos;
- respuesta;
- errores;
- idempotencia cuando aplique.

N8N no es fuente de verdad del negocio.

## Archivos 3D

MVP: STL y OBJ, validación de extensión/tamaño y estados de upload.

El almacenamiento definitivo se decide antes de implementación.

## IA

aiService.js encapsula la integración.

Entrada: descripción, parámetros conocidos y metadatos permitidos.

Salida: material, dimensiones aproximadas, tiempo, rango indicativo y advertencias.

La IA nunca persiste una cotización final por sí sola.

## Contratos

Cada service debe conocer:
request → response → error.

Los componentes no conocen URLs, claves ni formatos crudos de proveedores.


## Integración React → N8N

Para esta práctica, React puede consumir directamente un **Webhook de N8N** para una capacidad concreta sin agregar Node/Express como backend intermedio para ese caso.

Arquitectura:

`React → POST Webhook N8N → AI Agent / Tools → respuesta JSON → React`

El frontend no se conecta directamente al nodo AI Agent; consume el endpoint de entrada del workflow.

### Chatbot Vértice CR

Primera integración propuesta:
- UI de chatbot en React.
- POST al Webhook de N8N.
- Payload mínimo: `mode: "chat"`, `message` y sesión/usuario cuando corresponda.
- N8N ejecuta el AI Agent y las herramientas permitidas.
- Respuesta normalizada: `reply`, estado y metadatos mínimos.

### Resumen Admin con IA

La misma infraestructura puede exponer `mode: "admin_summary"` para el módulo **Resumen operativo IA**.

React envía métricas ya calculadas y el período; N8N genera una síntesis operativa. La IA no debe inventar números.

Ejemplo conceptual:

`{ mode: "admin_summary", period: "30d", metrics: {...} }`

Respuesta conceptual:

`{ summary: "...", alerts: [...], period: "30d", generatedAt: "..." }`

El contrato definitivo se validará durante la implementación del workflow.

### Seguridad

Un webhook público no sustituye autenticación/autorización. Si el endpoint se usa para información privada del admin, debe existir una estrategia de autenticación/autorización y validación del usuario/rol. Las claves de proveedores de IA nunca van en React.

N8N no es fuente de verdad del negocio.


## Estado de implementación Auth — 2026-09-30

Prioridad académica actual: **Autenticación → Admin → IA**.

### Lo que ya existe
- `AuthProvider` y `useAuth`;
- `AuthLayout`;
- rutas `/login` y `/registro`;
- guards de autenticación y rol para `/cuenta`, `/pedidos/:id` y `/admin/*`;
- `src/services/jsonServerAuthAdapter.js` conectado por defecto al `AuthProvider`;
- usuarios con `id`, `name`, `email`, `role`, `status` y `demoPassword` explícito en `db.json`.

### Contrato académico vigente

JSON Server es el backend local de la práctica y su URL se configura mediante
`VITE_JSON_SERVER_URL` en el build de Vite; si no se define, el adapter usa
`http://localhost:3000`. El adapter consulta `/users?email=...`, valida
`demoPassword` y `status === ACTIVE`, y crea usuarios nuevos con `role: customer`
y `status: ACTIVE` mediante `POST /users`.

JSON Server está instalado como dependencia de desarrollo. Para desarrollo
local: `npm run api` levanta `db.json` en el puerto 3000 y `npm run dev` levanta
Vite. No se debe exponer este servidor como backend de producción.

Las contraseñas de `db.json` son credenciales **demo**, no secretos. En este
snapshot se usan `demo-admin-2026` para `sebas@example.com` y
`demo-customer-2026` para los clientes de prueba.

El token `sim.v1` es un JWT **simulado**, sin firma criptográfica y solo para
demostrar sesión, expiración, rol y guards. Su payload contiene `sub`, `role`,
`iat` y `exp`; no representa autenticación segura de producción.

La sesión normalizada se persiste en `localStorage` bajo
`vertice.auth.session`. `restoreSession` valida formato y expiración, vuelve a
consultar `/users/:id`, invalida si el usuario no existe, está inactivo o cambió
de rol, y limpia el almacenamiento. `logout` también limpia el almacenamiento.
Si JSON Server no responde durante restore, la sesión guardada queda **sin
verificar** y no autoriza rutas; el menú permite borrarla localmente con
`Cerrar sesión` sin requerir conexión.

### Regla de implementación
No presentar el token simulado como seguridad empresarial. Admin debe validar rol
mediante guard y no depender de ocultar botones como mecanismo de autorización.


### Base React de Auth implementada — 2026-09-30

Se implementó el slice académico de Auth contra JSON Server, sin presentarlo
como autenticación segura de producción:

- `src/services/authService.js`: contrato adapter-based; normaliza sesiones y rechaza respuestas incompletas;
- `src/services/jsonServerAuthAdapter.js`: login, registro, restore, logout, persistencia e invalidación contra JSON Server;
- `AuthProvider`: restore/login/register/logout, pending/error, rol y estado autenticado;
- el menú público muestra `Cerrar sesión` con sesión activa o guardada sin verificar; el sidebar Admin también ofrece salida; ambos limpian la sesión y vuelven a Inicio;
- `RequireAuth` y `RequireRole`;
- Login y Registro reales en React;
- `/cuenta` y `/pedidos/:id` protegidos;
- `/admin/*` protegido por rol `admin`;
- AuthLayout visual derivado de HF-01;
- tests de service/provider/restore/login/logout/guards/rol, salida del menú público, recuperación offline y salida del sidebar Admin.

El adapter académico se inyecta desde `src/app/App.jsx` en `AppProviders`. Si
JSON Server no está disponible, la UI muestra el error de conexión y no fabrica
una sesión local.

Verificación local del slice (2026-09-30): `npm ci`, lint, 41 tests, `check:ui`,
build y `git diff --check` pasan. Se probó login/restore/logout contra JSON Server
local real. En navegador desktop se completó login y logout como cliente y admin;
el flujo Admin requiere navegación sincronizada para que el guard no intercepte la
salida. La auditoría responsive efectiva a 768 px confirmó que el layout cambia
a una columna sin desbordamiento horizontal. También se detectó que el enlace
«Volver al taller» ocultaba su texto bajo 560 px; se corrigió para mantener una
etiqueta legible junto a la flecha y se comprobó en render a 374 px sin scroll
horizontal. CI no se ejecutó porque no hubo commit/push.

#### Contrato esperado del adapter

`login(credentials)` / `register(payload)` deben devolver una sesión normalizada o mapeable a:

~~~js
{
  user: {
    id,
    name,
    email,
    role,
    status
  },
  token
}
~~~

`restoreSession()` devuelve esa sesión o `null`.
`logout(session)` invalida/cierra la sesión según el backend elegido.

El almacenamiento/persistencia del token pertenece al adapter concreto; no queda hardcodeado en la UI ni en el Provider.

## Lectura Admin — dashboard inicial (2026-10-01)

`src/services/adminOverviewService.js` consume en paralelo `GET /orders`, `/customPrintRequests` y `/users` desde JSON Server, con base URL compartida por `globalThis.__VERTICE_JSON_SERVER_URL__` (fallback local `http://localhost:3000`). La vista no solicita escrituras; filtros y métricas se derivan de las respuestas en funciones puras.

El dataset conserva `customPrintRequests.status: "SUBMITTED"` (r5), valor ausente del ciclo oficial. La UI lo muestra aparte y no lo convierte silenciosamente en `PENDING_QUOTE`; resolverlo requiere corregir/migrar explícitamente el dato o acordar alias en el contrato.

El modelo actual no tiene `payments`, `paidAt` ni otra evidencia normalizada de cobro. Por eso el dashboard no calcula ingresos desde `orders.total`. `activityLog` está vacío en el dataset; la ruta de actividad se difiere hasta definir el shape y las escrituras que generarán entradas.

### Bandeja/detalle Admin de solicitudes (2026-10-01)

`getAdminRequestsData()` lee en paralelo `GET /customPrintRequests` y `GET /users`.
La UI enlaza `userId` al nombre del usuario por id. Los errores/abortos se
normalizan en el service; la pantalla no hace HTTP directamente.

Este slice es de lectura. El detalle solo presenta el nombre de archivo guardado
en `fileName`: el dataset no incluye URL de almacenamiento ni bytes, por lo que
no se ofrece descargar/abrir el archivo. En estados distintos de
`PENDING_QUOTE`/`IN_REVIEW`, el precio solo se muestra si existen `quotedPrice`
numérico y `currency: CRC`; la UI no crea ni completa una cotización. Los valores
`SUBMITTED` y otros estados desconocidos quedan visibles en una sección separada,
fuera de la distribución del flujo oficial.

No se escribe el estado de solicitud ni `activityLog`: aún falta definir el
contrato y la atomicidad de una acción administrativa con auditoría. Abrir el
detalle/filtro no cambia datos. El siguiente paso transaccional debe establecer
si una transición como `PENDING_QUOTE → IN_REVIEW` registra operador, fecha y
evento de forma consistente; una mutación aislada desde el cliente no se debe
presentar como operación auditada.
