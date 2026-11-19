'use client';
// Live examples for the customization pages. Client components, rendered by the
// server pages as children of ExampleViewer (no functions cross the boundary).
import * as React from 'react';
import { Box, Stack, ThemeProvider, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';
import { createTheme, darkTheme, lightTheme } from '@sorbet-ui/theme';
import { Alert, Button, Chip, Switch, TextField, ToggleButton, ToggleButtonGroup } from '@sorbet-ui/react';

const COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const;
const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
const BUTTON_ONLY = ['dash', 'link'] as const;
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type Kind = 'button' | 'chip';
type Size = (typeof SIZES)[number];

/** Every variant against every color, with a component and size picker. */
export function VariantMatrix() {
  const [kind, setKind] = React.useState<Kind>('button');
  const [size, setSize] = React.useState<Size>('sm');
  const rows = kind === 'button' ? [...VARIANTS, ...BUTTON_ONLY] : VARIANTS;

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 2, mb: 3, justifyContent: 'center' }}>
        <ToggleButtonGroup
          aria-label="Component"
          exclusive
          size="sm"
          variant="soft"
          color="neutral"
          value={kind}
          onChange={(_e, v: Kind | null) => v && setKind(v)}
        >
          <ToggleButton value="button">Button</ToggleButton>
          <ToggleButton value="chip">Chip</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          aria-label="Size"
          exclusive
          size="sm"
          variant="soft"
          color="neutral"
          value={size}
          onChange={(_e, v: Size | null) => v && setSize(v)}
        >
          {SIZES.map((s) => (
            <ToggleButton key={s} value={s}>
              {s}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <Box
          component="table"
          data-testid="variant-matrix"
          data-kind={kind}
          sx={{
            borderCollapse: 'separate',
            borderSpacing: '8px 10px',
            mx: 'auto',
            '& th': { fontSize: 12, fontWeight: 700, color: 'text.secondary', fontFamily: 'var(--font-mono), ui-monospace, monospace', textAlign: 'left', whiteSpace: 'nowrap' },
            '& thead th': { textAlign: 'center' },
            '& td': { textAlign: 'center' },
          }}
        >
          <caption style={{ captionSide: 'bottom', paddingTop: 8 }}>
            <Typography component="span" variant="caption" color="text.secondary">
              {kind === 'button' ? 'Button' : 'Chip'} variants (rows) by color (columns), size {size}
            </Typography>
          </caption>
          <thead>
            <tr>
              <td />
              {COLORS.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v}>
                <th scope="row">{v}</th>
                {COLORS.map((c) => (
                  <td key={c}>
                    {kind === 'button' ? (
                      <Button variant={v} color={c} size={size}>
                        {c === 'danger' ? 'Delete' : 'Save'}
                      </Button>
                    ) : (
                      <Chip variant={v as (typeof VARIANTS)[number]} color={c} size={size} label={c} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
      </Box>
    </Box>
  );
}

/** A small screen rendered with lightTheme or darkTheme, switched in place. */
export function DarkModePreview() {
  const [dark, setDark] = React.useState(false);
  const mode = dark ? 'dark' : 'light';
  return (
    <Box sx={{ width: '100%', maxWidth: 520 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Switch label="Dark preview" checked={dark} onChange={(_e, v) => setDark(v)} />
      </Box>
      <ThemeProvider theme={dark ? darkTheme : lightTheme}>
        <Box
          data-testid="dark-mode-preview"
          data-mode={mode}
          sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: 1, borderColor: 'divider', bgcolor: 'background.default', color: 'text.primary' }}
        >
          <Typography component="p" sx={{ fontWeight: 700, mb: 1.5 }}>
            Invite a teammate
          </Typography>
          <TextField label="Email" type="email" size="sm" fullWidth placeholder="sam@example.com" />
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, my: 2 }}>
            <Chip color="success" variant="soft" label="Editor" size="sm" />
            <Chip color="neutral" variant="outlined" label="3 seats left" size="sm" />
          </Stack>
          <Alert color="info" size="sm">
            Invites expire after 7 days.
          </Alert>
          <Stack direction="row" useFlexGap sx={{ gap: 1, mt: 2, justifyContent: 'flex-end' }}>
            <Button variant="ghost" color="neutral" size="sm">
              Cancel
            </Button>
            <Button size="sm">Send invite</Button>
          </Stack>
        </Box>
      </ThemeProvider>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Overriding styles: the same Button four ways.
// ---------------------------------------------------------------------------

const Pill = styled(Button)({ borderRadius: 999 });

// Function themes nest: each one extends whatever theme the page already uses.
const squared = (outer: Theme) =>
  createTheme(outer, {
  components: {
    // Loses to the Sorbet Button's own radius: same specificity, Sorbet comes later.
    MuiButton: { styleOverrides: { root: { borderRadius: 2 } } },
  },
});
const squaredStrong = (outer: Theme) =>
  createTheme(outer, {
  components: {
    // '&&' doubles the class, so this one wins.
    MuiButton: { styleOverrides: { root: { '&&': { borderRadius: 2 } } } },
  },
});

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack spacing={1} sx={{ alignItems: 'center', minWidth: 120 }}>
      {children}
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'var(--font-mono), ui-monospace, monospace' }}>
        {label}
      </Typography>
    </Stack>
  );
}

export function OverrideLadder() {
  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 3, justifyContent: 'center' }} data-testid="override-ladder">
      <Labeled label="default">
        <Button data-case="default">Save</Button>
      </Labeled>
      <Labeled label="theme override">
        <ThemeProvider theme={squared}>
          <Button data-case="theme">Save</Button>
        </ThemeProvider>
      </Labeled>
      <Labeled label="theme override, &&">
        <ThemeProvider theme={squaredStrong}>
          <Button data-case="theme-strong">Save</Button>
        </ThemeProvider>
      </Labeled>
      <Labeled label="styled()">
        <Pill data-case="styled">Save</Pill>
      </Labeled>
      <Labeled label="sx">
        <Button data-case="sx" sx={{ borderRadius: 0 }}>
          Save
        </Button>
      </Labeled>
    </Stack>
  );
}
