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

### Capa 2 — Home HF-01 🟠 ESTABILIZACIÓN VISUAL
- Hero/workbench, catálogo destacado, shell y preferencias globales ya están implementados.
- CI obligatorio activo y verde antes de cada entrega.
- El usuario continúa auditando visualmente Home.
- R-H26 corregido: rail de piezas pasa a horizontal en tablet/móvil para no cruzarse con controles flotantes; render Dark revisado a 1280/768/374 px.
- Preferencias de lectura ampliadas a 100/150/200% global; Home refluye y navbar se pliega a 200%. Aún faltan esos tamaños en tablet/móvil/rutas secundarias y tecnología de asistencia real.
- R-H34: corregida y comprobada en captura local; en Light la foto de catálogo ya no hereda la máscara radial de Dark y Dark quedó intacto.
- Los defectos visuales nuevos se corrigen, pero **Home ya no bloquea iniciar Auth**.
- HF-01 sigue siendo el sistema visual que se expande a todos los módulos.
- Por prioridad del usuario, tras cerrar Auth se completa una revisión visual enfocada de Home antes de abrir Admin: revisar breakpoints/temas/escala de texto restantes y validar teclado + tecnología asistiva real. Luego Admin → IA. Esto no implica rediseñar HF-01 ni rehacer Home completa.

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

**Estado actual:** `jsonServerAuthAdapter` consulta y crea usuarios en `db.json` a través de JSON Server, persiste la sesión en `localStorage` y emite un token `sim.v1` simulado con expiración, id y rol. La credencial `demoPassword` es explícitamente académica y no es un secreto ni seguridad de producción. La suite local actual pasa 54 tests, lint, `check:ui` y build; login/restore/logout también se probaron contra JSON Server real. Login y registro se inspeccionaron en Dark/Light en 1920, 1280, 768 y 374 px CSS, sin overflow horizontal; la galería muestra cuatro productos existentes y ya no conserva el chrome ficticio. GitHub Actions debe validar el commit antes de recomendar pull. Próximo bloque: completar revisión visual Home Dark/Light y estados abiertos; después Admin operativo con datos reales.

### Capa 4 — Admin
Entra inmediatamente después de Auth porque depende de identidad/rol.

Prioridad:
- guard `admin`;
- shell/dashboard;
- pedidos;
- solicitudes/cotizaciones;
- catálogo;
- clientes;
- métricas desde datos reales del repo;
- loading/empty/error/permisos;
- diseño derivado de HF-01, no dashboard genérico.

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
