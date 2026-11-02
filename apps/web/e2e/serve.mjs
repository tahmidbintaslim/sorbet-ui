/* global URL, process, console */
// Minimal static server for the exported site in ./out (clean URLs, 404 page).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../out', import.meta.url));
const port = Number(process.env.PORT ?? 3100);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
};

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  for (const candidate of [clean, `${clean}.html`, join(clean, 'index.html')]) {
    const full = join(root, candidate);
    if (!full.startsWith(root)) continue;
    try {
      if ((await stat(full)).isFile()) return full;
    } catch {
      /* try next */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? '/');
  const status = file ? 200 : 404;
  const target = file ?? join(root, '404.html');
  try {
    const body = await readFile(target);
    res.writeHead(status, { 'content-type': types[extname(target)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(port, () => console.log(`serving ${root} on :${port}`));
