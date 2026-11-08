import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { colorScaleForMode } from '@sorbet-ui/tokens';
import { describe, expect, it } from 'vitest';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders with open state', () => {
    render(
      <Drawer open onClose={() => {}} data-testid="drawer">
        <div>Drawer content</div>
      </Drawer>
    );
    expect(screen.getByText('Drawer content')).toBeInTheDocument();
  });

  it('names the modal dialog with aria-label (MUI v7 and v9)', () => {
    render(
      <Drawer open onClose={() => {}} aria-label="Project menu">
        <div>Drawer content</div>
      </Drawer>
    );
    const dialog = screen.getByRole('dialog', { name: 'Project menu' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveTextContent('Drawer content');
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <Drawer open onClose={() => {}} variant={variant} data-testid={`drawer-${variant}`}>
          <div data-testid={`drawer-content-${variant}`}>{variant}</div>
        </Drawer>
      );
      expect(screen.getByTestId(`drawer-content-${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('handles open state change', () => {
    const { rerender } = render(
      <Drawer open onClose={() => {}}>
        Drawer content
      </Drawer>
    );

    expect(screen.getByText('Drawer content')).toBeInTheDocument();

    rerender(
      <Drawer open={false} onClose={() => {}}>
        Drawer content
      </Drawer>
    );

    // Component still in DOM for animations, verify it's rendered
    expect(screen.getByText('Drawer content')).toBeInTheDocument();
  });

  it('supports different anchors', () => {
    const anchors = ['left', 'right', 'top', 'bottom'] as const;
    anchors.forEach((anchor) => {
      const { unmount } = render(
        <Drawer open onClose={() => {}} anchor={anchor} data-testid={`drawer-${anchor}`}>
          <div data-testid={`drawer-${anchor}-content`}>{anchor}</div>
        </Drawer>
      );
      expect(screen.getByTestId(`drawer-${anchor}-content`)).toBeInTheDocument();
      unmount();
    });
  });

  // Styles live in emotion <style> tags; read the rules for this paper's classes.
  const paperCss = () => {
    const paper = document.querySelector('.MuiDrawer-paper') as HTMLElement;
    const css = Array.from(document.head.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('');
    return { paper, css };
  };

  describe.each([
    ['light', false],
    ['dark', true],
  ] as const)('%s mode color', (mode, isDark) => {
    it('solid shows the color as an inner-edge accent', () => {
      const scale = colorScaleForMode('danger', isDark);
      render(
        <ThemeProvider theme={createTheme({ palette: { mode } })}>
          <Drawer open color="danger" anchor="left">
            Menu
          </Drawer>
        </ThemeProvider>
      );
      const { paper, css } = paperCss();
      expect(paper).toBeInTheDocument();
      expect(css).toContain(`border-right:4px solid ${scale.main}`);
    });

    it('outlined uses the color for its border on the right-anchored edge', () => {
      const scale = colorScaleForMode('info', isDark);
      render(
        <ThemeProvider theme={createTheme({ palette: { mode } })}>
          <Drawer open variant="outlined" color="info" anchor="right">
            Menu
          </Drawer>
        </ThemeProvider>
      );
      expect(paperCss().css).toContain(`border-left:2px solid ${scale.main}`);
    });
  });

  it('neutral (default) keeps a plain surface with no accent', () => {
    const scale = colorScaleForMode('neutral', false);
    render(
      <Drawer open anchor="left">
        Menu
      </Drawer>
    );
    expect(paperCss().css).not.toContain(`border-right:4px solid ${scale.main}`);
  });
});
