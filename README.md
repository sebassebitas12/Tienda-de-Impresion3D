# Tienda de Impresión 3D

Frontend escalable para una tienda real de impresión 3D, construido con React y orientado a catálogo, ventas, pedidos y solicitudes de impresión personalizada.

> **Estado:** fase de definición y arquitectura.
> **Rama de trabajo:** `sebas`
> **Backend simulado:** JSON Server mediante `db.json`

## Objetivo del proyecto

Construir una plataforma web que pueda evolucionar de proyecto académico a frontend funcional de una tienda personal de impresión 3D. La aplicación debe separar claramente presentación, lógica de negocio, servicios, datos y autenticación para evitar que las decisiones del negocio queden acopladas a los componentes visuales.

## Alcance funcional

La plataforma contempla dos líneas principales:

1. **Catálogo de productos:** piezas y productos 3D listos para comprar.
2. **Impresión personalizada:** solicitud de un trabajo de impresión a partir de un archivo 3D y parámetros definidos por el cliente, seguida de revisión y cotización.

El sistema contempla usuarios clientes y administradores, carrito, pedidos, inventario, reseñas, autenticación, panel administrativo, métricas, integración externa, IA, automatizaciones con N8N y pruebas automatizadas.

## Fuente de verdad de los datos

Los datos operativos del proyecto no deben escribirse manualmente dentro de las métricas ni del panel administrativo. El origen será `db.json`, consumido mediante servicios HTTP de JSON Server.

La interfaz puede presentar datos derivados, pero los valores deben calcularse a partir de las entidades persistidas. Las fórmulas y definiciones están documentadas en [`docs/METRICS.md`](docs/METRICS.md).

## Documentación

| Documento | Propósito |
|---|---|
| [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) | Requerimientos funcionales, no funcionales y prioridades MoSCoW |
| [`docs/BUSINESS-LOGIC.md`](docs/BUSINESS-LOGIC.md) | Reglas del negocio, estados, cálculos y restricciones |
| [`docs/METRICS.md`](docs/METRICS.md) | KPIs, fórmulas, fuentes y alertas del dashboard |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Estructura técnica y responsabilidades de cada capa |
| [`docs/TESTING.md`](docs/TESTING.md) | Estrategia de Jest, Testing Library, mocks y cobertura |

## Requisitos técnicos base

- React + Vite en JavaScript/JSX.
- React Router DOM para rutas públicas y privadas.
- JSON Server como backend simulado.
- `services/` para endpoints locales y externos.
- Autenticación y autorización por roles.
- CRUDs según las necesidades del negocio.
- Panel administrativo con métricas calculadas y gráficos.
- Integración real de IA desde el frontend mediante una capa de servicio segura para el entorno académico.
- Al menos dos flujos de automatización con N8N.
- Jest + Testing Library con pruebas de componentes, lógica y servicios.
- Diseño responsive y prácticas de accesibilidad.

## Datos iniciales

El contrato inicial de datos está en [`db.json`](db.json). La estructura está diseñada para soportar catálogo, pedidos, inventario, clientes, solicitudes personalizadas, reseñas, cupones, eventos de pedidos y configuración del negocio.

## Desarrollo

Instalar dependencias:

```bash
npm install
```

Frontend:

```bash
npm run dev
```

JSON Server:

```bash
npx json-server --watch db.json --port 3001
```

Los scripts definitivos de pruebas y las dependencias adicionales se incorporarán junto con la implementación de la arquitectura definida en `docs/`.

## Principios del proyecto

- **Datos antes que métricas:** ningún KPI operativo importante debe depender de números hardcodeados.
- **Reglas centralizadas:** los cálculos deben vivir en `utils/` o servicios de dominio, no repartidos por la UI.
- **Componentes explicables:** el código generado con IA debe revisarse, probarse y poder defenderse técnicamente.
- **Escalabilidad:** agregar una nueva categoría, estado, métrica o integración no debe exigir reescribir el núcleo.
- **JavaScript/JSX:** no migrar el proyecto a TypeScript.
- **Sin emojis en la UI ni en comentarios del código.** Usar texto e iconografía consistente.
