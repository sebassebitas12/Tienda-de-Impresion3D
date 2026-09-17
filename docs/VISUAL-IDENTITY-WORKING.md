# Vértice CR — Identidad visual en construcción

> Documento de trabajo vigente para la etapa de alta fidelidad. Complementa la investigación visual histórica de Fase 2 y registra las decisiones y criterios que se están formando a partir del mockup base generado con v0.

**Fecha:** 2026-09-17  
**Rama:** `Pruebas`  
**Estado:** 🔄 En construcción  

---

## 1. Propósito

Vértice CR no busca eliminar la creatividad de las herramientas generativas. Se utilizarán como aceleradores de exploración visual. El objetivo es tomar una base visual fuerte y convertirla en una identidad propia, consistente, limpia, fluida y técnicamente viable.

La regla de trabajo es:

```text
Generación rápida
↓
Auditoría
↓
Identidad Vértice
↓
Refinamiento
↓
Interacción
↓
Animación
↓
Responsive
↓
Validación
↓
Documentación
```

Una propuesta generada por IA no se considera una decisión aprobada hasta que se documentan los elementos que se conservan, modifican o descartan.

---

## 2. Objetivo visual

La experiencia debe sentirse:

- elegante;
- futurista;
- técnica;
- industrial;
- creativa sin parecer juguete;
- premium sin resultar fría;
- dinámica sin parecer una demo de efectos;
- local en identidad, pero con lenguaje visual capaz de competir con referencias internacionales.

La aspiración visual es que el sitio transmita calidad de fabricación desde la propia interfaz.

### Sensación objetivo

```text
Primera entrada:
"Esto no parece una tienda de impresión 3D genérica."

Recorrido:
"Hay profundidad, detalle y movimiento."

Interacción:
"La interfaz responde de verdad."

Resultado:
"La experiencia se siente diseñada, no ensamblada."
```

---

## 3. Qué entendemos por eliminar lo genérico

No significa reducir la creatividad ni hacer la interfaz minimalista por obligación.

Se considera genérico aquello que puede cambiarse de marca y seguir pareciendo exactamente la misma plantilla, por ejemplo:

- composición repetida de tarjetas con el mismo tratamiento;
- botones y superficies con la misma forma en toda la página;
- gradientes puestos como decoración sin función;
- glow aplicado de forma indiscriminada;
- iconos usados como sustituto de una idea visual propia;
- emojis como decoración de interfaz;
- layouts que parecen una plantilla de SaaS, WordPress o e-commerce por defecto;
- fondo blanco genérico sin relación con el producto;
- animaciones repetidas sin relación con contenido o narrativa;
- recursos visuales que podrían pertenecer a cualquier startup tecnológica.

Eliminar lo genérico **no significa eliminar recursos reconocibles de una generación de IA cuando esos recursos funcionan**. Si un efecto, interacción o composición es valioso, se conserva y se personaliza.

---

## 4. Fuente visual actual: mockup base de v0

Se recibió como referencia el archivo:

`landing-page-vertice-cr.zip`

El archivo contiene una landing funcional en Next.js + TypeScript y sirve como **referencia visual/prototipo**, no como implementación directa del proyecto.

### Estructura visual identificada

1. `Navbar` — navegación sticky, blur y menú móvil.
2. `Hero` — titular con gradiente naranja, halos ambientales y dos CTAs.
3. `ProductShowcase` — carrusel vertical con profundidad y despiece visual en hover mediante CSS.
4. `Catalog` — productos destacados con imagen, precio en colones y comportamiento hover.
5. `Precision` — métricas técnicas en grid con divisores.
6. `Process` — proceso en cuatro pasos con línea de conexión.
7. `PrintRequest` — experiencia interactiva compleja para solicitar impresión personalizada.
8. `CtaFooter` — cierre simple con llamada a la acción y copyright.

### Recursos técnicos observados

- Next.js 16.x.
- React 19.
- TypeScript.
- Tailwind CSS.
- Lucide React.
- CSS transforms 3D.
- `perspective` y `transform-style: preserve-3d`.
- glow mediante sombras CSS.
- gradients oscuros y naranjas.
- `backdrop-blur` en navegación.
- animación CSS para el showcase vertical.
- interacción hover sin librería de animación externa.

### Tratamiento del prototipo

El código de v0 **no se migrará mecánicamente de TS a JSX**.

Se utilizará para estudiar:

- composición;
- jerarquía;
- estados visuales;
- comportamiento;
- interacción;
- profundidad;
- técnicas CSS;
- oportunidades de mejora.

La implementación posterior seguirá el stack real del repositorio.

---

## 5. Elementos que actualmente se consideran valiosos

### 5.1 Profundidad del producto

El producto debe percibirse como un objeto dentro del espacio de la interfaz y no únicamente como una imagen dentro de una tarjeta.

### 5.2 Product Showcase

El despiece visual y la sensación de profundidad son recursos candidatos a convertirse en una firma de Vértice.

### 5.3 Print Request

La personalización debe presentarse como una experiencia guiada e interactiva, no como un formulario administrativo tradicional.

### 5.4 Movimiento ambiental

El fondo puede tener vida mediante iluminación, textura o profundidad, siempre que el movimiento sea controlado y no comprometa legibilidad, rendimiento o accesibilidad.

