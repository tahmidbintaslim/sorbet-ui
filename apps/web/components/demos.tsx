'use client';
// Registry of playground demos. Each entry renders a live component for the given
// variant/color/size (plus the boolean props switched on in the playground) and
// returns matching source for the "Code" block, so what the visitor sees and what
// they copy cannot drift apart.
import * as React from 'react';
import { Box, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Avatar,
  Badge,
  Breadcrumbs,
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
  Menu,
  MenuItem,
  Pagination,
  Popover,
  Progress,
  Radio,
  Rating,
  Select,
  Skeleton,
  Slider,
  Snackbar,
  Stepper,
  Switch,
  Table,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  dayjs,
} from '@sorbet-ui/react';
import { srOnly } from '@sorbet-ui/core';
import type { Color, Size, Variant } from '@/lib/site';

export interface DemoProps {
  variant: Variant;
  color: Color;
  size: Size;
}

/** Boolean props switched on in the playground, e.g. `{ disabled: true }`. */
export type Flags = Record<string, boolean>;

export interface Demo {
  slug: string;
  /** Boolean props the playground offers as switches. Every one is a real prop of the component. */
  flags?: readonly string[];
  render: (p: DemoProps, x: Flags) => React.ReactNode;
  code: (p: DemoProps, x: Flags) => string;
}

const attrs = ({ variant, color, size }: DemoProps, x: Flags = {}) =>
  [`variant="${variant}" color="${color}" size="${size}"`, ...Object.keys(x).filter((k) => x[k])].join(' ');

type P = DemoProps & { x: Flags };

const rows = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer' },
  { id: 2, name: 'Grace Hopper', role: 'Admiral' },
  { id: 3, name: 'Linus Torvalds', role: 'Maintainer' },
];

function SelectDemo({ x, ...p }: P) {
  const [v, setV] = React.useState('apple');
  return (
    <Box sx={{ width: 220, maxWidth: '100%' }}>
      <Select {...p} {...x} value={v} onChange={(e) => setV(String(e.target.value))} inputProps={{ 'aria-label': 'Fruit' }}>
        <MenuItem value="apple">Apple</MenuItem>
        <MenuItem value="pear">Pear</MenuItem>
        <MenuItem value="plum">Plum</MenuItem>
      </Select>
    </Box>
  );
}

function PaginationDemo({ x, ...p }: P) {
  const [page, setPage] = React.useState(2);
  return <Pagination {...p} {...x} count={8} page={page} onChange={(_e, n) => setPage(n)} />;
}

function SliderDemo({ x, ...p }: P) {
  const [v, setV] = React.useState(40);
  return (
    <Box sx={{ width: 260, maxWidth: '100%', px: 1, pt: x.showValue ? 3 : 0 }}>
      <Slider {...p} {...x} value={v} onChange={(_e, n) => setV(n as number)} aria-label="Volume" />
    </Box>
  );
}

function RatingDemo({ x, ...p }: P) {
  const [v, setV] = React.useState<number | null>(3);
  return <Rating {...p} {...x} value={v} onChange={(_e, n) => setV(n)} aria-label="Rating" />;
}

function ToggleDemo({ x, ...p }: P) {
  const [v, setV] = React.useState('week');
  return (
    <Box sx={{ width: x.fullWidth ? '100%' : 'auto', maxWidth: 420 }}>
      <ToggleButtonGroup {...p} {...x} exclusive value={v} onChange={(_e, n) => n && setV(n)} aria-label="Date range">
        <ToggleButton value="day">Day</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="month">Month</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

const frameworks = [
  { label: 'Next.js', value: 'next', group: 'React' },
  { label: 'Remix', value: 'remix', group: 'React' },
  { label: 'Astro', value: 'astro', group: 'Islands' },
  { label: 'SvelteKit', value: 'svelte', group: 'Other' },
  { label: 'Nuxt', value: 'nuxt', group: 'Other' },
];

const crumbs = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'docs', label: 'Docs', href: '/docs' },
  { id: 'components', label: 'Components', href: '/docs/components' },
  { id: 'current', label: 'Breadcrumbs' },
];

