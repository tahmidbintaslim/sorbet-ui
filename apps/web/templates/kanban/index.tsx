'use client';
// Kanban board: "Pollen", a fictional team's sprint. Four columns with WIP limits,
// cards you can drag (motion/react, no drag-and-drop library) or move from a menu,
// a card dialog with assignee, labels, due date and a checklist, inline "add card",
// and a person filter. Every move is announced in a live region. Sample data in
// ./data.ts. The board responds to its container: columns sit side by side when
// there is room and scroll sideways (with snap points) when there is not.
import * as React from 'react';
import { Box, ButtonBase, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import Add from '@mui/icons-material/Add';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import DragIndicator from '@mui/icons-material/DragIndicator';
import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined';
import EventOutlined from '@mui/icons-material/EventOutlined';
import NotesOutlined from '@mui/icons-material/NotesOutlined';
import Close from '@mui/icons-material/Close';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { motion, MotionConfig, useDragControls, useReducedMotion } from 'motion/react';
import { Avatar, Button, Checkbox, Chip, Dialog, Menu, MenuItem, Progress, Select, Snackbar, TextField, Tooltip } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import { COLUMNS, LABEL_COLOR, PEOPLE, TASKS, daysLeft, initials, personById, shortDate, type Accent, type ColumnId, type LabelId, type Task } from './data';

const CQ = { md: '@container (min-width: 760px)', lg: '@container (min-width: 1180px)' } as const;
const TAP = { '@media (pointer: coarse)': { minHeight: 44, minWidth: 44 } } as const;
const SR_ONLY = { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const;
const LABELS = Object.keys(LABEL_COLOR) as LabelId[];
const columnTitle = (id: ColumnId) => COLUMNS.find((c) => c.id === id)!.title;

function DueChip({ due, done }: { due: string; done: boolean }) {
  if (!due) return null;
  const left = daysLeft(due);
  const color = done ? 'neutral' : left < 0 ? 'danger' : left <= 2 ? 'warning' : 'neutral';
  const when = done ? shortDate(due) : left < 0 ? `${shortDate(due)}, overdue` : left === 0 ? 'Today' : left === 1 ? 'Tomorrow' : shortDate(due);
  return <Chip size="xs" variant={color === 'neutral' ? 'outlined' : 'soft'} color={color} icon={<EventOutlined />} label={when} aria-label={`Due ${when}`} />;
}

type CardProps = {
  task: Task;
  accent: Accent;
  onOpen: (t: Task) => void;
  onMove: (t: Task, to: ColumnId) => void;
  onDrop: (t: Task, x: number, y: number) => void;
  onHover: (x: number, y: number) => void;
  onDragState: (dragging: boolean) => void;
};

function Card({ task, accent, onOpen, onMove, onDrop, onHover, onDragState }: CardProps) {
  const controls = useDragControls();
  const reduce = useReducedMotion();
  const dragged = React.useRef(false);
  const [menu, setMenu] = React.useState<HTMLElement | null>(null);
  const person = personById(task.assignee);
  const done = task.checklist.filter((c) => c.done).length;
  return (
    <motion.li
      layout={!reduce}
      layoutId={task.id}
      drag
      dragControls={controls}
      dragListener={false}
      dragSnapToOrigin
      dragMomentum={false}
      whileDrag={{ scale: 1.03, rotate: reduce ? 0 : 2, zIndex: 20, cursor: 'grabbing' }}
      onDragStart={() => {
        dragged.current = true;
        onDragState(true);
      }}
      onDrag={(_, info) => onHover(info.point.x - window.scrollX, info.point.y - window.scrollY)}
      onDragEnd={(_, info) => {
        onDragState(false);
        onDrop(task, info.point.x - window.scrollX, info.point.y - window.scrollY);
        // The click that ends a drag must not open the card.
        setTimeout(() => (dragged.current = false), 0);
      }}
      style={{ listStyle: 'none', position: 'relative' }}
    >
      <Box
        onPointerDown={(e: React.PointerEvent) => {
          // Mouse and pen drag from anywhere on the card; touch uses the handle so the board still scrolls.
          if (e.pointerType !== 'touch' && !(e.target as HTMLElement).closest('[data-no-drag]')) controls.start(e);
        }}
        sx={{
          borderRadius: '14px',
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: '0 1px 2px rgba(15,23,42,.06)',
          cursor: 'grab',
          '&:hover': { borderColor: colorPalette[accent][400] },
          '&:focus-within': { borderColor: colorPalette[accent][500] },
        }}
      >
        <ButtonBase
          onClick={() => !dragged.current && onOpen(task)}
          aria-label={`${task.title}. ${person ? `Assigned to ${person.name}` : 'Unassigned'}. Open card ${task.id}`}
          sx={{ display: 'block', width: '100%', textAlign: 'left', p: 1.5, pr: 5, borderRadius: '14px', '&:focus-visible': { outline: '2px solid', outlineColor: colorPalette[accent][500], outlineOffset: 2 } }}
        >
          {task.labels.length > 0 && (
            <Stack direction="row" sx={{ gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
              {task.labels.map((l) => (
                <Chip key={l} size="xs" variant="soft" color={LABEL_COLOR[l]} label={l} />
              ))}
            </Stack>
          )}
          <Typography sx={{ fontSize: 14, fontWeight: 650, lineHeight: 1.35 }}>{task.title}</Typography>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mt: 1.25, flexWrap: 'wrap' }}>
            <Typography component="span" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>
              {task.id}
            </Typography>
            <DueChip due={task.due} done={task.column === 'done'} />
            {task.checklist.length > 0 && (
              <Box component="span" aria-label={`Checklist ${done} of ${task.checklist.length}`} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: 12, color: (t) => (done < task.checklist.length ? t.palette.text.secondary : colorPalette.success[t.palette.mode === 'dark' ? 300 : 700]) }}>
                <CheckBoxOutlined sx={{ fontSize: 15 }} />
                {done}/{task.checklist.length}
              </Box>
            )}
            {task.description && <NotesOutlined aria-label="Has a description" sx={{ fontSize: 15, color: 'text.secondary' }} />}
            <Box sx={{ flex: 1 }} />
            {person ? (
              <Avatar size="xs" variant="soft" color={person.color} aria-label={person.name}>
                {initials(person.name)}
              </Avatar>
            ) : (
              <Typography component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>
                Unassigned
              </Typography>
            )}
          </Stack>
        </ButtonBase>
        <Stack data-no-drag sx={{ position: 'absolute', top: 4, right: 4, alignItems: 'center' }}>
          <IconButton size="small" aria-label={`Move ${task.id}`} aria-haspopup="menu" aria-expanded={!!menu} onClick={(e) => setMenu(e.currentTarget)} sx={TAP}>
            <MoreHoriz fontSize="small" />
          </IconButton>
          <Box
            aria-hidden
            onPointerDown={(e: React.PointerEvent) => controls.start(e)}
            sx={{ display: 'none', '@media (pointer: coarse)': { display: 'grid' }, placeItems: 'center', width: 36, height: 36, color: 'text.secondary', touchAction: 'none', cursor: 'grab' }}
          >
            <DragIndicator fontSize="small" />
          </Box>
        </Stack>
      </Box>
      <Menu anchorEl={menu} open={!!menu} onClose={() => setMenu(null)} size="sm" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {COLUMNS.filter((c) => c.id !== task.column).map((c) => (
          <MenuItem
            key={c.id}
            onClick={() => {
              setMenu(null);
              onMove(task, c.id);
            }}
          >
            Move to {c.title}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            setMenu(null);
            onOpen(task);
          }}
        >
          Open card
        </MenuItem>
      </Menu>
    </motion.li>
  );
}

export default function Kanban({ accent = 'success' }: { accent?: Accent }) {
  const [tasks, setTasks] = React.useState<Task[]>(TASKS);
  const [who, setWho] = React.useState<string | null>(null);
  const [announce, setAnnounce] = React.useState('');
  const [over, setOver] = React.useState<ColumnId | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [adding, setAdding] = React.useState<ColumnId | null>(null);
  const [newTitle, setNewTitle] = React.useState('');
  const [editing, setEditing] = React.useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newItem, setNewItem] = React.useState('');
  const [toast, setToast] = React.useState<{ id: number; message: string; open: boolean } | null>(null);
  const notify = (message: string) => setToast((t) => ({ id: (t?.id ?? 0) + 1, message, open: true }));
  const columnEls = React.useRef<Partial<Record<ColumnId, HTMLElement | null>>>({});
  const dialogTitle = React.useId();

  const columnAt = (x: number, y: number) =>
    COLUMNS.find((c) => {
      const r = columnEls.current[c.id]?.getBoundingClientRect();
      return r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    })?.id ?? null;

  const move = (task: Task, to: ColumnId) => {
    if (task.column === to) return;
    setTasks((all) => [...all.filter((t) => t.id !== task.id), { ...task, column: to }]);
    const col = COLUMNS.find((c) => c.id === to)!;
    const count = tasks.filter((t) => t.column === to).length + 1;
    const message = `${task.id} moved from ${columnTitle(task.column)} to ${col.title}.${col.limit && count > col.limit ? ` ${col.title} is over its limit of ${col.limit}.` : ''}`;
    setAnnounce(message);
    if (col.limit && count > col.limit) notify(`${col.title} is over its limit of ${col.limit}`);
  };

  const add = (column: ColumnId) => {
    const title = newTitle.trim();
    if (!title) return;
    const id = `PL-${Math.max(...tasks.map((t) => Number(t.id.slice(3)))) + 1}`;
    setTasks((all) => [...all, { id, column, title, description: '', assignee: who, labels: [], due: '', checklist: [] }]);
    setNewTitle('');
    setAnnounce(`${id} added to ${columnTitle(column)}.`);
  };

  const openCard = (t: Task) => {
    setEditing({ ...t, checklist: t.checklist.map((c) => ({ ...c })) });
    setNewItem('');
    setDialogOpen(true);
  };
  const save = () => {
    if (!editing || !editing.title.trim()) return;
    setTasks((all) => all.map((t) => (t.id === editing.id ? { ...editing, title: editing.title.trim() } : t)));
    setDialogOpen(false);
    notify(`${editing.id} saved`);
  };
  const remove = () => {
    if (!editing) return;
    setTasks((all) => all.filter((t) => t.id !== editing.id));
    setDialogOpen(false);
    setAnnounce(`${editing.id} deleted.`);
    notify(`${editing.id} deleted`);
  };
  const patch = (p: Partial<Task>) => setEditing((e) => (e ? { ...e, ...p } : e));

  const shown = tasks.filter((t) => !who || t.assignee === who);
  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.column === 'done').length;

  return (
    <MotionConfig reducedMotion="user">
      <Box sx={{ containerType: 'inline-size', height: '100%', minHeight: 560, display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
        {/* Header */}
        <Box component="header" sx={{ px: 2, pt: 2, pb: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', [CQ.md]: { px: 3 } }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Box aria-hidden sx={{ width: 32, height: 32, borderRadius: '10px', display: 'grid', placeItems: 'center', bgcolor: colorPalette[accent][600], flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M9 16V8M9 8C9 5 6.5 3 3 3c0 3.5 2.5 5 6 5Zm0 0c0-3 2.5-5 6-5 0 3.5-2.5 5-6 5Z" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Box>
            <Box sx={{ flex: 1, minWidth: 180 }}>
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Sprint 14 · Spring release
              </Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                Pollen app · {doneCount} of {total} cards done
              </Typography>
            </Box>
            <Button
              size="sm"
              color={accent}
              startIcon={<Add />}
              onClick={() => {
                setAdding('todo');
                setNewTitle('');
              }}
            >
              New card
            </Button>
          </Stack>
          <Stack direction="row" role="group" aria-label="Filter by person" sx={{ alignItems: 'center', gap: 0.75, mt: 1.5, flexWrap: 'wrap' }}>
            <Button size="sm" variant={who === null ? 'soft' : 'ghost'} color={accent} aria-pressed={who === null} onClick={() => setWho(null)} sx={TAP}>
              Everyone
            </Button>
            {PEOPLE.map((p) => {
              const on = who === p.id;
              return (
                <Tooltip key={p.id} title={`${p.name}, ${p.role}`}>
                  <ButtonBase
                    aria-pressed={on}
                    aria-label={`Only ${p.name}'s cards`}
                    onClick={() => setWho(on ? null : p.id)}
                    sx={{ borderRadius: '50%', p: '2px', border: 2, borderColor: on ? colorPalette[accent][500] : 'transparent', '&:focus-visible': { outline: '2px solid', outlineColor: colorPalette[accent][500], outlineOffset: 2 }, ...TAP }}
                  >
                    <Avatar size="sm" variant={on ? 'solid' : 'soft'} color={p.color}>
                      {initials(p.name)}
                    </Avatar>
                  </ButtonBase>
                </Tooltip>
              );
            })}
            {who && (
              <Typography sx={{ fontSize: 13, color: 'text.secondary', ml: 0.5 }}>
                {shown.length} {shown.length === 1 ? 'card' : 'cards'} for {personById(who)!.name}
              </Typography>
            )}
          </Stack>
        </Box>

        {/* Board */}
        <Box
          role="region"
          aria-label="Board"
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            gap: 2,
            p: 2,
            overflowX: 'auto',
            overflowY: 'auto',
            scrollSnapType: 'x mandatory',
            scrollPaddingInline: 16,
            alignItems: 'flex-start',
            [CQ.md]: { px: 3 },
            [CQ.lg]: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', overflowX: 'visible' },
          }}
        >
          {COLUMNS.map((c) => {
            const mine = shown.filter((t) => t.column === c.id);
            const all = tasks.filter((t) => t.column === c.id).length;
            const overLimit = !!c.limit && all > c.limit;
            const headingId = `kanban-col-${c.id}`;
            return (
              <Box
                key={c.id}
                ref={(el: HTMLElement | null) => {
                  columnEls.current[c.id] = el;
                }}
                component="section"
                aria-labelledby={headingId}
                data-testid={`kanban-column-${c.id}`}
                sx={{
                  flex: '0 0 min(280px, 82cqw)',
                  scrollSnapAlign: 'start',
                  minWidth: 0,
                  borderRadius: '18px',
                  p: 1.25,
                  bgcolor: over === c.id && dragging ? colorPalette[accent].alpha20 : 'action.hover',
                  outline: over === c.id && dragging ? `2px dashed ${colorPalette[accent][500]}` : 'none',
                  transition: 'background-color .15s',
                }}
              >
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 0.75, pt: 0.5, pb: 1.25 }}>
                  <Box aria-hidden sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colorPalette[c.color][500] }} />
                  <Typography id={headingId} component="h3" sx={{ fontWeight: 700, fontSize: 14, flex: 1 }}>
                    {c.title}
                  </Typography>
                  <Chip
                    size="xs"
                    variant="soft"
                    color={overLimit ? 'danger' : 'neutral'}
                    label={c.limit ? `${all} / ${c.limit}` : all}
                    aria-label={c.limit ? `${all} cards, limit ${c.limit}${overLimit ? ', over the limit' : ''}` : `${all} cards`}
                  />
                </Stack>
                <Box component="ul" aria-label={`${c.title} cards`} sx={{ m: 0, p: 0, display: 'grid', gap: 1 }}>
                  {mine.map((t) => (
                    <Card
                      key={t.id}
                      task={t}
                      accent={accent}
                      onOpen={openCard}
                      onMove={move}
                      onHover={(x, y) => setOver(columnAt(x, y))}
                      onDragState={(d) => {
                        setDragging(d);
                        if (!d) setOver(null);
                      }}
                      onDrop={(task, x, y) => {
                        const to = columnAt(x, y);
                        if (to) move(task, to);
                      }}
                    />
                  ))}
                </Box>
                {mine.length === 0 && (
                  <Typography sx={{ fontSize: 13, color: 'text.secondary', textAlign: 'center', py: 2, border: 1, borderStyle: 'dashed', borderColor: 'divider', borderRadius: '12px' }}>
                    {who ? 'No cards for this person' : 'Drop cards here'}
                  </Typography>
                )}
                {adding === c.id ? (
                  <Box component="form" noValidate onSubmit={(e: React.FormEvent) => { e.preventDefault(); add(c.id); }} sx={{ mt: 1 }}>
                    <TextField
                      size="sm"
                      color={accent}
                      fullWidth
                      autoFocus
                      placeholder="What needs doing?"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Escape' && setAdding(null)}
                      slotProps={{ htmlInput: { 'aria-label': `New card title in ${c.title}` } }}
                    />
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button size="sm" type="submit" color={accent} disabled={!newTitle.trim()}>
                        Add card
                      </Button>
                      <IconButton size="small" aria-label="Cancel adding a card" onClick={() => setAdding(null)} sx={TAP}>
                        <Close fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    color="neutral"
                    startIcon={<Add />}
                    fullWidth
                    onClick={() => {
                      setAdding(c.id);
                      setNewTitle('');
                    }}
                    aria-label={`Add a card to ${c.title}`}
                    sx={{ mt: 1, justifyContent: 'flex-start', ...TAP }}
                  >
                    Add a card
                  </Button>
                )}
              </Box>
            );
          })}
        </Box>

        <Box role="status" aria-live="polite" sx={SR_ONLY}>
          {announce}
        </Box>

        {/* Card dialog: edits a copy, Save writes it back. */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth aria-labelledby={dialogTitle} slotProps={{ transition: { onExited: () => setEditing(null) } }}>
          {editing && (
            <Box component="form" noValidate sx={{ display: 'contents' }} onSubmit={(e: React.FormEvent) => { e.preventDefault(); save(); }}>
              <DialogTitle id={dialogTitle} sx={{ pr: 7 }}>
                {editing.id} · {columnTitle(editing.column)}
                <IconButton aria-label="Close" onClick={() => setDialogOpen(false)} sx={{ position: 'absolute', right: 12, top: 12, ...TAP }}>
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <Stack spacing={2.25} sx={{ pt: 1 }}>
                  <TextField label="Title" color={accent} fullWidth value={editing.title} onChange={(e) => patch({ title: e.target.value })} error={!editing.title.trim()} helperText={!editing.title.trim() ? 'A card needs a title' : ' '} />
                  <TextField label="Description" color={accent} fullWidth multiline minRows={2} value={editing.description} onChange={(e) => patch({ description: e.target.value })} />
                  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                    <Select label="Assignee" color={accent} value={editing.assignee ?? ''} onChange={(e) => patch({ assignee: e.target.value || null })} displayEmpty SelectDisplayProps={{ 'aria-label': 'Assignee' }}>
                      <MenuItem value="">Unassigned</MenuItem>
                      {PEOPLE.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <TextField label="Due date" type="date" color={accent} fullWidth value={editing.due} onChange={(e) => patch({ due: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
                  </Box>
                  <Box>
                    <Typography id="kanban-labels" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
                      Labels
                    </Typography>
                    <Stack direction="row" role="group" aria-labelledby="kanban-labels" sx={{ gap: 0.75, flexWrap: 'wrap' }}>
                      {LABELS.map((l) => {
                        const on = editing.labels.includes(l);
                        return (
                          <Chip
                            key={l}
                            size="sm"
                            variant={on ? 'soft' : 'outlined'}
                            color={on ? LABEL_COLOR[l] : 'neutral'}
                            label={l}
                            clickable
                            aria-pressed={on}
                            onClick={() => patch({ labels: on ? editing.labels.filter((x) => x !== l) : [...editing.labels, l] })}
                          />
                        );
                      })}
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Checklist</Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                        {editing.checklist.filter((c) => c.done).length} of {editing.checklist.length}
                      </Typography>
                    </Stack>
                    {editing.checklist.length > 0 && (
                      <Progress size="sm" color={accent} value={(editing.checklist.filter((c) => c.done).length / editing.checklist.length) * 100} aria-label="Checklist progress" sx={{ mb: 1 }} />
                    )}
                    <Box sx={{ display: 'grid' }}>
                      {editing.checklist.map((item) => (
                        <Stack key={item.id} direction="row" sx={{ alignItems: 'center' }}>
                          <Checkbox
                            size="sm"
                            color={accent}
                            label={item.text}
                            checked={item.done}
                            onChange={(e) => patch({ checklist: editing.checklist.map((c) => (c.id === item.id ? { ...c, done: e.target.checked } : c)) })}
                            sx={{ flex: 1, '& .MuiFormControlLabel-label': { textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'text.secondary' : 'text.primary' } }}
                          />
                          <IconButton size="small" aria-label={`Remove "${item.text}"`} onClick={() => patch({ checklist: editing.checklist.filter((c) => c.id !== item.id) })} sx={TAP}>
                            <Close fontSize="small" />
                          </IconButton>
                        </Stack>
                      ))}
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <TextField
                        size="sm"
                        color={accent}
                        fullWidth
                        placeholder="Add an item"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newItem.trim()) {
                            e.preventDefault();
                            patch({ checklist: [...editing.checklist, { id: `c${Date.now()}`, text: newItem.trim(), done: false }] });
                            setNewItem('');
                          }
                        }}
                        slotProps={{ htmlInput: { 'aria-label': 'New checklist item' } }}
                      />
                      <Button
                        size="sm"
                        variant="soft"
                        color={accent}
                        disabled={!newItem.trim()}
                        onClick={() => {
                          patch({ checklist: [...editing.checklist, { id: `c${Date.now()}`, text: newItem.trim(), done: false }] });
                          setNewItem('');
                        }}
                      >
                        Add
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'space-between' }}>
                <Button variant="ghost" color="danger" startIcon={<DeleteOutlined />} onClick={remove}>
                  Delete
                </Button>
                <Stack direction="row" spacing={1}>
                  <Button variant="ghost" color="neutral" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" color={accent} disabled={!editing.title.trim()}>
                    Save
                  </Button>
                </Stack>
              </DialogActions>
            </Box>
          )}
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
    </MotionConfig>
  );
}
