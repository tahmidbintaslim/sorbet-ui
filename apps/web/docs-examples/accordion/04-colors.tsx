'use client';
// @example {"title":"Colors","description":"color tints the summary, the border or the surface, depending on the variant."}
import { Box } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '@sorbet-ui/react';

const COLORS = ['secondary', 'success', 'warning', 'danger'] as const;

export default function Colors() {
  return (
    <Box sx={{ width: '100%', maxWidth: 480, display: 'grid', gap: 1.5 }}>
      {COLORS.map((color) => (
        <Accordion key={color} variant="soft" color={color}>
          <AccordionSummary>A {color} item</AccordionSummary>
          <AccordionDetails>The panel shares the same tint.</AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
