import { Box, List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import { Meta, StoryObj } from 'storybook/react';
import { expect } from 'storybook/test';
import { useState } from 'react';
import { Button } from './Button';
import { Drawer } from './Drawer';

const meta = {
  title: 'Molecules/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'soft', 'outlined', 'ghost', 'plain'],
    },
    anchor: {
      control: { type: 'select' },
      options: ['left', 'right', 'top', 'bottom'],
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

type DrawerColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

function DrawerExample({
  variant,
  color,
  label = 'Open Drawer',
}: {
  variant?: 'solid' | 'soft' | 'outlined' | 'ghost' | 'plain';
  color?: DrawerColor;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen} variant="soft">
        {label}
      </Button>
      <Drawer open={open} onClose={handleClose} variant={variant} color={color} anchor="left" aria-label="Navigation">
        <Box sx={{ width: 280, p: 2 }}>
          <List>
            {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton onClick={handleClose}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export const Solid: Story = {
  render: () => <DrawerExample variant="solid" />,
  play: async ({ canvas }) => {
    const openButton = canvas.getByRole('button', { name: /open drawer/i });
    await expect(openButton).toBeInTheDocument();
  },
};

export const Soft: Story = {
  render: () => <DrawerExample variant="soft" />,
};

export const Outlined: Story = {
  render: () => <DrawerExample variant="outlined" />,
};

export const Ghost: Story = {
  render: () => <DrawerExample variant="ghost" />,
};

export const Plain: Story = {
  render: () => <DrawerExample variant="plain" />,
};

export const AllVariants: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <DrawerExample variant="solid" />
      <DrawerExample variant="soft" />
      <DrawerExample variant="outlined" />
      <DrawerExample variant="ghost" />
      <DrawerExample variant="plain" />
    </Stack>
  ),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button', { name: /open drawer/i });
    await expect(buttons).toHaveLength(5);
  },
};

/** `color` adds an accent: an inner-edge stripe (solid, ghost, plain), a tint (soft) or the border (outlined). */
export const Colors: Story = {
  render: () => (
    <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
      {(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const).map(
        (c) => (
          <DrawerExample key={c} variant="solid" color={c} label={`Open ${c} drawer`} />
        )
      )}
    </Stack>
  ),
};

/** Opened by default so the accent is visible (and checked by axe) without interaction. */
export const ColorAccentOpen: Story = {
  render: () => (
    <Drawer
      open
      variant="soft"
      color="primary"
      anchor="left"
      disablePortal
      hideBackdrop
      aria-label="Project drawer"
    >
      <Box sx={{ width: 280, p: 2 }} role="navigation" aria-label="Project menu">
        <List>
          {['Overview', 'Deployments', 'Settings'].map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton>
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  ),
};

export const RightAnchor: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
      <>
        <Button onClick={handleOpen} variant="soft">
          Open Right Drawer
        </Button>
        <Drawer open={open} onClose={handleClose} variant="solid" anchor="right" aria-label="Account">
          <Box sx={{ width: 280, p: 2 }}>
            <List>
              {['Settings', 'Profile', 'Help', 'Logout'].map((item) => (
                <ListItem key={item} disablePadding>
                  <ListItemButton onClick={handleClose}>
                    <ListItemText primary={item} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </>
    );
  },
};

export const BottomAnchor: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
      <>
        <Button onClick={handleOpen} variant="soft">
          Open Bottom Drawer
        </Button>
        <Drawer open={open} onClose={handleClose} variant="solid" anchor="bottom" aria-label="Options">
          <Box sx={{ p: 2, textAlign: 'center', minHeight: 200 }}>
            <List>
              {['Option 1', 'Option 2', 'Option 3'].map((item) => (
                <ListItem key={item} disablePadding>
                  <ListItemButton onClick={handleClose} sx={{ justifyContent: 'center' }}>
                    <ListItemText primary={item} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </>
    );
  },
};
