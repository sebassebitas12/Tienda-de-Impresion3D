# Anteproyecto — Vértice CR
**FWD ACADEMY · DESARROLLO FRONT END CON REACT**  
**Proyecto Final — Enunciado y Lineamientos de Entrega**

---

* **Nombre del estudiante:** Sebastián Flores Miranda  
* **Fecha de entrega:** 21 de septiembre de 2026  
* **Tecnología base:** React 19 + React Router DOM + Vite  
* **Backend simulado:** JSON Server (`db.json`)  
* **Modalidad:** Individual  

---

## 1. Introducción

El presente anteproyecto documenta la planificación, arquitectura y diseño de **Vértice CR**, una aplicación web front-end de grado profesional y alta precisión orientada al comercio electrónico y manufactura aditiva (impresión 3D) en Costa Rica.

El negocio integra dos modelos complementarios en una misma experiencia de usuario:
1. **Catálogo de productos terminados:** Venta directa de piezas funcionales, accesorios, componentes de ingeniería, decoración y coleccionables para usuarios generales y técnicos.
2. **Servicio de impresión 3D personalizada:** Recepción de modelos tridimensionales o ideas de clientes para su posterior cotización técnica, análisis de viabilidad, selección de material y fabricación bajo pedido.

La plataforma resuelve la necesidad de centralizar tanto la compra rápida como la cotización especializada, incorporando asistencia mediante Inteligencia Artificial, automatización de notificaciones operativas con N8N, paneles de métricas administrativas y un diseño accesible, adaptativo y de alto impacto estético.

---

## 2. Objetivo General

Diseñar e implementar el frontend interactivo, escalable y accesible de la plataforma **Vértice CR** utilizando React y React Router DOM, gestionando de forma integral la comercialización de productos de catálogo y el flujo de cotización técnica para manufactura 3D personalizada, integrando consumo de APIs locales y externas, pruebas automatizadas con Jest, soporte de Inteligencia Artificial y flujos de automatización de procesos con N8N.

---

## 3. Objetivos Específicos

1. **Arquitectura y navegación:** Estructurar una aplicación modular en React con rutas públicas y protegidas mediante React Router DOM, separando vistas (páginas), componentes reutilizables, hooks y una capa de servicios desacoplada (`src/services/`).
2. **Backend simulado y consumo de APIs:** Configurar JSON Server (`db.json`) para persistir y ejecutar operaciones CRUD sobre usuarios, productos, categorías, pedidos y cotizaciones, integrando además un endpoint externo real para la búsqueda y exploración de modelos 3D comunitarios abiertos.
3. **Diseño adaptativo y accesibilidad:** Construir una interfaz 100% responsive apta para móvil (~375px), tablet (~768px) y escritorio (~1280px+), cumpliendo con las 4 prácticas de accesibilidad: modo claro/oscuro, texto escalable en unidades relativas, soporte ARIA con semántica HTML, y diferenciación visual de estados independiente del color.
4. **Autenticación y roles:** Implementar un sistema de autenticación (Login/Registro) con persistencia de sesión en cliente y control de acceso basado en roles (`admin` y `customer`), protegiendo módulos administrativos de visualización y edición.
5. **Panel administrativo y analítica:** Desarrollar un dashboard de administración con indicadores clave de rendimiento (KPIs) calculados desde datos reales y visualización gráfica interactiva con Recharts.
6. **Integración de Inteligencia Artificial:** Incorporar un asistente inteligente de cotización técnica que oriente al cliente en lenguaje natural respecto a la elección de materiales (PLA, PETG, Resina, Flex), dimensiones, resistencia mecánica y costo estimado.
7. **Automatización con N8N:** Configurar dos flujos de trabajo automatizados para la gestión de nuevas cotizaciones y la notificación de aprobación a clientes.
8. **Aseguramiento de calidad:** Validar componentes críticos y lógica de negocio mediante pruebas unitarias con Jest y React Testing Library, persiguiendo un mínimo de 70% de cobertura.

