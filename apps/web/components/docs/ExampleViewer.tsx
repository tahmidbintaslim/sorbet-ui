'use client';
// One docs example: title, description, the live example on a stage, and its exact
// source underneath. The server page passes the rendered example as children and
// the source text (from scripts/gen-docs.mjs) as a prop, so each component page
// ships only its own examples and the shown code is the code that runs.
import * as React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CodeBlock from '@/components/CodeBlock';
import { scoopAt } from '@/lib/scoops';
import { ScoopDot } from '@/components/fun/Decor';
import DocHeading from './DocHeading';

// Collapsed, the panel shows the file header and about six lines of code.
const COLLAPSED = 196;
const CODE_BG = '#0b1220'; // matches CodeBlock
const SHORT = 9; // sources this short are shown in full

export default function ExampleViewer({
  id,
  title,
  description,
  source,
  file,
  index = 0,
  children,
}: {
  id: string;
  title: string;
  description: string;
  source: string;
  /** File name shown in the code header. */
  file: string;
  /** Position on the page: picks the flavor dot. */
  index?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const collapsible = source.trimEnd().split('\n').length > SHORT;
  const collapsed = collapsible && !open;
  const codeId = `${id}-code`;

  return (
    <Box component="article" aria-labelledby={id} data-testid={`example-${id}`} sx={{ minWidth: 0 }}>
      <DocHeading id={id} level={3} label={title} before={<ScoopDot c={scoopAt(index)} size={12} />}>
        {title}
      </DocHeading>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2, textWrap: 'pretty' }}>
        {description}
      </Typography>

      {/* The stage: a calm dotted surface with the example centered on it. */}
      <Box
        data-testid={`stage-${id}`}
        sx={(t) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 148,
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 4 },
          border: 1,
          borderBottom: 0,
          borderColor: 'divider',
          borderRadius: '16px 16px 0 0',
          bgcolor: 'background.paper',
          backgroundImage: `radial-gradient(${alpha(t.palette.text.primary, 0.1)} 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
          backgroundPosition: '9px 9px',
          overflowX: 'auto',
          minWidth: 0,
        })}
      >
        {children}
      </Box>

      <Box
        id={codeId}
        data-testid={`code-${id}`}
        data-collapsed={collapsed}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0 0 16px 16px',
          bgcolor: CODE_BG,
          maxHeight: collapsed ? COLLAPSED : 'none',
          // CodeBlock brings its own margins and corners; here it joins the stage.
          '& > div:first-of-type': { my: 0, borderRadius: 0, border: 0 },
          pb: collapsible && open ? '44px' : 0,
        }}
      >
        <CodeBlock code={source} title={file} label={`${title} source`} />
        {collapsible && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              pt: collapsed ? 6 : 0,
              pb: 1,
              background: collapsed ? `linear-gradient(to bottom, transparent, ${CODE_BG} 62%)` : 'none',
              pointerEvents: 'none',
            }}
          >
            <ButtonBase
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={codeId}
              sx={{
                pointerEvents: 'auto',
                gap: 0.5,
                minHeight: 36,
                px: 2,
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                color: '#e2e8f0',
                bgcolor: '#1e293b',
                border: '1px solid rgba(148,163,184,.35)',
                '&:hover': { bgcolor: '#334155' },
                '&:focus-visible': { outline: '2px solid #7dd3fc', outlineOffset: 2 },
                '@media (max-width: 899.95px), (pointer: coarse)': { minHeight: 44 },
              }}
            >
              {open ? 'Hide code' : 'Show code'}
              <ExpandMore sx={{ fontSize: 18, transform: open ? 'rotate(180deg)' : 'none' }} />
            </ButtonBase>
          </Box>
        )}
      </Box>
    </Box>
  );
}
