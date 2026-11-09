'use client';
// "Acme Admin": a working dashboard built only from Sorbet UI + Material UI.
// Four views (Overview, Orders, Customers, Settings) with filtering, dialogs,
// a drawer and toasts. All data is sample data from ./data.ts.
import * as React from 'react';
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField as MuiTextField,
  Typography,
} from '@mui/material';
import { motion, useReducedMotion } from 'motion/react';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import People from '@mui/icons-material/People';
import Settings from '@mui/icons-material/Settings';
import Search from '@mui/icons-material/Search';
import Add from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import Menu from '@mui/icons-material/Menu';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Dialog,
  Drawer,
  MenuItem,
  Pagination,
  Progress,
  Select,
  Snackbar,
  Switch,
  Table,
  Tabs,
  TextField,
} from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import { CountUp, EASE } from '../motion';
import { CUSTOMERS, ORDERS, RANGES, STATUS_COLOR, emailFor, formatDate, money, type Customer, type Order, type OrderStatus, type RangeId } from './data';

type View = 'overview' | 'orders' | 'customers' | 'settings';
const NAV: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <SpaceDashboard /> },
  { id: 'orders', label: 'Orders', icon: <ReceiptLong /> },
  { id: 'customers', label: 'Customers', icon: <People /> },
  { id: 'settings', label: 'Settings', icon: <Settings /> },
];

const initials = (n: string) => n.split(' ').map((p) => p[0]).join('');

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }} spacing={1}>
        <Typography component="h3" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {action}
      </Stack>
      {children}
    </Card>
  );
}

function StatusChip({ status }: { status: OrderStatus }) {
  return <Chip size="sm" variant="soft" color={STATUS_COLOR[status]} label={status} />;
}

