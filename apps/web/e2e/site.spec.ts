import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { CATALOG } from '../lib/catalog';
import { categoriesWithBlocks } from '../lib/blocks';
import { BLOCKS } from '../lib/blocks-meta';
import { BLOCK_SOURCE } from '../lib/blocks-source';
import { registryName } from '../lib/registry';
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

test('dark-mode visitors get the dark background before hydration', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  // Capture the body colour as soon as the HTML is parsed, before React hydrates.
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      (window as unknown as { firstBg: string }).firstBg = getComputedStyle(document.body).backgroundColor;
    });
  });
  await page.goto('/docs');
  expect(await page.evaluate(() => (window as unknown as { firstBg: string }).firstBg)).toBe('rgb(15, 23, 42)');
  await ctx.close();
});

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

// Below md the header nav and the docs sidebar live in drawers; open them when needed.
async function openIfCollapsed(page: Page, nav: 'Main' | 'Docs') {
  if (await page.getByRole('navigation', { name: nav }).isVisible()) return;
  await (nav === 'Main' ? page.getByRole('banner').getByRole('button', { name: 'Open menu' }) : page.getByRole('button', { name: /Browse docs/ })).click();
}

test('navigation: header and docs sidebar', async ({ page }) => {
  await page.goto('/');
  await openIfCollapsed(page, 'Main');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Components' }).click();
  await expect(page).toHaveURL(/\/docs\/components$/);
  await openIfCollapsed(page, 'Docs');
  await page.getByRole('navigation', { name: 'Docs' }).getByRole('link', { name: 'Button', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/components\/button$/);
  await openIfCollapsed(page, 'Docs');
  await expect(page.getByRole('navigation', { name: 'Docs' }).locator('[aria-current="page"]')).toHaveText('Button');
});

test.describe('phone navigation', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('hamburger opens the menu, navigates and closes', async ({ page }) => {
    await page.goto('/');
    const header = page.getByRole('banner');
    expect((await header.boundingBox())!.height).toBeLessThanOrEqual(72); // one row
    const open = header.getByRole('button', { name: 'Open menu' });
    const box = (await open.boundingBox())!;
    expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
    await expect(open).toHaveAttribute('aria-expanded', 'false');
    await open.tap();
    const menu = page.getByRole('dialog', { name: 'Site menu' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Storybook' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'GitHub' })).toBeVisible();
    await menu.getByRole('link', { name: 'Blocks' }).tap();
    await expect(page).toHaveURL(/\/blocks$/);
    await expect(menu).toBeHidden();
    await expect(open).toHaveAttribute('aria-expanded', 'false');
    // Escape closes it and focus returns to the button.
    await open.tap();
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(open).toBeFocused();
  });

  test('docs drawer opens, navigates to Table and the H1 is in view', async ({ page }) => {
    await page.goto('/docs');
    // Content first: the H1 is in the first viewport, not below the sidebar.
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
    await page.getByRole('button', { name: /Browse docs/ }).tap();
    const drawer = page.getByRole('dialog', { name: 'Docs pages' });
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('[aria-current="page"]')).toHaveText('Getting started');
    await drawer.getByRole('link', { name: 'Table', exact: true }).tap();
    await expect(page).toHaveURL(/\/docs\/components\/table$/);
    await expect(drawer).toBeHidden();
    await expect(page.getByRole('heading', { level: 1, name: 'Table' })).toBeInViewport();
    // Reopened, the drawer highlights the current page and scrolls it into view.
    await page.getByRole('button', { name: /Browse docs/ }).tap();
    await expect(drawer.locator('[aria-current="page"]')).toHaveText('Table');
    await expect(drawer.locator('[aria-current="page"]')).toBeInViewport();
  });
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

// Overlay demos: the trigger opens the overlay, axe passes with it open, Escape closes it.
const OVERLAYS = [
  { slug: 'dialog', trigger: 'Open dialog', role: 'dialog', name: 'Delete project?' },
  { slug: 'drawer', trigger: 'Open drawer', role: 'navigation', name: 'Drawer menu' },
  { slug: 'menu', trigger: 'Project actions', role: 'menu', name: 'Project actions' },
  { slug: 'popover', trigger: 'Show details', role: 'presentation', name: undefined },
] as const;
for (const theme of ['light', 'dark'] as const) {
  for (const o of OVERLAYS) {
    test(`overlay ${o.slug} opens, passes axe and closes (${theme})`, async ({ browser }) => {
      const ctx = await browser.newContext({ colorScheme: theme, reducedMotion: 'reduce' });
      await stubGitHub(ctx);
      const page = await ctx.newPage();
      await page.goto(`/docs/components/${o.slug}`);
      await page.getByTestId('preview').getByRole('button', { name: o.trigger }).click();
      const overlay = o.name ? page.getByRole(o.role, { name: o.name }) : page.locator('.MuiPopover-paper');
      await expect(overlay).toBeVisible();
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const summary = r.violations.map((v) => `${v.id}: ${v.nodes[0]?.html.slice(0, 120)}`);
      expect(summary, summary.join('\n')).toEqual([]);
      await page.keyboard.press('Escape');
      await expect(overlay).toBeHidden();
      await ctx.close();
    });
  }
}

test('snackbar demo shows its message', async ({ page }) => {
  await page.goto('/docs/components/snackbar');
  await page.getByTestId('preview').getByRole('button', { name: 'Save changes' }).click();
  await expect(page.locator('.MuiSnackbar-root').getByText('Changes saved')).toBeVisible();
});

test('copy button shows a visible error when the clipboard is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    });
  });
  await page.goto('/docs/components/button');
  await page.getByRole('button', { name: 'Copy code' }).first().click();
  await expect(page.getByText('Copy failed. Select the code and copy it manually.').first()).toBeVisible();
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
  for (const route of ['/', '/blocks', '/demo', '/docs', '/docs/components/button', '/docs/components/table', '/docs/components/autocomplete', '/docs/components/date-picker', '/docs/components/accordion', '/docs/components/stepper', '/docs/components/skeleton', '/templates', ...TEMPLATE_ROUTES, ...BLOCK_ROUTES]) {
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
      // The before/after's "default MUI" layer renders stock MUI on purpose (it is the
      // "before", aria-hidden, and includes MUI's own sub-AA pairs); the Sorbet layer is scanned.
      const passes = [await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).exclude('[data-ba-layer="default"]').analyze()];
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
  const slider = page.getByRole('slider', { name: 'Compare the default Material UI theme with the Sorbet theme' });
  await slider.focus();
  await page.keyboard.press('Home');
  await expect(slider).toHaveValue('0');
  await page.keyboard.press('End');
  await expect(slider).toHaveValue('100');
});

