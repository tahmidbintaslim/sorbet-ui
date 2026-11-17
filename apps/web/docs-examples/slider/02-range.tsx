'use client';
// @example {"title":"Range","description":"Pass an array for two thumbs. Name each thumb with getAriaLabel."}
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Slider } from '@sorbet-ui/react';

export default function Range() {
  const [price, setPrice] = React.useState([20, 60]);
  return (
    <Box sx={{ width: '100%', maxWidth: 320 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Price: ${price[0]} to ${price[1]}
      </Typography>
      <Slider
        color="success"
        value={price}
        onChange={(_e, next) => setPrice(next as number[])}
        getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
      />
    </Box>
  );
}
