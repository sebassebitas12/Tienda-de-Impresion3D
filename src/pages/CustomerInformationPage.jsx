import { Link } from 'react-router-dom';
import { usePreferences } from '../hooks/usePreferences.js';
import './customer-information.css';

const content = {
  es: {
    faq: {
      eyebrow: 'AYUDA · VÉRTICE CR', title: 'Respuestas para seguir con tu pieza.',
      intro: 'Lo importante antes de elegir un modelo, enviar una solicitud o consultar un pedido.',
      sections: [
        { title: 'Catálogo y materiales', items: [
          ['¿Las piezas están listas para entrega?', 'No. Este catálogo es parte de una demostración académica: permite recorrer el encargo, pero no confirma fabricación, disponibilidad ni fecha de entrega. Imágenes y precios son referenciales.'],
          ['¿Qué materiales trabajan?', 'El catálogo contempla FDM con PLA, PETG, ASA, ABS y TPU. La elección depende de la geometría y el uso; la guía es orientativa y no sustituye una revisión técnica.'],
        ] },
        { title: 'Solicitudes y cotizaciones', items: [
          ['¿Necesito tener un archivo 3D?', 'No. Podés enviar un STL u OBJ, agregar imágenes de referencia o empezar describiendo la idea para organizarla.'],
          ['¿Enviar una solicitud ya tiene precio?', 'No. Primero se revisa el alcance; una solicitud no es un pedido ni una cotización final. La propuesta aparece en tu cuenta para que la revisés.'],
          ['¿Cómo sigo el pedido?', 'Iniciá sesión con la cuenta usada para solicitar o encargar. En Mi cuenta aparecen las cotizaciones y pedidos asociados.'],
        ] },
        { title: 'Cuenta y pago académico', items: [
          ['¿Por qué debo iniciar sesión para ver el carrito?', 'La cuenta permite asociar el encargo a una persona y separar sus pedidos. La selección previa puede conservarse en ese navegador hasta iniciar sesión.'],
          ['¿El pago se realiza de verdad?', 'No se cobra dinero real en esta demo. PayPal Sandbox usa saldo de prueba. Un comprobante SINPE queda pendiente hasta que el taller revise manualmente los datos y la imagen adjunta.'],
        ] },
      ],
      actions: [['Catálogo de piezas', '/catalogo'], ['Enviar una solicitud', '/solicitud'], ['Ver mi cuenta', '/cuenta']],
    },
    materials: {
      eyebrow: 'GUÍA DE TALLER · FDM', title: 'Elegí el material con el uso en mente.',
      intro: 'Esta orientación ayuda a describir el proyecto. La geometría, el acabado y la disponibilidad se confirman para cada pieza.',
      sections: [
        { title: 'PLA', body: 'Una opción común para modelos, organizadores y piezas de uso general en interiores. No se debe asumir que sirve para calor, contacto alimentario o uso médico.' },
        { title: 'PETG', body: 'Puede ser útil cuando el proyecto necesita una pieza funcional de uso cotidiano. La forma, el montaje y el entorno real importan al definir si es adecuado.' },
        { title: 'ABS y ASA', body: 'Se consideran para piezas funcionales que requieren otras propiedades que PLA. La aplicación concreta y las condiciones de uso deben revisarse antes de elegir.' },
        { title: 'TPU', body: 'Filamento flexible para diseños que requieren cierta deformación. El nivel de flexibilidad depende también del diseño y de los parámetros de impresión.' },
      ],
      notice: 'Guía general: no es una certificación ni una garantía de resistencia, seguridad, temperatura o compatibilidad química. No se ofrecen aquí aplicaciones médicas, alimentarias o de protección certificada.',
      actions: [['Explorar modelos', '/catalogo'], ['Describir mi proyecto', '/solicitud/ayuda-diseno']],
    },
    requirements: {
      eyebrow: 'PREPARACIÓN · ARCHIVOS', title: 'Compartí solo lo necesario para revisar la pieza.',
      intro: 'Un archivo claro y unas pocas referencias ayudan al taller a entender qué querés fabricar.',
      sections: [
        { title: 'Archivos aceptados', body: 'Podés adjuntar hasta cinco archivos por solicitud: imágenes PNG, JPG, WebP o GIF, y modelos STL u OBJ. Cada archivo puede pesar hasta 5 MiB.' },
        { title: 'Medidas y uso', body: 'Indicá las dimensiones aproximadas y elegí mm, cm o pulgadas. Contá para qué se usará, cuántas unidades necesitás y si ya tenés un material en mente.' },
        { title: 'Qué ocurre después', body: 'El envío registra una solicitud pendiente. El taller revisa el archivo y el uso; la app no lamina ni mide automáticamente el modelo y todavía no existe una cotización hasta que se prepara y comparte.' },
      ],
      notice: 'No subas información sensible ni archivos que no tengas derecho a compartir. Si no conocés una medida, dejala como aproximada y explicalo en la descripción.',
      actions: [['Preparar una solicitud con archivo', '/solicitud/archivo'], ['Necesito ayuda con la idea', '/solicitud/ayuda-diseno']],
    },
    terms: {
      eyebrow: 'ALCANCE DEL PROTOTIPO', title: 'Antes de usar esta experiencia.',
      intro: 'Vértice CR es un proyecto académico en desarrollo. Esta página explica el alcance de la demostración; no reemplaza condiciones comerciales o asesoría legal.',
      sections: [
        { title: 'Cotizaciones y catálogo', body: 'Los precios, perfiles y estimaciones identificados como DEMO son orientativos. La disponibilidad, materiales, acabados, cargos y precio final requieren confirmación del taller antes de fabricar.' },
        { title: 'Pedidos y producción', body: 'Confirmar un encargo en esta versión no acredita un pago ni garantiza una fecha de entrega. Los estados representan el flujo de demostración y seguimiento del taller.' },
        { title: 'Pagos', body: 'No se cobra dinero real en esta demo. PayPal Sandbox usa saldo de prueba; los comprobantes SINPE son evidencia de demostración y requieren revisión manual del taller.' },
        { title: 'Uso responsable', body: 'El cliente debe compartir archivos que tenga derecho a utilizar. La fabricación depende de la revisión de viabilidad y del uso declarado.' },
      ],
      notice: 'Esta demostración no debe usarse para realizar una compra o un pago real.',
      actions: [['Preguntas frecuentes', '/faq'], ['Contactar el flujo correcto', '/contacto']],
    },
    privacy: {
      eyebrow: 'DATOS · PROTOTIPO ACADÉMICO', title: 'Qué pasa con la información que compartís.',
      intro: 'Esta versión demuestra formularios, cuentas y seguimiento con servicios académicos locales y flujos de automatización configurados para pruebas.',
      sections: [
        { title: 'Datos de cuenta y solicitudes', body: 'El proyecto puede guardar datos de cuenta, cotización y pedido en su servicio académico para mostrar los recorridos. Los archivos adjuntos se reciben mediante el almacenamiento privado local del proyecto.' },
        { title: 'Asistentes', body: 'Cuando usás una función de IA, el texto que enviás puede pasar por el workflow configurado en n8n y el proveedor de modelo conectado. No incluyas contraseñas, datos bancarios ni información sensible.' },
        { title: 'Límites de esta versión', body: 'Esta demostración no ofrece controles de producción para exportar, eliminar o administrar formalmente tus datos. No la uses para información personal o confidencial real.' },
      ],
      notice: 'No ingreses credenciales bancarias ni datos de tarjeta. El token de sesión de esta entrega es académico y no equivale a seguridad de producción.',
      actions: [['Ver el alcance del taller', '/nosotros'], ['Consultar el proceso', '/faq']],
    },
    shipping: {
      eyebrow: 'ENTREGA · CONFIRMACIÓN PREVIA', title: 'La entrega se acuerda para cada pedido.',
      intro: 'El prototipo todavía no tiene tarifas, zonas, transportista ni plazos de entrega configurados.',
      sections: [
        { title: 'Antes de confirmar', body: 'El costo y la forma de entrega no deben darse por incluidos o gratuitos. El taller debe confirmar esas condiciones junto con el alcance y el monto final.' },
        { title: 'Seguimiento', body: 'Cuando el taller registra avances, el estado del pedido se consulta en Mi cuenta. Los estados reflejan únicamente las actualizaciones guardadas por el taller.' },
        { title: 'Recogida o envío', body: 'Esta versión no permite seleccionar ni pagar una opción de envío. La modalidad debe acordarse antes de aceptar una cotización o coordinar la fabricación.' },
      ],
      notice: 'No se prometen fechas ni cobertura hasta que el taller confirme el destino y la modalidad.',
      actions: [['Contactar sobre mi proyecto', '/contacto'], ['Ver mi seguimiento', '/cuenta']],
    },
  },
  en: {
    faq: {
      eyebrow: 'HELP · VÉRTICE CR', title: 'Answers to help you move your part forward.',
      intro: 'What to know before choosing a model, sending a request or checking an order.',
      sections: [
        { title: 'Catalog and materials', items: [
          ['Are catalog parts ready to ship?', 'No. This catalog is part of an academic demo: you can explore the order flow, but it does not confirm real production, availability or delivery dates. Images and prices are illustrative.'],
          ['Which materials are supported?', 'The catalog covers FDM with PLA, PETG, ASA, ABS and TPU. Choice depends on geometry and use; this guide is general and does not replace technical review.'],
        ] },
        { title: 'Requests and quotes', items: [
          ['Do I need a 3D file?', 'No. You can attach an STL or OBJ, add reference images, or start by describing the idea.'],
          ['Does a request include a price?', 'No. The scope is reviewed first; a request is not an order or a final quote. A proposal appears in your account for review.'],
          ['How do I track my order?', 'Sign in with the account used to request or order. Related quotes and orders appear in My account.'],
        ] },
        { title: 'Account and academic payment', items: [
          ['Why sign in to open the cart?', 'An account associates an order with a customer. A selection may remain in that browser until you sign in.'],
          ['Is the payment real?', 'No real money is charged in this demo. PayPal Sandbox uses test funds. A SINPE proof remains pending until a workshop admin manually reviews the submitted details and proof image.'],
        ] },
      ],
      actions: [['Parts catalog', '/catalogo'], ['Send a request', '/solicitud'], ['My account', '/cuenta']],
    },
    materials: {
      eyebrow: 'WORKSHOP GUIDE · FDM', title: 'Choose a material with its intended use in mind.',
      intro: 'This guide helps describe a project. Geometry, finish and availability are confirmed for each part.',
      sections: [
        { title: 'PLA', body: 'A common option for models, organizers and general indoor parts. Do not assume suitability for heat, food contact or medical use.' },
        { title: 'PETG', body: 'It may suit a functional everyday part. The shape, assembly and actual environment matter when deciding.' },
        { title: 'ABS and ASA', body: 'Considered for functional parts that need different properties than PLA. The specific application and conditions should be reviewed first.' },
        { title: 'TPU', body: 'A flexible filament for designs that need some deformation. Flexibility also depends on geometry and print settings.' },
      ],
      notice: 'General guidance only: not a certification or guarantee of strength, safety, temperature or chemical compatibility. Medical, food-contact and certified protective applications are not offered here.',
      actions: [['Explore models', '/catalogo'], ['Describe a project', '/solicitud/ayuda-diseno']],
    },
    requirements: {
      eyebrow: 'PREPARATION · FILES', title: 'Share only what is needed to review the part.',
      intro: 'A clear model and a few references help the workshop understand what you want made.',
      sections: [
        { title: 'Accepted files', body: 'Attach up to five files per request: PNG, JPG, WebP or GIF images, and STL or OBJ models. Each file can be up to 5 MiB.' },
        { title: 'Dimensions and use', body: 'Provide approximate dimensions and choose mm, cm or inches. Explain the intended use, quantity and any preferred material.' },
        { title: 'What happens next', body: 'Submission creates a pending request. The workshop reviews the file and use; the app does not slice or automatically measure the model, and no quote exists until one is prepared and shared.' },
      ],
      notice: 'Do not upload sensitive information or files you do not have the right to share. If you are unsure about a dimension, mark it as approximate.',
      actions: [['Prepare a file request', '/solicitud/archivo'], ['Get help with an idea', '/solicitud/ayuda-diseno']],
    },
    terms: {
      eyebrow: 'PROTOTYPE SCOPE', title: 'Before using this experience.',
      intro: 'Vértice CR is an academic project in development. This page explains the demonstration scope; it is not a commercial agreement or legal advice.',
      sections: [
        { title: 'Quotes and catalog', body: 'Prices, profiles and estimates marked DEMO are illustrative. Availability, materials, finish, charges and final price require workshop confirmation before production.' },
        { title: 'Orders and production', body: 'Confirming an order in this version does not record payment or guarantee a delivery date. Statuses represent a workshop tracking demonstration.' },
        { title: 'Payments', body: 'Payment is simulated in the academic database to complete the flow and issue a DEMO receipt. It is not connected to banks, does not charge money and does not request real payment details.' },
        { title: 'Responsible use', body: 'Customers should share files they are entitled to use. Production depends on feasibility review and the stated intended use.' },
      ],
      notice: 'Do not use this demonstration to make a real purchase or payment.',
      actions: [['Frequently asked questions', '/faq'], ['Find the right contact path', '/contacto']],
    },
    privacy: {
      eyebrow: 'DATA · ACADEMIC PROTOTYPE', title: 'What happens to information you share.',
      intro: 'This version demonstrates forms, accounts and tracking with local academic services and automation workflows configured for testing.',
      sections: [
        { title: 'Account and request data', body: 'The project may store account, quote and order data in its academic service to demonstrate flows. Attachments are received through the project’s local private storage.' },
        { title: 'Assistants', body: 'When using an AI feature, your message may pass through the configured n8n workflow and connected model provider. Do not include passwords, banking information or sensitive data.' },
        { title: 'Limits of this version', body: 'This demonstration does not provide production controls for exporting, deleting or formally managing your data. Do not use it for real confidential information.' },
      ],
      notice: 'Do not enter banking credentials or card details. This delivery uses an academic session token, not production security.',
      actions: [['About the workshop', '/nosotros'], ['Understand the process', '/faq']],
    },
    shipping: {
      eyebrow: 'DELIVERY · CONFIRM FIRST', title: 'Delivery is agreed for each order.',
      intro: 'The prototype does not yet configure rates, delivery areas, carriers or delivery times.',
      sections: [
        { title: 'Before confirming', body: 'Cost and delivery method should not be assumed included or free. The workshop must confirm them along with scope and final amount.' },
        { title: 'Tracking', body: 'When the workshop records progress, check the order status in My account. Statuses only reflect updates saved by the workshop.' },
        { title: 'Pickup or shipping', body: 'This version cannot select or pay for a delivery option. The method must be agreed before accepting a quote or coordinating production.' },
      ],
      notice: 'No delivery dates or coverage are promised until the workshop confirms destination and method.',
      actions: [['Ask about a project', '/contacto'], ['View my order', '/cuenta']],
    },
  },
};

