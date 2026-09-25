import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Uso: node scripts/audit-html.mjs <archivo.html>');
  process.exit(1);
}

const html = fs.readFileSync(file, 'utf8');
const checks = [
  ['hero', /id=["']hero-visual["']/.test(html)],
  ['navbar', /id=["']account-toggle["']/.test(html)],
  ['language toggle', /id=["']language-toggle["']/.test(html)],
  ['accessibility panel', /id=["']accessibility-panel["']/.test(html)],
  ['text scaling', /data-text-size=["']xlarge["']/.test(html)],
  ['chat panel', /id=["']chat-panel["']/.test(html)],
  ['responsive css', /@media\s*\(/.test(html)],
  ['reduced motion', /prefers-reduced-motion|accessibility-no-motion/.test(html)],
  ['aria labels', /aria-label=/.test(html)],
  ['aria live region', /aria-live=/.test(html)],
  ['focus trap implementation', /focus trap|focusTrap|trapFocus/.test(html)]
];

console.log(`Auditando: ${file}`);
for (const [name, passed] of checks) console.log(`${passed ? 'PASS' : 'GAP '}  ${name}`);
console.log(`\nResultado: ${checks.filter(([, passed]) => passed).length}/${checks.length} checks presentes.`);
