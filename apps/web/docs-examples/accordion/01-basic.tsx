'use client';
// @example {"title":"Basic","description":"Each item is a summary button and a panel. The summary is wired to its panel for screen readers."}
import { Box } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '@sorbet-ui/react';

export default function Basic() {
  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      <Accordion defaultExpanded>
        <AccordionSummary>Can I cancel any time?</AccordionSummary>
        <AccordionDetails>Yes. Your plan stays active until the end of the billing period.</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary>Do you offer refunds?</AccordionSummary>
        <AccordionDetails>Within 14 days of purchase, no questions asked.</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary>Is there a free plan?</AccordionSummary>
        <AccordionDetails>The Solo plan is free for one seat and three projects.</AccordionDetails>
      </Accordion>
    </Box>
  );
}
