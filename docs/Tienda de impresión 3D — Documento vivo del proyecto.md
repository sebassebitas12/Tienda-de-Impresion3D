# Tienda de impresión 3D — Documento vivo del proyecto

## 1. Propósito del proyecto

Construiremos una **tienda de impresión 3D** como proyecto de práctica profesional, tratado como si fuera un encargo real para un cliente: tú. La aplicación será una versión inicial funcional de un producto que posteriormente podría evolucionar hacia una tienda real en producción.

El proyecto servirá para aprender y aplicar un flujo completo de desarrollo profesional: definición del producto, investigación, dirección visual, UX/UI, arquitectura, desarrollo full stack, consumo eficiente de datos, pruebas, optimización, despliegue y mantenimiento.

La aplicación debe tener coherencia entre producto, diseño y código. No se generará código aislado ni funcionalidades creadas únicamente para practicar una sintaxis. Cada componente, pantalla, dato, endpoint y regla de negocio debe tener una función dentro de la tienda.

El resultado esperado de la primera versión es una experiencia de tienda con identidad visual propia, catálogo consultable, detalle de productos, carrito y flujo de pedido simulado, respaldada por un frontend en React y un backend en Node.js.

> **Principio central:** la inteligencia artificial puede acelerar el desarrollo, pero no reemplaza el razonamiento, la validación ni la responsabilidad del desarrollador.

## 2. Alcance del MVP y qué queda fuera

El **MVP** es la primera versión mínima viable que permite comprobar el flujo principal de la tienda sin intentar resolver desde el comienzo todas las necesidades de un negocio real.

### Incluido en el MVP

- Página de inicio con propuesta de valor y productos destacados.
- Catálogo de productos de impresión 3D.
- Consulta de productos por categoría, búsqueda o filtros básicos.
- Página de detalle de un producto específico.
- Información de producto: nombre, descripción, precio, imágenes, material, colores, dimensiones, disponibilidad y tiempo estimado.
- Carrito con productos, cantidades y total calculado.
- Formulario de pedido o solicitud de compra simulada.
- Confirmación visual del pedido.
- Consumo de datos desde el backend mediante llamadas HTTP específicas.
- Estados de carga, error, vacío y éxito.
- Diseño responsive para móvil y escritorio.
- API organizada con rutas, controladores y servicios.
- Datos iniciales en JSON o JSON Server.
- Build funcional y documentación básica.

### Fuera del MVP inicial

| Elemento | Motivo de exclusión inicial |
|---|---|
| Pagos reales | Requieren proveedores, seguridad, pruebas financieras y manejo de transacciones reales |
| Inventario avanzado | Requiere reglas de stock, movimientos, reservas y posiblemente integración con producción |
| Autenticación empresarial | No es necesaria para validar primero el flujo principal de la tienda |
| Facturación fiscal | Depende de requisitos legales, fiscales y del país de operación |
| Logística completa | Requiere transportistas, tarifas, seguimiento y reglas de envío |
| Marketplace multi-vendedor | Cambiaría el modelo de datos, roles y reglas del negocio |
| Cotización automática avanzada de modelos 3D | Requiere análisis de archivos, materiales, tiempos y costes reales |
| Panel administrativo completo | Se podrá añadir después de validar el catálogo y el flujo de cliente |

Estos elementos no se descartan definitivamente. Se registran como posibles extensiones posteriores y no se implementarán hasta que existan requisitos claros.

## 3. Stack definitivo

El stack se mantendrá deliberadamente sencillo para comprender cada capa y evitar dependencias innecesarias durante la práctica.

| Capa | Tecnología | Uso |
|---|---|---|
| Frontend | React + Vite + JavaScript | Interfaz y lógica de interacción del cliente |
| Tipado | JavaScript | No se utilizará TypeScript, `.ts` ni `.tsx` |
| Backend | Node.js + Express | Servidor, API y reglas de negocio |
| Datos del MVP | JSON Server o archivo JSON | Persistencia temporal para practicar el flujo full stack |
| Estilos | Tailwind CSS | Estilos, responsive y construcción del sistema visual |
| Estado local | `useState` | Estado propio de componentes y funcionalidades |
| Efectos | `useEffect` | Peticiones, sincronización y efectos secundarios |
| Estado compartido | Context opcional | Se utilizará solo si el carrito lo necesita |
| Estado global externo | Ninguno por ahora | No se instalará Redux, Zustand u otra librería global en esta etapa |
| Control de versiones | Git + GitHub | Historial, ramas y respaldo del proyecto |
| Editor | VS Code | Desarrollo y revisión del código |

