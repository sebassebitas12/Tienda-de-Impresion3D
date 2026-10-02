# Vértice CR — workflows n8n

Importá cada JSON desde **Workflows → Import from File**. Son workflows independientes y entran inactivos. Para probar, seleccioná las credenciales en cada nodo y publicá el workflow para habilitar su URL de producción.

## Credenciales

- **Webhook:** elegí el Header Auth existente cuyo nombre sea `X-Vertice-Webhook-Token`. Debe tener el mismo valor que `VERTICE_QUOTE_EMAIL_WEBHOOK_TOKEN` en el backend.
- **DeepSeek:** en cada uno de los tres workflows de asistentes, elegí una credencial Header Auth con `Authorization` y valor `Bearer TU_API_KEY`. La clave solo vive en las credenciales n8n. El modelo configurado es `deepseek-flash`; podés cambiarlo en el nodo si tu cuenta habilita otro.
- **Gmail:** en `vertice-quote-email.json`, seleccioná la credencial Gmail OAuth ya autorizada. La cuenta emisora debe tener permiso para enviar.
- **Tasas:** seleccionar Header Auth en el Webhook. Hacienda y ARESEP son consultas públicas sin API key.

## Archivos y rutas

| Archivo | Ruta POST | Uso |
|---|---|---|
| `vertice-assistant-general.json` | `/webhook/vertice-assistant-general` | TP público: catálogo publicado, materiales y proceso. |
| `vertice-assistant-admin.json` | `/webhook/vertice-assistant-admin` | Ayuda operativa Admin; lectura y cotización calculada por backend. |
| `vertice-assistant-quote.json` | `/webhook/vertice-assistant-quote` | Orientación privada al cotizar; no guarda ni aprueba. |
| `vertice-rates.json` | `/webhook/vertice-rates` | Consulta cambio Hacienda + tarifa ARESEP seleccionada. |
| `vertice-quote-email.json` | `/webhook/vertice-quote-email` | Envía al cliente y copia oculta al taller; responde con ID de Gmail. |

El backend ejecuta las herramientas según el rol, valida argumentos, límites y permisos, y vuelve a comprobar cotización/versión antes de guardar. Los asistentes no envían correos ni cambian estados. El correo se inicia desde el flujo explícito de Admin o al guardar la solicitud con la opción correspondiente.

## APIs públicas consultadas

- Tipo de cambio de venta Hacienda: `GET https://api.hacienda.go.cr/indicadores/tc/dolar`.
- Tarifas eléctricas ARESEP: `GET https://datos.aresep.go.cr/ws.datosabiertos/Services/IE/TarifasElectricidad.svc/ObtenerTarifasElectricidadDistribucion/0`.
- DeepSeek Chat Completions y tool calling: `POST https://api.deepseek.com/chat/completions`.

Hacienda se valida por fecha y antigüedad. ARESEP solo sustituye la simulación si configuraste distribuidora, tipo de tarifa y bloque exactos, el registro pertenece al mes/año actual y hay una sola coincidencia de energía kWh. Cargos fijos/demanda no se toman como precio kWh. Costos de filamento, desgaste y energía permanecen marcados DEMO hasta introducir valores del taller; el tipo de cambio oficial tampoco convierte en reales los demás costos.

## Probar

1. Importá los cinco workflows y asigná credenciales; guardá/publicá cada uno.
2. En Admin, abrí una solicitud y generá una cotización DEMO; verificá desglose/validez.
3. Usá **Enviar cotización** solo con direcciones reales. Confirmá la ejecución de n8n y el correo recibido tanto por el cliente como por la copia configurada del taller.
4. Para correo de prueba, usá el botón de prueba de Admin con una cotización DEMO y tu propia dirección real. La app lo identifica como prueba y no avanza el estado.
5. Antes de validar Gmail por primera vez, comprobá que Google OAuth admita tu cuenta de prueba. Las direcciones `example.*` se bloquean deliberadamente.

No ejecutes la prueba de correo con datos sensibles del cliente. La prueba automatizada local usa un Gmail simulado y no contacta servicios externos.