---

## 4. Desarrollo del Proyecto

### 4.1 Arquitectura y Estructura del Código

El proyecto se desarrolla sobre **React 19** y **Vite**, asegurando tiempos de compilación inmediatos y una estructura limpia en JavaScript nativo estructurado de la siguiente forma:

```
src/
├── assets/          # Logotipos vectoriales, imágenes base e iconografía
├── components/      # Componentes UI reutilizables (Navbar, Cards, Modals, Badges, etc.)
├── context/         # Contextos globales (AuthContext, ThemeContext, CartContext)
├── hooks/           # Custom hooks para lógica reutilizable (useAuth, useFetch, useMetrics)
├── pages/           # Vistas principales (Home, Tienda/Catálogo, Detalle, Cotizador, Admin)
│   ├── admin/       # Vistas protegidas de administración (Dashboard, CRUDs)
│   └── public/      # Vistas accesibles a clientes y visitantes
├── services/        # Capa HTTP centralizada (api.js, aiService.js, external3dService.js)
├── styles/          # Tokens CSS globales, variables de color y mixins responsive
├── tests/           # Suites de pruebas unitarias Jest / Testing Library
├── App.jsx          # Enrutador principal y proveedores de contexto
└── main.jsx         # Punto de entrada de la aplicación
```

### 4.2 Backend Simulado y Endpoint Externo Real

1. **Backend simulado con JSON Server (`db.json`):**  
   Simula un backend RESTful completo escuchando en `http://localhost:3001` con las siguientes colecciones normalizadas:
   * `/users`: Perfiles de usuarios con campo `role` (`admin` | `customer`).
   * `/products`: Artículos de catálogo con atributos técnicos (material, tiempo de impresión, filamento utilizado, dimensiones, precio y stock).
   * `/categories`: Categorías del catálogo (Piezas Técnicas, Coleccionables, Arquitectura, Gadgets).
   * `/custom_requests`: Solicitudes de cotización personalizada con ciclo `PENDING_QUOTE → IN_REVIEW → QUOTED → AWAITING_APPROVAL → APPROVED → PAID`, además de `REJECTED`, `EXPIRED` y `CANCELLED`.
   * `/orders`: Pedidos confirmados y su trazabilidad de entrega.

2. **Endpoint Externo Real (Servicio de Diseños 3D Comunitarios):**  
   Consumido directamente desde `src/services/external3dService.js`. La integración externa de modelos 3D queda **por definir durante la fase de arquitectura**. No se debe presentar un proveedor concreto como implementado hasta validar disponibilidad, licencia, autenticación y compatibilidad con el MVP.  
   * **Función en el sistema:** Permite al cliente que no dispone de un archivo STL/OBJ propio buscar e importar modelos 3D comunitarios certificados para cotizar su impresión con un solo clic, aumentando la tasa de conversión de la tienda.

### 4.3 Diseño Responsive y Prácticas de Accesibilidad

El diseño se implementa con CSS puro modular mediante diseño fluido (*fluid design*), flexbox y CSS grid, garantizando cumplimiento estricto de accesibilidad:

* **Responsividad probada:**
  * **Móvil (~375px):** Menú hamburguesa colapsable, disposición en una columna, tarjetas compactas y carrusel táctil de piezas.
  * **Tablet (~768px):** Grillas de 2 columnas con navegación adaptada.
  * **Escritorio (~1280px+):** Experiencia completa con showcase horizontal, panel lateral de filtros fijado y layout multipanel en administración.
