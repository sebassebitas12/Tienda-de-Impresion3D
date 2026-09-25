# Vértice CR — Testing y calidad

## Objetivo

Jest + Testing Library.

## Brecha actual frente a la rúbrica

La rúbrica exige pruebas unitarias de front end con Jest. En la revisión del repositorio actual, `package.json` todavía no contiene dependencias de Jest/Testing Library, scripts `test`/`test:coverage` ni una carpeta de pruebas implementada. Antes del gate de React se debe agregar la configuración, definir el entorno DOM y crear evidencia ejecutable; no basta con mantener este objetivo escrito.

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
