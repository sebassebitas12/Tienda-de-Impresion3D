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
