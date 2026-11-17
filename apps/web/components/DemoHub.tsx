'use client';
// The demo hub: every app template, running live as a desktop and a phone preview
// side by side, with links to open it full screen or read its code. Previews are the
// real templates rendered at device size and scaled down (see TemplateThumb), so the
// phone one is the actual narrow layout, not a squeezed screenshot.
import NextLink from 'next/link';
import { Box, Stack, Typography } from '@mui/material';
import OpenInNew from '@mui/icons-material/OpenInNew';
import CodeOutlined from '@mui/icons-material/CodeOutlined';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { Button, Chip } from '@sorbet-ui/react';
import { TEMPLATES } from '@/lib/templates';
import { scoop, scoopAt } from '@/lib/scoops';
import { touchTarget } from '@/lib/touch';
import TemplateThumb, { DESKTOP, PHONE } from './TemplateThumb';

const APPS = ['analytics-dashboard', 'inbox', 'kanban', 'settings', 'storefront'].map((slug) => TEMPLATES.find((t) => t.slug === slug)!);

const linkSx = {
  ...touchTarget,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  px: 1.75,
  minHeight: 38,
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 700,
  textDecoration: 'none',
  '&:focus-visible': { outline: '3px solid', outlineColor: 'text.primary', outlineOffset: 2 },
} as const;

export default function DemoHub({ demoId }: { demoId: string }) {
  return (
    <Box component="section" aria-labelledby="demo-apps" sx={{ pt: { xs: 4, md: 6 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography id="demo-apps" component="h2" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 32 }, letterSpacing: '-0.02em' }}>
            Apps you can open
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 620 }}>
            Each one is a free template, running live below at desktop and phone size. Open it full screen to click around, or read its code.
          </Typography>
        </Box>
        <Button
          variant="soft"
          color="info"
          endIcon={<ArrowDownward />}
          onClick={() => document.getElementById(demoId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          sx={{ ...touchTarget, flexShrink: 0, borderRadius: 999 }}
        >
          Jump to Acme Admin
        </Button>
      </Stack>

      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: { xs: 3, md: 4 }, gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' } }}>
        {APPS.map((t, i) => {
          const c = scoopAt(i + 3);
          return (
            <Box
              component="li"
              key={t.slug}
              data-testid={`demo-card-${t.slug}`}
              sx={{
                borderRadius: 5,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                overflow: 'hidden',
                transition: 'box-shadow .25s, border-color .2s',
                '&:hover, &:focus-within': { borderColor: scoop(c, 'fill'), boxShadow: `0 22px 44px -28px ${scoop(c, 'fill')}` },
              }}
            >
              {/* Stage: the desktop preview with the phone one standing in front of it. */}
              <Box sx={{ position: 'relative', px: { xs: 2, sm: 3 }, pt: { xs: 2.5, sm: 3.5 }, pb: { xs: 2.5, sm: 3.5 }, bgcolor: scoop(c, 'tint'), borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ width: { xs: '100%', sm: '84%' }, borderRadius: '10px', overflow: 'hidden', border: 1, borderColor: 'divider', boxShadow: '0 18px 40px -24px rgba(15,23,42,.45)', bgcolor: 'background.paper' }}>
                  <Stack direction="row" spacing={0.5} aria-hidden sx={{ px: 1, py: 0.75, borderBottom: 1, borderColor: 'divider' }}>
                    {['danger', 'warning', 'success'].map((d) => (
                      <Box key={d} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: scoop(d as 'danger', 'fill') }} />
                    ))}
                  </Stack>
                  <TemplateThumb slug={t.slug} view={DESKTOP} testId={`demo-desktop-${t.slug}`} />
                </Box>
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    position: 'absolute',
                    right: { sm: 20, md: 24 },
                    bottom: 16,
                    width: '24%',
                    p: '5px',
                    borderRadius: '22px',
                    bgcolor: '#0f172a',
                    boxShadow: '0 24px 40px -18px rgba(15,23,42,.6)',
                    transform: 'rotate(2deg)',
                    transition: 'transform .35s cubic-bezier(.3,1.4,.5,1)',
                    'li:hover &': { transform: 'rotate(0deg) translateY(-4px)' },
                    '@media (prefers-reduced-motion: reduce)': { transition: 'none', 'li:hover &': { transform: 'rotate(2deg)' } },
                  }}
                >
                  <TemplateThumb slug={t.slug} view={PHONE} testId={`demo-phone-${t.slug}`} sx={{ borderRadius: '17px' }} />
                </Box>
              </Box>
              <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}>
                  <Typography component="h3" sx={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', mr: 'auto !important' }}>
                    {t.name}
                  </Typography>
                  <Chip size="sm" variant="soft" color="info" label={t.type} />
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  {t.description}
                </Typography>
                <Stack direction="row" sx={{ gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  <Box component={NextLink} href={`/templates/${t.slug}/preview`} aria-label={`Open app: ${t.name}, full screen`} sx={{ ...linkSx, color: 'background.paper', bgcolor: 'text.primary', '&:hover': { opacity: 0.88 } }}>
                    <OpenInNew sx={{ fontSize: 16 }} />
                    Open app
                  </Box>
                  <Box component={NextLink} href={`/templates/${t.slug}`} aria-label={`Sizes and code: ${t.name}`} sx={{ ...linkSx, color: 'text.primary', border: 1, borderColor: 'divider', '&:hover': { borderColor: 'text.primary' } }}>
                    <CodeOutlined sx={{ fontSize: 16 }} />
                    Sizes and code
                  </Box>
                </Stack>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
