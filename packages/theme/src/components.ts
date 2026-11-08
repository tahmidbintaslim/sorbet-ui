import { alpha, type Components, type Theme } from '@mui/material/styles';

/**
 * Component overrides that give unchanged `@mui/material` code the Sorbet look.
 *
 * Wrap an existing MUI app in `lightTheme` / `darkTheme` and stock Buttons, TextFields,
 * Cards, Chips, Tabs, Tables, Dialogs and AppBars restyle with no code changes.
 * Colors are read from the theme palette, so every override follows light and dark
 * mode and keeps the contrast the palette guarantees. Uses only APIs that exist in
 * both MUI v7 and v9.
 */
export const sorbetComponents: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
    },
  },

  // Flat, rounded buttons with sentence-case labels and a visible focus ring.
  MuiButtonBase: {
    defaultProps: { disableRipple: false },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: theme.shape.borderRadius,
        paddingInline: theme.spacing(2),
        transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow', 'color'], {
          duration: theme.transitions.duration.short,
        }),
        '&.Mui-focusVisible': {
          boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.35)}`,
        },
      }),
      outlined: ({ theme }) => ({
        borderWidth: 1.5,
        '&:hover': { borderWidth: 1.5 },
        borderColor: alpha(theme.palette.text.primary, 0.2),
      }),
      sizeSmall: ({ theme }) => ({ paddingInline: theme.spacing(1.5) }),
      sizeLarge: ({ theme }) => ({ paddingInline: theme.spacing(3), fontSize: '1rem' }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        '&.Mui-focusVisible': { boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.35)}` },
      }),
    },
  },

  // Inputs: soft border, rounded corners, a focus ring instead of a thick outline.
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: alpha(theme.palette.text.primary, 0.18),
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: alpha(theme.palette.text.primary, 0.4),
        },
        '&.Mui-focused': {
          boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: 1.5,
          borderColor: theme.palette.primary.main,
        },
      }),
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: { fontWeight: 500 },
    },
  },

  // Surfaces: hairline borders and soft shadows instead of Material elevation.
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: { backgroundImage: 'none' },
      rounded: ({ theme }) => ({ borderRadius: Number(theme.shape.borderRadius) * 1.25 }),
      outlined: ({ theme }) => ({ borderColor: theme.palette.divider }),
      elevation1: ({ theme }) => ({
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 1px 2px rgba(0, 0, 0, 0.4)'
            : '0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.08)',
      }),
    },
  },
  MuiCard: {
    defaultProps: { variant: 'outlined' },
    styleOverrides: {
      root: ({ theme }) => ({ borderRadius: Number(theme.shape.borderRadius) * 1.5 }),
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: ({ theme }) => ({ padding: theme.spacing(3), '&:last-child': { paddingBottom: theme.spacing(3) } }),
    },
  },
  MuiAppBar: {
    defaultProps: { elevation: 0, color: 'inherit' },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: 'saturate(180%) blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: Number(theme.shape.borderRadius) * 2,
        border: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === 'dark' ? '0 8px 24px rgba(0, 0, 0, 0.5)' : '0 8px 24px rgba(15, 23, 42, 0.12)',
      }),
    },
  },

  // Chips: pill shape.
  MuiChip: {
    styleOverrides: {
      // Shape and weight only: colors stay MUI's (and Sorbet's Chip sets its own), so
      // contrast is unchanged.
      root: { fontWeight: 600, borderRadius: 999 },
    },
  },

  // Tabs: sentence case and a rounded indicator.
  MuiTabs: {
    styleOverrides: {
      indicator: { height: 3, borderRadius: 3 },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: { textTransform: 'none', fontWeight: 600, minHeight: 44 },
    },
  },

  // Tables: quiet header, hairline rows.
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({ borderColor: theme.palette.divider }),
      head: ({ theme }) => ({
        fontWeight: 600,
        color: theme.palette.text.secondary,
        backgroundColor: alpha(theme.palette.text.primary, 0.03),
      }),
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        borderRadius: Number(theme.shape.borderRadius) * 0.66,
        fontSize: '0.8125rem',
        fontWeight: 500,
        padding: theme.spacing(0.75, 1.25),
      }),
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({ borderRadius: theme.shape.borderRadius, alignItems: 'center' }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: { borderRadius: 999, height: 6 },
      bar: { borderRadius: 999 },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      switchBase: ({ theme }) => ({
        '&.Mui-focusVisible + .MuiSwitch-track': {
          boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.35)}`,
        },
      }),
      track: { borderRadius: 999 },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: { fontWeight: 600 },
    },
  },
};
