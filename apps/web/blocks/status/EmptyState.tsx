'use client';
// @block {"name":"Empty state","description":"Friendly empty state with an icon, short message and primary action."}
import * as React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpenOutlined';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Card } from '@sorbet-ui/react';

export default function EmptyState() {
  const [created, setCreated] = React.useState(false);
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Card
          variant="outlined"
          sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', borderStyle: 'dashed', bgcolor: 'background.paper' }}
        >
          <Box
            aria-hidden
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'action.hover',
              color: 'primary.main',
            }}
          >
            <FolderOpenIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', mt: 3 }}>
            No projects yet
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 360, mx: 'auto' }}>
            Projects keep your Acme files, tasks and conversations in one place. Create your first one to get started.
          </Typography>
          {created ? (
            <Alert color="success" sx={{ mt: 3, textAlign: 'left' }}>
              “Untitled project” created. Give it a name to invite your team.
            </Alert>
          ) : (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center', mt: 3 }}>
              <Button size="lg" startIcon={<AddIcon />} onClick={() => setCreated(true)}>
                New project
              </Button>
              <Button size="lg" variant="plain" color="neutral" href="#">
                Import from CSV
              </Button>
            </Stack>
          )}
        </Card>
      </Container>
    </Box>
  );
}
