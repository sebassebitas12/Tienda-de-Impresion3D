# AI_CONTEXT.md — Vértice CR

> Punto de entrada obligatorio. Si no sabes dónde buscar, abre `docs/00-INDICE-Y-MAPA.md`.

## Producto
Vértice CR es una tienda costarricense de impresión 3D con dos líneas: productos terminados e impresión personalizada con revisión y cotización.

## Estado
Última actualización: 2026-09-24. Rama: `Pruebas`. Fase: auditoría HF + cierre visual/UX. **React permanece bloqueado.**

## Fuente de verdad documental
- `AI_CONTEXT.md`: estado global y decisiones de alto nivel.
- `AGENTS.md`: reglas operativas para agentes.
- `docs/00-INDICE-Y-MAPA.md`: mapa único.
- `docs/01-PRODUCTO-Y-ALCANCE.md`: alcance y rúbrica.
- `docs/02-NEGOCIO-Y-ESTADOS.md`: entidades, reglas y estados.
- `docs/03-UX-Y-FLUJOS.md`: rutas, flujos y estados UX.
- `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md`: identidad, Dark/Light y accesibilidad.
- `docs/05-AUDITORIA-HF-Y-MOCKUPS.md`: hallazgos y pendientes visuales.
- `docs/06-ARQUITECTURA.md`: arquitectura técnica.
- `docs/07-DATOS-API-AUTH.md`: db.json, API externa, JWT y N8N.
- `docs/08-METRICAS-ADMIN-E-IA.md`: dashboard, fórmulas y resumen IA.
- `docs/09-TESTING-Y-CALIDAD.md`: pruebas y cobertura.
- `docs/10-ROADMAP.md`: siguiente trabajo.

`docs/ANTEPROYECTO_FINAL.md`, si se necesita, es el documento académico; no es la fuente diaria de decisiones técnicas.

## Decisiones críticas
- JavaScript/JSX, sin TypeScript.
- Obsidian Precision Forge + Lava Orgánica.
- Dark + Light son requisitos.
- CRC es moneda principal; USD solo como equivalente configurado.
- Home no muestra precios.
- Solicitud personalizada no es producto.
- `PENDING_QUOTE` no tiene precio final, cantidad ni subtotal.
- Solo una cotización aprobada puede pagarse.
- IA orienta; admin confirma precio.
- Admin: KPIs reales, gráficos útiles y resumen IA basado en datos existentes.
- Ayuda accesible y consistente.
- API externa real y JWT deben quedar definidos antes de implementación.
- Mobile 375 y tablet 768 se mockupean después de cerrar desktop.
- No inventar datos, endpoints, capacidades ni métricas.

## Orden de trabajo
1. Corregir HF según auditoría.
2. Cerrar Dark/Light, ayuda y accesibilidad.
3. Cerrar HF-07/HF-08.
4. Ajustar Admin + IA.
5. Definir API externa + JWT.
6. Aprobar desktop.
7. Crear mockups mobile/tablet.
8. Aprobar HF.
9. Design System.
10. Arquitectura/datos/API.
11. React.
12. Testing/integraciones/calidad.

## Regla
Si un documento contradice una decisión posterior, prevalece la decisión posterior registrada aquí y en el documento de dominio. No crear nuevos Markdown si el tema ya tiene un hogar.

## Decisión adicional — navegación y N8N (2026-09-24)

- El navbar público de Stitch se conserva como base visual; solo tendrá ajustes pequeños y funcionales.
- El footer completo pertenece principalmente al área pública. Los dashboards no están obligados a mostrar el footer comercial; pueden usar uno técnico compacto o ninguno si el foco operativo lo justifica.
- Los mockups de Stitch/UXMagic son referencias visuales, no contratos literales de chrome para cada ruta.
- React puede consumir un Webhook de N8N directamente para el chatbot y/o resumen IA sin añadir un backend intermedio para ese caso.
- El frontend consume el endpoint del workflow; no se conecta directamente al nodo AI Agent.
- Chatbot y resumen Admin pueden compartir infraestructura mediante un campo `mode`, manteniendo contratos y permisos separados.


## Navegación de trabajo para esta fase — 2026-09-24

