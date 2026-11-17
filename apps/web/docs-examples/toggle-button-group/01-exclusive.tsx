'use client';
// @example {"title":"Exclusive","description":"With exclusive, one button is pressed at a time, like a radio group."}
import * as React from 'react';
import AlignLeft from '@mui/icons-material/FormatAlignLeft';
import AlignCenter from '@mui/icons-material/FormatAlignCenter';
import AlignRight from '@mui/icons-material/FormatAlignRight';
import { ToggleButton, ToggleButtonGroup } from '@sorbet-ui/react';

export default function Exclusive() {
  const [align, setAlign] = React.useState('left');
  return (
    <ToggleButtonGroup exclusive value={align} onChange={(_e, next) => next && setAlign(next)} aria-label="Text alignment">
      <ToggleButton value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleButton>
      <ToggleButton value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleButton>
      <ToggleButton value="right" aria-label="Align right">
        <AlignRight />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
