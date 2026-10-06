import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import './institutional.css';

const content = {
  es: {
    eyebrow: 'CONTACTO · VÉRTICE CR',
    title: 'Contanos qué necesitás fabricar.',
    intro: 'Canales directos del taller, atención técnica de proyectos e inicio de solicitudes de manufactura aditiva.',

    // Canales directos
    channelsLabel: 'CANALES DIRECTOS · TALLER VÉRTICE',
    channelsTitle: 'Atención rápida y canales oficiales',
    whatsappTitle: 'WhatsApp del Taller',
    whatsappBadge: 'Atención rápida · DEMO',
    whatsappNumber: '+506 8888-8888',
    whatsappDesc: 'Consultas de cotización, fotos de piezas y orientación rápida con el taller.',
    whatsappAction: 'Abrir WhatsApp (Demo)',
    phoneTitle: 'Teléfono de Taller',
    phoneBadge: 'Llamada directa · DEMO',
    phoneNumber: '+506 2550-0000',
    phoneDesc: 'Coordinación técnica de proyectos urgentes o retiro de pedidos listos.',
    phoneAction: 'Llamar al taller',
    emailTitle: 'Correo Institucional',
    emailBadge: 'Planos y archivos técnicos',
    emailAddress: 'taller@verticecr.com',
    emailDesc: 'Para planos detallados, compras corporativas o requerimientos formales.',
    emailAction: 'Enviar correo',
    locationTitle: 'Ubicación y Horario',
    locationBadge: 'Cartago / San José, Costa Rica',
    locationSchedule: 'Lunes a Viernes: 8:00 AM – 6:00 PM · Sáb: 9:00 AM – 1:00 PM',
    locationDesc: 'Taller de manufactura aditiva. Retiro presencial de piezas previa cita.',

    // Formulario directo
    formLabel: 'FORMULARIO DIRECTO',
    formTitle: 'Envianos un mensaje directo',
    formIntro: 'Si tenés una consulta puntual sobre tolerancias, materiales o pedidos, dejanos tu mensaje y te responderemos en horario de taller.',
    formName: 'Nombre completo',
    formEmail: 'Correo electrónico',
    formPhone: 'Teléfono o WhatsApp (opcional)',
    formSubject: 'Motivo de consulta',
    formSubjectOptions: [
      ['materials', 'Duda técnica sobre materiales o tolerancias'],
      ['order_status', 'Consulta sobre un pedido o cotización activa'],
      ['volume', 'Manufactura por volumen o proyectos empresariales'],
      ['other', 'Otra consulta general del taller'],
    ],
    formMessage: 'Mensaje o descripción de la consulta',
    formMessagePlaceholder: 'Describí brevemente tu consulta o requerimiento…',
    formSubmit: 'Enviar mensaje al taller',
    formRequired: 'Por favor completá los campos obligatorios (nombre, correo y mensaje).',
    formSuccessTitle: 'Mensaje recibido en el taller (Modo Demo)',
    formSuccessBody: 'Registramos tu consulta. Un especialista del taller te contactará a tu correo en menos de 24 horas hábiles.',

    // Puntos de partida
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

    // Proceso
    processLabel: 'DESPUÉS DEL ENVÍO',
    processTitle: 'Sabés qué ocurre en cada paso.',
    process: [
      ['Preparás la solicitud', 'Compartís el archivo o describís la idea y confirmás los datos que sí conocés.'],
      ['El taller la revisa', 'Revisamos el archivo y los datos enviados; la solicitud no inicia la fabricación.'],
      ['La decisión queda en tu cuenta', 'Cuando hay una cotización, podés revisar su alcance y decidir desde la app.'],
    ],
    boundary: 'Enviar una solicitud no genera un precio final ni inicia la fabricación. La cotización depende de la revisión del taller; la asistencia ayuda a ordenar información, pero no envía nada por su cuenta.',

    // Asistencia y FAQ
    helpTitle: '¿Todavía no sabés por dónde empezar?',
    helpBody: 'Preguntale al asistente general sobre materiales, archivos o el proceso. Para que el taller reciba una solicitud, después tendrás que revisar y enviarla desde el formulario.',
    assistantAction: 'Consultar al asistente',
    helpLabel: 'ASISTENCIA',
    faqTitle: 'Dudas comunes',
    faq: [
      ['¿Necesito tener un archivo 3D?', 'No. Si ya tenés un modelo, podés adjuntarlo. Si solo tenés una idea, usá la ruta para organizarla con asistencia.'],
      ['¿Recibo un precio al enviar?', 'No automáticamente. Primero se registra una solicitud y el taller revisa la pieza y el alcance; una cotización formal se comparte después desde tu cuenta.'],
      ['¿Cómo consulto el avance?', 'Iniciá sesión con la cuenta con la que enviaste la solicitud. Ahí verás las cotizaciones y los pedidos asociados.'],
      ['¿Hacen envíos a todo Costa Rica?', 'Sí, realizamos envíos a las 7 provincias mediante Correos de Costa Rica y mensajería directa en la GAM, o podés coordinar el retiro presencial en el taller.'],
      ['¿Puedo consultar por WhatsApp antes de solicitar?', 'Sí, nuestro canal de WhatsApp demo (+506 8888-8888) está disponible para orientarte sobre viabilidad técnica y materiales antes de ingresar el archivo.'],
    ],
    accountGuest: 'Para consultar el seguimiento, iniciá sesión; después volverás a tu cuenta.',
  },
  en: {
    eyebrow: 'CONTACT · VÉRTICE CR',
    title: 'Tell us what you need made.',
    intro: 'Direct workshop channels, project technical assistance, and additive manufacturing intake.',

    // Direct channels
    channelsLabel: 'DIRECT CHANNELS · VÉRTICE WORKSHOP',
    channelsTitle: 'Quick assistance and official channels',
    whatsappTitle: 'Workshop WhatsApp',
    whatsappBadge: 'Quick support · DEMO',
    whatsappNumber: '+506 8888-8888',
    whatsappDesc: 'Quick quote questions, reference photos and direct communication with the workshop.',
    whatsappAction: 'Open WhatsApp (Demo)',
    phoneTitle: 'Workshop Phone',
    phoneBadge: 'Direct call · DEMO',
    phoneNumber: '+506 2550-0000',
    phoneDesc: 'Technical coordination for urgent projects or pickup verification.',
    phoneAction: 'Call workshop',
    emailTitle: 'Workshop Email',
    emailBadge: 'Drawings & technical files',
    emailAddress: 'taller@verticecr.com',
    emailDesc: 'For CAD drawings, formal requests, and corporate orders.',
    emailAction: 'Send email',
    locationTitle: 'Location & Hours',
    locationBadge: 'Cartago / San José, Costa Rica',
    locationSchedule: 'Monday to Friday: 8:00 AM – 6:00 PM · Saturday: 9:00 AM – 1:00 PM',
    locationDesc: 'Additive manufacturing workshop. In-person pickup available upon appointment.',

    // Direct form
    formLabel: 'DIRECT FORM',
    formTitle: 'Send a direct message',
    formIntro: 'If you have a technical question or collaboration proposal, leave your message and we will respond during workshop hours.',
    formName: 'Full name',
    formEmail: 'Email address',
    formPhone: 'Phone or WhatsApp (optional)',
    formSubject: 'Inquiry reason',
    formSubjectOptions: [
      ['materials', 'Technical question about materials or tolerances'],
      ['order_status', 'Status of an existing order or quote'],
      ['volume', 'Volume manufacturing or corporate projects'],
      ['other', 'Other general inquiry'],
    ],
    formMessage: 'Message or inquiry details',
    formMessagePlaceholder: 'Briefly describe your question or requirement…',
    formSubmit: 'Send message to workshop',
    formRequired: 'Please complete the required fields (name, email, and message).',
    formSuccessTitle: 'Message received at the workshop (Demo mode)',
    formSuccessBody: 'We recorded your message. A workshop specialist will reply to your email within 24 business hours.',

    // Starting points
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

    // Process
    processLabel: 'AFTER SUBMISSION',
    processTitle: 'Know what happens at each step.',
    process: [
      ['Prepare your request', 'Share a file or describe the idea, then confirm the details you know.'],
      ['The workshop reviews it', 'We review the file and submitted details; the request does not start production.'],
      ['Your decision stays in your account', 'When a quote is available, review its scope and decide in the app.'],
    ],
    boundary: 'Submitting a request does not create a final price or start production. A quote depends on workshop review; the assistant helps organize information but does not submit anything on its own.',

    // Help and FAQ
    helpTitle: 'Not sure where to start?',
    helpBody: 'Ask the general assistant about materials, files or the process. To send a request to the workshop, review and submit it from the form afterward.',
    assistantAction: 'Ask the assistant',
    helpLabel: 'HELP',
    faqTitle: 'Common questions',
    faq: [
      ['Do I need a 3D file?', 'No. Attach a model if you have one. If you only have an idea, use the guided path to organize it.'],
      ['Will I receive a price when I submit?', 'Not automatically. A request is recorded first, then the workshop reviews the part and scope. A formal quote is shared through your account afterward.'],
      ['How do I track progress?', 'Sign in with the account used to submit the request. Quotes and related orders appear there.'],
      ['Do you ship throughout Costa Rica?', 'Yes, we ship to all 7 provinces via Correos de Costa Rica and courier service in the GAM, or you can pick up parts at the workshop.'],
      ['Can I ask on WhatsApp before submitting?', 'Yes, our demo WhatsApp line (+506 8888-8888) is available for technical viability questions and material guidance.'],
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

  const [formState, setFormState] = useState({ name: '', email: '', phone: '', subject: 'materials', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setFormError(copy.formRequired);
      return;
    }
    setFormError('');
    setSubmitted(true);
    setFormState({ name: '', email: '', phone: '', subject: 'materials', message: '' });
  };

  return (
    <article className="institutional-page contact-page">
      <header className="contact-hero">
        <div className="contact-hero__copy">
          <span className="v-mono-label">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p className="institutional-hero__lead">{copy.intro}</p>
        </div>
        <aside className="contact-hero__process" aria-label={copy.processTitle}>
          <span className="v-mono-label">{copy.processLabel}</span>
          <h2>{copy.processTitle}</h2>
          <ol>
            {copy.process.map(([title, description]) => (
              <li key={title}>
                <span aria-hidden="true" />
                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </header>

      {/* Canales Directos de Contacto (WhatsApp, Teléfono, Correo, Taller) */}
      <section className="contact-channels" aria-labelledby="contact-channels-title">
        <div className="contact-section-heading">
          <span className="v-mono-label">{copy.channelsLabel}</span>
          <h2 id="contact-channels-title">{copy.channelsTitle}</h2>
        </div>
        <div className="contact-channels__grid">
          {/* WhatsApp */}
          <article className="contact-channel-card contact-channel-card--whatsapp">
            <span className="v-mono-label contact-channel-card__badge">{copy.whatsappBadge}</span>
            <h3>{copy.whatsappTitle}</h3>
            <span className="contact-channel-card__val">{copy.whatsappNumber}</span>
            <p>{copy.whatsappDesc}</p>
            <a
              className="v-button v-button--primary v-button--pill"
              href="https://wa.me/50688888888?text=Hola%20V%C3%A9rtice%20CR%2C%20quisiera%20consultar%20sobre%20un%20proyecto%20de%20impresi%C3%B3n%203D"
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.whatsappAction} <span aria-hidden="true">↗</span>
            </a>
          </article>

          {/* Teléfono */}
          <article className="contact-channel-card">
            <span className="v-mono-label contact-channel-card__badge">{copy.phoneBadge}</span>
            <h3>{copy.phoneTitle}</h3>
            <span className="contact-channel-card__val">{copy.phoneNumber}</span>
            <p>{copy.phoneDesc}</p>
            <a className="v-button v-button--secondary v-button--pill" href="tel:+50625500000">
              {copy.phoneAction} <span aria-hidden="true">↗</span>
            </a>
          </article>

          {/* Correo */}
          <article className="contact-channel-card">
            <span className="v-mono-label contact-channel-card__badge">{copy.emailBadge}</span>
            <h3>{copy.emailTitle}</h3>
            <span className="contact-channel-card__val">{copy.emailAddress}</span>
            <p>{copy.emailDesc}</p>
            <a className="v-button v-button--ghost v-button--pill" href="mailto:taller@verticecr.com">
              {copy.emailAction} <span aria-hidden="true">↗</span>
            </a>
          </article>

          {/* Ubicación y Horarios */}
          <article className="contact-channel-card contact-channel-card--location">
            <span className="v-mono-label contact-channel-card__badge">{copy.locationBadge}</span>
            <h3>{copy.locationTitle}</h3>
            <span className="contact-channel-card__val">{copy.locationSchedule}</span>
            <p>{copy.locationDesc}</p>
            <span className="contact-channel-card__note">Cartago / San José · Costa Rica</span>
          </article>
        </div>
      </section>

      {/* Formulario Directo */}
      <section className="contact-form-section" aria-labelledby="contact-form-title">
        <div className="contact-form-section__copy">
          <span className="v-mono-label">{copy.formLabel}</span>
          <h2 id="contact-form-title">{copy.formTitle}</h2>
          <p>{copy.formIntro}</p>
        </div>
        <form className="contact-direct-form" onSubmit={handleSubmit} noValidate>
          {submitted ? (
            <div className="contact-form__success" role="status">
              <p><strong>{copy.formSuccessTitle}</strong></p>
              <p>{copy.formSuccessBody}</p>
            </div>
          ) : (
            <>
              {formError && (
                <p className="contact-form__error" role="alert">{formError}</p>
              )}
              <div className="form-grid">
                <div className="contact-field">
                  <label htmlFor="contact-name">{copy.formName} *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-email">{copy.formEmail} *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="contact-field">
                  <label htmlFor="contact-phone">{copy.formPhone}</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formState.phone}
                    onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))}
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-subject">{copy.formSubject}</label>
                  <select
                    id="contact-subject"
                    value={formState.subject}
                    onChange={e => setFormState(s => ({ ...s, subject: e.target.value }))}
                  >
                    {copy.formSubjectOptions.map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">{copy.formMessage} *</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder={copy.formMessagePlaceholder}
                  value={formState.message}
                  onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                />
              </div>

              <button className="v-button v-button--primary v-button--pill" type="submit">
                {copy.formSubmit}
              </button>
            </>
          )}
        </form>
      </section>

      {/* Flujos de Inicio y Seguimiento */}
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
            <Link className="v-button v-button--primary v-button--pill" to="/solicitud/archivo">
              {copy.fileAction} <span aria-hidden="true">↗</span>
            </Link>
          </section>

          <section className="contact-option contact-option--idea">
            <span className="v-mono-label">{copy.ideaTag}</span>
            <h3>{copy.ideaTitle}</h3>
            <p>{copy.ideaBody}</p>
            <p className="contact-option__hint">{copy.ideaHint}</p>
            <Link className="v-link-text" to="/solicitud/ayuda-diseno">
              {copy.ideaAction} <span aria-hidden="true">↗</span>
            </Link>
          </section>

          <section className="contact-option contact-option--account">
            <span className="v-mono-label">{copy.accountTag}</span>
            <div>
              <h3>{isAdmin ? copy.adminTitle : copy.accountTitle}</h3>
              <p>{isAdmin ? copy.adminBody : copy.accountBody}</p>
              {!user && <small>{copy.accountGuest}</small>}
            </div>
            <Link className="v-link-text" to={accountPath} {...accountState}>
              {isAdmin ? copy.adminAction : copy.accountAction} <span aria-hidden="true">↗</span>
            </Link>
          </section>
        </div>
      </section>

      {/* Asistencia */}
      <aside className="contact-help">
        <div>
          <span className="v-mono-label">{copy.helpLabel}</span>
          <h2>{copy.helpTitle}</h2>
          <p>{copy.helpBody}</p>
        </div>
        {openGeneralAssistant && (
          <button className="v-button v-button--secondary v-button--pill" type="button" onClick={openGeneralAssistant}>
            {copy.assistantAction} <span aria-hidden="true">↗</span>
          </button>
        )}
      </aside>

      {/* Dudas comunes */}
      <section className="contact-faq" aria-labelledby="contact-faq-title">
        <h2 id="contact-faq-title">{copy.faqTitle}</h2>
        <div>
          {copy.faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="contact-boundary">{copy.boundary}</p>
    </article>
  );
}
