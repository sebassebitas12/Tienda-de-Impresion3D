# Fase 3 — UX, user flow y mockup

## 1. Propósito de esta fase

Esta fase define la experiencia de la tienda antes de implementarla. Las decisiones se basan en el brief de la Fase 1 y en la dirección visual de la Fase 2.

La tienda tiene dos modelos de negocio que deben convivir sin confundirse:

1. **Compra de productos terminados**, dirigida principalmente al consumidor casual.
2. **Solicitud de impresión personalizada**, dirigida principalmente al cliente técnico, estudiante, hobbista o corporativo.

Ambos caminos tendrán el mismo peso en la entrada de la aplicación, pero cada uno conservará su lógica operativa. El carrito podrá mostrar productos y solicitudes, aunque cada tipo tendrá un checkout separado.

La interfaz debe transmitir **tecnología de precisión con accesibilidad local**: premium para el inversor, clara para el comprador casual y suficientemente técnica para quien solicita una pieza personalizada.

## 2. Decisiones UX consolidadas

| Tema | Decisión | Justificación |
|---|---|---|
| Entrada principal | El hero presenta dos caminos equivalentes: comprar productos y solicitar una impresión personalizada | Representa los dos modelos de negocio desde el primer contacto |
| Navegación principal | Inicio, Catálogo, Carrito y Cuenta | Mantiene el encabezado limpio y reserva Personalizado para momentos contextuales |
| CTA personalizado | Aparece destacado en el hero y dentro del catálogo | El cliente técnico encuentra su flujo sin sobrecargar permanentemente la navegación |
| Inicio | Home editorial con hero, manifiesto de marca, destacados y categorías | Refuerza identidad y descubrimiento sin convertir la portada en un dashboard de opciones |
| Categorías | Gadgets, Figuras, Juguetes, Decoración y Piezas funcionales | Organiza el catálogo con una clasificación comprensible para públicos distintos |
| Catálogo | Descubrimiento visual primero; resultados dedicados después | Evita una cuadrícula fría y permite explorar antes de filtrar |
| Tarjetas | Imagen, nombre y precio | Mantiene la exploración limpia; detalles técnicos quedan para el producto |
| Búsqueda | Consulta al backend con debounce | Escala mejor y evita peticiones por cada pulsación |
| URL del catálogo | Búsqueda y categoría en query params; filtros avanzados en estado interno | Permite compartir y recuperar búsquedas sin crear URLs excesivamente complejas |
| Detalle | Comprar y personalizar tienen el mismo peso | Conecta catálogo y fabricación a medida |
| Especificaciones | Bloque expandible “Especificaciones técnicas” | Atiende al cliente técnico sin saturar al consumidor casual |
| Variantes | Cantidad, color y material | Son decisiones reales del producto y deben quedar representadas en el carrito |
| Galería | Miniaturas en escritorio; carrusel táctil en móvil | Aprovecha el espacio de cada dispositivo |
| Disponibilidad | Solo visible dentro del detalle | Conserva tarjetas limpias |
| Producto no disponible | Sigue visible, sin acción alternativa en esta versión | Conserva el descubrimiento sin agregar una funcionalidad no definida |
| Error de imagen | Placeholder propio con rejilla CAD sutil | Mantiene la dirección visual y evita stock genérico |
| Agregar al carrito | Feedback inline y contador actualizado | Confirma la acción sin interrumpir el descubrimiento |
| Carrito | Un resumen que separa visualmente Productos y Solicitudes | Conserva el modelo híbrido sin mezclar conceptos |
| Checkout | Dos botones separados en el carrito | Productos y cotizaciones no pueden compartir el mismo cálculo de precio |
| Checkout de productos | Datos → entrega → revisión | Reduce errores y da claridad antes de confirmar |
| Checkout de solicitudes | Datos → entrega → revisión, adaptado a enviar solicitud | Mantiene un patrón común y deja claro que el importe está pendiente |
| Invitados | Pueden explorar y completar datos, pero no confirmar | La compra y la solicitud requieren una cuenta real |
| Login | Modal sobre la pantalla actual | Conserva el contexto del carrito o checkout |
| Registro | Pantalla dedicada `/registro` | Permite explicar el registro y solicitar datos con espacio suficiente |
| Registro inicial | Nombre, correo y contraseña | Reduce fricción; dirección y teléfono se completan después |
| Cuenta | Perfil, edición de datos e historial unificado | Permite gestionar pedidos y solicitudes desde un mismo lugar |
| Historial | Resumen unificado con filtros por tipo | Muestra toda la actividad sin duplicar pantallas |
| Solicitud personalizada | Tres pasos: archivo/ayuda → requisitos técnicos → contacto y revisión | Reduce carga cognitiva y sirve tanto a usuarios preparados como a quienes necesitan orientación |
| Archivo 3D | Dos entradas: “Tengo archivo” y “Necesito ayuda con el diseño” | No todos los clientes técnicos llegan con un modelo listo |
| Autenticación en solicitud | Se exige solo antes de enviar | Permite avanzar sin fricción y mantiene la asociación con el usuario autenticado |
| Datos al iniciar sesión | Autocompletar campos vacíos y permitir revisar diferencias | Evita sobrescribir información específica del pedido |
| Borrador | Guardado local del formulario y del archivo cuando sea posible | Evita perder una solicitud extensa por recarga o salida accidental |
| Precio personalizado | “Pendiente de cotización” y explicación de factores | No se inventa un precio antes de revisar material, tamaño, complejidad, cantidad y tiempo |
| Solicitud enviada | Estado “Recibida” → “En revisión” y contacto por WhatsApp | Comunica progreso y ofrece un canal directo |
| WhatsApp | Botón flotante en Inicio, Catálogo, Detalle y Solicitud | Apoya conversión donde hay dudas sin invadir cuenta o checkout |
| Móvil | Menú desplegable general y barra inferior contextual en Catálogo y Checkout | Conserva espacio y facilita acciones durante tareas de alta intención |
| Admin | Administrador único, preparado para roles futuros | Mantiene el MVP simple sin cerrar la evolución de permisos |
| Panel admin | Dashboard completo más bandejas operativas | Combina visión general y trabajo inmediato |

