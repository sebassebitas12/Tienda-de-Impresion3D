import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const ids = ['997093', '179001', '816298', '1064446', '3119', '820622', '459406', '655759', '174099', '359285', '1654733', '872395', '157304', '159941', '1190568', '1318189', '560322', '1125173', '139614', '863767', '383022', '596844', '988521', '339099', '1251149'];
const query = 'query($id:ID!){print(id:$id){id name slug description user{publicUsername handle} license{id name} image{filePath} images{filePath} stls{id name filePreviewPath fileSize}}}';
const output = resolve('automation/catalog/printables-sources.json');
const sources = [];
for (const [index, id] of ids.entries()) {
  const response = await fetch('https://api.printables.com/graphql/', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { id } }), signal: AbortSignal.timeout(30000),
  });
  const result = await response.json();
  if (!response.ok || result.errors || !result.data?.print) throw new Error(`Printables ${id}: ${JSON.stringify(result.errors || response.status)}`);
  sources.push({ productId: `p${index + 1}`, retrievedAt: new Date().toISOString(), ...result.data.print });
  console.log(`p${index + 1}: ${result.data.print.name} | ${result.data.print.license.name} | ${result.data.print.images.length} imágenes | ${result.data.print.stls.length} archivos`);
}
await mkdir(resolve('automation/catalog'), { recursive: true });
await writeFile(output, `${JSON.stringify({ purpose: 'EDUCATIONAL_DEMO', platform: 'Printables', sources }, null, 2)}\n`);
console.log(`Manifest: ${output}`);
