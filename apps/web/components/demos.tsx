'use client';
// Registry of component demos. Each entry renders a live component for the given
// variant/color/size and returns matching source for the "Code" block, so what
// the visitor sees and what they copy cannot drift apart.
import * as React from 'react';
import { Box, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import {
  Alert,
  Autocomplete,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  DatePicker,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  MenuItem,
  Pagination,
  Popover,
  Progress,
  Radio,
  Rating,
  Select,
  Slider,
  Snackbar,
  Switch,
  Table,
  Tabs,
  TextField,
  Tooltip,
  dayjs,
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

const frameworks = [
  { label: 'Next.js', value: 'next', group: 'React' },
  { label: 'Remix', value: 'remix', group: 'React' },
  { label: 'Astro', value: 'astro', group: 'Islands' },
  { label: 'SvelteKit', value: 'svelte', group: 'Other' },
  { label: 'Nuxt', value: 'nuxt', group: 'Other' },
];

function DatePickerDemo(p: DemoProps) {
  const [v, setV] = React.useState<ReturnType<typeof dayjs> | null>(dayjs('2026-11-03'));
  return <DatePicker {...p} label="Start date" value={v} onChange={setV} />;
}

// Overlays render a trigger button; the overlay itself follows the pickers.
function DialogDemo(p: DemoProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button color={p.color} onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog {...p} open={open} onClose={() => setOpen(false)} aria-labelledby="demo-dialog-title">
        <DialogTitle id="demo-dialog-title">Delete project?</DialogTitle>
        <DialogContent>This removes the project and its deploys. You can't undo it.</DialogContent>
        <DialogActions>
          <Button variant="ghost" color="neutral" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function DrawerDemo(p: DemoProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button color={p.color} onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer {...p} anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, p: 2 }} role="navigation" aria-label="Drawer menu">
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Menu
          </Typography>
          <List component="div" disablePadding>
            {['Overview', 'Deployments', 'Settings'].map((t) => (
              <ListItemButton key={t} onClick={() => setOpen(false)}>
                <ListItemText primary={t} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

function PopoverDemo(p: DemoProps) {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  return (
    <>
      <Button color={p.color} onClick={(e) => setAnchor(e.currentTarget)} aria-haspopup="dialog">
        Show details
      </Button>
      <Popover
        {...p}
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: 260 }}>
          <Typography sx={{ fontWeight: 700 }}>Usage this month</Typography>
          <Typography variant="body2">1,204 of 5,000 builds used.</Typography>
        </Box>
      </Popover>
    </>
  );
}

function SnackbarDemo(p: DemoProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button color={p.color} onClick={() => setOpen(true)}>
        Save changes
      </Button>
      <Snackbar
        {...p}
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={4000}
        message="Changes saved"
      />
    </>
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
  {
    slug: 'autocomplete',
    render: (p) => (
      <Autocomplete
        {...p}
        options={frameworks}
        groupBy={(o) => o.group ?? ''}
        label="Framework"
        placeholder="Search frameworks"
        sx={{ width: 300 }}
      />
    ),
    code: (p) =>
      `<Autocomplete ${attrs(p)}\n  options={frameworks}\n  groupBy={(o) => o.group}\n  label="Framework"\n  placeholder="Search frameworks"\n/>`,
  },
  {
    slug: 'date-picker',
    render: (p) => <DatePickerDemo {...p} />,
    code: (p) =>
      `const [value, setValue] = useState(dayjs('2026-11-03'));\n\n<DatePicker ${attrs(p)} label="Start date" value={value} onChange={setValue} />`,
  },
  {
    slug: 'dialog',
    render: (p) => <DialogDemo {...p} />,
    code: (p) =>
      `<Dialog ${attrs(p)} open={open} onClose={close} aria-labelledby="dialog-title">\n  <DialogTitle id="dialog-title">Delete project?</DialogTitle>\n  <DialogContent>This removes the project and its deploys.</DialogContent>\n  <DialogActions>\n    <Button variant="ghost" color="neutral" onClick={close}>Cancel</Button>\n    <Button color="danger" onClick={close}>Delete</Button>\n  </DialogActions>\n</Dialog>`,
  },
  {
    slug: 'drawer',
    render: (p) => <DrawerDemo {...p} />,
    code: (p) =>
      `<Drawer ${attrs(p)} anchor="right" open={open} onClose={close}>\n  <Box sx={{ width: 280, p: 2 }}>…</Box>\n</Drawer>`,
  },
  {
    slug: 'popover',
    render: (p) => <PopoverDemo {...p} />,
    code: (p) =>
      `<Popover ${attrs(p)}\n  open={!!anchor}\n  anchorEl={anchor}\n  onClose={() => setAnchor(null)}\n  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}\n>\n  <Box sx={{ p: 2 }}>Usage this month</Box>\n</Popover>`,
  },
  {
    slug: 'snackbar',
    render: (p) => <SnackbarDemo {...p} />,
    code: (p) =>
      `<Snackbar ${attrs(p)} open={open} onClose={close} autoHideDuration={4000} message="Changes saved" />`,
  },
];

export const getDemo = (slug: string) => DEMOS.find((d) => d.slug === slug);
