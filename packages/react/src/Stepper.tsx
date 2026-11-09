import {
  Step,
  StepButton,
  StepConnector,
  StepLabel,
  Stepper as MuiStepper,
  StepperProps as MuiStepperProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SorbetColor, SorbetSize, SorbetVariant } from '@sorbet-ui/core';
import { srOnly } from '@sorbet-ui/core';
import { colors, colorScaleForMode, textColorsForMode, transitions, typography } from '@sorbet-ui/tokens';
import * as React from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type StepperVariant = SorbetVariant;
export type StepperColor = SorbetColor;
export type StepperSize = SorbetSize;

export interface StepperStep {
  /** Step label */
  label: React.ReactNode;
  /** Secondary line under the label */
  description?: React.ReactNode;
  /** Shows the optional caption under the label */
  optional?: boolean;
  /** Marks the step completed. Defaults to `index < activeStep` (unless `nonLinear`). */
  completed?: boolean;
  /** Marks the step as having an error */
  error?: boolean;
  /** Disables the step (and its button when `onStepClick` is set) */
  disabled?: boolean;
}

export interface StepperProps extends Omit<MuiStepperProps, 'variant' | 'color'> {
  /** Steps as data. Without it, pass MUI `Step` children as with MUI's Stepper. */
  steps?: StepperStep[];
  /**
   * Visual style of the step indicators (applies to `steps`; MUI `StepIcon`s in
   * children mode always use the solid look).
   * - `solid`: filled circles; upcoming steps use a neutral fill.
   * - `soft`: tinted circles.
   * - `outlined`: rings; completed steps are filled.
   * - `ghost`: only the current step is filled; the rest are bare numbers.
   * - `plain`: no circles, just the number or check in the step color.
   */
  variant?: StepperVariant;
  /** Color scheme */
  color?: StepperColor;
  /** Size preset (indicator diameter and type size) */
  size?: StepperSize;
  /** Makes each step a button. Called with the step index. */
  onStepClick?: (index: number) => void;
  /** Caption shown under optional steps. */
  optionalLabel?: string;
  /** Screen-reader suffix for completed steps. */
  completedLabel?: string;
  /** Screen-reader suffix for steps with an error. */
  errorLabel?: string;
}

// =============================================================================
// SIZE CONFIG
// =============================================================================

const sizeConfig = {
  xs: { indicator: 20, indicatorFont: 10, labelFont: 12, captionFont: 11 },
  sm: { indicator: 24, indicatorFont: 11, labelFont: 13, captionFont: 11 },
  md: { indicator: 28, indicatorFont: 13, labelFont: 14, captionFont: 12 },
  lg: { indicator: 32, indicatorFont: 14, labelFont: 15, captionFont: 13 },
  xl: { indicator: 40, indicatorFont: 16, labelFont: 16, captionFont: 14 },
};

// =============================================================================
// STEP INDICATOR
// =============================================================================

type IndicatorState = 'active' | 'completed' | 'error' | 'upcoming';

const CheckIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface StepIndicatorProps {
  active?: boolean;
  completed?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Replaces MUI's StepIcon (through StepLabel's `slots.stepIcon`, in MUI v7 and v9).
 * Decorative: the label carries the name, and state goes in screen-reader text.
 */
function StepIndicator({ active, completed, error, icon, className }: StepIndicatorProps) {
  const state: IndicatorState = error
    ? 'error'
    : active
      ? 'active'
      : completed
        ? 'completed'
        : 'upcoming';
  return (
    <span
      className={['SorbetStepIndicator-root', className].filter(Boolean).join(' ')}
      data-state={state}
      aria-hidden="true"
    >
      {state === 'error' ? '!' : state === 'completed' ? <CheckIcon /> : icon}
    </span>
  );
}

// =============================================================================
// STYLED COMPONENTS
// =============================================================================

interface StyledProps {
  $variant: StepperVariant;
  $color: StepperColor;
  $size: StepperSize;
}

