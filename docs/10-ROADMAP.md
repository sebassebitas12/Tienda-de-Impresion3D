# Vértice CR — Roadmap

> **Última actualización:** 2026-10-01
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

**Prioridad actual de entrega:** Auth → Admin → IA, indicada por el profesor y adoptada como orden operativo del proyecto.

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

> **Prioridad académica reajustada 2026-09-30:** el profesor indicó **Autenticación → Admin → IA**. Esta instrucción cambia el orden operativo anterior. Con pocos días disponibles, el proyecto se construye por **vertical slices funcionales** y el lenguaje visual HF-01 se integra en cada slice; no se espera a terminar toda la estética del sitio para comenzar funciones.

### Capa 0 — UI Kit ✅
Primitivas, estados base y componentes compartidos.

### Capa 1 — App Shell ✅
Layouts, routing, providers y navegación base.

### Capa 2 — Home HF-01 ✅ CERRADA PARA AVANZAR
- Hero/workbench, catálogo destacado, shell y preferencias globales ya están implementados.
- CI obligatorio activo y verde antes de cada entrega.
- El usuario considera Home suficientemente completa (2026-10-01) y pidió mover el foco a Admin. Iteraciones futuras se atenderán como correcciones puntuales, no como requisito para avanzar.
- R-H26 corregido: rail de piezas pasa a horizontal en tablet/móvil para no cruzarse con controles flotantes; render Dark revisado a 1280/768/374 px.
- Preferencias de lectura ampliadas a 100/150/200% global; Home refluye y navbar se pliega a 200%. Aún faltan esos tamaños en tablet/móvil/rutas secundarias y tecnología de asistencia real.
- R-H34: corregida y comprobada en captura local; en Light la foto de catálogo ya no hereda la máscara radial de Dark y Dark quedó intacto.
- Los defectos visuales nuevos se corrigen, pero **Home ya no bloquea iniciar Auth**.
- HF-01 conserva autoridad visual específica sobre Home; Admin usa los tokens/principios globales de `docs/04` con composición de trabajo propia y sin copiar el workbench.
- La revisión adicional de Home (Light, tamaños menores, escala y tecnología asistiva) se difiere y no bloquea Admin. Prioridad vigente: Admin → IA.
- R-H41 corrige el objetivo visual de Home: se mantiene el scanner horizontal original de HF-01; el líder del material se calibra para acabar sobre la pieza activa. Cards de Home pasan de tarjetas verticales a filas horizontales en dos columnas, sin stock promocional, con imagen provisional completa y ficha enlazada. Navegador local revisó los cuatro endpoints, tarjetas y collage de seis fotos. Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`. Otros breakpoints/temas y aprobación visual todavía pendientes.
- **Corrección posterior R-H42:** la revisión del usuario mostró que los cuatro endpoints R-H41 seguían cayendo en el fondo; no considerar resuelta la anotación. El líder se calcula midiendo el `object-fit: contain` y el tamaño real del objeto por asset al cambiar el viewport o la pieza. La Home aclara «Filamento · PETG», elimina la pastilla material de las destacadas y reduce las columnas de precisión a título + explicación. Render inspeccionado a 1280×800 para las cuatro piezas, y soporte a 375×812; lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check` pasan. Pendiente aprobación visual del usuario y restantes breakpoints/temas.
- **R-H43 a petición del usuario:** el líder del Hero ahora termina en una pieza cercana a la etiqueta para no atravesar el objeto; se mantiene cálculo responsive y scanner horizontal. «5 filamentos disponibles» cambia a «5 materiales definidos». Columnas de precisión ganan línea Lava + desplazamiento breve al hover, con reduced-motion. `docs/04` registra el uso puntual de Codrops Grid Item Reveal. Inspección local: cuatro detalles a 1024×780, Hero/métrica a 375×812 y hover en Dark. Pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`; aprobación del usuario y revisión restante de breakpoints/temas pendientes.
- **R-H44 a petición del usuario:** se rediseña el bloque inferior del Hero en dos señales claras («Bajo pedido» y «FDM» + filamentos confirmados), sin el conteo anterior ni el mensaje redundante «Por etapas». El marcador vertical y líder al producto comparten un solo trazo, sin corte en el codo. Render React inspeccionado a 1280×720 y 375×812; pasaron lint, 53 tests, `check:ui` (48 módulos), build y `git diff --check`; falta aprobación del usuario.
- Capacidad confirmada por el usuario: FDM únicamente, filamentos ASA, PLA, PETG, ABS y TPU. Home/DB/UI no deben seguir anunciando SLA, resina o nylon.
- **R-H45 — legibilidad y customer journey:** navbar/footer recibieron un primer aumento de tamaño y el copy de Home distingue catálogo bajo pedido de la solicitud personalizada. `routes.jsx` confirmó placeholders en el resto del storefront. `docs/03–05` mantienen el análisis y la secuencia de compra recomendada.
- **R-H46 — prioridad nueva del usuario (escala supersedida por R-H48):** Home queda cerrada para avance; no requiere pasada global ni aprobación adicional antes de Admin. El aumento a 16/15 px y el breakpoint 1000 px se revirtieron al aclarar el usuario que la captura se veía con zoom al 75%. Ver `docs/05`.
- **R-H48 — iteración puntual Home:** título de catálogo actualizado para selección editorial en tendencia; botones flotantes de asistencia a 56 px; navbar/footer restaurados a R-H45. Lint, pruebas, `check:ui`, build y diff check pasan; queda pendiente comparar visualmente el tamaño en screenshot. Detalle en `docs/05`.

### Capa 3 — Autenticación ✅ SLICE ACADÉMICO IMPLEMENTADO
Objetivo: tener una autenticación académica real y verificable antes de construir Admin.

Orden:
1. cerrar contrato académico JSON Server + token simulado; ✅
2. implementar `authService`/adapter separado de UI; ✅
3. convertir `AuthProvider` de guest fijo a sesión real; ✅
4. Login con loading/error/invalid session; ✅ base React
5. Registro según contrato disponible; ✅ base React
6. persistencia/restauración de sesión; ✅
7. logout; ✅ interfaz/provider
8. guards de rutas autenticadas; ✅
9. guard de rol admin; ✅
10. tests de login, registro duplicado, logout, sesión expirada/inválida y permisos; ✅
11. aplicar lenguaje HF-01 al AuthLayout sin crear una estética paralela. ✅ base visual

**Estado actual:** `jsonServerAuthAdapter` consulta y crea usuarios en `db.json` a través de JSON Server, persiste la sesión en `localStorage` y emite un token `sim.v1` simulado con expiración, id y rol. La credencial `demoPassword` es explícitamente académica y no es un secreto ni seguridad de producción. Login/restore/logout también se probaron contra JSON Server real. Auth cuenta con base visual React. Tras el acuerdo del usuario de cerrar Home para avanzar, el siguiente bloque es Admin operativo protegido por rol.

### Capa 4 — Admin
🟠 **EN IMPLEMENTACIÓN — slices 1–2.** Entra después de Auth porque depende de identidad/rol. Admin usa una composición operativa propia dentro de tokens Vértice; no debe replicar la Home.

Prioridad:
- guard `admin`;
- shell/dashboard;
- pedidos;
- solicitudes/cotizaciones;
- catálogo;
- clientes;
- métricas desde datos reales del repo;
- loading/empty/error/permisos;
- diseño operativo propio con tokens y principios de Vértice (`docs/04`), sin clonar la composición de Home ni usar un dashboard genérico.

El primer slice del dashboard muestra pedidos activos, solicitudes `PENDING_QUOTE`/`IN_REVIEW`, cinco pedidos activos recientes y registros que usan estados legados por separado. No informa ventas cobradas si no hay evidencia de pagos; el modelo actual no contiene `payments` ni `paidAt`. No usa `stock`/`minStock` para ninguna alerta.

**Slice 2 — solicitudes, acción inicial y dashboard rehecho:** `GET /customPrintRequests` + `GET /users`, filtros, diagrama de fases, detalle y transición auditada `PENDING_QUOTE → IN_REVIEW`. `POST /admin/actions/start-review` valida rol/estado, cambia estado y agrega `REQUEST_REVIEW_STARTED` en una sola escritura. `/admin` usa carril de KPI, gráfica SVG sobre estados reales, registro de pedidos abierto y cola accionable; no se replica estructura Stitch ni se editó Home. Referencias/decisiones en `docs/04`, `docs/05`, `docs/08`. Descarga de archivo no disponible hasta escoger proveedor. No hay precio para `PENDING_QUOTE`/`IN_REVIEW`. Verificación local de código pasa; comparación visual responsive/Light queda pendiente.

**Slice completado:** `/admin/actividad` consulta y ordena `activityLog`, permite el filtro `?solicitud=<id>` desde el detalle y representa estados loading/error/empty; no crea muestras ficticias. El sidebar de escritorio permite desplazarse dentro del panel cuando sus enlaces no caben en la altura disponible; móvil conserva navegación horizontal. Contratos/límites en `docs/07` y `docs/08`.

**Slice completado:** Admin de pedidos de solo lectura con registro, búsqueda, filtros por grupo de estado, asociación con cliente/productos/líneas y detalle con etapa/importe de origen. El dashboard enlaza por ID. Estados desconocidos quedan en “Por aclarar”; no hay acciones de mutación hasta definir transiciones/actor/evento. Diseño de superficies más suaves en `docs/04`, auditoría R-H52 en `docs/05` y contratos en `docs/02`, `docs/07`, `docs/08`.

**Slice actual — CRUD esencial de catálogo:** el requisito Must de `01` exige CRUD principal y `ANTEPROYECTO_FINAL.md` concreta productos/categorías, pero las rutas ya declaradas `/admin/catalogo/nuevo`, `/admin/catalogo/:id/editar` y `/admin/catalogo/categorias` seguían en `ConstructionPage`. Se cerró el contrato mínimo: producto ACTIVE/INACTIVE; baja lógica preferida; baja definitiva bloqueada ante `orderItems`; categoría no se borra si tiene productos; no inventario ni storage. Implementados formularios de producto y CRUD de categorías sobre servicios JSON Server. Pendiente completar verificación funcional de mutations, escenario de datos con referencia histórica, inspección visual/responsive y CI.

**Siguiente bloque:** recorrido Clientes Admin con lectura/ficha y privacidad; luego verificación/ajustes del CRUD recién implementado y cerrar las operaciones faltantes que salgan en el recorrido. Después avanzar storefront y checkout académico. IA/N8N se reserva tras cubrir Admin operativo. Las transiciones de cotización requieren contrato de precio/validez/notas y upload/descarga proveedor/URL de almacenamiento privado. No borrar ni editar pedidos desde CRUD genérico.

### Capa 5 — IA / N8N
Entra después de que Auth + Admin tengan contratos y datos suficientes.

Primero:
- `aiService.js`;
- webhook N8N normalizado;
- chatbot `mode: "chat"`;
- resumen admin `mode: "admin_summary"`;
- errores/timeouts/loading;
- etiqueta **ORIENTATIVO · SUJETO A VALIDACIÓN** donde corresponda;
- IA nunca inventa números ni emite cotización final.

### Capa 6 — Tienda / Catálogo
Listado, búsqueda/filtros, ProductCard y estados reales.

### Capa 7 — Detalle de producto
`/producto/:id` con datos reales y estados.

### Capa 8 — Solicitud personalizada
Upload, revisión y ciclo de cotización según docs/02.

### Capa 9 — Carrito + Checkout
Separar catálogo de solicitud/cotización aprobada.

### Capa 10 — Cuenta / Pedidos + páginas públicas secundarias
Cuenta, pedidos, FAQ, Sobre nosotros, Contacto, Materiales, Requisitos, etc.

### Capa 11 — Auditoría y cierre global
Coverage, lint, build, responsive 375/768/1280, Dark/Light, accesibilidad, estados y revisión visual transversal.

### Regla de avance reajustada

No usar “terminar toda la estética primero” ni “hacer toda la lógica primero”.

El flujo es:
**contrato → slice funcional → estados → tests/CI → identidad HF-01 → aprobación → siguiente slice**.

Home puede seguir recibiendo correcciones visuales durante Auth/Admin si el usuario detecta defectos, pero no debe absorber días completos mientras faltan funciones obligatorias.

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
