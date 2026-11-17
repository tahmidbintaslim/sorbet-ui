'use client';
// @example {"title":"Sizes","description":"size sets the summary height, the padding and the type size."}
import { Box } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Sizes() {
  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      {SIZES.map((size) => (
        <Accordion key={size} size={size}>
          <AccordionSummary>Size {size}</AccordionSummary>
          <AccordionDetails>Panel text follows the same size.</AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
