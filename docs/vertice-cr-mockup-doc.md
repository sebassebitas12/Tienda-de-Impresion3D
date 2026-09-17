# Vértice CR — Documentación del Mockup Base

> **Origen:** Generado con v0.app · Next.js 16 + TypeScript + Tailwind v4  
> **Migración objetivo:** React + Vite + JavaScript (sin TS)  
> **Repositorio:** https://github.com/sebassebitas12/Tienda-de-Impresion3D.git

---

## 0. Identidad inicial de Vértice CR

La identidad de Vértice CR debe sentirse como un taller creativo de alta tecnología con raíces costarricenses: premium, técnico, confiable y con una presencia visual cálida y moderna. La base del mockup v0 ya funciona como referencia porque transmite profundidad, materialidad, precisión y sensación de fabricación real; lo que debemos conservar es esa “inteligencia visual”, no copiarla mecánicamente. La marca se construye con tres pilares: 1) precisión técnica y confianza, 2) calor industrial y presencia premium, y 3) una narrativa local que se vea internacional. En términos visuales, la dirección actual se apoya en fondos oscuros, acentos cálidos naranjas/rojos, luz ambiental, capas y profundidad 3D, tipografía de interfaz clara y métricas técnicas que parecen parte del producto y no solo del layout. En la migración a JS deberemos traducir esta identidad a tokens, componentes y CSS propios, sin depender del código TypeScript del mockup original.

### Atributos de marca
- Confianza: mensajes claros, información técnica útil, tono experto y accesible.
- Calidad: materiales, tolerancias, detalle y acabado premium.
- Tecnología: profundidad, capas, iluminación, precisión y sensación de fabricación digital.
- Identidad local: referencias a Costa Rica, producción nacional y valor artesanal + industrial.
- Diferenciación: no sentirse como una tienda genérica ni un SaaS; debe parecer un taller real con presencia tecnológica.

### Dirección visual base
- Tema principal: dark mode con fondo muy oscuro y contraste alto.
- Acento principal: naranja/lava o rojo cálido, con glow moderado y controlado.
- Materialidad: capas, profundidad, gradientes, sombras y separación entre planos.
- Geometría: composición técnica, rectángulos, módulos, divisores y estructura ordenada.
- Interacción: hover con respuesta visual, glow sutil y microanimaciones con propósito.

### Qué trasladar a React + JS
- Paleta base y tokens de color.
- Sistema de tipografía con Space Grotesk + JetBrains Mono.
- Product showcase con profundidad y scroll infinito.
- CTA con glow controlado y foco claro.
- Cards, pills y estados de formulario con lógica visual coherente.
- Movimiento suave y calculado, respetando accesibilidad y `prefers-reduced-motion`.

---

## 0.1 Base estratégica de la identidad

La marca no debe parecer una landing genérica ni una plantilla de ecommerce. Vértice CR tiene que sentirse como un taller de fabricación digital con personalidad propia: técnico, preciso, cálido, premium y cercano. La estética oscura funciona como base porque transmite control, profundidad y seriedad; el acento naranja/lava aporta energía, calor y un punto de diferencia que evoca material impreso, metales, calor de trabajo y precisión de fabricación. La identidad debe ser clara en dos segundos: si alguien entra y ve la página, debe entender que es una marca de procesamiento material real y de alta tecnología, no un catálogo de gadgets al azar.

### Personalidad de marca
- Precisa: cada espacio debe tener orden, métricas y claridad.
- Premium: detalles materiales, profundidad, contraste elevado y acabados cuidadosos.
- Creativa: no es fría ni industrial hasta el punto de perder calor humano.
- Costarricense: local, honesto y confiable, sin perder capacidad global.
- Accesible: tecnología con lenguaje comprensible y no intimidante.

### Principios visuales
1. Fondo oscuro como base y luz como elemento de jerarquía.
2. Acento cálido para atraer la vista, no para saturar la interfaz.
3. Información técnica como contenido visual, no como relleno.
4. Profundidad por capas, no por caos visual.
5. Microinteracciones con intención, nunca decorativas sin sentido.

