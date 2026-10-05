import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import './institutional.css';

const content = {
  es: {
    eyebrow: 'CONTACTO · VÉRTICE CR',
    title: 'Contanos qué necesitás fabricar.',
    intro: 'Piezas de catálogo, modelos propios o una idea todavía en desarrollo: te guiamos hacia el recorrido correcto.',
    startLabel: 'ELEGÍ TU PUNTO DE PARTIDA',
    startTitle: '¿En qué etapa está tu proyecto?',
    fileTag: 'PIEZA O ARCHIVO',
    fileTitle: 'Ya tengo el modelo',
    fileBody: 'Adjuntá un STL, OBJ o imágenes de referencia y contanos para qué se usará la pieza.',
    fileAction: 'Enviar para revisión',
    fileHint: 'El taller revisa el archivo antes de preparar una cotización.',
    ideaTag: 'IDEA POR DEFINIR',
    ideaTitle: 'Quiero darle forma',
    ideaBody: 'Describí lo que necesitás. La asistencia te ayuda a ordenar el resumen antes de que lo revises y lo envíes.',
    ideaAction: 'Organizar mi idea',
    ideaHint: 'Podés empezar aunque todavía te falten medidas o detalles.',
    accountTag: 'SEGUIMIENTO',
    accountTitle: 'Ya envié una solicitud o hice un encargo',
    accountBody: 'Consultá cotizaciones, decisiones pendientes y pedidos en el espacio de tu cuenta.',
    adminTitle: 'Gestionás el taller',
    adminBody: 'Revisá las solicitudes y los pedidos que esperan tu acción.',
    accountAction: 'Ir a mi cuenta',
    adminAction: 'Ir a Administración',
    processLabel: 'DESPUÉS DEL ENVÍO',
    processTitle: 'Sabés qué ocurre en cada paso.',
    process: [
      ['Preparás la solicitud', 'Compartís el archivo o describís la idea y confirmás los datos que sí conocés.'],
      ['El taller la revisa', 'Revisamos el archivo y los datos enviados; la solicitud no inicia la fabricación.'],
      ['La decisión queda en tu cuenta', 'Cuando hay una cotización, podés revisar su alcance y decidir desde la app.'],
    ],
    boundary: 'Enviar una solicitud no genera un precio final ni inicia la fabricación. La cotización depende de la revisión del taller; la asistencia ayuda a ordenar información, pero no envía nada por su cuenta.',
    helpTitle: '¿Todavía no sabés por dónde empezar?',
    helpBody: 'Preguntale al asistente general sobre materiales, archivos o el proceso. Para que el taller reciba una solicitud, después tendrás que revisar y enviarla desde el formulario.',
    assistantAction: 'Consultar al asistente',
    helpLabel: 'ASISTENCIA',
    faqTitle: 'Dudas comunes',
    faq: [
      ['¿Necesito tener un archivo 3D?', 'No. Si ya tenés un modelo, podés adjuntarlo. Si solo tenés una idea, usá la ruta para organizarla con asistencia.'],
      ['¿Recibo un precio al enviar?', 'No automáticamente. Primero se registra una solicitud y el taller revisa la pieza y el alcance; una cotización formal se comparte después desde tu cuenta.'],
      ['¿Cómo consulto el avance?', 'Iniciá sesión con la cuenta con la que enviaste la solicitud. Ahí verás las cotizaciones y los pedidos asociados.'],
    ],
    accountGuest: 'Para consultar el seguimiento, iniciá sesión; después volverás a tu cuenta.',
  },
  en: {
    eyebrow: 'CONTACT · VÉRTICE CR',
    title: 'Tell us what you need made.',
    intro: 'Catalog parts, your own model, or an idea still taking shape—we’ll point you to the right next step.',
    startLabel: 'CHOOSE WHERE TO START',
    startTitle: 'What stage is your project at?',
    fileTag: 'PART OR FILE',
    fileTitle: 'I already have a model',
    fileBody: 'Attach an STL, OBJ or reference images and tell us what the part will be used for.',
    fileAction: 'Send for review',
    fileHint: 'The workshop reviews the file before preparing a quote.',
    ideaTag: 'IDEA TO DEVELOP',
    ideaTitle: 'I want to shape an idea',
    ideaBody: 'Describe what you need. The assistant helps organize a summary for you to review and submit.',
    ideaAction: 'Organize my idea',
    ideaHint: 'You can start before every dimension or detail is known.',
    accountTag: 'TRACKING',
    accountTitle: 'I sent a request or placed an order',
    accountBody: 'Check quotes, pending decisions and orders in your account space.',
    adminTitle: 'You manage the workshop',
    adminBody: 'Review requests and orders waiting for your action.',
    accountAction: 'Go to my account',
    adminAction: 'Go to Administration',
    processLabel: 'AFTER SUBMISSION',
    processTitle: 'Know what happens at each step.',
    process: [
      ['Prepare your request', 'Share a file or describe the idea, then confirm the details you know.'],
      ['The workshop reviews it', 'We review the file and submitted details; the request does not start production.'],
      ['Your decision stays in your account', 'When a quote is available, review its scope and decide in the app.'],
    ],
    boundary: 'Submitting a request does not create a final price or start production. A quote depends on workshop review; the assistant helps organize information but does not submit anything on its own.',
    helpTitle: 'Not sure where to start?',
    helpBody: 'Ask the general assistant about materials, files or the process. To send a request to the workshop, review and submit it from the form afterward.',
    assistantAction: 'Ask the assistant',
    helpLabel: 'HELP',
    faqTitle: 'Common questions',
    faq: [
      ['Do I need a 3D file?', 'No. Attach a model if you have one. If you only have an idea, use the guided path to organize it.'],
      ['Will I receive a price when I submit?', 'Not automatically. A request is recorded first, then the workshop reviews the part and scope. A formal quote is shared through your account afterward.'],
      ['How do I track progress?', 'Sign in with the account used to submit the request. Quotes and related orders appear there.'],
    ],
    accountGuest: 'Sign in to track your request; you will return to your account afterward.',
  },
};

