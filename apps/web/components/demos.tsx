'use client';
// Registry of component demos. Each entry renders a live component for the given
// variant/color/size and returns matching source for the "Code" block, so what
// the visitor sees and what they copy cannot drift apart.
import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  MenuItem,
  Pagination,
  Progress,
  Radio,
  Rating,
  Select,
  Slider,
  Switch,
  Table,
  Tabs,
  TextField,
  Tooltip,
} from '@sorbet-ui/react';
import type { Color, Size, Variant } from '@/lib/site';

export interface DemoProps {
  variant: Variant;
  color: Color;
  size: Size;
}

export interface Demo {
  slug: string;
  render: (p: DemoProps) => React.ReactNode;
  code: (p: DemoProps) => string;
}

const attrs = ({ variant, color, size }: DemoProps) =>
  `variant="${variant}" color="${color}" size="${size}"`;

const rows = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer' },
  { id: 2, name: 'Grace Hopper', role: 'Admiral' },
  { id: 3, name: 'Linus Torvalds', role: 'Maintainer' },
];

function SelectDemo(p: DemoProps) {
  const [v, setV] = React.useState('apple');
  return (
    <Select
      {...p}
      value={v}
      onChange={(e) => setV(String(e.target.value))}
      inputProps={{ 'aria-label': 'Fruit' }}
      sx={{ minWidth: 200 }}
    >
      <MenuItem value="apple">Apple</MenuItem>
      <MenuItem value="pear">Pear</MenuItem>
      <MenuItem value="plum">Plum</MenuItem>
    </Select>
  );
}

function PaginationDemo(p: DemoProps) {
  const [page, setPage] = React.useState(2);
  return <Pagination {...p} count={8} page={page} onChange={(_e, n) => setPage(n)} />;
}

function SliderDemo(p: DemoProps) {
  const [v, setV] = React.useState(40);
  return (
    <Box sx={{ width: 260, px: 1 }}>
      <Slider
        variant={p.variant}
        color={p.color}
        size={p.size}
        value={v}
        onChange={(_e, n) => setV(n as number)}
        aria-label="Volume"
      />
    </Box>
  );
}

function RatingDemo(p: DemoProps) {
  const [v, setV] = React.useState<number | null>(3);
  return (
    <Rating
      variant={p.variant}
      color={p.color}
      size={p.size}
      value={v}
      onChange={(_e, n) => setV(n)}
      aria-label="Rating"
    />
  );
}

