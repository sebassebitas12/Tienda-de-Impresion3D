import { prepareAdminCatalogAction } from './admin-ai-catalog.js';
import { FDM_MATERIALS } from '../src/utils/quotePricing.js';

const SLICER_MODEL = 'Creality K1C';

export function auditCatalogQuality(data, language = 'es') {
  const products = data.products || [];
  const categories = data.categories || [];
  const es = language !== 'en';

  const total = products.length;
  const active = products.filter(p => p.status === 'ACTIVE').length;
  const drafts = products.filter(p => p.status === 'DRAFT').length;
  const inactive = products.filter(p => p.status === 'INACTIVE').length;

  const incompleteGalleries = products
    .filter(p => (p.images || []).length < 4)
    .map(p => ({
      id: p.id,
      name: p.name,
      imagesCount: (p.images || []).length,
      path: `/admin/catalogo/${p.id}/editar`,
    }));

  const unsliced = products.filter(
    p => p.productionDataSource === 'DEMO_NOT_SLICED' || !p.productionDataSource
  );

  const missingSpecs = products.filter(
    p => !p.material || !FDM_MATERIALS.includes(String(p.material).toUpperCase()) || !Number.isFinite(p.price)
  );

  let reply = '';
  if (es) {
    reply += `### Diagnóstico de calidad del catálogo\n\n`;
    reply += `**Resumen general del catálogo:**\n`;
    reply += `• Total de piezas registradas: **${total}** (${active} activas, ${drafts} borradores, ${inactive} inactivas).\n`;
    reply += `• Categorías disponibles: **${categories.length}** (${categories.filter(c => c.status !== 'INACTIVE').length} activas).\n`;
    reply += `• Especificaciones técnicas: ${missingSpecs.length === 0 ? 'Todas las piezas tienen material FDM admitido y precio asignado.' : `${missingSpecs.length} piezas tienen datos técnicos incompletos.`}\n\n`;

    if (incompleteGalleries.length > 0) {
      reply += `**Fichas con galería incompleta (< 4 fotografías):**\n`;
      reply += `Se detectaron **${incompleteGalleries.length} piezas** que no alcanzan las 4 vistas requeridas (frontal, isométrica, lateral y detalle):\n`;
      incompleteGalleries.forEach((item, index) => {
        reply += `${index + 1}. **${item.name}** (\`${item.id}\`): ${item.imagesCount}/4 fotos — [Editar ficha](${item.path})\n`;
      });
      reply += `\n`;
    } else {
      reply += `**Galerías de fotos:** Todas las piezas cuentan con al menos 4 fotografías cargadas.\n\n`;
    }

    reply += `**Estado de calibración y laminado:**\n`;
    reply += `• **${unsliced.length} de ${total} piezas** están marcadas como \`DEMO_NOT_SLICED\`.\n`;
    reply += `• Sus pesos y tiempos de producción son estimaciones paramétricas DEMO; aún requieren calibración de corte G-code en el laminador ${SLICER_MODEL} del taller.\n`;
  } else {
    reply += `### Catalog Quality Audit\n\n`;
    reply += `**General Summary:**\n`;
    reply += `• Total parts recorded: **${total}** (${active} active, ${drafts} drafts, ${inactive} inactive).\n`;
    reply += `• Active categories: **${categories.length}**.\n\n`;

    if (incompleteGalleries.length > 0) {
      reply += `**Incomplete Galleries (< 4 photos):**\n`;
      reply += `Found **${incompleteGalleries.length} parts** missing the standard 4-view gallery:\n`;
      incompleteGalleries.forEach((item, index) => {
        reply += `${index + 1}. **${item.name}** (\`${item.id}\`): ${item.imagesCount}/4 photos — [Edit record](${item.path})\n`;
      });
      reply += `\n`;
    }

    reply += `**Slicing and Calibration Status:**\n`;
    reply += `• **${unsliced.length} of ${total} parts** have \`DEMO_NOT_SLICED\` status (require actual ${SLICER_MODEL} slicer profiles).\n`;
  }

  const links = [
    { label: es ? 'Ver catálogo completo' : 'View catalog', path: '/admin/catalogo' },
    ...incompleteGalleries.slice(0, 3).map(p => ({
      label: `${es ? 'Editar' : 'Edit'} ${p.name.slice(0, 28)}`,
      path: p.path,
    })),
  ].slice(0, 4);

  return { reply: reply.trim(), links };
}

