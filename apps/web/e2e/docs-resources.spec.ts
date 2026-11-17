import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

// Help, support and resources: FAQ, changelog, support cards, footer and /llms.txt.
const GH = 'https://github.com/tahmidbintaslim/sorbet-ui';

test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/**', (r) => r.fulfill({ json: { stargazers_count: 42 } }));
});

test('faq: a question opens and closes from the keyboard', async ({ page }) => {
  await page.goto('/docs/faq');
  const q = page.getByRole('button', { name: 'Can I install it from npm?' });
  await expect(q).toHaveAttribute('aria-expanded', 'false');
  await q.focus();
  await page.keyboard.press('Enter');
  await expect(q).toHaveAttribute('aria-expanded', 'true');
  const panel = page.locator(`#${await q.getAttribute('aria-controls')}`);
  await expect(panel).toContainText('Not yet');
  await page.keyboard.press('Space');
  await expect(q).toHaveAttribute('aria-expanded', 'false');
});

test('faq: a #hash link opens that question, and FAQPage JSON-LD lists every question', async ({ page }) => {
  await page.goto('/docs/faq#license');
  await expect(page.getByRole('button', { name: 'What is the license?' })).toHaveAttribute('aria-expanded', 'true');
  const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? '{}')));
  const faq = ld.find((d) => d['@type'] === 'FAQPage');
  expect(faq).toBeTruthy();
  const buttons = await page.getByTestId('guide-body').locator('.MuiAccordionSummary-root').count();
  expect(faq.mainEntity.length).toBe(buttons);
  expect(faq.mainEntity.length).toBeGreaterThanOrEqual(12);
});

test('changelog: lists every version from CHANGELOG.md', async ({ page }) => {
  const md = readFileSync(fileURLToPath(new URL('../../../CHANGELOG.md', import.meta.url)), 'utf8');
  const versions = [...md.matchAll(/^##\s+\[?([^\]\s]+)\]?/gm)].map((m) => m[1]);
  expect(versions.length).toBeGreaterThan(0);
  await page.goto('/docs/changelog');
  const releases = page.getByTestId('release');
  await expect(releases).toHaveCount(versions.length);
  for (const v of versions) {
    await expect(page.getByRole('heading', { level: 2, name: `Version ${v}` })).toBeVisible();
    await expect(page.locator(`[data-testid="release"][data-version="${v}"]`)).toBeVisible();
  }
  // Categories become headings.
  for (const c of [...md.matchAll(/^###\s+(.+)$/gm)].map((m) => m[1]).slice(0, 3)) {
    await expect(page.getByRole('heading', { level: 3, name: c }).first()).toBeVisible();
  }
});

test('support: cards link to the right places on GitHub and the site', async ({ page }) => {
  await page.goto('/support');
  const expected: Record<string, string> = {
    'help-docs': '/docs',
    'help-faq': '/docs/faq',
    'help-bug': `${GH}/issues/new?template=bug_report.md`,
    'help-feature': `${GH}/issues/new?template=feature_request.md`,
    'help-question': `${GH}/issues/new?labels=question`,
    'help-security': `${GH}/blob/main/SECURITY.md`,
    'help-contributing': '/docs/contributing',
    'help-changelog': '/docs/changelog',
  };
  for (const [id, href] of Object.entries(expected)) await expect(page.getByTestId(id), id).toHaveAttribute('href', href);
  // Discussions are off for the repo, so the page never sends people there.
  await expect(page.locator('a[href*="/discussions"]')).toHaveCount(0);
  await expect(page.getByTestId('security-callout').getByRole('link', { name: 'Report a vulnerability' })).toHaveAttribute('href', `${GH}/security/advisories/new`);
  await expect(page.getByTestId('issue-checklist').locator('li')).toHaveCount(6);
  // Top questions open from the keyboard too.
  const q = page.getByRole('button', { name: 'Which Material UI versions are supported?' });
  await q.focus();
  await page.keyboard.press('Enter');
  await expect(q).toHaveAttribute('aria-expanded', 'true');
});

test('support: the search button opens the docs search', async ({ page }) => {
  await page.goto('/support');
  await page.getByTestId('docs-search-button').click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('footer: columns are there and every internal link resolves', async ({ page, request }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  for (const h of ['Docs', 'Resources', 'Community']) await expect(footer.getByRole('heading', { level: 2, name: h })).toBeVisible();
  await expect(footer).toContainText('MIT licensed');
  await expect(footer).toContainText(String(new Date().getFullYear()));
  const hrefs = await footer.locator('a[href^="/"]').evaluateAll((els) => [...new Set(els.map((a) => a.getAttribute('href')!))]);
  for (const p of ['/docs', '/docs/installation', '/docs/changelog', '/docs/brand', '/support', '/docs/contributing']) expect(hrefs).toContain(p);
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});

test('llms.txt: responds with links to every docs page', async ({ request }) => {
  const res = await request.get('/llms.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body.startsWith('# Sorbet UI')).toBe(true);
  expect(body).toContain('/docs/installation)');
  expect(body).toContain('/docs/components/button)');
  expect(body).toMatch(/^## Getting started$/m);
});
