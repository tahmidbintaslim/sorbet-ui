import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { CATALOG } from '../lib/catalog';
import { categoriesWithBlocks } from '../lib/blocks';
import { BLOCKS } from '../lib/blocks-meta';
import { BLOCK_SOURCE } from '../lib/blocks-source';
import { registryName } from '../lib/registry';
import { TEMPLATES } from '../lib/templates';
import { DOC_PAGES } from '../lib/docs-nav';

const TEMPLATE_ROUTES = TEMPLATES.map((t) => `/templates/${t.slug}`);

const BLOCK_ROUTES = categoriesWithBlocks().map((c) => `/blocks/${c.id}`);

// Every written docs page (lib/docs-nav.ts) and the help center.
const DOC_ROUTES = [...DOC_PAGES.map((p) => p.href), '/support'];

const ROUTES = [
  '/',
  ...DOC_ROUTES,
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
  for (const route of ['/', '/blocks', '/demo', '/docs/components/button', '/docs/components/table', '/docs/components/autocomplete', '/docs/components/date-picker', '/docs/components/accordion', '/docs/components/stepper', '/docs/components/skeleton', '/templates', ...TEMPLATE_ROUTES, ...BLOCK_ROUTES, ...DOC_ROUTES]) {
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

test('landing: hero headline is in the static HTML and the marquee stands still for reduced motion', async ({ browser }) => {
  // The headline must not depend on JavaScript: check the server HTML itself.
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await stubGitHub(ctx);
  const page = await ctx.newPage();
  const html = await (await page.request.get('/')).text();
  expect(html).toMatch(/<h1[^>]*id="hero-title"/);
  for (const word of ['Already on Material UI?', 'Make', 'look', 'modern.']) expect(html).toContain(word);

  await page.goto('/');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveText('Already on Material UI? Make it look modern.');
  await expect(h1).toBeVisible();
  // Reduced motion: no marquee animation, chips wrap, duplicates and the pause button are gone.
  const track = page.getByTestId('marquee-track');
  await expect(track).toBeVisible();
  expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.getByRole('region', { name: 'Components' }).getByRole('link', { name: 'Button', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /component carousel/ })).toBeHidden();
  await ctx.close();
});

test('landing: the marquee pauses on hover and with its pause button', async ({ page }) => {
  await page.goto('/');
  const track = page.getByTestId('marquee-track');
  const state = () => track.evaluate((el) => getComputedStyle(el).animationPlayState);
  await track.scrollIntoViewIfNeeded();
  await expect.poll(state).toBe('running');
  // The track never stops moving, so point at it directly (hover() waits for it to be still).
  const box = (await track.locator('..').boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect.poll(state).toBe('paused');
  await page.mouse.move(0, 0);
  await expect.poll(state).toBe('running');
  await page.getByRole('button', { name: 'Pause component carousel' }).click();
  await page.mouse.move(0, 0);
  await expect.poll(state).toBe('paused');
  await page.getByRole('button', { name: 'Play component carousel' }).click();
  await page.mouse.move(0, 0);
  await expect.poll(state).toBe('running');
});

test('blocks: search is kept in the URL and restored on reload', async ({ page }) => {
  await page.goto('/blocks');
  await page.getByRole('textbox', { name: 'Search blocks' }).fill('pricing');
  await expect(page).toHaveURL(/\?q=pricing$/);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Search blocks' })).toHaveValue('pricing');
  await expect(page.getByTestId('block-search-results')).toBeVisible();
});

test('docs: playground picks are restored from the URL', async ({ page }) => {
  await page.goto('/docs/components/button?variant=soft&color=danger&size=lg');
  const code = page.locator('pre[aria-label="Button source"]');
  await expect(code).toContainText('variant="soft"');
  await expect(code).toContainText('color="danger"');
  await expect(code).toContainText('size="lg"');
});

test('landing: hand-drawn ink draws itself, and is shown finished with reduced motion', async ({ browser }) => {
  // Normal motion: the three sketch diagrams finish drawing once scrolled to.
  const page = await browser.newPage();
  await page.goto('/');
  // Each drawing starts when it scrolls into view, so bring every one into view.
  const drawings = page.locator('#how svg');
  for (let i = 0; i < (await drawings.count()); i++) await drawings.nth(i).scrollIntoViewIfNeeded();
  const offsets = () => page.locator('#how svg path').evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).strokeDashoffset)));
  await expect.poll(async () => Math.max(...(await offsets())), { timeout: 8000 }).toBe(0);
  await page.close();
  // Reduced motion: no animation at all, every stroke fully drawn.
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const still = await ctx.newPage();
  await still.goto('/');
  const paths = still.locator('#how svg path');
  expect(await paths.count()).toBeGreaterThan(10);
  expect(await paths.evaluateAll((els) => els.every((el) => getComputedStyle(el).animationName === 'none'))).toBe(true);
  await ctx.close();
});