export function CustomerInformationPage({ pageKey }) {
  const { language } = usePreferences();
  const copy = content[language === 'en' ? 'en' : 'es'][pageKey];
  if (!copy) return null;

  return <article className={`customer-info-page customer-info-page--${pageKey}`}>
    <header className="customer-info-page__header">
      <span className="v-mono-label">{copy.eyebrow}</span>
      <h1>{copy.title}</h1>
      <p>{copy.intro}</p>
    </header>
    <div className="customer-info-page__sections">
      {copy.sections.map((section, index) => <section key={section.title} aria-labelledby={`info-${pageKey}-${index}`}>
        <h2 id={`info-${pageKey}-${index}`}>{section.title}</h2>
        {section.items ? <div className="customer-info-page__questions">
          {section.items.map(([question, answer]) => <details key={question}>
            <summary>{question}</summary><p>{answer}</p>
          </details>)}
        </div> : <p>{section.body}</p>}
      </section>)}
    </div>
    <aside className="customer-info-page__notice" role="note">{copy.notice}</aside>
    <nav className="customer-info-page__actions" aria-label={language === 'en' ? 'Next steps' : 'Siguientes pasos'}>
      {copy.actions.map(([label, href], index) => <Link key={href} className={index === 0 ? 'v-button v-button--primary v-button--pill' : 'v-link-text'} to={href}>{label} <span aria-hidden="true">↗</span></Link>)}
    </nav>
  </article>;
}
