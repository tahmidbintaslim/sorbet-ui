// Server-safe component catalog (no client code), used by pages, nav and static params.
export interface CatalogEntry {
  slug: string;
  name: string;
  description: string;
  imports: string[];
}

export const CATALOG: CatalogEntry[] = [
  {
    slug: 'button',
    name: 'Button',
    description: 'Solid, soft, outlined, ghost and plain buttons in seven colors and five sizes.',
    imports: ['Button'],
  },
  {
    slug: 'text-field',
    name: 'TextField',
    description: 'Text input with label, helper text and start or end icons.',
    imports: ['TextField'],
  },
  {
    slug: 'select',
    name: 'Select',
    description: 'Dropdown select that takes MenuItem children.',
    imports: ['Select'],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description: 'Checkbox with an inline label.',
    imports: ['Checkbox'],
  },
  {
    slug: 'radio',
    name: 'Radio',
    description: 'Radio button with an inline label.',
    imports: ['Radio'],
  },
  {
    slug: 'switch',
    name: 'Switch',
    description: 'On/off toggle with an inline label.',
    imports: ['Switch'],
  },
  {
    slug: 'slider',
    name: 'Slider',
    description: 'Range slider.',
    imports: ['Slider'],
  },
  {
    slug: 'rating',
    name: 'Rating',
    description: 'Star rating input.',
    imports: ['Rating'],
  },
  {
    slug: 'card',
    name: 'Card',
    description: 'Surface container.',
    imports: ['Card'],
  },
  {
    slug: 'chip',
    name: 'Chip',
    description: 'Compact label for tags and filters.',
    imports: ['Chip'],
  },
  {
    slug: 'alert',
    name: 'Alert',
    description: 'Inline status message.',
    imports: ['Alert'],
  },
  {
    slug: 'avatar-badge',
    name: 'Avatar and Badge',
    description: 'User avatar with a status dot, and a badge with a count.',
    imports: ['Avatar', 'Badge'],
  },
  {
    slug: 'progress',
    name: 'Progress',
    description: 'Linear progress bar.',
    imports: ['Progress'],
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    description: 'Page navigation.',
    imports: ['Pagination'],
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    description: 'Tab list with panels. Pass tabs as data.',
    imports: ['Tabs'],
  },
  {
    slug: 'table',
    name: 'Table',
    description: 'Data table driven by column definitions.',
    imports: ['Table'],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description: 'Hover or focus hint.',
    imports: ['Tooltip'],
  },
  {
    slug: 'autocomplete',
    name: 'Autocomplete',
    description: 'Searchable combobox with option groups, descriptions and multi-select chips.',
    imports: ['Autocomplete'],
  },
  {
    slug: 'date-picker',
    name: 'DatePicker',
    description: 'Calendar date input built on MUI X, with dayjs re-exported for values.',
    imports: ['DatePicker', 'dayjs'],
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    description: 'Modal dialog with title, content and actions slots.',
    imports: ['Dialog', 'DialogTitle', 'DialogContent', 'DialogActions'],
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    description: 'Side sheet that slides in from any edge.',
    imports: ['Drawer'],
  },
  {
    slug: 'popover',
    name: 'Popover',
    description: 'Floating panel anchored to an element.',
    imports: ['Popover'],
  },
  {
    slug: 'snackbar',
    name: 'Snackbar',
    description: 'Brief, non-blocking message at the edge of the screen.',
    imports: ['Snackbar'],
  },
];

export const getEntry = (slug: string) => CATALOG.find((c) => c.slug === slug);
