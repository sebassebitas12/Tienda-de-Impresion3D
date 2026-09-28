# Vértice CR — Roadmap

> Última actualización: **2026-09-26**. Fase actual: 3 — auditoría HF + cierre visual/UX. React bloqueado.

## Fase 3 completado

- 🟡 HF-01 Home: mockup HTML funcional en iteración (NO CONGELADO).
- ✅ HF-07 Carrito Híbrido: aprobado documental — UXMagic + validación Gemini (2026-09-24).
- ✅ HF-08 Checkout: aprobado documental — UXMagic + validación Gemini (2026-09-25).
- ✅ Dark/Light tokens definidos en doc 04.
- ✅ Accesibilidad WCAG 2.2 y mecanismo de ayuda definidos en doc 04.
- ✅ Benchmark de competidores documentado.
- ✅ Skills de diseño (Emil Kowalski, Impeccable, UI/UX Pro Max, etc.) integrados en doc 04.

## Ahora — 2026-09-26

1. **→ Iterar HF-01 Home** — continuar refinando el mockup HTML como única base del proyecto. NO ESTÁ CONGELADO.
2. Definir API externa + JWT y contratos de arquitectura antes de React.

*(Nota: No se harán mockups HTML adicionales. Una vez aprobado HF-01, se pasará directamente a React para las demás pantallas)*

## Después

3. Implementación React usando HF-01 como base de diseño.
4. Desarrollo de resto de pantallas (Catálogo, Solicitud, etc.) directamente en React.
5. Revisión desktop global en la app React.
6. Responsive y Mobile directamente en React.
7. Design System formal basado en componentes React.

## Calidad

17. Jest + Testing Library.
18. N8N workflows.
19. API externa integrada.
20. IA integrada.
21. Auditoría responsive/accessibility.
22. Build + coverage ≥ 70%.

## Gate de React

No empezar React hasta que estén cerrados:
- negocio + estados;
- HF desktop aprobados;
- Dark/Light aplicados;
- accesibilidad definida;
- API/JWT definidos;
- modelo de datos normalizado.

No crear otro roadmap paralelo.

## Histórico de actualizaciones

### 2026-09-26
- Corrección de estado: HF-01 NO está congelado y es el ÚNICO mockup HTML a iterar.
- El resto de pantallas (incluyendo HF-02 y HF-05) se construirán directamente en React.

### 2026-09-25
- HF-01 Home declarado falsamente congelado (revertido el 26).
- HF-08 aprobado con observación menor (resuelta).

### 2026-09-24
- HF-07 Carrito Híbrido congelado tras 2 iteraciones UXMagic.
- Primera propuesta HF-08 auditada con ajustes importantes.
