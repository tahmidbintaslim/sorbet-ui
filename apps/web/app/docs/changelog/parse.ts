// Build-time reader for the repo's changelogs: the root CHANGELOG.md, any
// packages/*/CHANGELOG.md that Changesets writes once releases start, and pending
// .changeset/*.md entries. Keep a Changelog headings become release objects.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type Block = { kind: 'p'; text: string } | { kind: 'ul'; items: string[] };
export type Category = { title: string; blocks: Block[] };
export type Release = {
  /** e.g. "0.1.0" */
  version: string;
  /** ISO date, or undefined when the heading says "Unreleased". */
  date?: string;
  unreleased: boolean;
  intro: Block[];
  categories: Category[];
};
export type Changelog = { source: string; intro: Block[]; releases: Release[] };

/** Monorepo root, from apps/web (where next build runs). */
const ROOT = join(process.cwd(), '..', '..');

function blocks(lines: string[]): Block[] {
  const out: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) out.push({ kind: 'p', text: para.join(' ') });
    para = [];
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    const item = /^\s*[-*]\s+(.*)$/.exec(line);
    if (item) {
      flush();
      const last = out[out.length - 1];
      if (last?.kind === 'ul') last.items.push(item[1]);
      else out.push({ kind: 'ul', items: [item[1]] });
    } else if (line.trim() === '') {
      flush();
    } else {
      const last = out[out.length - 1];
      // A wrapped list item continues on an indented line.
      if (!para.length && last?.kind === 'ul' && /^\s+\S/.test(line)) last.items[last.items.length - 1] += ` ${line.trim()}`;
      else para.push(line.trim());
    }
  }
  flush();
  return out;
}

export function parseChangelog(md: string, source: string): Changelog {
  const lines = md.split(/\r?\n/);
  const intro: string[] = [];
  const releases: Release[] = [];
  let release: Release | null = null;
  let section: string[] = [];
  let category: string | null = null;

  const closeSection = () => {
    if (!release) return;
    if (category) release.categories.push({ title: category, blocks: blocks(section) });
    else release.intro = blocks(section);
    section = [];
  };

  for (const line of lines) {
    if (/^#\s/.test(line)) continue; // the file title
    const h2 = /^##\s+\[?([^\]\s]+)\]?(?:\s*-\s*(.+))?\s*$/.exec(line);
    if (h2) {
      closeSection();
      const when = h2[2]?.trim();
      release = {
        version: h2[1],
        date: when && /^\d{4}-\d{2}-\d{2}$/.test(when) ? when : undefined,
        unreleased: !when || /unreleased/i.test(when),
        intro: [],
        categories: [],
      };
      releases.push(release);
      category = null;
      continue;
    }
    const h3 = /^###\s+(.+)$/.exec(line);
    if (h3 && release) {
      closeSection();
      category = h3[1].trim();
      continue;
    }
    if (release) section.push(line);
    else intro.push(line);
  }
  closeSection();
  return { source, intro: blocks(intro), releases };
}

/** The root changelog plus any per-package changelogs, in that order. */
export function readChangelogs(): Changelog[] {
  const out: Changelog[] = [];
  const root = join(ROOT, 'CHANGELOG.md');
  if (existsSync(root)) out.push(parseChangelog(readFileSync(root, 'utf8'), 'CHANGELOG.md'));
  const pkgs = join(ROOT, 'packages');
  if (existsSync(pkgs)) {
    for (const dir of readdirSync(pkgs).sort()) {
      const file = join(pkgs, dir, 'CHANGELOG.md');
      if (existsSync(file)) out.push(parseChangelog(readFileSync(file, 'utf8'), `packages/${dir}/CHANGELOG.md`));
    }
  }
  return out;
}

export type PendingChange = { file: string; packages: string[]; summary: string };

/** Changesets waiting for the next release (.changeset/*.md, minus its README). */
export function readPendingChangesets(): PendingChange[] {
  const dir = join(ROOT, '.changeset');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .sort()
    .map((f) => {
      const raw = readFileSync(join(dir, f), 'utf8');
      const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
      const packages = fm ? [...fm[1].matchAll(/["']?(@?[\w./-]+)["']?\s*:\s*(major|minor|patch)/g)].map((m) => `${m[1]} (${m[2]})`) : [];
      return { file: f, packages, summary: (fm ? fm[2] : raw).trim() };
    });
}