test('landing: both sides of the before/after render the same MUI markup', async ({ page }) => {
  await page.goto('/');
  // Each side is the same @mui/material Dashboard; only the theme differs.
  const shapes = await page.getByTestId('before-after').evaluate((root) =>
    [...root.children].slice(0, 2).map((layer) =>
      // Compare which components render, in order (their *-root classes). Modifier classes
      // can differ because the Sorbet theme sets defaultProps (e.g. outlined Cards).
      [...layer.querySelectorAll('[class*="-root"]')]
        .map((el) => [...el.classList].filter((c) => /^Mui\w+-root$/.test(c)).sort().join('.'))
        .join('|'),
    ),
  );
  expect(shapes[0].length).toBeGreaterThan(300);
  expect(shapes[0]).toBe(shapes[1]);
});

test('landing: hero and sections are visible with reduced motion', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get started' }).first()).toBeVisible();
  // After scrolling through, nothing may stay at the hidden starting opacity.
  for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(1000);
  const hidden = await page.evaluate(() => [...document.querySelectorAll('main [style*="opacity"]')].filter((el) => getComputedStyle(el).opacity === '0').length);
  expect(hidden).toBe(0);
  await ctx.close();
});

test('landing: template screens link to their pages', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Acme Admin demo' }).click();
  await expect(page).toHaveURL(/\/demo$/);
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

test('blocks: code tab shows the block source', async ({ page }) => {
  await page.goto('/blocks/hero');
  await page.getByRole('group', { name: 'Centered view' }).getByRole('button', { name: 'Code' }).click();
  await expect(page.locator('pre[aria-label="Centered source"]')).toContainText('export default function HeroCentered');
});

test('headings never skip a level, so screen-reader outlines stay intact', async ({ page }) => {
  for (const route of ['/', '/blocks', '/demo', '/docs', '/docs/theming', '/templates', ...TEMPLATE_ROUTES, ...BLOCK_ROUTES]) {
    await page.goto(route);
    const levels = await page.evaluate(() =>
      [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
        .filter((h) => (h as HTMLElement).offsetHeight > 0 && !h.closest('[aria-hidden="true"]'))
        .map((h) => Number(h.tagName[1]))
    );
    expect(levels.filter((l) => l === 1), `${route}: one h1`).toHaveLength(1);
    const skips = levels.filter((l, i) => i > 0 && l > levels[i - 1] + 1);
    expect(skips, `${route}: heading levels ${levels.join(',')}`).toEqual([]);
  }
});

test('registry: every block has a shadcn item whose code matches the site source', async ({ request, page }) => {
  const index = await (await request.get('/r/registry.json')).json();
  const names = index.items.map((i: { name: string }) => i.name);
  expect(names).toContain('theme');
  for (const b of BLOCKS) expect(names).toContain(registryName(b.id));
  const item = await (await request.get('/r/hero-centered.json')).json();
  expect(item.type).toBe('registry:block');
  expect(item.dependencies).toEqual(['@mui/material', '@sorbet-ui/react']);
  expect(item.registryDependencies[0]).toMatch(/\/r\/theme\.json$/);
  expect(item.files[0].content).toBe(BLOCK_SOURCE.HeroCentered);
  const theme = await (await request.get('/r/theme.json')).json();
  expect(theme.dependencies).toEqual(expect.arrayContaining(['@sorbet-ui/theme', '@mui/material', '@emotion/react', '@emotion/styled']));
  // The block page shows the matching install command.
  await page.goto('/blocks/hero');
  await expect(page.getByLabel('Install Centered with the shadcn CLI')).toHaveText(/shadcn@latest add .*\/r\/hero-centered\.json$/);
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
  await page.getByRole('navigation', { name: 'Demo app' }).filter({ visible: true }).getByRole('link', { name: /Orders/ }).click();
  await expect(page).toHaveURL(/\/demo#orders$/);
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

// ---------------------------------------------------------------- Demo app

test('demo: an order opens from the keyboard and focus returns to its row', async ({ page }) => {
  await page.goto('/demo#orders');
  const app = page.getByTestId('demo-app');
  await expect(app.getByRole('heading', { level: 2, name: 'Orders' })).toBeVisible();
  const table = app.getByRole('table', { name: 'Orders' });
  const firstRow = table.getByRole('row').nth(1);
  const id = (await firstRow.getByRole('cell').first().innerText()).trim();
  // Tab into the table: the scroll region first, then the first row.
  await app.getByRole('region', { name: 'Orders' }).focus();
  await page.keyboard.press('Tab');
  await expect(firstRow).toBeFocused();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: `Order ${id}` });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(firstRow).toBeFocused();
  // Space works too.
  await page.keyboard.press(' ');
  await expect(page.getByRole('dialog', { name: `Order ${id}` })).toBeVisible();
});

test('demo: the new-order dialog starts empty after Cancel and Escape', async ({ page }) => {
  await page.goto('/demo#orders');
  const app = page.getByTestId('demo-app');
  const dialog = page.getByRole('dialog', { name: 'New order' });
  const name = dialog.getByRole('textbox', { name: 'Customer name' });
  const amount = dialog.getByRole('spinbutton', { name: 'Amount (USD)' });

  await app.getByRole('button', { name: 'New order' }).click();
  await name.fill('Stale Name');
  await amount.fill('42');
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toBeHidden();

  await app.getByRole('button', { name: 'New order' }).click();
  await expect(name).toHaveValue('');
  await expect(amount).toHaveValue('');
  await name.fill('Also Stale');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await app.getByRole('button', { name: 'New order' }).click();
  await expect(name).toHaveValue('');
  // Enter submits the form.
  await name.fill('Enter Buyer');
  await amount.fill('75');
  await amount.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(page.getByText(/Order #\d+ created/)).toBeVisible();
  await expect(app.getByRole('cell', { name: 'Enter Buyer' })).toBeVisible();
});

test('demo: settings keep edits across tabs and views; Save and Cancel work', async ({ page }) => {
  await page.goto('/demo#settings');
  const app = page.getByTestId('demo-app');
  const sections = app.getByRole('tablist', { name: 'Settings sections' });
  const email = app.getByRole('textbox', { name: 'Email' });

  await email.fill('sam@acme.example');
  await sections.getByRole('tab', { name: 'Notifications' }).click();
  const product = app.getByRole('switch', { name: 'Product updates' });
  await expect(product).not.toBeChecked();
  await product.check();
  await sections.getByRole('tab', { name: 'Profile' }).click();
  await expect(email).toHaveValue('sam@acme.example');

  // Leave the view and come back (same document, like clicking a nav link).
  await page.evaluate(() => {
    window.location.hash = 'orders';
  });
  await expect(app.getByRole('heading', { level: 2, name: 'Orders' })).toBeVisible();
  await page.goBack();
  await expect(app.getByRole('heading', { level: 2, name: 'Settings' })).toBeVisible();
  await expect(email).toHaveValue('sam@acme.example');
  await sections.getByRole('tab', { name: 'Notifications' }).click();
  await expect(product).toBeChecked();

  await app.getByRole('button', { name: 'Save changes' }).click();
  await expect(app.getByText('All changes saved')).toBeVisible();
  await product.uncheck();
  await app.getByRole('button', { name: 'Cancel' }).click();
  await expect(product).toBeChecked();
  await sections.getByRole('tab', { name: 'Profile' }).click();
  await expect(email).toHaveValue('sam@acme.example');
});

test('demo: the view is in the URL hash and back/forward work', async ({ page }) => {
  await page.goto('/demo#customers');
  const app = page.getByTestId('demo-app');
  await expect(app.getByRole('heading', { level: 2, name: 'Customers' })).toBeVisible();
  await page.evaluate(() => {
    window.location.hash = 'orders';
  });
  await expect(app.getByRole('heading', { level: 2, name: 'Orders' })).toBeVisible();
  await page.goBack();
  await expect(app.getByRole('heading', { level: 2, name: 'Customers' })).toBeVisible();
  await page.goForward();
  await expect(app.getByRole('heading', { level: 2, name: 'Orders' })).toBeVisible();
});

test('docs: getting started says 0.1.0 is not on npm yet and shows the source install', async ({ page }) => {
  await page.goto('/docs');
  const notice = page.getByTestId('prerelease-notice');
  await expect(notice).toBeVisible();
  await expect(notice).toContainText('not published to npm yet');
  await expect(page.locator('pre[aria-label="Build Sorbet UI from source"]')).toContainText('pnpm build:packages');
  // Framework tabs are keyboard operable.
  const vite = page.getByRole('tab', { name: 'Vite' });
  await vite.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Next.js' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('tab', { name: 'Next.js' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('pre[aria-label="Next.js root layout"]')).toContainText('AppRouterCacheProvider');
  await expect(page.locator('pre[aria-label="Install command for Next.js"]')).toContainText('@mui/material-nextjs');
});

test('demo: choosing a view in the mobile menu moves focus to its heading', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/demo');
  const app = page.getByTestId('demo-app');
  await app.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  await menu.getByRole('link', { name: /Customers/ }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/\/demo#customers$/);
  await expect(app.getByRole('heading', { level: 2, name: 'Customers' })).toBeFocused();
});