// ---------------------------------------------------------------- Overview
function Overview({ orders, onOpenOrder }: { orders: Order[]; onOpenOrder: (o: Order) => void }) {
  const reduce = useReducedMotion();
  const [range, setRange] = React.useState<RangeId>('month');
  const r = RANGES[range];
  const kpis = [
    { label: 'Revenue', value: r.revenue, fmt: money, delta: r.deltas.revenue, unit: '%' },
    { label: 'Orders', value: r.orders, fmt: (n: number) => n.toLocaleString('en-US'), delta: r.deltas.orders, unit: '%' },
    { label: 'New customers', value: r.customers, fmt: (n: number) => n.toLocaleString('en-US'), delta: r.deltas.customers, unit: '%' },
    { label: 'Conversion', value: Math.round(r.conversion * 10), fmt: (n: number) => `${(n / 10).toFixed(1)}%`, delta: r.deltas.conversion, unit: ' pt' },
  ];
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }} spacing={2}>
        <Box>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 26 }}>
            Good morning, Sam
          </Typography>
          <Typography color="text.secondary">Here is how Acme is doing. Sample data.</Typography>
        </Box>
        <Tabs
          size="sm"
          variant="soft"
          value={range}
          onChange={(id) => setRange(id as RangeId)}
          renderPanels={false}
          aria-label="Date range"
          tabs={(Object.keys(RANGES) as RangeId[]).map((id) => ({ id, label: RANGES[id].label }))}
        />
      </Stack>
      <Grid container spacing={2}>
        {kpis.map((k) => (
          <Grid key={k.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card variant="outlined" sx={{ p: 2.5 }}>
              <Typography variant="body2" color="text.secondary">
                {k.label}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', mt: 0.5 }}>
                <Typography component="p" sx={{ fontWeight: 800, fontSize: 28, fontVariantNumeric: 'tabular-nums' }}>
                  <CountUp value={k.value} format={k.fmt} />
                </Typography>
                <Chip
                  size="xs"
                  variant="soft"
                  color={k.delta >= 0 ? 'success' : 'danger'}
                  label={`${k.delta >= 0 ? '+' : '−'}${Math.abs(k.delta).toFixed(1)}${k.unit}`}
                  aria-label={`${k.delta >= 0 ? 'Up' : 'Down'} ${Math.abs(k.delta).toFixed(1)}${k.unit === '%' ? ' percent' : ' points'} versus the previous ${r.label}`}
                  icon={k.delta >= 0 ? <TrendingUp /> : <TrendingDown />}
                />
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Panel title={`Revenue, last ${r.label} (${r.unit === 'day' ? 'daily' : 'weekly'})`}>
            <Box
              role="img"
              aria-label={`${r.unit === 'day' ? 'Daily' : 'Weekly'} revenue over the last ${r.label}, ${r.bars.length} bars, sample data`}
              data-testid="revenue-chart"
              data-bars={r.bars.length}
              sx={{ display: 'flex', alignItems: 'flex-end', gap: r.bars.length > 14 ? '3px' : 1, height: 200 }}
            >
              {r.bars.map((b, i) => (
                <motion.div
                  key={`${range}-${i}`}
                  initial={reduce ? false : { height: 0 }}
                  animate={{ height: `${b}%` }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: EASE, delay: reduce ? 0 : i * 0.025 }}
                  style={{ flex: 1, minWidth: 0, borderRadius: r.bars.length > 14 ? 3 : 8, background: `linear-gradient(180deg, ${colorPalette.primary[400]}, ${colorPalette.secondary[400]})` }}
                />
              ))}
            </Box>
          </Panel>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Panel title="Goals">
            <Stack spacing={2.5}>
              {[
                ['Monthly revenue', 72, 'primary'],
                ['New customers', 58, 'secondary'],
                ['Support SLA', 91, 'success'],
              ].map(([label, v, c]) => (
                <Box key={label as string}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2">{label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {v}%
                    </Typography>
                  </Stack>
                  <Box sx={{ mt: 0.75 }}>
                    <Progress value={v as number} color={c as 'primary'} aria-label={`${label}, ${v} percent`} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Panel>
        </Grid>
      </Grid>
      <Panel title="Recent orders">
        <Box tabIndex={0} role="region" aria-label="Recent orders table" sx={{ overflowX: 'auto' }}>
          <Table
            size="sm"
            data={orders.slice(0, 5)}
            getRowId={(o) => o.id}
            hoverable
            onRowClick={(o) => onOpenOrder(o)}
            caption="Five most recent orders"
            columns={[
              { id: 'id', header: 'Order', accessor: 'id' },
              { id: 'customer', header: 'Customer', accessor: 'customer' },
              { id: 'status', header: 'Status', accessor: 'status', cell: (v) => <StatusChip status={v as OrderStatus} /> },
              { id: 'amount', header: 'Amount', accessor: 'amount', align: 'right', cell: (v) => money(v as number) },
            ]}
          />
        </Box>
      </Panel>
    </Stack>
  );
}

// ---------------------------------------------------------------- Orders
const PAGE = 8;
function Orders({ orders, onOpenOrder, onNew }: { orders: Order[]; onOpenOrder: (o: Order) => void; onNew: () => void }) {
  const [q, setQ] = React.useState('');
  const [status, setStatus] = React.useState<OrderStatus | 'All'>('All');
  const [page, setPage] = React.useState(1);
  const rows = orders.filter(
    (o) => (status === 'All' || o.status === status) && `${o.id} ${o.customer} ${o.email}`.toLowerCase().includes(q.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  React.useEffect(() => setPage(1), [q, status]);
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }} spacing={2}>
        <Box>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 26 }}>
            Orders
          </Typography>
          <Typography color="text.secondary">{rows.length} orders</Typography>
        </Box>
        <Button startIcon={<Add />} onClick={onNew}>
          New order
        </Button>
      </Stack>
      <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' }, mb: 2 }}>
          <MuiTextField
            size="small"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search orders"
            slotProps={{
              htmlInput: { 'aria-label': 'Search orders' },
              input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> },
            }}
            sx={{ flex: 1, maxWidth: { md: 320 } }}
          />
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap role="group" aria-label="Filter by status">
            {(['All', 'Paid', 'Pending', 'Refunded', 'Failed'] as const).map((s) => (
              <Button key={s} size="sm" variant={status === s ? 'soft' : 'ghost'} aria-pressed={status === s} onClick={() => setStatus(s)}>
                {s}
              </Button>
            ))}
          </Stack>
        </Stack>
        <Box tabIndex={0} role="region" aria-label="Orders table" sx={{ overflowX: 'auto' }}>
          <Table
            data={rows.slice((page - 1) * PAGE, page * PAGE)}
            getRowId={(o) => o.id}
            hoverable
            onRowClick={(o) => onOpenOrder(o)}
            caption="Orders"
            emptyContent={<Typography color="text.secondary" sx={{ p: 3 }}>No orders match.</Typography>}
            columns={[
              { id: 'id', header: 'Order', accessor: 'id' },
              { id: 'customer', header: 'Customer', accessor: 'customer' },
              { id: 'date', header: 'Date', accessor: 'date' },
              { id: 'items', header: 'Items', accessor: 'items', align: 'right' },
              { id: 'status', header: 'Status', accessor: 'status', cell: (v) => <StatusChip status={v as OrderStatus} /> },
              { id: 'amount', header: 'Amount', accessor: 'amount', align: 'right', cell: (v) => money(v as number) },
            ]}
          />
        </Box>
        {pages > 1 && (
          <Stack sx={{ alignItems: 'center', mt: 2 }}>
            <Pagination count={pages} page={page} onChange={(_, p) => setPage(p)} size="sm" />
          </Stack>
        )}
      </Card>
    </Stack>
  );
}

