import { Accordion as MuiAccordion, AccordionSummary as MuiAccordionSummary } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { colorScaleForMode } from '@sorbet-ui/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';

expect.extend(toHaveNoViolations);

const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

// jsdom resolves the cascade by source order only, not by specificity. Rendering
// MUI's own Accordion first inserts its ButtonBase rules ahead of the Sorbet rules,
// which are more specific and win in a browser.
beforeAll(() => {
  for (const theme of [lightTheme, darkTheme]) {
    render(
      <ThemeProvider theme={theme}>
        <MuiAccordion>
          <MuiAccordionSummary>Warm-up</MuiAccordionSummary>
        </MuiAccordion>
      </ThemeProvider>
    );
    cleanup();
  }
});

function rgb(hex: string): string {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
}

const Item = (props: React.ComponentProps<typeof Accordion>) => (
  <Accordion {...props}>
    <AccordionSummary>Shipping</AccordionSummary>
    <AccordionDetails>Ships in two days.</AccordionDetails>
  </Accordion>
);

describe('Accordion', () => {
  it('renders the summary as a native button with aria-expanded', () => {
    render(<Item />);
    const button = screen.getByRole('button', { name: 'Shipping' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('wires aria-controls to a region labelled by the summary', () => {
    render(<Item defaultExpanded />);
    const button = screen.getByRole('button', { name: 'Shipping' });
    const region = screen.getByRole('region', { name: 'Shipping' });
    expect(button).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveAttribute('aria-labelledby', button.id);
    expect(region).toHaveTextContent('Ships in two days.');
  });

  it('keeps ids the caller set on the summary', () => {
    render(
      <Accordion defaultExpanded>
        <AccordionSummary id="faq-1-header" aria-controls="faq-1-panel">
          Returns
        </AccordionSummary>
        <AccordionDetails>Within 30 days.</AccordionDetails>
      </Accordion>
    );
    expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute('id', 'faq-1-header');
    expect(screen.getByRole('region', { name: 'Returns' })).toHaveAttribute('id', 'faq-1-panel');
  });

  it('gives each accordion its own ids', () => {
    render(
      <>
        <Item />
        <Item />
      </>
    );
    const [a, b] = screen.getAllByRole('button', { name: 'Shipping' });
    expect(a.id).not.toBe(b.id);
    expect(a.getAttribute('aria-controls')).not.toBe(b.getAttribute('aria-controls'));
  });

  it('toggles on click and calls onChange', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Item onChange={onChange} />);
    const button = screen.getByRole('button', { name: 'Shipping' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(onChange).toHaveBeenCalledWith(expect.anything(), true);
  });

  it('toggles with Enter and Space', async () => {
    const user = userEvent.setup();
    render(<Item />);
    const button = screen.getByRole('button', { name: 'Shipping' });
    button.focus();
    await user.keyboard('{Enter}');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard(' ');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders every variant, color and size', () => {
    for (const variant of ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const) {
      for (const size of ['xs', 'sm', 'md', 'lg', 'xl'] as const) {
        const { unmount } = render(<Item variant={variant} size={size} color="success" />);
        expect(screen.getByRole('button', { name: 'Shipping' })).toBeInTheDocument();
        unmount();
      }
    }
  });

  it('disables the summary button', () => {
    render(<Item disabled />);
    expect(screen.getByRole('button', { name: 'Shipping' })).toBeDisabled();
  });

  it('renders a decorative default expand icon, and none when expandIcon is null', () => {
    const { container, unmount } = render(<Item />);
    const icon = container.querySelector('.MuiAccordionSummary-expandIconWrapper svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    unmount();
    const { container: bare } = render(
      <Accordion>
        <AccordionSummary expandIcon={null}>Bare</AccordionSummary>
        <AccordionDetails>Body</AccordionDetails>
      </Accordion>
    );
    expect(bare.querySelector('.MuiAccordionSummary-expandIconWrapper')).toBeNull();
  });

  it('forwards the ref to the root element', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Item ref={ref} />);
    expect(ref.current).toHaveClass('MuiAccordion-root');
  });

  it.each([
    ['light', lightTheme, false],
    ['dark', darkTheme, true],
  ] as const)('the solid summary uses the main shade for %s mode', (_mode, theme, isDark) => {
    render(
      <ThemeProvider theme={theme}>
        <Item variant="solid" color="primary" />
      </ThemeProvider>
    );
    const scale = colorScaleForMode('primary', isDark);
    const button = screen.getByRole('button', { name: 'Shipping' });
    expect(getComputedStyle(button).backgroundColor).toBe(rgb(scale.main));
    expect(getComputedStyle(button).color).toBe(rgb(scale.contrastText));
  });

  it('has no axe violations', async () => {
    const { container } = render(<Item defaultExpanded variant="soft" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
