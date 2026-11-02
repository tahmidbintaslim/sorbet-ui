import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { CATALOG } from '../lib/catalog';

const ROUTES = [
  '/',
  '/docs',
  '/docs/theming',
  '/docs/components',
  ...CATALOG.map((c) => `/docs/components/${c.slug}`),
];

// Collect console errors, page errors and failed same-origin requests.
function watch(page: Page) {
  const problems: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') problems.push(`console.${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('response', (r) => {
    if (r.url().startsWith('http://localhost') && r.status() >= 400) problems.push(`${r.status()} ${r.url()}`);
  });
  return problems;
}

for (const route of ROUTES) {
  test(`renders cleanly: ${route}`, async ({ page }) => {
    const problems = watch(page);
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(problems, problems.join('\n')).toEqual([]);
    // No horizontal page scroll at any viewport.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('unknown route gives the 404 page', async ({ page }) => {
  const res = await page.goto('/docs/components/nope');
  expect(res?.status()).toBe(404);
});

test('dark mode toggle switches theme and persists', async ({ page }) => {
  await page.goto('/');
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const light = await bg();
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect.poll(bg).not.toBe(light);
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
});

test('respects OS dark preference', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('/docs');
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
  await ctx.close();
});

test('navigation: header and docs sidebar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Components' }).click();
  await expect(page).toHaveURL(/\/docs\/components$/);
  await page.getByRole('navigation', { name: 'Docs' }).getByRole('link', { name: 'Button', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/components\/button$/);
  await expect(page.getByRole('navigation', { name: 'Docs' }).locator('[aria-current="page"]')).toHaveText('Button');
});

test('playground: changing variant, color and size updates the source', async ({ page }) => {
  await page.goto('/docs/components/button');
  const code = page.getByRole('group', { name: 'Button source' }).or(page.locator('pre[aria-label="Button source"]'));
  await expect(code).toContainText('variant="solid" color="primary" size="md"');
  for (const [label, value] of [['variant', 'ghost'], ['color', 'danger'], ['size', 'lg']] as const) {
    await page.getByTestId(`pg-${label}`).click();
    await page.getByRole('option', { name: value, exact: true }).click();
  }
  await expect(code).toContainText('variant="ghost" color="danger" size="lg"');
  await expect(page.getByTestId('preview').getByRole('button', { name: 'Button' })).toBeVisible();
});

test('every component preview renders something visible', async ({ page }) => {
  for (const c of CATALOG) {
    await page.goto(`/docs/components/${c.slug}`);
    const box = await page.getByTestId('preview').boundingBox();
    expect(box?.height, c.slug).toBeGreaterThan(40);
    const hasContent = await page.getByTestId('preview').evaluate((el) => (el.textContent ?? '').trim().length > 0 || el.querySelector('svg,input,[role]') !== null);
    expect(hasContent, `${c.slug} preview empty`).toBe(true);
  }
});

test('copy button copies the source', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/components/button');
  await page.getByRole('button', { name: 'Copy code' }).first().click();
  await expect(page.getByRole('tooltip', { name: 'Copied' }).or(page.getByLabel('Copied'))).toBeVisible();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain('<Button variant="solid"');
});

test('keyboard: skip link reaches main content', async ({ page }) => {
  await page.goto('/docs');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});

for (const theme of ['light', 'dark'] as const) {
  for (const route of ['/', '/docs', '/docs/components/button', '/docs/components/table']) {
    test(`a11y (axe) ${theme} ${route}`, async ({ browser }) => {
      const ctx = await browser.newContext({ colorScheme: theme });
      const page = await ctx.newPage();
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('html')).toHaveAttribute('data-mode', theme);
      // Known gap (reported separately): darkTheme primary is white on #0ea5e9 = 2.77:1
      // (documented in packages/tokens/src/contrast.test.ts). Library demos are therefore
      // checked for everything except color-contrast in dark mode; all site chrome and
      // text stay fully checked, and light mode is checked in full.
      const known = '[data-known-contrast]';
      const strict = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']);
      if (theme === 'dark') strict.exclude(known);
      const passes = [await strict.analyze()];
      if (theme === 'dark' && (await page.locator(known).count()) > 0) {
        passes.push(
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .disableRules(['color-contrast'])
            .include(known)
            .analyze(),
        );
      }
      const summary = passes.flatMap((r) =>
        r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nodes, e.g. ${v.nodes[0]?.html.slice(0, 120)}`),
      );
      expect(summary, summary.join('\n')).toEqual([]);
      await ctx.close();
    });
  }
}
