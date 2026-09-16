# Fase 3 — UX, User Flow y Mockup

## 1. Propósito de esta fase

Esta fase define cómo se comporta y se recorre la tienda antes de entrar al diseño visual de alta fidelidad y a la implementación.

Las decisiones se basan en:

- Fase 1 — Producto y Requisitos.
- Fase 2 — Investigación y Dirección Visual.

La tienda tiene dos modelos de negocio que deben convivir sin confundirse:

1. **Compra de productos terminados**, dirigida principalmente al consumidor casual.
2. **Solicitud de impresión personalizada**, dirigida principalmente al cliente técnico, estudiante, hobbista o corporativo.

Ambos caminos tendrán presencia equivalente desde la entrada de la aplicación, pero conservarán sus propias reglas operativas.

El carrito podrá contener productos y solicitudes, pero cada tipo utilizará su propio flujo de checkout.

La experiencia debe comunicar:

> **Tecnología de precisión con accesibilidad local.**

Debe sentirse suficientemente premium para un inversor, clara para un comprador casual y suficientemente técnica para quien solicita una pieza personalizada.

---

# 2. Principios UX

La experiencia seguirá estos principios:

### 2.1 Claridad

Cada pantalla debe responder rápidamente:

- ¿Dónde estoy?
- ¿Qué estoy viendo?
- ¿Qué puedo hacer?
- ¿Cuál es el siguiente paso?

### 2.2 Descubrimiento antes que complejidad

El catálogo debe priorizar el descubrimiento visual.

La información técnica debe aparecer cuando el usuario realmente la necesita.

### 2.3 Dos modelos de negocio, una experiencia

Compra y personalización deben sentirse parte de la misma marca y plataforma.

No deben parecer aplicaciones separadas.

### 2.4 Tecnología sin frialdad

Los elementos técnicos pueden utilizar recursos visuales relacionados con CAD, precisión y fabricación digital, pero sin convertir toda la experiencia en una interfaz industrial.

### 2.5 Conversión sin presión

Las llamadas a la acción deben ser claras y visibles sin saturar la interfaz.

### 2.6 Mobile-first en las decisiones de interacción

La experiencia debe funcionar correctamente en escritorio, tablet y móvil desde el diseño inicial.

---

# 3. Decisiones UX consolidadas

