# Vértice CR — Testing y calidad

> Última actualización: **2026-09-24**.

## Objetivo

Jest + Testing Library.

Cobertura mínima objetivo:
- branches >= 70%;
- functions >= 70%;
- lines >= 70%;
- statements >= 70%.

## Orden

1. utils y reglas puras;
2. métricas;
3. services con mocks;
4. hooks;
5. componentes críticos;
6. flujos;
7. errores;
8. coverage;
9. build/lint.

## Casos críticos

API 404/500, API caída, catálogo vacío, stock insuficiente, archivo inválido/grande, formulario incompleto, doble envío, permisos, pedido inexistente, solicitud inexistente, cotización pendiente/aprobada, métricas sin datos, Dark/Light y foco/teclado.

## Nunca

- HTTP real desde Jest;
- secretos;
- tests que duplican implementación;
- eliminar tests para pasar build;
- hardcodear datos solo para subir coverage.

## Salida

Implementación + lint + build + tests relevantes + errores cubiertos + coverage >= 70%.
