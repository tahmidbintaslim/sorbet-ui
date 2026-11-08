'use client';
// Wraps your app in the Sorbet theme. Existing @mui/material screens restyle with
// no code changes; Sorbet blocks and components get their tokens from it.
// Usage: <SorbetProvider mode="light"><App /></SorbetProvider>
import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';

export type SorbetProviderProps = {
  children: React.ReactNode;
  /** 'system' follows the operating system setting. Default 'light'. */
  mode?: 'light' | 'dark' | 'system';
};

export default function SorbetProvider({ children, mode = 'light' }: SorbetProviderProps) {
  const [systemDark, setSystemDark] = React.useState(false);
  React.useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mode]);
  const dark = mode === 'dark' || (mode === 'system' && systemDark);
  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
