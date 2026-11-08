# @sorbet-ui/react

React components on Material UI v7 or v9 with one `variant`, `color` and `size` API, plus light and dark themes.

- 26 components: Alert, Autocomplete, Avatar, Badge, Breadcrumbs, Button, Card, Checkbox, Chip, DatePicker, Dialog, Drawer, Pagination, Popover, Progress, Radio, Rating, Select, Slider, Snackbar, Switch, Table, Tabs, TextField, ToggleButtonGroup, Tooltip
- Variants: `solid`, `soft`, `outlined`, `ghost`, `plain` (Button also `dash`, `link`)
- Colors: `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`. Sizes: `xs` to `xl`
- Every color pair is contrast-tested against WCAG AA in light and dark mode
- Ships with a `"use client"` banner, so it works in Next.js App Router Server Components

## Install

```bash
npm i @sorbet-ui/react @sorbet-ui/theme
```

npm 7+ and pnpm install the peers (`react`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/x-date-pickers`, `dayjs`) automatically.

## Use

```tsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';
import { Button } from '@sorbet-ui/react';

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Button variant="soft" color="primary">Hello</Button>
    </ThemeProvider>
  );
}
```

## Links

- Website, docs, blocks and demo: https://sorbetui.tahmid.space
- Storybook: https://sorbet-ui.vercel.app
- Source: https://github.com/tahmidbintaslim/sorbet-ui

MIT licensed.
