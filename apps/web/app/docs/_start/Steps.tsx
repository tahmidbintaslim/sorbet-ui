// Numbered steps for the getting-started guides: a candy bubble with the number,
// a line down to the next step, and an h3 so each step is in "On this page".
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import DocHeading from '@/components/docs/DocHeading';
import { CANDY_TEXT, scoop, type Scoop } from '@/lib/scoops';

export function Steps({ children, flavor = 'success' }: { children: React.ReactNode; flavor?: Scoop }) {
  const items = React.Children.toArray(children);
  return (
    <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0, mt: 3, '& > li': { m: 0 } }}>
      {items.map((child, i) => (
        <Box
          component="li"
          key={i}
          sx={{
            position: 'relative',
            pl: { xs: 5, sm: 6 },
            pb: i === items.length - 1 ? 0 : 4,
            // The rail between bubbles.
            '&::before':
              i === items.length - 1
                ? undefined
                : { content: '""', position: 'absolute', left: { xs: 15, sm: 17 }, top: 40, bottom: 4, width: 2, borderRadius: 1, bgcolor: 'divider' },
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              left: 0,
              top: 2,
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: 15,
              bgcolor: scoop(flavor, 'candy'),
              color: CANDY_TEXT,
            }}
          >
            {i + 1}
          </Box>
          {child}
        </Box>
      ))}
    </Box>
  );
}

/**
 * One step: an h3 and its content. With an `id` the heading gets an anchor and can be
 * listed in the TOC; without one (e.g. inside a tab panel) it is a plain h3.
 */
export function Step({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <>
      {id ? (
        <DocHeading id={id} level={3}>
          {title}
        </DocHeading>
      ) : (
        <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3, minHeight: 36, display: 'flex', alignItems: 'center' }}>
          {title}
        </Typography>
      )}
      <Box sx={{ '& > p': { color: 'text.secondary', lineHeight: 1.75, my: 1.5 } }}>{children}</Box>
    </>
  );
}