El frontend y el backend tendrán dependencias y configuraciones separadas. El proyecto no utilizará una librería de estado global mientras `useState`, `useEffect` y, si hace falta, Context sean suficientes.

## 4. Reglas permanentes de trabajo

1. **Entender antes de programar.** No se escribirá código antes de conocer el problema, el usuario y el resultado esperado.
2. **Cada parte debe tener sentido.** Todo archivo, componente, función, ruta, endpoint y dato debe justificar su existencia dentro de la tienda.
3. **Mantener coherencia constante.** El catálogo, el diseño, el modelo de datos, las rutas y el flujo del usuario deben representar el mismo producto.
4. **Separar responsabilidades.** La UI no debe contener reglas de negocio, el backend no debe contener lógica visual y los servicios deben centralizar las peticiones.
5. **Construir por incrementos.** No se generarán miles de líneas de código de una sola vez; se implementará y verificará una funcionalidad cada vez.
6. **Solicitar solo lo necesario.** El frontend no cargará datos que la pantalla no necesita.
7. **Usar llamadas específicas.** En una vista de detalle se solicitará el producto indicado, no todo el catálogo.
8. **Optimizar con criterio.** Primero se identifica el problema y después se aplica paginación, caché, debounce, cancelación u otra técnica.
9. **No añadir dependencias por moda.** Toda librería deberá resolver una necesidad concreta del proyecto.
10. **Validar en frontend y backend.** Las validaciones del cliente mejoran la experiencia, pero el backend siempre será la autoridad.
11. **Mantener estados completos.** Toda petición relevante debe contemplar carga, datos, error, vacío y cancelación cuando corresponda.
12. **La IA debe explicar sus cambios.** No se aceptará código que no podamos leer, justificar, modificar y mantener.
13. **La rama estable debe permanecer funcional.** El trabajo nuevo se validará antes de integrarse en la rama estable.
14. **No subir secretos.** Las claves y variables sensibles deben permanecer fuera del repositorio.

## 5. Fases del proyecto

### Fase 0 — Preparación del entorno

#### Objetivo

Crear la base técnica del proyecto siguiendo el orden real de trabajo antes de comenzar el análisis funcional.

#### Actividades y decisiones

- Crear el repositorio remoto en GitHub.
- Crear o elegir la carpeta local del proyecto.
- Clonar el repositorio remoto dentro de la carpeta local.
- Crear la estructura base con Vite, React y JavaScript.
- Instalar las dependencias del frontend.
- Configurar Tailwind CSS.
- Verificar que la aplicación base se ejecute correctamente.
- Mantener las ramas de trabajo definidas, normalmente una rama estable y una rama de pruebas.
- Confirmar que existan `README.md` y `.gitignore`.
- Realizar el primer commit.
- Hacer el primer `push` al repositorio remoto.

#### Orden de trabajo

```text
Repositorio remoto
        ↓
Carpeta local
        ↓
Clonar repositorio
        ↓
Estructura Vite + React + JavaScript
        ↓
Instalar dependencias y Tailwind CSS
        ↓
Verificar ejecución
        ↓
Primer commit
        ↓
Primer push
```

#### Entregable esperado

Repositorio remoto clonado y ejecutable, con la base Vite/React/JavaScript configurada, estilos preparados, documentación inicial y primer `push` realizado.

#### Pregunta de verificación antes de avanzar

> ¿Ya están listos el repositorio remoto, la carpeta local, el repositorio clonado, la estructura Vite/React/JavaScript, Tailwind CSS, la ejecución local y el primer `push`?

---

### Fase 1 — Producto y requisitos

#### Objetivo

