# AI_CONTEXT.md — Vértice CR

> **Última actualización:** 2026-09-30  
> **Estado:** SNAPSHOT ACTIVO  
> **Rama:** `Pruebas`  
> **No es un diario:** este archivo resume el presente. El historial detallado vive en los documentos de dominio.

## 1. Misión del proyecto

Vértice CR es una tienda costarricense de impresión 3D con dos líneas:

1. productos terminados de catálogo;
2. impresión personalizada con revisión y cotización antes de producción/pago.

Stack objetivo: React + Vite + JavaScript/JSX, con las integraciones definidas en `06` y `07`.

## 2. Estado actual

- Fase: **4 — Implementación React (Acomodo y Base)**.
- HF-01: **CONGELADO** (Aprobación final dada el 2026-09-30).
- React: **DESBLOQUEADO** (Gate Abierto).
- Dark/Light: definidos.
- Identidad: **Obsidian Precision Forge + Lava Orgánica**.
- El objetivo visual no es “más efectos”; es una Home con identidad fuerte que venda por producto, composición y percepción.

## 3. Autoridad

Para conflictos usa:

**usuario → AGENTS → dominio vigente → AI_CONTEXT → historial → académico.**

Este archivo no puede reemplazar una decisión de `docs/01–10`.

## 4. Qué leer según la tarea

- Home/visual: `03 + 04 + 05`.
- Negocio: `01 + 02`.
- API/datos/auth/N8N: `02 + 07`.
- Arquitectura React: `01 + 02 + 03 + 06 + 07 + 09 + 10`.
- Admin/IA: `02 + 08` + visual del área.
- Testing: `09` + dominio afectado.

## 5. Contratos no negociables

- JavaScript/JSX; no TypeScript.
- No inventar datos, claims, endpoints, métricas, capacidades o resultados de pruebas.
- Solicitud personalizada no es producto de catálogo.
- Flujo oficial de solicitud:
  `PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID`
  con salidas `REJECTED`, `EXPIRED`, `CANCELLED`.
- Una solicitud pendiente nunca se trata como `precio × cantidad`.
- La UI no accede directamente a APIs/datos; usa las capas definidas en `06`.
- Estados de carga, vacío, error, validación y procesamiento forman parte de la UX.

## 6. Contrato visual

Dirección: **Obsidian Precision Forge + Lava Orgánica**.

Vértice debe sentirse técnico, industrial y contemporáneo sin caer en gamer/cyberpunk/neón ni UI genérica de IA.

Principios:
- el producto es protagonista;
- precisión = evidencia, no ruido;
- geometría y tipografía deben sentirse propias;
- movimiento con propósito;
- evitar decoración repetitiva;
- mobile es reinterpretación, no simple reducción.

Las referencias externas sirven para extraer principios. Registrar fuente, patrón, adaptación y razón cuando una referencia influya en una decisión.

## 7. HF-01 actual

### Fuerte
- Hero workbench con producto grande.
- Riel vertical de piezas.
- Tipografía Space Grotesk + JetBrains Mono.
- Retícula y acento Lava.
- Catálogo con materialidad y estados.
- Chatbot con lenguaje visual integrado al workbench.
- Panel de accesibilidad con controles definidos.
- Search compacto con estado sin resultados.
- Dark/Light y reduced motion contemplados.

### Defectos visuales cerrados e implementados (render real, 2026-09-29)
Detalle, decisiones del usuario, orden de trabajo y criterio de cierre en `docs/05`, sección «Auditoría visual con render real».
- **Implementados en el mockup** (V-01, V-04 a V-09): ✅ V-04 fundido en fotos; ✅ V-01 scroll en botones flotantes; ✅ V-05 opacidad en «Mi Espacio»; ✅ V-06 buscador simplificado; ✅ V-07 chat (flechas y hueco); ✅ V-08 título y botón cerrar en móvil; ✅ V-09 etiquetas español en Precisión y footer.
- **Requisitos de React, no se tocan en el mockup:** V-02 (en móvil el producto debe verse en la primera pantalla); V-03 (PRT-006 y las demás tarjetas son ejemplos del mockup; el catálogo real vendrá con datos reales).
- Idioma y tamaño de texto globales no entran en el mockup; están documentados como requisito de React en `docs/04`.

### Deuda visual conocida (se resuelve en React, no bloquea congelación)
- Responsive real (V-02: en 375 px el producto debe verse en la primera pantalla).
- Datos de catálogo reales vs. ejemplos de mockup (V-03).
- Equilibrio final entre producto y telemetría decorativa del hero.
- Comportamiento final del hamburger (funcionalidad React, no HTML estático).
- Validación de accesibilidad con tecnología asistiva real.

### Regla
No tratar como contrato React algo que aún esté marcado como pendiente.

## 8. Navegación

Rutas públicas y administrativas: `docs/03`.

El navbar mantiene la identidad pública de Vértice. El hamburger se conserva; su comportamiento final sigue pendiente donde el historial registra rechazo del menú anterior. No resucitar una variante rechazada por asumir que un snapshot antiguo era definitivo.

## 9. Arquitectura objetivo

Referencia: `docs/06`.

Capas:

**UI → Pages/Features → Hooks/Services/Utils → APIs → datos**

La UI no contiene reglas de negocio complejas ni accede directamente a JSON Server.

## 10. Datos e integraciones

Referencia: `docs/07`.

Definidos y cerrados para el gate:
- modelo normalizado;
- estados de solicitudes;
- contratos API;
- JWT/auth;
- integración N8N;
- archivos 3D;
- servicio de IA.

No inventar proveedores o endpoints.

## 11. Calidad

Referencia: `docs/09`.

Objetivo de coverage y orden de pruebas se define allí. Al empezar React, primero deben existir scripts reales en `package.json`; no documentar comandos inexistentes como si ya fueran ejecutables.

## 12. Gate de React

No iniciar implementación completa hasta tener:

1. negocio estable;
2. flujos/rutas estables;
3. HF-01 aprobado;
4. diseño Dark/Light + accesibilidad definidos;
5. arquitectura cerrada;
6. contratos de datos/API/auth;
7. modelo normalizado;
8. testing preparado.

## 13. Orden de arranque de React

Cuando el gate abra: → **ABIERTO (2026-09-30)**

1. limpiar scaffold Vite;
2. aplicar tokens/global styles;
3. crear App shell/layout;
4. routing;
5. providers;
6. services/adapters;
7. primitives/components compartidos;
8. Home fiel a HF-01;
9. features por flujo;
10. estados y errores;
11. tests por bloque;
12. auditoría visual global.

## 14. Referencias maestras

El banco vivo está en `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md`.

Fuentes principales:
- Impeccable
- Anthropic frontend-design
- taste-skill
- UI/UX Pro Max
- Godly
- Awwwards
- Siteinspire
- Land-book
- Commerce Cream
- Mobbin
- Refero
- Pageflows
- Codrops
- Radix / React Aria
- Vercel Web Interface Guidelines

No instalar ni copiar una referencia por aparecer en esta lista.

## 15. Cómo continuar

Antes de editar:
1. inspecciona el estado real;
2. identifica la fuente de verdad;
3. detecta contradicciones;
4. define el cambio mínimo que resuelve el problema;
5. implementa;
6. verifica;
7. documenta.

**Punto actual:** HF-01 **CONGELADO** y React Gate **ABIERTO** (2026-09-30). Pasos 1–2 (Limpieza Vite y tokens globales) completados. Siguiente bloque: creación del **UI Kit (Primitivas)** documentado en `docs/06` sección `src/components/`, seguido de estructura de carpetas, App Shell/Layout y Routing.