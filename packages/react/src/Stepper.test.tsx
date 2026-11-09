import { Step, StepLabel } from '@mui/material';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Stepper, StepperStep } from './Stepper';

expect.extend(toHaveNoViolations);

const steps: StepperStep[] = [
  { label: 'Cart' },
  { label: 'Shipping' },
  { label: 'Payment' },
  { label: 'Review' },
];

describe('Stepper', () => {
  it('renders the steps as an ordered list', () => {
    const { container } = render(<Stepper aria-label="Checkout" steps={steps} activeStep={1} />);
    const list = screen.getByRole('list', { name: 'Checkout' });
    expect(list.tagName).toBe('OL');
    expect(container.querySelectorAll('ol > li')).toHaveLength(4);
  });

  it('hides the decorative connectors from assistive technology', () => {
    const { container } = render(<Stepper steps={steps} activeStep={1} />);
    const connectors = container.querySelectorAll('.MuiStepConnector-root');
    expect(connectors.length).toBe(3);
    connectors.forEach((c) => expect(c).toHaveAttribute('aria-hidden', 'true'));
  });

  it('marks only the active step with aria-current="step"', () => {
    const { container } = render(<Stepper steps={steps} activeStep={2} />);
    const current = container.querySelectorAll('[aria-current="step"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent('Payment');
  });

  it('adds screen-reader text for completed and failed steps', () => {
    render(
      <Stepper
        activeStep={2}
        steps={[{ label: 'Cart' }, { label: 'Shipping', error: true }, { label: 'Payment' }]}
      />
    );
    expect(screen.getByText('Cart').parentElement).toHaveTextContent('Cart (completed)');
    expect(screen.getByText(/Shipping/)).toHaveTextContent('Shipping (error)');
    expect(screen.getByText('Payment')).not.toHaveTextContent('completed');
  });

  it('shows the optional caption and the description', () => {
    render(
      <Stepper
        steps={[
          { label: 'Account', description: 'Name and email' },
          { label: 'Team', optional: true },
        ]}
        optionalLabel="Can skip"
      />
    );
    expect(screen.getByText('Name and email')).toBeInTheDocument();
    expect(screen.getByText('Can skip')).toBeInTheDocument();
  });

  it('renders the indicators as decorative, with a check for completed steps', () => {
    const { container } = render(<Stepper steps={steps} activeStep={1} />);
    const indicators = container.querySelectorAll('.SorbetStepIndicator-root');
    expect(indicators).toHaveLength(4);
    expect(indicators[0]).toHaveAttribute('data-state', 'completed');
    expect(indicators[0].querySelector('svg')).not.toBeNull();
    expect(indicators[1]).toHaveAttribute('data-state', 'active');
    expect(indicators[1]).toHaveTextContent('2');
    expect(indicators[2]).toHaveAttribute('data-state', 'upcoming');
    indicators.forEach((i) => expect(i).toHaveAttribute('aria-hidden', 'true'));
  });

  it('makes steps clickable with onStepClick and puts aria-current on the button', async () => {
    const onStepClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Stepper steps={steps} activeStep={1} nonLinear onStepClick={onStepClick} />
    );
    await user.click(screen.getByText('Review'));
    expect(onStepClick).toHaveBeenCalledWith(3);
    const current = container.querySelector('[aria-current="step"]');
    expect(current?.tagName).toBe('BUTTON');
    expect(current).toHaveTextContent('Shipping');
  });

  it('respects explicit completed and disabled flags', () => {
    const { container } = render(
      <Stepper
        nonLinear
        activeStep={0}
        steps={[{ label: 'A' }, { label: 'B', completed: true }, { label: 'C', disabled: true }]}
      />
    );
    const indicators = container.querySelectorAll('.SorbetStepIndicator-root');
    expect(indicators[1]).toHaveAttribute('data-state', 'completed');
    expect(container.querySelectorAll('.MuiStepLabel-root')[2]).toHaveClass('Mui-disabled');
  });

  it('supports MUI Step children and still marks the current step', () => {
    const { container } = render(
      <Stepper activeStep={1}>
        <Step>
          <StepLabel>One</StepLabel>
        </Step>
        <Step>
          <StepLabel>Two</StepLabel>
        </Step>
      </Stepper>
    );
    expect(container.querySelectorAll('ol > li')).toHaveLength(2);
    expect(container.querySelector('[aria-current="step"]')).toHaveTextContent('Two');
  });

  it('renders every variant, color, size and orientation', () => {
    for (const variant of ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const) {
      for (const size of ['xs', 'md', 'xl'] as const) {
        const { unmount } = render(
          <Stepper variant={variant} size={size} color="warning" steps={steps} orientation="vertical" />
        );
        expect(screen.getByText('Cart')).toBeInTheDocument();
        unmount();
      }
    }
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Stepper aria-label="Checkout" steps={steps} activeStep={1} alternativeLabel />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
