# Changelog

All notable changes to Sorbet UI are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Once releases start, Changesets also writes a `CHANGELOG.md` inside each published package.

## [0.1.0] - Unreleased

Nothing has been published to npm yet. This is the first planned release. Before it, every package was numbered 1.0.0 without ever being published; this version lowers them all to 0.1.0.

### Added

- `@sorbet-ui/react`: 26 components built on Material UI v7 or v9 (MUI X Date Pickers v8 or v9): Alert, Autocomplete, Avatar, Badge, Breadcrumbs, Button, Card, Checkbox, Chip, DatePicker, Dialog, Drawer, Pagination, Popover, Progress, Radio, Rating, Select, Slider, Snackbar, Switch, Table, Tabs, TextField, ToggleButtonGroup and Tooltip.
- A shared `variant` / `color` / `size` API: 5 variants (solid, soft, outlined, ghost, plain) on every component, plus dash and link on Button; 5 sizes; 7 colors on every component.
- `@sorbet-ui/theme`: `lightTheme` and `darkTheme` for the MUI `ThemeProvider`. They restyle stock `@mui/material` components too (buttons, inputs, cards, chips, tabs, tables, dialogs, menus, tooltips, app bars), so an existing MUI app changes look with no code changes. The palette comes from the AA-tested token scales; `sorbetComponents` exports the overrides on their own.
- `@sorbet-ui/tokens`: color scales, spacing, radius, shadows, z-index, breakpoints, typography and animation tokens.
- `textColorsForMode` in `@sorbet-ui/tokens`: returns `textColors.light` or `textColors.dark` for the current mode.
- `@sorbet-ui/core`: shared types, variant presets, accessibility helpers and headless state helpers.
- Storybook with 372 stories, deployed at https://sorbet-ui.vercel.app.
- 676 unit tests (including WCAG AA checks for every token, theme palette and variant preset pair) and 374 Storybook tests, each run through axe.

### Changed

- Versions: every package goes from 1.0.0 (never published) to 0.1.0.
- Packages build with tsup to ESM and CommonJS with type definitions, and declare `"sideEffects": false`. `@sorbet-ui/react` carries a `"use client"` directive.
- Material UI, MUI X Date Pickers, Emotion and dayjs are peer dependencies of `@sorbet-ui/react`. `@sorbet-ui/theme` accepts React 18 or 19.
- Color tokens: each color's `main` and `dark` now reach 4.5:1 contrast against white and against their text color, and warning uses white text. In the light theme, solid fills and outlined, plain and link text are darker than before.
- Dark mode keeps the lighter shades: components pick their color scale with `colorScaleForMode` (new in `@sorbet-ui/tokens`, with `darkModeColorPalette`), and `darkTheme` uses the 500 shades for MUI's primary, success, warning and error. This covers Avatar's status dots and Tooltip, whose color scale now follows the MUI theme mode (its neutral surfaces still follow `data-theme="dark"`). Dark mode renders as it did before the light-theme change.
- `getColorScale`, `getVariantStyles` and `getVariantCss` in `@sorbet-ui/core` take an optional `isDark` argument (default `false`) and return the dark-mode shades when it is `true`.

### Fixed

- `getVariantStyles` and `getVariantCss` in `@sorbet-ui/core` match the Button styles in both modes, and every text pair they return reaches 4.5:1 at rest, on hover and when pressed. Before, dark-mode ghost text used the light-theme neutral (1.7:1 on the dark page) and pressed solid fills fell to 1.7–3.6:1.
- Dark mode: pressed soft Button and hovered selected soft Pagination items use the 100 shade for text, which keeps 4.5:1 on paper (was 4.4:1 for primary).
- Dark mode: Checkbox, Radio and Switch labels used the light theme's text color (`#0f172a`), about 1:1 on the dark page. They now use the dark text colors (`#f8fafc`, 17:1 on the page; disabled `#64748b`).
- Dark mode: unselected ToggleButtonGroup text used `#475569` (2.4:1 on the dark page) and now uses `#cbd5e1` (12:1). The solid hover tint and the soft and plain fills behind that text switch to dark shades too, so it stays readable on hover.
- Dark mode: the Slider value label (`valueLabelPosition="bottom"`) and min/max labels set no color and fell back to the page's inherited color, near-black unless the app sets a body color. Dark mode now sets the dark text colors on them.
- The light theme renders as before: the same CSS for every variant and color of these five components.

### Removed

- The `@sorbet-ui/tokens/css` export, which pointed at a file the build never produced.
- Storybook from the runtime dependencies of every package.

### Known issues

- `@sorbet-ui/icons` is an empty placeholder and is not published.
- No screen reader testing yet. Automated checks (axe on every story and site page, contrast tests) pass in light and dark.
