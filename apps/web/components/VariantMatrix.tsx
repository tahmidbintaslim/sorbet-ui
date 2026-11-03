'use client';
import * as React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Button, Chip } from '@sorbet-ui/react';
import { COLORS, SIZES, VARIANTS, type Size } from '@/lib/site';

// Button has two extra variants beyond the shared five.
const BUTTON_VARIANTS = [...VARIANTS.slice(0, 3), 'dash', 'ghost', 'plain', 'link'] as const;

type Kind = 'button' | 'chip';

// Every variant × color combination, live. Scrolls inside its own box on
// narrow screens so the page itself never scrolls sideways.
export default function VariantMatrix() {
  const [kind, setKind] = React.useState<Kind>('button');
  const [size, setSize] = React.useState<Size>('sm');

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={kind}
          onChange={(_, v: Kind | null) => v && setKind(v)}
          aria-label="Component"
        >
          <ToggleButton value="button">Button</ToggleButton>
          <ToggleButton value="chip">Chip</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={size}
          onChange={(_, v: Size | null) => v && setSize(v)}
          aria-label="Size"
          disabled={kind === 'chip'}
        >
          {SIZES.map((s) => (
            <ToggleButton key={s} value={s}>
              {s}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box
        data-known-contrast
        tabIndex={0}
        role="region"
        aria-label="Variant and color matrix"
        sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `96px repeat(${COLORS.length}, minmax(112px, 1fr))`,
            alignItems: 'center',
            minWidth: 96 + COLORS.length * 112,
            p: 2,
            rowGap: 2,
          }}
        >
          <span />
          {COLORS.map((c) => (
            <Typography key={c} variant="caption" color="text.secondary" sx={{ textAlign: 'center', fontWeight: 600 }}>
              {c}
            </Typography>
          ))}
          {(kind === 'button' ? BUTTON_VARIANTS : VARIANTS).map((v) => (
            <React.Fragment key={v}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {v}
              </Typography>
              {COLORS.map((c) => (
                <Box key={c} sx={{ display: 'flex', justifyContent: 'center' }}>
                  {kind === 'button' ? (
                    <Button variant={v} color={c} size={size}>
                      Button
                    </Button>
                  ) : (
                    <Chip label="Chip" variant={v as (typeof VARIANTS)[number]} color={c} />
                  )}
                </Box>
              ))}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