function DatePickerDemo({ x, ...p }: P) {
  const [v, setV] = React.useState<ReturnType<typeof dayjs> | null>(dayjs('2026-11-03'));
  return (
    <Box sx={{ width: x.fullWidth ? '100%' : 'auto', maxWidth: 420 }}>
      <DatePicker {...p} {...x} label="Start date" value={v} onChange={setV} />
    </Box>
  );
}

// Overlays render a trigger button; the overlay itself follows the pickers.
function DialogDemo({ x, ...p }: P) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button color={p.color} onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog {...p} {...x} open={open} onClose={() => setOpen(false)} aria-labelledby="demo-dialog-title">
        <DialogTitle id="demo-dialog-title">Delete project?</DialogTitle>
        <DialogContent>This removes the project and its deploys. You can&apos;t undo it.</DialogContent>
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

function DrawerDemo({ x, ...p }: P) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button color={p.color} onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer {...p} {...x} anchor="right" open={open} onClose={() => setOpen(false)}>
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

function PopoverDemo({ x, ...p }: P) {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  return (
    <>
      <Button color={p.color} onClick={(e) => setAnchor(e.currentTarget)} aria-haspopup="dialog">
        Show details
      </Button>
      <Popover
        {...p}
        {...x}
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

function MenuDemo(p: P) {
  const { x: _x, ...style } = p;
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const id = React.useId();
  const open = Boolean(anchor);
  const close = () => setAnchor(null);
  return (
    <>
      <Button
        id={`${id}-button`}
        color={p.color}
        aria-haspopup="true"
        aria-controls={open ? `${id}-menu` : undefined}
        aria-expanded={open ? 'true' : undefined}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        Project actions
      </Button>
      <Menu {...style} id={`${id}-menu`} aria-labelledby={`${id}-button`} anchorEl={anchor} open={open} onClose={close}>
        <MenuItem onClick={close}>Rename</MenuItem>
        <MenuItem onClick={close} selected>
          Duplicate
        </MenuItem>
        <MenuItem onClick={close}>Archive</MenuItem>
      </Menu>
    </>
  );
}

function StepperDemo({ x, ...p }: P) {
  const steps = [{ label: 'Account' }, { label: 'Workspace' }, { label: 'Invite', optional: true }, { label: 'Done' }];
  return (
    <Box sx={{ width: '100%', maxWidth: 560, overflowX: 'auto' }}>
      <Stepper {...p} {...x} aria-label="Setup progress" activeStep={1} steps={steps} />
    </Box>
  );
}

function SnackbarDemo({ x, ...p }: P) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button color={p.color} onClick={() => setOpen(true)}>
        Save changes
      </Button>
      <Snackbar {...p} {...x} open={open} onClose={() => setOpen(false)} autoHideDuration={4000} message="Changes saved" />
    </>
  );
}