Definir el brief real de la tienda como si el cliente hubiera contratado el proyecto.

#### Actividades y decisiones

- Definir qué tipo de tienda de impresión 3D se quiere construir.
- Identificar al cliente objetivo.
- Determinar qué problema resuelve la tienda.
- Definir la propuesta de valor y el diferenciador.
- Decidir qué productos se venderán inicialmente.
- Definir categorías, materiales, colores y variantes.
- Determinar qué información debe mostrar cada producto.
- Definir el flujo principal del cliente.
- Definir el flujo administrativo que pueda entrar en la práctica.
- Especificar requisitos funcionales y no funcionales.
- Separar funcionalidades del MVP y funcionalidades futuras.
- Establecer criterios de éxito.

#### Entregable esperado

Brief del cliente, perfiles de usuario, objetivos, requisitos, historias de usuario, criterios de aceptación, alcance del MVP y lista de funcionalidades futuras.

#### Pregunta de verificación antes de avanzar

> ¿Podemos explicar con claridad quién usará la tienda, qué problema resuelve, qué acción principal debe completar y qué incluye exactamente el MVP?

---

### Fase 2 — Investigación y dirección visual

#### Objetivo

Definir una identidad visual propia y una dirección artística coherente antes de construir la interfaz.

#### Actividades y decisiones

- Analizar referencias visuales del sector sin copiar plantillas.
- Definir personalidad, tono y carácter de la marca.
- Seleccionar paleta de color, tipografías e iconografía.
- Establecer composición, jerarquía, profundidad y contraste.
- Decidir si los efectos de glow, glass, partículas, 3D o scroll aportan valor.
- Determinar cómo se mostrarán los productos impresos.
- Diseñar una experiencia que no parezca una plantilla genérica ni una página generada automáticamente.
- Considerar rendimiento desde la selección de imágenes y efectos.

#### Entregable esperado

Documento de dirección visual con referencias, decisiones justificadas, paleta, tipografía, composición, recursos visuales y reglas para efectos.

#### Pregunta de verificación antes de avanzar

> ¿La dirección visual tiene una identidad clara y podemos explicar por qué cada recurso visual ayuda a vender o entender los productos?

---

### Fase 3 — UX, user flow y mockup

#### Objetivo

Diseñar la experiencia y las pantallas antes de implementarlas.

#### Actividades y decisiones

- Crear el user flow principal.
- Definir la navegación y las rutas.
- Diseñar wireframes de las pantallas prioritarias.
- Crear mockups de alta fidelidad.
- Diseñar los estados de carga, vacío, error, éxito y producto inexistente.
- Revisar navegación, jerarquía y llamadas a la acción.
- Comprobar la experiencia en móvil y escritorio.
- Definir el flujo de catálogo, detalle, carrito y pedido.

#### Entregable esperado

Mapa de navegación, user flow, wireframes y mockups de las pantallas principales.

#### Pregunta de verificación antes de avanzar

> ¿Un usuario nuevo puede descubrir un producto, consultar su información, añadirlo al carrito y enviar un pedido simulado sin confusión?

---

### Fase 4 — Design system

#### Objetivo

Crear las reglas visuales y los componentes que mantendrán consistente toda la aplicación.

#### Actividades y decisiones

- Definir tokens de color.
- Definir tipografía y escala de texto.
- Definir espaciado, radios, bordes, sombras y capas.
- Definir contenedores, grid y breakpoints.
- Diseñar botones, inputs, cards, badges, navegación, mensajes y modales.
- Definir estados normal, hover, focus, disabled, loading, error y success.
- Establecer reglas de animación y duración.
- Incorporar `prefers-reduced-motion` cuando corresponda.
- Definir componentes que serán reutilizables y cuáles serán específicos de una funcionalidad.

#### Entregable esperado

Design system documentado con tokens, componentes base, estados, reglas responsive y reglas de movimiento.

#### Pregunta de verificación antes de avanzar

> ¿Podemos crear nuevas pantallas manteniendo la misma identidad visual sin inventar estilos diferentes en cada componente?

---

### Fase 5 — Arquitectura

#### Objetivo

Definir la estructura del frontend y backend, sus responsabilidades y el flujo de información.