* **Prácticas de accesibilidad obligatorias (4 de 4):**
  1. *Control de tema claro/oscuro:* Tema oscuro nativo (Dark Mode volcánico) con alternancia completa a Tema Claro (Light Mode) de alto contraste.
  2. *Tamaño de texto ajustable:* Tipografía definida íntegramente en `rem` con escalado dinámico del elemento raíz sin romper contenedores ni solapar textos.
  3. *Soporte para lectores de pantalla:* Empleo de etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) y atributos ARIA (`aria-expanded`, `aria-label`, `aria-live` en el carrito y notificaciones).
  4. *Diferenciación sin depender solo del color:* Estados como "En Stock", "Agotado", "Pendiente de Cotización" o "Aprobado" incorporan íconos SVG distintivos (check, reloj, alerta) y textos explícitos, facilitando el uso para usuarios con daltonismo.

### 4.4 Autenticación, Autorización y Rutas

* **Rutas Públicas:** Inicio (`/`), Catálogo (`/tienda`), Detalle de Producto (`/producto/:id`), Solicitud de Cotización (`/cotizar`), Contacto (`/contacto`), Login (`/login`) y Registro (`/registro`).
* **Rutas Privadas de Cliente:** Perfil de usuario (`/mi-cuenta`), Historial de pedidos (`/mis-pedidos`), Seguimiento de cotizaciones (`/mis-cotizaciones`).
* **Rutas Privadas de Administrador (`role === 'admin'`):**
  * `/admin/dashboard`: Ventas cobradas, pedidos activos, solicitudes pendientes, stock bajo y gráficas operativas derivadas de `db.json`.
  * `/admin/productos`: CRUD de productos.
  * `/admin/solicitudes`: Revisión, emisión y seguimiento de cotizaciones personalizadas; el precio final solo existe desde `QUOTED`.
  * `/admin/pedidos`: Actualización de estados logísticos.
  * `/admin/usuarios`: Gestión de cuentas y roles, solo si la implementación del MVP requiere esta operación.
* **Persistencia:** La sesión del usuario se mantiene mediante `AuthContext` sincronizado con `localStorage`, interceptando cualquier intento de navegación no autorizada mediante componentes `ProtectedRoute` y `AdminRoute`.

### 4.5 Operaciones CRUD en Administración

El panel de administración contiene interfaces completas de gestión para:
* **Productos:** Crear nuevo ítem (nombre, material, precio, stock, imagen), Listar en tabla con paginación, Editar especificaciones y Eliminar producto.
* **Categorías:** Gestión completa de taxonomía de la tienda.
* **Solicitudes de impresión:** Lectura de requerimientos del cliente, cálculo del costo de resina/filamento, actualización del estado a `QUOTED` / `APPROVED` e ingreso del precio final.
* **Usuarios:** Alta y modificación de permisos de acceso.

### 4.6 Panel de Administración: Métricas y Visualización

El dashboard administrativo (`/admin/dashboard`) calcula métricas en tiempo real a través de funciones puras a partir de `db.json`:
1. **Total de ingresos generados (₡ / $):** Suma total de pedidos cerrados.
2. **Volumen de pedidos activos:** Pedidos en cola de producción o despacho.
3. **Solicitudes pendientes de cotización:** Alertas de cotizaciones esperando respuesta del administrador.
4. **Alertas de inventario crítico:** Productos con existencias menores al umbral de seguridad.
5. **Visualización Gráfica:** Gráficos dinámicos con **Recharts**:
   * Gráfico de barras: Distribución de demanda por material de impresión (PLA vs. PETG vs. Resina vs. TPU).
   * Gráfico de líneas: Evolución mensual de pedidos y cotizaciones.

### 4.7 Pruebas Unitarias con Jest

Se estructuran pruebas unitarias con **Jest** y **React Testing Library** cubriendo:
* Renderizado accesible y estados de componentes principales (Cards de producto, botones de acción, modales).
* Lógica del carrito de compras (adición, sustracción, cálculo de impuestos y totales).
* Guards de navegación y protección de rutas privadas ante tokens nulos o roles insuficientes.
* Meta de cobertura: Mínimo 70% en funciones, ramas, declaraciones y líneas.

### 4.8 Integración de Inteligencia Artificial (Obligatorio)

