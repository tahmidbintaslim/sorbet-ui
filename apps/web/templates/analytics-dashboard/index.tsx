'use client';
// Analytics dashboard: "Marlowe Tea", a small store's admin.
// Three views (Overview, Orders, Customers) in one file, sample data in ./data.ts,
// charts in ./charts.tsx. The layout responds to the width of its container, not the
// viewport, so it also works inside a panel, a split view or a preview frame.
import * as React from 'react';
import { Box, ButtonBase, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from '@mui/material';
import SpaceDashboardOutlined from '@mui/icons-material/SpaceDashboardOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import Close from '@mui/icons-material/Close';
import Add from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOff from '@mui/icons-material/SearchOff';
import { Avatar, Badge, Button, Card, Chip, Dialog, Drawer, Pagination, Skeleton, Snackbar, Table, Tabs, TextField } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import { AreaChart, BarList, Sparkline } from './charts';
import { ACTIVITY, CUSTOMERS, ORDERS, RANGES, STATUS_COLOR, TODAY, dayLabel, emailFor, initials, money, money2, summarize, type Accent, type Customer, type Order, type OrderStatus, type RangeId } from './data';

// Container breakpoints: the root is the query container.
const CQ = { sm: '@container (min-width: 600px)', md: '@container (min-width: 900px)', lg: '@container (min-width: 1160px)' } as const;
// Finger-sized targets on touch screens.
const TAP = { '@media (pointer: coarse)': { minHeight: 44, minWidth: 44 } } as const;

type View = 'overview' | 'orders' | 'customers';
const NAV: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <SpaceDashboardOutlined fontSize="small" /> },
  { id: 'orders', label: 'Orders', icon: <ReceiptLongOutlined fontSize="small" /> },
  { id: 'customers', label: 'Customers', icon: <PeopleAltOutlined fontSize="small" /> },
];

/** True while the element is narrower than `below` pixels. Used to drop table columns. */
function useNarrow(ref: React.RefObject<HTMLElement | null>, below: number) {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < below));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, below]);
  return narrow;
}

function Panel({ title, action, children, sx }: { title: string; action?: React.ReactNode; children: React.ReactNode; sx?: object }) {
  return (
    <Card variant="outlined" sx={{ p: 2.5, minWidth: 0, ...sx }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2, minHeight: 32 }}>
        <Typography component="h3" sx={{ fontWeight: 700, fontSize: 15 }}>
          {title}
        </Typography>
        {action}
      </Stack>
      {children}
    </Card>
  );
}

const StatusChip = ({ status }: { status: OrderStatus }) => <Chip size="sm" variant="soft" color={STATUS_COLOR[status]} label={status} />;

function Empty({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center', py: 3 }}>
      <SearchOff sx={{ fontSize: 32, color: 'text.secondary' }} />
      <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {body}
      </Typography>
      {action}
    </Stack>
  );
}

function ViewHeader({ title, sub, headingRef, action }: { title: string; sub: React.ReactNode; headingRef: React.Ref<HTMLHeadingElement>; action?: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, [CQ.sm]: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' } }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography ref={headingRef} component="h2" tabIndex={-1} sx={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', outline: 'none' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {sub}
        </Typography>
      </Box>
      {action && <Box sx={{ flexShrink: 0, maxWidth: '100%' }}>{action}</Box>}
    </Box>
  );
}

const PAGE_SIZE = 8;
type SortKey = 'id' | 'customer' | 'date' | 'status' | 'total';

