'use client';
// Wraps your app in the Sorbet theme. Existing @mui/material screens restyle with
// no code changes; Sorbet blocks and components get their tokens from it.
// Usage: <SorbetProvider mode="light"><App /></SorbetProvider>
// Next.js App Router: put it inside AppRouterCacheProvider (@mui/material-nextjs).
import * as React from 'react';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';

export type SorbetProviderProps = {
  children: React.ReactNode;
  /** 'system' follows the operating system setting. Default 'light'. */
  mode?: 'light' | 'dark' | 'system';
};

export default function SorbetProvider({ children, mode = 'light' }: SorbetProviderProps) {
  // noSsr reads the media query on the first client render, so dark users get no light flash.
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });
  const dark = mode === 'dark' || (mode === 'system' && systemDark);
  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
