'use client';
// Below md the docs sidebar moves into a drawer, opened from a sticky
// "Browse docs" bar above the page content, so the page itself comes first.
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Box, Button, Drawer, GlobalStyles, IconButton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuBook from '@mui/icons-material/MenuBookOutlined';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import Close from '@mui/icons-material/Close';
import DocsNav, { docsPageLabel } from './DocsNav';

const BAR = 61; // sticky bar height, kept clear when jumping to #anchors

export default function DocsMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  // Close the drawer whenever the route changes.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  const close = () => setOpen(false);
  const current = docsPageLabel(pathname);

  return (
    <>
      <GlobalStyles styles={{ '@media (max-width: 899.95px)': { html: { scrollPaddingTop: BAR } } }} />
      <Box
        sx={(t) => ({
          display: { md: 'none' },
          position: 'sticky',
          top: 65, // header height incl. its border
          zIndex: t.zIndex.appBar - 1,
          mx: { xs: -2, sm: -3 },
          px: { xs: 2, sm: 3 },
          py: 1,
          mb: 2,
          bgcolor: alpha(t.palette.background.default, 0.92),
          backdropFilter: 'saturate(180%) blur(12px)',
          borderBottom: 1,
          borderColor: 'divider',
        })}
      >
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? 'docs-menu' : undefined}
          startIcon={<MenuBook />}
          endIcon={<UnfoldMore />}
          sx={{
            minHeight: 44,
            justifyContent: 'flex-start',
            borderColor: 'divider',
            fontWeight: 600,
            textTransform: 'none',
            '& .MuiButton-endIcon': { ml: 'auto' },
          }}
        >
          Browse docs
          {current && (
            <Typography
              component="span"
              aria-hidden
              sx={{ ml: 1, color: 'text.secondary', fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              / {current}
            </Typography>
          )}
        </Button>
      </Box>
      <Drawer
        anchor="left"
        open={open}
        onClose={close}
        slotProps={{
          paper: { id: 'docs-menu', role: 'dialog', 'aria-modal': true, 'aria-label': 'Docs pages', sx: { width: 'min(320px, 85vw)' } },
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            minHeight: 64,
            borderBottom: 1,
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            bgcolor: 'background.paper',
            zIndex: 1,
          }}
        >
          <Typography component="span" sx={{ fontWeight: 700 }}>
            Docs
          </Typography>
          <IconButton onClick={close} aria-label="Close docs menu" sx={{ width: 44, height: 44, mr: -1 }}>
            <Close />
          </IconButton>
        </Stack>
        <DocsNav inDrawer onNavigate={close} />
      </Drawer>
    </>
  );
}
