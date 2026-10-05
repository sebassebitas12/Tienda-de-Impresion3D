# Estado y bloques de trabajo — Pruebas

## Visión confirmada
MVP académico con experiencia completa: React, JSON Server y n8n. Pagos simulados; correo Gmail existente conservado. DeepSeek usa la credencial existente de n8n.

## Bloque implementado
- Copiloto Admin prepara crear, editar y eliminar piezas/categorías. Muestra los cambios antes de guardar y exige confirmación del administrador.
- Protege registros usados por pedidos, detecta propuestas desactualizadas y evita duplicados al reintentar. Registra actividad.
- Alta de piezas: IA completa ficha, puede elegir categoría existente y calcula precio DEMO con peso/tiempo aproximados.
- Corregida lectura de configuración local de la API desde Vite. Login clásico Admin comprobado contra API aislada.
- Workflow actualizado para DeepSeek: tres asistentes separados, cinco entradas y Gmail conservado. No importado ni publicado en n8n todavía.

## Evidencia
299 pruebas en 50 suites aprobadas. 270 comprobaciones de automatización aprobadas. ESLint aprobado. Servicios de revisión: app http://127.0.0.1:5174, API http://127.0.0.1:3217; base temporal separada de db.json. Sin cambios en main ni push. No se enviaron correos reales ni se validó una respuesta real de DeepSeek.

## Bloques restantes, en orden
1. Conexión real: importar workflow unificado en n8n, seleccionar credenciales existentes DeepSeek/Gmail/Header Auth, configurar callback y URLs, probar respuesta desde app.
2. Cliente + IA: mensajes y referencias completan solicitud independiente del catálogo; cliente revisa y envía; Admin recibe y valida cotización; cliente recibe importe/condiciones, aprueba, paga DEMO y se crea pedido para fabricación. Cerrar cada pantalla y transición.
3. Administración: facilitar revisión de solicitudes, cotizaciones automáticas y enlaces pedido–cliente–solicitud; ampliar acciones IA donde haga falta para el recorrido expuesto.
4. Auditoría de experiencia: carrito, producto/reseñas, duplicados, páginas incompletas, errores/reintentos, filtros, textos largos, tablas, feedback y zonas táctiles.
5. Ensayo completo de 15 minutos: visitante 2 min; solicitud IA 3; Admin/CRUD 4; aprobación/pago/seguimiento 3; arquitectura 3.

## Avance
45% fue la estimación inicial de preparación. No se incrementa hasta validar la conexión real y recalificar los recorridos en pantalla. No representa porcentaje de código ni garantiza que todos los flujos estén completos.
