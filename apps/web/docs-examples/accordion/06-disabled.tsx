'use client';
// @example {"title":"Disabled and custom icon","description":"disabled (from MUI) locks an item; expandIcon swaps the chevron, or null hides it."}
import { Box } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { Accordion, AccordionDetails, AccordionSummary } from '@sorbet-ui/react';

export default function Disabled() {
  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      <Accordion>
        <AccordionSummary expandIcon={<Add />}>With a plus icon</AccordionSummary>
        <AccordionDetails>Any node works as the expand icon.</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={null}>Without an icon</AccordionSummary>
        <AccordionDetails>The whole summary is still the button.</AccordionDetails>
      </Accordion>
      <Accordion disabled>
        <AccordionSummary>Disabled item</AccordionSummary>
        <AccordionDetails>This panel cannot be opened.</AccordionDetails>
      </Accordion>
    </Box>
  );
}
