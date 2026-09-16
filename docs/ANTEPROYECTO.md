# Anteproyecto — Vértice CR

**Nombre del estudiante:** [PENDIENTE — completar antes del 21 de sept.]
**Fecha:** 16 de septiembre de 2026
**Curso:** FWD Academy — Desarrollo Front End con React
**Deadline de entrega:** 21 de septiembre de 2026

> ⚠️ Este documento está en borrador. Falta: nombre del estudiante, mockups en Anexo A y Anexo B, y confirmación de los 2 flujos N8N.

---

## 1. Introducción

El presente anteproyecto describe el desarrollo de una aplicación web de front end escalable para **Vértice CR**, una tienda real de impresión 3D con identidad costarricense. El sistema aborda dos modelos de negocio integrados en una misma plataforma: un catálogo de productos terminados (gadgets, figuras, juguetes, decoración y piezas funcionales) orientado al consumidor casual, y un servicio de impresión personalizada dirigido a clientes técnicos, hobbistas o corporativos.

La interfaz comunicará los valores de la marca: confianza, seguridad, calidad y la certeza de que el cliente encontrará lo que necesita. Visualmente se expresará con una estética de taller creativo de alta tecnología: dark mode como tema principal, paleta de negro azulado profundo con detalles en cian eléctrico, tipografías Space Grotesk y JetBrains Mono.

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
- Configurar al menos dos flujos de automatización en N8N para procesos críticos del sistema.
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

**Dark mode** como tema principal con toggle a light mode. Paleta: negro azulado profundo (`#0A0E1A`) con cian eléctrico (`#00D4FF`) como acento. Tipografías: Space Grotesk para la interfaz general y JetBrains Mono para datos técnicos. HTML semántico, etiquetas ARIA y mensajes de validación visibles en todos los formularios.

### 4.4 Panel de administración y visualización

El dashboard mostrará métricas operativas calculadas desde los datos reales de `db.json` mediante funciones puras. Las métricas clave (ventas brutas, pedidos activos, inventario bajo, solicitudes pendientes de cotización) se representarán con gráficos de barras y líneas usando **Recharts**. Ningún KPI se hardcodea en el componente.

### 4.5 Pruebas unitarias

Pruebas con **Jest** y Testing Library aislando la lógica sin peticiones HTTP reales, validando cálculos de métricas, hooks de datos y estados de componentes. Cobertura mínima objetivo: 70% en branches, functions, lines y statements.

### 4.6 Integración de Inteligencia Artificial

Se integrará un **asistente conversacional de cotización** directamente en la página de solicitud de impresión personalizada. El cliente describe en lenguaje natural lo que quiere imprimir y el asistente responde con: material recomendado y justificación, dimensiones aproximadas, tiempo estimado de producción y rango de precio orientativo — aclarando siempre que el precio final lo confirma el administrador (`PENDING_QUOTE`). Implementado como servicio en `src/services/aiService.js`, sin exponer claves en el cliente.

### 4.7 Automatización con N8N

Se configurarán dos flujos de automatización:

1. **[PENDIENTE — definir flujo 1]**
2. **[PENDIENTE — definir flujo 2]**

---

## 5. Anexos

> Los mockups se generarán antes del 21 de septiembre y se adjuntarán aquí.

### Anexo A: Vista de escritorio

[ Espacio reservado — mockup de alta fidelidad, vista escritorio 1280px+ ]

### Anexo B: Vista móvil

[ Espacio reservado — mockup de alta fidelidad, vista móvil 375px ]