### Reglas de decisión visual
- Si un detalle se ve genérico, se reemplaza.
- Si un efecto no aporta información o emoción, se elimina.
- Si un color no refuerza la calidad del producto, no se usa.
- Si una tipografía no aporta carácter ni legibilidad, no entra.

---

## 0.2 Sistema visual propuesto para la app

### Paleta base recomendada
```text
bg:        #0B0D12  (fondo principal)
surface:   #121722  (superficie principal)
surface-2: #181F2C  (tarjetas y paneles)
border:    #273244  (bordes)
text:      #F4F7FB  (texto principal)
muted:     #A7B0BF  (texto secundario)
accent:    #FF6A1A  (naranja/lava principal)
accent-2:  #FF8A4C  (naranja más claro)
accent-3:  #E3521A  (tono de contraste)
warning:   #F9B84B  (aviso / calidez)
error:     #FF5A5F  (error o alarma)
success:   #36D399  (estado positivo)
```

### Tipografía recomendada
- Sans principal: Space Grotesk / variante semibold y medium.
- Mono técnica: JetBrains Mono para precios, especificaciones, unidades, códigos y estados.
- Escala sugerida:
  - H1: 48–64px, weight 700
  - H2: 32–40px, weight 600
  - H3: 20–28px, weight 600
  - Body: 16–18px, weight 400–500
  - Labels: 12–14px, monospace / tracking 0.08em

### Estructura visual
- Contenedores con padding generoso: 24–32px.
- Cards con borde tenue y sombras bajas, no saturadas.
- CTA principales con acento fuerte y glow sutil.
- Divisores discretos para organizar información técnica.
- Hero con focalización narrativa: producto + mensaje + acción.

### Interacción mínima esperada
- Hover con cambio de borde, elevación o brillo.
- CTA con respuesta inmediata al pasar el mouse.
- Inputs con estado focus visible y contraste claro.
- Secciones con movimiento ligero, nunca agresivo.
- En mobile, prioridad a lectura y clics grandes.

### Evaluación de éxito visual
La identidad está funcionando si la interfaz:
- parece una marca de fabricación digital, no una plantilla estándar;
- comunica calidad y precisión sin volverse fría;
- hace que el usuario entienda que el producto es real, material y bien fabricado;
- mantiene coherencia entre navegación, catálogo, cotización y compra.

---

## 1. Stack tecnológico del mockup original

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.3.3 (App Router) |
| UI | React 19 |
| Lenguaje | TypeScript 5.7 |
| Estilos | Tailwind CSS v4 + `tw-animate-css` |
| Iconos | `lucide-react` ^1.16 |
| Fuentes | Space Grotesk (sans) · JetBrains Mono (mono) — Google Fonts |
| Utilidades | `clsx`, `tailwind-merge`, `class-variance-authority` |
| UI primitivos | `@base-ui/react`, `shadcn` |
| Analytics | `@vercel/analytics` (solo en producción) |

> **Al migrar a Vite + JS:** se elimina Next.js (sin `Image`, sin `Metadata`, sin `"use client"`). Tailwind v4 se mantiene. TypeScript → JavaScript (quitar tipos, interfaces y `as const`).

---

## 2. Sistema de diseño (Design Tokens)

### Paleta de colores
```
Fondo principal:   zinc-950  (#09090b)
Superficie:        zinc-900  (#18181b)
Borde estándar:    zinc-800  (#27272a)
Texto primario:    zinc-100  (#f4f4f5)
Texto secundario:  zinc-400  (#a1a1aa)
Texto apagado:     zinc-500 / zinc-600
Acento primario:   orange-500 (#f97316) / orange-600 (#ea580c)
Acento secundario: red-500 (#ef4444) / red-600 (#dc2626)
```

### Tipografía
| Rol | Fuente | Uso |
|---|---|---|
| `font-sans` | Space Grotesk | Cuerpo general, headings, UI |
| `font-mono` | JetBrains Mono | Precios, códigos, etiquetas técnicas, estados |