## 3. Mapa de navegación completo

### 3.1 Navegación pública y comercial

```text
/
├── /catalogo
│   ├── /catalogo?categoria=gadgets
│   ├── /catalogo?categoria=figuras
│   ├── /catalogo?categoria=juguetes
│   ├── /catalogo?categoria=decoracion
│   ├── /catalogo?categoria=piezas-funcionales
│   └── /catalogo?q=...
├── /producto/:id
├── /solicitud
│   ├── /solicitud/archivo
│   └── /solicitud/ayuda-diseno
├── /carrito
├── /checkout/productos
│   ├── /checkout/productos/datos
│   ├── /checkout/productos/entrega
│   └── /checkout/productos/revision
├── /checkout/solicitud
│   ├── /checkout/solicitud/datos
│   ├── /checkout/solicitud/entrega
│   └── /checkout/solicitud/revision
├── /registro
├── /pedido/:id
└── /cuenta
    └── actividad con filtros por tipo
```

El login se presenta como modal y no necesita una ruta pública propia para las acciones iniciadas desde la tienda. El registro sí tiene la ruta `/registro` porque es una pantalla dedicada.

### 3.2 Navegación administrativa

```text
/admin
├── /admin/pedidos
│   └── /admin/pedidos/:id
├── /admin/solicitudes
│   └── /admin/solicitudes/:id
├── /admin/catalogo
│   ├── /admin/catalogo/nuevo
│   ├── /admin/catalogo/:id
│   ├── /admin/catalogo/:id/editar
│   ├── /admin/catalogo/categorias
│   ├── /admin/catalogo/archivos
│   └── /admin/catalogo/importar-exportar
├── /admin/clientes
│   └── /admin/clientes/:id
└── /admin/actividad
```

Configuración y roles futuros quedan como submódulos del área administrativa, no como elementos principales de la navegación inicial.

### 3.3 Navegación principal por contexto

| Contexto | Navegación visible |
|---|---|
| Público | Inicio, Catálogo, Carrito, Cuenta |
| Catálogo en móvil | Menú desplegable más barra inferior contextual |
| Checkout en móvil | Menú reducido más barra inferior contextual |
| Cuenta | Perfil, actividad unificada, edición de datos, cerrar sesión |
| Administración | Dashboard, Pedidos, Solicitudes, Catálogo, Clientes, Actividad |

## 4. User flow del consumidor casual

### 4.1 Recorrido principal

