const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const REQUEST_INTENT = [
  /\bquiero que me (?:hagas|armes|prepares?) (?:(?:el|la) )?(?:pedido|resumen|solicitud)\b/,
  /\b(?:haceme|hace|armame|arma|preparame|prepara|mandame|manda|enviame|envia) (?:(?:el|la) )?(?:pedido|resumen|solicitud)\b/,
  /\bquiero (?:hacer|preparar|armar|mandar|enviar) (?:(?:el|la) )?(?:pedido|resumen|solicitud)\b/,
  /\b(?:prepare|send|submit|place) (?:the )?(?:request|order)\b/,
];

function readDimensions(messages) {
  const transcript = messages.join(' ');
  const lengthBefore = transcript.match(/\b(?:largo|longitud)(?:\s+total)?\s*(?:de|:)?\s*(\d+(?:[.,]\d+)?)\s*(mm|cm|m)?\b/i);
  const lengthAfter = transcript.match(/\b(\d+(?:[.,]\d+)?)\s*(mm|cm|m)?\s*(?:de\s+)?(?:largo|longitud)(?:\s+total)?\b/i);
  const lengthNumber = lengthBefore?.[1] || lengthAfter?.[1];
  const lengthUnit = lengthBefore?.[2] || lengthAfter?.[2];
  const widthBefore = transcript.match(/\b(ancho|di[aá]metro)(?:\s+máximo|\s+maximo)?\s*(?:de|:)?\s*(\d+(?:[.,]\d+)?)\s*(mm|cm|m)?\b/i);
  const widthAfter = transcript.match(/\b(\d+(?:[.,]\d+)?)\s*(mm|cm|m)?\s*(?:de\s+)?(ancho|di[aá]metro)(?:\s+máximo|\s+maximo)?\b/i);
  const widthLabel = widthBefore?.[1] || widthAfter?.[3];
  const widthNumber = widthBefore?.[2] || widthAfter?.[1];
  const widthUnit = widthBefore?.[3] || widthAfter?.[2];
  if (lengthNumber && widthLabel && widthNumber) {
    const lengthValue = `${lengthNumber}${lengthUnit ? ` ${lengthUnit}` : ''}`;
    const widthValue = `${widthNumber}${widthUnit ? ` ${widthUnit}` : ''}`;
    const unitNote = lengthUnit && widthUnit ? '' : ' (unidad por confirmar)';
    const dimensionLabel = normalize(widthLabel) === 'diametro' ? 'diámetro' : 'ancho';
    return `Largo ${lengthValue}; ${dimensionLabel} ${widthValue}${unitNote}`;
  }
  if (/\btamano promedio\b/.test(normalize(transcript))) return 'Tamaño promedio (sin medidas numéricas)';
  return '';
}

function readQuantity(messages) {
  const transcript = normalize(messages.join(' '));
  const numeric = transcript.match(/\b(\d{1,3})\s*(?:unidad(?:es)?|pieza(?:s)?)\b/);
  if (numeric) return Number(numeric[1]);
  if (/\b(?:una|un) unidad\b/.test(transcript)) return 1;
  return undefined;
}

function readMaterial(userMessages, transcript) {
  for (const message of [...userMessages].reverse()) {
    const materials = [...message.matchAll(/\b(PLA|PETG|ASA|ABS|TPU)\b/gi)].map(match => match[1].toUpperCase());
    const distinctMaterials = [...new Set(materials)];
    if (distinctMaterials.length === 1) return distinctMaterials[0];
    if (distinctMaterials.length > 1) return '';
    if (/\bflexible\b/i.test(message) && /\bTPU\b/i.test(transcript)) return 'TPU';
  }
  return '';
}

function readProductFromMaterialQuestion(message) {
  if (!/\b(?:material(?:es)?|compara(?:r)?|recomienda(?:r)?|sugiere|sugerir|conviene)\b/i.test(normalize(message))) return '';
  const match = message.match(/\bpara\s+(?:una?|el|la)\s+(.+?)(?:\s+que\s+(?:usar(?:e|é)|voy\s+a\s+usar|quiero|necesito)|[,.?!]|$)/i);
  const product = match?.[1]?.trim();
  return product && product.length >= 3 ? product : '';
}

function readDescription(messages) {
  const cleaned = messages.map(message => {
    const text = stripRequestCommand(message)
      .replace(/\bpara\s+(?:revisarlo|revisarla|revisar(?:\s+el\s+resumen)?|que\s+lo\s+revise)\b/gi, '')
      .trim();
    const productFromQuestion = readProductFromMaterialQuestion(text);
    if (productFromQuestion) return productFromQuestion;
    return text.split(/[¿?]/, 1)[0]
      .replace(/^\s*(?:(?:yo\s+)?quiero(?:\s+(?:hacerme|hacer|crear|fabricar|diseñar|imprimir))?|estoy pensando en|me gustar[ií]a(?:\s+(?:hacer|crear|fabricar))?|quisiera(?:\s+(?:hacer|crear|fabricar))?|necesito|busco|de)\s+/i, '')
      .replace(/(?:\s*[.!])+\s*$/, '')
      .trim();
  }).find(candidate => candidate.length >= 3
    && !/^(?:\d|una?\s+unidad|largo\b|ancho\b|di[aá]metro\b|material\b|flexible\b|tama[ñn]o promedio\b|con lo que|por favor|para revisar)/i.test(candidate)
    && !/^(?:ayudame|ayuda|decime|contame|que datos|como definimos|como hago|que usos|elegir (?:un )?material)\b/i.test(normalize(candidate))) || '';
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : '';
}

