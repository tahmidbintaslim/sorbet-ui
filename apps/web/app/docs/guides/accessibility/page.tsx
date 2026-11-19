import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import CodeBlock from '@/components/CodeBlock';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import { Callout, DocTable, NextLinks } from '../../_shared/parts';
import A from '../../_shared/A';

export const metadata: Metadata = pageMeta({
  title: 'Accessibility',
  description: 'What the components do for you, what is still your job, and how we test.',
  path: '/docs/guides/accessibility',
});

const toc: TocItem[] = [
  { id: 'what-components-do', label: 'What the components do', depth: 2 },
  { id: 'names', label: 'Names and ARIA', depth: 3 },
  { id: 'focus', label: 'Focus', depth: 3 },
  { id: 'keyboard', label: 'Keyboard', depth: 2 },
  { id: 'contrast', label: 'Color contrast', depth: 2 },
  { id: 'reduced-motion', label: 'Reduced motion', depth: 2 },
  { id: 'your-job', label: 'What is still your job', depth: 2 },
  { id: 'testing', label: 'How we test', depth: 2 },
  { id: 'next', label: 'Where to go next', depth: 2 },
];

const ICON_BUTTON = `import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import { Button, Tooltip } from '@sorbet-ui/react';

// An icon-only button has no text, so it needs a name.
<Tooltip title="Delete draft">
  <Button shape="square" variant="ghost" color="danger" aria-label="Delete draft">
    <DeleteOutlineOutlined aria-hidden />
  </Button>
</Tooltip>`;

const MENU = `<Button
  id="actions-button"
  aria-haspopup="true"
  aria-controls={open ? 'actions-menu' : undefined}
  aria-expanded={open ? 'true' : undefined}
  onClick={(e) => setAnchor(e.currentTarget)}
>
  Actions
</Button>
<Menu id="actions-menu" aria-labelledby="actions-button" anchorEl={anchor} open={open} onClose={close}>
  …
</Menu>`;

const MOTION = `import { createTheme, lightTheme } from '@sorbet-ui/theme';

// Shorten every transition and animation for people who ask for less motion.
export const theme = createTheme(lightTheme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
      },
    },
  },
});`;

const AXE = `import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const colorScheme of ['light', 'dark'] as const) {
  test(\`settings page passes axe (\${colorScheme})\`, async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/settings');
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(violations).toEqual([]);
    await ctx.close();
  });
}`;

const COMMANDS = `pnpm --filter @sorbet-ui/tokens test   # contrast of every token pair
pnpm test:storybook:ci                  # every story, with axe
pnpm --filter web build && pnpm --filter web test:e2e   # the site, light and dark`;

const KEYS: [string, string, string][] = [
  ['Menu', 'Arrow Down / Arrow Up', 'Move between items; wraps from the last to the first.'],
  ['Menu', 'Home / End', 'First / last item.'],
  ['Menu', 'A letter', 'Jump to the next item starting with it.'],
  ['Menu', 'Enter', 'Choose the focused item.'],
  ['Menu', 'Escape or Tab', 'Close; Escape returns focus to the trigger.'],
  ['Tabs', 'Arrow Right / Arrow Left', 'Move focus between tabs; wraps at the ends.'],
  ['Tabs', 'Home / End', 'First / last tab.'],
  ['Tabs', 'Enter or Space', 'Select the focused tab. Focus alone does not select.'],
  ['Tabs', 'Tab', 'Leave the tab list and move into the panel.'],
  ['Autocomplete', 'Type', 'Filter the options.'],
  ['Autocomplete', 'Arrow Down / Arrow Up', 'Open the list and move the highlight.'],
  ['Autocomplete', 'Enter', 'Pick the highlighted option and close the list.'],
  ['Autocomplete', 'Escape', 'Close the list.'],
  ['Dialog', 'Tab / Shift+Tab', 'Cycle through the dialog only; focus cannot leave it.'],
  ['Dialog', 'Escape', 'Close (calls onClose) and return focus to the trigger.'],
];

