'use client';
// @example {"title":"Vertical with descriptions","description":"orientation=\"vertical\" stacks the steps; description adds a second line."}
import { Stepper } from '@sorbet-ui/react';

export default function Vertical() {
  return (
    <Stepper
      aria-label="Order tracking"
      orientation="vertical"
      activeStep={2}
      color="success"
      steps={[
        { label: 'Order placed', description: 'We received your order.' },
        { label: 'Packed', description: 'Your tubs are in the cool box.' },
        { label: 'On the way', description: 'The courier has the parcel.' },
        { label: 'Delivered', description: 'Enjoy.' },
      ]}
    />
  );
}
