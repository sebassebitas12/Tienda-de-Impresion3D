# Vértice Browser Audit

Plugin local para revisar HF-01 y futuras pantallas de Vértice CR.

Incluye:

- `skills/vertice-browser-audit/SKILL.md`: flujo de auditoría visual, responsive y accesible.
- `scripts/audit-html.mjs`: comprobación estática reproducible para un HTML.

Uso local:

```powershell
node scripts/audit-html.mjs ..\..\mockups\hf-01-home.html
```

La auditoría en navegador requiere que la sesión exponga una pestaña conectada. El plugin no asume que Brave está disponible ni inventa una integración si el conector no aparece.
