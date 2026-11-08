'use client';
import NextLink from 'next/link';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Chip } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import { TEMPLATES } from '@/lib/templates';

const GRADIENTS = [
  [colorPalette.primary[300], colorPalette.secondary[300]],
  [colorPalette.danger[200], colorPalette.warning[200]],
  [colorPalette.info[200], colorPalette.success[200]],
  [colorPalette.warning[200], colorPalette.danger[200]],
  [colorPalette.secondary[200], colorPalette.primary[200]],
  [colorPalette.success[200], colorPalette.info[300]],
];

export default function TemplateCards() {
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {TEMPLATES.map((t, i) => (
        <Grid key={t.slug} size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            component={NextLink}
            href={`/templates/${t.slug}`}
            sx={{ display: 'block', height: '100%', borderRadius: 4, overflow: 'hidden', border: 1, borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary', textDecoration: 'none', transition: 'transform .2s, box-shadow .2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 20px 40px -24px rgba(15,23,42,.4)' } }}
          >
            {/* Wireframe thumbnail: one bar per block in the template. */}
            <Box aria-hidden sx={{ p: 2.5, height: 170, background: `linear-gradient(135deg, ${GRADIENTS[i % 6][0]}, ${GRADIENTS[i % 6][1]})` }}>
              <Stack spacing={0.75} sx={{ bgcolor: 'rgba(255,255,255,.85)', borderRadius: 2, p: 1.25, height: '100%', overflow: 'hidden' }}>
                {t.blocks.slice(0, 7).map((b, j) => (
                  <Box key={b} sx={{ height: j === 1 ? 28 : 10, borderRadius: 1, bgcolor: j === 1 ? 'rgba(15,23,42,.18)' : 'rgba(15,23,42,.08)', width: j % 3 === 2 ? '70%' : '100%' }} />
                ))}
              </Stack>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }} spacing={1}>
                <Typography component="h2" sx={{ fontWeight: 700, fontSize: 18 }}>
                  {t.name}
                </Typography>
                <Chip size="sm" variant="soft" color="success" label="Free" />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t.description}
              </Typography>
              <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', mt: 1.5 }} useFlexGap>
                {t.tags.map((tag) => (
                  <Chip key={tag} size="xs" variant="outlined" color="neutral" label={tag} />
                ))}
                <Chip size="xs" variant="outlined" color="neutral" label={`${t.blocks.length} blocks`} />
              </Stack>
            </Box>
          </Box>
        </Grid>
      ))}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Box
          component={NextLink}
          href="/demo"
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', minHeight: 300, p: 3, borderRadius: 4, border: '2px dashed', borderColor: 'divider', color: 'text.primary', textDecoration: 'none', '&:hover': { borderColor: 'primary.main' } }}
        >
          <Typography component="h2" sx={{ fontWeight: 700, fontSize: 18 }}>
            Admin dashboard (live demo)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            A working app with orders, customers, dialogs and toasts. Source in the repo under apps/web/components/demo.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
