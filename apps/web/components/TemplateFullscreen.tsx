'use client';
// A template on its own: fills the viewport, with the site header and footer hidden.
// A slim bar on top links back to the template page and switches light / dark. It
// sits above the template rather than floating over it, so it never covers the
// template's own controls (a cart's checkout button, a save bar, a send button).
import * as React from 'react';
import NextLink from 'next/link';
import { Box, GlobalStyles, IconButton, Typography } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import TemplateStage, { type StageMode } from './TemplateStage';
import { useColorMode } from './ColorMode';

// The site chrome is every sibling of <main id="main">: hide it on this route.
const HIDE_CHROME = { '*:has(~ #main), #main ~ *': { display: 'none !important' } };
const BAR = 44;

export default function TemplateFullscreen({ slug, name, layout, children }: { slug: string; name: string; layout: 'app' | 'page'; children: React.ReactNode }) {
  const site = useColorMode();
  const [picked, setPicked] = React.useState<StageMode | null>(null);
  const mode = picked ?? site.mode;
  return (
    <>
      <GlobalStyles styles={HIDE_CHROME} />
      <Box
        data-fullscreen-bar
        sx={{ height: BAR, display: 'flex', alignItems: 'center', gap: 1, px: 0.5, bgcolor: '#0f172a', color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,.12)' }}
      >
        <Box
          component={NextLink}
          href={`/templates/${slug}`}
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, minHeight: 44, px: 1.25, color: 'inherit', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: 999, flexShrink: 0, '&:hover': { textDecoration: 'underline' }, '&:focus-visible': { outline: '2px solid #f8fafc', outlineOffset: -4 } }}
        >
          <ArrowBack sx={{ fontSize: 16 }} />
          Back to template
        </Box>
        <Typography component="h1" noWrap sx={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#cbd5e1' }}>
          {name} template
        </Typography>
        <IconButton
          onClick={() => setPicked(mode === 'dark' ? 'light' : 'dark')}
          aria-label={mode === 'dark' ? 'Switch preview to light' : 'Switch preview to dark'}
          sx={{ color: 'inherit', width: 44, height: 44, flexShrink: 0, '&:hover': { bgcolor: 'rgba(255,255,255,.12)' } }}
        >
          {mode === 'dark' ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
        </IconButton>
      </Box>
      <TemplateStage mode={mode} scroll={layout === 'page'} data-testid="template-preview" sx={{ height: `calc(100dvh - ${BAR}px)` }}>
        {children}
      </TemplateStage>
    </>
  );
}