```text
Inicio
  ↓
Comprar productos
  ↓
Descubrimiento: destacados y categorías
  ↓
Catálogo
  ↓
Búsqueda, categoría o filtros
  ↓
Resultados dentro de /catalogo
  ↓
Detalle del producto
  ↓
Seleccionar cantidad, color y material
  ↓
Agregar al carrito
  ↓
Feedback inline + contador actualizado
  ↓
Carrito
  ↓
Checkout de productos
  ↓
Datos
  ↓
Entrega
  ↓
Revisión
  ↓
Login modal o registro si no existe cuenta
  ↓
Confirmación
  ↓
/pedido/:id
  ↓
Redirección automática a /cuenta con actividad actualizada
```

### 4.2 Decisiones del recorrido

El usuario no entra directamente a una cuadrícula extensa. Primero encuentra una selección de productos destacados y categorías visuales. Si busca algo concreto, puede usar el buscador, que consulta el backend con debounce.

La búsqueda no crea una ruta adicional. La misma ruta `/catalogo` representa tanto el descubrimiento como los resultados, utilizando `q` y `categoria` en la URL.

La tarjeta no intenta vender toda la especificación técnica. Su función es provocar exploración. El detalle es el lugar donde el usuario conoce material, dimensiones, tiempo de impresión, disponibilidad y variantes.

El usuario puede avanzar como visitante hasta la revisión, pero el botón de confirmación exige autenticación. El login aparece en modal y conserva el pedido ya construido.

## 5. User flow del cliente técnico

### 5.1 Recorrido con archivo

```text
Inicio o Catálogo
  ↓
CTA “Solicitar una impresión personalizada”
  ↓
Pantalla de solicitud
  ↓
“Ya tengo mi archivo” / “Tengo archivo”
  ↓
Paso 1: cargar archivo .stl/.obj
  ↓
Paso 2: requisitos técnicos
       material, color, relleno, cantidad, dimensiones,
       tolerancias, uso y notas
  ↓
Paso 3: contacto y revisión
  ↓
Autocompletar datos si inicia sesión
  ↓
Revisar diferencias y editar
  ↓
Agregar al carrito como “Pendiente de cotización”
  ↓
Carrito: sección Solicitudes
  ↓
Botón “Continuar con solicitud de cotización”
  ↓
Checkout de solicitud: datos → entrega → revisión
  ↓
Login modal o registro antes de enviar
  ↓
Enviar solicitud
  ↓
/pedido/:id o confirmación de solicitud
  ↓
Cuenta: actividad con estado “Recibida”
  ↓
Estado posterior: “En revisión” + WhatsApp
```

### 5.2 Recorrido sin archivo

```text
Inicio o Catálogo
  ↓
CTA de solicitud personalizada
  ↓
“Necesito ayuda con el diseño”
  ↓
Paso 1: descripción o referencia
  ↓
Paso 2: requisitos técnicos
  ↓
Paso 3: contacto y revisión
  ↓
Agregar al carrito como solicitud pendiente
  ↓
Checkout específico de solicitud
  ↓
Autenticación antes de enviar
  ↓
Estado “Recibida” → “En revisión”
```

### 5.3 Reglas del recorrido técnico

El archivo no es la única puerta de entrada. La tienda acepta tanto al usuario que ya tiene un `.stl` o `.obj` como al que necesita ayuda para definir el diseño.

El formulario funciona por pasos. En escritorio, el resumen final ofrece enlaces directos para editar cada sección. En móvil, la navegación vuelve a los pasos para conservar una interacción clara y cómoda.

El formulario se guarda como borrador local cuando sea posible. El archivo puede no sobrevivir en todos los navegadores o contextos, por lo que la interfaz debe informar si necesita volver a seleccionarse.

## 6. User flow del administrador

### 6.1 Acceso y dashboard

```text
/login administrativo
  ↓
Validación de administrador
  ↓
/admin
  ├── Métricas generales
  ├── Alertas
  ├── Acciones rápidas
  ├── Pedidos recientes
  ├── Solicitudes pendientes
  ├── Productos agotados o no publicados
  ├── Actividad reciente
  └── Accesos a bandejas
```

Habrá un administrador único en esta versión. La arquitectura de permisos debe dejar espacio para roles futuros, aunque no se diseñen todavía permisos separados para operadores.

### 6.2 Gestión de pedidos

```text
/admin/pedidos
  ↓
Buscar, filtrar y ordenar
  ↓
/admin/pedidos/:id
  ├── Datos del cliente
  ├── Productos y variantes
  ├── Dirección
  ├── Estado
  ├── Actividad
  ├── Editar pedido
  ├── Cambiar estado
  ├── Cancelar
  └── Simular reembolso
```

