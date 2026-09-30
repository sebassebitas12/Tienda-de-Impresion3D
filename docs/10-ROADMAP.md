# Vértice CR — Roadmap

> **Última actualización:** 2026-09-30  
> **Estado:** ACTIVO  
> **Fase actual:** 4 — Fundaciones React.  
> **React:** DESBLOQUEADO (Gate abierto 2026-09-30).

## Fase 3 — Cierre de diseño

### Objetivo

Convertir HF-01 en la referencia visual de máxima fidelidad de la Home y cerrar el contrato mínimo necesario para pasar a React sin improvisar.

### Estado actual

- HF-01: ✅ **CONGELADO** (aprobación del usuario, 2026-09-30).
- Dark/Light: definidos en `04`.
- Accesibilidad: criterios definidos en `04`.
- Referencias de diseño: consolidadas en `04`.
- Mockup HTML de referencia: `mockups/hf-01-home-definitivo.html` (congelado).
- No se crean más mockups HTML para las demás pantallas.

### Pendientes antes del gate

1. Auditoría visual profunda de HF-01.
2. Resolver bugs visuales y rupturas responsive: defectos V-01 y V-04 a V-09 registrados en `05` (V-02 y V-03 pasan a requisitos de React).
3. Cerrar navegación/header, chat y accesibilidad.
4. Verificar que la Home comunique tienda/producto, no solo dirección de arte.
5. Aprobar formalmente HF-01.

## Preflight antes de React — SUPERADO ✅ (2026-09-30)

Todos los requisitos del gate fueron cerrados antes de iniciar React:

1. **Producto/negocio:** alcance, estados y reglas cerrados en `01–02`.
2. **UX:** rutas y flujos estables en `03`.
3. **Diseño:** tokens, responsive y accesibilidad definidos en `04–05`.
4. **Arquitectura:** estructura y límites cerrados en `06`.
5. **Datos/API/auth:** contratos y normalización definidos en `07`.
6. **Testing:** estrategia preparada en `09`.
7. **Dependencias:** se instalan según necesidad documentada.
8. **Gate final:** documentación y repo alineados.

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

## Secuencia operativa de construcción React

Esta es la guía de continuación para agentes. Si una sesión termina, el siguiente agente toma el **primer bloque no cerrado** de esta lista, salvo instrucción explícita del usuario.

### Capa 0 — UI Kit ✅
Primitivas, estados base y componentes compartidos.

### Capa 1 — App Shell ✅
Layouts, routing, providers y navegación base.

### Capa 2 — Home HF-01 🟠 EN CURSO
Orden interno:
1. Hero/workbench y assets. ✅
2. Catálogo destacado y placeholder visual temporal mientras no existan fotos reales. ✅
3. Auditar fidelidad real en 1280 / 768 / 375, dark/light. 🟠 Auditoría del usuario en curso.
4. Completar elementos de HF-01 aún ausentes en React: chatbot/asistente y panel de accesibilidad.
5. Cerrar preferencias globales definidas en docs/04: idioma, escala tipográfica, contraste/movimiento y persistencia entre rutas.
6. Corregir hallazgos de auditoría sin rediseñar el mockup congelado.
7. Cerrar Capa 2 con lint/build/tests disponibles + evidencia visual. Solo entonces pasar a Tienda.

### Capa 3 — Tienda / Catálogo
- ruta /catalogo;
- listado, búsqueda/filtros y estados loading/empty/error;
- ProductCard con datos reales cuando existan;
- responsive y preferencias globales heredadas;
- no inventar productos, stock, precios ni fotos.

### Capa 4 — Detalle de producto
- ruta /producto/:id;
- producto, material, stock, especificaciones y acción comercial según datos reales;
- ayuda consistente y accesibilidad;
- interacciones visuales/3D solo si aportan al producto y tienen justificación.

### Capa 5 — Solicitud personalizada
- /solicitud;
- /solicitud/archivo;
- /solicitud/ayuda-diseno;
- upload y estados;
- revisión antes de cotización;
- respetar docs/02 y no convertir PENDING_QUOTE en producto.

### Capa 6 — Carrito
- /carrito;
- separar productos de solicitudes/cotizaciones;
- totales únicamente donde el dominio los permita.

### Capa 7 — Checkout
- /checkout/productos;
- /checkout/solicitud;
- stepper, datos, entrega, revisión y estados de pago/simulación según alcance académico.

### Capa 8 — Auth, cuenta y pedidos
- registro/acceso dentro del alcance académico;
- /cuenta;
- /pedidos/:id;
- cotizaciones, aprobación y seguimiento según contratos vigentes.

### Capa 9 — Páginas públicas secundarias
FAQ, Sobre nosotros, Contacto y equivalentes ya definidos por navegación/alcance. Reutilizar shell y preferencias globales.

### Capa 10 — Admin
Dashboard y rutas /admin/* siguiendo docs/02, docs/06 y docs/08.

### Capa 11 — Integraciones
API/JSON Server, JWT/auth, N8N, IA y archivos 3D cuando la UI y el contrato correspondiente estén listos. Las simulaciones académicas deben estar documentadas.

### Capa 12 — Auditoría y cierre global
Tests, lint, build, coverage, responsive 375/768/1280, Dark/Light, accesibilidad, estados, rendimiento y revisión visual transversal.

### Regla de avance

**No saltar a la siguiente capa porque “ya se ve”.** Si el usuario detecta una omisión de la capa actual —por ejemplo chatbot, accesibilidad o preferencias globales en Home— se resuelve antes de declarar la capa cerrada.

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