export default function AnalyticsDashboard({ accent = 'primary' }: { accent?: Accent }) {
  const root = React.useRef<HTMLDivElement>(null);
  const heading = React.useRef<HTMLHeadingElement>(null);
  const narrow = useNarrow(root, 720);

  const [view, setView] = React.useState<View>('overview');
  const [navOpen, setNavOpen] = React.useState(false);
  const focusHeadingOnClose = React.useRef(false);

  // Overview
  const [range, setRange] = React.useState<RangeId>('30d');
  const [loading, setLoading] = React.useState(false);
  const loadTimer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(loadTimer.current), []);
  const stats = React.useMemo(() => summarize(range), [range]);
  const changeRange = (next: RangeId) => {
    if (next === range) return;
    setRange(next);
    // Stand-in for a request: show the loading state briefly.
    setLoading(true);
    window.clearTimeout(loadTimer.current);
    loadTimer.current = window.setTimeout(() => setLoading(false), 450);
  };

  // Orders
  const [orders, setOrders] = React.useState<Order[]>(ORDERS);
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState<OrderStatus | 'All'>('All');
  const [sort, setSort] = React.useState<{ by: SortKey; dir: 'asc' | 'desc' }>({ by: 'date', dir: 'desc' });
  const [page, setPage] = React.useState(1);
  const needle = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    const rows = orders.filter((o) => (status === 'All' || o.status === status) && `${o.id} ${o.customer} ${o.email} ${o.channel}`.toLowerCase().includes(needle));
    const value = (o: Order) => (sort.by === 'date' ? o.date * 10000 + Number(o.id.slice(3)) : sort.by === 'id' ? Number(o.id.slice(3)) : o[sort.by]);
    return [...rows].sort((a, b) => {
      const [x, y] = [value(a), value(b)];
      const d = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
      return sort.dir === 'asc' ? d : -d;
    });
  }, [orders, status, needle, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const pending = orders.filter((o) => o.status === 'Pending').length;

  // Dialogs keep their content while they animate out: `open` flips first and the
  // shown item is cleared when the exit transition ends.
  const [orderOpen, setOrderOpen] = React.useState(false);
  const [openOrder, setOpenOrder] = React.useState<Order | null>(null);
  const returnFocus = React.useRef<HTMLElement | null>(null);
  const showOrder = (o: Order) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpenOrder(o);
    setOrderOpen(true);
  };
  const [newOpen, setNewOpen] = React.useState(false);
  const [draft, setDraft] = React.useState({ customer: '', amount: '' });
  const amountOk = Number(draft.amount) > 0;
  const [customerOpen, setCustomerOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [customerQuery, setCustomerQuery] = React.useState('');

  // Each toast gets a new key, so a second message restarts the timer.
  const [toast, setToast] = React.useState<{ id: number; message: string; open: boolean } | null>(null);
  const notify = (message: string) => setToast((t) => ({ id: (t?.id ?? 0) + 1, message, open: true }));

  const titleId = React.useId();
  const newTitleId = React.useId();

  const go = (next: View) => {
    setView(next);
    if (navOpen) {
      focusHeadingOnClose.current = true;
      setNavOpen(false);
    }
  };

  const createOrder = () => {
    const name = draft.customer.trim();
    if (!name || !amountOk) return;
    const total = Math.round(Number(draft.amount) * 100) / 100;
    const next: Order = {
      id: `MT-${Math.max(...orders.map((o) => Number(o.id.slice(3)))) + 1}`,
      customer: name,
      email: emailFor(name),
      date: TODAY,
      channel: 'Online store',
      status: 'Pending',
      lines: [{ name: 'Custom order', qty: 1, price: total }],
      total,
    };
    setOrders((list) => [next, ...list]);
    setPage(1);
    setNewOpen(false);
    notify(`Order ${next.id} created`);
  };

  const statsFor = (name: string) => {
    const own = orders.filter((o) => o.customer === name);
    return { count: own.length, spent: own.filter((o) => o.status === 'Paid' || o.status === 'Pending').reduce((a, o) => a + o.total, 0), own };
  };

  const nav = (
    <Box component="nav" aria-label="Dashboard" sx={{ display: 'grid', gap: 0.5, p: 1.5 }}>
      {NAV.map((n) => {
        const on = view === n.id;
        return (
          <ButtonBase
            key={n.id}
            onClick={() => go(n.id)}
            aria-current={on ? 'page' : undefined}
            sx={{
              justifyContent: 'flex-start',
              gap: 1.5,
              px: 1.5,
              minHeight: 40,
              borderRadius: '10px',
              fontSize: 14,
              fontWeight: on ? 700 : 500,
              color: on ? 'text.primary' : 'text.secondary',
              bgcolor: on ? 'action.selected' : 'transparent',
              '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
              '&:focus-visible': { outline: '2px solid', outlineColor: colorPalette[accent][500], outlineOffset: -2 },
              ...TAP,
            }}
          >
            {n.icon}
            <Box component="span" sx={{ flex: 1, textAlign: 'left' }}>
              {n.label}
            </Box>
            {n.id === 'orders' && pending > 0 && <Chip size="xs" variant="soft" color="warning" label={pending} aria-label={`${pending} pending`} />}
          </ButtonBase>
        );
      })}
    </Box>
  );

  const brand = (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
      <Box aria-hidden sx={{ width: 30, height: 30, borderRadius: '10px', display: 'grid', placeItems: 'center', bgcolor: colorPalette[accent][600] }}>
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M13.5 2.5C7 2.5 3 6 3 11.5c0 .7.1 1.4.2 2C4.6 9.6 7 7 10.5 5.6 7.8 7.7 6 10.300 5.300 13.500 11 13.500 13.500 9 13.500 2.500Z" fill="#fff" />
        </svg>
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>Marlowe Tea</Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.2 }}>Store admin</Typography>
      </Box>
    </Stack>
  );

  // ---------------------------------------------------------------- Overview
  const overview = (
    <Stack spacing={2.5}>
      <ViewHeader
        headingRef={heading}
        title="Overview"
        sub={
          <>
            {stats.from} to {stats.to}, compared with the {stats.days} days before
          </>
        }
        action={
          <Tabs
            size="sm"
            variant="soft"
            color={accent}
            value={range}
            onChange={(id) => changeRange(id as RangeId)}
            renderPanels={false}
            aria-label="Date range"
            tabs={RANGES.map((r) => ({ id: r.id, label: r.label }))}
          />
        }
      />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', [CQ.lg]: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' } }}>
        {stats.kpis.map((k) => {
          const up = k.delta >= 0;
          return (
            <Card key={k.id} variant="outlined" sx={{ p: 2, [CQ.sm]: { p: 2.5 } }} data-testid={`kpi-${k.id}`}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>{k.label}</Typography>
                <Box sx={{ display: 'none', [CQ.sm]: { display: 'block' } }}>
                  <Sparkline values={k.spark} accent={accent} width={72} height={26} />
                </Box>
              </Stack>
              <Typography component="p" sx={{ mt: 0.5, fontWeight: 800, fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', [CQ.sm]: { fontSize: 28 } }}>
                {loading ? <Skeleton shape="text" width={96} /> : k.value}
              </Typography>
              <Stack direction="row" sx={{ alignItems: 'center', mt: 1.25, flexWrap: 'wrap', columnGap: 1, rowGap: 0.5 }}>
                <Chip
                  size="xs"
                  variant="soft"
                  color={up ? 'success' : 'danger'}
                  icon={up ? <TrendingUp /> : <TrendingDown />}
                  label={`${up ? '+' : '−'}${Math.abs(k.delta).toFixed(k.unit === '%' ? 1 : 2)}${k.unit}`}
                  aria-label={`${up ? 'Up' : 'Down'} ${Math.abs(k.delta).toFixed(k.unit === '%' ? 1 : 2)} ${k.unit === '%' ? 'percent' : 'points'}`}
                />
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>vs previous</Typography>
              </Stack>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'minmax(0, 1fr)', [CQ.md]: { gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' } }}>
        <Panel
          title="Revenue"
          action={
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
              <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {stats.kpis[0].value}
              </Box>{' '}
              in {stats.days} days
            </Typography>
          }
        >
          {loading ? (
            <Skeleton shape="rounded" height={300} aria-label="Loading revenue" />
          ) : (
            <AreaChart
              label={`Revenue per day, last ${stats.days} days, with the previous ${stats.days} days for comparison`}
              values={stats.current.map((d) => d.revenue)}
              compare={stats.previous.map((d) => d.revenue)}
              labels={stats.current.map((d) => dayLabel(d.date))}
              accent={accent}
              format={money}
            />
          )}
        </Panel>
        <Panel title="Sales by channel">
          {loading ? <Skeleton shape="rounded" height={236} aria-label="Loading channels" /> : <BarList items={stats.channels} accent={accent} format={money} />}
        </Panel>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'minmax(0, 1fr)', [CQ.md]: { gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' } }}>
        <Panel
          title="Latest orders"
          action={
            <Button size="sm" variant="ghost" color={accent} onClick={() => go('orders')}>
              View all
            </Button>
          }
        >
          <Table<Order>
            size="sm"
            variant="plain"
            color={accent}
            aria-label="Latest orders"
            data={orders.slice(0, 5)}
            getRowId={(o) => o.id}
            onRowClick={showOrder}
            columns={[
              { id: 'id', header: 'Order', accessor: 'id' },
              { id: 'customer', header: 'Customer', accessor: 'customer' },
              { id: 'status', header: 'Status', accessor: 'status', cell: (v) => <StatusChip status={v as OrderStatus} /> },
              { id: 'total', header: 'Total', accessor: 'total', align: 'right', cell: (v) => money2(v as number) },
            ]}
          />
        </Panel>
        <Panel title="Activity">
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 2 }}>
            {ACTIVITY.map((a) => (
              <Box component="li" key={a.what} sx={{ display: 'flex', gap: 1.5 }}>
                <Box aria-hidden sx={{ mt: '7px', width: 8, height: 8, borderRadius: '50%', flexShrink: 0, bgcolor: colorPalette[a.tone][500] }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, lineHeight: 1.45 }}>
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      {a.who}
                    </Box>{' '}
                    {a.what}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{a.when}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Panel>
      </Box>
    </Stack>
  );

  // ---------------------------------------------------------------- Orders
  // Narrow containers get three columns: the order number moves under the customer.
  const columns = narrow
    ? [
        {
          id: 'customer',
          header: 'Customer',
          accessor: 'customer' as const,
          cell: (_: unknown, o: Order) => (
            <>
              <Box component="span" sx={{ display: 'block', fontWeight: 600 }}>
                {o.customer}
              </Box>
              <Box component="span" sx={{ display: 'block', fontSize: 12, color: 'text.secondary' }}>
                {o.id} · {dayLabel(o.date)}
              </Box>
            </>
          ),
        },
        { id: 'status', header: 'Status', accessor: 'status' as const, cell: (v: unknown) => <StatusChip status={v as OrderStatus} /> },
        { id: 'total', header: 'Total', accessor: 'total' as const, align: 'right' as const, cell: (v: unknown) => money2(v as number) },
      ]
    : [
        { id: 'id', header: 'Order', accessor: 'id' as const },
        { id: 'customer', header: 'Customer', accessor: 'customer' as const },
        { id: 'date', header: 'Date', accessor: 'date' as const, cell: (v: unknown) => dayLabel(v as number) },
        { id: 'channel', header: 'Channel', accessor: 'channel' as const, sortable: false },
        { id: 'status', header: 'Status', accessor: 'status' as const, cell: (v: unknown) => <StatusChip status={v as OrderStatus} /> },
        { id: 'total', header: 'Total', accessor: 'total' as const, align: 'right' as const, cell: (v: unknown) => money2(v as number) },
      ];

  const ordersView = (
    <Stack spacing={2.5}>
      <ViewHeader
        headingRef={heading}
        title="Orders"
        sub={`${filtered.length} ${filtered.length === 1 ? 'order' : 'orders'}${status !== 'All' || needle ? ' match your filters' : ' in the last 12 days'}`}
        action={
          <Button color={accent} startIcon={<Add />} onClick={() => { setDraft({ customer: '', amount: '' }); setNewOpen(true); }}>
            New order
          </Button>
        }
      />
      <Card variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, [CQ.md]: { flexDirection: 'row', alignItems: 'center' } }}>
          <TextField
            size="sm"
            variant="outlined"
            color={accent}
            placeholder="Search orders"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            startIcon={<Search fontSize="small" />}
            slotProps={{ htmlInput: { 'aria-label': 'Search orders' } }}
            sx={{ [CQ.md]: { width: 280 } }}
          />
          <Stack direction="row" spacing={0.5} role="group" aria-label="Filter by status" sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
            {(['All', 'Paid', 'Pending', 'Refunded', 'Failed'] as const).map((s) => (
              <Button key={s} size="sm" color={accent} variant={status === s ? 'soft' : 'ghost'} aria-pressed={status === s} onClick={() => { setStatus(s); setPage(1); }} sx={TAP}>
                {s}
              </Button>
            ))}
          </Stack>
        </Box>
        <Divider />
        <Table<Order>
          variant="plain"
          size={narrow ? 'sm' : 'md'}
          color={accent}
          aria-label="Orders"
          data={pageRows}
          getRowId={(o) => o.id}
          onRowClick={showOrder}
          sortable
          sortBy={sort.by}
          sortDirection={sort.dir}
          onSortChange={(by, dir) => setSort({ by: by as SortKey, dir })}
          columns={columns}
          emptyContent={
            <Empty
              title="No orders match"
              body="Try a different search or clear the status filter."
              action={
                <Button size="sm" variant="soft" color={accent} onClick={() => { setQuery(''); setStatus('All'); }}>
                  Clear filters
                </Button>
              }
            />
          }
        />
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }} role="status">
            {filtered.length === 0 ? 'Showing 0 orders' : `Showing ${(current - 1) * PAGE_SIZE + 1} to ${Math.min(current * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </Typography>
          {pages > 1 && <Pagination size="sm" color={accent} count={pages} page={current} onChange={(_, p) => setPage(p)} siblingCount={narrow ? 0 : 1} aria-label="Orders pages" />}
        </Stack>
      </Card>
    </Stack>
  );

  // ---------------------------------------------------------------- Customers
  const people = CUSTOMERS.filter((c) => `${c.name} ${c.city} ${c.email}`.toLowerCase().includes(customerQuery.trim().toLowerCase()));
  const customersView = (
    <Stack spacing={2.5}>
      <ViewHeader
        headingRef={heading}
        title="Customers"
        sub={`${people.length} of ${CUSTOMERS.length} people who ordered in the last 12 days`}
        action={
          <TextField
            size="sm"
            variant="outlined"
            color={accent}
            placeholder="Search customers"
            value={customerQuery}
            onChange={(e) => setCustomerQuery(e.target.value)}
            startIcon={<Search fontSize="small" />}
            slotProps={{ htmlInput: { 'aria-label': 'Search customers' } }}
            sx={{ width: '100%', [CQ.sm]: { width: 260 } }}
          />
        }
      />
      {people.length === 0 ? (
        <Card variant="outlined" sx={{ p: 3 }}>
          <Empty title="No customers found" body={`Nobody matches "${customerQuery.trim()}".`} action={<Button size="sm" variant="soft" color={accent} onClick={() => setCustomerQuery('')}>Clear search</Button>} />
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(232px, 1fr))' }}>
          {people.map((c) => {
            const s = statsFor(c.name);
            return (
              <Card key={c.name} variant="outlined" sx={{ p: 0, overflow: 'hidden', '&:hover, &:focus-within': { borderColor: colorPalette[accent][500] } }}>
                <ButtonBase
                  onClick={() => { setCustomer(c); setCustomerOpen(true); }}
                  aria-label={`Open ${c.name}`}
                  sx={{ display: 'block', width: '100%', p: 2, textAlign: 'left', '&:focus-visible': { outline: '2px solid', outlineColor: colorPalette[accent][500], outlineOffset: -2 } }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Avatar variant="soft" color={accent}>{initials(c.name)}</Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography noWrap sx={{ fontWeight: 700, fontSize: 14 }}>
                        {c.name}
                      </Typography>
                      <Typography noWrap sx={{ fontSize: 13, color: 'text.secondary' }}>
                        {c.city}
                      </Typography>
                    </Box>
                    <Chip size="xs" variant="soft" color={c.tier === 'Member' ? accent : 'neutral'} label={c.tier} />
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 2, fontSize: 13 }}>
                    <Box component="span" sx={{ color: 'text.secondary' }}>
                      {s.count} {s.count === 1 ? 'order' : 'orders'}
                    </Box>
                    <Box component="span" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {money2(s.spent)}
                    </Box>
                  </Stack>
                </ButtonBase>
              </Card>
            );
          })}
        </Box>
      )}
    </Stack>
  );

  const detail = customer && statsFor(customer.name);

  return (
    <Box ref={root} sx={{ containerType: 'inline-size', display: 'flex', height: '100%', minHeight: 600, bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Sidebar: shown when the container is at least 900px wide. */}
      <Box component="aside" aria-label="Sidebar" sx={{ display: 'none', [CQ.md]: { display: 'flex' }, flexDirection: 'column', width: 232, flexShrink: 0, borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ px: 2.5, py: 2.25 }}>{brand}</Box>
        <Divider />
        {nav}
        <Box sx={{ mt: 'auto', p: 1.5 }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', p: 1.25, borderRadius: '10px', border: 1, borderColor: 'divider' }}>
            <Avatar size="sm" variant="solid" color={accent} status="online">
              IC
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: 13, fontWeight: 700 }}>
                Ines Castillo
              </Typography>
              <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>
                Owner
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Drawer
        open={navOpen}
        onClose={() => setNavOpen(false)}
        anchor="left"
        aria-label="Navigation"
        slotProps={{
          transition: {
            onExited: () => {
              if (!focusHeadingOnClose.current) return;
              focusHeadingOnClose.current = false;
              heading.current?.focus();
            },
          },
        }}
      >
        <Box sx={{ width: 264 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', pl: 2.5, pr: 1, py: 1.5 }}>
            {brand}
            <IconButton aria-label="Close navigation" onClick={() => setNavOpen(false)} sx={TAP}>
              <Close />
            </IconButton>
          </Stack>
          <Divider />
          {nav}
        </Box>
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Stack component="header" direction="row" spacing={1} sx={{ alignItems: 'center', px: 2, minHeight: 56, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0, [CQ.md]: { px: 3 } }}>
          <IconButton aria-label="Open navigation" aria-expanded={navOpen} onClick={() => setNavOpen(true)} edge="start" sx={{ [CQ.md]: { display: 'none' }, ...TAP }}>
            <MenuIcon />
          </IconButton>
          <Typography sx={{ flex: 1, minWidth: 0, fontSize: 14, color: 'text.secondary' }} noWrap>
            <Box component="span" sx={{ display: 'none', [CQ.sm]: { display: 'inline' } }}>
              Marlowe Tea /{' '}
            </Box>
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
              {NAV.find((n) => n.id === view)!.label}
            </Box>
          </Typography>
          <Box sx={{ display: 'none', [CQ.sm]: { display: 'block' } }}>
            <Button size="sm" variant="outlined" color="neutral" startIcon={<FileDownloadOutlined />} onClick={() => notify('Report exported as CSV')}>
              Export
            </Button>
          </Box>
          <IconButton aria-label="Notifications, 3 unread" sx={TAP}>
            <Badge badgeContent={3} color="danger">
              <NotificationsNoneOutlined />
            </Badge>
          </IconButton>
        </Stack>

        <Box component="section" aria-label={NAV.find((n) => n.id === view)!.label} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2, [CQ.md]: { p: 3 } }}>
          <Box sx={{ maxWidth: 1240, mx: 'auto' }}>{view === 'overview' ? overview : view === 'orders' ? ordersView : customersView}</Box>
        </Box>
      </Box>

      {/* Order details */}
      <Dialog
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        maxWidth="xs"
        fullWidth
        aria-labelledby={titleId}
        slotProps={{
          transition: {
            onExited: () => {
              setOpenOrder(null);
              // The row may have re-rendered (after a refund); put focus back on it.
              if (returnFocus.current?.isConnected) returnFocus.current.focus();
              returnFocus.current = null;
            },
          },
        }}
      >
        {openOrder && (
          <>
            <DialogTitle id={titleId}>Order {openOrder.id}</DialogTitle>
            <DialogContent>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', pt: 0.5 }}>
                <Avatar variant="soft" color={accent}>{initials(openOrder.customer)}</Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography noWrap sx={{ fontWeight: 700 }}>
                    {openOrder.customer}
                  </Typography>
                  <Typography noWrap variant="body2" color="text.secondary">
                    {openOrder.email}
                  </Typography>
                </Box>
                <StatusChip status={openOrder.status} />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {dayLabel(openOrder.date)}, 2026 · {openOrder.channel}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 1.5, p: 0, borderTop: 1, borderColor: 'divider' }}>
                {openOrder.lines.map((l) => (
                  <Box component="li" key={l.name} sx={{ display: 'flex', gap: 1.5, py: 1.25, borderBottom: 1, borderColor: 'divider', fontSize: 14 }}>
                    <Box component="span" sx={{ flex: 1, minWidth: 0 }}>
                      {l.name}
                      <Box component="span" sx={{ color: 'text.secondary' }}>
                        {' '}
                        × {l.qty}
                      </Box>
                    </Box>
                    <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {money2(l.price * l.qty)}
                    </Box>
                  </Box>
                ))}
              </Box>
              <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 1.5 }}>
                <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography sx={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{money2(openOrder.total)}</Typography>
              </Stack>
            </DialogContent>
            <DialogActions>
              {openOrder.status === 'Paid' && (
                <Button
                  variant="ghost"
                  color="danger"
                  onClick={() => {
                    setOrders((list) => list.map((o) => (o.id === openOrder.id ? { ...o, status: 'Refunded' } : o)));
                    notify(`Order ${openOrder.id} refunded`);
                    setOrderOpen(false);
                  }}
                >
                  Refund
                </Button>
              )}
              <Button color={accent} onClick={() => setOrderOpen(false)}>
                Done
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New order: a real form, so Enter submits. It opens empty every time. */}
      <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="xs" fullWidth aria-labelledby={newTitleId}>
        <DialogTitle id={newTitleId}>New order</DialogTitle>
        <Box component="form" noValidate sx={{ display: 'contents' }} onSubmit={(e: React.FormEvent) => { e.preventDefault(); createOrder(); }}>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField label="Customer name" color={accent} value={draft.customer} onChange={(e) => setDraft((d) => ({ ...d, customer: e.target.value }))} fullWidth autoFocus />
              <TextField
                label="Amount (USD)"
                type="number"
                color={accent}
                value={draft.amount}
                onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
                fullWidth
                error={draft.amount !== '' && !amountOk}
                helperText={draft.amount !== '' && !amountOk ? 'Enter an amount above 0' : ' '}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="ghost" color="neutral" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" color={accent} disabled={!draft.customer.trim() || !amountOk}>
              Create order
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Customer details */}
      <Drawer open={customerOpen} onClose={() => setCustomerOpen(false)} anchor="right" aria-label={customer?.name ?? 'Customer'} slotProps={{ transition: { onExited: () => setCustomer(null) } }}>
        {customer && detail && (
          <Box sx={{ width: 'min(360px, 86cqw)', minWidth: 280, p: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: 18 }}>
                {customer.name}
              </Typography>
              <IconButton aria-label="Close details" onClick={() => setCustomerOpen(false)} edge="end" sx={TAP}>
                <Close />
              </IconButton>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {customer.email} · {customer.city}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, my: 2.5 }}>
              {[
                ['Orders', String(detail.count)],
                ['Spent', money(detail.spent)],
                ['Since', customer.since],
              ].map(([k, v]) => (
                <Box key={k} sx={{ p: 1.25, borderRadius: '10px', border: 1, borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{k}</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{v}</Typography>
                </Box>
              ))}
            </Box>
            <Typography component="h3" sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>
              Recent orders
            </Typography>
            {detail.own.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No orders in the last 12 days.
              </Typography>
            ) : (
              <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                {detail.own.slice(0, 5).map((o) => (
                  <Box component="li" key={o.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, borderBottom: 1, borderColor: 'divider', fontSize: 13 }}>
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {o.id}
                    </Box>
                    <Box component="span" sx={{ color: 'text.secondary', flex: 1 }}>
                      {dayLabel(o.date)}
                    </Box>
                    <StatusChip status={o.status} />
                    <Box component="span" sx={{ width: 64, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {money2(o.total)}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            <Button
              fullWidth
              variant="soft"
              color={accent}
              sx={{ mt: 2.5 }}
              onClick={() => {
                notify(`Email drafted to ${customer.name}`);
                setCustomerOpen(false);
              }}
            >
              Send email
            </Button>
          </Box>
        )}
      </Drawer>

      <Snackbar
        key={toast?.id ?? 0}
        open={toast?.open ?? false}
        autoHideDuration={3000}
        onClose={(_, reason) => {
          if (reason !== 'clickaway') setToast((t) => (t ? { ...t, open: false } : t));
        }}
        message={toast?.message ?? ''}
        color="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