| Tema | Decisión | Justificación |
|---|---|---|
| Entrada principal | El hero presenta dos caminos equivalentes: comprar productos y solicitar impresión personalizada | Representa los dos modelos de negocio desde el primer contacto |
| Navegación principal | Inicio, Catálogo, Carrito y Cuenta | Mantiene el encabezado limpio |
| CTA personalizado | Destacado en hero y catálogo | Permite acceder al servicio técnico sin saturar la navegación |
| Inicio | Home editorial con hero, manifiesto, destacados y categorías | Refuerza marca y descubrimiento |
| Categorías | Gadgets, Figuras, Juguetes, Decoración y Piezas funcionales | Amplía la clasificación inicial del brief |
| Catálogo | Descubrimiento visual primero | Evita una cuadrícula fría |
| Tarjeta | Imagen, nombre y precio | Mantiene la exploración limpia |
| Búsqueda | Consulta al backend con debounce | Evita peticiones innecesarias y permite escalar |
| URL catálogo | `q` y `categoria` como query params | Permite compartir y recuperar búsquedas |
| Filtros avanzados | Estado interno de la interfaz | Evita URLs excesivamente complejas |
| Detalle | Comprar y personalizar tienen presencia clara | Conecta catálogo y fabricación personalizada |
| Especificaciones | Bloque expandible | Reduce saturación visual |
| Variantes | Cantidad, color y material | Son decisiones reales del producto |
| Galería | Miniaturas desktop, carrusel táctil mobile | Se adapta al dispositivo |
| Disponibilidad | Visible principalmente en detalle | Mantiene tarjetas limpias |
| Producto no disponible | Permanece visible sin acción alternativa en esta versión | Conserva descubrimiento |
| Error de imagen | Placeholder propio con rejilla CAD sutil | Mantiene identidad |
| Agregar al carrito | Feedback inline + contador actualizado | Confirma la acción sin interrumpir |
| Carrito | Productos y solicitudes separados visualmente | Mantiene claridad |
| Checkout | Unificado conceptualmente pero separado operativamente | Ambos flujos pertenecen a la misma experiencia, pero manejan datos diferentes |
| Checkout producto | Datos → Entrega → Revisión → Confirmación | Flujo de compra tradicional |
| Checkout solicitud | Datos → Entrega → Revisión → Enviar solicitud | Flujo de cotización |
| Invitados | Pueden explorar y avanzar; requieren cuenta antes de confirmar/enviar | Reduce fricción sin perder autenticación real |
| Login | Modal sobre contexto actual | Evita perder el proceso |
| Registro | Pantalla dedicada `/registro` | Permite explicar el registro |
| Registro inicial | Nombre, correo y contraseña | Reduce fricción |
| Cuenta | Perfil, datos e historial unificado | Centraliza actividad |
| Historial | Unificado con filtros por tipo | Evita duplicación |
| Solicitud personalizada | Tres pasos | Reduce carga cognitiva |
| Entrada personalizada | Tengo archivo / Necesito ayuda con el diseño | Incluye usuarios con y sin modelo listo |
| Archivo | `.stl` y `.obj` | Formatos definidos inicialmente |
| Autenticación | Obligatoria antes de enviar | Permite asociar solicitud y usuario |
| Datos de usuario | Autocompletado de campos vacíos después de autenticación | Evita sobrescritura innecesaria |
| Borrador | Guardado local cuando sea posible | Reduce pérdida de trabajo |
| Precio personalizado | “Pendiente de cotización” | Evita inventar precios |
| Solicitud enviada | Recibida → En revisión | Comunica progreso |
| WhatsApp | Disponible en Inicio, Catálogo, Detalle y Solicitud | Canal rápido de contacto |
| Tema | Dark Mode principal + Light Mode mediante toggle | Respeta la Fase 2 |
| Mobile | Menú general + navegación contextual durante tareas | Mejora uso en pantallas pequeñas |
| Admin | Administrador único preparado para roles futuros | Mantiene el MVP manejable |
| Panel admin | Dashboard + bandejas operativas | Combina supervisión y ejecución |

---

# 4. Arquitectura de navegación

