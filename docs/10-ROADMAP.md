# Vértice CR — Roadmap

## Estado

Fase 4: Design System y arquitectura pre-React. HF-01 es la guía visual base; no se abren más rondas de mockup para Home.

### Estado frente a la rúbrica académica — 2026-09-25

HF-01 ya funciona como base visual desktop reconstruida y fue adoptado como referencia del sistema. Para afirmar que la entrega completa cumple la rúbrica todavía faltan: validar HF-01 a 375/768/1280+, crear evidencia móvil/tablet del sistema, cerrar accesibilidad con teclado/lector de pantalla/texto ajustable, y aprobar los contratos de auth, API externa, IA, N8N y testing antes del gate de React. La matriz completa vive en `docs/01-PRODUCTO-Y-ALCANCE.md`.

## Ahora — siguiente bloque, fuera de mockups

1. Extraer tokens de HF-01 a un Design System documentado.
2. Definir shell React: navbar, footer, tema, idioma, ayuda y accesibilidad.
3. Crear React Router, páginas públicas/privadas y guards.
4. Crear `services/`, contratos de JSON Server y modelo de sesión/roles.
5. Implementar primero Home React conservando HF-01 como referencia visual.
6. Definir proveedor y contrato real de API externa e IA.
7. Preparar Jest/Testing Library y pruebas de accesibilidad.
8. Exportar y probar los dos flujos N8N.

## Después

9. Validar Home React a 375/768/1280+.
10. Auditoría con teclado, lector de pantalla y texto al 200%.
11. Completar HF-02/HF-05 en React usando el mismo sistema.
12. Cerrar evidencia de rúbrica.

## Luego

13. CRUD y operaciones de cliente/admin.
14. Dashboard, IA y automatizaciones.
15. Cobertura, build y entrega final.

## Actualización 2026-09-25 — HF-01 adoptado como guía del sistema

**HF-01 Home: base visual desktop reconstruida y adoptada como referencia visual; pendiente validación responsive y cierre técnico en la implementación.**

La sesión de Antigravity implementó y verificó el Hero Workbench con fotografías reales, Leader Line Callout dinámico, eliminación del overlay CAD triangular, escáner láser sutil, Tilt/Parallax ligero y ficha técnica. La revisión actual del HTML en GitHub confirma que estos elementos están implementados en mockups/hf-01-home.html.

No se utilizará Three.js/WebGL en Home. El visor 3D real queda reservado para HF-03 y HF-05.

**Siguiente foco recomendado:** extraer el Design System y construir el shell/Home en React conservando HF-01 como referencia. La validación 375/768/1280+, accesibilidad y rúbrica se hará sobre esa implementación; después se continúa con HF-02 Catálogo y HF-05 Solicitud con archivo.

## Calidad

18. Jest/Testing Library.
19. N8N.
20. API externa.
21. IA.
22. Auditoría responsive/accessibility.
23. Build + coverage.

## Gate de React

No empezar React hasta negocio + HF + Dark/Light + accesibilidad + API/JWT + modelo de datos estén suficientemente cerrados.

No crear otro roadmap paralelo.


## Actualización 2026-09-24 — después de auditoría Gemini de HF-07

HF-07 ya no es un bloqueador estructural. UXMagic conservó la separación correcta entre productos y solicitudes pendientes. Queda una **iteración menor** para:
- representar claramente `QUOTED` / `APPROVED`;
- eliminar microcopy repetido;
- refinar spacing, badges y acciones;
- preparar el comportamiento responsive.

Después de cerrar esa iteración, la siguiente prioridad es **HF-08**, porque sigue siendo bloqueador de flujo de pago/cotización.

### Siguientes caminos posibles

A. **Recomendado — cerrar HF-07 y pasar a HF-08**  
B. Cerrar primero Dark/Light y accesibilidad transversal.  
C. Definir primero Admin + resumen IA/N8N.  
D. Definir primero API externa + JWT.

Criterio para elegir A: HF-07/HF-08 forman un único flujo de carrito/checkout y son los bloqueos funcionales más directos de UX antes de aprobar desktop.


## Actualización 2026-09-24 — HF-07 cerrado

**HF-07 Carrito Híbrido: APROBADO Y CONGELADO.**

La validación final confirmó los estados `PENDING_QUOTE`, `QUOTED` y `APPROVED`, separación comercial entre catálogo y cotización, y consistencia visual con Vértice CR.

### Próximo objetivo

**HF-08 — Checkout**

HF-08 es ahora el siguiente bloqueador. Debe cerrar:
1. checkout de productos de catálogo;
2. pago de cotización personalizada aprobada;
3. estados de pago;
4. SINPE;
5. datos de facturación/Hacienda;
6. entrega;
7. errores y validaciones;
8. responsive.

Después de HF-08: revisión desktop global y cierre de Dark/Light + accesibilidad antes de pasar a mobile/tablet.

## Handoff de sesión — 2026-09-24

### Pausa actual
La sesión queda pausada con **HF-07 aprobado y congelado**.

### Retomar exactamente aquí
El siguiente trabajo es **HF-08 Checkout**. No requiere volver a revisar HF-07 salvo que HF-08 revele una contradicción funcional.

### Checklist de reanudación
- usar HF-07 aprobado como referencia visual y de negocio;
- definir dos recorridos: productos y cotización aprobada;
- cubrir estados de pago y excepciones;
- generar mockup desktop en UXMagic;
- validar con Gemini;
- iterar hasta aprobación;
- después avanzar al cierre transversal de desktop.

### Estado de trabajo
No hay React implementado todavía. La fase sigue siendo preproducción/mockups.


## Actualización 2026-09-24 — HF-08 requiere segunda iteración

La primera propuesta HF-08 fue auditada con Gemini y quedó en **AJUSTES IMPORTANTES**.

Siguiente acción única: aplicar las 5 correcciones prioritarias en UXMagic y volver a validar las tres pantallas como un flujo único.

HF-08 solo se congela después de validación final.