function stripRequestCommand(message) {
  const normalized = normalize(message);
  for (const pattern of REQUEST_INTENT) {
    const match = pattern.exec(normalized);
    if (match) return `${message.slice(0, match.index)} ${message.slice(match.index + match[0].length)}`.trim();
  }
  return message;
}

function readIntendedUse(userMessages) {
  const transcript = userMessages.map(message => stripRequestCommand(message).split(/[¿?]/, 1)[0]).join(' ');
  const use = transcript.match(/\bpara\s+((?:poder\s+)?[a-záéíóúñ]+(?:ar|er|ir)\b[^,.;\n]{0,90})/i);
  if (use && /^(?:celular|hogar|lugar|familiar|popular|similar|particular|solar|angular|circular|tubular|lineal|rectangular|singular)\b/i.test(normalize(use[1]))) return '';
  return use?.[1]?.trim() || '';
}

function readReferenceUrl(userMessages) {
  const match = userMessages.join(' ').match(/https:\/\/[^\s<>"')]+/i);
  return match?.[0]?.replace(/[),.;!?]+$/, '') || '';
}

function buildDraft(userMessages, turns) {
  const userText = userMessages.join(' ');
  const transcript = turns.filter(turn => typeof turn?.content === 'string').map(turn => turn.content).join(' ');
  const draft = { description: readDescription(userMessages), intendedUse: '', dimensions: readDimensions(userMessages), material: readMaterial(userMessages, transcript), referenceUrl: readReferenceUrl(userMessages) };
  const quantity = readQuantity(userMessages);
  if (quantity !== undefined) draft.quantity = quantity;
  if (/\b(?:necesito|quiero) (?:ayuda )?(?:con el )?diseno\b/i.test(normalize(userText))) draft.needsDesign = true;
  else if (/\bya tengo (?:el )?(?:archivo|modelo|diseno)\b/i.test(normalize(userText))) draft.needsDesign = false;

  if (/\b(dildo|juguete sexual|pieza de contacto corporal)\b/i.test(normalize(userText))) draft.intendedUse = 'Uso personal; contacto corporal';
  else draft.intendedUse = readIntendedUse(userMessages);
  return draft;
}

/** Captures an identifiable project and explicit details without submitting it. */
export function extractQuoteDraft(turns) {
  const userMessages = turns.filter(turn => turn?.role === 'user' && typeof turn.content === 'string').map(turn => turn.content.trim()).filter(Boolean);
  if (!userMessages.length) return null;
  const draft = buildDraft(userMessages, turns);
  return draft.description ? draft : null;
}

/** Builds a review-only request draft once the customer explicitly asks to prepare it. */
export function prepareExplicitQuoteDraft(turns, language = 'es') {
  const userMessages = turns.filter(turn => turn?.role === 'user' && typeof turn.content === 'string').map(turn => turn.content.trim()).filter(Boolean);
  const normalizedUsers = userMessages.map(normalize);
  if (!userMessages.length) return null;

  const latestUser = userMessages.at(-1);
  const explicitRequestNow = REQUEST_INTENT.some(pattern => pattern.test(normalize(latestUser)));
  const priorExplicitRequest = normalizedUsers.slice(0, -1).some(message => REQUEST_INTENT.some(pattern => pattern.test(message)));
  const previousDraft = priorExplicitRequest ? buildDraft(userMessages.slice(0, -1), turns) : null;
  const currentDraft = buildDraft(userMessages, turns);
  const structuredFields = ['intendedUse', 'dimensions', 'material', 'quantity', 'needsDesign', 'referenceUrl'];
  const addedStructuredDetail = Boolean(previousDraft && !/[¿?]/.test(latestUser)
    && structuredFields.some(field => currentDraft[field] && currentDraft[field] !== previousDraft[field]));
  if (!explicitRequestNow && !addedStructuredDetail) return null;

  const draft = currentDraft;

  const sensitiveUse = Boolean(draft.intendedUse && /contacto corporal/i.test(draft.intendedUse));
  const replyKind = explicitRequestNow ? 'prepared' : 'updated';
  const reply = language === 'en'
    ? replyKind === 'prepared'
      ? `I prepared a draft from what you told me. Nothing has been submitted; review the fields and attach photos or a 3D file if you have one.`
      : `I updated the draft with those details. Check the summary and add photos or a 3D file if you have one.`
    : replyKind === 'prepared'
      ? `Listo: armé un borrador con lo que ya me contaste. No se envió nada; revisá los campos y agregá fotos o un archivo 3D si tenés.`
      : `Actualicé el borrador con esos datos. No se envió nada: revisá el resumen y agregá fotos o un archivo 3D si tenés.`;
  const safetyNote = language === 'en'
    ? ' The workshop must confirm material and finish for body-contact use; no safety certification is provided.'
    : ' Como es de contacto corporal, el taller debe confirmar material y acabado; no se certifica seguridad.';
  return { draft, reply: `${reply}${sensitiveUse ? safetyNote : ''}` };
}