## 4.1 Navegación pública

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
├── /checkout/solicitud
├── /registro
├── /pedido/:id
└── /cuenta
```

El login se presenta como modal.

No es necesario crear una ruta pública de login para el flujo normal de la tienda.

## 4.2 Navegación administrativa

```text
/admin
├── /admin/pedidos
│   └── /admin/pedidos/:id
├── /admin/solicitudes
│   └── /admin/solicitudes/:id
├── /admin/catalogo
│   ├── /admin/catalogo/nuevo
│   ├── /admin/catalogo/:id/editar
│   ├── /admin/catalogo/categorias
│   ├── /admin/catalogo/archivos
│   └── /admin/catalogo/importar-exportar
├── /admin/clientes
│   └── /admin/clientes/:id
└── /admin/actividad
```

Configuración y futuros roles administrativos no forman parte de la navegación principal del MVP.

---

# 5. Navegación por contexto

| Contexto | Navegación |
|---|---|
| Público | Inicio, Catálogo, Carrito, Cuenta |
| Catálogo mobile | Menú general + acciones contextuales |
| Checkout mobile | Menú reducido + navegación contextual |
| Cuenta | Perfil, actividad, edición de datos, cerrar sesión |
| Administración | Dashboard, Pedidos, Solicitudes, Catálogo, Clientes, Actividad |

---

# 6. User Flow — Consumidor casual

## 6.1 Flujo principal

```text
Inicio
↓
Comprar productos
↓
Destacados / Categorías
↓
Catálogo
↓
Búsqueda / Categoría / Filtros
↓
Resultados
↓
Detalle del producto
↓
Cantidad / Color / Material
↓
Agregar al carrito
↓
Feedback inline
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
Login / Registro si es necesario
↓
Confirmación
↓
Pedido
↓
Cuenta / Actividad
```

## 6.2 Reglas

El usuario no entra directamente en una cuadrícula extensa como primera experiencia.

La Home introduce los productos destacados y las categorías.

La misma ruta `/catalogo` representa descubrimiento y resultados.

La búsqueda utiliza:

```text
/catalogo?q=...
```

Las categorías utilizan:

```text
/catalogo?categoria=...
```

El detalle concentra las especificaciones técnicas.

El usuario puede avanzar como visitante, pero debe autenticarse antes de confirmar el pedido.

---

# 7. User Flow — Cliente técnico

## 7.1 Con archivo

```text
Inicio / Catálogo
↓
Solicitar impresión personalizada
↓
Tengo un archivo
↓
Paso 1 — Cargar archivo
↓
Paso 2 — Requisitos técnicos
↓
Paso 3 — Contacto y revisión
↓
Revisión
↓
Agregar al carrito
↓
Solicitud marcada como “Pendiente de cotización”
↓
Carrito
↓
Checkout de solicitud
↓
Datos
↓
Entrega
↓
Revisión
↓
Login / Registro
↓
Enviar solicitud
↓
Solicitud recibida
↓
Cuenta
↓
En revisión
```

## 7.2 Sin archivo

```text
Inicio / Catálogo
↓
Solicitar impresión personalizada
↓
Necesito ayuda con el diseño
↓
Paso 1 — Descripción / Referencia
↓
Paso 2 — Requisitos técnicos
↓
Paso 3 — Contacto y revisión
↓
Agregar solicitud
↓
Checkout de solicitud
↓
Login / Registro
↓
Enviar solicitud
↓
Recibida
↓
En revisión
```

## 7.3 Datos técnicos

El flujo puede solicitar:

- material;
- color;
- cantidad;
- relleno;
- dimensiones;
- tolerancias;
- uso;
- notas adicionales.

Estos campos deben adaptarse al contexto y no deben obligar al usuario a definir información que todavía desconoce.

---

# 8. Solicitud personalizada

## 8.1 Selección inicial

La pantalla `/solicitud` debe presentar claramente:

```text
Solicita una impresión personalizada

[ Tengo un archivo ]

Ya tengo mi modelo 3D


[ Necesito ayuda con el diseño ]

No tengo un modelo terminado
```

Ambas opciones tienen la misma importancia visual.

## 8.2 Paso 1 — Archivo

Permite:

- seleccionar archivo;
- ver nombre;
- ver tamaño;
- eliminar;
- volver a seleccionar;
- continuar.

Formatos iniciales:

```text
.stl
.obj
```

El MVP debe validar formato y tamaño.

No se incluye en esta fase un visor 3D ni cotización geométrica automática.

## 8.3 Paso 1 — Ayuda de diseño

Debe permitir explicar:

- qué necesita;
- para qué se utilizará;
- dimensiones aproximadas si las conoce;
- referencias;
- notas adicionales.

## 8.4 Paso 2 — Requisitos

Incluye los datos técnicos conocidos por el cliente.

Cuando no tenga una respuesta, debe poder indicar que necesita asesoría.

## 8.5 Paso 3 — Contacto y revisión

Debe mostrar:

```text
Datos personales
Archivo / descripción
Requisitos técnicos
Entrega
Estado de cotización
```

Cada sección debe poder editarse.

---

# 9. Precio y cotización

Una solicitud personalizada no debe mostrar un precio inventado.

Debe utilizar:

```text
Precio
Pendiente de cotización
```

La explicación puede indicar que el valor depende de:

- material;
- tamaño;
- complejidad;
- cantidad;
- tiempo de impresión.

En el carrito:

```text
Solicitud personalizada
Pendiente de cotización
```

No se debe representar la solicitud como:

```text
₡0
```

ni como una compra con precio definitivo.

---

# 10. Carrito híbrido

El carrito representa una experiencia unificada, pero visualmente diferencia dos tipos de operación.

## 10.1 Productos

```text
PRODUCTOS

