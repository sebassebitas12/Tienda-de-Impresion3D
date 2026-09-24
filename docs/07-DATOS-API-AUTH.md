# Vértice CR — Datos, API externa, JWT y N8N

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
