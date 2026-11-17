'use client';
// Shop FAQ on the Accordion: one panel open at a time, keyboard and screen-reader
// wiring come from the component.
import * as React from 'react';
import { Box } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '@sorbet-ui/react';

const QA = [
  { id: 'vegan', q: 'Any vegan scoops?', a: 'Every sorbet is dairy free. Mango Tango and Raspberry Ripple are our favorites.' },
  { id: 'pints', q: 'Can I take a pint home?', a: 'Yes. Pints are packed to order and stay frozen for about an hour in our bags.' },
  { id: 'party', q: 'Do you cater parties?', a: 'Party boxes of 12 cups, with a cooler, can be booked a day ahead.' },
  { id: 'taste', q: 'Can I taste first?', a: 'Always. Ask for a tiny spoon of anything in the case.' },
];

export default function Faq() {
  const [open, setOpen] = React.useState<string | false>('vegan');
  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: 2, display: 'grid', alignContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 360, mx: 'auto' }}>
        {QA.map((x) => (
          <Accordion key={x.id} size="sm" color="info" expanded={open === x.id} onChange={(_, isOpen) => setOpen(isOpen ? x.id : false)}>
            <AccordionSummary>{x.q}</AccordionSummary>
            <AccordionDetails>{x.a}</AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}
