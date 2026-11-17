'use client';
// @example {"title":"One open at a time","description":"Control expanded and onChange so opening one item closes the others."}
import * as React from 'react';
import { Box } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '@sorbet-ui/react';

const ITEMS = [
  { id: 'shipping', q: 'How long does shipping take?', a: 'Two to four working days in sample-land.' },
  { id: 'returns', q: 'Can I return an order?', a: 'Unopened tubs can be returned within a week.' },
  { id: 'gift', q: 'Do you sell gift cards?', a: 'Yes, in any amount from 10 to 200.' },
];

export default function SingleOpen() {
  const [open, setOpen] = React.useState<string | null>('shipping');
  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      {ITEMS.map((item) => (
        <Accordion key={item.id} variant="soft" expanded={open === item.id} onChange={(_e, expanded) => setOpen(expanded ? item.id : null)}>
          <AccordionSummary>{item.q}</AccordionSummary>
          <AccordionDetails>{item.a}</AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
