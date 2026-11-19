// Build-time facts read from the component source (packages/react/src), so the docs
// pages cannot drift from the code. Server only: runs while the static site is built.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), '../../packages/react/src');

export type ComponentFacts = {
  name: string;
  variants: string[];
  defaults: { variant: string; color: string; size: string };
  /** The component sets the token font stack (Inter first) in its own styles. */
  tokenFont: boolean;
};

function read(name: string) {
  return readFileSync(join(SRC, `${name}.tsx`), 'utf8');
}

/** Component files: every src/<Name>.tsx that is not a story or a test. */
export function componentNames(): string[] {
  return readdirSync(SRC)
    .filter((f) => /^[A-Z]\w+\.tsx$/.test(f) && !f.includes('.stories') && !f.includes('.test'))
    .map((f) => f.replace('.tsx', ''))
    .sort();
}

function firstDefault(src: string, prop: string, file: string) {
  const m = src.match(new RegExp(`\\b${prop} = '([a-z]+)'`));
  if (!m) throw new Error(`docs: no default ${prop} found in packages/react/src/${file}.tsx`);
  return m[1];
}

export function componentFacts(): ComponentFacts[] {
  return componentNames().map((name) => {
    const src = read(name);
    // Button widens the shared variant union with its own `dash` and `link`.
    const union = src.match(/type SorbetVariant = ([^;]+);/);
    const variants = union && /'dash'|'link'/.test(union[1]) ? union[1].match(/'([a-z]+)'/g)!.map((v) => v.slice(1, -1)) : ['solid', 'soft', 'outlined', 'ghost', 'plain'];
    return {
      name,
      variants,
      defaults: { variant: firstDefault(src, 'variant', name), color: firstDefault(src, 'color', name), size: firstDefault(src, 'size', name) },
      tokenFont: /fontFamily\.sans|fontFamily: typography\.fontFamily/.test(src),
    };
  });
}