Las acciones de pago y reembolso son simuladas porque el MVP no integra una pasarela real.

### 6.3 Gestión de solicitudes

```text
/admin/solicitudes
  ↓
Buscar, filtrar por estado y ordenar
  ↓
/admin/solicitudes/:id
  ├── Archivo 3D y descarga
  ├── Datos técnicos
  ├── Datos del cliente
  ├── Notas internas
  ├── Cotización
  ├── Tiempo estimado
  ├── Contacto por WhatsApp
  ├── Aprobar archivo
  ├── Rechazar archivo con motivo
  ├── Cambiar estado
  └── Convertir en pedido
```

### 6.4 Gestión de catálogo

```text
/admin/catalogo
  ├── Listado de productos
  ├── Crear producto
  ├── Editar producto
  ├── Publicar u ocultar
  ├── Gestionar categorías
  ├── Gestionar imágenes
  ├── Gestionar variantes
  ├── Gestionar materiales
  ├── Gestionar precios
  ├── Gestionar disponibilidad
  └── Importar/exportar datos
```

### 6.5 Gestión de clientes y actividad

```text
/admin/clientes
  ↓
Buscar y filtrar clientes
  ↓
/admin/clientes/:id
  ├── Perfil
  ├── Editar datos
  ├── Pedidos
  └── Solicitudes

/admin/actividad
  ├── Cambios de catálogo
  ├── Cambios de pedidos
  ├── Cambios de solicitudes
  └── Acciones administrativas
```

El administrador podrá consultar y editar datos de clientes, además de ver sus pedidos y solicitudes. No se incluye en esta decisión suspender cuentas ni revisar actividad de acceso.

## 7. Rutas definitivas de la aplicación

| Ruta | Acceso | Propósito |
|---|---|---|
| `/` | Público | Home editorial con hero, manifiesto, destacados y categorías |
| `/catalogo` | Público | Descubrimiento, búsqueda, categorías y resultados |
| `/producto/:id` | Público | Detalle, variantes, especificaciones y acciones |
| `/solicitud` | Público | Explicación breve y elección entre archivo o ayuda de diseño |
| `/solicitud/archivo` | Público | Inicio de solicitud con archivo 3D |
| `/solicitud/ayuda-diseno` | Público | Inicio de solicitud sin archivo listo |
| `/carrito` | Público | Resumen separado de productos y solicitudes |
| `/checkout/productos` | Público hasta confirmar | Checkout de productos |
| `/checkout/solicitud` | Público hasta enviar | Checkout de solicitudes pendientes |
| `/registro` | Público | Creación de cuenta |
| `/pedido/:id` | Autenticado | Confirmación inicial del pedido o solicitud |
| `/cuenta` | Autenticado | Perfil, edición de datos y actividad unificada |
| `/admin` | Administrador | Dashboard completo |
| `/admin/pedidos` | Administrador | Bandeja de pedidos |
| `/admin/pedidos/:id` | Administrador | Detalle y operaciones del pedido |
| `/admin/solicitudes` | Administrador | Bandeja de cotizaciones |
| `/admin/solicitudes/:id` | Administrador | Revisión operativa de solicitud |
| `/admin/catalogo` | Administrador | Gestión del catálogo |
| `/admin/catalogo/nuevo` | Administrador | Crear producto |
| `/admin/catalogo/:id/editar` | Administrador | Editar producto |
| `/admin/clientes` | Administrador | Gestión de clientes |
| `/admin/clientes/:id` | Administrador | Detalle de cliente |
| `/admin/actividad` | Administrador | Registro de actividad administrativa |

Los estados de checkout pueden representarse internamente como pasos de la misma ruta o como subrutas. La decisión visual es que el usuario perciba un flujo continuo de tres pasos.

## 8. Descripción de pantallas y estados

### 8.1 Home `/`

**Contenido:** hero con dos CTAs equivalentes, manifiesto de marca, productos destacados cargados desde backend, categorías estáticas y elementos editoriales.

**Estados:** carga de destacados, destacados cargados, error contextual con reintento, ausencia de destacados, navegación normal y WhatsApp visible.

**Decisión:** la home no incluye testimonios ni una sección extensa de “cómo funciona” en esta fase. La marca y el descubrimiento son su trabajo principal.

