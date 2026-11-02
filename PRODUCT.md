# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: product teams maintaining existing MUI (Material UI v7) apps — dashboards, admin panels, internal tools. Their app works but looks dated or "default Material", and a rewrite to Tailwind/shadcn is not on the table. They evaluate by installing the theme, swapping a few components, and checking nothing breaks.

## Product Purpose
Sorbet UI is a free, open-source design layer for MUI v7: tokens, a theme, and restyled components (`@sorbet-ui/tokens`, `@sorbet-ui/theme`, `@sorbet-ui/react`) with extra variants (solid, soft, outlined, dash, ghost, plain, link), sizes (xs–xl), and accessible dark mode. Success over the next three months is open-source growth: npm installs, GitHub stars, outside contributors. Paid Pro templates may follow after traction; nothing is sold today.

## Positioning
A drop-in modern skin for MUI, not a new component library. Teams keep MUI's API, accessibility, and ecosystem (DataGrid, DatePickers) and get a softer, current look. MUI's own Joy UI is in maintenance; Sorbet fills that gap on top of Material UI itself.

## Operating Context
- pnpm + Turborepo monorepo; packages `@sorbet-ui/{tokens,core,theme,react}` (icons is private).
- Consumers use Vite or Next.js with Emotion; MUI v7 is a peer dependency.
- Storybook (`apps/docs`) is currently what `sorbet-ui.vercel.app` serves; `apps/web` holds an undeployed marketing page.
- npm org `sorbet-ui` exists; first publish (0.1.0) waits on the owner's explicit go-ahead.

## Capabilities and Constraints
- 26 components today: Alert, Autocomplete, Avatar, Badge, Breadcrumbs, Button, Card, Checkbox, Chip, DatePicker, Dialog, Drawer, Pagination, Popover, Progress, Radio, Rating, Select, Slider, Snackbar, Switch, Table, Tabs, TextField, ToggleButtonGroup, Tooltip — each with stories and tests.
- Must stay API-compatible with MUI props where it wraps them.
- Undecided: v1 gap components (e.g. Accordion, Menu, Stepper, Skeleton, app shell), docs site stack.

## Brand Commitments
- Name: Sorbet UI (renamed from Sun UI). Tagline in use: "Material UI, but softer."
- MIT license.

## Evidence on Hand
- Dry-run publishes clean; smoke-tested in Vite and Next.js apps.
- Token contrast tests exist (`packages/tokens/src/contrast.test.ts`).
- No testimonials, adopters, or download numbers exist yet. Do not fabricate any.

## Product Principles
1. Keep MUI, lose the default look: zero rewrite, same API.
2. Accessible in both themes: every color pair passes contrast tests.
3. Tokens first: one source of truth for color, radius, size, motion.
4. Boring to adopt: install, wrap in the theme, done.

## Accessibility & Inclusion
WCAG 2.2 AA, verified in light and dark themes.

## Brand Commitments (visual, confirmed 2026-11-02)
- Owner chose the category-standard SaaS look, MUI-flavored. Quality bar: mui.com, Joy UI docs, with Sorbet's soft palette.
