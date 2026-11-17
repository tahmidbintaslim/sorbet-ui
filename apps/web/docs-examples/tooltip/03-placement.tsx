'use client';
// @example {"title":"Placement and arrow","description":"placement picks the side; arrow adds a pointer."}
import { Box } from '@mui/material';
import { Button, Tooltip } from '@sorbet-ui/react';

const PLACEMENTS = ['top', 'right', 'bottom', 'left'] as const;

export default function Placement() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 1.5 }}>
      {PLACEMENTS.map((placement) => (
        <Tooltip key={placement} title={`On the ${placement}`} placement={placement} arrow describeChild>
          <Button variant="soft" size="sm">
            {placement}
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
}
