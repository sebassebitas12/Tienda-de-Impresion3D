# Anteproyecto — Vértice CR

**Nombre del estudiante:** Sebastián Flores Miranda
**Fecha:** 16 de septiembre de 2026
**Curso:** FWD Academy — Desarrollo Front End con React
**Deadline de entrega:** 21 de septiembre de 2026

---

## 1. Introducción

El presente anteproyecto describe el desarrollo de una aplicación web de front end escalable para **Vértice CR**, una tienda de impresión 3D con identidad costarricense. El sistema aborda dos modelos de negocio integrados en una misma plataforma: un catálogo de productos terminados orientado al consumidor casual, y un servicio de impresión personalizada dirigido a clientes técnicos, hobbistas o corporativos.

La interfaz comunicará los valores de la marca: confianza, calidad y la certeza de que el cliente encontrará lo que necesita. Visualmente se expresará con una estética de taller creativo de alta tecnología: dark mode como tema principal, paleta volcánica con fondo carbón (`#0D0B09`) y acento naranja/lava (`#FF5A1F`), tipografías Space Grotesk y JetBrains Mono.

Este proyecto cumple con los lineamientos académicos del curso al integrar React, React Router DOM, JSON Server, autenticación, autorización por roles, operaciones CRUD, panel administrativo con métricas, pruebas automatizadas con Jest, integración de Inteligencia Artificial y flujos de automatización con N8N.

---

## 2. Objetivo General

Desarrollar el frontend interactivo y escalable de Vértice CR utilizando React y React Router DOM, gestionando de forma integral la venta de productos de catálogo y la cotización de solicitudes de impresión personalizada, con diseño responsive, accesibilidad, pruebas automatizadas e integración de Inteligencia Artificial.

---

## 3. Objetivos Específicos

- Implementar un backend simulado mediante JSON Server (`db.json`) para persistir información y realizar operaciones CRUD completas sobre productos, categorías, clientes, pedidos y solicitudes de cotización.
- Diseñar interfaces responsive en 375px, 768px y 1280px+ aplicando las cuatro prácticas de accesibilidad: tema claro/oscuro, texto ajustable, soporte ARIA para lectores de pantalla, y diferenciación de estados sin depender únicamente del color.
- Desarrollar un panel de administración restringido por roles que consolide métricas operativas calculadas desde los datos reales, representadas con gráficos mediante Recharts.
- Integrar servicios HTTP para consumir endpoints locales (JSON Server) y al menos un endpoint externo real desde la carpeta `services/`.
- Incorporar un asistente de cotización con Inteligencia Artificial en el flujo de solicitud personalizada, que oriente al cliente sobre material, dimensiones y precio estimado sin reemplazar la cotización formal del administrador.
- Configurar dos flujos de automatización en N8N para procesos críticos del sistema.
- Garantizar la estabilidad de los componentes y la lógica de negocio alcanzando una cobertura mínima del 70% mediante pruebas unitarias con Jest.

---

## 4. Desarrollo

### 4.1 Arquitectura y tecnologías

El desarrollo se basará en **React 19** y **Vite 8** utilizando **JavaScript** nativo, sin TypeScript. La arquitectura separará responsabilidades en carpetas específicas: componentes reutilizables, páginas/vistas, hooks, context y una capa dedicada de servicios (`src/services/`) para centralizar todas las llamadas a endpoints. La navegación estará orquestada por React Router DOM con rutas públicas y privadas protegidas por guards de autenticación y rol.

### 4.2 Modelo de negocio, autenticación y CRUDs

El sistema contará con persistencia de sesión y autorización basada en roles (cliente y administrador), almacenada en `db.json`.

**Experiencia del cliente:** exploración del catálogo, búsqueda y filtros, carrito, checkout y seguimiento de pedidos. Las solicitudes de impresión personalizada tienen su propio flujo con estado económico inicial `PENDING_QUOTE` — nunca se asigna un precio ficticio antes de que el administrador cotice.

**Administración:** CRUD completo de productos, categorías, clientes, pedidos y solicitudes de cotización desde un panel centralizado protegido por rol.

### 4.3 Diseño visual y accesibilidad

**Dark mode** como tema principal con toggle a light mode. Paleta volcánica: fondo carbón `#0D0B09`, superficies obsidiana `#141412`, acento naranja/lava `#FF5A1F`. Tipografías: Space Grotesk para la interfaz general y JetBrains Mono para datos técnicos. HTML semántico, etiquetas ARIA y mensajes de validación visibles en todos los formularios.

La vista móvil (375px) está planificada para producción y fuera del alcance académico de esta entrega.

### 4.4 Panel de administración y visualización

El dashboard mostrará métricas operativas calculadas desde los datos reales de `db.json` mediante funciones puras. Las métricas clave (ventas brutas, pedidos activos, inventario bajo, solicitudes pendientes de cotización) se representarán con gráficos de barras y líneas usando **Recharts**. Ningún KPI se hardcodea en el componente.

### 4.5 Pruebas unitarias

Pruebas con **Jest** y Testing Library aislando la lógica sin peticiones HTTP reales, validando cálculos de métricas, hooks de datos y estados de componentes. Cobertura mínima objetivo: 70% en branches, functions, lines y statements.

### 4.6 Integración de Inteligencia Artificial

Se integrará un **asistente conversacional de cotización** directamente en la página de solicitud de impresión personalizada. El cliente describe en lenguaje natural lo que quiere imprimir y el asistente responde con: material recomendado y justificación, dimensiones aproximadas, tiempo estimado de producción y rango de precio orientativo — aclarando siempre que el precio final lo confirma el administrador (`PENDING_QUOTE`). Implementado como servicio en `src/services/aiService.js`, sin exponer claves en el cliente.

### 4.7 Automatización con N8N

Se configurarán dos flujos de automatización para los procesos de comunicación críticos del negocio:

**Flujo 1 — Notificación de nueva solicitud personalizada**
Cuando un cliente envía una solicitud de impresión personalizada desde la app, N8N detecta el nuevo registro en `db.json` y envía automáticamente un correo al administrador con el resumen completo: nombre del cliente, descripción del objeto, material solicitado, dimensiones y archivo adjunto si aplica. Esto garantiza que ninguna solicitud quede sin atender.

**Flujo 2 — Notificación de cotización aprobada al cliente**
Cuando el administrador aprueba una cotización desde el panel, N8N envía automáticamente un correo al cliente con el precio confirmado, el tiempo estimado de producción y la siguiente instrucción: *"Tu solicitud fue aprobada. Nos pondremos en contacto contigo por WhatsApp en un plazo de 1 a 2 días hábiles para coordinar los detalles de fabricación y entrega."* La coordinación posterior se realiza de forma manual por WhatsApp, permitiendo flexibilidad real según la disponibilidad del equipo y la complejidad del pedido.

**Roadmap de producción (fuera del alcance académico):**
Chatbot de WhatsApp para gestión de pedidos estándar del catálogo (estado de envío, tracking, dudas simples), con escalado a atención humana para pedidos personalizados.

---

## 5. Anexos

### Anexo A — Referencia visual desktop (1280px+)

Dirección visual aprobada: **02 Lava Orgánica**

Showcase oval horizontal con productos 3D sobre base volcánica, iluminación naranja perimetral, fondo carbón `#0D0B09`. Referencia generada durante la fase de exploración visual (2026-09-19).

*(Adjuntar imagen del showcase oval aprobado)*

### Anexo B — Vista móvil (375px)

Planificada para producción. Fuera del alcance de esta entrega académica.