test('landing: the hero shows one live app in device frames, with a single accessible copy', async ({ page }) => {
  await page.goto('/');
  const stage = page.getByTestId('stage');
  const wide = (page.viewportSize()?.width ?? 0) >= 1000;
  // Wide screens: browser frame + phone mirror (inert, hidden from assistive tech).
  // Phones: the phone frame only, and it is the accessible copy.
  const phone = stage.locator('[data-frame="phone"]');
  await expect(phone).toBeVisible();
  await expect(stage.locator('[data-frame="browser"]')).toBeVisible({ visible: wide });
  if (wide) {
    await expect(phone).toHaveAttribute('aria-hidden', 'true');
    await expect(phone).toHaveAttribute('inert', '');
  } else {
    await expect(phone).not.toHaveAttribute('aria-hidden', 'true');
    expect(await phone.evaluate((el) => (el as HTMLElement).inert)).toBe(false);
  }
  await expect(stage.getByRole('region', { name: 'Order details' })).toHaveCount(1);
  await expect(stage.getByRole('button', { name: /Theo Lindqvist/ })).toBeVisible();
  // The screenshot wall is gone.
  await expect(page.locator('img[src*="/shots/"]')).toHaveCount(0);
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
  for (const route of ['/', '/blocks', '/demo', '/docs', '/docs/theming', '/docs/components', '/docs/components/button', '/templates', ...TEMPLATE_ROUTES, ...BLOCK_ROUTES]) {
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
  if (!(await nav.isVisible())) await app.getByRole('button', { name: /^Demo sections/ }).click();
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
  await page.getByRole('link', { name: /Developer tool/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Developer tool' })).toBeVisible();
  await page.getByRole('group', { name: 'Developer tool view' }).getByRole('button', { name: 'Code' }).click();
  await expect(page.locator('pre[aria-label="Developer tool source: index.tsx"]')).toContainText('<PricingCompare />');
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

test('docs: installation says 0.1.0 is not on npm yet and shows the source install', async ({ page }) => {
  await page.goto('/docs/installation');
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
  await app.getByRole('button', { name: /^Demo sections/ }).click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  await menu.getByRole('link', { name: /Customers/ }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/\/demo#customers$/);
  await expect(app.getByRole('heading', { level: 2, name: 'Customers' })).toBeFocused();
});

// ---------------------------------------------------------------- Sorbet look on every page

test('404: shows the dropped-cone illustration and a working home link', async ({ page }) => {
  const res = await page.goto('/no/such/page');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  const cone = page.getByTestId('dropped-cone');
  await expect(cone).toBeVisible();
  expect(await cone.locator('svg path').count()).toBeGreaterThan(3);
  // Decorative: hidden from assistive tech.
  await expect(cone).toHaveAttribute('aria-hidden', 'true');
  await page.getByRole('main').getByRole('link', { name: 'Back to home' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Already on Material UI?');
});

const HEADERS = [
  ['/docs', 'cone', 'success'],
  ['/docs/components', 'popsicle', 'primary'],
  ['/docs/components/button', 'popsicle', 'primary'],
  ['/docs/theming', 'jar', 'warning'],
  ['/blocks', 'waffle', 'danger'],
  ['/blocks/hero', 'waffle', 'danger'],
  ['/templates', 'sundae', 'secondary'],
  ['/templates/saas-landing', 'sundae', 'secondary'],
] as const;

test('page headers: every section has its flavor band with its doodle and the h1 inside', async ({ page }) => {
  for (const [route, doodle, flavor] of HEADERS) {
    await page.goto(route);
    const header = page.getByTestId('page-header');
    await expect(header, route).toHaveAttribute('data-flavor', flavor);
    await expect(header.getByRole('heading', { level: 1 }), route).toBeVisible();
    await expect(header.getByTestId('doodle'), route).toHaveAttribute('data-doodle', doodle);
    await expect(header.getByTestId('awning'), route).toBeVisible();
  }
});

test('docs header: the section doodle draws itself, and is fully drawn with reduced motion', async ({ browser }) => {
  // Normal motion: every stroke finishes drawing.
  const page = await browser.newPage();
  await page.goto('/docs');
  const offsets = () =>
    page
      .locator('[data-testid="page-header"] [data-testid="doodle"] svg path[pathLength]')
      .evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).strokeDashoffset)));
  await expect.poll(async () => Math.max(...(await offsets())), { timeout: 8000 }).toBe(0);
  await page.close();
  // Reduced motion: the doodle is in the static HTML and never animates, so it is shown finished.
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const still = await ctx.newPage();
  const html = await (await still.request.get('/docs')).text();
  expect(html).toContain('data-doodle="cone"');
  await still.goto('/docs');
  const doodle = still.getByTestId('page-header').getByTestId('doodle');
  await expect(doodle).toBeVisible();
  const paths = doodle.locator('svg path[pathLength]');
  expect(await paths.count()).toBeGreaterThan(4);
  expect(
    await paths.evaluateAll((els) => els.every((el) => getComputedStyle(el).animationName === 'none' && getComputedStyle(el).opacity === '1')),
  ).toBe(true);
  // The header text is never hidden either.
  await expect(still.getByRole('heading', { level: 1, name: 'Getting started' })).toBeVisible();
  await ctx.close();
});

test('docs sidebar: the current page is a pill in its section flavor', async ({ page }) => {
  await page.goto('/docs/theming');
  await openIfCollapsed(page, 'Docs');
  const current = page.getByRole('navigation', { name: 'Docs' }).locator('[aria-current="page"]');
  await expect(current).toHaveText('Theming');
  const expected = await page.evaluate(() => {
    const probe = document.createElement('i');
    probe.style.backgroundColor = 'var(--scoop-warning-pastel)';
    document.body.append(probe);
    const c = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return c;
  });
  await expect(current).toHaveCSS('background-color', expected);
});

test('blocks: a search with no results shows the empty cone', async ({ page }) => {
  await page.goto('/blocks?q=zzzz-nothing');
  const empty = page.getByTestId('block-search-empty');
  await expect(empty).toContainText('No blocks match');
  await expect(empty.getByTestId('doodle')).toHaveAttribute('data-doodle', 'emptyCone');
});

test('copy button: a sprinkle burst on success, none with reduced motion', async ({ browser }) => {
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    const ctx = await browser.newContext({ reducedMotion, permissions: ['clipboard-read', 'clipboard-write'] });
    await stubGitHub(ctx);
    const page = await ctx.newPage();
    await page.goto('/docs/theming');
    const button = page.getByRole('button', { name: 'Copy code' }).first();
    await button.click();
    await expect(button).toHaveAttribute('data-copy-state', 'copied');
    const burst = page.getByTestId('copy-burst');
    if (reducedMotion === 'reduce') await expect(burst).toHaveCount(0);
    else await expect(burst.locator('span').first()).toBeAttached();
    await ctx.close();
  }
});

// ---------------------------------------------------------------- Templates and demo hub

for (const t of TEMPLATES) {
  test(`template ${t.slug}: renders in the preview frame and full screen`, async ({ page }) => {
    const problems = watch(page);
    await page.goto(`/templates/${t.slug}`);
    const preview = page.getByTestId('template-preview');
    await expect(preview).toBeVisible();
    await expect(preview.locator('h2').first()).toBeVisible();
    await page.getByRole('link', { name: 'Open full screen' }).click();
    await expect(page).toHaveURL(new RegExp(`/templates/${t.slug}/preview$`));
    await expect(page.getByTestId('template-preview').locator('h2').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to template' })).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(problems, problems.join('\n')).toEqual([]);
  });
}

test('templates: the device switch resizes the frame and the template reflows', async ({ page }) => {
  // This checks sizes and reflow, not the resize animation, so widths jump.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto('/templates/inbox');
  const frame = page.getByTestId('template-frame');
  const preview = page.getByTestId('template-preview');
  const width = async () => Math.round((await frame.boundingBox())!.width);
  await expect.poll(width).toBeGreaterThan(1200);
  // Desktop: the folders column is in the page; no menu button.
  await expect(preview.getByRole('complementary', { name: 'Mailbox' })).toBeVisible();
  await expect(preview.getByRole('button', { name: 'Open folders' })).toBeHidden();

  const sizes = page.getByRole('group', { name: 'Preview width' });
  await sizes.getByRole('button', { name: /^Phone/ }).click();
  await expect(frame).toHaveAttribute('data-device', 'phone');
  await expect.poll(width).toBe(390);
  await expect(preview.getByRole('complementary', { name: 'Mailbox' })).toBeHidden();
  await expect(preview.getByRole('button', { name: 'Open folders' })).toBeVisible();

  await sizes.getByRole('button', { name: /^Tablet/ }).click();
  await expect.poll(width).toBe(768);
  await sizes.getByRole('button', { name: /^Desktop/ }).click();
  await expect.poll(width).toBeGreaterThan(1200);
});

test('templates: the Code tab shows the real files', async ({ page }) => {
  await page.goto('/templates/kanban');
  await page.getByRole('group', { name: 'Kanban board view' }).getByRole('button', { name: 'Code' }).click();
  await expect(page.locator('pre[aria-label="Kanban board source: index.tsx"]')).toContainText('export default function Kanban');
  await page.getByRole('group', { name: 'Template files' }).getByRole('button', { name: 'data.ts' }).click();
  await expect(page.locator('pre[aria-label="Kanban board source: data.ts"]')).toContainText('export const TASKS');
  // Back to the preview: it kept running.
  await page.getByRole('group', { name: 'Kanban board view' }).getByRole('button', { name: 'Preview' }).click();
  await expect(page.getByTestId('template-preview').getByRole('heading', { level: 2 }).first()).toBeVisible();
});

test('templates: the type filter narrows the gallery and every card links to its page', async ({ page }) => {
  await page.goto('/templates');
  const filters = page.getByRole('group', { name: 'Filter templates by type' });
  const cards = page.locator('article');
  await expect(cards).toHaveCount(TEMPLATES.length);
  for (const type of ['Application', 'Marketing', 'E-commerce'] as const) {
    const n = TEMPLATES.filter((t) => t.type === type).length;
    await filters.getByRole('button', { name: `${type} (${n})` }).click();
    await expect(cards).toHaveCount(n);
    await expect(page.getByRole('status').filter({ hasText: 'Showing' })).toContainText(`Showing ${n} of ${TEMPLATES.length}`);
  }
  await filters.getByRole('button', { name: /^E-commerce/ }).click();
  // Live previews mount once their card is near the viewport.
  await expect(page.getByTestId('template-thumb-storefront')).toHaveAttribute('data-live', 'true');
  await cards.getByRole('link', { name: 'Storefront' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Storefront' })).toBeVisible();
});

test('template inbox: search, read, reply and compose', async ({ page }) => {
  await page.goto('/templates/inbox/preview');
  const app = page.getByTestId('template-preview');
  await app.getByRole('textbox', { name: 'Search mail' }).fill('invoice');
  await expect(app.getByRole('list', { name: 'Inbox messages' }).getByRole('listitem')).toHaveCount(2);
  await app.getByRole('button', { name: /Ledgerly: Invoice INV-2041 was paid/ }).click();
  await expect(app.getByRole('heading', { level: 2, name: 'Invoice INV-2041 was paid' })).toBeVisible();
  // Narrow screens show one pane at a time: the message replaced the list.
  const back = app.getByRole('button', { name: 'Back to Inbox' });
  if (await back.isVisible()) await back.click();
  await app.getByRole('textbox', { name: 'Search mail' }).fill('zzz');
  await expect(app.getByText('No messages match')).toBeVisible();
  await app.getByRole('button', { name: 'Clear filters' }).click();
  await app.getByRole('button', { name: /Priya Raman: Studio day/ }).click();
  await app.getByRole('textbox', { name: 'Reply to Priya Raman' }).fill('Count me in.');
  await app.getByRole('button', { name: 'Send reply' }).click();
  await expect(page.getByText('Reply sent to Priya Raman')).toBeVisible();
  await expect(app.getByText('Count me in.')).toBeVisible();
  if (await back.isVisible()) await back.click();
  // Compose (the button lives in the folders column, or in the drawer on narrow screens).
  const compose = app.getByRole('button', { name: 'Compose' });
  if (!(await compose.first().isVisible())) await app.getByRole('button', { name: 'Open folders' }).click();
  await compose.filter({ visible: true }).click();
  const dialog = page.getByRole('dialog', { name: 'New message' });
  await dialog.getByRole('textbox', { name: 'To' }).fill('sam@example.com');
  await dialog.getByRole('textbox', { name: 'Subject' }).fill('Hello');
  await dialog.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('Message sent to sam@example.com')).toBeVisible();
});

test('template kanban: move a card from its menu, and the move is announced', async ({ page }) => {
  await page.goto('/templates/kanban/preview');
  const app = page.getByTestId('template-preview');
  await app.getByRole('button', { name: 'Move PL-44' }).click();
  await page.getByRole('menuitem', { name: 'Move to Done' }).click();
  await expect(app.getByTestId('kanban-column-done').getByRole('button', { name: /Open card PL-44/ })).toBeVisible();
  await expect(app.getByRole('status').filter({ hasText: 'PL-44 moved' })).toHaveText('PL-44 moved from To do to Done.');
  // Edit in the card dialog: tick a checklist item and save.
  await app.getByRole('button', { name: /Open card PL-37/ }).click();
  const dialog = page.getByRole('dialog', { name: /PL-37/ });
  await dialog.getByRole('checkbox', { name: 'Dark theme pass' }).check();
  await dialog.getByRole('button', { name: 'Save' }).click();
  await expect(app.getByRole('button', { name: /Open card PL-37/ }).locator('..').getByLabel('Checklist 3 of 4')).toBeVisible();
  // Filter by person.
  await app.getByRole('button', { name: "Only Rafael Holm's cards" }).click();
  await expect(app.getByRole('button', { name: /Open card/ })).toHaveCount(2);
});

test('template storefront: add to the bag and check out with validation', async ({ page }) => {
  await page.goto('/templates/storefront/preview');
  const app = page.getByTestId('template-preview');
  await app.getByRole('button', { name: 'Quick view: Morning mug' }).click();
  const qv = page.getByRole('dialog', { name: 'Morning mug' });
  await qv.getByRole('radio', { name: 'Honey' }).check();
  await qv.getByRole('button', { name: 'Increase quantity' }).click();
  await qv.getByRole('button', { name: /Add to bag/ }).click();
  await app.getByRole('button', { name: 'Shopping bag, 2 items' }).click();
  const bag = page.getByRole('dialog', { name: 'Shopping bag' });
  await expect(bag).toContainText('Honey');
  await expect(bag).toContainText('Add $19.00 more for free shipping');
  await bag.getByRole('button', { name: /Checkout/ }).click();
  const checkout = page.getByRole('dialog', { name: 'Checkout' });
  await checkout.getByRole('button', { name: 'Continue' }).click();
  await expect(checkout.getByText('Enter your name')).toBeVisible();
  await checkout.getByRole('textbox', { name: 'Full name' }).fill('Robin Vale');
  await checkout.getByRole('textbox', { name: 'Email' }).fill('robin@example.com');
  await checkout.getByRole('textbox', { name: 'Street address' }).fill('1 Sample Lane');
  await checkout.getByRole('textbox', { name: 'City' }).fill('Springfield');
  await checkout.getByRole('textbox', { name: 'Postal code' }).fill('12345');
  await checkout.getByRole('button', { name: 'Continue' }).click();
  await checkout.getByRole('textbox', { name: 'Card number' }).fill('4242424242424242');
  await checkout.getByRole('textbox', { name: 'Expiry (MM/YY)' }).fill('04/29');
  await checkout.getByRole('textbox', { name: 'Security code' }).fill('123');
  await checkout.getByRole('button', { name: 'Continue' }).click();
  await checkout.getByRole('button', { name: /Place order/ }).click();
  await expect(page.getByRole('dialog', { name: 'Order placed' })).toContainText('is confirmed');
});

test('template settings: unsaved changes bar, invite and type-to-confirm delete', async ({ page }) => {
  await page.goto('/templates/settings/preview');
  const app = page.getByTestId('template-preview');
  const bar = app.getByRole('region', { name: 'Unsaved changes' });
  await expect(bar).toBeHidden();
  await app.getByRole('textbox', { name: 'Email' }).fill('not-an-email');
  await expect(bar).toBeVisible();
  await bar.getByRole('button', { name: 'Save changes' }).click();
  await expect(app.getByText('Enter a valid email address')).toBeVisible();
  await bar.getByRole('button', { name: 'Cancel' }).click();
  await expect(bar).toBeHidden();
  await expect(app.getByRole('textbox', { name: 'Email' })).toHaveValue('maya@juniperstudio.example');

  await app.getByRole('navigation', { name: 'Settings sections' }).getByRole('button', { name: 'Team' }).click();
  await app.getByRole('button', { name: 'Invite people' }).click();
  const invite = page.getByRole('dialog', { name: /Invite to/ });
  await invite.getByRole('textbox', { name: 'Email address' }).fill('new@example.com');
  await invite.getByRole('button', { name: 'Send invite', exact: true }).click();
  await expect(app.getByRole('list', { name: 'Pending invites' })).toContainText('new@example.com');

  await app.getByRole('navigation', { name: 'Settings sections' }).getByRole('button', { name: 'Advanced' }).click();
  await app.getByRole('button', { name: 'Delete workspace' }).click();
  const del = page.getByRole('dialog', { name: /Delete Juniper Studio/ });
  await expect(del.getByRole('button', { name: 'Delete workspace' })).toBeDisabled();
  await del.getByRole('textbox', { name: /Type juniper-studio/ }).fill('juniper-studio');
  await expect(del.getByRole('button', { name: 'Delete workspace' })).toBeEnabled();
});

test('template saas-landing: email capture validates and the pricing switch changes prices', async ({ page }) => {
  await page.goto('/templates/saas-landing/preview');
  const app = page.getByTestId('template-preview');
  await expect(app.getByText('$10', { exact: true })).toBeVisible();
  await app.getByRole('switch', { name: 'Bill yearly' }).uncheck();
  await expect(app.getByText('$12', { exact: true })).toBeVisible();
  await app.getByRole('textbox', { name: 'Work email' }).fill('nope');
  await app.getByRole('button', { name: 'Get started' }).filter({ visible: true }).last().click();
  await expect(app.getByText('Enter an email like you@company.com')).toBeVisible();
  await app.getByRole('textbox', { name: 'Work email' }).fill('pat@example.com');
  await app.getByRole('textbox', { name: 'Work email' }).press('Enter');
  await expect(app.getByText('You are on the list')).toBeVisible();
});

test('demo hub: every app has live desktop and phone previews that link to it', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1, name: 'Demos' })).toBeVisible();
  for (const slug of ['analytics-dashboard', 'inbox', 'kanban', 'settings', 'storefront']) {
    const card = page.getByTestId(`demo-card-${slug}`);
    await card.scrollIntoViewIfNeeded();
    await expect(card.getByTestId(`demo-desktop-${slug}`)).toHaveAttribute('data-live', 'true');
    await expect(card.getByRole('link', { name: /^Open app:/ })).toHaveAttribute('href', `/templates/${slug}/preview`);
    await expect(card.getByRole('link', { name: /^Sizes and code:/ })).toHaveAttribute('href', `/templates/${slug}`);
  }
  // The Acme Admin demo is still on the page.
  await page.getByRole('button', { name: 'Jump to Acme Admin' }).click();
  await expect(page.getByTestId('demo-app')).toBeInViewport();
  await page.getByRole('link', { name: 'Open app: Inbox, full screen' }).click();
  await expect(page).toHaveURL(/\/templates\/inbox\/preview$/);
});

// Full-screen previews with an overlay open, in both themes.
const OPEN_OVERLAY: Record<string, (page: Page) => Promise<void>> = {
  inbox: async (page) => {
    const app = page.getByTestId('template-preview');
    if (!(await app.getByRole('button', { name: 'Compose' }).first().isVisible())) await app.getByRole('button', { name: 'Open folders' }).click();
    await app.getByRole('button', { name: 'Compose' }).filter({ visible: true }).click();
    await expect(page.getByRole('dialog', { name: 'New message' })).toBeVisible();
  },
  kanban: async (page) => {
    await page.getByRole('button', { name: /Open card PL-37/ }).click();
    await expect(page.getByRole('dialog', { name: /PL-37/ })).toBeVisible();
  },
  storefront: async (page) => {
    await page.getByRole('button', { name: 'Add Everyday bowl to bag' }).click();
    await page.getByRole('button', { name: /^Shopping bag/ }).click();
    await expect(page.getByRole('dialog', { name: 'Shopping bag' })).toBeVisible();
  },
  settings: async (page) => {
    await page.getByRole('navigation', { name: 'Settings sections' }).getByRole('button', { name: 'Team' }).click();
    await page.getByRole('button', { name: 'Invite people' }).click();
    await expect(page.getByRole('dialog', { name: /Invite to/ })).toBeVisible();
  },
};

for (const theme of ['light', 'dark'] as const) {
  for (const t of TEMPLATES) {
    test(`a11y (axe) ${theme} /templates/${t.slug}/preview${OPEN_OVERLAY[t.slug] ? ' with an overlay open' : ''}`, async ({ browser }) => {
      const ctx = await browser.newContext({ colorScheme: theme, reducedMotion: 'reduce' });
      await stubGitHub(ctx);
      const page = await ctx.newPage();
      await page.goto(`/templates/${t.slug}/preview`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('html')).toHaveAttribute('data-mode', theme);
      await expect(page.getByTestId('template-preview')).toHaveAttribute('data-stage-mode', theme);
      await OPEN_OVERLAY[t.slug]?.(page);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nodes, e.g. ${v.nodes[0]?.html.slice(0, 120)}`);
      expect(summary, summary.join('\n')).toEqual([]);
      await ctx.close();
    });
  }
}

// ---------------------------------------------------------------------------
// Landing: live device showcase and the "Built with Sorbet" demos.
// ---------------------------------------------------------------------------

test('landing: selecting an order updates the detail pane in every frame', async ({ page }) => {
  await page.goto('/');
  const stage = page.getByTestId('stage');
  const detail = stage.getByRole('region', { name: 'Order details' });
  await expect(detail).toContainText('Theo Lindqvist');
  await stage.getByRole('button', { name: /Priya Raman/ }).click();
  await expect(detail).toContainText('Priya Raman');
  await expect(detail).toContainText('$18.00');
  // Shared state: every rendered copy (browser frame and phone mirror) shows the same order.
  const copies = stage.locator('[data-testid="order-detail"]');
  for (let i = 0; i < (await copies.count()); i++) await expect(copies.nth(i)).toContainText('Priya Raman');
  await expect(stage.getByRole('button', { name: /Priya Raman/ })).toHaveAttribute('aria-current', 'true');
});

test('landing: marking an order done announces it and moves it to the Done tab', async ({ page }) => {
  await page.goto('/');
  const stage = page.getByTestId('stage');
  await expect(stage.getByRole('tab', { name: 'Open · 6' })).toBeVisible();
  await stage.getByRole('button', { name: 'Mark done' }).click();
  await expect(stage.getByRole('status')).toContainText('Order #1047 handed to Theo');
  await expect(stage.getByRole('button', { name: /Theo Lindqvist/ })).toHaveCount(0);
  await stage.getByRole('tab', { name: 'Done · 3' }).click();
  await expect(stage.getByRole('button', { name: /Theo Lindqvist/ })).toBeVisible();
  // Search narrows the list.
  await stage.getByRole('tab', { name: /^All/ }).click();
  await stage.getByRole('searchbox', { name: 'Search orders' }).fill('mango');
  await expect(stage.getByRole('list', { name: 'Orders' }).getByRole('button')).toHaveCount(2);
  // The nav switches views.
  await stage.getByRole('button', { name: 'Flavors' }).click();
  await expect(stage.getByRole('progressbar', { name: 'Mango Tango stock' })).toBeVisible();
});

test('landing: the theme bar restyles the stage and rewrites the code', async ({ page }) => {
  await page.goto('/');
  const stage = page.getByTestId('stage');
  const bar = page.getByRole('group', { name: 'Stage theme' });
  const code = page.locator('pre[aria-label="Theme for the current stage settings"]');
  const action = stage.getByRole('button', { name: 'Mark done' });
  const style = (prop: string) => action.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);

  // Accent: the primary button and the code follow the flavor.
  await expect(code).toContainText('primary: colorPalette.danger');
  const raspberry = await style('background-color');
  await bar.getByRole('radio', { name: 'Mint' }).check();
  await expect.poll(() => style('background-color')).not.toBe(raspberry);
  await expect(code).toContainText('primary: colorPalette.success');
  await expect(code).toContainText('color="success"');

  // Radius: the slider moves with the keyboard and the button corners follow.
  await expect.poll(() => style('border-top-left-radius')).toBe('12px');
  await bar.getByRole('slider', { name: 'Corner radius' }).press('Home');
  await expect.poll(() => style('border-top-left-radius')).toBe('0px');
  await expect(code).toContainText('borderRadius: 0');

  // Density.
  const row = stage.getByRole('button', { name: /Priya Raman/ });
  const tall = (await row.boundingBox())!.height;
  await bar.getByRole('button', { name: 'Compact' }).click();
  await expect.poll(async () => (await row.boundingBox())!.height).toBeLessThan(tall);
  await expect(code).toContainText('size="sm"');

  // Mode: the stage only; the page keeps its own mode.
  const pageMode = await page.locator('html').getAttribute('data-mode');
  const appBg = () => stage.getByTestId('scoop-shop').last().evaluate((el) => getComputedStyle(el).backgroundColor);
  const before = await appBg();
  await bar.getByRole('button', { name: 'Dark stage' }).click();
  await expect(stage).toHaveAttribute('data-stage-mode', 'dark');
  await expect.poll(appBg).not.toBe(before);
  await expect(code).toContainText('createTheme(darkTheme');
  await expect(page.locator('html')).toHaveAttribute('data-mode', pageMode!);
});

test('landing: every accent passes axe in both stage modes', async ({ browser }) => {
  test.slow();
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await stubGitHub(ctx);
  const page = await ctx.newPage();
  await page.goto('/');
  const bar = page.getByRole('group', { name: 'Stage theme' });
  const problems: string[] = [];
  for (const mode of ['Light stage', 'Dark stage']) {
    await bar.getByRole('button', { name: mode }).click();
    for (const view of ['Flavors', 'Orders']) {
      await page.getByTestId('stage').getByRole('button', { name: view }).click();
      for (const flavor of ['Raspberry', 'Mango', 'Mint', 'Sky', 'Violet', 'Cyan', 'Slate']) {
        await bar.getByRole('radio', { name: flavor }).check();
        const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).include('[data-testid="device-showcase"]').analyze();
        for (const v of r.violations) problems.push(`${mode} / ${view} / ${flavor}: ${v.id}, e.g. ${v.nodes[0]?.html.slice(0, 140)}`);
      }
    }
  }
  expect(problems, problems.join('\n')).toEqual([]);
  await ctx.close();
});

test('landing: the kanban moves a ticket from the keyboard', async ({ page }) => {
  await page.goto('/');
  const board = page.getByTestId('demo-kanban');
  await board.scrollIntoViewIfNeeded();
  const scooping = board.getByRole('group', { name: 'Scooping' });
  await expect(scooping).toBeVisible();
  await expect(scooping).not.toContainText('Two mango cones');
  await board.getByRole('button', { name: 'Move Two mango cones to Scooping' }).focus();
  await page.keyboard.press('Enter');
  await expect(scooping).toContainText('Two mango cones');
  await expect(board.getByRole('status')).toHaveText('Two mango cones moved to Scooping');
  // And on to the last column, where only the way back is left.
  await board.getByRole('button', { name: 'Move Two mango cones to Ready' }).click();
  await expect(board.getByRole('group', { name: 'Ready' })).toContainText('Two mango cones');
  await expect(board.getByRole('button', { name: /Move Two mango cones to/ })).toHaveCount(1);
});

test('landing: the live demos mount when scrolled to, work, and pass axe', async ({ browser }) => {
  test.slow();
  for (const theme of ['light', 'dark'] as const) {
    const ctx = await browser.newContext({ colorScheme: theme, reducedMotion: 'reduce' });
    await stubGitHub(ctx);
    const page = await ctx.newPage();
    await page.goto('/');

    // Stats: the range tabs change the number.
    const stats = page.getByTestId('demo-stats');
    await stats.scrollIntoViewIfNeeded();
    await expect(stats.getByTestId('stats-value')).toHaveText('1,284');
    await stats.getByRole('tab', { name: '30d' }).click();
    await expect(stats.getByTestId('stats-value')).toHaveText('5,310');

    // Command menu: type to filter, arrows to move, Enter to run.
    const command = page.getByTestId('demo-command');
    await command.scrollIntoViewIfNeeded();
    const input = command.getByRole('combobox', { name: 'Command' });
    await input.fill('a');
    await expect(command.getByRole('option')).toHaveCount(4);
    await input.press('ArrowDown');
    await expect(command.getByRole('option', { name: /Print today/ })).toHaveAttribute('aria-selected', 'true');
    await input.press('Enter');
    await expect(command.getByRole('status')).toHaveText('Ran: Print today’s report');

    // Filters: chips narrow the table.
    const filters = page.getByTestId('demo-filters');
    await filters.scrollIntoViewIfNeeded();
    await filters.getByRole('button', { name: 'Gelato' }).click();
    await expect(filters.getByRole('status')).toHaveText('2 of 5 flavors');
    await expect(filters.getByRole('table').getByRole('row')).toHaveCount(3);

    // Agenda: picking a day swaps the events.
    const agenda = page.getByTestId('demo-agenda');
    await agenda.scrollIntoViewIfNeeded();
    await agenda.getByRole('button', { name: /Friday 20/ }).click();
    await expect(agenda.getByRole('region', { name: 'Friday agenda' })).toContainText('night market');

    // Form: inline errors, then success.
    const form = page.getByTestId('demo-form');
    await form.scrollIntoViewIfNeeded();
    await form.getByRole('button', { name: 'Sign up' }).click();
    await expect(form.getByText('Tell us your name.')).toBeVisible();
    await expect(form.getByRole('textbox', { name: 'Name' })).toBeFocused();
    const axe = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).include('#built-with').analyze();
    const failing = [...(await axe()).violations];
    await form.getByRole('textbox', { name: 'Name' }).fill('Rosa Bianchi');
    await form.getByRole('textbox', { name: 'Email' }).fill('rosa@example.com');
    await form.getByRole('button', { name: 'Sign up' }).click();
    await expect(form.getByRole('alert')).toContainText("You're on the list, Rosa");

    failing.push(...(await axe()).violations);
    const summary = failing.map((v) => `${theme}: ${v.id} (${v.impact}): ${v.nodes.length} nodes, e.g. ${v.nodes[0]?.html.slice(0, 140)}`);
    expect(summary, summary.join('\n')).toEqual([]);
    await ctx.close();
  }
});

test('landing: no horizontal overflow from 320 to 1280', async ({ page }) => {
  for (const width of [320, 360, 390, 600, 768, 1000, 1024, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await page.getByTestId('demo-kanban').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('demo-kanban').getByRole('group', { name: 'Ready' })).toBeVisible();
    // On failure, name the elements whose removal would end the overflow.
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      const W = de.clientWidth;
      const by: string[] = [];
      if (de.scrollWidth > W) {
        for (const e of [...document.querySelectorAll('body *')] as HTMLElement[]) {
          const b = e.getBoundingClientRect();
          if (b.right <= W + 0.5) continue;
          const prev = e.style.display;
          e.style.display = 'none';
          const fixed = de.scrollWidth <= W;
          e.style.display = prev;
          if (fixed) by.push(`${e.tagName.toLowerCase()}.${String(e.className).slice(0, 60)} [${Math.round(b.left)}, ${Math.round(b.right)}] transform=${getComputedStyle(e).transform}`);
        }
      }
      return { px: de.scrollWidth - W, by: by.slice(-3) };
    });
    expect(overflow.px, `overflow at ${width}: ${overflow.by.join(' | ')}`).toBeLessThanOrEqual(0);
    // The stage never pokes out of the hero.
    const box = (await page.getByTestId('stage').boundingBox())!;
    expect(box.x, `stage left at ${width}`).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, `stage right at ${width}`).toBeLessThanOrEqual(width + 0.5);
  }
});

// ---------------------------------------------------------------------------
// Interactive docs: live examples, generated props tables, TOC, search, catalog.
// ---------------------------------------------------------------------------

test('docs examples: every component page has live examples whose code expands', async ({ page }) => {
  await page.goto('/docs/components/button');
  const examples = page.locator('[data-testid^="example-"]');
  expect(await examples.count()).toBeGreaterThanOrEqual(4);
  // The live stage renders real components, not a picture of them.
  await expect(page.getByTestId('stage-colors').getByRole('button', { name: 'danger' }).first()).toBeVisible();
  const toggle = page.getByTestId('example-colors').getByRole('button', { name: /show code/i });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(page.getByTestId('example-colors').getByRole('button', { name: /hide code/i })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByTestId('code-colors')).toContainText("from '@sorbet-ui/react'");
});

test('docs api: the props table is generated from the source types', async ({ page }) => {
  await page.goto('/docs/components/button');
  const table = page.getByTestId('api-Button');
  await expect(table).toBeVisible();
  for (const prop of ['variant', 'color', 'size', 'loading']) await expect(table.getByText(prop, { exact: true }).first()).toBeVisible();
});

test('docs toc: lists the examples and marks the section in view', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/docs/components/button');
  const toc = page.getByTestId('toc');
  await toc.getByRole('link', { name: 'Sizes' }).click();
  await expect(page).toHaveURL(/#sizes$/);
  await expect(toc.getByRole('link', { name: 'Sizes' })).toHaveAttribute('aria-current', /true|location/);
});

test('docs search: Ctrl+K opens it, typing finds a component, Enter goes there', async ({ page }) => {
  await page.goto('/docs/components/button');
  await page.keyboard.press('Control+k');
  const dialog = page.getByTestId('docs-search');
  await expect(dialog).toBeVisible();
  await page.keyboard.type('slider');
  await expect(dialog.getByRole('option').first()).toContainText('Slider');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/docs\/components\/slider/);
});

test('docs catalog: the filter narrows the live previews and says how many match', async ({ page }) => {
  await page.goto('/docs/components');
  await expect(page.getByTestId('catalog-count')).toContainText('30');
  await page.getByTestId('catalog-filter').fill('table');
  await expect(page.getByTestId('catalog-count')).not.toContainText('30');
  await expect(page.getByRole('link', { name: /^Table/ }).first()).toBeVisible();
});

test('landing: the Stepper, Accordion and Menu demos work from the keyboard and mouse', async ({ page }) => {
  await page.goto('/');
  // Stepper: you cannot go on without a flavor; finished steps lead back.
  const sundae = page.getByTestId('demo-sundae');
  await sundae.scrollIntoViewIfNeeded();
  await expect(sundae.getByRole('button', { name: 'Next' })).toBeDisabled();
  await sundae.getByRole('radio', { name: 'Mango Tango' }).click();
  await sundae.getByRole('button', { name: 'Next' }).click();
  await sundae.getByRole('button', { name: 'Sprinkles' }).click();
  await sundae.getByRole('button', { name: 'Place order' }).click();
  await expect(sundae.getByTestId('sundae-receipt')).toContainText('One Mango Tango sundae');
  await expect(sundae.getByTestId('sundae-receipt')).toContainText('sprinkles');
  // Accordion: one answer open at a time.
  const faq = page.getByTestId('demo-faq');
  await faq.scrollIntoViewIfNeeded();
  const first = faq.getByRole('button', { name: 'Any vegan scoops?' });
  const second = faq.getByRole('button', { name: 'Can I take a pint home?' });
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await second.focus();
  await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  // Menu: open from the keyboard, pick with arrows, focus returns to the trigger.
  const order = page.getByTestId('demo-order-menu');
  await order.scrollIntoViewIfNeeded();
  const trigger = order.getByRole('button', { name: 'Order actions' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(order.getByTestId('order-status')).toContainText('Refunded');
  await expect(trigger).toBeFocused();
});
