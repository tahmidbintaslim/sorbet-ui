import { Box, Divider, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { Meta, StoryObj } from 'storybook/react';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Button } from './Button';
import { Menu, MenuColor, MenuProps, MenuVariant } from './Menu';
import { MenuItem } from './Select';

// =============================================================================
// SAMPLE DATA
// =============================================================================

const VARIANTS: MenuVariant[] = ['solid', 'soft', 'outlined', 'ghost', 'plain'];
const COLORS: MenuColor[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'];

const Icon = ({ d }: { d: string }) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const EditIcon = () => <Icon d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />;
const CopyIcon = () => <Icon d="M9 9h11v11H9zM5 15H4V4h11v1" />;
const ArchiveIcon = () => <Icon d="M3 4h18v4H3zM5 8v12h14V8M10 12h4" />;

/** Menu items shared by the stories: icons, a selected item, a divider and a disabled item. */
const items = (selected = 'Duplicate') => [
  <MenuItem key="edit" selected={selected === 'Edit'}>
    <ListItemIcon>
      <EditIcon />
    </ListItemIcon>
    <ListItemText>Edit</ListItemText>
  </MenuItem>,
  <MenuItem key="duplicate" selected={selected === 'Duplicate'}>
    <ListItemIcon>
      <CopyIcon />
    </ListItemIcon>
    <ListItemText>Duplicate</ListItemText>
  </MenuItem>,
  <Divider key="divider" />,
  <MenuItem key="archive">
    <ListItemIcon>
      <ArchiveIcon />
    </ListItemIcon>
    <ListItemText>Archive</ListItemText>
  </MenuItem>,
  <MenuItem key="delete" disabled>
    Delete
  </MenuItem>,
];

/**
 * A trigger button and its menu, wired the way the docs recommend: the button
 * names the menu and reports aria-haspopup / aria-controls / aria-expanded.
 */
function MenuDemo({
  label = 'Actions',
  defaultOpen = false,
  ...props
}: Partial<MenuProps> & { label?: string; defaultOpen?: boolean }) {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const id = React.useId();
  React.useEffect(() => {
    if (defaultOpen) setAnchor(buttonRef.current);
  }, [defaultOpen]);
  const open = Boolean(anchor);
  return (
    <>
      <Button
        ref={buttonRef}
        id={`${id}-button`}
        variant="outlined"
        color="neutral"
        aria-haspopup="true"
        aria-controls={open ? `${id}-menu` : undefined}
        aria-expanded={open ? 'true' : undefined}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        {label}
      </Button>
      <Menu
        id={`${id}-menu`}
        aria-labelledby={`${id}-button`}
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        {...props}
      >
        {props.children ?? items()}
      </Menu>
    </>
  );
}

/**
 * Static display for the matrix stories only: the menu renders in place, with no
 * backdrop, focus trap or portal, so many menus can show at once. Real menus open
 * from a trigger (see MenuDemo).
 */
function InlineMenu({ variant, color, size, label }: Partial<MenuProps> & { label: string }) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Box ref={setContainer}>
        {container && (
          <Menu
            open
            variant={variant}
            color={color}
            size={size}
            aria-label={label}
            container={container}
            disablePortal
            hideBackdrop
            disableScrollLock
            disableAutoFocus
            disableEnforceFocus
            disableRestoreFocus
            autoFocus={false}
            anchorReference="none"
            transitionDuration={0}
            sx={{ position: 'relative', inset: 'auto', zIndex: 'auto' }}
            slotProps={{ paper: { sx: { position: 'static', maxHeight: 'none' } } }}
          >
            {items()}
          </Menu>
        )}
      </Box>
    </Box>
  );
}

// =============================================================================
// META
// =============================================================================

const meta = {
  title: 'Molecules/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: {
    open: false,
    onClose: fn(),
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: VARIANTS,
      description: 'Visual style variant',
    },
    color: {
      control: { type: 'select' },
      options: COLORS,
      description: 'Color scheme',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Menu size',
    },
  },
  render: (args) => <MenuDemo variant={args.variant} color={args.color} size={args.size} defaultOpen />,
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// VARIANT STORIES (each opens from its trigger)
// =============================================================================

export const Solid: Story = { args: { variant: 'solid' } };
export const Soft: Story = { args: { variant: 'soft' } };
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Plain: Story = { args: { variant: 'plain' } };

// =============================================================================
// MATRIX STORIES
// =============================================================================

/** Every variant in every color with a selected and a disabled item, so axe checks each pair. */
export const VariantColorMatrix: Story = {
  name: 'Variant × Color Matrix',
  render: () => (
    <Stack spacing={4}>
      {VARIANTS.map((variant) => (
        <Box key={variant}>
          <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
            {variant}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
            {COLORS.map((color) => (
              <InlineMenu key={color} variant={variant} color={color} label={`${variant} ${color}`} />
            ))}
          </Box>
        </Box>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <InlineMenu key={size} size={size} variant="soft" label={`Size ${size.toUpperCase()}`} />
      ))}
    </Box>
  ),
};

// =============================================================================
// INTERACTION & ACCESSIBILITY STORIES
// =============================================================================

export const KeyboardNavigation: Story = {
  render: () => <MenuDemo variant="outlined" />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Actions' });
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu', { name: 'Actions' });
    await waitFor(() => expect(menu).toBeVisible());
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // The selected item gets focus on open; arrow keys move between items.
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const FocusFirstItem: Story = {
  name: 'focusVariant="menu"',
  render: () => <MenuDemo variant="soft" focusVariant="menu" />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));
    // The first item gets focus even though another item is selected.
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
  },
};

// =============================================================================
// DARK MODE
// =============================================================================

export const DarkMode: Story = {
  // Rendered with darkTheme (see .storybook/preview.tsx).
  globals: { backgrounds: { value: 'dark' } },
  render: () => (
    <Stack spacing={4}>
      {VARIANTS.map((variant) => (
        <Box key={variant}>
          <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
            {variant}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
            {COLORS.map((color) => (
              <InlineMenu key={color} variant={variant} color={color} label={`${variant} ${color}`} />
            ))}
          </Box>
        </Box>
      ))}
    </Stack>
  ),
};

export const DarkModeOpen: Story = {
  globals: { backgrounds: { value: 'dark' } },
  args: { variant: 'soft', color: 'primary' },
};