#### Actividades y decisiones

- Separar `frontend/` y `backend/`.
- Definir rutas del frontend.
- Organizar páginas, features, componentes y servicios.
- Organizar rutas, controladores, servicios y datos del backend.
- Definir dónde vivirá cada responsabilidad.
- Definir cómo se comunicará el frontend con la API.
- Decidir cómo se manejará el carrito sin librería global.
- Definir configuración, variables de entorno y errores.
- Mantener `App` y `main` mínimos.

#### Entregable esperado

Estructura de carpetas, mapa de responsabilidades, flujo de datos y decisiones arquitectónicas documentadas.

#### Pregunta de verificación antes de avanzar

> ¿Podemos señalar dónde vive cada pantalla, funcionalidad, llamada a la API, regla de negocio y dato sin mezclar responsabilidades?

#### Estructura base

```text
Tienda-de-Impresion3D/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── routes/
│   │   ├── pages/
│   │   ├── features/
│   │   │   ├── catalog/
│   │   │   ├── product-detail/
│   │   │   ├── cart/
│   │   │   └── orders/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   ├── data/
│   │   └── config/
│   ├── server.js
│   └── package.json
├── docs/
├── .env.example
├── .gitignore
└── README.md
```

#### Flujo de datos

```text
UI → servicio del frontend → API → ruta → controlador → servicio del backend → datos
```

---

### Fase 6 — Modelo de datos y contrato de API

#### Objetivo

Definir las entidades y la forma en que frontend y backend intercambiarán información.

#### Actividades y decisiones

- Definir entidades, campos y relaciones.
- Decidir campos obligatorios y opcionales.
- Definir estados de pedidos y disponibilidad.
- Diseñar respuestas de éxito y error.
- Definir validaciones de entrada.
- Definir paginación, filtros y ordenamiento.
- Establecer qué endpoint necesita cada pantalla.
- Evitar devolver datos innecesarios.

#### Entregable esperado

Modelo de datos, contrato de API, validaciones, respuestas esperadas y códigos HTTP definidos.

#### Pregunta de verificación antes de avanzar

> ¿Sabemos qué datos necesita cada pantalla, qué endpoint los entrega y qué debe ocurrir si la petición falla o el recurso no existe?

#### Contrato inicial de API

| Método | Endpoint | Propósito |
|---|---|---|
| `GET` | `/api/products` | Obtener el listado de productos necesario, con filtros y paginación |
| `GET` | `/api/products/:id` | Obtener un único producto por su identificador |
| `GET` | `/api/categories` | Obtener las categorías disponibles |
| `POST` | `/api/orders` | Crear un pedido o solicitud simulada validada |
| `GET` | `/api/orders/:id` | Consultar un pedido específico |

---

### Fase 7 — Implementación incremental

#### Objetivo

Construir la aplicación por funcionalidades conectadas y verificables.

#### Actividades y decisiones

- Configurar el backend con Node.js y Express.
- Crear el health check del backend.
- Preparar JSON Server o archivo JSON.
- Crear el primer endpoint de productos.
- Crear servicios del frontend para consumir la API.
- Implementar la página de catálogo.
- Implementar el detalle por `id`.
- Implementar filtros y búsqueda.
- Implementar el carrito con `useState` y Context solo si hace falta.
- Implementar el pedido simulado.
- Integrar estados de carga, error, vacío y éxito.
- Aplicar el design system y las decisiones visuales.

#### Ciclo de cada incremento

```text
Requisito → contrato → backend → servicio frontend → componente/página → prueba → revisión visual
```

#### Entregable esperado

Una versión funcional por incrementos, donde cada funcionalidad importante esté conectada desde la interfaz hasta los datos.

#### Pregunta de verificación antes de avanzar

> ¿La funcionalidad implementada cumple el requisito, usa el endpoint correcto, maneja sus estados y puede probarse de forma independiente?

---

### Fase 8 — Optimización de peticiones y rendimiento

#### Objetivo

Evitar sobrecargar la página, el navegador, la red y el backend.

#### Actividades y decisiones

