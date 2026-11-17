'use client';
// FAQ questions on the Sorbet Accordion. Each question is a native button with
// aria-expanded (from the component), several can be open at once, and a link to
// /docs/faq#<id> opens that question.
import * as React from 'react';
import NextLink from 'next/link';
import { Box, Link, Stack, Typography } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary, type AccordionColor } from '@sorbet-ui/react';
import type { FaqItem } from './faq-data';

export default function FaqAccordion({ items, color = 'primary' }: { items: FaqItem[]; color?: AccordionColor }) {
  const [open, setOpen] = React.useState<string[]>([]);

  // Open the question named in the URL hash, on load and when the hash changes.
  React.useEffect(() => {
    const sync = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (items.some((i) => i.id === id)) setOpen((o) => (o.includes(id) ? o : [...o, id]));
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [items]);

  return (
    <Stack spacing={1.25} sx={{ my: 2 }}>
      {items.map((item) => (
        <Accordion
          key={item.id}
          id={item.id}
          color={color}
          expanded={open.includes(item.id)}
          onChange={(_, isOpen) => setOpen((o) => (isOpen ? [...o, item.id] : o.filter((x) => x !== item.id)))}
          sx={{ scrollMarginTop: 88 }}
        >
          <AccordionSummary>{item.q}</AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: 15 }}>{item.a}</Typography>
            {item.links && item.links.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5, mt: 1.5 }}>
                {item.links.map((l) =>
                  l.href.startsWith('/') ? (
                    <Link key={l.href} component={NextLink} href={l.href} sx={{ fontWeight: 600, fontSize: 14, minHeight: 32, display: 'inline-flex', alignItems: 'center' }}>
                      {l.label}
                      <span aria-hidden>&nbsp;→</span>
                    </Link>
                  ) : (
                    <Link key={l.href} href={l.href} rel="noopener" sx={{ fontWeight: 600, fontSize: 14, minHeight: 32, display: 'inline-flex', alignItems: 'center' }}>
                      {l.label}
                      <span aria-hidden>&nbsp;↗</span>
                    </Link>
                  ),
                )}
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
