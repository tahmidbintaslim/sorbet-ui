'use client';
// @example {"title":"Multiple","description":"Without exclusive, any number of buttons can be pressed and the value is an array."}
import * as React from 'react';
import Bold from '@mui/icons-material/FormatBold';
import Italic from '@mui/icons-material/FormatItalic';
import Underlined from '@mui/icons-material/FormatUnderlined';
import { ToggleButton, ToggleButtonGroup } from '@sorbet-ui/react';

export default function Multiple() {
  const [formats, setFormats] = React.useState<string[]>(['bold']);
  return (
    <ToggleButtonGroup value={formats} onChange={(_e, next) => setFormats(next)} aria-label="Text formatting">
      <ToggleButton value="bold" aria-label="Bold">
        <Bold />
      </ToggleButton>
      <ToggleButton value="italic" aria-label="Italic">
        <Italic />
      </ToggleButton>
      <ToggleButton value="underlined" aria-label="Underlined">
        <Underlined />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
