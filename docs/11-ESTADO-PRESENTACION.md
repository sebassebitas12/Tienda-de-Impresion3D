# Estado y bloques de trabajo — Pruebas

## Corte vigente — 2026-10-05

Rama `Pruebas`, HEAD `e41099d` publicado; CI de ese commit verde. Esta sesión
trabaja sobre el seed y el recorrido de catálogo, no sobre `main`.

La semilla remota tenía 25 productos, 6 `ACTIVE` y 19 `DRAFT`; la base de casa
tiene los mismos 25 modelos completos/visibles. La comparación de colecciones
confirmó que **solo cambia `products`**. Se lleva únicamente esa colección al
seed de presentación; el `db.json` runtime no debe mezclarse entero porque sus
pedidos/cotizaciones pueden ser pruebas locales.

Los 25 precios se presentan como `DEMO`; p1–p6 no tienen origen comercial
verificable, medidas/peso heredados sin prueba de laminador ni confirmación de
precio. Las imágenes son referencias, no prueba de fabricación. Catálogo,
tarjeta y ficha avisan que las imágenes son ilustrativas, los precios
referenciales y el pago no confirma producción/entrega. Se revisó Dark escritorio
(1265 × 720): 25 modelos, filtros y rejilla de tres columnas; Light, móvil
(375/768) y detalles de las fichas siguen pendientes. Gates locales pasan; CI
verde solo corresponde al baseline `e41099d`, no a estos cambios locales.
Verificación local: 51 suites / 304 tests, lint, `check:ui`, 270
comprobaciones de automatización, build y `git diff --check` pasan.

La promesa principal es IA integrada para organizar referencias y automatizar
el armado de cotizaciones sin pedir datos técnicos manuales. El código actual
solo pasa texto al agente; los adjuntos quedan en la solicitud y no se analizan.
El motor de precio sigue en DEMO; la cotización multimodal no está validada.
Flujo de negocio: cliente inicia → IA organiza/procesa → Admin atiende o valida
con acciones → cliente aprueba y paga DEMO → seguimiento.

El MCP image-to-3D identificado es Meshy (`@meshy-ai/meshy-mcp-server`), pero el
usuario decidió aplazarlo en esta entrega. No es dependencia del recorrido que
cerraremos ahora; ver `docs/07` para sus límites técnicos y tarifas.

El usuario confirma impresora Creality K1C. En el checkout no se encontraron
archivos STL/3MF/OBJ ni metadatos de fuente/licencia; por eso aún no hay medidas
de laminador para el seed. Se documentó un batch de Creality Print CLI con preset
K1C como alternativa, sujeto a recuperar y comprobar los diseños autorizados. El
valor nominal de placa (350 W) no se usa como consumo medio. La galería pública
puede ser solo cuatro imágenes renderizadas del mismo modelo fuente.

El contenido de abajo conserva el checkpoint anterior a esta integración; sus
cifras, `db.json` y pendientes no representan el estado vigente anterior.

## Historial de checkpoint anterior a la integración del catálogo

### Integración en casa — 2026-10-05

Los tres commits del curso hasta `ba497da` se recuperaron mediante bundle Git
autorizado, verificado por SHA256 y `git bundle verify`; integración fast-forward
desde `e5c1976` y push a `Pruebas` realizados. `db.json` runtime de casa conserva
su huella anterior y no se incluyó en el push. Verificación local: Jest sin caché
50 suites/299 tests, lint, check:ui, build y 270 comprobaciones de automatización
aprobados. CI del push pendiente en este corte. No se verificó visualmente la
versión integrada ni se llamó al proveedor IA real; los bloques restantes siguen
abiertos. Las cifras de catálogo del curso describen el fixture, no la base
runtime preservada de casa.
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


## Cierre de sesión y propuestas pendientes
- Trabajo guardado localmente en rama Pruebas. Commits: 1e086a9 (checkpoint y alcance), 7e0c2dd (CRUD IA confirmado y workflow DeepSeek). No se hizo push.
- DeepSeek: credencial existente en n8n. Conexión real pendiente de iniciar sesión, asignar credenciales/importar workflow y configurar URLs. Gmail conservado.
- Imagen a modelo 3D: propuesta del usuario registrada, sin implementar. Aclarar si se busca visualizar un modelo existente o generar geometría desde una imagen. Three.js sería la capa de visualización; la generación necesitaría un servicio/modelo separado. Evaluar calidad geométrica, escala, imprimibilidad, costo, latencia y tiempo de integración antes de incorporarlo al alcance. Prioridad actual: cerrar recorridos existentes para la presentación.
- Herramientas realmente utilizadas: navegador MCP/CUA para revisión visual; Jest para pruebas; script HTTP de automatización aislada y ESLint. NO se utilizó Playwright CLI. No confundir comprobaciones simuladas con validación de DeepSeek/Gmail reales.
- Servicios de revisión iniciados: app 127.0.0.1:5174, API 127.0.0.1:3217, base temporal. No dependen de que este documento garantice que sigan vivos después de cerrar la sesión; comprobar procesos al retomar. Entorno original 5173/3000 preservado.
- Al retomar: leer este estado y roadmap; revisar git status; comprobar app/API y sesión Admin; conectar n8n; cerrar cotización cliente+IA y revisión Admin; recorrer compra/pago/seguimiento; auditoría visual y ensayo de 15 minutos.