export const DEMOS: Demo[] = [
  {
    slug: 'button',
    render: (p) => <Button {...p}>Button</Button>,
    code: (p) => `<Button ${attrs(p)}>Button</Button>`,
  },
  {
    slug: 'text-field',
    render: (p) => <TextField {...p} label="Email" placeholder="you@example.com" />,
    code: (p) => `<TextField ${attrs(p)} label="Email" placeholder="you@example.com" />`,
  },
  {
    slug: 'select',
    render: (p) => <SelectDemo {...p} />,
    code: (p) =>
      `<Select ${attrs(p)} value={value} onChange={...}>\n  <MenuItem value="apple">Apple</MenuItem>\n  <MenuItem value="pear">Pear</MenuItem>\n</Select>`,
  },
  {
    slug: 'checkbox',
    render: (p) => <Checkbox {...p} label="Accept terms" defaultChecked />,
    code: (p) => `<Checkbox ${attrs(p)} label="Accept terms" defaultChecked />`,
  },
  {
    slug: 'radio',
    render: (p) => <Radio {...p} label="Option A" defaultChecked />,
    code: (p) => `<Radio ${attrs(p)} label="Option A" defaultChecked />`,
  },
  {
    slug: 'switch',
    render: (p) => <Switch {...p} label="Notifications" defaultChecked />,
    code: (p) => `<Switch ${attrs(p)} label="Notifications" defaultChecked />`,
  },
  {
    slug: 'slider',
    render: (p) => <SliderDemo {...p} />,
    code: (p) => `<Slider ${attrs(p)} value={value} onChange={...} />`,
  },
  {
    slug: 'rating',
    render: (p) => <RatingDemo {...p} />,
    code: (p) => `<Rating ${attrs(p)} value={value} onChange={...} />`,
  },
  {
    slug: 'card',
    render: (p) => (
      <Card {...p} sx={{ p: 2, width: 260 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Card title
        </Typography>
        <Typography variant="body2">Cards group related content.</Typography>
      </Card>
    ),
    code: (p) => `<Card ${attrs(p)} sx={{ p: 2 }}>\n  Cards group related content.\n</Card>`,
  },
  {
    slug: 'chip',
    render: (p) => <Chip {...p} label="Chip" />,
    code: (p) => `<Chip ${attrs(p)} label="Chip" />`,
  },
  {
    slug: 'alert',
    render: (p) => <Alert {...p}>Your changes were saved.</Alert>,
    code: (p) => `<Alert ${attrs(p)}>Your changes were saved.</Alert>`,
  },
  {
    slug: 'avatar-badge',
    render: (p) => (
      <Stack direction="row" spacing={3} alignItems="center">
        <Avatar {...p} status="online">
          AL
        </Avatar>
        <Badge {...p} badgeContent={4}>
          <Button variant="outlined" color="neutral" size="sm">
            Inbox
          </Button>
        </Badge>
      </Stack>
    ),
    code: (p) =>
      `<Avatar ${attrs(p)} status="online">AL</Avatar>\n<Badge ${attrs(p)} badgeContent={4}>\n  <Button>Inbox</Button>\n</Badge>`,
  },
  {
    slug: 'progress',
    render: (p) => (
      <Box sx={{ width: 260 }}>
        <Progress variant={p.variant} color={p.color} size={p.size} value={65} aria-label="Progress" />
      </Box>
    ),
    code: (p) => `<Progress ${attrs(p)} value={65} />`,
  },
  {
    slug: 'pagination',
    render: (p) => <PaginationDemo {...p} />,
    code: (p) => `<Pagination ${attrs(p)} count={8} page={page} onChange={...} />`,
  },
  {
    slug: 'tabs',
    render: (p) => (
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Tabs
          {...p}
          aria-label="Account"
          defaultValue="a"
          tabs={[
            { id: 'a', label: 'Profile', content: <Box sx={{ p: 2 }}>Profile panel</Box> },
            { id: 'b', label: 'Billing', content: <Box sx={{ p: 2 }}>Billing panel</Box> },
            { id: 'c', label: 'Team', content: <Box sx={{ p: 2 }}>Team panel</Box> },
          ]}
        />
      </Box>
    ),
    code: (p) =>
      `<Tabs ${attrs(p)} defaultValue="a" tabs={[\n  { id: 'a', label: 'Profile', content: <Profile /> },\n  { id: 'b', label: 'Billing', content: <Billing /> },\n]} />`,
  },
  {
    slug: 'table',
    render: (p) => (
      <Box sx={{ width: '100%', maxWidth: 520, overflowX: 'auto' }}>
        <Table
          {...p}
          data={rows}
          columns={[
            { id: 'name', header: 'Name', accessor: 'name' },
            { id: 'role', header: 'Role', accessor: 'role' },
          ]}
        />
      </Box>
    ),
    code: (p) =>
      `<Table ${attrs(p)}\n  data={rows}\n  columns={[\n    { id: 'name', header: 'Name', accessor: 'name' },\n    { id: 'role', header: 'Role', accessor: 'role' },\n  ]}\n/>`,
  },
  {
    slug: 'tooltip',
    render: (p) => (
      <Tooltip {...p} title="Tooltip text">
        <span>
          <Button variant="outlined" color="neutral">
            Hover me
          </Button>
        </span>
      </Tooltip>
    ),
    code: (p) =>
      `<Tooltip ${attrs(p)} title="Tooltip text">\n  <Button>Hover me</Button>\n</Tooltip>`,
  },
];

export const getDemo = (slug: string) => DEMOS.find((d) => d.slug === slug);
