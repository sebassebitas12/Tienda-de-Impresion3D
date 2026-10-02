# Vértice CR — un solo workflow n8n

## Qué importar

Importa **solo `vertice-cr-unificado.json`**. El archivo está en esta carpeta y también es el único workflow incluido en `automation/vertice-n8n-import.zip` junto con esta guía. En n8n: **Workflows → Import from File** y selecciona ese JSON. No importes por separado los archivos `vertice-assistant-*.json`, `vertice-rates.json` ni `vertice-quote-email.json`; son componentes internos usados para generar y verificar el workflow unificado.

El canvas trae cinco entradas Webhook dentro del mismo workflow: asistente general, asistente Admin, asistente de cotización, tasas y correo de cotización. Las tres entradas de IA pasan por una preparación de rol distinta y llegan a **un mismo nodo DeepSeek**. Tasas y Gmail conservan sus propias ramas, conectadas a sus respectivos Webhooks. Al activar este workflow se habilitan sus cinco rutas.

El JSON no incluye secretos ni permisos de cuentas. Tras importarlo, asigna las credenciales indicadas abajo en los nodos correspondientes. El workflow se importa inactivo; no lo publiques/actives hasta conectar las credenciales y poner las URLs correctas en el `.env` del backend.

## 1. Token compartido de Webhook

En n8n abre cada nodo **Entrada — asistente general**, **Entrada — asistente admin**, **Entrada — asistente quote**, **Entrada — tasas** y **Entrada — cotización por correo**. En la autenticación Header Auth, crea o selecciona la misma credencial en los cinco nodos:

- **Name:** `X-Vertice-Webhook-Token`
- **Value:** un secreto aleatorio propio

En la raíz del proyecto copia `.env.example` como `.env`. Genera un secreto nuevo en PowerShell desde la raíz del proyecto:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Pon ese mismo valor en `VERTICE_QUOTE_EMAIL_WEBHOOK_TOKEN` en `.env` y en la credencial Header Auth de n8n. No reutilices el valor de ejemplo ni guardes el secreto en Git, React, capturas o mensajes. Reinicia la API después de guardar `.env`.

## 2. DeepSeek para los tres asistentes

Abre el nodo **DeepSeek — orquestador compartido**. En **Credential for Header Auth**, crea o selecciona una credencial **Header Auth**:

- **Name:** `Authorization`
- **Value:** `Bearer TU_API_KEY`

Usa la API key de tu cuenta DeepSeek. Esta credencial queda en n8n y se usa para las tres entradas de asistente. El modelo configurado es `deepseek-flash`; si tu cuenta no lo ofrece, cambia el modelo por otro habilitado en tu cuenta.

## 3. Gmail para el correo de cotización

En la rama **Entrada — cotización por correo**, abre **Enviar correo al cliente + copia oculta**. En el selector de credenciales crea una credencial Gmail OAuth2, conecta la cuenta emisora y completa la autorización de Google. El destinatario de prueba debe ser una dirección tuya que puedas revisar. El nodo manda el mensaje al destinatario recibido y al taller en copia oculta; usa el botón de prueba de Admin para evitar contactar al cliente.

## 4. URLs del backend

En `.env`, configura cada variable con la URL de producción que muestra su nodo Webhook después de activar el workflow. Las rutas conservadas son:

| Variable | Ruta |
|---|---|
| `VERTICE_ASSISTANT_GENERAL_URL` | `/webhook/vertice-assistant-general` |
| `VERTICE_ASSISTANT_ADMIN_URL` | `/webhook/vertice-assistant-admin` |
| `VERTICE_ASSISTANT_QUOTE_URL` | `/webhook/vertice-assistant-quote` |
| `VERTICE_RATES_WEBHOOK_URL` | `/webhook/vertice-rates` |
| `VERTICE_QUOTE_EMAIL_WEBHOOK_URL` | `/webhook/vertice-quote-email` |

Los valores de `.env.example` apuntan a `localhost:5678`; solo sirven si n8n está escuchando en ese host y puerto. Si usas n8n Cloud u otra computadora, copia las URLs que muestra tu instancia. No uses una URL de prueba `/webhook-test/` en las variables del backend: el backend necesita que el workflow esté activo y su URL de producción disponible.

Los nodos Webhook requieren el mismo Header Auth que espera el backend. No compartas la URL pública con el token ni pongas secretos en el navegador.

## 5. Tasas y alcance de la cotización

El Webhook de tasas también usa la credencial Header Auth compartida. Hacienda y ARESEP son consultas públicas y no requieren API keys. ARESEP solo sustituye la tasa DEMO con una coincidencia exacta de distribuidora, tarifa, bloque kWh y mes. Material, desgaste y otros costos siguen siendo DEMO hasta calibrarlos con datos del taller; una tasa oficial no vuelve real el total de una cotización.

## 6. Prueba en orden

1. Importa el JSON unificado y asigna las tres credenciales anteriores.
2. Configura `.env`, revisa las cinco URLs y reinicia `npm run api`.
3. Activa/publica **el único workflow**. Las rutas de producción son las indicadas arriba.
4. Prueba los tres asistentes desde las áreas de la app que corresponden a cada rol. Revisa la ejecución del Webhook y del nodo DeepSeek en **Executions** de n8n.
5. En Admin abre una solicitud demo y calcula la cotización marcada DEMO.
6. Para probar Gmail, usa **Probar correo conmigo** con tu propia dirección. Esto envía un correo real a esa dirección, identificado como `[DEMO] [PRUEBA]`; no debe enviarse al cliente ni avanzar el estado.
7. Revisa el correo recibido y la ejecución de **Enviar correo al cliente + copia oculta**. Si la respuesta del proveedor falla, no repitas el envío hasta revisar la ejecución para evitar duplicados.

No uses información privada de clientes durante estas pruebas. Las pruebas automatizadas locales simulan DeepSeek/Gmail y no llaman servicios externos.
