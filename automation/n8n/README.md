# Vértice CR — un solo workflow n8n

## Qué importar

Importa **solo `vertice-cr-unificado.json`**. En n8n: **Workflows → Import from File** y selecciona ese JSON. No importes por separado los archivos `vertice-assistant-*.json`, `vertice-rates.json` ni `vertice-quote-email.json`; son componentes internos usados para generar y verificar el workflow unificado.

El canvas trae seis entradas Webhook: tres asistentes, tasas, correo de cotización y recibo de pago. Los Agents tienen contextos y herramientas por rol; comparten la credencial del modelo, no un único Agent. Tasas y Gmail son ramas deterministas: el agente no decide destinatarios ni envíos. La API autoriza las herramientas mediante capacidades temporales; el JWT académico no se entrega a n8n y los cambios CRUD requieren confirmación Admin.

El JSON no incluye secretos ni permisos de cuentas. Tras importarlo, asigna las credenciales indicadas abajo en los nodos correspondientes. El workflow se importa inactivo; no lo publiques/actives hasta conectar las credenciales y poner las URLs correctas en el `.env` del backend.

## 1. Token compartido de Webhook

Asigna Header Auth en las seis entradas, incluida **Entrada — recibo de pago**. Usa la misma credencial salvo que configures el override de pago descrito abajo:

- **Name:** `X-Vertice-Webhook-Token`
- **Value:** un secreto aleatorio propio

En la raíz del proyecto copia `.env.example` como `.env`. Genera un secreto nuevo en PowerShell desde la raíz del proyecto:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Pon ese mismo valor en `VERTICE_QUOTE_EMAIL_WEBHOOK_TOKEN` en `.env` y en la credencial Header Auth de n8n. No reutilices el valor de ejemplo ni guardes el secreto en Git, React, capturas o mensajes. Reinicia la API después de guardar `.env`.

## 2. DeepSeek para los tres asistentes

Abre el nodo **DeepSeek Chat Model** y selecciona la credencial DeepSeek que ya configuraste en n8n. Los tres Agents comparten esta credencial. El modelo incluido actualmente es `deepseek-flash`; seleccioná un modelo compatible disponible en tu cuenta. El agente de cotización tiene un máximo de dos iteraciones para evitar ciclos de entrevista; general y Admin conservan cuatro. No pegues la API key en este README, el repo, React ni `.env`.

## 3. Gmail para el correo de cotización

En la rama **Entrada — cotización por correo**, abre **Enviar correo al cliente + copia oculta**. En el selector de credenciales crea una credencial Gmail OAuth2, conecta la cuenta emisora y completa la autorización de Google. El destinatario de prueba debe ser una dirección tuya que puedas revisar. El nodo manda el mensaje al destinatario recibido y al taller en copia oculta. El envío se realiza al solicitarlo expresamente desde el flujo de cotización.

## 4. URLs del backend

En `.env`, configura cada variable con la URL de producción que muestra su nodo Webhook después de activar el workflow. Las rutas conservadas son:

| Variable | Ruta |
|---|---|
| `VERTICE_ASSISTANT_GENERAL_URL` | `/webhook/vertice-assistant-general` |
| `VERTICE_ASSISTANT_ADMIN_URL` | `/webhook/vertice-assistant-admin` |
| `VERTICE_ASSISTANT_QUOTE_URL` | `/webhook/vertice-assistant-quote` |
| `VERTICE_ASSISTANT_TOOLS_URL` | `/assistants/tools` (callback desde n8n hacia la API Vértice) |
| `VERTICE_RATES_WEBHOOK_URL` | `/webhook/vertice-rates` |
| `VERTICE_QUOTE_EMAIL_WEBHOOK_URL` | `/webhook/vertice-quote-email` |
| `VERTICE_PAYMENT_EMAIL_WEBHOOK_URL` | `/webhook/vertice-payment-email` |

Los valores de `.env.example` apuntan a `localhost:5678`; solo sirven si n8n está escuchando en ese host y puerto. Si usas n8n Cloud u otra computadora, copia las URLs que muestra tu instancia. No uses una URL de prueba `/webhook-test/` en las variables del backend: el backend necesita que el workflow esté activo y su URL de producción disponible.

Selecciona Gmail OAuth también en el segundo nodo Gmail (recibo de pago).
`VERTICE_WORKSHOP_EMAIL` fija la copia BCC del taller; el cliente proviene de la
orden en DB. El recibo comparte `VERTICE_QUOTE_EMAIL_WEBHOOK_TOKEN` por defecto;
`VERTICE_PAYMENT_EMAIL_WEBHOOK_TOKEN` permite una credencial distinta.
La API registra el intento antes del envío y exige acuse con orderId,
deliveryKey y messageId. `UNKNOWN` no se reintenta ciegamente. Importar/publicar
no prueba entrega: las verificaciones automatizadas usan Gmail mock.

Los nodos Webhook requieren el mismo Header Auth que espera el backend. La URL de `VERTICE_ASSISTANT_TOOLS_URL` debe ser alcanzable **desde el entorno de n8n**: si n8n corre en Docker Desktop y la API en Windows, prueba `http://host.docker.internal:3000/assistants/tools`; si ambos corren en el mismo host fuera de Docker, `http://localhost:3000/assistants/tools` puede servir. El API de demo se enlaza a `localhost` por defecto. No abras todo JSON Server/API a Internet para resolver conectividad; en n8n Cloud o redes separadas usa una URL accesible con TLS que exponga solo el callback autorizado, o prueba n8n local junto a la API. No compartas la URL pública con el token ni pongas secretos en el navegador.

## 5. Tasas y alcance de la cotización

El Webhook de tasas también usa la credencial Header Auth compartida. Hacienda y ARESEP son consultas públicas y no requieren API keys. ARESEP solo sustituye la tasa DEMO con una coincidencia exacta de distribuidora, tarifa, bloque kWh y mes. Material, desgaste y otros costos siguen siendo DEMO hasta calibrarlos con datos del taller; una tasa oficial no vuelve real el total de una cotización.

## 6. Prueba en orden

1. Importa el JSON unificado y asigna las tres credenciales anteriores.
2. Configura `.env`, revisa las cinco URLs y reinicia `npm run api`.
3. Activa/publica **el único workflow**. Las rutas de producción son las indicadas arriba.
4. Prueba los tres asistentes desde las áreas de la app que corresponden a cada rol. Revisa la ejecución del Webhook y del nodo DeepSeek Chat Model en **Executions** de n8n.
5. En Admin abre una solicitud demo y calcula la cotización marcada DEMO.
6. Revisá destinatario y cotización antes de autorizar un envío real. No hay un botón de prueba de correo disponible en esta versión.
7. Revisa el correo recibido y la ejecución de **Enviar correo al cliente + copia oculta**. Si la respuesta del proveedor falla, no repitas el envío hasta revisar la ejecución para evitar duplicados.

No uses información privada de clientes durante estas pruebas. Las pruebas automatizadas locales simulan DeepSeek/Gmail y no llaman servicios externos.
