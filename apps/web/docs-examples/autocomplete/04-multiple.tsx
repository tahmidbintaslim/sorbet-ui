'use client';
// @example {"title":"Multiple","description":"With multiple, picks become chips that follow the field's variant and color."}
import * as React from 'react';
import { Box } from '@mui/material';
import { Autocomplete } from '@sorbet-ui/react';

const labels = [
  { label: 'Bug', value: 'bug' },
  { label: 'Design', value: 'design' },
  { label: 'Docs', value: 'docs' },
  { label: 'Performance', value: 'perf' },
  { label: 'Accessibility', value: 'a11y' },
];

export default function Multiple() {
  const [value, setValue] = React.useState([labels[1], labels[4]]);
  return (
    <Box sx={{ width: '100%', maxWidth: 380 }}>
      <Autocomplete
        multiple
        options={labels}
        value={value}
        onChange={(_e, next) => setValue(next)}
        isOptionEqualToValue={(a, b) => a.value === b.value}
        label="Labels"
        placeholder="Add a label"
        color="secondary"
        fullWidth
      />
    </Box>
  );
}