export function auditWorkshopOverview(data, language = 'es') {
  const requests = data.customPrintRequests || [];
  const orders = data.orders || [];
  const es = language !== 'en';

  const pendingQuotes = requests.filter(r => r.status === 'PENDING_QUOTE');
  const inReview = requests.filter(r => r.status === 'IN_REVIEW');
  const changesRequested = requests.filter(r => r.status === 'CHANGES_REQUESTED');
  const requestsNeedingAction = [...pendingQuotes, ...inReview, ...changesRequested];

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED');
  const inProductionOrders = orders.filter(o => o.status === 'IN_PRODUCTION');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const shippedOrders = orders.filter(o => o.status === 'SHIPPED');
  const activeOrders = [...pendingOrders, ...confirmedOrders, ...inProductionOrders, ...readyOrders, ...shippedOrders];

  let reply = '';
  if (es) {
    reply += `### Prioridades y estado operativo del taller\n\n`;
    reply += `#### 1. Solicitudes personalizadas (${requestsNeedingAction.length} requieren atención)\n`;
    if (requestsNeedingAction.length === 0) {
      reply += `• No hay solicitudes esperando cotización o revisión en este momento.\n`;
    } else {
      if (pendingQuotes.length > 0) {
        reply += `• **Pendientes de cotización (${pendingQuotes.length}):**\n`;
        pendingQuotes.forEach(r => {
          reply += `  - \`${r.id}\`: ${r.description || r.fileName || 'Solicitud sin descripción'} (${r.quantity || 1} uds, ${r.material || 'Material a definir'}) — [Ver solicitud](/admin/solicitudes/${r.id})\n`;
        });
      }
      if (inReview.length > 0) {
        reply += `• **En revisión técnica (${inReview.length}):**\n`;
        inReview.forEach(r => {
          reply += `  - \`${r.id}\`: ${r.description || r.fileName || 'En revisión'} — [Ver solicitud](/admin/solicitudes/${r.id})\n`;
        });
      }
      if (changesRequested.length > 0) {
        reply += `• **Cambios pedidos por el cliente (${changesRequested.length}):**\n`;
        changesRequested.forEach(r => {
          reply += `  - \`${r.id}\`: ${r.customerDecisionReason || 'Ajustes solicitados'} — [Ver solicitud](/admin/solicitudes/${r.id})\n`;
        });
      }
    }
    reply += `\n`;

    reply += `#### 2. Pedidos en curso (${activeOrders.length} activos)\n`;
    if (activeOrders.length === 0) {
      reply += `• No hay pedidos activos en proceso de producción o entrega.\n`;
    } else {
      reply += `• **Pendientes de confirmación:** ${pendingOrders.length}\n`;
      reply += `• **Confirmados / En cola:** ${confirmedOrders.length}\n`;
      reply += `• **En producción:** ${inProductionOrders.length}\n`;
      reply += `• **Listos para entrega:** ${readyOrders.length}\n`;
      reply += `• **Enviados / En ruta:** ${shippedOrders.length}\n`;
      reply += `\n`;
      reply += `Pedidos prioritarios recientes:\n`;
      activeOrders.slice(0, 5).forEach(o => {
        reply += `• Pedido \`${o.id}\` — Estado: **${o.status}** — Total registrado: ₡${Number(o.total || 0).toLocaleString('es-CR')} — [Abrir pedido](/admin/pedidos/${o.id})\n`;
      });
    }

    reply += `\n> **Nota de control:** Los importes reflejan pedidos registrados. De acuerdo con las reglas de auditoría, las ventas solo se declaran como cobradas tras verificar el comprobante de pago en el historial.`;
  } else {
    reply += `### Workshop Priorities & Overview\n\n`;
    reply += `#### 1. Custom Print Requests (${requestsNeedingAction.length} pending action)\n`;
    reply += `• Pending quotes: ${pendingQuotes.length}\n`;
    reply += `• In review: ${inReview.length}\n\n`;
    reply += `#### 2. Active Orders (${activeOrders.length} active)\n`;
    reply += `• Pending: ${pendingOrders.length}, Confirmed: ${confirmedOrders.length}, In production: ${inProductionOrders.length}, Ready: ${readyOrders.length}\n`;
  }

  const links = [
    { label: es ? 'Bandeja de solicitudes' : 'Workshop requests', path: '/admin/solicitudes' },
    { label: es ? 'Gestión de pedidos' : 'Orders management', path: '/admin/pedidos' },
    { label: es ? 'Resumen general' : 'Dashboard overview', path: '/admin' },
  ];

  return { reply: reply.trim(), links };
}