- Solicitar solo los datos necesarios para cada pantalla.
- Obtener un producto por `id` en la página de detalle en lugar de cargar todo el catálogo.
- Usar paginación en listados.
- Ejecutar filtros y ordenamiento en el backend cuando el volumen lo requiera.
- Devolver solo los campos necesarios.
- Usar debounce en búsquedas que realicen peticiones.
- Cancelar peticiones obsoletas con `AbortController`.
- Evitar peticiones duplicadas.
- Aplicar caché cuando sea seguro y útil.
- Cargar rutas y componentes pesados de forma diferida.
- Cargar imágenes de forma diferida y en tamaños adecuados.
- Evitar estado global innecesario.
- Mantener el estado cerca del componente que lo utiliza.
- Evitar memoización prematura.
- Comprimir respuestas y configurar caché HTTP cuando corresponda.
- Medir antes de aplicar optimizaciones complejas.

#### Entregable esperado

Peticiones con propósito claro, respuestas controladas, menor transferencia innecesaria y una lista de mejoras justificadas.

#### Pregunta de verificación antes de avanzar

> ¿Cada petición existe por una necesidad concreta, devuelve solo lo necesario y evita repetir o mantener solicitudes obsoletas?

---

### Fase 9 — Calidad, accesibilidad y pruebas manuales

#### Objetivo

Verificar que la aplicación funcione correctamente y pueda ser utilizada por diferentes personas y dispositivos.

#### Actividades y decisiones

- Probar navegación completa.
- Probar catálogo, filtros, detalle, carrito y pedido.
- Probar productos inexistentes.
- Probar API caída o respuesta lenta.
- Probar estados de carga, vacío, error y éxito.
- Probar doble clic y acciones repetidas.
- Probar responsive en móvil, tablet y escritorio.
- Revisar HTML semántico.
- Revisar navegación con teclado.
- Revisar foco visible y labels.
- Revisar contraste y textos alternativos.
- Revisar que los errores sean comprensibles.
- Revisar que las animaciones respeten reducción de movimiento.
- Revisar errores de consola y del backend.
- Revisar que no existan secretos en el repositorio.

#### Entregable esperado

Checklist de pruebas manuales, lista de errores encontrados, correcciones aplicadas y problemas pendientes documentados.

#### Pregunta de verificación antes de avanzar

> ¿El flujo principal funciona en los dispositivos definidos, los estados de error son comprensibles y no existen errores críticos pendientes?

---

### Fase 10 — Build, despliegue y semi-producción

#### Objetivo

Preparar una versión ejecutable fuera del entorno local y cercana a una entrega real.

#### Actividades y decisiones

- Separar variables de entorno de desarrollo y producción.
- Verificar el build del frontend.
- Ejecutar el backend con configuración de producción.
- Configurar CORS de forma explícita.
- Configurar dominio y HTTPS cuando corresponda.
- Verificar rutas de API en el entorno publicado.
- Revisar logs y errores sin exponer información interna.
- Mantener datos temporales claramente identificados.
- Definir qué deberá cambiar al usar una base de datos real.
- Probar el flujo principal en el entorno semi-productivo.
- Documentar despliegue, rollback y próximos riesgos.

#### Entregable esperado

Versión semi-productiva accesible, con build exitoso, variables configuradas, flujo principal verificado y limitaciones documentadas.

#### Pregunta de verificación antes de avanzar

> ¿La aplicación puede ejecutarse fuera de local, el build funciona, el frontend se comunica con el backend y el flujo principal fue verificado?

---

### Fase 11 — Documentación y evolución

#### Objetivo

Dejar el proyecto preparado para que pueda ser retomado, mantenido y convertido en una tienda real.

#### Actividades y decisiones

- Documentar instalación y comandos.
- Documentar estructura y responsabilidades.
- Documentar variables de entorno.
- Documentar endpoints y modelo de datos.
- Registrar decisiones técnicas y visuales.
- Registrar problemas conocidos.
- Registrar funcionalidades futuras.
- Revisar qué partes del MVP deben reemplazarse para producción.
- Definir próximos pasos con prioridades.
- Actualizar este documento vivo conforme cambie el proyecto.

