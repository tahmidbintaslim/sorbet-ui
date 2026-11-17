// Sample board for "Pollen", a fictional team shipping a plant-care app.
// Every person, card and date is made up.

export type Accent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type ColumnId = 'todo' | 'doing' | 'review' | 'done';
export type LabelId = 'Design' | 'iOS' | 'Android' | 'Backend' | 'Bug' | 'Research';

export type Person = { id: string; name: string; role: string; color: Accent };
export type CheckItem = { id: string; text: string; done: boolean };
export type Task = {
  id: string;
  column: ColumnId;
  title: string;
  description: string;
  assignee: string | null;
  labels: LabelId[];
  /** ISO date (yyyy-mm-dd) or empty. */
  due: string;
  checklist: CheckItem[];
};

export const COLUMNS: { id: ColumnId; title: string; limit?: number; color: Accent }[] = [
  { id: 'todo', title: 'To do', color: 'info' },
  { id: 'doing', title: 'In progress', limit: 3, color: 'warning' },
  { id: 'review', title: 'Review', limit: 2, color: 'secondary' },
  { id: 'done', title: 'Done', color: 'success' },
];

export const LABEL_COLOR: Record<LabelId, Accent> = {
  Design: 'secondary',
  iOS: 'primary',
  Android: 'success',
  Backend: 'warning',
  Bug: 'danger',
  Research: 'info',
};

export const PEOPLE: Person[] = [
  { id: 'ab', name: 'Ada Brennan', role: 'Product design', color: 'secondary' },
  { id: 'ko', name: 'Kofi Owusu', role: 'iOS', color: 'primary' },
  { id: 'lm', name: 'Lucía Marín', role: 'Android', color: 'success' },
  { id: 'rh', name: 'Rafael Holm', role: 'Backend', color: 'warning' },
  { id: 'sn', name: 'Saanvi Nair', role: 'Research', color: 'info' },
];

export const personById = (id: string | null) => PEOPLE.find((p) => p.id === id) ?? null;
export const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

/** "Today" in the sample, fixed so due-date badges never drift. */
export const TODAY = '2026-11-17';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const shortDate = (iso: string) => {
  const [, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}`;
};
/** Days from the sample's today; negative is overdue. */
export const daysLeft = (iso: string) => Math.round((Date.parse(iso) - Date.parse(TODAY)) / 86_400_000);

let n = 0;
const items = (...list: [string, boolean][]): CheckItem[] => list.map(([text, done]) => ({ id: `c${++n}`, text, done }));

export const TASKS: Task[] = [
  {
    id: 'PL-41',
    column: 'todo',
    title: 'Watering reminders: snooze options',
    description: 'Let people snooze a reminder for an hour, until this evening or until tomorrow morning.',
    assignee: 'ko',
    labels: ['iOS'],
    due: '2026-11-24',
    checklist: items(['Agree on the three options', false], ['Notification actions', false], ['Settings screen copy', false]),
  },
  {
    id: 'PL-42',
    column: 'todo',
    title: 'Interview five people who own 10+ plants',
    description: 'Find out how they keep track of repotting and fertilizing today.',
    assignee: 'sn',
    labels: ['Research'],
    due: '2026-11-21',
    checklist: items(['Screener survey', true], ['Book sessions', false], ['Synthesis notes', false]),
  },
  {
    id: 'PL-43',
    column: 'todo',
    title: 'Light meter crashes on older Android phones',
    description: 'Crash when the camera permission is granted after the screen opens.',
    assignee: 'lm',
    labels: ['Android', 'Bug'],
    due: '2026-11-19',
    checklist: [],
  },
  {
    id: 'PL-44',
    column: 'todo',
    title: 'Empty state for a new garden',
    description: 'Illustration and two suggested first plants.',
    assignee: null,
    labels: ['Design'],
    due: '',
    checklist: [],
  },
  {
    id: 'PL-37',
    column: 'doing',
    title: 'Plant detail screen redesign',
    description: 'Bigger photo, care schedule as a timeline, and the light needs moved above the fold.',
    assignee: 'ab',
    labels: ['Design'],
    due: '2026-11-18',
    checklist: items(['Wireframes', true], ['Visual design', true], ['Dark theme pass', false], ['Hand-off notes', false]),
  },
  {
    id: 'PL-38',
    column: 'doing',
    title: 'Sync schedules across devices',
    description: 'Conflict rule: the most recent edit wins, per plant.',
    assignee: 'rh',
    labels: ['Backend'],
    due: '2026-11-26',
    checklist: items(['Schema change', true], ['Sync endpoint', false], ['Migration for old clients', false]),
  },
  {
    id: 'PL-39',
    column: 'doing',
    title: 'Home screen widget',
    description: 'Shows the next three plants that need water.',
    assignee: 'ko',
    labels: ['iOS'],
    due: '2026-11-28',
    checklist: items(['Small size', true], ['Medium size', false]),
  },
  {
    id: 'PL-35',
    column: 'review',
    title: 'Photo upload retries on a bad connection',
    description: 'Queue uploads and retry with backoff; show a small badge while pending.',
    assignee: 'lm',
    labels: ['Android'],
    due: '2026-11-17',
    checklist: items(['Queue', true], ['Backoff', true], ['Pending badge', true]),
  },
  {
    id: 'PL-36',
    column: 'review',
    title: 'Care tips API pagination',
    description: 'Cursor-based, 20 per page.',
    assignee: 'rh',
    labels: ['Backend'],
    due: '2026-11-15',
    checklist: items(['Cursor encoding', true], ['Docs', false]),
  },
  {
    id: 'PL-31',
    column: 'done',
    title: 'Onboarding: pick your plants',
    description: 'Search the catalog or scan a label.',
    assignee: 'ab',
    labels: ['Design', 'iOS'],
    due: '2026-11-10',
    checklist: items(['Search', true], ['Scan', true]),
  },
  {
    id: 'PL-32',
    column: 'done',
    title: 'Usability test: reminder settings',
    description: 'Six sessions. Main finding: people expect reminders per room, not only per plant.',
    assignee: 'sn',
    labels: ['Research'],
    due: '2026-11-12',
    checklist: [],
  },
];