Producto
Cantidad
Color
Material
Precio
Subtotal
```

## 10.2 Solicitudes

```text
SOLICITUDES DE COTIZACIÓN

Solicitud personalizada
Pendiente de cotización
Resumen técnico
Estado
```

## 10.3 Checkout

Debe existir una acción independiente para cada tipo:

```text
[ Continuar compra ]
```

```text
[ Continuar con solicitud de cotización ]
```

La experiencia es una sola tienda, pero los procesos operativos son diferentes.

---

# 11. Checkout

## 11.1 Checkout de productos

```text
Datos
↓
Entrega
↓
Revisión
↓
Confirmación
```

La revisión debe mostrar:

- productos;
- variantes;
- cantidades;
- subtotal;
- entrega;
- total;
- datos del cliente.

## 11.2 Checkout de solicitudes

```text
Datos
↓
Entrega
↓
Revisión
↓
Enviar solicitud
```

La revisión debe mostrar:

- archivo o descripción;
- requisitos;
- datos del cliente;
- entrega;
- estado pendiente de cotización.

El CTA final debe ser:

```text
Enviar solicitud de cotización
```

No:

```text
Pagar
```

---

# 12. Autenticación

La autenticación real es requisito del proyecto.

## 12.1 Login

Se presenta como modal cuando el usuario ya está realizando una acción.

Ejemplo:

```text
Revisión
↓
Confirmar / Enviar
↓
Login
↓
Continuar
```

El modal debe permitir acceder a:

```text
Iniciar sesión
Crear cuenta
```

## 12.2 Registro

Ruta:

```text
/registro
```

Datos iniciales:

- nombre;
- correo;
- contraseña.

Dirección y otros datos de envío pueden completarse posteriormente.

## 12.3 Conservación del contexto

El usuario no debe perder:

- carrito;
- información del checkout;
- datos de la solicitud;
- paso actual.

La implementación técnica decidirá posteriormente cómo persistir ese contexto.

---

# 13. Cuenta

La cuenta centraliza:

```text
Cuenta
├── Información personal
├── Editar datos
├── Pedidos
├── Solicitudes
└── Actividad
```

La actividad será unificada.

Ejemplo:

```text
Actividad

Todos
Pedidos
Solicitudes

Pedido #1024
Confirmado

Solicitud #1032
En revisión

Pedido #1018
Completado
```

Los filtros permiten cambiar el tipo de actividad sin crear múltiples sistemas independientes.

---

# 14. User Flow — Administrador

## 14.1 Dashboard

```text
Login administrativo
↓
Validación
↓
/admin
```

El dashboard debe mostrar:

- métricas;
- alertas;
- pedidos recientes;
- solicitudes pendientes;
- productos agotados o no publicados;
- actividad reciente;
- accesos rápidos.

## 14.2 Pedidos

```text
/admin/pedidos
↓
Buscar
↓
Filtrar
↓
Ordenar
↓
Detalle
```

En detalle:

```text
Cliente
Productos
Variantes
Dirección
Estado
Actividad

