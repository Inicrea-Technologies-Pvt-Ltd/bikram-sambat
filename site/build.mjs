/**
 * Builds docs/index.html by inlining the built core bundle into site/index.html.
 *
 * The demo runs the real published code rather than a copy, so the page cannot
 * drift from the package — and it stays a single self-contained file with no
 * network requests, which is what static hosting and Artifacts both want.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const bundle = (await readFile(join(root, 'packages/core/dist/index.cjs'), 'utf8'))
  .replace(/^\/\/# sourceMappingURL=.*$/gm, '')
  .replace("'use strict';", '')
  .trim();

const template = await readFile(join(here, 'index.html'), 'utf8');
const PLACEHOLDER = '/*__BIKRAM_BUNDLE__*/';
if (!template.includes(PLACEHOLDER)) {
  throw new Error(`site/index.html is missing ${PLACEHOLDER}`);
}

await mkdir(join(root, 'docs'), { recursive: true });
const output = template.replace(PLACEHOLDER, bundle);
await writeFile(join(root, 'docs/index.html'), output);
console.log(`docs/index.html written (${(output.length / 1024).toFixed(1)} kB, self-contained)`);
