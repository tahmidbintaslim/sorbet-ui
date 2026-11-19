// The customization and guide pages: their live examples work, and every
// "On this page" link lands on a heading. (site.spec.ts already renders and
// axe-checks every docs page in light and dark.)
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const GUIDES = [
  '/docs/theming',
  '/docs/customization/colors',
  '/docs/customization/typography',
  '/docs/customization/dark-mode',
  '/docs/customization/variants',
  '/docs/customization/override-styles',
  '/docs/guides/forms',
  '/docs/guides/accessibility',
  '/docs/guides/server-rendering',
  '/docs/guides/routing',
  '/docs/guides/ai',
];

test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/**', (r) => r.fulfill({ json: { stargazers_count: 42 } }));
});

/** The TOC links, from the aside on wide screens or the disclosure on narrow ones. */
async function tocLinks(page: Page) {
  const toc = page.getByRole('navigation', { name: 'On this page' });
  const visible = toc.filter({ visible: true });
  if ((await visible.count()) === 0) {
    await page.getByTestId('toc-disclosure').locator('summary').click();
  }
  return page.getByRole('navigation', { name: 'On this page' }).filter({ visible: true }).getByRole('link');
}

for (const route of GUIDES) {
  test(`toc: every link on ${route} targets a heading on the page, and no draft text is left`, async ({ page }) => {
    await page.goto(route);
    const body = page.getByTestId('guide-body');
    await expect(body).not.toContainText('Draft.');
    const links = await tocLinks(page);
    const hrefs = await links.evaluateAll((els) => els.map((a) => a.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThan(3);
    for (const href of hrefs) {
      expect(href).toMatch(/^#/);
      const heading = page.locator(`${href!}`);
      await expect(heading, href!).toHaveCount(1);
      expect(await heading.evaluate((el) => /^H[23]$/.test(el.tagName)), href!).toBe(true);
    }
  });
}

test('toc: following a link scrolls its heading into view', async ({ page }) => {
  await page.goto('/docs/customization/override-styles');
  const links = await tocLinks(page);
  await links.filter({ hasText: 'Pitfalls' }).click();
  await expect(page).toHaveURL(/#pitfalls$/);
  await expect(page.getByRole('heading', { level: 2, name: 'Pitfalls' })).toBeInViewport();
});

test('variants: the live matrix renders every variant by every color, for Button and Chip', async ({ page }) => {
  await page.goto('/docs/customization/variants');
  const matrix = page.getByTestId('variant-matrix');
  await expect(matrix).toHaveAttribute('data-kind', 'button');
  // 7 Button variants (5 + dash + link) × 7 colors.
  await expect(matrix.locator('tbody button')).toHaveCount(49);
  for (const v of ['solid', 'soft', 'outlined', 'ghost', 'plain', 'dash', 'link']) {
    await expect(matrix.getByRole('rowheader', { name: v, exact: true })).toBeVisible();
  }
  // Switch to Chip: 5 variants × 7 colors, no dash or link rows.
  await page.getByRole('group', { name: 'Component' }).getByRole('button', { name: 'Chip' }).click();
  await expect(matrix).toHaveAttribute('data-kind', 'chip');
  await expect(matrix.locator('tbody .MuiChip-root')).toHaveCount(35);
  await expect(matrix.getByRole('rowheader', { name: 'dash' })).toHaveCount(0);
  // Size picker changes the rendered size.
  const chip = matrix.locator('tbody .MuiChip-root').first();
  const small = (await chip.boundingBox())!.height;
  await page.getByRole('group', { name: 'Size' }).getByRole('button', { name: 'xl' }).click();
  await expect.poll(async () => (await chip.boundingBox())!.height).toBeGreaterThan(small);
});

test('variants: the support table lists every component file', async ({ page }) => {
  await page.goto('/docs/customization/variants');
  const table = page.getByRole('region', { name: 'Variant, color and size defaults per component' });
  await expect(table.getByRole('row', { name: /^Button / })).toContainText('dash, link');
  await expect(table.getByRole('row', { name: /^Alert / })).toContainText('soft');
  expect(await table.locator('tbody tr').count()).toBeGreaterThanOrEqual(29);
});

test('forms: submitting empty shows a focused error summary; fixing the fields submits', async ({ page }) => {
  await page.goto('/docs/guides/forms');
  const form = page.getByTestId('signup-form');
  await form.getByRole('button', { name: 'Create account' }).click();

  const summary = page.getByTestId('error-summary');
  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
  await expect(summary).toContainText('Fix 5 fields to continue');
  await expect(form.getByLabel('Full name')).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByRole('combobox', { name: 'Role' })).toHaveAttribute('aria-invalid', 'true');

  // A summary link moves focus to its field.
  await summary.getByRole('link', { name: 'Enter your email address' }).click();
  await expect(form.getByLabel('Email', { exact: true })).toBeFocused();

  // An invalid email gets a specific message; errors clear as fields are fixed.
  await form.getByLabel('Full name').fill('Sam Rivera');
  await form.getByLabel('Email', { exact: true }).fill('sam@');
  await form.getByRole('button', { name: 'Create account' }).click();
  await expect(summary).toContainText('Fix 4 fields to continue');
  await expect(summary).toContainText('Enter an email address like sam@example.com');

  await form.getByLabel('Email', { exact: true }).fill('sam@example.com');
  await form.getByLabel('Password').fill('correct-horse');
  await form.getByRole('combobox', { name: 'Role' }).click();
  await page.getByRole('option', { name: 'Engineering' }).click();
  await form.getByRole('checkbox', { name: 'I agree to the terms of service' }).check();
  await form.getByRole('button', { name: 'Create account' }).click();

  await expect(summary).toHaveCount(0);
  await expect(page.getByTestId('signup-success')).toContainText('Account created for Sam Rivera');
  await expect(form.getByLabel('Full name')).toHaveValue('');
});

test('forms: the form with its error summary open passes axe in light and dark', async ({ browser }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    const ctx = await browser.newContext({ colorScheme, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/docs/guides/forms');
    await page.getByTestId('signup-form').getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByTestId('error-summary')).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).include('[data-testid="signup-form"]').withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`), colorScheme).toEqual([]);
    await ctx.close();
  }
});

test('dark mode: the preview switches between the light and dark themes', async ({ page }) => {
  await page.goto('/docs/customization/dark-mode');
  const preview = page.getByTestId('dark-mode-preview');
  await expect(preview).toHaveAttribute('data-mode', 'light');
  const lightBg = await preview.evaluate((el) => getComputedStyle(el).backgroundColor);
  await page.getByRole('switch', { name: 'Dark preview' }).check();
  await expect(preview).toHaveAttribute('data-mode', 'dark');
  await expect.poll(() => preview.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(lightBg);
  // Only the preview switches: the page keeps its own mode.
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'light');
  await page.getByRole('switch', { name: 'Dark preview' }).uncheck();
  await expect(preview).toHaveAttribute('data-mode', 'light');
});

test('override styles: the cascade demo matches what the page says', async ({ page }) => {
  await page.goto('/docs/customization/override-styles');
  const radius = (c: string) => page.locator(`[data-case="${c}"]`).evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  expect(await radius('default')).toBe('8px');
  expect(await radius('theme')).toBe('8px'); // plain theme override loses
  expect(await radius('theme-strong')).toBe('2px');
  expect(await radius('sx')).toBe('0px');
  expect(parseFloat(await radius('styled'))).toBeGreaterThan(20);
});

test('routing: Sorbet Button and Breadcrumbs navigate client-side with Next.js Link', async ({ page }) => {
  await page.goto('/docs/guides/routing');
  const demo = page.getByTestId('routing-demo');
  await expect(demo.getByRole('link', { name: 'Routing', exact: true })).toHaveAttribute('aria-current', 'page');
  // A marker on window survives client-side navigation but not a full page load.
  await page.evaluate(() => ((window as unknown as { __spa: boolean }).__spa = true));
  await demo.getByRole('link', { name: 'Read the forms guide' }).click();
  await expect(page).toHaveURL(/\/docs\/guides\/forms\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Forms' })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __spa?: boolean }).__spa)).toBe(true);

  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Routing and links' })).toBeVisible();
  await page.evaluate(() => ((window as unknown as { __spa: boolean }).__spa = true));
  await page.getByTestId('routing-demo').getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Docs' }).click();
  await expect(page).toHaveURL(/\/docs\/?$/);
  expect(await page.evaluate(() => (window as unknown as { __spa?: boolean }).__spa)).toBe(true);
});

test('token tables are rendered from the real tokens', async ({ page }) => {
  await page.goto('/docs/customization/colors');
  await expect(page.getByRole('list', { name: 'primary shades' }).getByRole('listitem')).toHaveCount(10);
  await expect(page.getByRole('region', { name: 'Color roles' })).toContainText('#0369a1');
  await page.goto('/docs/theming');
  await expect(page.getByRole('region', { name: 'Theme palette' }).getByRole('row', { name: /palette\.secondary/ })).toContainText('neutral');
});
