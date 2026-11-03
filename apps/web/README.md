# Sorbet UI website

The landing page and docs site for Sorbet UI, built with Next.js (App Router) and exported as static HTML.
It imports the workspace packages, so it doubles as a real-world consumer test of the library.

## Pages

- `/` landing page with a live component showcase and quick start
- `/docs` getting started for Vite and Next.js App Router
- `/docs/theming` light and dark themes
- `/docs/components` and `/docs/components/<name>` live previews with variant, color and size pickers and matching source

Autocomplete, DatePicker, Dialog, Drawer, Popover and Snackbar are linked to Storybook for now.

## Development

```bash
pnpm install
pnpm build:packages      # the site imports the packages' dist builds
pnpm web:dev             # http://localhost:3000
pnpm web:build           # static export into apps/web/out
pnpm web:e2e             # Playwright against the export (build first)
```

To add a component page, add an entry to `lib/catalog.ts` (server-safe metadata) and a matching
`render`/`code` pair in `components/demos.tsx`.

## Tests

`e2e/site.spec.ts` (Playwright, desktop and 375px mobile) checks that every route returns 200 with no
console errors or horizontal scroll, the dark toggle persists and follows the OS setting, navigation and
the playground work, the copy button works, and axe finds no WCAG A/AA violations in light and dark,
library demos included.

## Deploying

The root `vercel.json` currently deploys Storybook to sorbet-ui.vercel.app. Deploy this site as a
separate Vercel project with root directory `apps/web` and output directory `out`.
