# Vértice CR — Roadmap

## Estado

Fase 3: auditoría HF y cierre de UX/visual. React bloqueado.

## Ahora

1. Incorporar auditoría.
2. Cerrar Dark/Light.
3. Definir ayuda accesible.
4. Cerrar HF-07/HF-08.
5. Ajustar Admin + resumen IA.
6. Definir API externa y contrato.
7. Definir JWT/auth.
8. Cerrar desktop.

## Después

9. Mockups mobile 375.
10. Mockups tablet 768.
11. Revisión de estados/accesibilidad.
12. Aprobación HF.

## Luego

13. Design System.
14. Arquitectura final.
15. Modelo db.json.
16. Contratos API.
17. Implementación React.

## Actualización 2026-09-25 — cierre HF-01 Hero

**HF-01 Home: APROBADO Y CONGELADO como referencia visual del Hero.**

La sesión de Antigravity implementó y verificó el Hero Workbench con fotografías reales, Leader Line Callout dinámico, eliminación del overlay CAD triangular, escáner láser sutil, Tilt/Parallax ligero y ficha técnica. La revisión actual del HTML en GitHub confirma que estos elementos están implementados en mockups/hf-01-home.html.

No se utilizará Three.js/WebGL en Home. El visor 3D real queda reservado para HF-03 y HF-05.

**Siguiente foco de mockups:** HF-02 Catálogo y HF-05 Solicitud con archivo.

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
