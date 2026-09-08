# Fase 2: Investigación y Dirección Visual - Tienda de Impresión 3D

## 1. Personalidad y Tono de la Marca

La tienda no es una juguetería ni un laboratorio frío. Es un taller creativo de alta tecnología con identidad costarricense. La personalidad combina:

- **Tecnológica pero accesible:** puede imprimir un Charmander y también el engranaje de un dron para automatizar una granja.
- **Maker culture:** celebra la creatividad, el prototipado y la fabricación digital sin intimidar al usuario casual.
- **Premium sin arrogancia:** se ve como producto terminado frente a un inversor, pero no aleja al estudiante o al comprador de un llavero.
- **Local con alcance global:** identidad tica, envíos internacionales.

**Tono de comunicación:** directo, técnico cuando es necesario, cercano siempre. Nunca corporativo frío ni excesivamente geek/friki.

---

## 2. Paleta de Colores

### Tema principal: Dark Mode

| Rol | Color | Hex | Uso |
|---|---|---|---|
| Fondo principal | Negro azulado profundo | `#0A0E1A` | Base de todas las pantallas |
| Fondo secundario | Gris oscuro azulado | `#111827` | Cards, paneles, modales |
| Fondo elevado | Gris medio | `#1F2937` | Inputs, nav, elementos flotantes |
| Acento principal | Cian eléctrico | `#00D4FF` | Botones CTA, links, precios destacados |
| Acento secundario | Cian suave | `#0EA5E9` | Hover states, bordes activos |
| Glow / resplandor | Cian transparente | `#00D4FF25` | Sombras de glow en elementos clave |
| Texto principal | Blanco suave | `#F1F5F9` | Títulos y texto principal |
| Texto secundario | Gris claro | `#94A3B8` | Descripciones, metadatos, precios base |
| Error | Rojo eléctrico | `#EF4444` | Estados de error |
| Éxito | Verde neón suave | `#22C55E` | Confirmaciones, disponibilidad |
| Borde sutil | Gris oscuro | `#1E293B` | Separadores, bordes de cards |

### Tema claro (toggle): Light Mode

| Rol | Color | Hex | Uso |
|---|---|---|---|
| Fondo principal | Blanco frío | `#F8FAFC` | Base |
| Fondo secundario | Gris muy claro | `#F1F5F9` | Cards y paneles |
| Acento principal | Cian profundo | `#0284C7` | Botones y acciones (versión oscurecida del cian para contraste) |
| Texto principal | Gris muy oscuro | `#0F172A` | Títulos |
| Texto secundario | Gris medio | `#475569` | Descripciones |

---

## 3. Tipografía

### Fuente de títulos y UI general
**Space Grotesk** (Google Fonts)
- Geométrica, moderna, limpia
- Transmite startup tecnológica sin ser genérica
- Usada en: títulos H1–H3, nombres de productos, botones, navegación

### Fuente técnica / monospace
**JetBrains Mono** (Google Fonts)
- Estilo código de programación, alta legibilidad técnica
- Usada en: precios, especificaciones técnicas (material, dimensiones, tiempo de impresión), etiquetas de sistema, badges de estado

### Escala tipográfica base

| Elemento | Fuente | Tamaño | Peso |
|---|---|---|---|
| H1 hero | Space Grotesk | 56–72px | 700 |
| H2 sección | Space Grotesk | 36–48px | 600 |
| H3 card | Space Grotesk | 24px | 600 |
| Cuerpo | Space Grotesk | 16px | 400 |
| Precio | JetBrains Mono | 20px | 700 |
| Especificación técnica | JetBrains Mono | 13–14px | 400 |
| Badge / etiqueta | JetBrains Mono | 11–12px | 500 |

---

## 4. Efectos Visuales y Animaciones

### Filosofía de efectos
Los efectos deben sentirse como **tecnología de precisión**, no como decoración frikista. Inspiración: la luz de un sable de luz — elegante, controlada, con presencia. Nunca recargada.

### Efectos permitidos

| Efecto | Uso correcto | Dónde aplicar |
|---|---|---|
| **Glow cian** | Sutil, solo en elementos clave de acción | Botón CTA principal, acento activo en nav, borde de card en hover |
| **Glassmorphism** | Fondo semi-transparente + blur leve | Modales, navbar con scroll, panel del carrito flotante |
| **Rejilla CAD** | Muy sutil como textura de fondo | Hero section únicamente, baja opacidad (5–8%) |
| **Gradiente oscuro** | De negro a gris azulado | Fondos de secciones alternas |
| **Borde iluminado** | 1px cian con glow en hover | Cards de producto en hover |

### Reglas de animación

- **Duración:** 150–300ms para interacciones, 400–600ms para transiciones de página
- **Easing:** `ease-out` para entradas, `ease-in-out` para transiciones
- **Reducción de movimiento:** respetar `prefers-reduced-motion` — todos los efectos deben tener fallback estático
- **Micro-interacciones:** el botón de agregar al carrito debe tener feedback visual inmediato (escala + glow breve)

### Lo que NO debe aparecer

- Partículas animadas en loop constante (distrae y cansa)
- Glow en todos los elementos (pierde impacto)
- Fuentes decorativas o display para texto de cuerpo
- Gradientes multicolor tipo arcoíris
- Animaciones que bloqueen la interacción del usuario
- Estética 100% gamer con elementos de videojuego (health bars, iconos de espada, etc.)
- Imágenes de stock genéricas de impresoras 3D en fondos blancos

---

## 5. Composición y Jerarquía

- **Espaciado generoso:** el espacio en blanco (o negro) comunica premium
- **Grid de 12 columnas** con contenedor máximo de 1280px
- **Cards de producto:** imagen grande, nombre en Space Grotesk, precio en JetBrains Mono, badge de material
- **Hero section:** texto a la izquierda, render o imagen del producto estrella a la derecha, rejilla CAD de fondo al 6% de opacidad
- **Jerarquía de color:** el cian eléctrico aparece máximo en 2–3 elementos por pantalla para mantener su impacto

---

## 6. Referencias Visuales Justificadas

| Referencia | Qué tomamos | Qué NO tomamos |
|---|---|---|
| **Tron Legacy** | Paleta oscura + líneas de luz cian | Exceso de efectos en todo |
| **Linear.app** | Espaciado, tipografía limpia, dark mode refinado | Su minimalismo extremo (nosotros tenemos más personalidad) |
| **Vercel.com** | Glassmorphism sutil, gradientes oscuros | Su frialdad corporativa |
| **Formlabs** | Fotografía de producto premium | Su estética 100% industrial sin calidez |

---

## 7. Lo que NO debe aparecer en el diseño

- Fondos blancos puros con texto negro sin personalidad
- Botones genéricos sin estados definidos
- Tipografías serif o handwritten
- Sombras marrones o cálidas (rompen la paleta tecnológica)
- Íconos de clip art o estilo flat genérico (usar Lucide o Phosphor Icons)
- Cualquier elemento que parezca plantilla de WordPress o Shopify por defecto

---

## 8. Iconografía

**Librería recomendada:** Lucide Icons o Phosphor Icons
- Línea fina, estilo moderno
- Consistentes con la tipografía geométrica
- Tamaño base: 20–24px en UI, 32–48px en secciones destacadas

---

## 9. Criterio de Verificación

> ¿La dirección visual transmite tecnología de precisión con accesibilidad local? ¿Un inversor ve un producto premium y un comprador casual no se siente intimidado?

---

## Estado en plantilla de seguimiento

| Fase | Estado |
|---|---|
| Fase 2 — Investigación y dirección visual | ✅ Completada |