### 8.2 Catálogo `/catalogo`

**Contenido:** categorías, buscador, filtros, resultados y tarjetas con imagen, nombre y precio.

**Estados:** carga inicial, catálogo cargado, búsqueda con debounce, resultados encontrados, sin resultados, error con reintento y paginación o carga de más.

**Estado vacío:** muestra categorías sugeridas, opción para limpiar filtros y CTA hacia solicitud personalizada.

### 8.3 Detalle `/producto/:id`

**Contenido:** galería, nombre, precio, disponibilidad, variantes, CTA de carrito, CTA personalizado y especificaciones expandibles.

**Estados:** carga, producto cargado, producto no encontrado, error con reintento y retorno al catálogo, imagen cargando, imagen fallida y producto no disponible.

**Responsive:** miniaturas en escritorio y carrusel táctil en móvil.

### 8.4 Solicitud `/solicitud`

**Contenido:** explicación breve del proceso y dos caminos: “Tengo archivo” y “Necesito ayuda con el diseño”.

**Estados:** inicial, selección de camino, borrador recuperado, borrador descartado y error de recuperación.

### 8.5 Solicitud con archivo `/solicitud/archivo`

**Contenido:** carga de `.stl` o `.obj`, límite de peso, validación y avance a requisitos.

**Estados:** vacío, archivo seleccionado, carga, archivo válido, formato inválido, tamaño excedido, error de carga, archivo eliminado y archivo recuperado desde borrador.

### 8.6 Solicitud con ayuda `/solicitud/ayuda-diseno`

**Contenido:** descripción, referencias, uso previsto y requisitos disponibles.

**Estados:** formulario vacío, datos parciales, datos válidos, validación, borrador recuperado y error de guardado local.

### 8.7 Requisitos técnicos

**Contenido:** material, color, relleno, cantidad, dimensiones, tolerancias, uso, fecha deseada y notas.

**Estados:** incompleto, validación de campos, completo, archivo incompatible con requisitos y recuperación de borrador.

### 8.8 Contacto y revisión

**Contenido:** datos de contacto, entrega, archivo o referencia, requisitos, factores que afectan la cotización y acciones de edición.

**Estados:** visitante, campos autocompletados tras login, diferencias entre formulario y perfil, revisión válida, datos incompletos y solicitud lista para agregar al carrito.

### 8.9 Carrito `/carrito`

**Contenido:** sección Productos, sección Solicitudes, variantes, cantidades, subtotales, mensajes de cotización pendiente y dos botones de checkout separados.

**Estados:** vacío, solo productos, solo solicitudes, productos y solicitudes juntos, producto agotado, solicitud pendiente, carrito recuperado de `localStorage` y conflicto de sincronización.

**Sincronización:** al iniciar sesión, si existe un carrito guardado en cuenta y otro de invitado, se ofrecen tres opciones: conservar invitado, conservar cuenta o combinar.

### 8.10 Checkout de productos

**Paso 1 — Datos:** datos del cliente y aviso visible de que se requiere una cuenta para confirmar.

**Paso 2 — Entrega:** dirección, teléfono y preferencias necesarias.

**Paso 3 — Revisión:** productos, variantes, entrega, total, condiciones y confirmación.

**Estados:** avance, retroceso, validación, login modal, registro, error de datos, error de creación, confirmación pendiente y éxito.

### 8.11 Checkout de solicitudes

Usa los mismos tres pasos, pero sustituye el total confirmado por una explicación de **“Pendiente de cotización”**.

**Contenido adicional:** factores que definirán el precio: material, tamaño, complejidad, cantidad y tiempo de impresión.

**Acción final:** “Enviar solicitud”, no “Pagar” ni “Confirmar compra”.

### 8.12 Login modal

**Contenido:** correo, contraseña, recuperación futura y enlace “Crear cuenta”.

**Estados:** inicial, validación, credenciales incorrectas, carga, éxito, error de red y cierre.

**Regla:** al elegir crear cuenta, se navega a `/registro`.

### 8.13 Registro `/registro`

**Contenido:** nombre, correo y contraseña. La dirección y el teléfono se completan después.

**Estados:** formulario inicial, validación, correo existente, contraseña inválida, carga, registro exitoso y error de red.

### 8.14 Pedido `/pedido/:id`

**Contenido:** resultado completo para usuario autenticado, resumen, estado inicial, productos o solicitud, y próximos pasos.

