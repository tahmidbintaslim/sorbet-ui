/* global URL, console, process */
// Builds a shadcn-compatible registry into public/r/ so any block installs with one command:
//   npx shadcn@latest add https://<site>/r/hero-centered.json
// Items:
//  - theme: registry/sorbet-provider.tsx plus the npm packages it needs.
//  - one item per block (blocks/<category>/<Id>.tsx), depending on the theme item.
// npm dependencies come from each file's imports. Output is generated at build time (gitignored).
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Absolute URL the items point at (registryDependencies). Override for local testing.
const BASE = (process.env.REGISTRY_URL ?? 'https://sorbetui.tahmid.space').replace(/\/$/, '');
const SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json';
const out = new URL('../public/r/', import.meta.url).pathname;
const blocksDir = new URL('../blocks/', import.meta.url).pathname;

/** HeroCentered -> hero-centered. Keep in sync with lib/registry.ts. */
const kebab = (id) => id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();

/** npm package names imported by a source file (react is assumed present). */
function npmDeps(source) {
  const pkgs = new Set();
  for (const [, spec] of source.matchAll(/from '([^'.][^']*)'/g)) {
    const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
    if (name !== 'react' && name !== 'react-dom' && !name.startsWith('@/')) pkgs.add(name);
  }
  return [...pkgs].sort();
}

const items = [];
const providerSource = readFileSync(new URL('../registry/sorbet-provider.tsx', import.meta.url), 'utf8');
items.push({
  $schema: SCHEMA,
  name: 'theme',
  type: 'registry:lib',
  title: 'Sorbet theme provider',
  description: 'SorbetProvider: wraps your app in the Sorbet light, dark or system theme. Existing MUI screens restyle.',
  dependencies: [...new Set([...npmDeps(providerSource), '@emotion/react', '@emotion/styled'])].sort(),
  files: [{ path: 'registry/sorbet-provider.tsx', type: 'registry:component', content: providerSource, target: 'components/sorbet/SorbetProvider.tsx' }],
});

for (const category of readdirSync(blocksDir).sort()) {
  const dir = join(blocksDir, category);
  if (!statSync(dir).isDirectory()) continue;
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.tsx')).sort()) {
    const raw = readFileSync(join(dir, file), 'utf8');
    const m = raw.match(/^\/\/ @block (\{.*\})$/m);
    if (!m) throw new Error(`blocks/${category}/${file} is missing its // @block {...} line`);
    const { name, description } = JSON.parse(m[1]);
    const id = file.replace('.tsx', '');
    // Same copy the site's Code tab shows: the metadata line is site plumbing.
    const content = raw.replace(/^\/\/ @block .*\n/m, '');
    items.push({
      $schema: SCHEMA,
      name: kebab(id),
      type: 'registry:block',
      title: `${name} (${category})`,
      description,
      categories: [category],
      dependencies: npmDeps(content),
      registryDependencies: [`${BASE}/r/theme.json`],
      files: [{ path: `blocks/${category}/${file}`, type: 'registry:component', content, target: `components/sorbet/${file}` }],
    });
  }
}

const names = items.map((i) => i.name);
if (new Set(names).size !== names.length) throw new Error('duplicate registry item name');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const item of items) writeFileSync(join(out, `${item.name}.json`), JSON.stringify(item, null, 2) + '\n');
// Index in the registry.json shape (files listed without content).
writeFileSync(
  join(out, 'registry.json'),
  JSON.stringify(
    {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: 'sorbet',
      homepage: BASE,
      items: items.map((item) => {
        const { $schema, files, ...rest } = item;
        void $schema;
        return { ...rest, files: files.map((f) => ({ path: f.path, type: f.type, target: f.target })) };
      }),
    },
    null,
    2,
  ) + '\n',
);
console.log(`gen-registry: ${items.length} items -> public/r (base ${BASE})`);