// ---------------------------------------------------------------- Customers
function Customers({ onOpen }: { onOpen: (c: Customer) => void }) {
  const [plan, setPlan] = React.useState<'All' | Customer['plan']>('All');
  const list = CUSTOMERS.filter((c) => plan === 'All' || c.plan === plan);
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }} spacing={2}>
        <Box>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 26 }}>
            Customers
          </Typography>
          <Typography color="text.secondary">{list.length} customers</Typography>
        </Box>
        <Select value={plan} onChange={(e) => setPlan(e.target.value as typeof plan)} inputProps={{ 'aria-label': 'Plan' }} size="sm" sx={{ minWidth: 160 }}>
          {['All', 'Free', 'Pro', 'Team'].map((p) => (
            <MenuItem key={p} value={p}>
              {p === 'All' ? 'All plans' : p}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Grid container spacing={2}>
        {list.map((c) => (
          <Grid key={c.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              variant="outlined"
              sx={{ p: 2.5, height: '100%', cursor: 'pointer', transition: 'border-color .2s, transform .2s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' } }}
            >
              <Box component="button" onClick={() => onOpen(c)} aria-label={`Open ${c.name}`} sx={{ all: 'unset', display: 'block', width: '100%', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 4, borderRadius: 1 } }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Avatar status={c.status}>{initials(c.name)}</Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }} noWrap>
                      {c.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {c.email}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Chip size="sm" variant="soft" color={c.plan === 'Team' ? 'secondary' : c.plan === 'Pro' ? 'primary' : 'neutral'} label={c.plan} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {money(c.spent)}
                  </Typography>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

// ---------------------------------------------------------------- Settings
function SettingsView({ onSaved }: { onSaved: () => void }) {
  const [name, setName] = React.useState('Sam Rivera');
  const [digest, setDigest] = React.useState('weekly');
  return (
    <Stack spacing={3}>
      <Typography component="h2" sx={{ fontWeight: 800, fontSize: 26 }}>
        Settings
      </Typography>
      <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Tabs
          variant="soft"
          defaultValue="profile"
          aria-label="Settings sections"
          tabs={[
            {
              id: 'profile',
              label: 'Profile',
              content: (
                <Stack spacing={2.5} sx={{ pt: 3, maxWidth: 520 }}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Avatar size="lg">{initials(name || 'S R')}</Avatar>
                    <Button variant="soft" size="sm">
                      Change avatar
                    </Button>
                  </Stack>
                  <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} variant="soft" fullWidth />
                  <TextField label="Email" defaultValue="sam.rivera@example.com" variant="soft" fullWidth />
                  <TextField label="Bio" defaultValue="Head of operations at Acme." variant="soft" fullWidth multiline minRows={3} />
                </Stack>
              ),
            },
            {
              id: 'notifications',
              label: 'Notifications',
              content: (
                <Stack spacing={1.5} sx={{ pt: 3, maxWidth: 520 }}>
                  <Switch label="New orders" defaultChecked />
                  <Switch label="Refund requests" defaultChecked />
                  <Switch label="Product updates" />
                  <Divider />
                  <Typography variant="body2" color="text.secondary" id="digest-label">
                    Email digest
                  </Typography>
                  <Select value={digest} onChange={(e) => setDigest(String(e.target.value))} inputProps={{ 'aria-labelledby': 'digest-label' }} sx={{ maxWidth: 240 }}>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="never">Never</MenuItem>
                  </Select>
                </Stack>
              ),
            },
            {
              id: 'billing',
              label: 'Billing',
              content: (
                <Stack spacing={2} sx={{ pt: 3, maxWidth: 520 }}>
                  <Alert color="info">You are on the Team plan (sample). Next invoice on Nov 30.</Alert>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography>Seats used</Typography>
                    <Typography sx={{ fontWeight: 700 }}>8 of 10</Typography>
                  </Stack>
                  <Progress value={80} aria-label="Seats used, 8 of 10" />
                </Stack>
              ),
            },
          ]}
        />
        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <Button onClick={onSaved}>Save changes</Button>
          <Button variant="ghost">Cancel</Button>
        </Stack>
      </Card>
    </Stack>
  );
}

// ---------------------------------------------------------------- Shell
export default function DemoApp() {
  const [view, setView] = React.useState<View>('overview');
  const [orders, setOrders] = React.useState<Order[]>(ORDERS);
  // Dialog / drawer content stays mounted while they animate closed: `open` flips
  // first, and the shown item is cleared only once the exit transition ends.
  const [orderOpen, setOrderOpen] = React.useState(false);
  const [openOrder, setOpenOrder] = React.useState<Order | null>(null);
  const [newOpen, setNewOpen] = React.useState(false);
  const [customerOpen, setCustomerOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  // The element that opened the order dialog (a table row), refocused on close.
  const orderReturnFocus = React.useRef<HTMLElement | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);
  const [mobileNav, setMobileNav] = React.useState(false);
  const [draft, setDraft] = React.useState({ customer: '', amount: '' });

  const go = (v: View) => {
    setView(v);
    setMobileNav(false);
  };

  const showOrder = (o: Order) => {
    orderReturnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpenOrder(o);
    setOrderOpen(true);
  };
  const closeOrder = () => setOrderOpen(false);
  const showCustomer = (c: Customer) => {
    setCustomer(c);
    setCustomerOpen(true);
  };
  const closeCustomer = () => setCustomerOpen(false);
  const openNewOrder = () => {
    // Always start from an empty form: Cancel, Esc and the backdrop discard the draft.
    setDraft({ customer: '', amount: '' });
    setNewOpen(true);
  };

  const createOrder = () => {
    const amount = Number(draft.amount);
    if (!draft.customer.trim() || !(amount > 0)) return;
    const customer = draft.customer.trim();
    const next: Order = {
      id: `#${Math.max(...orders.map((o) => Number(o.id.slice(1)))) + 1}`,
      customer,
      email: emailFor(customer),
      amount: Math.round(amount),
      status: 'Pending',
      date: formatDate(new Date()),
      items: 1,
    };
    setOrders((o) => [next, ...o]);
    setNewOpen(false);
    setToast(`Order ${next.id} created`);
  };

  const nav = (
    <Box component="nav" aria-label="Demo app">
      <List component="div" sx={{ p: 1 }}>
        {NAV.map((n) => (
          <ListItemButton
            key={n.id}
            selected={view === n.id}
            aria-current={view === n.id ? 'page' : undefined}
            onClick={() => go(n.id)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{n.icon}</ListItemIcon>
            <ListItemText primary={n.label} slotProps={{ primary: { sx: { fontWeight: 600, fontSize: 14 } } }} />
            {n.id === 'orders' && <Chip size="xs" variant="soft" color="warning" label={orders.filter((o) => o.status === 'Pending').length} />}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box data-testid="demo-app" sx={{ display: 'flex', minHeight: 'calc(100vh - 65px)', bgcolor: 'background.default' }}>
      {/* Sidebar (desktop) */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, width: 240, flexShrink: 0, borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', px: 2.5, py: 2.5 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: 2, background: `linear-gradient(135deg, ${colorPalette.primary[400]}, ${colorPalette.secondary[400]})` }} />
          <Typography sx={{ fontWeight: 800 }}>Acme Admin</Typography>
        </Stack>
        {nav}
        <Box sx={{ m: 2, p: 2, borderRadius: 3, bgcolor: 'action.hover' }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            This is a demo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Built with @sorbet-ui/react. Data is fake and resets on reload.
          </Typography>
        </Box>
      </Box>

      {/* Mobile nav */}
      <Drawer open={mobileNav} onClose={() => setMobileNav(false)} anchor="left" aria-label="Menu">
        <Box sx={{ width: 260 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
            <Typography sx={{ fontWeight: 800 }}>Acme Admin</Typography>
            <IconButton aria-label="Close menu" onClick={() => setMobileNav(false)}>
              <Close />
            </IconButton>
          </Stack>
          {nav}
        </Box>
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Top bar */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: { xs: 2, md: 4 }, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <IconButton aria-label="Open menu" aria-expanded={mobileNav} onClick={() => setMobileNav(true)} sx={{ display: { md: 'none' } }}>
            <Menu />
          </IconButton>
          <Typography sx={{ fontWeight: 700, flex: 1 }}>{NAV.find((n) => n.id === view)?.label}</Typography>
          <Badge badgeContent={3} color="danger">
            <Avatar size="sm" status="online">
              SR
            </Avatar>
          </Badge>
        </Stack>

        <Box component="section" aria-label="Demo content" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1280 }}>
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            {view === 'overview' && <Overview orders={orders} onOpenOrder={showOrder} />}
            {view === 'orders' && <Orders orders={orders} onOpenOrder={showOrder} onNew={openNewOrder} />}
            {view === 'customers' && <Customers onOpen={showCustomer} />}
            {view === 'settings' && <SettingsView onSaved={() => setToast('Settings saved')} />}
          </motion.div>
        </Box>
      </Box>

      {/* Order details */}
      <Dialog
        open={orderOpen}
        onClose={closeOrder}
        maxWidth="xs"
        fullWidth
        aria-labelledby="order-title"
        slotProps={{
          transition: {
            onExited: () => {
              setOpenOrder(null);
              // MUI restores focus too, but the row may have re-rendered (e.g. after a refund).
              const el = orderReturnFocus.current;
              if (el?.isConnected) el.focus();
              orderReturnFocus.current = null;
            },
          },
        }}
      >
        {openOrder && (
          <>
            <DialogTitle id="order-title">Order {openOrder.id}</DialogTitle>
            <DialogContent>
              <Stack spacing={1.5}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Customer</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{openOrder.customer}</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Date</Typography>
                  <Typography>{openOrder.date}</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="text.secondary">Status</Typography>
                  <StatusChip status={openOrder.status} />
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Total</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{money(openOrder.amount)}</Typography>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              {openOrder.status === 'Paid' && (
                <Button
                  variant="ghost"
                  color="danger"
                  onClick={() => {
                    setOrders((o) => o.map((x) => (x.id === openOrder.id ? { ...x, status: 'Refunded' } : x)));
                    setToast(`Order ${openOrder.id} refunded`);
                    closeOrder();
                  }}
                >
                  Refund
                </Button>
              )}
              <Button onClick={closeOrder}>Done</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New order */}
      <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="xs" fullWidth aria-labelledby="new-order-title">
        <DialogTitle id="new-order-title">New order</DialogTitle>
        {/* A real form, so Enter in either field submits. */}
        <Box
          component="form"
          noValidate
          sx={{ display: 'contents' }}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            createOrder();
          }}
        >
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Customer name" value={draft.customer} onChange={(e) => setDraft((d) => ({ ...d, customer: e.target.value }))} fullWidth autoFocus />
            <TextField
              label="Amount (USD)"
              type="number"
              value={draft.amount}
              onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
              fullWidth
              error={draft.amount !== '' && !(Number(draft.amount) > 0)}
              helperText={draft.amount !== '' && !(Number(draft.amount) > 0) ? 'Enter an amount above 0' : ' '}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="ghost" onClick={() => setNewOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={!draft.customer.trim() || !(Number(draft.amount) > 0)}>
            Create order
          </Button>
        </DialogActions>
        </Box>
      </Dialog>

      {/* Customer drawer */}
      <Drawer
        open={customerOpen}
        onClose={closeCustomer}
        anchor="right"
        aria-label={customer?.name ?? 'Customer'}
        slotProps={{ transition: { onExited: () => setCustomer(null) } }}
      >
        {customer && (
          <Box sx={{ width: { xs: 300, sm: 360 }, p: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: 20 }}>
                {customer.name}
              </Typography>
              <IconButton aria-label="Close details" onClick={closeCustomer}>
                <Close />
              </IconButton>
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mt: 2 }}>
              <Avatar size="lg" status={customer.status}>
                {initials(customer.name)}
              </Avatar>
              <Box>
                <Typography color="text.secondary">{customer.email}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer since {customer.joined}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 3 }} />
            <Stack spacing={1.5}>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Plan</Typography>
                <Typography sx={{ fontWeight: 600 }}>{customer.plan}</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Lifetime spend</Typography>
                <Typography sx={{ fontWeight: 600 }}>{money(customer.spent)}</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Orders</Typography>
                <Typography sx={{ fontWeight: 600 }}>{orders.filter((o) => o.customer === customer.name).length}</Typography>
              </Stack>
            </Stack>
            <Button
              fullWidth
              variant="soft"
              sx={{ mt: 3 }}
              onClick={() => {
                setToast(`Email drafted to ${customer.name}`);
                closeCustomer();
              }}
            >
              Send email
            </Button>
          </Box>
        )}
      </Drawer>

      <Snackbar
        open={toast !== null}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        message={toast ?? ''}
        color="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
