'use client';
// Drag (or use arrow keys on) the handle to compare the same form in stock
// Material UI and in Sorbet UI. The handle is a native range input, so it is
// keyboard and screen-reader accessible for free.
import * as React from 'react';
import { Box, Button as MuiButton, Chip as MuiChip, Stack, TextField as MuiTextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { Button, Chip, TextField } from '@sorbet-ui/react';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import { animate, useInView, useReducedMotion } from 'motion/react';

// Stock MUI theme (no CssBaseline here: a nested one would restyle <body>).
const muiDefault = createTheme();

function Form({ sorbet }: { sorbet: boolean }) {
  return (
    <Stack spacing={2.5} sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 560, mx: 'auto' }}>
      <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>
        {sorbet ? 'With Sorbet UI' : 'Default Material UI'}
      </Typography>
      <Typography component="p" sx={{ fontWeight: 700, fontSize: 24, mt: '0 !important' }}>
        Invite a teammate
      </Typography>
      {sorbet ? (
        <>
          <TextField label="Email" defaultValue="sam@acme.dev" variant="soft" fullWidth />
          <TextField label="Role" defaultValue="Editor" variant="outlined" fullWidth />
          <Stack direction="row" spacing={1}>
            <Chip label="Design" variant="soft" color="primary" />
            <Chip label="Billing" variant="soft" color="secondary" />
            <Chip label="Admin" variant="outlined" color="neutral" />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="solid">Send invite</Button>
            <Button variant="soft" color="neutral">
              Cancel
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <MuiTextField label="Email" defaultValue="sam@acme.dev" fullWidth />
          <MuiTextField label="Role" defaultValue="Editor" fullWidth />
          <Stack direction="row" spacing={1}>
            <MuiChip label="Design" />
            <MuiChip label="Billing" />
            <MuiChip label="Admin" variant="outlined" />
          </Stack>
          <Stack direction="row" spacing={1}>
            <MuiButton variant="contained">Send invite</MuiButton>
            <MuiButton>Cancel</MuiButton>
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default function BeforeAfter() {
  const [pos, setPos] = React.useState(50);
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const touched = React.useRef(false);

  // One-time sweep when scrolled into view, so it reads as draggable.
  React.useEffect(() => {
    if (!inView || reduce) return;
    const ctl = animate(50, [50, 82, 18, 38], {
      duration: 2.2,
      ease: 'easeInOut',
      onUpdate: (v) => {
        if (!touched.current) setPos(Math.round(v));
      },
    });
    return () => ctl.stop();
  }, [inView, reduce]);

  return (
    <Box>
      <Box
        ref={ref}
        sx={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          minHeight: { xs: 460, sm: 440 },
        }}
      >
        {/* Sorbet (right/back layer) */}
        <Box data-known-contrast sx={{ position: 'absolute', inset: 0, zIndex: 0, isolation: 'isolate' }}>
          <Form sorbet />
        </Box>
        {/* Stock MUI (front layer, clipped to the handle position). Always light, like an unthemed app. */}
        <Box
          aria-hidden={pos < 4}
          sx={{ position: 'absolute', inset: 0, zIndex: 1, isolation: 'isolate', clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: 'clip-path .05s linear' }}
        >
          <ThemeProvider theme={muiDefault}>
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#fff', color: 'rgba(0,0,0,.87)' }}>
              <Form sorbet={false} />
            </Box>
          </ThemeProvider>
        </Box>
        {/* Divider + handle */}
        <Box
          aria-hidden
          sx={{ position: 'absolute', zIndex: 2, top: 0, bottom: 0, left: `${pos}%`, width: 2, ml: '-1px', bgcolor: 'primary.main', pointerEvents: 'none' }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%) rotate(90deg)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'grid',
              placeItems: 'center',
              boxShadow: 3,
            }}
          >
            <UnfoldMore />
          </Box>
        </Box>
        <Box
          component="input"
          type="range"
          min={0}
          max={100}
          value={pos}
          aria-label="Compare default Material UI with Sorbet UI"
          aria-valuetext={`${pos}% default Material UI`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            touched.current = true;
            setPos(Number(e.target.value));
          }}
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            width: '100%',
            height: '100%',
            m: 0,
            opacity: 0,
            cursor: 'ew-resize',
            '&:focus-visible + .ba-focus': { opacity: 1 },
          }}
        />
        <Box
          className="ba-focus"
          aria-hidden
          sx={{ position: 'absolute', zIndex: 3, inset: 0, borderRadius: 4, outline: '3px solid', outlineColor: 'primary.main', outlineOffset: -3, opacity: 0, pointerEvents: 'none' }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, textAlign: 'center' }}>
        Same form, same props. Drag the handle, or focus it and use the arrow keys.
      </Typography>
    </Box>
  );
}
