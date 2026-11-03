import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { CATALOG } from '../lib/catalog';
import { categoriesWithBlocks } from '../lib/blocks';
import { TEMPLATES } from '../lib/templates';

const TEMPLATE_ROUTES = TEMPLATES.map((t) => `/templates/${t.slug}`);

const BLOCK_ROUTES = categoriesWithBlocks().map((c) => `/blocks/${c.id}`);

const ROUTES = [
  '/',
  '/docs',
  '/docs/theming',
  '/docs/components',
  '/blocks',
  '/demo',
  '/templates',
  ...TEMPLATE_ROUTES,
  ...BLOCK_ROUTES,
  ...CATALOG.map((c) => `/docs/components/${c.slug}`),
];

// The star widgets call the GitHub API; stub it so tests are offline-safe and
// never hit rate limits.
const stubGitHub = (target: Page | import('@playwright/test').BrowserContext) =>
  target.route('https://api.github.com/**', (r) => r.fulfill({ json: { stargazers_count: 42 } }));

test.beforeEach(async ({ page }) => {
  await stubGitHub(page);
});

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
  for (const route of ['/', '/blocks', '/demo', '/docs', '/docs/components/button', '/docs/components/table', '/templates', ...TEMPLATE_ROUTES, ...BLOCK_ROUTES]) {
    test(`a11y (axe) ${theme} ${route}`, async ({ browser }) => {
      // Reduced motion renders every section in its final state, so axe never
      // measures text mid-fade.
      const ctx = await browser.newContext({ colorScheme: theme, reducedMotion: 'reduce' });
      await stubGitHub(ctx);
      const page = await ctx.newPage();
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('html')).toHaveAttribute('data-mode', theme);
      // Full WCAG A/AA in both themes, library demos included.
      const passes = [await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()];
      const summary = passes.flatMap((r) =>
        r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nodes, e.g. ${v.nodes[0]?.html.slice(0, 120)}`),
      );
      expect(summary, summary.join('\n')).toEqual([]);
      await ctx.close();
    });
  }
}

test('landing: live star count from the GitHub API', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Star Sorbet UI on GitHub, 42 stars' }).first()).toBeVisible();
});

test('landing: before/after slider moves with the keyboard', async ({ page }) => {
  await page.goto('/');
  const slider = page.getByRole('slider', { name: 'Compare default Material UI with Sorbet UI' });
  await slider.focus();
  await page.keyboard.press('Home');
  await expect(slider).toHaveValue('0');
  await page.keyboard.press('End');
  await expect(slider).toHaveValue('100');
});

test('landing: playground controls rewrite the source', async ({ page }) => {
  await page.goto('/');
  const code = page.locator('pre[aria-label="Playground source"]');
  await page.getByRole('group', { name: 'Variant' }).getByRole('button', { name: 'dash' }).click();
  await page.getByRole('radio', { name: 'danger' }).click();
  await expect(code).toContainText('variant="dash"');
  await expect(code).toContainText('color="danger"');
  await expect(page.getByTestId('playground-preview').getByRole('button', { name: 'Ship it' })).toBeVisible();
});

test('landing: command menu filters the catalog', async ({ page }) => {
  await page.goto('/');
  const menu = page.getByTestId('bento-cmdk');
  await menu.getByRole('combobox', { name: 'Search components' }).fill('tab');
  await expect(menu.getByRole('option')).toHaveText(['Tabs', 'Table']);
});

test('landing: hero dashboard tabs switch data', async ({ page }) => {
  await page.goto('/');
  const dash = page.getByTestId('hero-dashboard');
  await dash.getByRole('tab', { name: 'Orders' }).click();
  await expect(dash.getByRole('img', { name: /Orders over the last 8 weeks/ })).toBeVisible();
});

test('blocks: code tab shows the block source', async ({ page }) => {
  await page.goto('/blocks/hero');
  await page.getByRole('group', { name: 'Centered view' }).getByRole('button', { name: 'Code' }).click();
  await expect(page.locator('pre[aria-label="Centered source"]')).toContainText('export default function HeroCentered');
});

test('blocks: index lists 40+ blocks and search finds one', async ({ page }) => {
  await page.goto('/blocks');
  const placeholder = await page.getByRole('textbox', { name: 'Search blocks' }).getAttribute('placeholder');
  expect(Number(placeholder?.match(/\d+/)?.[0])).toBeGreaterThanOrEqual(40);
  await page.getByRole('textbox', { name: 'Search blocks' }).fill('pricing');
  await expect(page.getByTestId('block-search-results').getByRole('link').first()).toBeVisible();
});

test('demo: create an order, filter it, and see the toast', async ({ page }) => {
  await page.goto('/demo');
  const app = page.getByTestId('demo-app');
  const nav = app.getByRole('navigation', { name: 'Demo app' }).first();
  if (!(await nav.isVisible())) await app.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation', { name: 'Demo app' }).filter({ visible: true }).getByRole('button', { name: /Orders/ }).click();
  await app.getByRole('button', { name: 'New order' }).click();
  const dialog = page.getByRole('dialog', { name: 'New order' });
  await dialog.getByRole('textbox', { name: 'Customer name' }).fill('Test Buyer');
  await dialog.getByRole('spinbutton', { name: 'Amount (USD)' }).fill('120');
  await dialog.getByRole('button', { name: 'Create order' }).click();
  await expect(page.getByText(/Order #\d+ created/)).toBeVisible();
  await app.getByRole('textbox', { name: 'Search orders' }).fill('Test Buyer');
  await expect(app.getByRole('cell', { name: 'Test Buyer' })).toBeVisible();
});

test('templates: gallery links to a template whose source lists its blocks', async ({ page }) => {
  await page.goto('/templates');
  await page.getByRole('link', { name: /SaaS landing/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'SaaS landing' })).toBeVisible();
  await page.getByRole('button', { name: 'Get the code' }).click();
  await expect(page.locator('pre[aria-label="SaaS landing page source"]')).toContainText('<PricingTiers />');
});