#### Entregable esperado

README, documentación técnica, backlog de evolución, decisiones registradas y este documento actualizado con el estado real.

#### Pregunta de verificación antes de avanzar

> ¿Otro desarrollador, una IA o nosotros mismos podríamos retomar el proyecto sin depender de explicaciones que no estén documentadas?

## 6. Rutas previstas del frontend

| Ruta | Propósito | Datos que necesita |
|---|---|---|
| `/` | Presentar la tienda, la propuesta de valor y productos destacados | Categorías resumidas, productos destacados y contenido visual |
| `/catalogo` | Explorar el catálogo completo | Lista paginada, filtros, categorías y metadatos de resultados |
| `/producto/:id` | Mostrar un producto específico | Un producto por `id`, sus variantes y disponibilidad |
| `/carrito` | Revisar productos seleccionados | Elementos del carrito, cantidades y precios calculados |
| `/pedido` | Enviar una solicitud o pedido simulado | Elementos del carrito, datos del cliente y resumen del total |
| `/pedido/:id` | Mostrar la confirmación de un pedido | Un pedido por `id`, estado y resumen |
| `/admin` | Reservar una pantalla para gestión futura o práctica | Datos resumidos que se definan para el MVP administrativo |

Las rutas no deben cargar datos globales por comodidad. Cada página solicitará los recursos que necesita mediante servicios específicos.

## 7. Endpoints iniciales del backend

| Método | Endpoint | Propósito |
|---|---|---|
| `GET` | `/api/health` | Verificar que el backend está disponible |
| `GET` | `/api/products` | Obtener una colección paginada y filtrada de productos |
| `GET` | `/api/products/:id` | Obtener un solo producto por identificador |
| `GET` | `/api/categories` | Obtener las categorías disponibles |
| `POST` | `/api/orders` | Validar y crear un pedido simulado |
| `GET` | `/api/orders/:id` | Obtener un pedido específico |

### Reglas de los endpoints

- El backend validará los parámetros recibidos.
- El backend no confiará en totales calculados únicamente por el frontend.
- Las respuestas tendrán una estructura coherente.
- Los errores usarán códigos HTTP adecuados y mensajes seguros.
- Los listados tendrán límites de cantidad y paginación cuando corresponda.
- El endpoint de detalle devolverá únicamente el recurso solicitado.

## 8. Estructura de carpetas base

```text
Tienda-de-Impresion3D/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   └── app.config.js
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CatalogPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   └── OrderPage.jsx
│   │   ├── features/
│   │   │   ├── catalog/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   └── catalog.service.js
│   │   │   ├── product-detail/
│   │   │   ├── cart/
│   │   │   └── orders/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── products.routes.js
│   │   │   ├── categories.routes.js
│   │   │   └── orders.routes.js
│   │   ├── controllers/
│   │   │   ├── products.controller.js
│   │   │   ├── categories.controller.js
│   │   │   └── orders.controller.js
│   │   ├── services/
│   │   │   ├── products.service.js
│   │   │   └── orders.service.js
│   │   ├── repositories/
│   │   │   └── products.repository.js
│   │   ├── middlewares/
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── validators/
│   │   ├── data/
│   │   │   └── db.json
│   │   └── config/
│   ├── server.js
│   └── package.json
├── docs/
│   ├── product-brief.md
│   ├── api-contract.md
│   └── decisions.md
├── .env.example
├── .gitignore
└── README.md
```

### Responsabilidades

```text
Componente/página
        ↓
Servicio del frontend
        ↓
Endpoint de la API
        ↓
Ruta del backend
        ↓
Controlador
        ↓
Servicio de negocio
        ↓
Repositorio o datos JSON
```

`App.jsx` y `main.jsx` deben permanecer mínimos. Las reglas de negocio deben vivir en servicios del backend. Las URLs y peticiones deben centralizarse en servicios del frontend.

## 9. Patrón base de fetch con AbortController

El siguiente patrón sirve para solicitar un producto específico desde una pantalla de detalle. La petición depende de `id`, tiene estados de carga y error, y cancela la solicitud si el componente se desmonta o cambia el identificador.

