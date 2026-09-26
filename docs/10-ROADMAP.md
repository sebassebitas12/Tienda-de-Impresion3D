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

## Actualización 2026-09-25 — cierre completo de HF-01 Home

**HF-01 Home: APROBADO Y CONGELADO en su totalidad como referencia maestra del sitio.**

La sesión consolidó la reconstrucción integral de `mockups/hf-01-home.html` a partir de las 9 capturas del usuario y los lineamientos del Anteproyecto (FWD Academy):
- Estructura editorial numerada (`01 / SELECCIÓN DE TALLER`, `02 / EL MÉTODO`, `03 / SEÑALES DE PRECISIÓN`).
- Visor Workbench con fotografías reales, anotación Leader Line SVG dinámica y coordenadas CAD.
- Movimiento continuo a 60 fps: levitación orgánica de la pieza (`heroFloatIdle`), pulso térmico en la recámara (`thermalPulse`), barrido láser de escaneo (`laserSweep`), cinta ticker de telemetría AM continua y ondas concéntricas de radar.
- Dock flotante apilado en columna vertical: botón superior de Accesibilidad Universal TP (♿, 46px) y botón inferior de Asistente Técnico (💬, 54px con baliza activa).
- Panel de Accesibilidad Universal TP activo (escala de texto relativa 90%-130%, modo alto contraste `#FFE600`, fuente dislexia, reducción de movimiento y resaltado de navegación).
- Reglas de negocio confirmadas: cero precios en Home, cotizaciones personalizadas bajo `PENDING_QUOTE / SIN COBRO PREVIO`.

**Siguiente foco de trabajo:** HF-02 Catálogo Técnico / Filtros de Materiales y HF-05 Solicitud con archivo 3D.

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