En la vista de solicitud personalizada (`/cotizar`) se integra el **Asistente de Cotización 3D Vértice**, consumido a través de `src/services/aiService.js`:
* **Mecanismo:** El usuario ingresa la descripción funcional de lo que desea imprimir (ej. *"Necesito un engranaje resistente al calor para un motor eléctrico"*).
* **Respuesta inteligente:** El servicio analiza los requerimientos y sugiere:
  1. Material idóneo recomendado (ej. PETG o Nylon por resistencia térmica y fatiga).
  2. Resolución de capa y porcentaje de relleno (*infill*) sugerido.
  3. Estimación preliminar de tiempo de impresión.
  4. Rango de costo aproximado orientativo.
* **Transparencia técnica:** El asistente aclara de forma expresa que el costo es una estimación referencial y registra la solicitud en estado `PENDING_QUOTE` para la validación definitiva del administrador humano.

### 4.9 Automatización de Procesos con N8N

Se implementan dos flujos de trabajo automáticos orquestados en **N8N**:
1. **Flujo 1 — Notificación de Nueva Cotización al Administrador:**  
   Al detectarse una nueva entrada en `/custom_requests`, N8N activa un webhook que procesa los datos (cliente, descripción técnica, material sugerido por la IA) y despacha una notificación por correo electrónico y alerta a Discord/Telegram del administrador para su pronta revisión.
2. **Flujo 2 — Notificación de Cotización Aprobada y Coordinación por WhatsApp:**  
   Cuando el administrador fija el precio y aprueba la solicitud desde el panel (`status = 'APPROVED'`), N8N genera un correo formal al cliente con el desglose del presupuesto y genera automáticamente el enlace directo de WhatsApp con mensaje parametrizado para acordar los detalles de entrega física o envío por Correos de Costa Rica.

---

## 5. Libro de Marca del Sistema

### 5.1 Identidad y Filosofía Visual

La identidad visual de **Vértice CR** responde al concepto **Lava Orgánica / High-Tech Workshop**: la precisión milimétrica de la manufactura aditiva combinada con la energía volcánica representativa de Costa Rica. Refleja robustez, innovación industrial y confiabilidad técnica.

### 5.2 Paleta de Colores y Verificación de Accesibilidad (WCAG AA)

| Color | Hex | Función / Aplicación | Contraste sobre fondo | Ratio WCAG |
|---|---|---|---|---|
| **Carbón Obsidiana** | `#0D0B09` | Fondo principal de la aplicación (Dark Mode) | — | Base |
| **Gris Asfalto Profundo** | `#141412` | Fondo de tarjetas, paneles y contenedores elevados | Contraste estructural | Aprobado |
| **Naranja Lava (Acento)** | `#FF5A1F` | Botones de acción principal (CTA), bordes de selección, isotipo | Sobre `#0D0B09` (Texto grande/Ícono) | **4.9:1 (AA)** |
| **Naranja Fulgor** | `#FF7A45` | Estados hover, badges destacados | Sobre `#141412` | **6.1:1 (AA)** |
| **Blanco Humo** | `#F5F5F5` | Texto principal, encabezados y títulos | Sobre `#0D0B09` | **16.8:1 (AAA)** |
| **Gris Titanio** | `#8A8884` | Texto secundario, subtítulos y especificaciones | Sobre `#0D0B09` | **5.4:1 (AA)** |
| **Verde Calibración** | `#2ECC71` | Estado "En Stock" / Aprobado | Acompañado de ícono check | **5.1:1 (AA)** |

### 5.3 Tipografía Oficial

* **Titulares e Interfaz General:** *Space Grotesk* (Google Fonts) — Tipografía sans-serif de cortes geométricos y ángulos definidos que evocan el posicionamiento de cabezales y vértices en impresión 3D.
* **Datos Técnicos, Métricas y Código:** *JetBrains Mono* (Google Fonts) — Tipografía monoespaciada para dimensiones (mm), temperaturas (°C), tiempos de impresión y trazabilidad de pedidos.

