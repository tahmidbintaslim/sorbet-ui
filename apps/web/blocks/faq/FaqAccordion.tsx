'use client';
// @block {"name":"Accordion","description":"Frequently asked questions in an expandable accordion, one open at a time."}
import * as React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Button } from '@sorbet-ui/react';

const FAQS = [
  {
    q: 'How does the free trial work?',
    a: 'You get every feature for 14 days. At the end of the trial you can pick a plan or stay on the free tier, and nothing is charged automatically.',
  },
  {
    q: 'Can I import data from another tool?',
    a: 'Yes. Acme imports CSV files and has guided importers for common project tools, so tasks, owners and due dates come across intact.',
  },
  {
    q: 'Is there a limit on team members?',
    a: 'The free plan includes up to five members. Paid plans have no member limit and are billed per active seat each month.',
  },
  {
    q: 'How is my data protected?',
    a: 'Data is encrypted in transit and at rest, and workspace owners control who can see each project. You can export or delete your data at any time.',
  },
  {
    q: 'Do you offer discounts for nonprofits?',
    a: 'We offer reduced pricing for registered nonprofits and schools. Contact our team with a few details and we will set it up.',
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = React.useState<number | false>(0);
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 40 }, letterSpacing: '-0.03em' }}>
              Frequently asked questions
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 17 }}>
              Everything you need to know before getting started with Acme.
            </Typography>
          </Box>
          {FAQS.map((item, i) => (
            <Accordion
              key={item.q}
              disableGutters
              elevation={0}
              expanded={open === i}
              onChange={(_, isOpen) => setOpen(isOpen ? i : false)}
              sx={{
                bgcolor: 'transparent',
                borderBottom: 1,
                borderColor: 'divider',
                '&::before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`faq-accordion-${i}-content`}
                id={`faq-accordion-${i}-header`}
                sx={{ px: 0, py: 1 }}
              >
                <Typography component="h3" sx={{ fontWeight: 600, fontSize: 17 }}>
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pt: 0, pb: 3 }}>
                <Typography color="text.secondary">{item.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography color="text.secondary" sx={{ mb: 1.5 }}>
              Still have questions?
            </Typography>
            <Button variant="soft" href="#">
              Contact support
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
