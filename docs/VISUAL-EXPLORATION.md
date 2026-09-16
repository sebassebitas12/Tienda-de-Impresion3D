# Vértice CR — Exploración visual y herramientas

> Documento de trabajo. **Nada de esta exploración se considera definitivo todavía.**
> El objetivo es probar alternativas visuales antes de cerrar el libro de marca y el design system.

**Fecha:** 2026-09-16  
**Rama:** `Pruebas`

---

## 1. Objetivo de esta etapa

La intención no es elegir todavía una herramienta definitiva ni congelar la identidad visual.

Primero se realizarán pruebas de mockups y prototipos para comprobar qué combinación de color, iluminación, profundidad, textura y movimiento representa mejor a Vértice CR.

La referencia conceptual viene de experiencias digitales que utilizan movimiento ambiental, brillo y capas visuales para evitar que una interfaz se perciba plana o genérica. Una referencia mencionada durante la exploración fue el fondo dinámico de PlayStation 3: no se busca copiar ese recurso, sino estudiar la sensación de **atmósfera viva y movimiento sutil**.

---

## 2. Dirección visual actualmente explorada

### Concepto provisional

**Tecnología de fabricación digital + identidad costarricense + materialidad volcánica.**

La interfaz debe poder transmitir:

- tecnología de precisión
- fabricación y materia
- profundidad
- luz controlada
- movimiento ambiental
- calidad/presencia premium
- cercanía, sin parecer una marca corporativa fría

No se busca una estética gamer ni una página saturada de efectos.

---

## 3. Paleta experimental

La siguiente paleta es una **propuesta de prueba**, no una decisión final del libro de marca.

| Rol conceptual | Nombre | Hex | Uso experimental |
|---|---|---|---|
| Fondo | Carbón volcánico | `#0D0B09` | Fondo base |
| Superficie | Obsidiana | `#141412` | Cards y paneles |
| Elevación | Ceniza oscura | `#1E1C19` | Inputs y elementos elevados |
| Acento | Lava | `#FF5A1F` | CTA y acciones principales |
| Hover/activo | Magma | `#E03D00` | Hover, estados activos |
| Acento suave | Brasa | `#FF8C5A` | Links, detalles y pequeños reflejos |
| Texto principal | Papel volcánico | `#EDE8E0` | Texto principal |
| Texto secundario | Humo | `#6B6560` | Metadatos y texto secundario |
| Borde | Escoria | `#2A2420` | Separadores y bordes |
| Éxito | Musgo | `#4CAF50` | Estados positivos |
| Error | Sangre | `#EF4444` | Validaciones y errores |

### Regla experimental del naranja

El naranja no debe dominar todas las superficies. La hipótesis a probar es utilizarlo principalmente como **fuente de atención e iluminación**, no como color de fondo general.

Ejemplos a probar:

- CTA principal
- precio destacado
- foco de luz sobre un objeto 3D
- borde activo
- reflejo sutil
- estados hover
- pequeños elementos decorativos

---

## 4. Movimiento ambiental

### Qué queremos conseguir

La página debe sentirse viva incluso cuando el usuario está quieto.

El movimiento debería ser:

- lento
- continuo pero discreto
- decorativo y no obstructivo
- relacionado con luz, textura o profundidad
- independiente de las acciones principales del usuario

### Recursos que vale la pena probar

1. Gradientes que se desplazan muy lentamente.
2. Blobs o formas orgánicas con movimiento suave.
3. Iluminación difusa que recorre una superficie.
4. Blur animado de baja amplitud.
5. Parallax sutil entre capas.
6. Texturas abstractas inspiradas en roca, humo o materiales impresos.
7. Objetos 3D con rotación muy lenta.
8. Partículas muy limitadas, solo si realmente aportan a la composición.

### Recursos que todavía no aprobamos

- partículas permanentes en grandes cantidades
- glow excesivo
- fondos tipo videojuego
- animaciones rápidas
- efectos que reduzcan legibilidad
- movimiento que afecte navegación o rendimiento

---

## 5. Herramientas bajo evaluación

No existe una herramienta definitiva en esta etapa. Se probarán diferentes opciones según el problema que resuelvan.

| Herramienta | Posible función | Estado |
|---|---|---|
| **Framer** | Mockups HF y prototipos animados | Por probar |
| **Spline** | Escenas 3D, objetos, iluminación y fondos interactivos | Por probar |
| **Figma** | Sistema de diseño, componentes y documentación | Por evaluar |
| **Stitch** | Exploración rápida de layouts y primeras ideas | Referencia/prototipo rápido |
| **Rive** | Microinteracciones y animaciones con estados | Por evaluar |
| **IA generativa** | Explorar conceptos visuales y referencias | Por definir |
| **React + CSS** | Implementación final de los efectos seleccionados | Etapa posterior |

### Criterio para elegir herramientas

No se elegirá una herramienta únicamente porque genere diseños llamativos. Debe permitir comprobar la idea y, cuando corresponda, trasladarla razonablemente al producto final.

También se debe considerar:

- límites de uso o créditos/tokens
- posibilidad de iterar varias veces
- facilidad para exportar o documentar
- compatibilidad con el stack final
- rendimiento de los efectos
- accesibilidad
- coste real si se vuelve necesaria en el flujo del proyecto

---

## 6. Flujo experimental propuesto

```text
Idea visual
    ↓
Exploración rápida
    ↓
Mockup/prototipo animado
    ↓
Comparación de alternativas
    ↓
Seleccionar recursos que realmente funcionan
    ↓
Documentar decisiones
    ↓
Libro de marca
    ↓
Design system
    ↓
Implementación React
```

La regla es **probar antes de formalizar**.

---

## 7. Qué se debe probar primero

### Prueba A — Fondo vivo

Construir una pantalla hero con fondo carbón y estudiar tres variantes:

- gradiente animado
- textura orgánica con iluminación
- escena 3D muy sutil

### Prueba B — Uso del naranja

Comparar el mismo hero utilizando `#FF5A1F` como:

- CTA principal solamente
- iluminación ambiental
- combinación CTA + iluminación

### Prueba C — Profundidad

Comparar una interfaz plana contra una interfaz con:

- capas
- blur
- sombras controladas
- reflejos
- profundidad 3D

### Prueba D — Movimiento

Comparar:

- estático
- movimiento ambiental lento
- movimiento ambiental + interacción del cursor

El objetivo de estas pruebas es encontrar la cantidad de movimiento que aporta personalidad sin convertir la interfaz en una demostración de efectos.

---

## 8. Resultado que buscamos

Una página que pueda reconocerse como Vértice CR sin depender únicamente del logo o del color naranja.

La identidad debería sentirse a través de:

```text
color
+
luz
+
materialidad
+
profundidad
+
tipografía
+
composición
+
movimiento
```

Si al retirar el naranja la interfaz sigue teniendo personalidad, la identidad visual estará funcionando como sistema y no como simple combinación de colores.

---

## 9. Decisión actual

**Estado: exploración abierta.**

No se aprueba todavía:

- paleta definitiva
- herramienta definitiva de mockups
- lenguaje definitivo de animación
- uso definitivo de 3D
- libro de marca
- design tokens finales

Sí se aprueba como dirección de investigación:

> **Explorar una identidad volcánica y tecnológica, con naranja lava como posible acento, sobre fondos oscuros cálidos y con movimiento ambiental sutil.**

Esta definición puede cambiar después de las pruebas.
