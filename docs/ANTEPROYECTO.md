# Anteproyecto — Vértice CR

**Nombre del estudiante:** [PENDIENTE — completar antes del 21 de sept.]  
**Fecha:** 19 de septiembre de 2026  
**Curso:** FWD Academy — Desarrollo Front End con React  
**Deadline de entrega:** 21 de septiembre de 2026

> ⚠️ Este documento sigue en borrador. Ya existe una base HF-01 Desktop propia documentada; faltan nombre del estudiante, anexos finales, HF-02/HF-13 y confirmación de los 2 flujos N8N.

---

## 1. Introducción

El presente anteproyecto describe el desarrollo de una aplicación web de front end escalable para **Vértice CR**, una tienda real de impresión 3D con identidad costarricense. El sistema aborda dos modelos de negocio integrados en una misma plataforma: un catálogo de productos terminados (gadgets, figuras, juguetes, decoración y piezas funcionales) orientado al consumidor casual, y un servicio de impresión personalizada dirigido a clientes técnicos, hobbistas o corporativos.

La interfaz comunicará los valores de la marca: confianza, seguridad, calidad y la certeza de que el cliente encontrará lo que necesita. Visualmente se encuentra en construcción sobre la dirección **02 — Lava Orgánica**, con una base experimental de carbón/obsidiana, naranja/lava como acento, Space Grotesk y JetBrains Mono. Esta dirección es una base de trabajo y **no constituye todavía la identidad visual final aprobada**.

---

## 2. Objetivo General

Desarrollar el frontend interactivo y escalable de Vértice CR utilizando React y React Router DOM, gestionando de forma integral la venta de productos de catálogo y la cotización de solicitudes de impresión personalizada, con diseño responsive, accesibilidad, pruebas automatizadas e integración de Inteligencia Artificial.

---

## 3. Objetivos Específicos

- Implementar un backend simulado mediante JSON Server (`db.json`) para persistir información y realizar operaciones CRUD completas sobre productos, categorías, clientes, pedidos y solicitudes de cotización.
- Diseñar interfaces responsive en 375px, 768px y 1280px+ aplicando las prácticas de accesibilidad definidas en la documentación.
- Desarrollar un panel de administración restringido por roles que consolide métricas operativas calculadas desde los datos reales, representadas con gráficos mediante Recharts.
- Integrar servicios HTTP para consumir endpoints locales y al menos un endpoint externo real desde la carpeta `services/`.
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

**Dark mode** como tema principal con toggle a light mode. La dirección visual actual en construcción es **02 — Lava Orgánica**: carbón/obsidiana (`#0D0B09`, `#141412`, `#1E1C19`) con naranja/lava experimental (`#FF5A1F`) como acento. Space Grotesk se utiliza como tipografía de interfaz y JetBrains Mono para datos técnicos. La paleta es provisional y deberá validarse antes de convertirse en sistema visual definitivo.

La interfaz debe mantener HTML semántico, etiquetas ARIA, mensajes de validación visibles y diferenciación de estados sin depender únicamente del color.

### 4.4 Panel de administración y visualización

El dashboard mostrará métricas operativas calculadas desde los datos reales de `db.json` mediante funciones puras. Las métricas clave se representarán con gráficos usando **Recharts**. Ningún KPI se hardcodea en el componente.

### 4.5 Pruebas unitarias

Pruebas con **Jest** y Testing Library aislando la lógica sin peticiones HTTP reales, validando cálculos de métricas, hooks de datos y estados de componentes. Cobertura mínima objetivo: 70% en branches, functions, lines y statements.

### 4.6 Integración de Inteligencia Artificial

Se integrará un **asistente conversacional de cotización** directamente en la página de solicitud de impresión personalizada. El cliente describe en lenguaje natural lo que quiere imprimir y el asistente responde con material recomendado, dimensiones aproximadas, tiempo estimado y rango de precio orientativo — aclarando siempre que el precio final lo confirma el administrador (`PENDING_QUOTE`). Se implementará como servicio en `src/services/aiService.js`, sin exponer claves en el cliente.

### 4.7 Automatización con N8N

Se configurarán dos flujos de automatización:

1. **[PENDIENTE — definir flujo 1]**
2. **[PENDIENTE — definir flujo 2]**

---

## 5. Anexos

> Los mockups se incorporarán como anexos de alta fidelidad antes de la entrega. El registro detallado de HF se mantiene en `docs/fase3_mockups_hf.md`.

### Anexo A: Vista de escritorio

**HF-01 — Home / Landing — Desktop**

Estado: 🟡 Base HTML propia funcional, en refinamiento.

Estructura:

```
Navbar
↓
Hero + showcase oval de productos
↓
Precision
↓
Process
↓
Print CTA
↓
Footer
```

Referencia: `docs/HF-01-HOME-WORKSESSION-2026-09-19.md`.

### Anexo B: Vista móvil

**HF-01 — Home / Landing — Mobile**

Estado: ⏳ Pendiente.

---

## 6. Nota de coherencia documental

La versión anterior de este anteproyecto utilizaba **cian eléctrico** como acento visual. Esa decisión pertenece a una exploración histórica de Fase 2 y ya no describe la dirección de trabajo actual. La documentación vigente utiliza Lava Orgánica como base experimental, sin cerrar todavía la identidad visual definitiva.
