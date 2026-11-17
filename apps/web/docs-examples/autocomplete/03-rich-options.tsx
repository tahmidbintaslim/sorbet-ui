'use client';
// @example {"title":"Icons and descriptions","description":"Options with an icon render a second line from description."}
import { Box } from '@mui/material';
import Person from '@mui/icons-material/PersonOutlined';
import Group from '@mui/icons-material/GroupOutlined';
import Business from '@mui/icons-material/BusinessOutlined';
import { Autocomplete } from '@sorbet-ui/react';

const plans = [
  { label: 'Solo', value: 'solo', icon: <Person fontSize="small" />, description: 'One seat, three projects' },
  { label: 'Team', value: 'team', icon: <Group fontSize="small" />, description: 'Ten seats, shared workspaces' },
  { label: 'Business', value: 'business', icon: <Business fontSize="small" />, description: 'Unlimited seats and SSO' },
];

export default function RichOptions() {
  return (
    <Box sx={{ width: '100%', maxWidth: 320 }}>
      <Autocomplete options={plans} label="Plan" placeholder="Choose a plan" fullWidth />
    </Box>
  );
}
