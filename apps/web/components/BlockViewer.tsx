'use client';
// Preview / Code switch for one block. The server page passes the rendered block
// as children and its real source (from scripts/gen-blocks.mjs) as a prop, so each
// page ships only its own blocks and source text.
import * as React from 'react';
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import CodeBlock, { CommandLine } from './CodeBlock';
import { addCommand, registryName } from '@/lib/registry';
import { touchTarget } from '@/lib/touch';

export default function BlockViewer({
  id,
  name,
  description,
  source,
  children,
}: {
  id: string;
  name: string;
  description: string;
  source: string;
  children: React.ReactNode;
}) {
  const [view, setView] = React.useState<'preview' | 'code'>('preview');
  return (
    <Box component="article" id={id} sx={{ scrollMarginTop: 80 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', mb: 1.5 }} useFlexGap>
        <Box>
          <Typography component="h2" sx={{ fontWeight: 700, fontSize: 18 }}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
        <ToggleButtonGroup size="small" sx={{ '& .MuiToggleButton-root': touchTarget }} exclusive value={view} onChange={(_, v) => v && setView(v)} aria-label={`${name} view`}>
          <ToggleButton value="preview">Preview</ToggleButton>
          <ToggleButton value="code">Code</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {/* One-command install through the shadcn CLI (see /docs#cli for the one-time setup). */}
      <Box sx={{ mb: 1.5 }}>
        <CommandLine command={addCommand(registryName(id))} label={`Install ${name} with the shadcn CLI`} mt={0} />
      </Box>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {view === 'preview' ? (
            <Box
              data-testid={`block-${id}`}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: 'background.default',
                // Phones: trim the block's own section padding so the preview gets the width.
                '@media (max-width: 599.95px)': {
                  '& > section': { py: 5 },
                  '& > section > .MuiContainer-root': { px: 1.5 },
                },
              }}
            >
              {children}
            </Box>
          ) : (
            <CodeBlock code={source} title={`${id}.tsx`} label={`${name} source`} />
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
