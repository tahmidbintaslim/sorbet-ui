'use client';
// @example {"title":"Variants","description":"Five looks, from a filled header to plain divided rows."}
import { Box } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function Variants() {
  return (
    <Box sx={{ width: '100%', maxWidth: 480, display: 'grid', gap: 1.5 }}>
      {VARIANTS.map((variant) => (
        <Accordion key={variant} variant={variant} defaultExpanded={variant === 'solid'}>
          <AccordionSummary>The {variant} variant</AccordionSummary>
          <AccordionDetails>Open and close it to see the {variant} look in both states.</AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
