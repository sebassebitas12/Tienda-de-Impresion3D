# Vértice CR — Datos, API externa, JWT y N8N

> Última actualización: **2026-09-24**.

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

## JWT

Flujo objetivo:
login → backend/auth → JWT → cliente → rutas protegidas → rol.

Debe existir:
- autenticación;
- expiración/invalidación;
- autorización por rol;
- guard de rutas;
- sesión inválida.

El frontend ocultando botones no equivale a autorización.

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
