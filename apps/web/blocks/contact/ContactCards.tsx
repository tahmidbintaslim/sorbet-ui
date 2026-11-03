'use client';
// @block {"name":"Contact cards","description":"Three cards for email, live chat and office address, each with an icon and action."}
import type * as React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import MailOutline from '@mui/icons-material/MailOutline';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import { Avatar, Button, Card } from '@sorbet-ui/react';

type Item = {
  title: string;
  body: string;
  detail: string;
  action: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success';
};

const ITEMS: Item[] = [
  {
    title: 'Email us',
    body: 'For account questions and anything that needs a paper trail.',
    detail: 'hello@acme.example',
    action: 'Send an email',
    icon: <MailOutline />,
    color: 'primary',
  },
  {
    title: 'Live chat',
    body: 'Talk to a real person, weekdays from 9am to 6pm.',
    detail: 'Average reply in a few minutes',
    action: 'Start a chat',
    icon: <ChatBubbleOutline />,
    color: 'secondary',
  },
  {
    title: 'Visit the office',
    body: 'Drop by for a coffee and a product walkthrough.',
    detail: '100 Example Street, Springfield',
    action: 'Get directions',
    icon: <PlaceOutlined />,
    color: 'success',
  },
];

export default function ContactCards() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto', mb: { xs: 5, md: 7 } }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 40 }, letterSpacing: '-0.03em' }}>
            We are here to help
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 17 }}>
            Pick whichever way works best for you.
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {ITEMS.map((item) => (
            <Grid key={item.title} size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Avatar variant="soft" color={item.color} size="lg" aria-hidden>
                  {item.icon}
                </Avatar>
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: 19, mt: 2.5 }}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {item.body}
                </Typography>
                <Typography sx={{ fontWeight: 600, mt: 2, overflowWrap: 'anywhere' }}>{item.detail}</Typography>
                <Box sx={{ flex: 1 }} />
                <Box sx={{ mt: 3 }}>
                  <Button variant="soft" color={item.color} href="#">
                    {item.action}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