### 5.4 Logotipos del Sistema

1. **Isotipo Oficial (Símbolo 'V'):**  
   Doble trazo diagonal ascendente con ángulo agudo en naranja lava (`#FF5A1F`), simulando filamento extruido por capas superpuestas. Disponible en formato vectorial `public/favicon.svg`.

![Isotipo Oficial — Favicon](file:///c:/Documentos/proyecto%20react%20impresion3D/Tienda-de-Impresion3D/Tienda/public/favicon-512.png)

2. **Logotipo Completo (Isotipo + Logomarca):**  
   Isotipo a la izquierda acompañado de la palabra **VÉRTICE CR** en mayúsculas sostenidas, blanco humo (`#F5F5F5`), con tracking espaciado (`letter-spacing: 4.5px`). Disponible en `public/logo.svg`.

![Logotipo Completo — Vértice CR](file:///c:/Documentos/proyecto%20react%20impresion3D/Tienda-de-Impresion3D/Tienda/mockups/favicon.jpg)

3. **Favicon del Sitio Web:**  
   Versión estilizada del isotipo optimizada para legibilidad en 16x16, 32x32 y 64x64 píxeles.

---

## 6. Anexos: Mockups del Sistema

Los mockups desarrollados representan la guía visual y de interacción definitiva para la implementación en React.

### Anexo A: Vista Home / Landing Desktop (`mainpage.jpg`)
* **Archivo:** `mockups/mainpage.jpg`
* **Descripción:** Barra de navegación superior con logotipo y enlaces principales, sección Hero con encabezado de alta precisión, botón de llamada a la acción ("Ver tienda"), indicadores de valor diferencial (Alta precisión, Materiales resistentes, Diseño personalizado) y showcase interactivo de piezas 3D destacadas con selector lateral (01 al 04).

![Anexo A — Vista Home Desktop](file:///c:/Documentos/proyecto%20react%20impresion3D/Tienda-de-Impresion3D/Tienda/mockups/mainpage.jpg)

### Anexo B: Vista Tienda / Catálogo Desktop (`tienda.jpg`)
* **Archivo:** `mockups/tienda.jpg`
* **Descripción:** Interfaz de comercio electrónico con panel lateral izquierdo de filtros avanzados (Búsqueda por categoría, deslizador de rango de precio de $0 a $150, selector de materiales PLA/PETG/Resina/Flex, conmutador de estado En Stock/Bajo Pedido, y tipo de tecnología FDM/SLA). Cuadrícula de productos con fotografía en alta resolución, etiqueta técnica, precio y botón de acción directa.

![Anexo B — Vista Tienda Catálogo](file:///c:/Documentos/proyecto%20react%20impresion3D/Tienda-de-Impresion3D/Tienda/mockups/tienda.jpg)

### Anexo C: Vista de Contacto y Cotización Desktop (`contactenos.jpg`)
* **Archivo:** `mockups/contactenos.jpg`
* **Descripción:** Pantalla de comunicación directa con canales oficiales (correo hola@verticecr.com, teléfono, ubicación en San José, Costa Rica) con placa de garantía de respuesta en 24h y formulario interactivo con campos de nombre, correo y mensaje detallado con botón "Enviar mensaje".

![Anexo C — Formulario de Contacto y Cotización](file:///c:/Documentos/proyecto%20react%20impresion3D/Tienda-de-Impresion3D/Tienda/mockups/contactenos.jpg)

### Anexo D: Menú Contextual Desplegable (`lista plegable.jpg`)
* **Archivo:** `mockups/lista plegable.jpg`
* **Descripción:** Desplegable del perfil de usuario y control administrativo para `Javier A. (Admin)`, con acceso a notificaciones con contador visual numérico, panel de configuración, facturación, soporte y opción de cierre de sesión seguro.

![Anexo D — Menú Contextual Desplegable](file:///c:/Documentos/proyecto%20react%20impresion3D/Tienda-de-Impresion3D/Tienda/mockups/lista%20plegable.jpg)

### Anexo E: Vista Móvil Responsive (~375px) (`vista_movil.jpg`)
* **Archivo:** `mockups/vista_movil.jpg`
* **Descripción:** Adaptación para smartphones (~375px) respetando la jerarquía visual de Vértice CR: barra superior compacta con menú hamburguesa, visualizador principal centrado, llamada a la acción accesible con una mano ("Ver tienda"), carrusel horizontal inferior con navegación táctil entre modelos 01 a 04 y bloques de valor apilados verticalmente.

![Anexo E — Vista Móvil Responsive](file:///c:/Documentos/proyecto%20react%20impresion3D/Tienda-de-Impresion3D/Tienda/mockups/vista_movil.jpg)

### Anexo F: Isotipo y Favicon Oficial (`favicon.jpg`)
* **Archivo:** `mockups/favicon.jpg`
* **Descripción:** Diseño del isotipo tridimensional en forma de "V" en cinta de filamento naranja lava con acabado satinado. A partir de este diseño se crearon los assets de producción: `public/favicon.png` (fondo transparente aislado en alta resolución, 512x512, 192x192, 32x32), `public/favicon.svg` y `public/favicon-squircle.png` (versión redondeada para Apple Touch Icon y web apps).

![Anexo F — Isotipo Oficial](file:///c:/Documentos/proyecto%20react%20impresion3D/Tienda-de-Impresion3D/Tienda/mockups/favicon.jpg)

---

## 7. Lista de Verificación de Entregables (FWD Academy)

| # | Entregable Exigido | Herramienta / Detalle Técnico en Vértice CR | Estado en Anteproyecto |
|---|---|---|:---:|
| 1 | App React con componentes, páginas y rutas | React 19 + React Router DOM v6/v7 | Planificado |
| 2 | Diseño responsive (móvil, tablet, escritorio) | CSS puro, media queries (~375px, ~768px, ~1280px) | Planificado y Mockup Anexo |
| 3 | Accesibilidad (mínimo 3 de 4 prácticas) | Modo Dark/Light, Texto rem, ARIA, No solo color | Planificado (4/4 prácticas) |
| 4 | Carpeta Services (endpoints locales y externos) | Axios/Fetch hacia JSON Server + API Externa de Modelos 3D | Planificado |
| 5 | Backend simulado | JSON Server con `db.json` normalizado | Configurado y Planificado |
| 6 | Rutas públicas y privadas | React Router DOM con `ProtectedRoute` y `AdminRoute` | Planificado |
| 7 | Autenticación (Login y Register) | Módulo de autenticación con persistencia en `localStorage` | Planificado |
| 8 | Autorización por roles | Roles `admin` y `customer` almacenados en `db.json` | Planificado |
| 9 | Todos los CRUD del proyecto | Gestión en administración de Productos, Categorías, Solicitudes y Usuarios | Planificado |
| 10 | Panel de administración con métricas y gráfico | Recharts (Ventas, Pedidos, Solicitudes, Stock crítico) | Planificado |
| 11 | Pruebas unitarias de front end | Jest + React Testing Library (cobertura objetivo $\ge 70\%$) | Planificado |
| 12 | Integración de IA (obligatorio) | Asistente de cotización y asesor de materiales 3D | Planificado en `aiService.js` |
| 13 | Proyecto N8N con al menos 2 flujos | Flujo 1: Notificación al admin; Flujo 2: Aprobación al cliente | Planificado |
| 14 | Anteproyecto escrito (21 de sept.) | Objetivos, Introducción, Desarrollo, Libro de Marca, Anexos | **DOCUMENTADO** |
| 15 | Mockups del sistema (escritorio y móvil) | Mockups HF en `mockups/HFcompletos/`, todavía en validación | **EN VALIDACIÓN** |
| 16 | Libro de marca | Dirección visual consolidada; formalización final pendiente de validación HF | **EN CONSTRUCCIÓN** |