Acciones:
Editar
Cambiar estado
Cancelar
Simular reembolso
```

Las operaciones de pago y reembolso se simulan porque no existe una pasarela de pagos real en el MVP.

## 14.3 Solicitudes

```text
/admin/solicitudes
↓
Buscar
↓
Filtrar
↓
Ordenar
↓
Detalle
```

El administrador puede:

- revisar archivos;
- descargar archivos;
- revisar datos técnicos;
- consultar cliente;
- añadir notas;
- preparar cotización;
- modificar precio o tiempo estimado;
- contactar por WhatsApp;
- aprobar archivo;
- rechazar archivo con motivo;
- cambiar estado;
- convertir una solicitud aprobada en pedido.

## 14.4 Catálogo

El catálogo administrativo incluye:

- productos;
- categorías;
- imágenes;
- variantes;
- materiales;
- precios;
- disponibilidad;
- publicación/ocultamiento;
- importación masiva;
- exportación masiva.

## 14.5 Clientes

El administrador puede:

- consultar clientes;
- buscar;
- filtrar;
- editar datos;
- ver pedidos;
- ver solicitudes.

No forman parte de esta versión:

- suspensión de cuentas;
- reactivación de cuentas;
- revisión de actividad de acceso/login.

## 14.6 Actividad

La actividad administrativa registra de forma comprensible:

- cambios de catálogo;
- cambios de pedidos;
- cambios de solicitudes;
- acciones administrativas.

---

# 15. Rutas definitivas

| Ruta | Acceso | Propósito |
|---|---|---|
| `/` | Público | Home |
| `/catalogo` | Público | Catálogo, búsqueda y filtros |
| `/producto/:id` | Público | Detalle |
| `/solicitud` | Público | Selección del tipo de solicitud |
| `/solicitud/archivo` | Público | Solicitud con archivo |
| `/solicitud/ayuda-diseno` | Público | Solicitud con ayuda |
| `/carrito` | Público | Carrito híbrido |
| `/checkout/productos` | Público hasta confirmar | Checkout de productos |
| `/checkout/solicitud` | Público hasta enviar | Checkout de solicitudes |
| `/registro` | Público | Registro |
| `/pedido/:id` | Autenticado | Confirmación y estado |
| `/cuenta` | Autenticado | Perfil y actividad |
| `/admin` | Administrador | Dashboard |
| `/admin/pedidos` | Administrador | Pedidos |
| `/admin/pedidos/:id` | Administrador | Detalle de pedido |
| `/admin/solicitudes` | Administrador | Solicitudes |
| `/admin/solicitudes/:id` | Administrador | Detalle de solicitud |
| `/admin/catalogo` | Administrador | Catálogo |
| `/admin/catalogo/nuevo` | Administrador | Nuevo producto |
| `/admin/catalogo/:id/editar` | Administrador | Editar producto |
| `/admin/catalogo/categorias` | Administrador | Categorías |
| `/admin/catalogo/archivos` | Administrador | Archivos del catálogo |
| `/admin/catalogo/importar-exportar` | Administrador | Importación/exportación |
| `/admin/clientes` | Administrador | Clientes |
| `/admin/clientes/:id` | Administrador | Detalle de cliente |
| `/admin/actividad` | Administrador | Actividad administrativa |

Los pasos de checkout pueden representarse mediante subrutas o mediante estado interno. Eso queda para arquitectura.

La experiencia visible debe mantenerse como:

```text
Datos → Entrega → Revisión
```

y posteriormente:

```text
Confirmar
```

o:

```text
Enviar solicitud
```

según el flujo.

---

# 16. Estados UX

Todas las pantallas que dependen de datos deben contemplar los estados relevantes.

## 16.1 Loading

Ejemplos:

```text
Cargando productos...
Cargando solicitud...
Guardando...
```

Puede utilizarse skeleton cuando aporte valor.

## 16.2 Success

Ejemplos:

```text
Producto agregado al carrito.
Solicitud enviada correctamente.
Cambios guardados.
```

## 16.3 Empty

Ejemplos:

```text
No hay productos con estos filtros.
Tu carrito está vacío.
No tienes solicitudes todavía.
```

El estado vacío debe orientar al usuario.

## 16.4 Error

Ejemplo:

```text
No pudimos cargar los productos.
Intentá nuevamente.
```

Cuando sea posible:

```text
[ Reintentar ]
```

## 16.5 Validación

Los errores deben aparecer cerca del campo correspondiente y explicar cómo corregirlo.

Ejemplos:

```text
El archivo supera el tamaño permitido.
```

```text
El formato del archivo no es compatible.
```

```text
La contraseña no es válida.
```

## 16.6 Processing

Durante operaciones importantes:

```text
Enviando solicitud...
Guardando cambios...
Procesando pedido...
```

La interfaz debe impedir múltiples envíos accidentales.

---

# 17. Responsive UX

## 17.1 Desktop

Prioridades:

- navegación completa;
- galerías amplias;
- composición por columnas;
- resúmenes laterales;
- filtros visibles;
- tablas administrativas.

## 17.2 Tablet

Prioridades:

- jerarquía clara;
- columnas cuando exista espacio;
- filtros agrupados;
- formularios cómodos.

## 17.3 Mobile

Prioridad:

```text
Contenido
↓
Acción principal
↓
Información complementaria
```

Se utilizarán:

- menú desplegable;
- navegación contextual;
- carruseles táctiles;
- formularios de una sola columna;
- botones adecuados para interacción táctil.

---

# 18. Tema visual aplicado a UX

La Fase 2 define dos temas:

## Dark Mode

Es el tema principal y la experiencia visual de referencia.

Debe mantener:

```text
#0A0E1A
#111827
#1F2937
#00D4FF
#0EA5E9
#F1F5F9
#94A3B8
```

## Light Mode

Disponible mediante toggle.

La estructura y jerarquía deben permanecer iguales entre ambos temas.

El diseño visual de Fase 4 será responsable de convertir esta decisión en tokens y componentes concretos.

---

# 19. Accesibilidad

La experiencia debe contemplar:

- navegación por teclado;
- labels en formularios;
- mensajes de error asociados a campos;
- texto alternativo para imágenes informativas;
- contraste suficiente;
- estados que no dependan únicamente del color;
- botones con nombres claros;
- modales accesibles;
- foco visible;
- respeto a `prefers-reduced-motion`.

---

# 20. Microcopy

El tono debe ser:

- claro;
- directo;
- profesional;
- cercano.

Debe evitarse:

- lenguaje excesivamente corporativo;
- jerga técnica innecesaria;
- mensajes ambiguos;
- textos excesivamente largos.

Ejemplos:

```text
Agregar al carrito
```

```text
Solicitar impresión personalizada
```

```text
Enviar solicitud de cotización
```

```text
Pendiente de cotización
```

```text
En revisión
```

---

# 21. Mockup — Qué debe demostrar

El mockup de esta fase debe demostrar:

- jerarquía;
- estructura;
- navegación;
- recorridos;
- acciones;
- separación entre compra y solicitud;
- comportamiento responsive.

No es todavía el diseño visual definitivo del sistema.

El detalle visual final corresponde a la Fase 4.

---

# 22. Pantallas mínimas a representar

## Público

```text
Home
Catálogo
Detalle de producto
Selección de solicitud
Solicitud con archivo
Solicitud sin archivo
Carrito
Checkout de productos
Checkout de solicitud
Login modal
Registro
Cuenta
Pedido / solicitud
```

## Administración

```text
Dashboard
Pedidos
Detalle de pedido
Solicitudes
Detalle de solicitud
Catálogo
Nuevo producto
Editar producto
Clientes
Detalle de cliente
Actividad
```

---

# 23. Orden recomendado para construir los mockups

```text
1. Home
2. Catálogo
3. Detalle de producto
4. Solicitud personalizada
5. Carrito
6. Checkout
7. Login / Registro
8. Cuenta
9. Pedido / Solicitud
10. Administración
```

Las primeras pantallas deben establecer el lenguaje visual público.

La solicitud personalizada debe definirse inmediatamente después porque representa el segundo modelo de negocio.

---

# 24. Decisiones que quedan para fases posteriores

La Fase 3 no decide todavía:

- componentes React definitivos;
- estructura final de carpetas;
- contratos completos de API;
- base de datos definitiva;
- estrategia JWT;
- almacenamiento de archivos;
- implementación de upload;
- estrategia exacta de persistencia del carrito;
- estrategia exacta de persistencia del borrador;
- reglas técnicas de importación/exportación;
- cálculo real de cotización;
- despliegue.

Estas decisiones corresponden a arquitectura, datos, API e implementación.

La UX solamente define el comportamiento esperado.

---

# 25. Fuera de esta fase

No se incorporan como parte de la UX actual:

- visor 3D interactivo;
- cotización automática en tiempo real;
- pagos reales;
- logística automatizada;
- inventario empresarial avanzado;
- marketplace;
- múltiples roles administrativos operativos;
- gestión avanzada de seguridad de cuentas;
- suspensión/reactivación de clientes.

---

# 26. Checklist de validación

## Navegación

- [ ] Navegación pública definida.
- [ ] Navegación administrativa definida.
- [ ] Rutas definidas.
- [ ] Contextos de navegación definidos.

## Compra

- [ ] Home definida.
- [ ] Catálogo definido.
- [ ] Detalle definido.
- [ ] Variantes definidas.
- [ ] Carrito definido.
- [ ] Checkout definido.
- [ ] Autenticación integrada.

## Personalización

- [ ] Entrada con archivo.
- [ ] Entrada sin archivo.
- [ ] Formulario por pasos.
- [ ] Requisitos técnicos.
- [ ] Precio pendiente.
- [ ] Checkout separado.
- [ ] Estado posterior definido.

## Cuenta

- [ ] Registro.
- [ ] Login.
- [ ] Perfil.
- [ ] Datos.
- [ ] Actividad.

## Administración

- [ ] Dashboard.
- [ ] Pedidos.
- [ ] Solicitudes.
- [ ] Catálogo.
- [ ] Importación/exportación.
- [ ] Clientes.
- [ ] Actividad.

## Responsive

- [ ] Desktop.
- [ ] Tablet.
- [ ] Mobile.
- [ ] Menú móvil.
- [ ] Navegación contextual.
- [ ] Formularios móviles.

## Accesibilidad

- [ ] Navegación por teclado.
- [ ] Labels.
- [ ] Estados de error.
- [ ] Contraste.
- [ ] Focus.
- [ ] Reduced motion.

---

# 27. Estado de la Fase 3

**Estado: UX DEFINIDA**

La experiencia funcional está suficientemente definida para pasar a la siguiente etapa.

La Fase 3 establece:

```text
Qué pantallas existen
↓
Cómo se conectan
↓
Qué puede hacer el usuario
↓
Qué puede hacer el administrador
↓
Cómo funcionan los dos modelos de negocio
↓
Qué ocurre en móvil
↓
Qué estados debe contemplar la interfaz
```

---

# 28. Handoff a Fase 4

La siguiente fase es:

# Fase 4 — Design System y Diseño Visual

La Fase 4 debe transformar las decisiones UX en una interfaz visual de alta fidelidad.

Debe definir:

- colores finales;
- tokens visuales;
- tipografía;
- escala tipográfica;
- espaciado;
- grid;
- border radius;
- sombras;
- glow;
- glassmorphism;
- iconografía;
- botones;
- inputs;
- cards;
- badges;
- modales;
- dropdowns;
- navegación;
- componentes de formulario;
- estados;
- layouts;
- responsive;
- variantes Dark/Light.

Los mockups de alta fidelidad deberán respetar la dirección visual de la Fase 2.

La Fase 4 será también la etapa donde se utilizarán las herramientas de diseño asistido por IA y/o Figma para transformar esta especificación UX en pantallas visuales.

---

# 29. Regla de continuidad del proyecto

Las siguientes fases deben utilizar como fuente de verdad:

```text
Fase 1
+
Fase 2
+
Fase 3
```

No se deben volver a abrir decisiones ya establecidas en estos documentos salvo que aparezca una contradicción real, una nueva necesidad del negocio o una limitación técnica comprobada.

La próxima decisión principal del proyecto es visual, no funcional:

> **Diseñar cómo se ve la experiencia ya definida.**