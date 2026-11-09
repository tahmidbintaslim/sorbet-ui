'use client';
// Client-side color mode: follows the OS setting until the visitor picks one,
// then remembers the choice in localStorage. Storage access is always guarded
// because it throws in private windows and with blocked site data.
import * as React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';
import { MotionConfig } from 'motion/react';
import { COLOR_MODE_KEY } from '@/lib/site';

// The site self-hosts Inter and JetBrains Mono through next/font (see app/layout.tsx),
// exposed as CSS variables; layer them over the published themes.
const FONT = 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const site = (base: typeof lightTheme) =>
  createTheme(base, {
    typography: { fontFamily: FONT },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
      MuiToggleButton: { styleOverrides: { root: { textTransform: 'none' } } },
    },
  });
const THEMES = { light: site(lightTheme), dark: site(darkTheme) };

export type Mode = 'light' | 'dark';

// useLayoutEffect warns during server rendering; it only matters in the browser.
const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
const KEY = COLOR_MODE_KEY;

const ColorModeContext = React.createContext<{ mode: Mode; toggle: () => void }>({
  mode: 'light',
  toggle: () => {},
});

export const useColorMode = () => React.useContext(ColorModeContext);

function readStored(): Mode | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

export default function ColorModeProvider({ children }: { children: React.ReactNode }) {
  // Start light so server and first client render match. The inline script in
  // app/layout.tsx has already marked <html> with the right mode; adopt it in a
  // layout effect, which runs before the browser paints the hydrated page.
  const [mode, setMode] = React.useState<Mode>('light');

  useIsoLayoutEffect(() => {
    const marked = document.documentElement.dataset.mode;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(marked === 'dark' || marked === 'light' ? marked : (readStored() ?? (mq.matches ? 'dark' : 'light')));
    // Follow OS changes until the visitor picks a mode themselves.
    const onChange = (e: MediaQueryListEvent) => {
      if (!readStored()) setMode(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const value = React.useMemo(
    () => ({
      mode,
      toggle: () => {
        const next: Mode = mode === 'light' ? 'dark' : 'light';
        try {
          window.localStorage.setItem(KEY, next);
        } catch {
          /* storage unavailable: the choice just won't persist */
        }
        setMode(next);
      },
    }),
    [mode],
  );

  useIsoLayoutEffect(() => {
    document.documentElement.style.colorScheme = mode;
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={THEMES[mode]}>
        <CssBaseline />
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
