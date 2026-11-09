import { Box, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { Meta, StoryObj } from 'storybook/react';
import { expect, fn, userEvent } from 'storybook/test';
import {
  Accordion,
  AccordionColor,
  AccordionDetails,
  AccordionSummary,
  AccordionVariant,
} from './Accordion';

// =============================================================================
// SAMPLE DATA
// =============================================================================

const VARIANTS: AccordionVariant[] = ['solid', 'soft', 'outlined', 'ghost', 'plain'];
const COLORS: AccordionColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
];

const faq = [
  {
    id: 'install',
    question: 'How do I install Sorbet UI?',
    answer: 'Add @sorbet-ui/react and @sorbet-ui/theme, then wrap your app in the theme.',
  },
  {
    id: 'mui',
    question: 'Do I have to rewrite my MUI components?',
    answer: 'No. The components keep the MUI props they wrap, so you can swap them one at a time.',
  },
  {
    id: 'dark',
    question: 'Does it support dark mode?',
    answer: 'Yes. Every component reads the palette mode and switches to its dark-mode shades.',
  },
];

const FaqGroup = (props: {
  variant?: AccordionVariant;
  color?: AccordionColor;
  size?: React.ComponentProps<typeof Accordion>['size'];
  expandFirst?: boolean;
  /** Prefix for the questions, so several groups on one page keep unique names. */
  prefix?: string;
}) => {
  const { expandFirst = true, prefix, ...rest } = props;
  return (
    <Box>
      {faq.map((item, i) => (
        <Accordion key={item.id} {...rest} defaultExpanded={expandFirst && i === 0}>
          <AccordionSummary>
            {prefix ? `${prefix}: ` : ''}
            {item.question}
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

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
  title: 'Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    children: [
      <AccordionSummary key="summary">What is included in the free plan?</AccordionSummary>,
      <AccordionDetails key="details">
        <Typography variant="body2">
          Every component, both themes, the tokens package and the Storybook.
        </Typography>
      </AccordionDetails>,
    ],
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
      description: 'Accordion size',
    },
    disabled: { control: { type: 'boolean' } },
    defaultExpanded: { control: { type: 'boolean' } },
  },
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 560 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// VARIANT STORIES
// =============================================================================

export const Solid: Story = { args: { variant: 'solid', defaultExpanded: true } };
export const Soft: Story = { args: { variant: 'soft', defaultExpanded: true } };
export const Outlined: Story = { args: { variant: 'outlined', defaultExpanded: true } };
export const Ghost: Story = { args: { variant: 'ghost', defaultExpanded: true } };
export const Plain: Story = { args: { variant: 'plain', defaultExpanded: true } };

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={4}>
      {VARIANTS.map((variant) => (
        <Box key={variant}>
          <Caption>{variant}</Caption>
          <FaqGroup variant={variant} prefix={variant} />
        </Box>
      ))}
    </Stack>
  ),
};

// =============================================================================
// COLOR STORIES
// =============================================================================

/** Every variant in every color, first item expanded, so axe checks each pair. */
export const VariantColorMatrix: Story = {
  name: 'Variant × Color Matrix',
  render: () => (
    <Stack spacing={4}>
      {VARIANTS.map((variant) => (
        <Box key={variant}>
          <Typography variant="subtitle2" component="h2" sx={{ mb: 1, textTransform: 'capitalize' }}>
            {variant}
          </Typography>
          <Stack spacing={1.5}>
            {COLORS.map((color) => (
              <Accordion key={color} variant={variant} color={color} defaultExpanded>
                <AccordionSummary>
                  {variant} {color}
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">Panel text on the {color} surface.</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Secondary text.
                  </Typography>
                </AccordionDetails>
              </Accordion>
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
          <FaqGroup size={size} expandFirst={false} prefix={size.toUpperCase()} />
        </Box>
      ))}
    </Stack>
  ),
};

// =============================================================================
// FEATURE STORIES
// =============================================================================

export const Disabled: Story = {
  render: () => (
    <Stack spacing={3}>
      {VARIANTS.map((variant) => (
        <Accordion key={variant} variant={variant} disabled>
          <AccordionSummary>Disabled {variant} item</AccordionSummary>
          <AccordionDetails>Not reachable.</AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  ),
};

/** Only one item open at a time, with controlled `expanded`. */
export const Exclusive: Story = {
  render: function ExclusiveDemo() {
    const [open, setOpen] = React.useState<string | false>('install');
    return (
      <Box>
        {faq.map((item) => (
          <Accordion
            key={item.id}
            variant="soft"
            expanded={open === item.id}
            onChange={(_e, isOpen) => setOpen(isOpen ? item.id : false)}
          >
            <AccordionSummary>{item.question}</AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  },
};

export const WithoutExpandIcon: Story = {
  args: {
    variant: 'outlined',
    children: [
      <AccordionSummary key="s" expandIcon={null}>
        No chevron
      </AccordionSummary>,
      <AccordionDetails key="d">The summary still announces its state.</AccordionDetails>,
    ],
  },
};

// =============================================================================
// INTERACTION & ACCESSIBILITY STORIES
// =============================================================================

export const Toggle: Story = {
  args: { variant: 'outlined' },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'What is included in the free plan?' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Accessibility: Story = {
  args: { variant: 'soft', defaultExpanded: true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'What is included in the free plan?' });
    await expect(button.tagName).toBe('BUTTON');
    const region = canvas.getByRole('region', { name: 'What is included in the free plan?' });
    await expect(button).toHaveAttribute('aria-controls', region.id);
    // Keyboard: Enter and Space toggle the native button.
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard(' ');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
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
          <Typography variant="subtitle2" component="h2" sx={{ mb: 2 }}>
            On the {surface === 'default' ? 'page' : 'paper'}
          </Typography>
          <Stack spacing={3}>
            {VARIANTS.map((variant) => (
              <Box key={variant}>
                <Caption>{variant}</Caption>
                <Stack spacing={1}>
                  {COLORS.map((color) => (
                    <Accordion key={color} variant={variant} color={color} defaultExpanded size="sm">
                      <AccordionSummary>
                        {variant} {color} on the {surface === 'default' ? 'page' : 'paper'}
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2">Panel text.</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Secondary text.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
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
