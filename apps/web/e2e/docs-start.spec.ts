// Getting-started docs: Introduction, Installation, the three framework guides and
// Migrating from MUI. Rendering and axe for these routes live in site.spec.ts; this
// file checks what each page promises: its heading, a TOC that jumps, copyable
// code, and the links that move a reader on.
import { expect, test, type Page } from '@playwright/test';
import { docPage } from '../lib/docs-nav';

const PAGES = [
  '/docs',
  '/docs/installation',
  '/docs/frameworks/nextjs',
  '/docs/frameworks/vite',
  '/docs/frameworks/react-router',
  '/docs/migrating-from-mui',
] as const;

test.beforeEach(async ({ page }) => {
  // The header's star widget calls GitHub; keep tests offline-safe.
  await page.route('https://api.github.com/**', (r) => r.fulfill({ json: { stargazers_count: 42 } }));
});

/** The visible "On this page" nav: the right column at lg+, the disclosure below it. */
async function toc(page: Page) {
  const aside = page.getByTestId('toc');
  if (await aside.isVisible()) return aside;
  const disclosure = page.getByTestId('toc-disclosure');
  await disclosure.locator('summary').click();
  return disclosure.getByRole('navigation', { name: 'On this page' });
}

for (const href of PAGES) {
  const title = docPage(href)!.title;

  test(`start docs ${href}: h1, TOC targets and a TOC jump`, async ({ page }) => {
    await page.goto(href);
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
    // Every TOC entry points at a real heading on the page.
    const nav = await toc(page);
    const links = nav.getByRole('link');
    const count = await links.count();
    expect(count).toBeGreaterThan(2);
    const ids = await links.evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).hash.slice(1)));
    for (const id of ids) {
      await expect(page.locator(`h2[id="${id}"], h3[id="${id}"]`), `#${id}`).toHaveCount(1);
    }
    // Following the last entry lands on its heading.
    const last = ids[ids.length - 1];
    await links.last().click();
    await expect(page).toHaveURL(new RegExp(`#${last}$`));
    await expect(page.locator(`[id="${last}"]`)).toBeInViewport();
  });

  test(`start docs ${href}: code blocks have copy buttons`, async ({ page }) => {
    await page.goto(href);
    const copy = page.getByTestId('guide-body').getByRole('button', { name: 'Copy code' });
    expect(await copy.count()).toBeGreaterThan(0);
    await expect(copy.first()).toBeVisible();
  });
}

test('start docs: copying a code block puts the code on the clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/installation');
  const build = page.locator('pre[aria-label="Build Sorbet UI from source"]');
  await build.scrollIntoViewIfNeeded();
  // The copy button belongs to the same code block as the <pre>.
  await build.locator('xpath=..').getByRole('button', { name: 'Copy code' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('pnpm build:packages');
});

test('start docs: installation shows the pre-release notice and numbered steps per framework', async ({ page }) => {
  await page.goto('/docs/installation');
  const notice = page.getByTestId('prerelease-notice');
  await expect(notice).toBeVisible();
  await expect(notice).toContainText('not published to npm yet');
  // Three steps plus "Check the result" in the default (Vite) tab.
  const panel = page.getByRole('tabpanel');
  await expect(panel.getByRole('heading', { level: 3 })).toHaveText([
    'Install',
    'Wrap your app in the theme',
    'Render a component',
    'Check the result',
  ]);
  await expect(panel.locator('pre[aria-label="Vite: wrap the app in the Sorbet theme"]')).toContainText('CssBaseline');
  await page.getByRole('tab', { name: 'Next.js' }).click();
  await expect(page.locator('pre[aria-label="Next.js providers"]')).toContainText("'use client'");
});

test('start docs: installation links to each framework guide', async ({ page }) => {
  await page.goto('/docs/installation');
  const cards = page.getByTestId('framework-links').getByRole('link');
  await expect(cards).toHaveCount(4);
  await cards.filter({ hasText: 'React Router' }).click();
  await expect(page).toHaveURL(/\/docs\/frameworks\/react-router$/);
  await expect(page.getByRole('heading', { level: 1, name: 'React Router' })).toBeVisible();
});

test('start docs: introduction link cards navigate', async ({ page }) => {
  await page.goto('/docs');
  const cards = page.getByTestId('intro-links').getByRole('link');
  await expect(cards).toHaveCount(6);
  expect(await cards.evaluateAll((els) => els.map((el) => new URL((el as HTMLAnchorElement).href).pathname))).toEqual([
    '/docs/installation',
    '/docs/migrating-from-mui',
    '/docs/theming',
    '/docs/components',
    '/blocks',
    '/templates',
  ]);
  await cards.filter({ hasText: 'Installation' }).click();
  await expect(page).toHaveURL(/\/docs\/installation$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Installation' })).toBeVisible();
  await page.goBack();
  await page.getByTestId('intro-links').getByRole('link').filter({ hasText: 'Migrating from MUI' }).click();
  await expect(page).toHaveURL(/\/docs\/migrating-from-mui$/);
});

test('start docs: the before/after demo shows the same MUI code restyled by the theme', async ({ page }) => {
  await page.goto('/docs');
  const before = page.getByTestId('before-panel').getByRole('button', { name: 'Send invite' });
  const after = page.getByTestId('after-panel').getByRole('button', { name: 'Send invite' });
  await expect(before).toBeVisible();
  await expect(after).toBeVisible();
  // Stock Material UI uppercases button labels; the Sorbet theme does not.
  await expect(before).toHaveCSS('text-transform', 'uppercase');
  await expect(after).toHaveCSS('text-transform', 'none');
  // Both panels have a labelled email field.
  await expect(page.getByTestId('before-panel').getByRole('textbox', { name: 'Email' })).toHaveValue('ana@example.com');
  await expect(page.getByTestId('after-panel').getByRole('textbox', { name: 'Email' })).toHaveValue('ana@example.com');
});

test('start docs: migration tables link to component pages', async ({ page }) => {
  await page.goto('/docs/migrating-from-mui');
  await expect(page.getByTestId('restyled-table')).toBeVisible();
  await expect(page.getByTestId('prop-table')).toContainText('danger');
  const map = page.getByTestId('component-map');
  await map.getByRole('link', { name: 'Tabs', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/components\/tabs$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Tabs' })).toBeVisible();
});