const StyledStepper = styled(MuiStepper, {
  shouldForwardProp: (prop) => !['$variant', '$color', '$size'].includes(prop as string),
})<StyledProps>(({ theme, $variant, $color, $size }) => {
  const isDark = theme.palette.mode === 'dark';
  const scale = colorScaleForMode($color, isDark);
  const danger = colorScaleForMode('danger', isDark);
  const neutral = colors.neutral;
  const text = textColorsForMode(isDark);
  const size = sizeConfig[$size];
  const d = size.indicator;

  // Every text/fill pair below is covered by packages/tokens/src/contrast.test.ts.
  const accentText = isDark ? scale.light : scale.dark;
  const filled = { backgroundColor: scale.main, color: scale.contrastText, borderColor: scale.main };
  const tinted = {
    backgroundColor: isDark ? scale.alpha20 : scale.alpha12,
    color: accentText,
    borderColor: 'transparent',
  };
  const bare = { backgroundColor: 'transparent', borderColor: 'transparent' };
  const neutralFill = {
    backgroundColor: isDark ? neutral[700] : neutral[200],
    color: isDark ? neutral[200] : neutral[700],
    borderColor: 'transparent',
  };
  const softNeutral = {
    backgroundColor: isDark ? neutral[700] : neutral[100],
    color: isDark ? neutral[200] : neutral[600],
    borderColor: 'transparent',
  };
  const errorFilled = { backgroundColor: danger.main, color: danger.contrastText, borderColor: danger.main };

  const indicator: Record<StepperVariant, Record<IndicatorState, Record<string, string>>> = {
    solid: { active: filled, completed: filled, upcoming: neutralFill, error: errorFilled },
    soft: {
      active: tinted,
      completed: tinted,
      upcoming: softNeutral,
      error: {
        backgroundColor: isDark ? danger.alpha20 : danger.alpha12,
        color: isDark ? danger.light : danger.dark,
        borderColor: 'transparent',
      },
    },
    outlined: {
      active: { backgroundColor: 'transparent', color: scale.main, borderColor: scale.main },
      completed: filled,
      upcoming: {
        backgroundColor: 'transparent',
        color: text.secondary,
        borderColor: isDark ? neutral[600] : neutral[300],
      },
      error: { backgroundColor: 'transparent', color: danger.main, borderColor: danger.main },
    },
    ghost: {
      active: filled,
      completed: { ...bare, color: scale.main },
      upcoming: { ...bare, color: text.secondary },
      error: { ...bare, color: danger.main },
    },
    plain: {
      active: { ...bare, color: scale.main },
      completed: { ...bare, color: scale.main },
      upcoming: { ...bare, color: text.secondary },
      error: { ...bare, color: danger.main },
    },
  };

  const states = indicator[$variant];
  const lineIdle = isDark ? neutral[600] : neutral[300];

  return {
    // MUI v9 renders an <ol>; v7 a <div>. Sorbet renders <ol>/<li> in both.
    margin: 0,
    padding: 0,
    listStyle: 'none',
    fontFamily: typography.fontFamily.sans,

    '& .SorbetStepIndicator-root': {
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: d,
      height: d,
      borderRadius: '50%',
      border: '2px solid transparent',
      fontSize: size.indicatorFont,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: 1,
      transition: transitions.smooth,
      '& svg': { fontSize: Math.round(size.indicatorFont * 1.15) },
      ...states.upcoming,
      '&[data-state="active"]': {
        ...states.active,
        ...($variant === 'plain' && { fontWeight: typography.fontWeight.bold }),
      },
      '&[data-state="completed"]': states.completed,
      '&[data-state="error"]': states.error,
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    },

    // MUI's own StepIcon in children mode: solid look, AA-safe text.
    '& .MuiStepIcon-root': {
      width: d,
      height: d,
      color: neutralFill.backgroundColor,
      '& .MuiStepIcon-text': { fill: neutralFill.color, fontSize: '0.75rem' },
      '&.Mui-active, &.Mui-completed': { color: scale.main },
      '&.Mui-active .MuiStepIcon-text': { fill: scale.contrastText },
      '&.Mui-error': { color: danger.main },
    },

    '& .MuiStepLabel-label': {
      fontFamily: typography.fontFamily.sans,
      fontSize: size.labelFont,
      fontWeight: typography.fontWeight.medium,
      color: text.secondary,
      '&.Mui-active': { color: text.primary, fontWeight: typography.fontWeight.semibold },
      '&.Mui-completed': { color: text.primary, fontWeight: typography.fontWeight.medium },
      '&.Mui-error': { color: danger.main },
    },
    '& .SorbetStepper-caption': {
      display: 'block',
      fontSize: size.captionFont,
      color: text.secondary,
      lineHeight: 1.4,
      marginTop: 2,
    },
    '& .MuiStepLabel-iconContainer': { paddingRight: 8 },
    '& .MuiStepLabel-iconContainer.MuiStepLabel-alternativeLabel': { paddingRight: 0 },

    '& .MuiStepConnector-line': { borderColor: lineIdle, transition: transitions.smooth },
    '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line, & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line':
      { borderColor: scale.main },
    '& .MuiStepConnector-alternativeLabel': {
      top: d / 2,
      left: `calc(-50% + ${d / 2 + 8}px)`,
      right: `calc(50% + ${d / 2 + 8}px)`,
    },
    '& .MuiStepConnector-vertical': { marginLeft: d / 2 - 1 },
    '& .MuiStepContent-root': { marginLeft: d / 2 - 1, borderColor: lineIdle },

    '& .MuiStepButton-root': {
      borderRadius: 8,
      '&.Mui-focusVisible': { outline: `2px solid ${scale.main}`, outlineOffset: 2 },
    },
  };
});