```jsx
import { useEffect, useState } from 'react';

function ProductDetail({ id }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('No se pudo cargar el producto');
        }

        const data = await response.json();
        setProduct(data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message);
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }

    return () => controller.abort();
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!product) return <p>Producto no encontrado.</p>;

  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </article>
  );
}

export default ProductDetail;
```

### Reglas del patrón

- La petición no se ejecuta directamente durante el renderizado.
- `id` aparece en el array de dependencias porque la petición depende de él.
- `AbortController` evita continuar una petición obsoleta.
- `AbortError` no se muestra como error real al usuario.
- La respuesta HTTP se valida antes de convertirla a JSON.
- La pantalla contempla carga, error, ausencia de datos y éxito.
- La URL deberá centralizarse posteriormente en un servicio del frontend.

### Ejemplo de servicio

```js
const API_URL = 'http://localhost:5000/api';

export async function getProductById(id, options = {}) {
  const response = await fetch(`${API_URL}/products/${id}`, options);

  if (!response.ok) {
    throw new Error('No se pudo obtener el producto');
  }

  return response.json();
}
```

## 10. Entidades del modelo de datos

### Product

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | number o string | Identificador único |
| `name` | string | Nombre comercial |
| `slug` | string | Identificador legible para URLs |
| `description` | string | Descripción del producto |
| `price` | number | Precio base |
| `images` | array de strings | URLs o rutas de imágenes |
| `categoryId` | number o string | Categoría relacionada |
| `material` | string | Material de impresión |
| `colors` | array de strings | Colores disponibles |
| `dimensions` | object | Dimensiones del producto |
| `printTime` | string | Tiempo estimado de impresión |
| `available` | boolean | Disponibilidad para solicitarlo |
| `featured` | boolean | Indica si aparece como destacado |

### Category

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | number o string | Identificador único |
| `name` | string | Nombre de la categoría |
| `slug` | string | Identificador para filtros o URLs |
| `description` | string | Descripción breve |
| `image` | string | Imagen representativa opcional |

### CartItem

| Campo | Tipo | Descripción |
|---|---|---|
| `productId` | number o string | Identificador del producto |
| `name` | string | Nombre mostrado en el carrito |
| `price` | number | Precio de referencia |
| `quantity` | number | Cantidad seleccionada |
| `color` | string | Variante seleccionada, si aplica |
| `subtotal` | number | Resultado de precio por cantidad |

El carrito puede mantenerse inicialmente en estado local y, si se necesita compartirlo entre varias páginas, mediante Context. El precio definitivo del pedido debe recalcularse y validarse en el backend.

### Order

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | number o string | Identificador del pedido |
| `customer` | object | Datos básicos del cliente |
| `items` | array de CartItem | Productos solicitados |
| `subtotal` | number | Suma de productos |
| `shipping` | number | Envío simulado si aplica |
| `total` | number | Total calculado por el backend |
| `status` | string | Estado del pedido |
| `createdAt` | string | Fecha de creación |

Estados iniciales posibles: `pending`, `confirmed`, `in-production`, `completed` y `cancelled`. El MVP puede comenzar utilizando únicamente `pending` y `confirmed`.

## 11. Criterios para considerar terminada la primera versión

- [ ] El proyecto tiene repositorio remoto, estructura local y primer `push`.
- [ ] El frontend utiliza React, Vite, JavaScript y Tailwind CSS.
- [ ] No existen archivos TypeScript ni dependencias innecesarias de estado global.
- [ ] El backend está separado y funciona con Node.js y Express.
- [ ] Los datos del MVP están disponibles mediante JSON Server o archivo JSON.
- [ ] Existe un endpoint de health check.
- [ ] La página de inicio presenta claramente la propuesta de la tienda.
- [ ] El catálogo obtiene datos desde el backend.
- [ ] La página de detalle solicita únicamente el producto indicado por `id`.
- [ ] Existen filtros o búsqueda dentro del alcance definido.
- [ ] El carrito calcula cantidades y subtotales correctamente.
- [ ] El pedido simulado valida los datos y devuelve una confirmación.
- [ ] Las peticiones contemplan loading, error, vacío y éxito.
- [ ] Las peticiones obsoletas pueden cancelarse cuando corresponde.
- [ ] No se carga todo el catálogo cuando solo se necesita un producto.
- [ ] La interfaz es usable en móvil y escritorio.
- [ ] Los botones, formularios y mensajes tienen estados claros.
- [ ] La interfaz puede recorrerse con teclado en los flujos principales.
- [ ] Las imágenes tienen texto alternativo cuando lo necesitan.
- [ ] No hay secretos en el repositorio.
- [ ] El backend valida entradas y no confía únicamente en el frontend.
- [ ] El build del frontend finaliza correctamente.
- [ ] El flujo principal fue probado manualmente.
- [ ] El README explica instalación, ejecución y estructura.
- [ ] Las limitaciones del MVP y los próximos pasos están documentados.

