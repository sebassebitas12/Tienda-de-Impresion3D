# Vértice CR — Roadmap

> **Última actualización:** 2026-09-29  
> **Estado:** ACTIVO  
> **Fase actual:** 3 — cierre visual/UX de HF-01.  
> **React:** BLOQUEADO.

## Fase 3 — Cierre de diseño

### Objetivo

Convertir HF-01 en la referencia visual de máxima fidelidad de la Home y cerrar el contrato mínimo necesario para pasar a React sin improvisar.

### Estado actual

- HF-01: 🟡 **EN ITERACIÓN / NO CONGELADO**
- Dark/Light: definidos en `04`.
- Accesibilidad: criterios definidos; paneles requieren validación visual completa.
- Referencias de diseño: consolidadas en `04`.
- Mockup HTML: `mockups/hf-01-home-definitivo.html`.
- No se crean más mockups HTML para las demás pantallas.

### Pendientes antes del gate

1. Auditoría visual profunda de HF-01.
2. Resolver bugs visuales y rupturas responsive.
3. Cerrar navegación/header, chat y accesibilidad.
4. Verificar que la Home comunique tienda/producto, no solo dirección de arte.
5. Aprobar formalmente HF-01.

## Preflight antes de React

Cuando HF-01 sea aprobado, no saltar directamente a componentes. Primero cerrar:

1. **Producto/negocio:** alcance, estados y reglas de `01–02`.
2. **UX:** rutas y flujos de `03`.
3. **Diseño:** tokens, responsive y accesibilidad de `04–05`.
4. **Arquitectura:** estructura y límites de `06`.
5. **Datos/API/auth:** contratos y normalización de `07`.
6. **Testing:** estrategia y scripts reales de `09`.
7. **Dependencias:** instalar únicamente las aprobadas y necesarias.
8. **Gate final:** verificar que documentación y repo coincidan.

## Fase 4 — Fundaciones React

Orden recomendado:

1. limpiar scaffold Vite;
2. aplicar tokens/estilos globales;
3. crear App shell/layout;
4. routing;
5. providers;
6. services/adapters y acceso a datos;
7. primitives/components compartidos;
8. Home fiel a HF-01;
9. features por flujo de negocio;
10. estados y errores;
11. tests por bloque;
12. revisión visual contra HF-01.

## Fase 5 — Integraciones

- API externa.
- JWT/auth.
- JSON Server.
- N8N.
- IA.
- archivos 3D.

Cada integración entra después de que exista su contrato y una prueba mínima.

## Fase 6 — Cobertura del producto

Completar las rutas y features restantes directamente en React, siguiendo `03`, `06` y los flujos de `02`.

No crear una segunda colección de mockups HTML.

## Fase 7 — Calidad y cierre

- lint;
- tests relevantes;
- coverage objetivo definido en `09`;
- build;
- responsive;
- accessibility;
- estados vacíos/error/loading/processing;
- revisión visual;
- documentación final.

## Definition of Done de React

Una feature queda terminada solo si:
- respeta el dominio;
- usa las capas de `06`;
- cubre estados relevantes;
- funciona por teclado cuando aplica;
- conserva identidad visual;
- tiene tests relevantes;
- pasa lint/build;
- documenta decisiones nuevas.

## Regla

No avanzar por “tener algo funcionando”. Avanzar cuando el bloque actual tiene evidencia suficiente para no contaminar el siguiente.