export function listWorkshopRequests(data, statusFilter, language = 'es') {
  const requests = data.customPrintRequests || [];
  const es = language !== 'en';
  const filtered = statusFilter ? requests.filter(r => r.status === statusFilter) : requests;

  if (filtered.length === 0) {
    return {
      reply: es
        ? `No se encontraron solicitudes con el filtro ${statusFilter || 'actual'}.`
        : `No requests found matching ${statusFilter || 'current criteria'}.`,
      links: [{ label: es ? 'Ver solicitudes' : 'View requests', path: '/admin/solicitudes' }],
    };
  }

  let reply = es ? `### Solicitudes de impresión (${filtered.length} registradas)\n\n` : `### Workshop Requests (${filtered.length})\n\n`;
  filtered.slice(0, 8).forEach(r => {
    reply += `• **\`${r.id}\`** [${r.status}]: ${r.description || r.fileName || 'Sin descripción'} | Cant: ${r.quantity || 1} | Material: ${r.material || 'A definir'} — [Ver detalle](/admin/solicitudes/${r.id})\n`;
  });

  return {
    reply: reply.trim(),
    links: [
      { label: es ? 'Bandeja de solicitudes' : 'Requests inbox', path: '/admin/solicitudes' },
      ...filtered.slice(0, 3).map(r => ({ label: `Solicitud ${r.id}`, path: `/admin/solicitudes/${r.id}` })),
    ].slice(0, 4),
  };
}

export function listWorkshopOrders(data, statusFilter, language = 'es') {
  const orders = data.orders || [];
  const es = language !== 'en';
  const filtered = statusFilter ? orders.filter(o => o.status === statusFilter) : orders;

  if (filtered.length === 0) {
    return {
      reply: es ? `No hay pedidos con el estado indicado.` : `No orders found for the given status.`,
      links: [{ label: es ? 'Ver pedidos' : 'View orders', path: '/admin/pedidos' }],
    };
  }

  let reply = es ? `### Pedidos del taller (${filtered.length} encontrados)\n\n` : `### Workshop Orders (${filtered.length})\n\n`;
  filtered.slice(0, 8).forEach(o => {
    reply += `• **\`${o.id}\`** — Estado: **${o.status}** — Total registrado: ₡${Number(o.total || 0).toLocaleString('es-CR')} — [Abrir](/admin/pedidos/${o.id})\n`;
  });

  return {
    reply: reply.trim(),
    links: [
      { label: es ? 'Bandeja de pedidos' : 'Orders list', path: '/admin/pedidos' },
      ...filtered.slice(0, 3).map(o => ({ label: `Pedido ${o.id}`, path: `/admin/pedidos/${o.id}` })),
    ].slice(0, 4),
  };
}

export function listCatalogSummary(data, query, language = 'es') {
  const products = data.products || [];
  const categories = data.categories || [];
  const es = language !== 'en';

  let filtered = products;
  if (query) {
    const q = query.toLowerCase().trim();
    filtered = products.filter(p => p.name.toLowerCase().includes(q) || (p.material && p.material.toLowerCase().includes(q)));
  }

  let reply = es ? `### Catálogo de productos (${filtered.length} piezas)\n\n` : `### Product Catalog (${filtered.length} parts)\n\n`;
  reply += es ? `**Categorías:** ${categories.map(c => `${c.name} (${c.id})`).join(', ')}\n\n` : `**Categories:** ${categories.map(c => c.name).join(', ')}\n\n`;

  filtered.slice(0, 10).forEach(p => {
    reply += `• **${p.name}** (\`${p.id}\`): ${p.material || 'FDM'}, ₡${Number(p.price || 0).toLocaleString('es-CR')}, estado: **${p.status}** — [Editar](/admin/catalogo/${p.id}/editar)\n`;
  });

  return {
    reply: reply.trim(),
    links: [{ label: es ? 'Ir al catálogo' : 'Go to catalog', path: '/admin/catalogo' }],
  };
}

