import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Menu, MenuProps } from './Menu';
import { MenuItem } from './Select';

function Demo(props: Partial<MenuProps>) {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  return (
    <>
      <button
        id="actions-button"
        aria-haspopup="true"
        aria-expanded={anchor ? 'true' : undefined}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        Actions
      </button>
      <Menu
        aria-labelledby="actions-button"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        {...props}
      >
        <MenuItem onClick={() => setAnchor(null)}>Edit</MenuItem>
        <MenuItem selected>Duplicate</MenuItem>
        <MenuItem>Archive</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>
    </>
  );
}

const open = async (props: Partial<MenuProps> = {}) => {
  const user = userEvent.setup();
  render(<Demo {...props} />);
  await user.click(screen.getByRole('button', { name: 'Actions' }));
  return user;
};

describe('Menu', () => {
  it('renders a menu with menuitems once open', async () => {
    await open();
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
  });

  it('names the menu list with aria-labelledby', async () => {
    await open();
    expect(screen.getByRole('menu', { name: 'Actions' })).toHaveAttribute(
      'aria-labelledby',
      'actions-button'
    );
  });

  it('names the menu list with aria-label', async () => {
    await open({ 'aria-labelledby': undefined, 'aria-label': 'Row actions' });
    expect(screen.getByRole('menu', { name: 'Row actions' })).toBeInTheDocument();
  });

  it('keeps list slot props the caller set', async () => {
    await open({ slotProps: { list: { dense: true, 'data-testid': 'list' } as object } });
    const list = screen.getByTestId('list');
    expect(list).toHaveAttribute('aria-labelledby', 'actions-button');
    expect(list).toHaveClass('MuiList-dense');
  });

  it('focuses the selected item on open and moves with the arrow keys', async () => {
    const user = await open();
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus());
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });

  it('focuses the first item instead with focusVariant="menu"', async () => {
    await open({ focusVariant: 'menu' });
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
  });

  it("accepts MUI's own variant values for drop-in compatibility", async () => {
    await open({ variant: 'menu' });
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    const user = await open({ onClose });
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('marks disabled items aria-disabled', async () => {
    await open();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('renders every variant, color and size', () => {
    for (const variant of ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const) {
      for (const color of ['primary', 'danger', 'neutral'] as const) {
        const { unmount } = render(
          <Menu open anchorEl={document.body} variant={variant} color={color} size="lg">
            <MenuItem>Item</MenuItem>
          </Menu>
        );
        expect(screen.getByRole('menuitem', { name: 'Item' })).toBeInTheDocument();
        unmount();
      }
    }
  });
});