### Efectos de luz ("lava glow")
El efecto de halo naranja es la firma visual del sistema. Se logra con `box-shadow` personalizado en Tailwind:
```
Botón CTA activo:   shadow-[0_0_30px_-6px_rgba(239,68,68,0.8)]
Botón CTA hover:    shadow-[0_0_40px_-4px_rgba(239,68,68,0.9)]
Card hover:         shadow-[0_0_30px_-8px_rgba(239,68,68,0.6)]
Navbar CTA:         shadow-[0_0_20px_-4px_rgba(249,115,22,0.7)]
Step activo:        shadow-[0_0_20px_-4px_rgba(234,88,12,0.9)]
Glow de fondo hero: blur-[120px] + bg-orange-600/20 (pseudo-elemento absoluto)
```

### Radios y espaciado
- Cards y elementos UI: `rounded-2xl` (18px aprox.)
- Botones principales: `rounded-lg`
- Pills / badges: `rounded-full` o `rounded-lg`
- Secciones: `py-24` · Contenedor max: `max-w-6xl`

### Animación `animate-hero-scroll`
```css
@keyframes hero-scroll-y {
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
}
.animate-hero-scroll {
  animation: hero-scroll-y 20s linear infinite;
}
/* Se pausa al hacer hover */
.hero-showcase:hover .animate-hero-scroll {
  animation-play-state: paused;
}
```
> La lista de productos se duplica (`[...products, ...products]`) para lograr el loop infinito sin salto visible.

---

## 3. Arquitectura de componentes

```
Page (raíz)
├── Navbar
├── main
│   ├── Hero
│   │   └── ProductShowcase
│   ├── Catalog
│   ├── Precision
│   ├── Process
│   ├── PrintRequest
│   │   ├── OriginCard  (sub-componente)
│   │   ├── PillGroup   (sub-componente)
│   │   └── SummaryRow  (sub-componente)
│   └── CtaFooter
```

---

## 4. Detalle por componente

### 4.1 `Navbar`
**Archivo:** `components/navbar.tsx`  
**Estado:** `useState` → `open` (boolean, menú móvil)

| Elemento | Descripción |
|---|---|
| Logo | Ícono `Flame` (lucide) + texto "Vértice **CR**" (CR en naranja) |
| Links desktop | Catálogo · Precisión · Proceso — anclas internas (`#catalogo`, `#precision`, `#proceso`) |
| CTA desktop | Botón "Cotizar Impresión" → `#cotizar`, naranja con glow |
| Hamburger móvil | `Menu` / `X` (lucide), menú desplegable bajo el header |
| Fondo | `bg-zinc-950/80 backdrop-blur-xl` + `sticky top-0 z-50` |
| Borde | `border-b border-zinc-800/60` |

---

### 4.2 `Hero`
**Archivo:** `components/hero.tsx`  
**Deps:** `ProductShowcase`

| Elemento | Descripción |
|---|---|
| Fondo | Dos divs absolutos con `blur-[120px]` simulando halo de lava (`orange-600/20`, `red-600/15`) |
| Badge superior | Monospace, borde zinc-800, `Flame` ícono naranja, texto "Fabricación digital · Costa Rica" |
| H1 | Texto grande (hasta `text-7xl`), parte en zinc-100 y parte con gradiente orange→red usando `bg-clip-text text-transparent` |
| Subtítulo | `text-zinc-400`, `text-lg`, `text-pretty` |
| CTAs | "Cotizar Impresión" (naranja+glow+`ArrowRight`) · "Ver catálogo" (ghost, borde zinc-700) |
| Grid | `lg:grid-cols-2` — copia izquierda / showcase derecho |
| Showcase | Solo visible en desktop (`hidden lg:block`) |

---

### 4.3 `ProductShowcase`
**Archivo:** `components/product-showcase.tsx`  
**Propósito:** Carrusel 3D vertical con animación CSS de scroll infinito

**Productos mostrados:**
| Código | Label | Ícono |
|---|---|---|
| PRT-01 | Prototipos | `Box` |
| FIG-02 | Figuras | `Layers` |
| RPT-03 | Repuestos | `Cog` |
| ARQ-04 | Arquitectura | `Building2` |

