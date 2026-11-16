'use client';
// The box a template runs in: preview frames, the full-screen route and the demo.
// - Its own light or dark Sorbet theme, independent of the site's.
// - It is the containing block for the template's dialogs, drawers and toasts
//   (`transform` scopes position: fixed), so overlays stay inside the frame.
// - Optional radius preset for the demo's theme control.
import * as React from 'react';
import { Box, ThemeProvider, createTheme, type SxProps, type Theme } from '@mui/material';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';

export type StageMode = 'light' | 'dark';
export type StageRadius = 'sharp' | 'soft' | 'round';

const FONT = 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// Sorbet components take their corners from tokens, so the presets restyle them by
// class here. 'soft' is the library default and changes nothing.
const RADIUS: Record<StageRadius, { shape: number; control: string; surface: string } | null> = {
  sharp: { shape: 2, control: '4px', surface: '6px' },
  soft: null,
  round: { shape: 6, control: '999px', surface: '22px' },
};

const radiusSx = (r: StageRadius) => {
  const p = RADIUS[r];
  if (!p) return {};
  return {
    '& .MuiButton-root, & .MuiChip-root, & .MuiToggleButton-root, & .MuiTab-root, & .MuiPaginationItem-root, & .MuiButtonBase-root.MuiIconButton-root': { borderRadius: p.control },
    '& .MuiOutlinedInput-root, & .MuiFilledInput-root, & .MuiInputBase-root': { borderRadius: r === 'round' ? '14px' : p.control },
    '& .MuiTabs-root': { borderRadius: r === 'round' ? '999px' : p.control },
    '& .MuiCard-root, & .MuiDialog-paper, & .MuiAlert-root, & .MuiTableContainer-root, & .MuiAccordion-root': { borderRadius: p.surface },
  };
};

export default function TemplateStage({
  mode,
  radius = 'soft',
  scroll = true,
  children,
  sx,
  ...rest
}: {
  mode: StageMode;
  radius?: StageRadius;
  /** Page templates scroll inside the stage; app templates manage their own scrolling. */
  scroll?: boolean;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
  // Dialogs and drawers mount here instead of <body>.
  const [host, setHost] = React.useState<HTMLDivElement | null>(null);
  const theme = React.useMemo(
    () =>
      createTheme(mode === 'dark' ? darkTheme : lightTheme, {
        typography: { fontFamily: FONT },
        ...(RADIUS[radius] && { shape: { borderRadius: RADIUS[radius]!.shape * 2 } }),
        components: {
          MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
          MuiToggleButton: { styleOverrides: { root: { textTransform: 'none' } } },
          MuiModal: { defaultProps: { container: host ?? undefined } },
        },
      }),
    [mode, radius, host],
  );
  return (
    <ThemeProvider theme={theme}>
      <Box
        {...rest}
        data-stage-mode={mode}
        sx={[
          {
            position: 'relative',
            overflow: 'hidden',
            transform: 'translateZ(0)',
            colorScheme: mode,
            bgcolor: 'background.default',
            color: 'text.primary',
            fontFamily: FONT,
          },
          radiusSx(radius),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <Box data-stage-scroll sx={{ height: '100%', overflowY: scroll ? 'auto' : 'hidden', overflowX: 'hidden' }}>{children}</Box>
        <div ref={setHost} />
      </Box>
    </ThemeProvider>
  );
}