export default function Page() {
  return (
    <GuidePage href="/docs/guides/accessibility" toc={toc} doodle="cone" aside="for everyone">
      <p>
        Sorbet builds on Material UI, which handles most of the hard parts: roles, keyboard support and focus
        management. Sorbet adds tested color contrast, accessible names in the right place and visible focus. Your app
        still owns its structure and content. This page says which is which.
      </p>

      <Section id="what-components-do" title="What the components do">
        <H3 id="names">Names and ARIA</H3>
        <ul>
          <li>
            <strong>Form controls.</strong> <code>TextField</code>, <code>Select</code>, <code>Checkbox</code>,{' '}
            <code>Radio</code> and <code>Switch</code> put <code>aria-label</code>, <code>aria-labelledby</code> and{' '}
            <code>aria-describedby</code> on the element that takes focus rather than on a wrapper. A{' '}
            <code>Select</code>&apos;s visible label is linked to its combobox.
          </li>
          <li>
            <strong>States.</strong> A loading <code>Button</code> is disabled and sets <code>aria-busy</code>; loading
            spinners are named &ldquo;Loading&rdquo;. An indeterminate <code>Checkbox</code> uses the native{' '}
            <code>indeterminate</code> state. Disabled <code>Menu</code> items set <code>aria-disabled</code>.
          </li>
          <li>
            <strong>Navigation.</strong> <code>Breadcrumbs</code> is a <code>nav</code> named &ldquo;Breadcrumb&rdquo; by
            default, marks the last item <code>aria-current=&quot;page&quot;</code>, and names its collapse button
            (&ldquo;Show 3 more items&rdquo;). <code>Tabs</code> links each tab and panel with{' '}
            <code>aria-controls</code> and <code>aria-labelledby</code>.
          </li>
          <li>
            <strong>Overlays.</strong> <code>Menu</code> takes an <code>aria-label</code> or <code>aria-labelledby</code>{' '}
            for its list; <code>Dialog</code> takes them for the dialog.
          </li>
        </ul>
        <H3 id="focus">Focus</H3>
        <ul>
          <li>
            <code>Button</code> shows a 3px focus ring in its own color for keyboard focus (
            <code>:focus-visible</code>), and so does anything styled with the <code>@sorbet-ui/core</code> presets. The
            themes give stock MUI buttons and icon buttons the same ring in the primary color.
          </li>
          <li>
            <code>Dialog</code> moves focus into the dialog when it opens, keeps it there, and returns it to the trigger
            when it closes.
          </li>
          <li>
            <code>Menu</code> focuses the selected item when it opens (or the first, with{' '}
            <code>focusVariant=&quot;menu&quot;</code>) and returns focus to the trigger on Escape.
          </li>
        </ul>
      </Section>

      <Section id="keyboard" title="Keyboard">
        <p>
          The composite components follow the WAI-ARIA patterns. This is what the keys do, checked against the
          components in a browser:
        </p>
        <DocTable label="Keyboard support" head={['Component', 'Key', 'Does']} mono={[]} rows={KEYS} />
        <p>
          Buttons, links, checkboxes, switches and radios use native elements, so Tab, Enter and Space work as they
          do in the browser.
        </p>
      </Section>

      <Section id="contrast" title="Color contrast">
        <p>
          Every text and background pair the components draw is checked for WCAG AA (4.5:1 for normal text) in light
          and dark mode by <code>packages/tokens/src/contrast.test.ts</code>, and the variant presets by{' '}
          <code>packages/core/src/presets.test.ts</code>. A token change that breaks a pair fails the build.{' '}
          <A href="/docs/customization/colors#contrast">What is covered</A>, and{' '}
          <A href="/docs/customization/colors#add-pair">how to add a pair</A>.
        </p>
        <Callout tone="warning" title="Your own colors are not covered">
          The tests check the tokens as the components use them. A color you set in <code>sx</code>, a brand palette, or
          a token on a new surface is outside them until you add a test.
        </Callout>
      </Section>

      <Section id="reduced-motion" title="Reduced motion">
        <ul>
          <li>
            <code>Skeleton</code>, <code>Stepper</code> and <code>Accordion</code> stop their animations and
            transitions under <code>prefers-reduced-motion: reduce</code>.
          </li>
          <li>
            <code>Alert</code>, <code>Avatar</code>, <code>Badge</code>, <code>Card</code>, <code>Chip</code>,{' '}
            <code>Dialog</code>, <code>Drawer</code>, <code>Popover</code>, <code>Snackbar</code> and <code>Tooltip</code>{' '}
            take a <code>disableAnimation</code> prop. <code>Button</code>&apos;s hover lift turns off with{' '}
            <code>disableElevation</code>.
          </li>
          <li>
            MUI&apos;s own transitions (the fade of a dialog, the grow of a menu) do not read the setting.
          </li>
        </ul>
        <p>To respect the setting everywhere, add a global rule through the theme:</p>
        <CodeBlock code={MOTION} title="theme.ts" label="Reduced motion in the theme" />
      </Section>

      <Section id="your-job" title="What is still your job">
        <ul>
          <li>
            <strong>Names for icon-only controls.</strong> A button with only an icon has no name until you give it one.
          </li>
          <li>
            <strong>Page structure.</strong> One <code>h1</code>, headings in order, landmarks (<code>header</code>,{' '}
            <code>nav</code>, <code>main</code>), a skip link, and <code>lang</code> on <code>&lt;html&gt;</code>.
          </li>
          <li>
            <strong>Wiring between components.</strong> A menu trigger needs <code>aria-haspopup</code>,{' '}
            <code>aria-controls</code> and <code>aria-expanded</code>; the menu needs a name.
          </li>
          <li>
            <strong>Content.</strong> Alt text for images, link text that makes sense alone, errors that say how to fix
            them (<A href="/docs/guides/forms">Forms</A>).
          </li>
          <li>
            <strong>Focus on route changes and updates.</strong> Move focus or announce when content changes without a
            page load, for example with a <code>role=&quot;status&quot;</code> message.
          </li>
          <li>
            <strong>Touch targets.</strong> <code>xs</code> and <code>sm</code> controls are small; keep them apart on
            touch screens.
          </li>
        </ul>
        <CodeBlock code={ICON_BUTTON} label="Icon-only button" />
        <CodeBlock code={MENU} label="Menu trigger wiring" />
      </Section>

      <Section id="testing" title="How we test">
        <ul>
          <li>
            <strong>Token contrast:</strong> unit tests compute the WCAG ratio of every pair, in both modes.
          </li>
          <li>
            <strong>Component tests:</strong> each component has a Testing Library suite in{' '}
            <code>packages/react/src</code> (roles, names and, for the composite components, keys);{' '}
            <code>dark-mode.test.tsx</code> renders components in both modes.
          </li>
          <li>
            <strong>Storybook:</strong> the a11y addon runs axe on every story, with{' '}
            <code>a11y: &#123; test: &apos;error&apos; &#125;</code>, so any WCAG A or AA violation fails the Storybook tests.
          </li>
          <li>
            <strong>The site:</strong> Playwright and <code>@axe-core/playwright</code> load every docs page, block,
            template and demo in light and dark mode and fail on any WCAG 2 A or AA violation.
          </li>
        </ul>
        <CodeBlock code={COMMANDS} title="Terminal" label="Run the accessibility checks" />
        <p>The same check for your own pages:</p>
        <CodeBlock code={AXE} title="e2e/a11y.spec.ts" label="axe with Playwright in both themes" />
        <Callout title="Automated checks find some issues, not all">
          axe catches missing names, contrast and invalid ARIA. Try the keyboard and a screen reader on every new flow
          too.
        </Callout>
      </Section>

      <Section id="next" title="Where to go next">
        <NextLinks
          items={[
            { href: '/docs/guides/forms', title: 'Forms', note: 'Labels, errors and the error summary.' },
            { href: '/docs/customization/dark-mode', title: 'Dark mode', note: 'Check every component in both modes.' },
          ]}
        />
      </Section>
    </GuidePage>
  );
}