**Estados:** carga, pedido encontrado, pedido no encontrado, error y confirmación.

Después de la primera confirmación, el sistema redirige automáticamente a `/cuenta` con la actividad actualizada.

### 8.15 Cuenta `/cuenta`

**Contenido:** perfil básico, edición de datos, dirección, teléfono y resumen unificado de pedidos y solicitudes.

**Estados:** autenticado, carga de perfil, edición, guardado exitoso, error de guardado, actividad vacía y filtros por tipo.

### 8.16 Dashboard `/admin`

**Contenido:** métricas, alertas, pedidos recientes, solicitudes pendientes, productos agotados/no publicados, actividad reciente y accesos rápidos.

**Estados:** carga, dashboard cargado, datos parciales, error por widget, sin actividad y permisos insuficientes.

### 8.17 Bandeja administrativa

**Pedidos:** filtros, búsqueda, orden, estados, acciones y acceso al detalle.

**Solicitudes:** filtros por Recibida, En revisión, Cotizada, Aprobada, Rechazada y Convertida; acceso a archivos y acciones operativas.

**Estados comunes:** carga, resultados, vacío, error, selección, acción en proceso, éxito y confirmación de acción destructiva.

### 8.18 Catálogo administrativo

**Contenido:** productos, categorías, imágenes, variantes, materiales, precios, disponibilidad e importación/exportación.

**Estados:** listado, búsqueda, creación, edición, guardado, publicación, ocultamiento, eliminación, importación válida, importación inválida, exportación y error.

### 8.19 Clientes y actividad administrativa

**Clientes:** búsqueda, filtros, perfil, edición, pedidos y solicitudes.

**Actividad:** eventos administrativos ordenados cronológicamente.

**Estados:** carga, vacío, error, cliente encontrado, cliente inexistente, guardado exitoso y cambios pendientes.

## 9. Decisiones de mockup y composición

### 9.1 Home

- Fondo dark mode `#0A0E1A`.
- Hero dividido: mensaje a la izquierda y visual de producto o fabricación a la derecha.
- Dos CTAs equivalentes, sin convertir uno en acción secundaria.
- Rejilla CAD con opacidad baja únicamente en el hero.
- Manifiesto breve que explique fabricación local con alcance global.
- Productos destacados como una selección curada, no como todo el catálogo.
- Categorías como bloques visuales enlazables.

### 9.2 Catálogo

- Contenedor de hasta 1280px y grid de 12 columnas.
- Buscador visible sin dominar la pantalla.
- Tarjetas limpias con imagen, nombre y precio.
- Cian reservado para acciones y estados importantes.
- Categorías accesibles desde bloques y menú desplegable.
- Sin badge de disponibilidad en tarjeta.

### 9.3 Detalle

- Galería como primer ancla visual.
- Información comercial y acciones junto a la imagen.
- Especificaciones en acordeón.
- Dos CTAs con jerarquía equivalente.
- Variantes visibles antes de agregar al carrito.
- Glow solo en interacción y acciones principales.

### 9.4 Formularios

- Flujo por pasos con indicador de avance.
- Secciones cortas y agrupadas por intención.
- Validación cercana al campo.
- Errores claros y accionables.
- Resumen editable antes de enviar.
- En móvil, navegación paso a paso; en escritorio, enlaces directos de edición.

### 9.5 Panel administrativo

- Layout de aplicación, diferente al marketing público.
- Navegación lateral persistente en escritorio.
- Dashboard con tarjetas métricas y bandejas operativas.
- Tablas o listas con filtros y acciones claras.
- Confirmación para cancelar, eliminar, rechazar o simular reembolso.
- Mismo lenguaje visual, pero con mayor densidad de información.

## 10. Lo que se descartó y por qué

