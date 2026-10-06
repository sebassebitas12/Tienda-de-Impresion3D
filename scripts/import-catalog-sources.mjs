import { readFile, writeFile } from 'node:fs/promises';

const read = async path => JSON.parse(await readFile(path, 'utf8'));
const [data, selection, manifest, downloads] = await Promise.all([
  read('db.json'), read('automation/catalog/catalog-selection.json'),
  read('automation/catalog/printables-sources.json'), read('automation/catalog/asset-receipts.json'),
]);
const byId = values => new Map(values.map(value => [value.productId || value.id, value]));
const selected = byId(selection.products);
const sources = byId(manifest.sources);
const receipts = byId(downloads.receipts);
data.products = data.products.map(product => {
  const definition = selected.get(product.id);
  if (!definition) return product;
  const source = sources.get(product.id);
  const receipt = receipts.get(product.id);
  if (!source || !receipt?.assets.length) throw new Error(`Missing evidence: ${product.id}`);
  const { fileId, componentLabel, originalAuthor, ...fields } = definition;
  return {
    ...product, ...fields,
    images: receipt.assets.map(asset => asset.path),
    imageDetails: receipt.assets.map((asset, index) => ({ ...asset, label: `Vista del diseño ${index + 1}` })),
    source: {
      platform: 'Printables', modelId: source.id,
      url: `https://www.printables.com/model/${source.id}`,
      author: source.user.publicUsername, originalAuthor: originalAuthor || null,
      license: source.license.name, retrievedAt: source.retrievedAt,
      purpose: 'EDUCATIONAL_DEMO',
    },
    modelEvidence: {
      fileId, fileName: receipt.fileName, sha256: receipt.modelSha256,
      scope: componentLabel ? 'COMPONENT' : 'SELECTED_FILE',
      componentLabel: componentLabel || null, slicingStatus: 'PENDING',
    },
    priceSource: 'DEMO', productionDataSource: 'DEMO_NOT_SLICED',
  };
});
await writeFile('db.json', `${JSON.stringify(data, null, 2)}\n`);
console.log(`Imported ${selected.size} educational designs; other collections preserved.`);
