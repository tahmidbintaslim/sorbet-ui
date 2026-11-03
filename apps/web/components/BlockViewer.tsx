'use client';
// Preview / Code switch for one block. The code is the block's real source,
// copied in at build time by scripts/gen-blocks.mjs.
import * as React from 'react';
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import CodeBlock from './CodeBlock';
import { BLOCK_SOURCE } from '@/lib/blocks-source';
import { BLOCK_COMPONENTS } from './blocks-registry';

export default function BlockViewer({ id, name, description }: { id: string; name: string; description: string }) {
  const [view, setView] = React.useState<'preview' | 'code'>('preview');
  const Block = BLOCK_COMPONENTS[id];
  return (
    <Box component="article" id={id} sx={{ scrollMarginTop: 90 }}>
      <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={2} sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
        <Box>
          <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18 }}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
        <ToggleButtonGroup size="small" exclusive value={view} onChange={(_, v) => v && setView(v)} aria-label={`${name} view`}>
          <ToggleButton value="preview">Preview</ToggleButton>
          <ToggleButton value="code">Code</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {view === 'preview' ? (
            <Box data-testid={`block-${id}`} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden', bgcolor: 'background.default' }}>
              <Block />
            </Box>
          ) : (
            <CodeBlock code={BLOCK_SOURCE[id]} title={`${id}.tsx`} label={`${name} source`} />
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
