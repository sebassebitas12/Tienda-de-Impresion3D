---
name: vertice-browser-audit
description: Audita mockups y páginas Vértice CR en navegador, priorizando coherencia visual, responsive, teclado y accesibilidad. Usa una pestaña conectada si está disponible y conserva una auditoría estática reproducible como respaldo.
---

# Vértice Browser Audit

Usa esta skill cuando el usuario pida revisar HF-01, comparar la interfaz con la rúbrica o validar accesibilidad/responsive.

## Orden de trabajo

1. Lee `AI_CONTEXT.md`, `docs/00-INDICE-Y-MAPA.md`, `docs/01-PRODUCTO-Y-ALCANCE.md`, `docs/04-DISENO-VISUAL-Y-ACCESIBILIDAD.md` y `docs/05-AUDITORIA-HF-Y-MOCKUPS.md`.
2. Intenta usar la pestaña de navegador conectada disponible en la sesión. No inventes una inspección visual si el navegador no aparece conectado.
3. Revisa, como mínimo, 375px, 768px y 1280px; estados Dark/Light; navbar; hero; chatbot; accesibilidad; idioma; foco y teclado.
4. Separa el resultado en: resuelto en mockup, pendiente de implementación y bloqueador de rúbrica.
5. Si no hay navegador conectado, ejecuta el script estático incluido y declara la limitación.
6. Documenta decisiones en los Markdown numerados existentes; no crees documentación paralela.

## Criterios visuales

- Usa HF-01 como fuente de verdad: Obsidian Precision Forge + Lava Orgánica.
- Comprueba jerarquía, espaciado, contraste, targets táctiles, consistencia de radios y que el motion no compita con el producto.
- No propongas rehacer HF-01 si el hallazgo pertenece a la capa de implementación React.

## Criterios de accesibilidad

- Verifica texto ajustable al 200%, `aria-label`, estados no dependientes solo del color, foco visible, Escape y orden de tabulación.
- Para lector de pantalla, busca `skip link`, landmarks, labels explícitos, `aria-live`, foco atrapado/retornado y alternativas textuales para iconos.
- Distingue claramente la base visual del mockup de la evidencia real de producción.

## Entrega

Entrega un veredicto breve, evidencia concreta, riesgos y el siguiente bloque recomendado. El plugin no debe afirmar que Brave está conectado si la sesión no expone ninguna pestaña.
