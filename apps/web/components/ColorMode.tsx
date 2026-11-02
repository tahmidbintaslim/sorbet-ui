'use client';
// Client-side color mode: follows the OS setting until the visitor picks one,
// then remembers the choice in localStorage. Storage access is always guarded
// because it throws in private windows and with blocked site data.
import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';

export type Mode = 'light' | 'dark';
const KEY = 'sorbet-color-mode';

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
  // Start light so server and first client render match; adjust after mount.
  const [mode, setMode] = React.useState<Mode>('light');

  React.useEffect(() => {
    const stored = readStored();
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setMode(stored ?? preferred);
  }, []);

  const value = React.useMemo(
    () => ({
      mode,
      toggle: () =>
        setMode((m) => {
          const next: Mode = m === 'light' ? 'dark' : 'light';
          try {
            window.localStorage.setItem(KEY, next);
          } catch {
            /* storage unavailable: the choice just won't persist */
          }
          return next;
        }),
    }),
    [mode],
  );

  React.useEffect(() => {
    document.documentElement.style.colorScheme = mode;
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
