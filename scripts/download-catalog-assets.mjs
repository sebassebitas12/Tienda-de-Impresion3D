import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const manifest = JSON.parse(await readFile('automation/catalog/printables-sources.json', 'utf8'));
const selection = JSON.parse(await readFile('automation/catalog/catalog-selection.json', 'utf8'));
const receipts = [];
const downloadQuery = 'mutation($id:ID!,$printId:ID!){getDownloadLink(id:$id,printId:$printId,fileType:stl,source:model_detail){ok output{link}}}';
for (const item of selection.products) {
  const source = manifest.sources.find(source => source.productId === item.id);
  const directory = resolve('public/images/catalog', item.id);
  await mkdir(directory, { recursive: true });
  const photos = [...new Set([source.image?.filePath, ...source.images.map(image => image.filePath)].filter(Boolean))].slice(0, 4);
  const assets = [];
  for (const [index, photo] of photos.entries()) {
    const url = new URL(photo, 'https://media.printables.com/');
    const extension = extname(url.pathname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(extension)) continue;
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Image ${item.id}: ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const path = `/images/catalog/${item.id}/source-${index + 1}${extension}`;
    await writeFile(resolve('public', path.slice(1)), bytes);
    assets.push({ path, sourceUrl: url.href, kind: 'SOURCE_IMAGE', sha256: createHash('sha256').update(bytes).digest('hex') });
  }
  const file = source.stls.find(file => file.id === item.fileId);
  if (!file) throw new Error(`Missing selected file: ${item.id}`);
  const response = await fetch('https://api.printables.com/graphql/', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: downloadQuery, variables: { id: file.id, printId: source.id } }), signal: AbortSignal.timeout(30000),
  });
  const result = await response.json();
  const link = result.data?.getDownloadLink?.output?.link;
  if (!result.data?.getDownloadLink?.ok || !link) throw new Error(`No download for ${item.id}: ${JSON.stringify(result.errors || result.data)}`);
  const download = await fetch(link, { signal: AbortSignal.timeout(60000) });
  if (!download.ok) throw new Error(`Download ${item.id}: ${download.status}`);
  const bytes = Buffer.from(await download.arrayBuffer());
  if (bytes.length !== file.fileSize) throw new Error(`File size mismatch: ${item.id}`);
  const modelPath = `.local-data/catalog/models/${item.id}${extname(file.name).toLowerCase()}`;
  await mkdir(resolve('.local-data/catalog/models'), { recursive: true });
  await writeFile(modelPath, bytes);
  receipts.push({ productId: item.id, modelId: source.id, fileId: file.id, fileName: file.name, modelPath, modelSha256: createHash('sha256').update(bytes).digest('hex'), assets });
  console.log(`${item.id}: ${assets.length} imágenes; ${file.name} (${bytes.length} bytes)`);
}
await writeFile('automation/catalog/asset-receipts.json', `${JSON.stringify({ purpose: 'EDUCATIONAL_DEMO', retrievedAt: new Date().toISOString(), receipts }, null, 2)}\n`);
