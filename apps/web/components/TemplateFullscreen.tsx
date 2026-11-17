'use client';
// A template on its own: fills the viewport, with the site header and footer hidden.
// A small pill links back to the template page and switches light / dark.
import * as React from 'react';
import NextLink from 'next/link';
import { Box, GlobalStyles, IconButton } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import TemplateStage, { type StageMode } from './TemplateStage';
import { useColorMode } from './ColorMode';

// The site chrome is every sibling of <main id="main">: hide it on this route.
const HIDE_CHROME = { '*:has(~ #main), #main ~ *': { display: 'none !important' } };
const SR_ONLY = { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const;

export default function TemplateFullscreen({ slug, name, layout, children }: { slug: string; name: string; layout: 'app' | 'page'; children: React.ReactNode }) {
  const site = useColorMode();
  const [picked, setPicked] = React.useState<StageMode | null>(null);
  const mode = picked ?? site.mode;
  return (
    <>
      <GlobalStyles styles={HIDE_CHROME} />
      <Box component="h1" sx={SR_ONLY}>
        {name} template
      </Box>
      <TemplateStage mode={mode} scroll={layout === 'page'} data-testid="template-preview" sx={{ height: '100dvh' }}>
        {children}
      </TemplateStage>
      <Box
        sx={{
          position: 'fixed',
          // Bottom left: templates keep their primary actions (bag, checkout, send) on the right.
          left: 12,
          bottom: 12,
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          px: 0.5,
          borderRadius: 999,
          bgcolor: '#0f172a',
          color: '#f8fafc',
          border: '1px solid rgba(255,255,255,.2)',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,.6)',
        }}
      >
        <Box
          component={NextLink}
          href={`/templates/${slug}`}
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, minHeight: 44, px: 1.5, color: 'inherit', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: 999, '&:hover': { textDecoration: 'underline' } }}
        >
          <ArrowBack sx={{ fontSize: 16 }} />
          Back to template
        </Box>
        <IconButton
          onClick={() => setPicked(mode === 'dark' ? 'light' : 'dark')}
          aria-label={mode === 'dark' ? 'Switch preview to light' : 'Switch preview to dark'}
          sx={{ color: 'inherit', width: 44, height: 44, '&:hover': { bgcolor: 'rgba(255,255,255,.12)' } }}
        >
          {mode === 'dark' ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
        </IconButton>
      </Box>
    </>
  );
}