export function ContactPage() {
  const { language } = usePreferences();
  const { user } = useAuth();
  const { openGeneralAssistant } = useOutletContext() || {};
  const copy = content[language === 'en' ? 'en' : 'es'];
  const isAdmin = user?.role === 'admin';
  const accountPath = isAdmin ? '/admin' : user?.role === 'customer' ? '/cuenta' : '/login';
  const accountState = user ? undefined : { state: { from: '/cuenta' } };

  return <article className="institutional-page contact-page">
    <header className="contact-hero">
      <div className="contact-hero__copy">
        <span className="v-mono-label">{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        <p className="institutional-hero__lead">{copy.intro}</p>
      </div>
      <aside className="contact-hero__process" aria-label={copy.processTitle}>
        <span className="v-mono-label">{copy.processLabel}</span>
        <h2>{copy.processTitle}</h2>
        <ol>{copy.process.map(([title, description]) => <li key={title}><span aria-hidden="true" /><div><strong>{title}</strong><p>{description}</p></div></li>)}</ol>
      </aside>
    </header>

    <section className="contact-start" aria-labelledby="contact-start-title">
      <div className="contact-section-heading">
        <span className="v-mono-label">{copy.startLabel}</span>
        <h2 id="contact-start-title">{copy.startTitle}</h2>
      </div>
      <div className="contact-options">
        <section className="contact-option contact-option--file">
          <span className="v-mono-label">{copy.fileTag}</span>
          <h3>{copy.fileTitle}</h3>
          <p>{copy.fileBody}</p>
          <p className="contact-option__hint">{copy.fileHint}</p>
          <Link className="v-button v-button--primary v-button--pill" to="/solicitud/archivo">{copy.fileAction}<span aria-hidden="true">↗</span></Link>
        </section>
        <section className="contact-option contact-option--idea">
          <span className="v-mono-label">{copy.ideaTag}</span>
          <h3>{copy.ideaTitle}</h3>
          <p>{copy.ideaBody}</p>
          <p className="contact-option__hint">{copy.ideaHint}</p>
          <Link className="v-link-text" to="/solicitud/ayuda-diseno">{copy.ideaAction}<span aria-hidden="true">↗</span></Link>
        </section>
        <section className="contact-option contact-option--account">
          <span className="v-mono-label">{copy.accountTag}</span>
          <div><h3>{isAdmin ? copy.adminTitle : copy.accountTitle}</h3><p>{isAdmin ? copy.adminBody : copy.accountBody}</p>{!user && <small>{copy.accountGuest}</small>}</div>
          <Link className="v-link-text" to={accountPath} {...accountState}>{isAdmin ? copy.adminAction : copy.accountAction}<span aria-hidden="true">↗</span></Link>
        </section>
      </div>
    </section>

    <aside className="contact-help">
      <div><span className="v-mono-label">{copy.helpLabel}</span><h2>{copy.helpTitle}</h2><p>{copy.helpBody}</p></div>
      {openGeneralAssistant && <button className="v-button v-button--secondary v-button--pill" type="button" onClick={openGeneralAssistant}>{copy.assistantAction}<span aria-hidden="true">↗</span></button>}
    </aside>

    <section className="contact-faq" aria-labelledby="contact-faq-title">
      <h2 id="contact-faq-title">{copy.faqTitle}</h2>
      <div>{copy.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>

    <p className="contact-boundary">{copy.boundary}</p>
  </article>;
}
