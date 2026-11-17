'use client';
// Account settings for "Juniper Studio" (fictional): Profile, Notifications, Billing,
// Team and Advanced. Profile and notification edits go into a working copy; a bar
// at the bottom appears while it differs from the saved copy, with Save and Cancel.
// Sample data in ./data.ts. The layout responds to its container: a side menu when
// there is room, a scrolling row of sections when there is not.
import * as React from 'react';
import { Box, ButtonBase, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, RadioGroup, Stack, Typography } from '@mui/material';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonAddAlt from '@mui/icons-material/PersonAddAlt';
import Close from '@mui/icons-material/Close';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { Alert, Avatar, Button, Card, Chip, Dialog, Menu, MenuItem, Progress, Radio, Select, Snackbar, Switch, Table, TextField } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import {
  CHANNELS,
  EVENTS,
  INVITES,
  INVOICES,
  MATRIX,
  MEMBERS,
  PLANS,
  PROFILE,
  TIMEZONES,
  USAGE,
  WORKSPACE,
  initials,
  type Accent,
  type Digest,
  type Invite,
  type Invoice,
  type Matrix,
  type Member,
  type PlanId,
  type Role,
} from './data';

const CQ = { sm: '@container (min-width: 600px)', md: '@container (min-width: 880px)' } as const;
const TAP = { '@media (pointer: coarse)': { minHeight: 44, minWidth: 44 } } as const;
const ROLES: Role[] = ['Admin', 'Member', 'Viewer'];

type Section = 'profile' | 'notifications' | 'billing' | 'team' | 'advanced';
const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <PersonOutlined fontSize="small" /> },
  { id: 'notifications', label: 'Notifications', icon: <NotificationsNoneOutlined fontSize="small" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCardOutlined fontSize="small" /> },
  { id: 'team', label: 'Team', icon: <GroupOutlined fontSize="small" /> },
  { id: 'advanced', label: 'Advanced', icon: <WarningAmberOutlined fontSize="small" /> },
];

type Saved = { profile: typeof PROFILE; matrix: Matrix; digest: Digest; quiet: boolean };
const INITIAL: Saved = { profile: PROFILE, matrix: MATRIX, digest: 'daily', quiet: true };
const same = (a: Saved, b: Saved) => JSON.stringify(a) === JSON.stringify(b);

function Block({ title, sub, children, action, tone }: { title: string; sub?: string; children: React.ReactNode; action?: React.ReactNode; tone?: 'danger' }) {
  return (
    <Card variant="outlined" sx={{ p: 0, overflow: 'hidden', ...(tone && { borderColor: colorPalette.danger[400] }) }}>
      <Box sx={{ px: 2.5, pt: 2.5, pb: 2, display: 'flex', gap: 2, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h3" sx={{ fontWeight: 800, fontSize: 16, color: tone ? (t) => colorPalette.danger[t.palette.mode === 'dark' ? 300 : 700] : 'text.primary' }}>
            {title}
          </Typography>
          {sub && <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.25 }}>{sub}</Typography>}
        </Box>
        {action}
      </Box>
      <Box sx={{ px: 2.5, pb: 2.5 }}>{children}</Box>
    </Card>
  );
}