### Dónde estamos
HF-07 fue revisado nuevamente con Gemini después de una iteración de UXMagic. La estructura de negocio está correcta y el resultado quedó en **ajustes menores**, no reconstrucción.

### Qué falta para cerrar este bloque
1. Una iteración final de HF-07 en UXMagic.
2. Resolver explícitamente los estados `QUOTED` / `APPROVED`.
3. Eliminar microcopy redundante y aplicar refinamientos visuales.
4. Verificar HF-07 desktop.
5. Pasar a HF-08, que continúa siendo bloqueador.

### Próximos caminos posibles
- Recomendado: **HF-07 → HF-08** y cerrar primero el flujo de compra/cotización.
- Alternativa: cerrar Dark/Light + accesibilidad transversal antes de seguir mockups.
- Alternativa: cerrar Admin + resumen IA/N8N.
- Alternativa: definir API externa + JWT.

Cuando el usuario pregunte "¿qué hacemos ahora?", responder primero con el estado actual y luego ofrecer los siguientes pasos posibles. Si existe una opción claramente recomendada por el roadmap, señalarla de forma explícita.


## Estado de HF-07 — 2026-09-24

**HF-07 Carrito Híbrido: APROBADO Y CONGELADO.**

Gemini validó la segunda iteración de UXMagic:
- `PENDING_QUOTE` correcto.
- `QUOTED` correcto.
- `APPROVED` correcto.
- productos de catálogo separados del flujo de cotizaciones.
- identidad visual consistente.
- navbar de Stitch conservado.

No se requieren más iteraciones de HF-07 antes de implementación.

### Siguiente pantalla

El foco pasa a **HF-08 Checkout**, que debe resolver el pago de productos y el pago independiente de cotizaciones aprobadas, además de estados, SINPE, facturación, entrega y excepciones.

## Handoff de sesión — 2026-09-24

### Estado al pausar
La fase de mockups avanzó hasta cerrar **HF-07 Carrito Híbrido**. La validación final de Gemini sobre la segunda iteración de UXMagic fue **APROBADO**. HF-07 queda congelado y no debe seguir iterándose salvo que aparezca una contradicción de negocio o una dependencia descubierta posteriormente.

### HF-07 aprobado
La pantalla aprobada debe conservar:
- productos de catálogo con cantidad, precio y subtotal;
- solicitudes personalizadas separadas del catálogo;
- `PENDING_QUOTE` sin precio final, cantidad ni subtotal;
- `QUOTED` con monto presupuestado y acción para revisar la cotización;
- `APPROVED` con monto aprobado y acción `Pagar cotización`;
- solicitudes personalizadas sin lógica `quantity × unitPrice`;
- total de productos separado del flujo de cotizaciones;
- navbar basado en Stitch/Vértice;
- identidad Obsidian Precision Forge + Lava Orgánica.

### Punto exacto de reanudación
**Siguiente pantalla: HF-08 Checkout.**

Antes de generar HF-08:
1. diseñar la separación entre checkout de productos y pago de cotización aprobada;
2. definir estados y excepciones del checkout;
3. preparar el prompt maestro para UXMagic tomando HF-07 como referencia aprobada;
4. generar la primera propuesta HF-08;
5. auditarla visualmente con Gemini;
6. iterar hasta aprobación.

### HF-08 debe resolver
- checkout de productos de catálogo;
- pago independiente de cotización personalizada aprobada;
- SINPE;
- facturación/Hacienda;
- entrega;
- revisión y confirmación;
- loading/processing;
- validación;
- error;
- pago pendiente;
- comprobante SINPE;
- cotización caducada;
- cotización rechazada;
- responsive 375/768 preparado, aunque los mockups responsive se harán después de cerrar desktop.

### No hacer al retomar
- No volver a rediseñar HF-07.
- No empezar React todavía.
- No crear un backend Node/Express solo para N8N.
- No mezclar una cotización pendiente con productos de catálogo.
- No crear documentación paralela fuera de la estructura existente.

### Siguiente gran secuencia
HF-08 → revisión desktop global → Dark/Light → accesibilidad/ayuda → mobile 375 → tablet 768 → aprobación HF → Design System → arquitectura/datos/API/JWT → React → testing/integraciones.