**Efecto 3D por pieza (`ProductPiece`):**
- Transform CSS: `rotateX(58deg) rotateZ(-45deg)` con `perspective:1200px`
- 3 capas apiladas con `translateZ`:
  1. Base slab (zinc-900, Z=0)
  2. Magma core (gradiente orange→red, Z=16, invisible hasta hover)
  3. Top slab con ícono (Z=30 → Z=80 en hover = efecto despiece)
- En hover: el ícono pasa de `zinc-500` a `orange-400`

---

### 4.4 `Catalog`
**Archivo:** `components/catalog.tsx`  
**Deps:** `Image` de Next.js → **migrar a `<img>` nativo**

**4 tarjetas de productos:**
| Título | Precio |
|---|---|
| Prototipos funcionales | desde ₡12.000 |
| Figuras coleccionables | desde ₡8.500 |
| Piezas de repuesto | desde ₡6.000 |
| Maquetas arquitectónicas | cotización |

**Anatomía de cada card:**
- Imagen cuadrada (`aspect-square`) con `object-cover` + scale en hover
- Gradient overlay `from-zinc-950/70` sobre la imagen
- Título en `zinc-100`, descripción en `zinc-400`, precio en `orange-400 font-mono`
- Border `zinc-800` → `red-500/70` en hover con glow rojo

---

### 4.5 `Precision`
**Archivo:** `components/precision.tsx`

**4 métricas técnicas:**
| Stat | Label | Ícono |
|---|---|---|
| ±0.2 mm | Tolerancia dimensional | `Ruler` |
| Alta resistencia | Materiales técnicos | `Shield` |
| 0.1 mm | Altura de capa | `Layers` |
| 48 h | Entrega express | `Gauge` |

**Layout:** Grid 2×2 (móvil) → 4 columnas (desktop), separadas por `gap-px` sobre fondo `zinc-800` (efecto de borde divisor entre celdas). Cada celda tiene `bg-zinc-950`.  
**Ícono:** Cuadrado 11×11 con borde `orange-500/30` y fondo `orange-500/10`.

---

### 4.6 `Process`
**Archivo:** `components/process.tsx`

**4 pasos del flujo:**
| # | Título | Ícono |
|---|---|---|
| 1 | Diseño | `PenTool` |
| 2 | Preparación | `Settings2` |
| 3 | Impresión | `Printer` |
| 4 | Entrega | `PackageCheck` |

**Layout:** Grid 1 col (móvil) → 4 cols (desktop), centrado.  
**Línea conectora:** `<div>` absoluto `h-px` con gradiente `from-transparent via-orange-500/50 to-transparent`, solo visible en `md:`.  
**Ícono:** Círculo con `border-orange-500/40`, glow naranja, badge rojo `-top-1 -right-1` con el número del paso.

---

### 4.7 `PrintRequest`
**Archivo:** `components/print-request.tsx`  
**Estado (useState):**
- `origin`: `"file" | "design" | null`
- `fileName`: string | null (nombre del archivo subido)
- `isDragging`: boolean
- `material`: `"PLA" | "PETG" | "Resina"` (default: `"PLA"`)
- `quality`: `"Estándar" | "Alta precisión"` (default: `"Estándar"`)
- `color`: string (default: `"Lava"`)

**Sub-componentes internos:**

`OriginCard` — Botón card seleccionable (aria-pressed):
- "Tengo un archivo 3D" → ícono `Box`
- "Necesito diseño" → ícono `PencilRuler`
- Activo: borde naranja + glow. Inactivo hover: borde rojo/glow

`PillGroup` — Fila de botones pill para Material y Calidad

`SummaryRow` — Fila `<dl>` label/valor para el resumen

**Secciones del formulario:**
1. `01 Punto de partida` — OriginCards (2 opciones)
2. `02 Tu archivo` — Drag & Drop zone (`.stl .obj .step .3mf`, máx 100MB), `useRef` para el input file
3. Selectores técnicos: Material (PillGroup) · Calidad (PillGroup) · Color (swatches circulares)

**Panel sticky de resumen (derecho):**
- Encabezado "Resumen de solicitud"
- Filas: Origen, Archivo, Material, Calidad, Color
- Estado en monospace naranja: "Pendiente de cotización"
- Botón "Enviar a Revisión" (naranja intenso, full-width)

