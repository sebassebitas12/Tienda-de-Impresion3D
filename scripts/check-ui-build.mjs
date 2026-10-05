import { build } from 'vite';

// Build every public primitive, even before the App imports all of them.
await build({
  configLoader: 'runner',
  build: {
    write: false,
    rollupOptions: {
      input: 'src/components/ui/index.js',
      preserveEntrySignatures: 'strict',
    },
  },
});
