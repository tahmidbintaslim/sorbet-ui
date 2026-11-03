import type { Metadata } from 'next';
import { Box, Container, Stack, Typography } from '@mui/material';
import BlockViewer from '@/components/BlockViewer';
import { BLOCK_GROUPS } from '@/lib/blocks';

export const metadata: Metadata = {
  title: 'Blocks',
  description: 'Copy-paste page sections built with Sorbet UI: heroes, features and calls to action.',
};

export default function BlocksPage() {
  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 } }}>
      <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 40, md: 56 }, letterSpacing: '-0.04em' }}>
        Blocks
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: 18, mt: 1.5, maxWidth: 640 }}>
        Page sections built only with Sorbet UI and Material UI. Open the code tab and paste a block into your app. Copy is sample text.
      </Typography>
      <Stack direction="row" spacing={1} component="nav" aria-label="Block groups" sx={{ mt: 3 }} flexWrap="wrap" useFlexGap>
        {BLOCK_GROUPS.map((g) => (
          <Box key={g.id} component="a" href={`#${g.id}`} sx={{ px: 1.5, py: 0.75, borderRadius: 2, border: 1, borderColor: 'divider', color: 'text.primary', textDecoration: 'none', fontSize: 14, fontWeight: 600, '&:hover': { bgcolor: 'action.hover' } }}>
            {g.title} · {g.blocks.length}
          </Box>
        ))}
      </Stack>
      {BLOCK_GROUPS.map((g) => (
        <Box key={g.id} component="section" id={g.id} sx={{ mt: 8, scrollMarginTop: 80 }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', mb: 3 }}>
            {g.title}
          </Typography>
          <Stack spacing={6}>
            {g.blocks.map((b) => (
              <BlockViewer key={b.id} id={b.id} name={b.name} description={b.description} />
            ))}
          </Stack>
        </Box>
      ))}
    </Container>
  );
}
