// A responsive grid of DocLinkCards for "what's next" style sections.
import { Box } from '@mui/material';
import DocLinkCard from '@/components/docs/DocLinkCard';

export type LinkItem = { href: string; title: string; note: string };

export default function LinkGrid({ items, testId }: { items: LinkItem[]; testId?: string }) {
  return (
    <Box component="ul" data-testid={testId} sx={{ listStyle: 'none', p: '0 !important', my: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, '& > li': { m: '0 !important' } }}>
      {items.map((it) => (
        <li key={it.href}>
          <DocLinkCard href={it.href} title={it.title} note={it.note} />
        </li>
      ))}
    </Box>
  );
}
