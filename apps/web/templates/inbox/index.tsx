'use client';
// Inbox: a three-pane mail client for "Juniper Studio" (fictional).
// Folders | message list | reading pane. Sample mail lives in ./data.ts. The layout
// follows the width of its container, not the viewport:
//   >= 1100px  folders, list and reading pane side by side
//   >=  760px  list and reading pane; folders open in a drawer
//   narrower   the list, then the message full width with a back button
import * as React from 'react';
import { Box, ButtonBase, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from '@mui/material';
import InboxOutlined from '@mui/icons-material/InboxOutlined';
import StarBorder from '@mui/icons-material/StarBorder';
import Star from '@mui/icons-material/Star';
import SendOutlined from '@mui/icons-material/SendOutlined';
import DraftsOutlined from '@mui/icons-material/DraftsOutlined';
import ArchiveOutlined from '@mui/icons-material/ArchiveOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import MarkEmailUnreadOutlined from '@mui/icons-material/MarkEmailUnreadOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import Close from '@mui/icons-material/Close';
import Search from '@mui/icons-material/Search';
import EditOutlined from '@mui/icons-material/EditOutlined';
import AttachFile from '@mui/icons-material/AttachFile';
import Reply from '@mui/icons-material/Reply';
import MarkunreadMailboxOutlined from '@mui/icons-material/MarkunreadMailboxOutlined';
import { Avatar, Button, Chip, Dialog, Drawer, Snackbar, Tabs, TextField, Tooltip } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import { LABEL_COLOR, ME, MESSAGES, initials, type Accent, type FolderId, type Label, type Message } from './data';

const CQ = { md: '@container (min-width: 760px)', lg: '@container (min-width: 1100px)' } as const;
const TAP = { '@media (pointer: coarse)': { minHeight: 44, minWidth: 44 } } as const;

const FOLDERS: { id: FolderId; label: string; icon: React.ReactNode }[] = [
  { id: 'inbox', label: 'Inbox', icon: <InboxOutlined fontSize="small" /> },
  { id: 'starred', label: 'Starred', icon: <StarBorder fontSize="small" /> },
  { id: 'sent', label: 'Sent', icon: <SendOutlined fontSize="small" /> },
  { id: 'drafts', label: 'Drafts', icon: <DraftsOutlined fontSize="small" /> },
  { id: 'archive', label: 'Archive', icon: <ArchiveOutlined fontSize="small" /> },
  { id: 'trash', label: 'Trash', icon: <DeleteOutlined fontSize="small" /> },
];
const LABELS = Object.keys(LABEL_COLOR) as Label[];
type Filter = 'all' | 'unread' | 'starred';

const inFolder = (m: Message, f: FolderId) => (f === 'starred' ? m.starred && m.folder !== 'trash' : m.folder === f);

export default function Inbox({ accent = 'secondary' }: { accent?: Accent }) {
  const [mail, setMail] = React.useState<Message[]>(MESSAGES);
  const [folder, setFolder] = React.useState<FolderId>('inbox');
  const [label, setLabel] = React.useState<Label | null>(null);
  const [filter, setFilter] = React.useState<Filter>('all');
  const [query, setQuery] = React.useState('');
  const [openId, setOpenId] = React.useState<string | null>('m1');
  // Narrow containers show one pane at a time: the list, or the open message.
  const [reading, setReading] = React.useState(false);
  const [navOpen, setNavOpen] = React.useState(false);
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [draft, setDraft] = React.useState({ to: '', subject: '', body: '' });
  const [reply, setReply] = React.useState('');
  const [toast, setToast] = React.useState<{ id: number; message: string; open: boolean } | null>(null);
  const notify = (message: string) => setToast((t) => ({ id: (t?.id ?? 0) + 1, message, open: true }));
  const listHeading = React.useRef<HTMLHeadingElement>(null);
  const readHeading = React.useRef<HTMLHeadingElement>(null);
  const composeTitle = React.useId();

  const needle = query.trim().toLowerCase();
  const list = mail.filter(
    (m) =>
      inFolder(m, folder) &&
      (!label || m.labels.includes(label)) &&
      (filter === 'all' || (filter === 'unread' ? m.unread : m.starred)) &&
      `${m.from} ${m.email} ${m.subject} ${m.body.join(' ')}`.toLowerCase().includes(needle),
  );
  const open = mail.find((m) => m.id === openId) ?? null;
  const unreadIn = (f: FolderId) => mail.filter((m) => inFolder(m, f) && m.unread).length;
  const unreadHere = mail.filter((m) => inFolder(m, folder) && (!label || m.labels.includes(label)) && m.unread).length;
  const title = label ?? FOLDERS.find((f) => f.id === folder)!.label;

  const update = (id: string, patch: Partial<Message>) => setMail((all) => all.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const choose = (m: Message) => {
    setOpenId(m.id);
    setReply('');
    if (m.unread) update(m.id, { unread: false });
    setReading(true);
    // On narrow containers the reading pane replaces the list: move focus to it.
    requestAnimationFrame(() => readHeading.current?.focus({ preventScroll: true }));
  };

  const goFolder = (f: FolderId, l: Label | null = null) => {
    setFolder(f);
    setLabel(l);
    setFilter('all');
    setReading(false);
    setNavOpen(false);
    requestAnimationFrame(() => listHeading.current?.focus({ preventScroll: true }));
  };

  // Moving a message out of the current view opens the next one in the list.
  const moveTo = (m: Message, target: Message['folder'], message: string) => {
    const i = list.findIndex((x) => x.id === m.id);
    const next = list[i + 1] ?? list[i - 1] ?? null;
    update(m.id, { folder: target });
    setOpenId(next && next.id !== m.id ? next.id : null);
    if (!next) setReading(false);
    notify(message);
  };

  const sendReply = () => {
    const body = reply.trim();
    if (!open || !body) return;
    update(open.id, { replies: [...(open.replies ?? []), { from: ME.name, time: 'Just now', body }] });
    setReply('');
    notify(`Reply sent to ${open.from}`);
  };

  const sendNew = () => {
    if (!draft.to.trim() || !draft.subject.trim()) return;
    const id = `n${Date.now()}`;
    setMail((all) => [
      { id, folder: 'sent', to: draft.to.trim(), from: ME.name, email: ME.email, subject: draft.subject.trim(), body: [draft.body.trim() || '(No message)'], time: 'Now', date: 'Just now', unread: false, starred: false, labels: [] },
      ...all,
    ]);
    setComposeOpen(false);
    notify(`Message sent to ${draft.to.trim()}`);
  };

  const navItem = (key: string, on: boolean, onClick: () => void, icon: React.ReactNode, text: string, count?: number) => (
    <ButtonBase
      key={key}
      onClick={onClick}
      aria-current={on ? 'page' : undefined}
      sx={{
        justifyContent: 'flex-start',
        gap: 1.5,
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
      {icon}
      <Box component="span" sx={{ flex: 1, textAlign: 'left' }}>
        {text}
      </Box>
      {!!count && (
        <Box component="span" aria-label={`${count} unread`} sx={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {count}
        </Box>
      )}
    </ButtonBase>
  );

  const folders = (
    <Stack spacing={2} sx={{ p: 1.5 }}>
      <Button
        color={accent}
        startIcon={<EditOutlined />}
        onClick={() => {
          setDraft({ to: '', subject: '', body: '' });
          setNavOpen(false);
          setComposeOpen(true);
        }}
      >
        Compose
      </Button>
      <Box component="nav" aria-label="Folders" sx={{ display: 'grid', gap: 0.25 }}>
        {FOLDERS.map((f) => navItem(f.id, folder === f.id && !label, () => goFolder(f.id), f.icon, f.label, f.id === 'inbox' || f.id === 'starred' ? unreadIn(f.id) : undefined))}
      </Box>
      <Box>
        <Typography id="inbox-labels" sx={{ px: 1.5, pb: 0.5, fontSize: 12, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Labels
        </Typography>
        <Box role="group" aria-labelledby="inbox-labels" sx={{ display: 'grid', gap: 0.25 }}>
          {LABELS.map((l) =>
            navItem(l, label === l, () => goFolder('inbox', l), <Box aria-hidden sx={{ width: 10, height: 10, mx: '5px', borderRadius: '50%', bgcolor: colorPalette[LABEL_COLOR[l]][500] }} />, l),
          )}
        </Box>
      </Box>
    </Stack>
  );

  // ---------------------------------------------------------------- List pane
  const listPane = (
    <Box
      component="section"
      aria-labelledby="inbox-list-title"
      sx={{
        display: reading ? 'none' : 'flex',
        flexDirection: 'column',
        minWidth: 0,
        flex: 1,
        bgcolor: 'background.paper',
        [CQ.md]: { display: 'flex', flex: '0 0 340px', borderRight: 1, borderColor: 'divider' },
        [CQ.lg]: { flexBasis: 380 },
      }}
    >
      <Box sx={{ p: 2, pb: 1.5, display: 'grid', gap: 1.5 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <IconButton aria-label="Open folders" aria-expanded={navOpen} onClick={() => setNavOpen(true)} edge="start" sx={{ [CQ.lg]: { display: 'none' }, ...TAP }}>
            <MenuIcon />
          </IconButton>
          <Typography ref={listHeading} id="inbox-list-title" component="h2" tabIndex={-1} sx={{ flex: 1, fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', outline: 'none' }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{list.length} {list.length === 1 ? 'message' : 'messages'}</Typography>
        </Stack>
        <TextField
          size="sm"
          variant="outlined"
          color={accent}
          placeholder="Search mail"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          startIcon={<Search fontSize="small" />}
          slotProps={{ htmlInput: { 'aria-label': 'Search mail' } }}
          fullWidth
        />
        <Tabs
          size="sm"
          variant="soft"
          color={accent}
          value={filter}
          onChange={(id) => setFilter(id as Filter)}
          renderPanels={false}
          aria-label="Show"
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'unread', label: `Unread (${unreadHere})` },
            { id: 'starred', label: 'Starred' },
          ]}
        />
      </Box>
      <Divider />
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {list.length === 0 ? (
          <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center', px: 3, py: 6 }}>
            <MarkunreadMailboxOutlined sx={{ fontSize: 36, color: 'text.secondary' }} />
            <Typography sx={{ fontWeight: 700 }}>{needle ? 'No messages match' : 'Nothing here'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {needle ? `Nothing in ${title} matches "${query.trim()}".` : filter === 'all' ? `${title} is empty.` : `No ${filter} messages in ${title}.`}
            </Typography>
            {(needle || filter !== 'all') && (
              <Button size="sm" variant="soft" color={accent} onClick={() => { setQuery(''); setFilter('all'); }}>
                Clear filters
              </Button>
            )}
          </Stack>
        ) : (
          <Box component="ul" aria-label={`${title} messages`} sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {list.map((m) => {
              const on = m.id === openId;
              return (
                <Box component="li" key={m.id} sx={{ position: 'relative', borderBottom: 1, borderColor: 'divider' }}>
                  <ButtonBase
                    onClick={() => choose(m)}
                    aria-current={on ? 'true' : undefined}
                    aria-label={`${m.unread ? 'Unread. ' : ''}${m.to ? `To ${m.to}` : m.from}: ${m.subject}. ${m.time}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      width: '100%',
                      textAlign: 'left',
                      pl: 2,
                      pr: 6,
                      py: 1.5,
                      bgcolor: on ? 'action.selected' : 'transparent',
                      boxShadow: on ? `inset 3px 0 0 ${colorPalette[accent][500]}` : 'none',
                      '&:hover': { bgcolor: on ? 'action.selected' : 'action.hover' },
                      '&:focus-visible': { outline: '2px solid', outlineColor: colorPalette[accent][500], outlineOffset: -2 },
                    }}
                  >
                    <Avatar size="sm" variant="soft" color={m.labels[0] ? LABEL_COLOR[m.labels[0]] : 'neutral'}>
                      {initials(m.from)}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
                        <Typography noWrap sx={{ flex: 1, fontSize: 14, fontWeight: m.unread ? 800 : 600 }}>
                          {m.to ? `To: ${m.to}` : m.from}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: m.unread ? 'text.primary' : 'text.secondary', fontWeight: m.unread ? 700 : 400, flexShrink: 0 }}>{m.time}</Typography>
                      </Stack>
                      <Typography noWrap sx={{ fontSize: 13, fontWeight: m.unread ? 700 : 500 }}>
                        {m.subject}
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.body[0]}</Typography>
                      {(m.labels.length > 0 || m.attachments) && (
                        <Stack direction="row" sx={{ gap: 0.5, mt: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
                          {m.labels.map((l) => (
                            <Chip key={l} size="xs" variant="soft" color={LABEL_COLOR[l]} label={l} />
                          ))}
                          {m.attachments && <AttachFile aria-label={`${m.attachments.length} attachments`} sx={{ fontSize: 15, color: 'text.secondary' }} />}
                        </Stack>
                      )}
                    </Box>
                    {m.unread && <Box aria-hidden sx={{ position: 'absolute', left: 6, top: 26, width: 6, height: 6, borderRadius: '50%', bgcolor: colorPalette[accent][500] }} />}
                  </ButtonBase>
                  <IconButton
                    size="small"
                    aria-label={m.starred ? `Unstar ${m.subject}` : `Star ${m.subject}`}
                    aria-pressed={m.starred}
                    onClick={() => update(m.id, { starred: !m.starred })}
                    sx={{ position: 'absolute', right: 8, top: 34, color: m.starred ? colorPalette.warning[500] : 'text.secondary', ...TAP }}
                  >
                    {m.starred ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );

  // ---------------------------------------------------------------- Reading pane
  const tool = (labelText: string, icon: React.ReactNode, onClick: () => void, pressed?: boolean) => (
    <Tooltip title={labelText}>
      <IconButton aria-label={labelText} aria-pressed={pressed} onClick={onClick} sx={TAP}>
        {icon}
      </IconButton>
    </Tooltip>
  );

  const readingPane = (
    <Box
      component="section"
      aria-label="Message"
      sx={{ display: reading ? 'flex' : 'none', flexDirection: 'column', flex: 1, minWidth: 0, bgcolor: 'background.default', [CQ.md]: { display: 'flex' } }}
    >
      {open ? (
        <>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', px: 1, minHeight: 56, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}>
            <Box sx={{ [CQ.md]: { display: 'none' } }}>
              <IconButton
                aria-label={`Back to ${title}`}
                onClick={() => {
                  setReading(false);
                  requestAnimationFrame(() => listHeading.current?.focus({ preventScroll: true }));
                }}
                sx={TAP}
              >
                <ArrowBack />
              </IconButton>
            </Box>
            {open.folder !== 'archive' && tool('Archive', <ArchiveOutlined />, () => moveTo(open, 'archive', 'Conversation archived'))}
            {open.folder !== 'trash' && tool('Delete', <DeleteOutlined />, () => moveTo(open, 'trash', 'Moved to Trash'))}
            {tool('Mark as unread', <MarkEmailUnreadOutlined />, () => {
              update(open.id, { unread: true });
              setReading(false);
              notify('Marked as unread');
            })}
            {tool(open.starred ? 'Unstar' : 'Star', open.starred ? <Star sx={{ color: colorPalette.warning[500] }} /> : <StarBorder />, () => update(open.id, { starred: !open.starred }), open.starred)}
            <Box sx={{ flex: 1 }} />
            <Typography sx={{ fontSize: 13, color: 'text.secondary', pr: 1, display: 'none', [CQ.md]: { display: 'block' } }}>{open.date}</Typography>
          </Stack>
          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2.5, py: 3, [CQ.lg]: { px: 5 } }}>
            <Box sx={{ maxWidth: 720, mx: 'auto' }}>
              <Typography ref={readHeading} component="h2" tabIndex={-1} sx={{ fontWeight: 800, fontSize: 22, lineHeight: 1.25, letterSpacing: '-0.02em', outline: 'none' }}>
                {open.subject}
              </Typography>
              {open.labels.length > 0 && (
                <Stack direction="row" sx={{ gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                  {open.labels.map((l) => (
                    <Chip key={l} size="sm" variant="soft" color={LABEL_COLOR[l]} label={l} />
                  ))}
                </Stack>
              )}
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mt: 2.5 }}>
                <Avatar variant="soft" color={open.labels[0] ? LABEL_COLOR[open.labels[0]] : 'neutral'}>
                  {initials(open.from)}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography noWrap sx={{ fontWeight: 700, fontSize: 15 }}>
                    {open.from}
                  </Typography>
                  <Typography noWrap sx={{ fontSize: 13, color: 'text.secondary' }}>
                    {open.email} · to {open.to ?? 'me'}
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ mt: 2.5, display: 'grid', gap: 1.5 }}>
                {open.body.map((p, i) => (
                  <Typography key={i} sx={{ fontSize: 15, lineHeight: 1.65 }}>
                    {p}
                  </Typography>
                ))}
              </Box>
              {open.attachments && (
                <Box sx={{ mt: 3 }}>
                  <Typography component="h3" sx={{ fontSize: 13, fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                    {open.attachments.length} {open.attachments.length === 1 ? 'attachment' : 'attachments'}
                  </Typography>
                  <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
                    {open.attachments.map((a) => (
                      <ButtonBase
                        key={a.name}
                        onClick={() => notify(`Downloading ${a.name}`)}
                        aria-label={`Download ${a.name}, ${a.size}`}
                        sx={{ gap: 1.25, px: 1.5, py: 1, borderRadius: '12px', border: 1, borderColor: 'divider', bgcolor: 'background.paper', textAlign: 'left', '&:hover': { borderColor: colorPalette[accent][500] }, '&:focus-visible': { outline: '2px solid', outlineColor: colorPalette[accent][500] } }}
                      >
                        <AttachFile fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{a.name}</Typography>
                          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{a.size}</Typography>
                        </Box>
                      </ButtonBase>
                    ))}
                  </Stack>
                </Box>
              )}
              {(open.replies ?? []).map((r, i) => (
                <Box key={i} sx={{ mt: 3, p: 2, borderRadius: '14px', border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                  <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 1 }}>
                    <Avatar size="xs" variant="solid" color={accent}>
                      {initials(r.from)}
                    </Avatar>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, flex: 1 }}>{r.from}</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{r.time}</Typography>
                  </Stack>
                  <Typography sx={{ fontSize: 14, lineHeight: 1.6 }}>{r.body}</Typography>
                </Box>
              ))}
              {open.folder !== 'sent' && open.folder !== 'drafts' && (
                <Box component="form" noValidate onSubmit={(e: React.FormEvent) => { e.preventDefault(); sendReply(); }} sx={{ mt: 3, p: 2, borderRadius: '14px', border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                  <TextField
                    label={`Reply to ${open.from}`}
                    color={accent}
                    multiline
                    minRows={3}
                    fullWidth
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply();
                    }}
                  />
                  <Stack direction="row" sx={{ mt: 1.5, alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Ctrl + Enter to send</Typography>
                    <Button type="submit" color={accent} startIcon={<Reply />} disabled={!reply.trim()}>
                      Send reply
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Stack spacing={1} sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 4 }}>
          <InboxOutlined sx={{ fontSize: 40, color: 'text.secondary' }} />
          <Typography component="h2" sx={{ fontWeight: 700 }}>
            No message selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a message from the list to read it here.
          </Typography>
        </Stack>
      )}
    </Box>
  );

  return (
    <Box sx={{ containerType: 'inline-size', height: '100%', minHeight: 560, bgcolor: 'background.default', color: 'text.primary' }}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box component="aside" aria-label="Mailbox" sx={{ display: 'none', [CQ.lg]: { display: 'flex' }, flexDirection: 'column', width: 236, flexShrink: 0, borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Brand accent={accent} />
          <Divider />
          {folders}
        </Box>
        {listPane}
        {readingPane}
      </Box>

      <Drawer open={navOpen} onClose={() => setNavOpen(false)} anchor="left" aria-label="Mailbox">
        <Box sx={{ width: 264 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
            <Brand accent={accent} />
            <IconButton aria-label="Close folders" onClick={() => setNavOpen(false)} sx={TAP}>
              <Close />
            </IconButton>
          </Stack>
          <Divider />
          {folders}
        </Box>
      </Drawer>

      <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} maxWidth="sm" fullWidth aria-labelledby={composeTitle}>
        <DialogTitle id={composeTitle}>New message</DialogTitle>
        <Box component="form" noValidate sx={{ display: 'contents' }} onSubmit={(e: React.FormEvent) => { e.preventDefault(); sendNew(); }}>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField label="To" type="email" color={accent} value={draft.to} onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))} fullWidth autoFocus placeholder="name@company.example" />
              <TextField label="Subject" color={accent} value={draft.subject} onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))} fullWidth />
              <TextField label="Message" color={accent} value={draft.body} onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} fullWidth multiline minRows={5} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="ghost" color="neutral" onClick={() => setComposeOpen(false)}>
              Discard
            </Button>
            <Button type="submit" color={accent} startIcon={<SendOutlined />} disabled={!draft.to.trim() || !draft.subject.trim()}>
              Send
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
        color="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}

function Brand({ accent }: { accent: Accent }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', px: 2.5, py: 2 }}>
      <Box aria-hidden sx={{ width: 30, height: 30, borderRadius: '10px', display: 'grid', placeItems: 'center', bgcolor: colorPalette[accent][600] }}>
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M2 4.5 8 9l6-4.5M2.5 3.5h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>Juniper Mail</Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.2 }}>{ME.email}</Typography>
      </Box>
    </Stack>
  );
}