## 12. Plantilla de seguimiento por fase

| Fase | Objetivo | Entregable | Verificación | Estado |
|---|---|---|---|---|
| Fase 0 — Preparación | Crear la base técnica | Repositorio ejecutable y primer push | Base Vite/React/JS y Tailwind verificada | Completa |
| Fase 1 — Producto y requisitos | Definir el brief real del cliente | Brief, requisitos y alcance del MVP | Problema, usuario y alcance claros | Completa |
| Fase 2 — Investigación y dirección visual | Crear una identidad propia | Dirección visual y referencias | Decisiones visuales justificadas | Pendiente |
| Fase 3 — UX, user flow y mockup | Diseñar la experiencia | Flujos, wireframes y mockups | Flujo principal comprensible | Pendiente |
| Fase 4 — Design system | Mantener consistencia | Tokens, componentes y estados | Sistema reutilizable definido | Pendiente |
| Fase 5 — Arquitectura | Separar responsabilidades | Estructura frontend/backend | Cada responsabilidad tiene ubicación | Pendiente |
| Fase 6 — Modelo y API | Definir datos y comunicación | Entidades y contrato de API | Cada pantalla tiene datos y endpoint | Pendiente |
| Fase 7 — Implementación | Construir funcionalidades | Versión funcional incremental | Flujo conectado y probado | Pendiente |
| Fase 8 — Optimización | Reducir carga innecesaria | Mejoras de peticiones y rendimiento | Peticiones justificadas y controladas | Pendiente |
| Fase 9 — Calidad | Validar uso y funcionamiento | Checklist y correcciones | Errores críticos resueltos | Pendiente |
| Fase 10 — Semi-producción | Preparar una entrega ejecutable | Build y despliegue | Flujo verificado fuera de local | Pendiente |
| Fase 11 — Evolución | Preparar mantenimiento | Documentación y backlog | Proyecto retomable sin contexto extra | Pendiente |

### Estados permitidos

- **Pendiente:** la fase todavía no comienza.
- **En progreso:** se está trabajando activamente.
- **En revisión:** el trabajo está hecho y se está verificando.
- **Completada:** la pregunta de verificación fue respondida satisfactoriamente.
- **Bloqueada:** falta una decisión, recurso o corrección para continuar.

Este documento debe actualizarse cuando una fase cambie de estado, cuando se tome una decisión importante o cuando se modifique el alcance.

## 13. Referencias útiles

[1]: https://react.dev/ "React official documentation"
[2]: https://vite.dev/guide/ "Vite official guide"
[3]: https://expressjs.com/ "Express official website and documentation"
[4]: https://tailwindcss.com/docs/installation/using-vite "Tailwind CSS with Vite"
[5]: https://developer.mozilla.org/en-US/docs/Web/API/AbortController "MDN AbortController documentation"
[6]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API "MDN Fetch API documentation"
[7]: https://react.dev/reference/react/useEffect "React useEffect reference"
[8]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching "MDN HTTP caching guide"
[9]: https://web.dev/learn/performance "Web performance learning resources"
[10]: https://owasp.org/www-project-top-ten/ "OWASP Top 10 web application security risks"
[11]: https://git-scm.com/book/en/v2 "Pro Git book"
[12]: https://github.com/typicode/json-server "JSON Server repository and documentation"
