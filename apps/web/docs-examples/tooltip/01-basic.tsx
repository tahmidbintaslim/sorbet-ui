'use client';
// @example {"title":"Basic","description":"Shown on hover and on keyboard focus. describeChild keeps the button's own name and adds the hint as its description."}
import { Tooltip, Button } from '@sorbet-ui/react';

export default function Basic() {
  return (
    <Tooltip title="Saves a draft. Nothing is published." describeChild>
      <Button variant="outlined" color="neutral">
        Save draft
      </Button>
    </Tooltip>
  );
}