export const DEMOS: Demo[] = [
  {
    slug: 'button',
    flags: ['disabled', 'loading', 'active', 'fullWidth'],
    render: (p, x) => (
      <Box sx={{ width: x.fullWidth ? '100%' : 'auto', maxWidth: 420, textAlign: 'center' }}>
        <Button {...p} {...x}>
          Button
        </Button>
      </Box>
    ),
    code: (p, x) => `<Button ${attrs(p, x)}>Button</Button>`,
  },
  {
    slug: 'toggle-button-group',
    flags: ['disabled', 'fullWidth'],
    render: (p, x) => <ToggleDemo {...p} x={x} />,
    code: (p, x) =>
      `<ToggleButtonGroup ${attrs(p, x)} exclusive value={value} onChange={(_e, next) => next && setValue(next)}>\n  <ToggleButton value="day">Day</ToggleButton>\n  <ToggleButton value="week">Week</ToggleButton>\n  <ToggleButton value="month">Month</ToggleButton>\n</ToggleButtonGroup>`,
  },
  {
    slug: 'text-field',
    flags: ['disabled', 'loading', 'error', 'required', 'fullWidth'],
    render: (p, x) => (
      <Box sx={{ width: x.fullWidth ? '100%' : 'auto', maxWidth: 420 }}>
        <TextField {...p} {...x} label="Email" placeholder="you@example.com" />
      </Box>
    ),
    code: (p, x) => `<TextField ${attrs(p, x)} label="Email" placeholder="you@example.com" />`,
  },
  {
    slug: 'select',
    flags: ['disabled', 'loading', 'error'],
    render: (p, x) => <SelectDemo {...p} x={x} />,
    code: (p, x) =>
      `<Select ${attrs(p, x)} value={value} onChange={...}>\n  <MenuItem value="apple">Apple</MenuItem>\n  <MenuItem value="pear">Pear</MenuItem>\n</Select>`,
  },
  {
    slug: 'autocomplete',
    flags: ['disabled', 'error', 'required', 'fullWidth'],
    render: (p, x) => (
      <Box sx={{ width: x.fullWidth ? '100%' : 300, maxWidth: '100%' }}>
        <Autocomplete {...p} {...x} options={frameworks} groupBy={(o) => o.group ?? ''} label="Framework" placeholder="Search frameworks" fullWidth />
      </Box>
    ),
    code: (p, x) =>
      `<Autocomplete ${attrs(p, x)}\n  options={frameworks}\n  groupBy={(o) => o.group}\n  label="Framework"\n  placeholder="Search frameworks"\n/>`,
  },
  {
    slug: 'date-picker',
    flags: ['disabled', 'error', 'required', 'fullWidth'],
    render: (p, x) => <DatePickerDemo {...p} x={x} />,
    code: (p, x) =>
      `const [value, setValue] = useState(dayjs('2026-11-03'));\n\n<DatePicker ${attrs(p, x)} label="Start date" value={value} onChange={setValue} />`,
  },
  {
    slug: 'checkbox',
    flags: ['disabled', 'loading', 'indeterminate'],
    render: (p, x) => <Checkbox {...p} {...x} label="Accept terms" defaultChecked />,
    code: (p, x) => `<Checkbox ${attrs(p, x)} label="Accept terms" defaultChecked />`,
  },
  {
    slug: 'radio',
    flags: ['disabled', 'loading'],
    render: (p, x) => <Radio {...p} {...x} label="Option A" defaultChecked />,
    code: (p, x) => `<Radio ${attrs(p, x)} label="Option A" defaultChecked />`,
  },
  {
    slug: 'switch',
    flags: ['disabled', 'loading'],
    render: (p, x) => <Switch {...p} {...x} label="Notifications" defaultChecked />,
    code: (p, x) => `<Switch ${attrs(p, x)} label="Notifications" defaultChecked />`,
  },
  {
    slug: 'slider',
    flags: ['disabled', 'showValue', 'showMinMax'],
    render: (p, x) => <SliderDemo {...p} x={x} />,
    code: (p, x) => `<Slider ${attrs(p, x)} value={value} onChange={...} />`,
  },
  {
    slug: 'rating',
    flags: ['disabled', 'readOnly', 'showLabel'],
    render: (p, x) => <RatingDemo {...p} x={x} />,
    code: (p, x) => `<Rating ${attrs(p, x)} value={value} onChange={...} />`,
  },
  {
    slug: 'avatar',
    flags: ['loading'],
    render: (p, x) => (
      <Avatar {...p} {...x} status="online">
        AL
      </Avatar>
    ),
    code: (p, x) => `<Avatar ${attrs(p, x)} status="online">AL</Avatar>`,
  },
  {
    slug: 'badge',
    flags: ['pulse', 'loading'],
    render: (p, x) => (
      <Badge {...p} {...x} badgeContent={4}>
        <Button variant="outlined" color="neutral" size="sm">
          Inbox
        </Button>
      </Badge>
    ),
    code: (p, x) => `<Badge ${attrs(p, x)} badgeContent={4}>\n  <Button>Inbox</Button>\n</Badge>`,
  },
  {
    slug: 'chip',
    flags: ['disabled', 'loading'],
    render: (p, x) => <Chip {...p} {...x} label="Chip" />,
    code: (p, x) => `<Chip ${attrs(p, x)} label="Chip" />`,
  },
  {
    slug: 'table',
    flags: ['striped', 'dense', 'loading'],
    render: (p, x) => (
      <Box sx={{ width: '100%', maxWidth: 520, overflowX: 'auto' }}>
        <Table
          {...p}
          {...x}
          data={rows}
          columns={[
            { id: 'name', header: 'Name', accessor: 'name' },
            { id: 'role', header: 'Role', accessor: 'role' },
          ]}
        />
      </Box>
    ),
    code: (p, x) =>
      `<Table ${attrs(p, x)}\n  data={rows}\n  columns={[\n    { id: 'name', header: 'Name', accessor: 'name' },\n    { id: 'role', header: 'Role', accessor: 'role' },\n  ]}\n/>`,
  },
  {
    slug: 'tooltip',
    flags: ['arrow', 'loading'],
    render: (p, x) => (
      <Tooltip {...p} {...x} title="Tooltip text">
        <span>
          <Button variant="outlined" color="neutral">
            Hover me
          </Button>
        </span>
      </Tooltip>
    ),
    code: (p, x) => `<Tooltip ${attrs(p, x)} title="Tooltip text">\n  <Button>Hover me</Button>\n</Tooltip>`,
  },
  {
    slug: 'alert',
    flags: ['loading'],
    render: (p, x) => (
      <Alert {...p} {...x}>
        Your changes were saved.
      </Alert>
    ),
    code: (p, x) => `<Alert ${attrs(p, x)}>Your changes were saved.</Alert>`,
  },
  {
    slug: 'progress',
    flags: ['indeterminate', 'showLabel'],
    render: (p, x) => (
      <Box sx={{ width: 260, maxWidth: '100%' }}>
        <Progress variant={p.variant} color={p.color} size={p.size} {...x} value={65} aria-label="Progress" />
      </Box>
    ),
    code: (p, x) => `<Progress ${attrs(p, x)} value={65} />`,
  },
  {
    slug: 'skeleton',
    render: (p) => (
      <Box aria-busy="true" sx={{ width: 280, maxWidth: '100%' }}>
        <Box component="span" sx={srOnly}>
          Loading profile
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
          <Skeleton {...p} shape="circular" />
          <Box sx={{ flex: 1 }}>
            <Skeleton {...p} width="70%" />
            <Skeleton {...p} width="40%" />
          </Box>
        </Stack>
        <Skeleton {...p} shape="rounded" />
      </Box>
    ),
    code: (p) =>
      `<Box aria-busy="true">\n  <span className="sr-only">Loading profile</span>\n  <Skeleton ${attrs(p)} shape="circular" />\n  <Skeleton ${attrs(p)} width="70%" />\n  <Skeleton ${attrs(p)} shape="rounded" />\n</Box>`,
  },
  {
    slug: 'snackbar',
    flags: ['loading'],
    render: (p, x) => <SnackbarDemo {...p} x={x} />,
    code: (p, x) => `<Snackbar ${attrs(p, x)} open={open} onClose={close} autoHideDuration={4000} message="Changes saved" />`,
  },
  {
    slug: 'tabs',
    flags: ['fullWidth', 'centered'],
    render: (p, x) => (
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Tabs
          {...p}
          {...x}
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
    code: (p, x) =>
      `<Tabs ${attrs(p, x)} defaultValue="a" tabs={[\n  { id: 'a', label: 'Profile', content: <Profile /> },\n  { id: 'b', label: 'Billing', content: <Billing /> },\n]} />`,
  },
  {
    slug: 'breadcrumbs',
    render: (p) => <Breadcrumbs {...p} items={crumbs} />,
    code: (p) =>
      `<Breadcrumbs ${attrs(p)}\n  items={[\n    { id: 'home', label: 'Home', href: '/' },\n    { id: 'docs', label: 'Docs', href: '/docs' },\n    { id: 'components', label: 'Components', href: '/docs/components' },\n    { id: 'current', label: 'Breadcrumbs' },\n  ]}\n/>`,
  },
  {
    slug: 'pagination',
    flags: ['disabled', 'showFirstButton', 'showLastButton'],
    render: (p, x) => <PaginationDemo {...p} x={x} />,
    code: (p, x) => `<Pagination ${attrs(p, x)} count={8} page={page} onChange={...} />`,
  },
  {
    slug: 'stepper',
    flags: ['alternativeLabel'],
    render: (p, x) => <StepperDemo {...p} x={x} />,
    code: (p, x) =>
      `<Stepper ${attrs(p, x)}\n  aria-label="Setup progress"\n  activeStep={1}\n  steps={[\n    { label: 'Account' },\n    { label: 'Workspace' },\n    { label: 'Invite', optional: true },\n    { label: 'Done' },\n  ]}\n/>`,
  },
  {
    slug: 'menu',
    render: (p, x) => <MenuDemo {...p} x={x} />,
    code: (p) =>
      `<Button id="actions-button" aria-haspopup="true" aria-expanded={open} onClick={openMenu}>\n  Project actions\n</Button>\n<Menu ${attrs(p)}\n  aria-labelledby="actions-button"\n  anchorEl={anchor}\n  open={open}\n  onClose={close}\n>\n  <MenuItem onClick={close}>Rename</MenuItem>\n  <MenuItem onClick={close}>Duplicate</MenuItem>\n  <MenuItem onClick={close}>Archive</MenuItem>\n</Menu>`,
  },
  {
    slug: 'card',
    flags: ['clickable', 'loading'],
    render: (p, x) => (
      <Card {...p} {...x} sx={{ p: 2, width: 260, maxWidth: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Card title
        </Typography>
        <Typography variant="body2">Cards group related content.</Typography>
      </Card>
    ),
    code: (p, x) => `<Card ${attrs(p, x)} sx={{ p: 2 }}>\n  Cards group related content.\n</Card>`,
  },
  {
    slug: 'accordion',
    flags: ['disabled'],
    render: (p, x) => (
      <Box sx={{ width: '100%', maxWidth: 460 }}>
        <Accordion {...p} {...x} defaultExpanded>
          <AccordionSummary>Can I cancel any time?</AccordionSummary>
          <AccordionDetails>Yes. Your plan stays active until the end of the billing period.</AccordionDetails>
        </Accordion>
        <Accordion {...p} {...x}>
          <AccordionSummary>Do you offer refunds?</AccordionSummary>
          <AccordionDetails>Within 14 days of purchase, no questions asked.</AccordionDetails>
        </Accordion>
      </Box>
    ),
    code: (p, x) =>
      `<Accordion ${attrs(p, x)} defaultExpanded>\n  <AccordionSummary>Can I cancel any time?</AccordionSummary>\n  <AccordionDetails>Yes. Your plan stays active…</AccordionDetails>\n</Accordion>`,
  },
  {
    slug: 'dialog',
    flags: ['fullWidth'],
    render: (p, x) => <DialogDemo {...p} x={x} />,
    code: (p, x) =>
      `<Dialog ${attrs(p, x)} open={open} onClose={close} aria-labelledby="dialog-title">\n  <DialogTitle id="dialog-title">Delete project?</DialogTitle>\n  <DialogContent>This removes the project and its deploys.</DialogContent>\n  <DialogActions>\n    <Button variant="ghost" color="neutral" onClick={close}>Cancel</Button>\n    <Button color="danger" onClick={close}>Delete</Button>\n  </DialogActions>\n</Dialog>`,
  },
  {
    slug: 'drawer',
    render: (p, x) => <DrawerDemo {...p} x={x} />,
    code: (p) => `<Drawer ${attrs(p)} anchor="right" open={open} onClose={close}>\n  <Box sx={{ width: 280, p: 2 }}>…</Box>\n</Drawer>`,
  },
  {
    slug: 'popover',
    render: (p, x) => <PopoverDemo {...p} x={x} />,
    code: (p) =>
      `<Popover ${attrs(p)}\n  open={!!anchor}\n  anchorEl={anchor}\n  onClose={() => setAnchor(null)}\n  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}\n>\n  <Box sx={{ p: 2 }}>Usage this month</Box>\n</Popover>`,
  },
];

export const getDemo = (slug: string) => DEMOS.find((d) => d.slug === slug);