// =============================================================================
// COMPONENT
// =============================================================================

const decorativeConnector = <StepConnector aria-hidden="true" />;

/**
 * Shows progress through a sequence of steps, built on MUI's Stepper.
 *
 * Pass `steps` as data, or MUI `Step` children. The current step gets
 * `aria-current="step"` (on its button when `onStepClick` makes steps clickable),
 * completed and failed steps get screen-reader text, and the steps render as an
 * ordered list in MUI v7 and v9. Connectors are decorative and hidden from
 * assistive technology.
 */
export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      variant = 'solid',
      color = 'primary',
      size = 'md',
      activeStep = 0,
      nonLinear = false,
      onStepClick,
      optionalLabel = 'Optional',
      completedLabel = 'completed',
      errorLabel = 'error',
      connector = decorativeConnector,
      children,
      ...rest
    },
    ref
  ) => {
    const content = steps
      ? steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = step.completed ?? (!nonLinear && index < activeStep);
          const caption =
            step.description || step.optional ? (
              <span className="SorbetStepper-caption">
                {step.optional ? optionalLabel : null}
                {step.optional && step.description ? ' · ' : null}
                {step.description}
              </span>
            ) : undefined;
          const label = (
            <>
              {step.label}
              {step.error ? (
                <span style={srOnly}> ({errorLabel})</span>
              ) : isCompleted && !isActive ? (
                <span style={srOnly}> ({completedLabel})</span>
              ) : null}
            </>
          );
          const current = isActive ? ('step' as const) : undefined;

          return (
            <Step
              key={index}
              component="li"
              completed={step.completed}
              disabled={step.disabled}
              aria-current={onStepClick ? undefined : current}
            >
              {onStepClick ? (
                <StepButton
                  onClick={() => onStepClick(index)}
                  optional={caption}
                  aria-current={current}
                >
                  <StepLabel error={step.error} slots={{ stepIcon: StepIndicator }}>
                    {label}
                  </StepLabel>
                </StepButton>
              ) : (
                <StepLabel
                  error={step.error}
                  optional={caption}
                  slots={{ stepIcon: StepIndicator }}
                >
                  {label}
                </StepLabel>
              )}
            </Step>
          );
        })
      : React.Children.toArray(children).map((child, index) => {
          if (!React.isValidElement<Record<string, unknown>>(child)) return child;
          return React.cloneElement(child, {
            component: child.props.component ?? 'li',
            'aria-current':
              child.props['aria-current'] ?? (index === activeStep ? 'step' : undefined),
          });
        });

    return (
      <StyledStepper
        ref={ref}
        component="ol"
        activeStep={activeStep}
        nonLinear={nonLinear}
        connector={connector}
        $variant={variant}
        $color={color}
        $size={size}
        {...rest}
      >
        {content}
      </StyledStepper>
    );
  }
);
Stepper.displayName = 'Stepper';
