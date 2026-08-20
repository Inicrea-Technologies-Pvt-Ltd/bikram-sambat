/**
 * Prepends the "use client" directive to the built bundles.
 *
 * tsup's `banner` is dropped during bundling, rollup treats a module-level
 * directive in generated output as an error source and strips it, so the
 * directive has to go on afterwards. Without it, Next.js App Router users get
 * "useState only works in a Client Component" the first time they render the
 * picker.
 */
import { readFile, writeFile } from 'node:fs/promises';

const DIRECTIVE = "'use client';";
const targets = ['dist/index.js', 'dist/index.cjs'];

for (const target of targets) {
  const source = await readFile(target, 'utf8');
  if (source.startsWith(DIRECTIVE) || source.startsWith('"use client"')) continue;
  await writeFile(target, `${DIRECTIVE}\n${source}`);
  console.log(`added "use client" to ${target}`);
}
