import { Box, Step, StepLabel, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { Meta, StoryObj } from 'storybook/react';
import { expect, fn, userEvent } from 'storybook/test';
import { Button } from './Button';
import { Stepper, StepperColor, StepperStep, StepperVariant } from './Stepper';

// =============================================================================
// SAMPLE DATA
// =============================================================================

const VARIANTS: StepperVariant[] = ['solid', 'soft', 'outlined', 'ghost', 'plain'];
const COLORS: StepperColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
];

const checkout: StepperStep[] = [
  { label: 'Cart' },
  { label: 'Shipping' },
  { label: 'Payment' },
  { label: 'Review' },
];

const onboarding: StepperStep[] = [
  { label: 'Account', description: 'Name and email' },
  { label: 'Workspace', description: 'Pick a URL' },
  { label: 'Invite team', optional: true },
  { label: 'Done' },
];

const Caption = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="caption"
    color="text.secondary"
    sx={{ mb: 1, display: 'block', textTransform: 'capitalize' }}
  >
    {children}
  </Typography>
);

// =============================================================================
// META
// =============================================================================

const meta = {
  title: 'Molecules/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: {
    steps: checkout,
    activeStep: 1,
    'aria-label': 'Checkout progress',
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
      description: 'Stepper size',
    },
    activeStep: { control: { type: 'number', min: 0, max: 4 } },
    orientation: { control: { type: 'select' }, options: ['horizontal', 'vertical'] },
    alternativeLabel: { control: { type: 'boolean' } },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// VARIANT STORIES
// =============================================================================

export const Solid: Story = { args: { variant: 'solid' } };
export const Soft: Story = { args: { variant: 'soft' } };
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Plain: Story = { args: { variant: 'plain' } };

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={4}>
      {VARIANTS.map((variant) => (
        <Box key={variant}>
          <Caption>{variant}</Caption>
          <Stepper aria-label={`${variant} stepper`} variant={variant} steps={checkout} activeStep={2} />
        </Box>
      ))}
    </Stack>
  ),
};

// =============================================================================
// COLOR STORIES
// =============================================================================

/** Completed, current, failed and upcoming steps for every variant and color. */
export const VariantColorMatrix: Story = {
  name: 'Variant × Color Matrix',
  render: () => (
    <Stack spacing={4}>
      {VARIANTS.map((variant) => (
        <Box key={variant}>
          <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
            {variant}
          </Typography>
          <Stack spacing={2}>
            {COLORS.map((color) => (
              <Stepper
                key={color}
                aria-label={`${variant} ${color}`}
                variant={variant}
                color={color}
                size="sm"
                activeStep={2}
                steps={[
                  { label: 'Done' },
                  { label: 'Failed', error: true },
                  { label: color },
                  { label: 'Next' },
                ]}
              />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  ),
};

// =============================================================================
// SIZE STORIES
// =============================================================================

export const Sizes: Story = {
  render: () => (
    <Stack spacing={4}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Box key={size}>
          <Caption>Size: {size.toUpperCase()}</Caption>
          <Stepper aria-label={`Size ${size}`} size={size} steps={checkout} activeStep={1} />
        </Box>
      ))}
    </Stack>
  ),
};

// =============================================================================
// FEATURE STORIES
// =============================================================================

export const AlternativeLabel: Story = {
  args: { steps: onboarding, alternativeLabel: true, variant: 'outlined', activeStep: 2 },
};

export const Vertical: Story = {
  args: { steps: onboarding, orientation: 'vertical', variant: 'soft', activeStep: 1 },
};

export const WithError: Story = {
  args: {
    variant: 'solid',
    activeStep: 2,
    steps: [
      { label: 'Cart' },
      { label: 'Shipping' },
      { label: 'Payment', error: true, description: 'Card declined' },
      { label: 'Review' },
    ],
  },
};

/** Steps become buttons with `onStepClick`; `nonLinear` lets people jump around. */
export const Clickable: Story = {
  args: { onStepClick: fn(), nonLinear: true, variant: 'outlined' },
  play: async ({ args, canvas }) => {
    // MUI v9 gives step buttons role="tab"; v7 leaves them as buttons.
    await userEvent.click(canvas.getByText('Payment'));
    await expect(args.onStepClick).toHaveBeenCalledWith(2);
  },
};

export const Interactive: Story = {
  render: function InteractiveStepper() {
    const [active, setActive] = React.useState(0);
    const last = onboarding.length - 1;
    return (
      <Stack spacing={3}>
        <Stepper aria-label="Onboarding" steps={onboarding} activeStep={active} variant="soft" />
        <Stack direction="row" spacing={1}>
          <Button
            variant="ghost"
            color="neutral"
            disabled={active === 0}
            onClick={() => setActive((s) => s - 1)}
          >
            Back
          </Button>
          <Button disabled={active === last} onClick={() => setActive((s) => s + 1)}>
            Next
          </Button>
        </Stack>
      </Stack>
    );
  },
};

/** MUI `Step` / `StepLabel` children work too (MUI's StepIcon keeps the solid look). */
export const MuiChildren: Story = {
  name: 'MUI Step children',
  render: () => (
    <Stepper aria-label="Checkout progress" activeStep={1} color="success">
      <Step>
        <StepLabel>Cart</StepLabel>
      </Step>
      <Step>
        <StepLabel>Shipping</StepLabel>
      </Step>
      <Step>
        <StepLabel>Payment</StepLabel>
      </Step>
    </Stepper>
  ),
};

// =============================================================================
// ACCESSIBILITY
// =============================================================================

export const Accessibility: Story = {
  args: { variant: 'solid', activeStep: 2 },
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('ol');
    await expect(list).toHaveAttribute('aria-label', 'Checkout progress');
    const current = canvasElement.querySelectorAll('[aria-current="step"]');
    await expect(current).toHaveLength(1);
    await expect(current[0]).toHaveTextContent('Payment');
    // Completed steps say so to screen readers.
    await expect(canvasElement.querySelectorAll('li')[0]).toHaveTextContent('Cart (completed)');
  },
};

// =============================================================================
// DARK MODE
// =============================================================================

export const DarkMode: Story = {
  // Rendered with darkTheme (see .storybook/preview.tsx), on the page and on paper.
  globals: { backgrounds: { value: 'dark' } },
  render: () => (
    <Stack spacing={3}>
      {(['default', 'paper'] as const).map((surface) => (
        <Box key={surface} sx={{ p: 2, borderRadius: 2, bgcolor: `background.${surface}` }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            On the {surface === 'default' ? 'page' : 'paper'}
          </Typography>
          <Stack spacing={3}>
            {VARIANTS.map((variant) => (
              <Box key={variant}>
                <Caption>{variant}</Caption>
                <Stack spacing={1.5}>
                  {COLORS.map((color) => (
                    <Stepper
                      key={color}
                      aria-label={`${variant} ${color}`}
                      variant={variant}
                      color={color}
                      size="sm"
                      activeStep={2}
                      steps={[
                        { label: 'Done' },
                        { label: 'Failed', error: true },
                        { label: color, description: 'Now' },
                        { label: 'Next', optional: true },
                      ]}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  ),
};