| Propuesta descartada | Motivo |
|---|---|
| “Personalizado” como elemento permanente principal del header | La navegación debe mantenerse limpia; el CTA funciona mejor en hero y catálogo |
| Catálogo completo como primera vista | Perjudica el descubrimiento visual y se siente como una cuadrícula genérica |
| Especificaciones técnicas visibles en cada tarjeta | Satura al consumidor casual |
| Mini-resumen flotante al agregar al carrito | Interrumpe la exploración; el feedback inline es suficiente |
| Login obligatorio al entrar al checkout | Aumenta fricción antes de que el usuario comprenda el pedido |
| Compras o solicitudes como invitado | El proyecto requiere cuenta real para asociar datos e historial |
| Registro dentro de modal | El registro necesita una pantalla dedicada |
| Formulario personalizado en una sola pantalla | Demasiados campos y archivo aumentan carga cognitiva |
| Archivo 3D obligatorio | Excluye a quienes necesitan ayuda para definir su diseño |
| Precio estimado automático | Sin análisis real del modelo, el precio podría ser engañoso |
| Un solo checkout indistinto | Productos tienen precio confirmado y solicitudes tienen precio pendiente |
| Dos carritos completamente separados | Se pierde la visión unificada de actividad antes de elegir checkout |
| Un solo botón de checkout para todo el carrito | No permite distinguir compra de cotización |
| Confirmación genérica para invitados | No existen confirmaciones sin cuenta |
| Categorías únicamente en bloques | El menú desplegable mejora el acceso cuando el catálogo crezca |
| Filtros avanzados en la URL | Harían las rutas demasiado complejas en esta versión |
| Badge de disponibilidad en todas las tarjetas | Rompe la composición visual; la información vive en el detalle |
| Ocultar productos no disponibles | Se pierde descubrimiento; se mantienen visibles sin acción alternativa |
| Imagen genérica de stock cuando falla una imagen | Contradice la dirección visual y la identidad propia |
| Partículas en loop y glow generalizado | Distraen, cansan y eliminan el impacto de los efectos |
| Pasarela de pagos real | Está fuera del alcance del MVP |
| Cotizador automático con visor 3D | Fuera del prototipo inicial y requiere infraestructura adicional |
| Roles administrativos múltiples desde el inicio | Se usará un administrador único, dejando la estructura preparada para roles futuros |
| Gestión de suspensión de clientes y actividad de login | No es necesaria para el panel administrativo inicial |
| Importación/exportación masiva del catálogo | Sí se incluye, porque el administrador la seleccionó como parte de la gestión completa |

## 11. Dependencias con las siguientes fases

La Fase 3 deja definidas las pantallas y flujos, pero la implementación requerirá confirmar durante la Fase 5 y 6:

- Estructura definitiva de entidades de pedido y solicitud.
- Estados exactos de una cotización.
- Estrategia de almacenamiento de archivos 3D.
- Persistencia del borrador local.
- Reglas de combinación de carritos.
- Permisos del administrador y futura extensión de roles.
- Respuestas de API para dashboard y bandejas.
- Formato de importación y exportación masiva.

Estas decisiones no bloquean el mockup. Se documentarán como contratos antes de construir los componentes.

## 12. Criterio de verificación de la Fase 3

La fase se considera completa cuando:

- [x] El mapa de navegación contempla consumidor, cliente técnico y administrador.
- [x] El consumidor casual tiene un flujo completo desde Inicio hasta Cuenta.
- [x] El cliente técnico puede iniciar con archivo o con ayuda de diseño.
- [x] Productos y solicitudes conviven en el carrito sin compartir checkout indebidamente.
- [x] La cuenta es obligatoria antes de confirmar o enviar.
- [x] Las rutas definitivas están identificadas.
- [x] Cada pantalla tiene estados de carga, vacío, error y éxito cuando corresponda.
- [x] Las decisiones visuales respetan la Fase 2.
- [x] El panel administrativo tiene dashboard y módulos operativos.
- [x] Las acciones descartadas tienen una razón registrada.
- [x] El documento puede servir como base para wireframes y mockups de alta fidelidad.

**Estado:** Fase 3 — UX, user flow y mockup: **definición completada; pendiente de traducir a wireframes/mockups visuales**.

## 13. Referencias útiles

[1]: https://react.dev/ "React official documentation"
[2]: https://reactrouter.com/ "React Router documentation"
[3]: https://developer.mozilla.org/en-US/docs/Web/API/AbortController "MDN AbortController documentation"
[4]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams "MDN URLSearchParams documentation"
[5]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "MDN localStorage documentation"
[6]: https://developer.mozilla.org/en-US/docs/Web/Accessibility "MDN accessibility documentation"
[7]: https://tailwindcss.com/docs/responsive-design "Tailwind CSS responsive design"
[8]: https://tailwindcss.com/docs/dark-mode "Tailwind CSS dark mode"
[9]: https://www.w3.org/WAI/ARIA/apg/ "WAI-ARIA Authoring Practices Guide"
[10]: https://web.dev/learn/performance "Web performance learning resources"
