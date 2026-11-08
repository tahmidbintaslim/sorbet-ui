# @sorbet-ui/tokens

Design tokens for Sorbet UI as plain TypeScript: colors (7 semantic scales, light and dark), spacing, radius, typography, shadows, z-index, breakpoints and motion. No React or MUI dependency, so you can use them anywhere.

```bash
npm i @sorbet-ui/tokens
```

```ts
import { colorPalette, colorScaleForMode, spacing, radius } from '@sorbet-ui/tokens';

colorPalette.primary[500]; // '#0ea5e9'
colorScaleForMode('primary', true).contrastText; // dark-mode text on a solid fill
```

Every color pair used by the components is checked against WCAG AA in `src/contrast.test.ts`.

Website: https://sorbetui.tahmid.space · Source: https://github.com/tahmidbintaslim/sorbet-ui · MIT licensed.
