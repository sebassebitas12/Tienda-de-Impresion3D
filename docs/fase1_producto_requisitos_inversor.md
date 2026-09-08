# Fase 1: Producto y Requisitos - Tienda de Impresión 3D

## 1. Brief del Cliente
El proyecto consiste en el desarrollo de un **prototipo funcional de alta fidelidad** para presentar a inversores. La plataforma es un comercio electrónico especializado en impresión 3D, orientado inicialmente al mercado costarricense ("una página tica para ticos") con capacidad de expansión internacional. Operará con un modelo híbrido: venta directa de un catálogo predefinido (gadgets, juguetes, figuras) y gestión de solicitudes personalizadas o de volumen (ej. 100 piezas para un brazo robótico) recibiendo especificaciones y archivos de diseño. El flujo debe verse y sentirse como un producto real y productivo.

## 2. Perfil de Usuario
*   **El Consumidor Casual:** Busca artículos listos para comprar. Valora una navegación visualmente atractiva, un flujo de compra rápido y cero fricción técnica.
*   **El Cliente Técnico / Corporativo:** Estudiantes de ingeniería, hobbistas o empresas. Requiere subir sus propios diseños 3D, especificar requerimientos técnicos (material, relleno) y recibir cotizaciones personalizadas.
*   **El Inversor (Stakeholder):** Evaluará la viabilidad tecnológica, la experiencia de usuario (UX/UI) y la solidez del flujo principal para decidir su participación en el negocio.

## 3. Propuesta de Valor
"Tu puente local hacia la fabricación digital: desde un llavero hasta el prototipo de tu tesis, impreso en Costa Rica y enviado a donde estés." 
Destaca por su flexibilidad (catálogo inmediato + encargos a medida), una experiencia de usuario de primer nivel y un contacto directo y ágil.

## 4. Requisitos Funcionales
*   **Gestión de Usuarios (Real):** Registro e inicio de sesión funcional (autenticación básica) para que los usuarios guarden su perfil (nombre, correo, dirección) y agilicen flujos recurrentes.
*   **Catálogo de Productos:** Visualización de productos categorizados con alta fidelidad gráfica.
*   **Carrito de Compras:** Funcionalidad completa para agregar, modificar y calcular el total de los productos del catálogo.
*   **Formulario de Solicitud Personalizada:** 
    *   Subida real de archivos de diseño (ej. `.stl`, `.obj` con límite de peso).
    *   Campos para especificaciones técnicas y requerimientos en texto.
    *   Asignación automática de los datos del usuario autenticado.
*   **Flujo de Pedido / Solicitud:** Proceso de checkout simulado pero visualmente idéntico a una pasarela real, unificando pedidos de catálogo y cotizaciones.
*   **Servicio al Cliente:** Integración de un botón flotante de WhatsApp para contacto directo y resolución de dudas, optimizando la conversión sin sobrecargar el desarrollo.

## 5. Requisitos No Funcionales
*   **Fidelidad y Usabilidad (UX/UI):** Diseño responsive premium con Tailwind CSS. Estados interactivos precisos (loading, success, error) para transmitir calidad de producto terminado al inversor.
*   **Seguridad:** Encriptación de contraseñas y manejo seguro de tokens (JWT) para la sesión. Validación y sanitización en el backend para la subida de archivos (evitar vulnerabilidades).
*   **Rendimiento:** Manejo asíncrono optimizado para la subida de archivos pesados y carga diferida (lazy loading) de imágenes del catálogo.
*   **Arquitectura:** Separación estricta entre frontend y backend (Node.js/Express) según lo definido en el documento matriz.

## 6. Alcance del Prototipo de Alta Fidelidad (MVP)

**Incluido:**
*   Autenticación real básica (Login/Registro).
*   Subida y almacenamiento real de archivos 3D en el servidor (con validación de formato y peso).
*   Página de inicio, catálogo paginado/filtrado y detalle de producto.
*   Carrito de compras funcional y persistente durante la sesión.
*   Checkout simulado de alta fidelidad.
*   Botón de contacto vía WhatsApp.
*   Datos persistidos (JSON Server o base de datos ligera como SQLite si la autenticación lo exige).

**Fuera del Prototipo:**
*   Cotizador interactivo automático en tiempo real con visor 3D en el navegador.
*   Pasarelas de pago bancarias reales (solo UI de simulación).
*   Gestión avanzada de inventario y logística automatizada.

## 7. Criterios de Éxito
*   Un inversor puede crear una cuenta real, navegar el catálogo y simular una compra sin romper el flujo.
*   El usuario técnico puede iniciar sesión, adjuntar un archivo `.stl` de tamaño permitido, y enviar su solicitud con éxito.
*   La interfaz transmite confianza, profesionalismo y se adapta perfectamente a dispositivos móviles y escritorio.
*   Las integraciones de autenticación y carga de archivos manejan correctamente los errores (ej. archivo muy pesado o contraseña incorrecta) mostrando retroalimentación clara.

## 8. Historias de Usuario Principales
1.  **Como consumidor casual**, quiero explorar un catálogo visualmente atractivo para comprar productos terminados.
2.  **Como cliente técnico**, quiero subir mi archivo `.stl` de forma segura en un formulario detallado para solicitar la cotización de mis piezas.
3.  **Como cliente recurrente**, quiero crear una cuenta y autenticarme para que mis datos de envío se completen automáticamente en el checkout.
4.  **Como usuario con dudas rápidas**, quiero presionar un botón de WhatsApp para contactar directamente a la tienda sin tener que navegar por menús de ayuda complejos.
