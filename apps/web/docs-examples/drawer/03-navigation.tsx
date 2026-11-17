'use client';
// @example {"title":"Navigation drawer","description":"A menu of links in a left drawer. Choosing a link closes it."}
import * as React from 'react';
import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, Drawer } from '@sorbet-ui/react';

const LINKS = ['Overview', 'Deployments', 'Domains', 'Settings'];

export default function Navigation() {
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState('Overview');
  return (
    <>
      <Button variant="outlined" color="neutral" startIcon={<MenuIcon />} onClick={() => setOpen(true)}>
        Menu: {page}
      </Button>
      <Drawer anchor="left" size="sm" open={open} onClose={() => setOpen(false)} aria-label="Project menu">
        <Box component="nav" aria-label="Project" sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 700, px: 2, py: 1 }}>Project</Typography>
          <List component="div" disablePadding>
            {LINKS.map((link) => (
              <ListItemButton
                key={link}
                selected={link === page}
                aria-current={link === page ? 'page' : undefined}
                onClick={() => {
                  setPage(link);
                  setOpen(false);
                }}
                sx={{ borderRadius: 1 }}
              >
                <ListItemText primary={link} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
