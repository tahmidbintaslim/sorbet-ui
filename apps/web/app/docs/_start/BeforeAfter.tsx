'use client';
// The same stock @mui/material screen rendered twice: once with Material UI's
// default theme, once inside the Sorbet theme. Nothing else changes between the
// two panels. Follows the site's light or dark mode.
import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  useTheme,
} from '@mui/material';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';

/** Plain Material UI code: no Sorbet imports. */
function InviteCard() {
  return (
    <Card sx={{ maxWidth: 360, mx: 'auto' }}>
      <CardContent>
        <Typography component="p" variant="h6" sx={{ mb: 0.5 }}>
          Invite a teammate
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          They can open every project in this workspace.
        </Typography>
        <TextField label="Email" defaultValue="ana@example.com" size="small" fullWidth sx={{ mb: 2 }} />
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label="Editor" color="primary" />
          <Chip label="Viewer" variant="outlined" />
        </Stack>
        <FormControlLabel control={<Switch defaultChecked />} label="Email them a link" sx={{ mb: 2 }} />
        <Stack direction="row" spacing={1}>
          <Button variant="contained">Send invite</Button>
          <Button variant="outlined">Cancel</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Panel({ caption, theme, testId }: { caption: string; theme: ReturnType<typeof createTheme>; testId: string }) {
  return (
    <Box component="figure" data-testid={testId} sx={{ m: 0, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography component="figcaption" variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
        {caption}
      </Typography>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.default',
            color: 'text.primary',
            // Ripples and hover transitions are motion: drop them when asked.
            '@media (prefers-reduced-motion: reduce)': {
              '& .MuiTouchRipple-root': { display: 'none' },
              '& *': { transition: 'none !important' },
            },
          }}
        >
          <InviteCard />
        </Box>
      </ThemeProvider>
    </Box>
  );
}

export default function BeforeAfter() {
  const mode = useTheme().palette.mode;
  const stock = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);
  return (
    <Box
      data-testid="before-after"
      sx={{ my: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}
    >
      <Panel caption="Material UI default theme" theme={stock} testId="before-panel" />
      <Panel caption="Same code inside the Sorbet theme" theme={mode === 'dark' ? darkTheme : lightTheme} testId="after-panel" />
    </Box>
  );
}