function RoleMenu({ member, onChange, accent }: { member: Member; onChange: (r: Role) => void; accent: Accent }) {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  if (member.role === 'Owner') return <Chip size="sm" variant="soft" color={accent} label="Owner" />;
  return (
    <>
      <Button size="sm" variant="outlined" color="neutral" endIcon={<ExpandMore />} aria-haspopup="menu" aria-expanded={!!anchor} aria-label={`Role for ${member.name}: ${member.role}`} onClick={(e) => setAnchor(e.currentTarget)} sx={TAP}>
        {member.role}
      </Button>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} size="sm">
        {ROLES.map((r) => (
          <MenuItem
            key={r}
            selected={r === member.role}
            onClick={() => {
              setAnchor(null);
              onChange(r);
            }}
          >
            {r}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function Settings({ accent = 'info' }: { accent?: Accent }) {
  const [section, setSection] = React.useState<Section>('profile');
  const [saved, setSaved] = React.useState<Saved>(INITIAL);
  const [draft, setDraft] = React.useState<Saved>(INITIAL);
  const [triedSave, setTriedSave] = React.useState(false);
  const dirty = !same(saved, draft);
  const [plan, setPlan] = React.useState<PlanId>('studio');
  const [twoStep, setTwoStep] = React.useState(true);
  const [members, setMembers] = React.useState<Member[]>(MEMBERS);
  const [invites, setInvites] = React.useState<Invite[]>(INVITES);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [invite, setInvite] = React.useState<{ email: string; role: Role }>({ email: '', role: 'Member' });
  const [inviteTried, setInviteTried] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState('');
  const [toast, setToast] = React.useState<{ id: number; message: string; open: boolean; color: 'success' | 'danger' } | null>(null);
  const notify = (message: string, color: 'success' | 'danger' = 'success') => setToast((t) => ({ id: (t?.id ?? 0) + 1, message, open: true, color }));
  const heading = React.useRef<HTMLHeadingElement>(null);
  const inviteTitle = React.useId();
  const deleteTitle = React.useId();

  const p = draft.profile;
  const profileErrors = {
    name: !p.name.trim() && 'Enter your name',
    email: !/^\S+@\S+\.\S+$/.test(p.email) && 'Enter a valid email address',
    bio: p.bio.length > 160 && 'Keep it under 160 characters',
  };
  const profileOk = !profileErrors.name && !profileErrors.email && !profileErrors.bio;
  const setProfile = (patch: Partial<typeof PROFILE>) => setDraft((d) => ({ ...d, profile: { ...d.profile, ...patch } }));

  const save = () => {
    if (!profileOk) {
      setTriedSave(true);
      if (section !== 'profile') setSection('profile');
      return;
    }
    setSaved(draft);
    setTriedSave(false);
    notify('Settings saved');
  };
  const cancel = () => {
    setDraft(saved);
    setTriedSave(false);
  };
  const go = (s: Section) => {
    setSection(s);
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  };

  const inviteError = !/^\S+@\S+\.\S+$/.test(invite.email) ? 'Enter an email address' : [...members.map((m) => m.email), ...invites.map((i) => i.email)].includes(invite.email.trim().toLowerCase()) ? 'Already in this workspace' : '';
  const sendInvite = () => {
    if (inviteError) {
      setInviteTried(true);
      return;
    }
    setInvites((list) => [...list, { email: invite.email.trim().toLowerCase(), role: invite.role, sent: 'Just now' }]);
    setInviteOpen(false);
    notify(`Invite sent to ${invite.email.trim()}`);
  };

  const currentPlan = PLANS.find((x) => x.id === plan)!;
  const err = (k: keyof typeof profileErrors) => (triedSave || draft.profile[k as keyof typeof PROFILE] !== saved.profile[k as keyof typeof PROFILE]) && profileErrors[k];

  // ---------------------------------------------------------------- Sections
  const profile = (
    <Stack spacing={2.5}>
      <Block title="Public profile" sub="Shown to people in this workspace and on shared files.">
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
          <Avatar size="xl" variant="soft" color={accent}>
            {initials(p.name || '?')}
          </Avatar>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Button size="sm" variant="outlined" color="neutral" onClick={() => notify('Photo upload is not part of this sample')}>
              Upload photo
            </Button>
            <Button size="sm" variant="ghost" color="neutral" disabled>
              Remove
            </Button>
          </Stack>
        </Stack>
        <Box sx={{ display: 'grid', gap: 0.5, columnGap: 2, gridTemplateColumns: '1fr', [CQ.sm]: { gridTemplateColumns: '1fr 1fr' } }}>
          <TextField label="Full name" color={accent} fullWidth value={p.name} onChange={(e) => setProfile({ name: e.target.value })} error={!!err('name')} helperText={err('name') || ' '} autoComplete="name" />
          <TextField label="Email" type="email" color={accent} fullWidth value={p.email} onChange={(e) => setProfile({ email: e.target.value })} error={!!err('email')} helperText={err('email') || ' '} autoComplete="email" />
          <TextField label="Job title" color={accent} fullWidth value={p.title} onChange={(e) => setProfile({ title: e.target.value })} helperText=" " />
          <Select label="Time zone" color={accent} value={p.timezone} onChange={(e) => setProfile({ timezone: e.target.value })} SelectDisplayProps={{ 'aria-label': 'Time zone' }} helperText=" " fullWidth>
            {TIMEZONES.map((tz) => (
              <MenuItem key={tz} value={tz}>
                {tz.replace('_', ' ').replace('/', ' / ')}
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField
              label="Bio"
              color={accent}
              fullWidth
              multiline
              minRows={3}
              value={p.bio}
              onChange={(e) => setProfile({ bio: e.target.value })}
              error={!!err('bio')}
              helperText={err('bio') || `${160 - p.bio.length} characters left`}
            />
          </Box>
        </Box>
      </Block>
      <Block title="Sign-in and security">
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Password</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Last changed 4 months ago</Typography>
            </Box>
            <Button size="sm" variant="outlined" color="neutral" onClick={() => notify('A reset link is on its way to your inbox')}>
              Change password
            </Button>
          </Stack>
          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Switch
              color={accent}
              label="Two-step verification with an authenticator app"
              checked={twoStep}
              onChange={(e) => {
                setTwoStep(e.target.checked);
                notify(e.target.checked ? 'Two-step verification is on' : 'Two-step verification is off', e.target.checked ? 'success' : 'danger');
              }}
            />
          </Box>
        </Stack>
      </Block>
    </Stack>
  );

  const notifications = (
    <Stack spacing={2.5}>
      <Block title="Where we reach you" sub="Choose a channel for each kind of update.">
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& th, & td': { py: 1.25, borderTop: 1, borderColor: 'divider', textAlign: 'center' }, '& th:first-of-type, & td:first-of-type': { textAlign: 'left' } }}>
          <caption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Notification channels for each event</caption>
          <thead>
            <tr>
              <Box component="th" scope="col" sx={{ fontSize: 13, fontWeight: 700, color: 'text.secondary', borderTop: '0 !important' }}>
                Event
              </Box>
              {CHANNELS.map((c) => (
                <Box component="th" key={c.id} scope="col" sx={{ fontSize: 13, fontWeight: 700, color: 'text.secondary', width: 72, borderTop: '0 !important' }}>
                  {c.label}
                </Box>
              ))}
            </tr>
          </thead>
          <tbody>
            {EVENTS.map((ev) => (
              <tr key={ev.id}>
                <Box component="th" scope="row" sx={{ fontWeight: 400 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{ev.label}</Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{ev.hint}</Typography>
                </Box>
                {CHANNELS.map((c) => (
                  <td key={c.id}>
                    <Switch
                      size="sm"
                      color={accent}
                      checked={draft.matrix[ev.id][c.id]}
                      onChange={(e) => setDraft((d) => ({ ...d, matrix: { ...d.matrix, [ev.id]: { ...d.matrix[ev.id], [c.id]: e.target.checked } } }))}
                      slotProps={{ input: { 'aria-label': `${ev.label} by ${c.label}` } }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Box>
      </Block>
      <Block title="Email digest" sub="Bundle the quiet stuff into one email.">
        <RadioGroup aria-label="Email digest" value={draft.digest} onChange={(e) => setDraft((d) => ({ ...d, digest: e.target.value as Digest }))} sx={{ gap: 0.5, [CQ.sm]: { flexDirection: 'row', gap: 3 } }}>
          {[
            ['off', 'Off'],
            ['daily', 'Daily at 8:00'],
            ['weekly', 'Mondays at 8:00'],
          ].map(([v, l]) => (
            <FormControlLabel key={v} value={v} control={<Radio size="sm" color={accent} />} label={l} />
          ))}
        </RadioGroup>
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Switch color={accent} label="Quiet hours: no push notifications from 19:00 to 08:00" checked={draft.quiet} onChange={(e) => setDraft((d) => ({ ...d, quiet: e.target.checked }))} />
        </Box>
      </Block>
    </Stack>
  );

  const billing = (
    <Stack spacing={2.5}>
      <Block title="Plan" sub={`You are on ${currentPlan.name}. Changes apply from the next invoice.`}>
        <RadioGroup
          aria-label="Plan"
          value={plan}
          onChange={(e) => {
            const next = PLANS.find((x) => x.id === e.target.value)!;
            setPlan(next.id);
            notify(`Switched to ${next.name}`);
          }}
          sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: '1fr', [CQ.sm]: { gridTemplateColumns: 'repeat(3, 1fr)' } }}
        >
          {PLANS.map((x) => {
            const on = x.id === plan;
            return (
              <Box
                key={x.id}
                component="label"
                sx={{ position: 'relative', display: 'block', p: 2, borderRadius: '14px', border: 2, cursor: 'pointer', borderColor: on ? colorPalette[accent][500] : 'divider', bgcolor: on ? colorPalette[accent].alpha8 : 'transparent', '&:has(input:focus-visible)': { outline: '2px solid', outlineColor: colorPalette[accent][500], outlineOffset: 2 } }}
              >
                <Box component="input" type="radio" name="settings-plan" value={x.id} checked={on} onChange={() => {}} aria-label={`${x.name}, $${x.price} per seat per month`} sx={{ position: 'absolute', opacity: 0, inset: 0, m: 0, cursor: 'pointer' }} />
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 800 }}>{x.name}</Typography>
                  {on && <CheckCircle fontSize="small" sx={{ color: (t) => colorPalette[accent][t.palette.mode === 'dark' ? 300 : 600] }} />}
                </Stack>
                <Typography sx={{ fontSize: 22, fontWeight: 800, mt: 0.5 }}>
                  ${x.price}
                  <Box component="span" sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary' }}>
                    {' '}
                    / seat / mo
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>{x.blurb}</Typography>
              </Box>
            );
          })}
        </RadioGroup>
      </Block>
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: '1fr', [CQ.md]: { gridTemplateColumns: '1.3fr 1fr' } }}>
        <Block title="Usage this month">
          <Stack spacing={2}>
            {USAGE.map((u) => {
              const pct = (u.used / u.of) * 100;
              return (
                <Box key={u.label}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', fontSize: 14, mb: 0.75 }}>
                    <span>{u.label}</span>
                    <Box component="span" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                      {u.used}
                      {u.unit} of {u.of}
                      {u.unit}
                    </Box>
                  </Stack>
                  <Progress size="sm" color={pct >= 80 ? 'warning' : accent} value={pct} aria-label={`${u.label}: ${u.used}${u.unit} of ${u.of}${u.unit}`} />
                </Box>
              );
            })}
          </Stack>
        </Block>
        <Block title="Payment method">
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box aria-hidden sx={{ width: 48, height: 32, borderRadius: '6px', background: `linear-gradient(135deg, ${colorPalette[accent][600]}, ${colorPalette.secondary[600]})` }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Card ending 4242</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Expires 08 / 28</Typography>
            </Box>
          </Stack>
          <Button size="sm" variant="outlined" color="neutral" sx={{ mt: 2 }} onClick={() => notify('Card details would open your payment provider')}>
            Update card
          </Button>
        </Block>
      </Box>
      <Block title="Invoices">
        <Table<Invoice>
          size="sm"
          variant="plain"
          color={accent}
          aria-label="Invoices"
          data={INVOICES}
          getRowId={(i) => i.id}
          columns={[
            { id: 'id', header: 'Invoice', accessor: 'id' },
            { id: 'date', header: 'Date', accessor: 'date' },
            { id: 'amount', header: 'Amount', accessor: 'amount', align: 'right', cell: (v) => `$${(v as number).toFixed(2)}` },
            { id: 'status', header: 'Status', accessor: 'status', cell: (v) => <Chip size="xs" variant="soft" color={v === 'Paid' ? 'success' : 'warning'} label={v as string} /> },
            {
              id: 'pdf',
              header: 'PDF',
              accessor: 'id',
              align: 'right',
              cell: (v) => (
                <IconButton size="small" aria-label={`Download ${v as string}`} onClick={() => notify(`Downloading ${v as string}.pdf`)} sx={TAP}>
                  <FileDownloadOutlined fontSize="small" />
                </IconButton>
              ),
            },
          ]}
        />
      </Block>
    </Stack>
  );

  const team = (
    <Stack spacing={2.5}>
      <Block
        title={`Members (${members.length})`}
        sub={`${members.length + invites.length} of ${currentPlan.seats} seats used, including pending invites.`}
        action={
          <Button
            size="sm"
            color={accent}
            startIcon={<PersonAddAlt />}
            onClick={() => {
              setInvite({ email: '', role: 'Member' });
              setInviteTried(false);
              setInviteOpen(true);
            }}
          >
            Invite people
          </Button>
        }
      >
        <Box component="ul" aria-label="Members" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {members.map((m) => (
            <Box component="li" key={m.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5, borderTop: 1, borderColor: 'divider', flexWrap: 'wrap' }}>
              <Avatar size="sm" variant="soft" color={m.color}>
                {initials(m.name)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                  {m.name}
                  {m.role === 'Owner' && (
                    <Box component="span" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {' '}
                      (you)
                    </Box>
                  )}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', wordBreak: 'break-all' }}>{m.email}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', display: 'none', [CQ.sm]: { display: 'block' }, width: 110 }}>{m.lastActive}</Typography>
              <RoleMenu
                member={m}
                accent={accent}
                onChange={(r) => {
                  setMembers((list) => list.map((x) => (x.id === m.id ? { ...x, role: r } : x)));
                  notify(`${m.name} is now ${r === 'Admin' ? 'an' : 'a'} ${r}`);
                }}
              />
              {m.role !== 'Owner' && (
                <IconButton
                  aria-label={`Remove ${m.name}`}
                  onClick={() => {
                    setMembers((list) => list.filter((x) => x.id !== m.id));
                    notify(`${m.name} removed`, 'danger');
                  }}
                  sx={TAP}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Block>
      <Block title={`Pending invites (${invites.length})`}>
        {invites.length === 0 ? (
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>No pending invites.</Typography>
        ) : (
          <Box component="ul" aria-label="Pending invites" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {invites.map((i) => (
              <Box component="li" key={i.email} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, borderTop: 1, borderColor: 'divider', flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 160 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, wordBreak: 'break-all' }}>{i.email}</Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                    {i.role} · sent {i.sent}
                  </Typography>
                </Box>
                <Button size="sm" variant="ghost" color="neutral" onClick={() => notify(`Invite resent to ${i.email}`)} aria-label={`Resend invite to ${i.email}`}>
                  Resend
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  color="danger"
                  onClick={() => {
                    setInvites((list) => list.filter((x) => x.email !== i.email));
                    notify(`Invite to ${i.email} revoked`, 'danger');
                  }}
                  aria-label={`Revoke invite to ${i.email}`}
                >
                  Revoke
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Block>
    </Stack>
  );

  const advanced = (
    <Stack spacing={2.5}>
      <Block title="Workspace" sub="The name and address people use to find this workspace.">
        <Typography sx={{ fontSize: 14 }}>
          <Box component="span" sx={{ fontWeight: 700 }}>
            {WORKSPACE.name}
          </Box>{' '}
          <Box component="span" sx={{ color: 'text.secondary' }}>
            · {WORKSPACE.slug}.example.app
          </Box>
        </Typography>
      </Block>
      <Block title="Danger zone" tone="danger" sub="These actions cannot be undone.">
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Export all data</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Every project, file list and comment as a ZIP of JSON files.</Typography>
            </Box>
            <Button size="sm" variant="outlined" color="neutral" onClick={() => notify('Export started. We will email a link.')}>
              Export
            </Button>
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Delete workspace</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Removes {WORKSPACE.name} and everything in it for all members.</Typography>
            </Box>
            <Button
              size="sm"
              variant="solid"
              color="danger"
              onClick={() => {
                setConfirmText('');
                setDeleteOpen(true);
              }}
            >
              Delete workspace
            </Button>
          </Stack>
        </Stack>
      </Block>
    </Stack>
  );

  const current = SECTIONS.find((s) => s.id === section)!;

  return (
    <Box sx={{ containerType: 'inline-size', height: '100%', minHeight: 560, display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
      <Box component="header" sx={{ px: 2, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', [CQ.md]: { px: 4 } }}>
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
          Settings
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{WORKSPACE.name} workspace</Typography>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', [CQ.md]: { flexDirection: 'row' } }}>
        <Box
          component="nav"
          aria-label="Settings sections"
          sx={{
            display: 'flex',
            gap: 0.5,
            px: 1.5,
            py: 1,
            overflowX: 'auto',
            flexShrink: 0,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            [CQ.md]: { flexDirection: 'column', width: 220, px: 1.5, py: 2, borderBottom: 0, borderRight: 1, borderColor: 'divider', overflowX: 'visible' },
          }}
        >
          {SECTIONS.map((s) => {
            const on = s.id === section;
            return (
              <ButtonBase
                key={s.id}
                onClick={() => go(s.id)}
                aria-current={on ? 'page' : undefined}
                sx={{
                  flexShrink: 0,
                  justifyContent: 'flex-start',
                  gap: 1.25,
                  px: 1.5,
                  minHeight: 38,
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
                {s.icon}
                {s.label}
              </ButtonBase>
            );
          })}
        </Box>
        <Box component="section" aria-labelledby="settings-section-title" sx={{ flex: 1, minWidth: 0, minHeight: 0, overflowY: 'auto', position: 'relative' }}>
          <Box sx={{ maxWidth: 860, px: 2, py: 3, [CQ.md]: { px: 4 } }}>
            <Typography ref={heading} id="settings-section-title" component="h2" tabIndex={-1} sx={{ fontWeight: 800, fontSize: 20, mb: 2, outline: 'none' }}>
              {current.label}
            </Typography>
            {triedSave && !profileOk && section === 'profile' && (
              <Alert color="danger" size="sm" sx={{ mb: 2 }}>
                Fix the highlighted fields to save your changes.
              </Alert>
            )}
            {section === 'profile' ? profile : section === 'notifications' ? notifications : section === 'billing' ? billing : section === 'team' ? team : advanced}
            {/* Room so the unsaved-changes bar never covers the last field. */}
            {dirty && <Box sx={{ height: 72 }} />}
          </Box>
          {dirty && (
            <Box role="region" aria-label="Unsaved changes" sx={{ position: 'sticky', bottom: 0, mx: 2, mb: 2, [CQ.md]: { mx: 4 }, maxWidth: 860 }}>
              <Stack
                direction="row"
                sx={{ alignItems: 'center', gap: 1.5, px: 2, py: 1.25, borderRadius: '14px', bgcolor: (t) => (t.palette.mode === 'dark' ? colorPalette.neutral[700] : colorPalette.neutral[900]), color: '#fff', boxShadow: '0 18px 40px -18px rgba(15,23,42,.6)', flexWrap: 'wrap' }}
              >
                <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 600, minWidth: 140 }}>You have unsaved changes</Typography>
                <Button size="sm" variant="plain" color="neutral" onClick={cancel} sx={{ color: '#fff' }}>
                  Cancel
                </Button>
                <Button size="sm" color={accent} onClick={save}>
                  Save changes
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>

      {/* Invite */}
      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} maxWidth="xs" fullWidth aria-labelledby={inviteTitle}>
        <DialogTitle id={inviteTitle}>Invite to {WORKSPACE.name}</DialogTitle>
        <Box component="form" noValidate sx={{ display: 'contents' }} onSubmit={(e: React.FormEvent) => { e.preventDefault(); sendInvite(); }}>
          <DialogContent>
            <Stack spacing={1} sx={{ pt: 1 }}>
              <TextField
                label="Email address"
                type="email"
                color={accent}
                autoFocus
                fullWidth
                value={invite.email}
                onChange={(e) => setInvite((v) => ({ ...v, email: e.target.value }))}
                error={inviteTried && !!inviteError}
                helperText={(inviteTried && inviteError) || 'They get an email with a link to join.'}
              />
              <Select label="Role" color={accent} value={invite.role} onChange={(e) => setInvite((v) => ({ ...v, role: e.target.value as Role }))} SelectDisplayProps={{ 'aria-label': 'Role' }} fullWidth>
                {ROLES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="ghost" color="neutral" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" color={accent}>
              Send invite
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Type-to-confirm delete */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth aria-labelledby={deleteTitle}>
        <DialogTitle id={deleteTitle}>Delete {WORKSPACE.name}?</DialogTitle>
        <Box component="form" noValidate sx={{ display: 'contents' }} onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          if (confirmText !== WORKSPACE.slug) return;
          setDeleteOpen(false);
          notify('Sample workspace deleted (not really)', 'danger');
        }}>
          <DialogContent>
            <Alert color="danger" size="sm" sx={{ mb: 2 }}>
              This deletes every project, file and comment for all {members.length} members.
            </Alert>
            <TextField
              label={`Type ${WORKSPACE.slug} to confirm`}
              color="danger"
              fullWidth
              autoFocus
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              slotProps={{ htmlInput: { autoComplete: 'off', spellCheck: false } }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="ghost" color="neutral" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" color="danger" disabled={confirmText !== WORKSPACE.slug}>
              Delete workspace
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        key={toast?.id ?? 0}
        open={toast?.open ?? false}
        autoHideDuration={3000}
        onClose={(_, reason) => {
          if (reason !== 'clickaway') setToast((t) => (t ? { ...t, open: false } : t));
        }}
        message={toast?.message ?? ''}
        color={toast?.color ?? 'success'}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
