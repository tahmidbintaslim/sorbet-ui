# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: product teams maintaining existing MUI (Material UI v7) apps — dashboards, admin panels, internal tools. Their app works but looks dated or "default Material", and a rewrite to Tailwind/shadcn is not on the table. They evaluate by installing the theme, swapping a few components, and checking nothing breaks.

## Product Purpose
Sorbet UI is a free, open-source design layer for MUI v7: tokens, a theme, and restyled components (`@sorbet-ui/tokens`, `@sorbet-ui/theme`, `@sorbet-ui/react`) with extra variants (solid, soft, outlined, ghost, plain; Button also has dash and link), sizes (xs–xl), and accessible dark mode. Success over the next three months is open-source growth: npm installs, GitHub stars, outside contributors. Paid Pro templates may follow after traction; nothing is sold today, and the site marks Pro as "coming soon".

## Positioning
A drop-in modern skin for MUI, not a new component library. Teams keep MUI's API, accessibility, and ecosystem (DataGrid, DatePickers) and get a softer, current look. MUI's own Joy UI is in maintenance; Sorbet fills that gap on top of Material UI itself.

## Operating Context
- pnpm + Turborepo monorepo; packages `@sorbet-ui/{tokens,core,theme,react}` (icons is private).
- Consumers use Vite or Next.js with Emotion; MUI v7 is a peer dependency.
- Two Vercel projects: `sorbet-ui` serves Storybook (`apps/docs`, sorbet-ui.vercel.app); `sorbet-ui-web` serves the website (`apps/web`, a Next.js static export: landing, docs, blocks, templates, demo).
- Storybook exposes an MCP server (`@storybook/addon-mcp`) for coding agents; Chromatic runs visual and accessibility checks in CI.
- npm org `sorbet-ui` exists; first publish (0.1.0) waits on the owner's explicit go-ahead.

## Capabilities and Constraints
- 26 components: Alert, Autocomplete, Avatar, Badge, Breadcrumbs, Button, Card, Checkbox, Chip, DatePicker, Dialog, Drawer, Pagination, Popover, Progress, Radio, Rating, Select, Slider, Snackbar, Switch, Table, Tabs, TextField, ToggleButtonGroup, Tooltip — each with stories and tests.
- 54 copy-paste blocks across 16 categories, 6 free page templates, and a working admin demo on the website.
- Must stay API-compatible with MUI props where it wraps them.
- Undecided: v1 gap components (e.g. Accordion, Menu, Stepper, Skeleton, app shell).

## Brand Commitments
- Name: Sorbet UI (renamed from Sun UI). Tagline in use: "Material UI, but softer."
- MIT license.
- Visual direction (confirmed 2026-11-02): the category-standard SaaS look, MUI-flavored. Quality bar: mui.com and the Joy UI docs, with Sorbet's soft palette. Motion is purposeful and respects `prefers-reduced-motion`.

## Evidence on Hand
- Dry-run publishes clean; smoke-tested in Vite and Next.js apps.
- Token contrast tests (`packages/tokens/src/contrast.test.ts`) cover solid, hover, active and soft-tint pairs in both themes.
- Site end-to-end tests run axe on every page, block category, template and the demo.
- No testimonials, adopters, or download numbers exist yet. Do not fabricate any. The GitHub star count on the site is fetched live and hidden if unavailable.

## Product Principles
1. Keep MUI, lose the default look: zero rewrite, same API.
2. Accessible in both themes: every color pair passes contrast tests.
3. Tokens first: one source of truth for color, radius, size, motion.
4. Boring to adopt: install, wrap in the theme, done.

## Accessibility & Inclusion
WCAG 2.2 AA, verified in light and dark themes.