**Step indicator:**
- 3 pasos: Origen → Requisitos → Revisión
- El paso activo usa `activeStep = !origin ? 1 : 2` (la lógica está incompleta en el mockup, es solo visual)

---

### 4.8 `CtaFooter`
**Archivo:** `components/cta-footer.tsx`

Footer simple con:
- Logo (Flame + "Vértice CR")
- Copyright en monospace: `© {year} Vértice CR · Fabricación digital`
- Borde superior `border-zinc-800/60`

> **Nota:** No incluye CTA de llamada a la acción a pesar del nombre. Si se quiere una sección CTA (banner antes del footer) hay que agregarla aparte.

---

## 5. Assets públicos

```
public/
├── icon.svg
├── icon-light-32x32.png
├── icon-dark-32x32.png
├── apple-icon.png
└── catalog/
    ├── prototipos.png
    ├── figuras.png
    ├── repuestos.png
    └── arquitectura.png
```

---

## 6. Lista de mockups pendientes

El mockup base cubre la **landing page pública**. Estos son los mockups adicionales que se necesitan para el proyecto completo de la tienda:

### 6.1 Páginas públicas
- [ ] **Catálogo completo** — página `/catalogo` con filtros por categoría, material y precio; grid paginado; sin el hero de la landing
- [ ] **Detalle de producto** — página `/catalogo/[slug]` con galería de imágenes, especificaciones técnicas, materiales disponibles, precio y CTA cotizar
- [ ] **Proceso de cotización (flujo completo)** — pasos 1→2→3 del `PrintRequest` con el paso 3 (Revisión/Confirmación) funcionando y un estado "cotización enviada" como pantalla final

### 6.2 Autenticación
- [ ] **Login** — formulario email + contraseña, estilo oscuro consistente con el design system, enlace a registro
- [ ] **Registro** — nombre, email, contraseña, confirmación

### 6.3 Panel de cliente (dashboard)
- [ ] **Mis pedidos** — tabla/lista de pedidos con estado (Pendiente de cotización / En producción / Enviado / Entregado), filtros y orden
- [ ] **Detalle de pedido** — línea de tiempo del estado, especificaciones de la pieza, precio cotizado, datos de envío
- [ ] **Perfil** — editar datos personales, dirección de envío, cambiar contraseña

### 6.4 Panel de administrador
- [ ] **Dashboard admin** — métricas clave (pedidos activos, ingresos del mes, clientes nuevos), accesos rápidos
- [ ] **Gestión de pedidos** — tabla con todos los pedidos, cambio de estado, filtros avanzados
- [ ] **Gestión de productos/catálogo** — CRUD de productos, subir imágenes, asignar categorías y precios
- [ ] **Gestión de clientes** — lista de clientes, ver historial por cliente

---

## 7. Guía de migración TS → JS

| Patrón TypeScript | Equivalente JavaScript |
|---|---|
| `type Origin = "file" \| "design"` | Eliminar, usar comentario JSDoc si se quiere |
| `useState<Origin \| null>(null)` | `useState(null)` |
| `{ product }: { product: Product }` | `{ product }` |
| `as const` en arrays | Eliminar, usar array normal |
| `type LucideIcon` | Eliminar |
| `import type React from "react"` | Eliminar (en Vite no se necesita) |
| `Readonly<{ children: React.ReactNode }>` | `{ children }` directo |
| `React.DragEvent` | `e` sin tipo (o anotación JSDoc) |

**Cambios de Next.js → Vite:**
- `Image` de `next/image` → `<img>` nativo con `loading="lazy"`
- `"use client"` directivas → eliminar (Vite todo es cliente por defecto)
- `app/layout.tsx` con `Metadata` → `index.html` de Vite con las meta tags en el HTML
- `app/page.tsx` → `src/App.jsx` o componente de ruta con React Router
- Fuentes Google: link en `index.html` en lugar de `next/font/google`
- Variables CSS `--font-sans` / `--font-mono` → definir manualmente en el CSS global

---

*Documentado el 17 de septiembre de 2026 — mockup base v0 landing Vértice CR*
