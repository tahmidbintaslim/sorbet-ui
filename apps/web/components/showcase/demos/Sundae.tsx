'use client';
// Build-a-sundae: a three-step order flow on the Stepper. Pick a flavor, pick
// toppings, then the receipt. Steps you have finished are clickable to go back.
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Button, Chip, Stepper } from '@sorbet-ui/react';

const FLAVORS = ['Mango Tango', 'Raspberry Ripple', 'Ube Swirl'] as const;
const TOPPINGS = ['Sprinkles', 'Hot fudge', 'Cherry', 'Waffle bits'] as const;
const STEPS = [{ label: 'Flavor' }, { label: 'Toppings' }, { label: 'Done' }];

export default function Sundae() {
  const [step, setStep] = React.useState(0);
  const [flavor, setFlavor] = React.useState<string | null>(null);
  const [toppings, setToppings] = React.useState<string[]>([]);
  const toggle = (t: string) => setToppings((xs) => (xs.includes(t) ? xs.filter((x) => x !== t) : [...xs, t]));
  const reset = () => {
    setStep(0);
    setFlavor(null);
    setToppings([]);
  };

  return (
    <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', p: 2 }}>
      <Box sx={(t) => ({ width: '100%', maxWidth: 340, p: 2.5, borderRadius: '20px', bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}`, boxShadow: '0 1px 2px rgb(15 23 42 / 0.05), 0 18px 36px -18px rgb(15 23 42 / 0.25)' })}>
        <Stepper
          aria-label="Sundae order"
          size="sm"
          color="warning"
          activeStep={step}
          steps={STEPS.map((s, i) => ({ ...s, completed: i < step }))}
          // Only finished steps are reachable, so you cannot skip ahead.
          onStepClick={(i) => i < step && setStep(i)}
        />
        <Box aria-live="polite" sx={{ mt: 2.5, minHeight: 132 }}>
          {step === 0 && (
            <>
              <Typography id="sundae-flavor" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                Pick a flavor
              </Typography>
              <Box role="radiogroup" aria-labelledby="sundae-flavor" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {FLAVORS.map((f) => (
                  <Chip
                    key={f}
                    role="radio"
                    aria-checked={flavor === f}
                    label={f}
                    size="sm"
                    color="warning"
                    variant={flavor === f ? 'solid' : 'outlined'}
                    onClick={() => setFlavor(f)}
                    disableAnimation
                  />
                ))}
              </Box>
            </>
          )}
          {step === 1 && (
            <>
              <Typography id="sundae-toppings" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                Toppings (any)
              </Typography>
              <Box role="group" aria-labelledby="sundae-toppings" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {TOPPINGS.map((t) => (
                  <Chip
                    key={t}
                    aria-pressed={toppings.includes(t)}
                    label={t}
                    size="sm"
                    color="secondary"
                    variant={toppings.includes(t) ? 'solid' : 'outlined'}
                    onClick={() => toggle(t)}
                    disableAnimation
                  />
                ))}
              </Box>
            </>
          )}
          {step === 2 && (
            <Box data-testid="sundae-receipt">
              <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>One {flavor} sundae</Typography>
              <Typography sx={{ fontSize: 13.5, color: 'text.secondary', mt: 0.5 }}>
                {toppings.length ? `With ${toppings.join(', ').toLowerCase()}.` : 'Plain and perfect.'} Ready in about two minutes.
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mt: 1 }}>
          <Button size="sm" variant="plain" color="neutral" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          {step < 2 ? (
            <Button size="sm" color="warning" disabled={step === 0 && !flavor} onClick={() => setStep((s) => s + 1)}>
              {step === 1 ? 'Place order' : 'Next'}
            </Button>
          ) : (
            <Button size="sm" variant="soft" color="warning" onClick={reset}>
              Order another
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