function normalize(text) {
  return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function detectAndPrepareCrudAction({ message }, data, language = 'es') {
  const rawText = String(message || '').trim();
  const text = normalize(rawText);
  const es = language !== 'en';

  const products = data.products || [];
  const categories = data.categories || [];

  // 1. DELETE PRODUCT
  const isDeleteProductIntent = /\b(?:eliminar|borrar|remover|quitar)\b/i.test(text) && !/\bcategor[ií]a\b/i.test(text);
  if (isDeleteProductIntent) {
    let target = null;
    const idMatch = text.match(/\b(p\d+)\b/i);
    if (idMatch) target = products.find(p => p.id.toLowerCase() === idMatch[1].toLowerCase());
    if (!target) {
      for (const p of products) {
        if (text.includes(normalize(p.name))) {
          target = p;
          break;
        }
      }
    }
    if (target) {
      const action = prepareAdminCatalogAction({ entity: 'products', operation: 'DELETE', recordId: target.id }, data);
      if (action.error === 'PRODUCT_IN_USE') {
        return {
          reply: es
            ? `No es posible eliminar **${target.name}** (\`${target.id}\`) porque tiene pedidos registrados asociados. Para retirarlo del público manteniendo la integridad del historial, podemos cambiar su estado a **INACTIVE** (oculto). ¿Deseas que prepare esa propuesta?`
            : `Cannot delete **${target.name}** because it has linked orders. You can hide it by setting its status to INACTIVE.`,
          links: [{ label: es ? 'Ver pieza' : 'View part', path: `/admin/catalogo/${target.id}/editar` }],
        };
      }
      if (!action.error) {
        return {
          reply: es
            ? `Preparé la propuesta para **eliminar** permanentemente la pieza **${target.name}** (\`${target.id}\`) del catálogo. Revisa los detalles y confirma la acción para proceder.`
            : `Prepared proposal to delete part **${target.name}** (${target.id}). Please review and confirm.`,
          adminAction: action,
          links: [{ label: es ? 'Ver catálogo' : 'View catalog', path: '/admin/catalogo' }],
        };
      }
    }
  }

  // 2. DELETE CATEGORY
  const deleteCategoryMatch = text.match(/\b(?:eliminar|borrar)\b.*?\bcategoria\s*(cat\d+|[a-z0-9-]+)\b/i);
  if (deleteCategoryMatch) {
    const id = deleteCategoryMatch[1].toLowerCase();
    const category = categories.find(c => c.id.toLowerCase() === id || normalize(c.name).includes(id));
    if (category) {
      const action = prepareAdminCatalogAction({ entity: 'categories', operation: 'DELETE', recordId: category.id }, data);
      if (action.error === 'CATEGORY_IN_USE') {
        return {
          reply: es
            ? `No es posible eliminar la categoría **${category.name}** porque contiene piezas asociadas en el catálogo. Primero debes reasignar o eliminar esas piezas.`
            : `Cannot delete category **${category.name}** because it still contains catalog parts.`,
          links: [{ label: es ? 'Ver categorías' : 'View categories', path: '/admin/catalogo/categorias' }],
        };
      }
      if (!action.error) {
        return {
          reply: es
            ? `Preparé la propuesta para **eliminar** la categoría **${category.name}**. Revisa y confirma para aplicar el borrado.`
            : `Prepared proposal to delete category **${category.name}**. Review and confirm.`,
          adminAction: action,
          links: [{ label: es ? 'Ver categorías' : 'View categories', path: '/admin/catalogo/categorias' }],
        };
      }
    }
  }

  // 3. UPDATE PRODUCT (HIDE, DEACTIVATE, PUBLISH, CHANGE PRICE, CHANGE MATERIAL, FEATURE)
  const isHideOrDeactivate = /\b(?:ocultar|desactivar|pausar|inactivar)\b/i.test(text);
  const isPublishOrActivate = /\b(?:publicar|activar|habilitar)\b/i.test(text);
  const isChangePrice = /\b(?:cambiar|modificar|actualizar|subir|bajar)\b.*?\bprecio\b/i.test(text) || /\bprecio\s*(?:de|a)\b/i.test(text);
  const isChangeMaterial = /\b(?:cambiar|modificar)\b.*?\bmaterial\b/i.test(text);
  const isFeature = /\b(?:destacar|marcar como destacado)\b/i.test(text);
  const isUnfeature = /\b(?:quitar destacado|desmarcar destacado)\b/i.test(text);

  // Look for target product ID or name in text
  const productIdMatch = text.match(/\b(p\d+)\b/i);
  let targetProduct = null;
  if (productIdMatch) {
    targetProduct = products.find(p => p.id.toLowerCase() === productIdMatch[1].toLowerCase());
  }
  if (!targetProduct) {
    // Search by product names
    for (const p of products) {
      const pNorm = normalize(p.name);
      if (pNorm.length >= 4 && text.includes(pNorm)) {
        targetProduct = p;
        break;
      }
    }
  }

  if (targetProduct && (isHideOrDeactivate || isPublishOrActivate || isChangePrice || isChangeMaterial || isFeature || isUnfeature)) {
    const changes = {};

    if (isHideOrDeactivate) changes.status = 'INACTIVE';
    else if (isPublishOrActivate) changes.status = 'ACTIVE';

    if (isChangePrice) {
      const priceNumMatch = text.match(/(?:₡|\bcolones|\ba|\bprecio)?\s*(\d{3,7})\b/i);
      if (priceNumMatch) {
        changes.price = Number(priceNumMatch[1]);
      }
    }

    if (isChangeMaterial) {
      const matMatch = text.match(/\b(PLA|PETG|ASA|ABS|TPU|PLA SILK)\b/i);
      if (matMatch) {
        changes.material = matMatch[1].toUpperCase() === 'PLA SILK' ? 'PLA Silk' : matMatch[1].toUpperCase();
      }
    }

    if (isFeature) changes.featured = true;
    if (isUnfeature) changes.featured = false;

    if (Object.keys(changes).length > 0) {
      const action = prepareAdminCatalogAction({
        entity: 'products',
        operation: 'UPDATE',
        recordId: targetProduct.id,
        changes,
      }, data);

      if (!action.error) {
        let explanation;
        if (changes.status === 'INACTIVE') {
          explanation = es
            ? `Preparé la propuesta para **ocultar** la pieza **${targetProduct.name}** (\`${targetProduct.id}\`) del catálogo público cambiando su estado a \`INACTIVE\`.`
            : `Prepared proposal to hide **${targetProduct.name}** from public view.`;
        } else if (changes.status === 'ACTIVE') {
          explanation = es
            ? `Preparé la propuesta para **publicar** la pieza **${targetProduct.name}** (\`${targetProduct.id}\`) en el catálogo (\`ACTIVE\`).`
            : `Prepared proposal to activate **${targetProduct.name}**.`;
        } else if (changes.price) {
          explanation = es
            ? `Preparé la propuesta para actualizar el precio de **${targetProduct.name}** a **₡${changes.price.toLocaleString('es-CR')}**.`
            : `Prepared proposal to update price for **${targetProduct.name}** to ₡${changes.price}.`;
        } else {
          explanation = es
            ? `Preparé la propuesta de actualización para la pieza **${targetProduct.name}**.`
            : `Prepared update proposal for **${targetProduct.name}**.`;
        }

        return {
          reply: `${explanation} ${es ? 'Revisá la tarjeta interactiva y confirmá para guardar los cambios en la base de datos.' : 'Please review and confirm to save.'}`,
          adminAction: action,
          links: [{ label: es ? 'Ver catálogo' : 'View catalog', path: '/admin/catalogo' }],
        };
      }
    }
  }

  // 4. CREATE CATEGORY
  const createCategoryMatch = rawText.match(/\b(?:crear|nueva|agregar)\s+categor[ií]a\s+([A-Za-z0-9áéíóúñÁÉÍÓÚÑ -]{3,40})\b/i);
  if (createCategoryMatch) {
    const catName = createCategoryMatch[1].trim();
    const action = prepareAdminCatalogAction({
      entity: 'categories',
      operation: 'CREATE',
      changes: {
        name: catName,
        description: `Colección de ${catName}`,
        status: 'ACTIVE',
      },
    }, data);

    if (!action.error) {
      return {
        reply: es
          ? `Preparé la propuesta para crear la nueva categoría **${catName}**. Revisá los detalles y confirmá para darla de alta en el sistema.`
          : `Prepared proposal to create category **${catName}**. Review and confirm.`,
        adminAction: action,
        links: [{ label: es ? 'Ver categorías' : 'View categories', path: '/admin/catalogo/categorias' }],
      };
    }
  }

  // 5. CREATE PRODUCT
  const isCreateProductIntent = /\b(?:agregar|crear|anadir|proponer|incluir)\b.*?\b(?:pieza|producto|modelo|ficha)\b/i.test(text)
    || /\bquiero agregar una pieza nueva\b/i.test(text)
    || /\bcrear\s+[a-z0-9áéíóúñ -]+\s+en\s+(?:pla|petg|asa|abs|tpu)\b/i.test(text);

  if (isCreateProductIntent) {
    // Check if the user only triggered the default introductory prompt
    const isGenericPrompt = /\bpreguntame su nombre y uso\b/i.test(text) || rawText.length < 35;
    const hasSpecificName = /\b(?:llamada|nombre|pieza|crear|agregar)\s+["“']?([A-Za-z0-9áéíóúñÁÉÍÓÚÑ ]{4,40})["”']?/i.test(rawText) && !isGenericPrompt;

    if (!hasSpecificName && isGenericPrompt) {
      return {
        reply: es
          ? `¡Con gusto! Para preparar la propuesta de la nueva pieza en el catálogo y calcular su precio DEMO automático, indicame por favor:\n\n` +
            `1. **Nombre de la pieza** (ej. *Soporte para soldador*)\n` +
            `2. **Categoría** (*Gadgets*, *Figuras*, *Juguetes*, *Decoración*, *Piezas funcionales*)\n` +
            `3. **Material FDM sugerido** (*PLA*, *PETG*, *ASA*, *ABS*, *TPU*) y color\n` +
            `4. **Peso estimado en gramos** (ej. 50g) y **tiempo aproximado en horas** (ej. 2.5h)\n\n` +
            `*También podés escribirlo todo en una sola frase, por ejemplo:*\n` +
            `> «Crear Soporte de Soldador en PETG, categoría Piezas funcionales, peso 50g, tiempo 2h, color Negro»\n\n` +
            `Con esos datos genero la propuesta interactiva con su precio DEMO de inmediato para tu confirmación.`
          : `Please provide the part name, category, FDM material, estimated weight (grams), and print time (hours). You can write: "Create Soldering Stand in PETG, category Functional Parts, weight 50g, time 2h, color Black".`,
        links: [
          { label: es ? 'Ver catálogo actual' : 'View catalog', path: '/admin/catalogo' },
          { label: es ? 'Ver categorías' : 'View categories', path: '/admin/catalogo/categorias' },
        ],
      };
    }

    // Attempt to extract product creation fields
    let partName;
    const nameExplicit = rawText.match(/(?:llamada|nombre|pieza|crear|agregar)\s+["“']?([A-Za-z0-9áéíóúñÁÉÍÓÚÑ -]{4,45})["”']?(?:\s+en|\s+para|\s+de|\s+categor|\s*,|\s*$)/i);
    if (nameExplicit) {
      partName = nameExplicit[1].trim().replace(/^(?:una|un|la|el)\s+/i, '');
      partName = partName.replace(/\s+en\s+(?:PLA|PETG|ASA|ABS|TPU|PLA SILK)$/i, '').trim();
    } else {
      partName = 'Nueva Pieza FDM';
    }

    // Material
    const matMatch = rawText.match(/\b(PLA|PETG|ASA|ABS|TPU|PLA SILK)\b/i);
    const material = matMatch ? (matMatch[1].toUpperCase() === 'PLA SILK' ? 'PLA Silk' : matMatch[1].toUpperCase()) : 'PLA';

    // Category
    let targetCategory = categories.find(c => c.status !== 'INACTIVE');
    for (const cat of categories) {
      if (normalize(rawText).includes(normalize(cat.name))) {
        targetCategory = cat;
        break;
      }
    }

    // Weight
    const weightMatch = rawText.match(/(\d{1,4})\s*(?:g|gr|gramos)\b/i);
    const weightGrams = weightMatch ? Number(weightMatch[1]) : 50;

    // Time
    const timeMatch = rawText.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|horas)\b/i);
    const estimatedProductionHours = timeMatch ? Number(timeMatch[1]) : 2.5;

    // Colors
    const availableColors = ['Negro'];
    ['Blanco', 'Rojo', 'Azul', 'Gris', 'Verde', 'Amarillo'].forEach(col => {
      if (new RegExp(`\\b${col}\\b`, 'i').test(rawText)) availableColors.push(col);
    });

    const action = prepareAdminCatalogAction({
      entity: 'products',
      operation: 'CREATE',
      changes: {
        name: partName,
        description: `Pieza técnica fabricada bajo pedido en ${material}. Diseñada para uso funcional o decorativo con especificaciones precisas.`,
        categoryId: String(targetCategory?.id || 'cat1'),
        material,
        availableColors,
        weightGrams,
        estimatedProductionHours,
        status: 'ACTIVE',
      },
    }, data);

    if (!action.error) {
      const calcPrice = action.changes.price ? `₡${action.changes.price.toLocaleString('es-CR')}` : 'calculado';
      return {
        reply: es
          ? `Preparé la propuesta interactiva para dar de alta **${partName}** en la categoría **${targetCategory?.name || 'Catálogo'}**.\n\n` +
            `• **Material:** ${material}\n` +
            `• **Colores disponibles:** ${availableColors.join(', ')}\n` +
            `• **Estimación técnica:** ${weightGrams}g, ${estimatedProductionHours}h de impresión\n` +
            `• **Precio DEMO calculado:** **${calcPrice}** (estimación paramétrica FDM)\n\n` +
            `Revisá la ficha a continuación y pulsá **[Confirmar y guardar]** para incorporarla al catálogo.`
          : `Prepared interactive proposal for **${partName}** with calculated DEMO price ${calcPrice}. Review and confirm to save.`,
        adminAction: action,
        links: [{ label: es ? 'Ver catálogo' : 'View catalog', path: '/admin/catalogo' }],
      };
    }
  }

  return null;
}

export function executeAdminCopilotTurn({ message, language = 'es' }, data) {
  const text = normalize(message);
  const es = language !== 'en';

  // 1. Try CRUD detection first
  const crudResult = detectAndPrepareCrudAction({ message }, data, language);
  if (crudResult) return crudResult;

  // 2. Catalog Quality Audit Intent
  const isQualityIntent = /\b(?:calidad|incomplet|faltan|fotos|galeria|imagenes|laminad|borrador|fichas incompletas)\b/i.test(text)
    || /\brevisa la calidad del catalogo\b/i.test(text);
  if (isQualityIntent) {
    return auditCatalogQuality(data, language);
  }

  // 3. Priorities / Overview Intent
  const isOverviewIntent = /\b(?:prioridad|atencion|resumen|hoy|pedidos y solicitudes|taller)\b/i.test(text)
    || /\bque necesita atencion hoy\b/i.test(text);
  if (isOverviewIntent) {
    return auditWorkshopOverview(data, language);
  }

  // 4. List Requests Intent
  const isRequestsIntent = /\b(?:solicitud|solicitudes|encargo|encargos)\b/i.test(text);
  if (isRequestsIntent) {
    return listWorkshopRequests(data, null, language);
  }

  // 5. List Orders Intent
  const isOrdersIntent = /\b(?:pedido|pedidos|orden|ordenes)\b/i.test(text);
  if (isOrdersIntent) {
    return listWorkshopOrders(data, null, language);
  }

  // 6. List Catalog / Products Intent
  const isCatalogIntent = /\b(?:catalogo|productos|piezas|modelos|categorias)\b/i.test(text);
  if (isCatalogIntent) {
    return listCatalogSummary(data, null, language);
  }

  // 7. Fallback: comprehensive guidance
  const overview = auditWorkshopOverview(data, language);
  return {
    reply: es
      ? `Hola. Soy el **Copiloto Admin de Vértice CR**. Tengo acceso directo para leer y preparar cambios en los CRUDs del taller.\n\n` +
        `Podés pedirme:\n` +
        `• **Auditar catálogo:** *«Revisa la calidad del catálogo y dime qué fichas están incompletas»*\n` +
        `• **Ver prioridades:** *«¿Qué necesita atención hoy? Resume solicitudes y pedidos»*\n` +
        `• **Crear piezas:** *«Quiero agregar una pieza nueva al catálogo»* o *«Crear Soporte de Soldador en PETG, categoría Piezas funcionales, peso 50g, tiempo 2h»*\n` +
        `• **Modificar productos:** *«Ocultar la pieza p5»*, *«Cambiar precio de p1 a 15000»*, *«Destacar p1»*\n` +
        `• **Categorías:** *«Crear categoría Drones»*, *«Eliminar categoría cat3»*\n\n` +
        `Todas las acciones generan una propuesta interactiva que confirmás con un botón antes de guardar.`
      : `Hello. I am the Vértice CR Admin Copilot. I can read and edit CRUD records. Ask me to audit catalog quality, summarize workshop priorities, or create and edit catalog items.`,
    links: overview.links,
  };
}