### 5.5 Información técnica como contenido visual

Métricas, materiales, dimensiones, tiempos y especificaciones pueden contribuir a la identidad cuando se presentan como información de fabricación y no como números decorativos.

---

## 6. Recursos que deben auditarse en cada iteración

Cada elemento visual importante debe clasificarse como:

| Clasificación | Significado |
|---|---|
| **CONSERVAR** | Funciona y representa bien la dirección actual. |
| **MEJORAR** | La idea funciona pero requiere refinamiento. |
| **REEMPLAZAR** | La idea es demasiado genérica o no encaja con la identidad. |
| **ELIMINAR** | No aporta experiencia, información ni identidad. |
| **NUEVO** | Hace falta para alcanzar el objetivo visual o funcional. |

No se deben realizar cambios globales únicamente por preferencia estética. Cada cambio debe registrar el motivo.

---

## 7. Lenguaje visual en exploración

### 7.1 Color

La dirección posterior a la exploración de Fase 2 está probando:

- fondos oscuros cálidos;
- carbón/obsidiana como base;
- naranja tipo lava como acento y fuente de atención;
- rojos cálidos únicamente cuando exista una razón concreta;
- texto claro con suficiente contraste.

La paleta naranja actual es una **hipótesis visual**, no un token definitivo del libro de marca.

Referencia experimental actual:

- fondo: `#0D0B09`
- superficie: `#141412`
- elevación: `#1E1C19`
- acento lava: `#FF5A1F`
- hover/magma: `#E03D00`
- acento suave/brasa: `#FF8C5A`
- texto principal: `#EDE8E0`
- texto secundario: `#6B6560`
- borde: `#2A2420`

### 7.2 Importante sobre la Fase 2

`fase2_investigacion_direccion_visual.md` conserva una exploración anterior basada en cian eléctrico. Esa documentación es histórica y no debe interpretarse como la paleta final actual.

La exploración posterior y el mockup base están probando la alternativa naranja/volcánica. La decisión definitiva se cerrará después de comparar y revisar el material de alta fidelidad.

---

## 8. Geometría y materialidad por explorar

La identidad debe poder reconocerse aunque se retire el color de acento.

Recursos candidatos:

- vértices;
- líneas técnicas;
- capas;
- ejes;
- planos;
- retículas CAD;
- cortes geométricos;
- superficies inspiradas en material impreso;
- sombras físicas controladas;
- iluminación direccional;
- profundidad por capas.

Estos recursos no deben aparecer todos al mismo tiempo. Cada sección debe justificar su combinación.

---

## 9. Movimiento y animación

La animación se considera parte del diseño, no un añadido posterior.

### Principios

- movimiento con propósito;
- continuidad entre secciones;
- entradas y salidas coordinadas;
- profundidad antes que cantidad;
- velocidad controlada;
- respuesta clara a hover y foco;
- ningún efecto debe bloquear una tarea;
- `prefers-reduced-motion` debe tener un estado alternativo.

### Niveles de movimiento

**Nivel 1 — Microinteracción**  
Feedback de botones, enlaces, selección, foco y estados.

**Nivel 2 — Componente**  
Hover con profundidad, expansión, desplazamiento, iluminación o despiece.

**Nivel 3 — Sección**  
Revelado, parallax, transformación de capas o continuidad entre bloques.

**Nivel 4 — Narrativa de página**  
Relación entre el movimiento de una sección y la entrada de la siguiente.

No se debe utilizar Nivel 4 únicamente para demostrar capacidad técnica.

---

## 10. Herramientas y responsabilidad

La herramienta generativa es un acelerador, no la fuente de verdad.

### Válido

- v0 para generar una base visual compleja;
- Framer para prototipos y exploración de movimiento;
- Spline si una escena 3D aporta valor real;
- IA para generar alternativas, referencias o variaciones;
- CSS/React/GSAP para implementación controlada cuando corresponda.

### No válido

- adoptar automáticamente una salida generada;
- agregar una dependencia solamente porque aparece en un mockup;
- incorporar un efecto si no puede explicarse su función;
- cambiar la identidad por cada nueva herramienta.

---

## 11. Criterio de calidad visual

Una iteración no se considera mejor únicamente porque tenga más efectos.

Debe evaluarse en conjunto:

```text
Identidad
+
Composición
+
Jerarquía
+
Interacción
+
Movimiento
+
Accesibilidad
+
Responsive
+
Rendimiento
```

El resultado debe sentirse más intencional, no solamente más cargado.

---

## 12. Regla de oro para futuras IA

Antes de generar o modificar una pantalla, leer obligatoriamente:

1. `AI_CONTEXT.md`
2. `docs/fase1_producto_requisitos_inversor.md`
3. `docs/fase2_investigacion_direccion_visual.md`
4. `docs/fase3_ux_user_flows_mockup.md`
5. `docs/VISUAL-IDENTITY-WORKING.md`
6. `docs/fase3_mockups_hf.md`

Si una decisión no está documentada, **no debe asumirse como aprobada**.

---

## 13. Estado

**Identidad visual definitiva: pendiente.**  
**Mockup base: recibido y auditado superficialmente.**  
**Mockups HF adicionales: pendientes.**  
**Design system: pendiente.**  
**Implementación: no iniciada.**
