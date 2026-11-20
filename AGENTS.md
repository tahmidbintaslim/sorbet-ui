# Agent guide for Sorbet UI

Sorbet UI is a pnpm + Turborepo monorepo: React components on Material UI v7 or v9 with one `variant` / `color` / `size` API and light and dark themes.

| Path | What |
| --- | --- |
| `packages/tokens` | Design tokens (colors, spacing, type, motion). `src/contrast.test.ts` enforces WCAG AA for every color pair. |
| `packages/core` | Shared types, variant presets, a11y helpers |
| `packages/theme` | `lightTheme` / `darkTheme` for MUI |
| `packages/react` | Components (`src/<Name>.tsx`, `.stories.tsx`, `.test.tsx`) |
| `apps/docs` | Storybook 10 (with the MCP addon) |
| `apps/web` | Next.js docs site, blocks (`blocks/<category>/*.tsx`), templates, demo |

## Use the Storybook MCP server first

Start Storybook (`pnpm storybook:dev`, port 6006). The MCP server is at `http://localhost:6006/mcp` and is registered for Claude Code in `.mcp.json` (or run `claude mcp add --transport http storybook http://localhost:6006/mcp`).

When working on UI:

- Look up a component's props and stories with the MCP docs tools (`docs-list`, `docs-show`, `docs-show-story`) before using or changing it. Never guess props.
- Reuse existing components and patterns instead of writing new ones.
- After changing a component or story, run the MCP `test-run` tool on the stories you touched (pass their story IDs; get real IDs from `docs-show`, never guess) and fix accessibility findings. For the whole suite (427 tests) use `pnpm test:storybook:ci`: a full MCP run takes longer than the tool's 60-second timeout.
- Tests run headless when there is no display (CI, containers, cloud agents); see `apps/docs/vitest.config.ts`.
- Running many stories through the dev server can exceed Node's default heap. If Storybook crashes with "heap out of memory", start it with `NODE_OPTIONS=--max-old-space-size=6144 pnpm storybook:dev`.

## Rules

- Variants: `solid | soft | outlined | ghost | plain` (Button also `dash | link`). Colors: `primary | secondary | success | warning | danger | info | neutral`. Sizes: `xs`–`xl`.
- Colors come from `@sorbet-ui/tokens`; never hardcode a color that can break contrast. Any new color pair needs a test in `packages/tokens/src/contrast.test.ts`.
- Every interactive element needs an accessible name; every form control a label.
- Site blocks: start with `'use client';` and a `// @block {"name","description"}` line, then run `node apps/web/scripts/gen-blocks.mjs`. The site build also publishes each block as a shadcn registry item at `/r/<kebab-name>.json` (`scripts/gen-registry.mjs`); blocks must stay self-contained (npm imports only). Content is fictional sample content; never invent real customers or numbers.
- Respect `prefers-reduced-motion` for any animation.

## Checks before a PR

```bash
pnpm lint && pnpm type-check && pnpm test        # packages
pnpm test:storybook:ci                            # stories + axe
pnpm --filter web build && pnpm --filter web test:e2e   # site + axe, light and dark
```
