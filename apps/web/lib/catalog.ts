// Server-safe component catalog (no client code), used by pages, nav and static params.
// scripts/gen-docs.mjs reads it too: `imports` and `types` pick what the API tables document.
export const GROUPS = ['Inputs', 'Data display', 'Feedback', 'Navigation', 'Surfaces', 'Overlays'] as const;
export type Group = (typeof GROUPS)[number];

export interface CatalogEntry {
  slug: string;
  name: string;
  description: string;
  group: Group;
  /** Exports shown in the import line; components among them get an API table. */
  imports: string[];
  /** Data types (interfaces) documented after the components. */
  types?: string[];
  /** Slugs of related components. */
  related: string[];
}

export const CATALOG: CatalogEntry[] = [
  // Inputs
  {
    slug: 'button',
    name: 'Button',
    description: 'Solid, soft, outlined, ghost and plain buttons in seven colors and five sizes.',
    group: 'Inputs',
    imports: ['Button'],
    related: ['toggle-button-group', 'menu', 'dialog'],
  },
  {
    slug: 'toggle-button-group',
    name: 'ToggleButtonGroup',
    description: 'A row of toggle buttons for picking one or several options.',
    group: 'Inputs',
    imports: ['ToggleButtonGroup', 'ToggleButton'],
    related: ['button', 'tabs', 'radio'],
  },
  {
    slug: 'text-field',
    name: 'TextField',
    description: 'Text input with label, helper text and start or end icons.',
    group: 'Inputs',
    imports: ['TextField'],
    related: ['select', 'autocomplete', 'date-picker'],
  },
  {
    slug: 'select',
    name: 'Select',
    description: 'Dropdown select that takes MenuItem children.',
    group: 'Inputs',
    imports: ['Select', 'MenuItem'],
    related: ['autocomplete', 'menu', 'radio'],
  },
  {
    slug: 'autocomplete',
    name: 'Autocomplete',
    description: 'Searchable combobox with option groups, descriptions and multi-select chips.',
    group: 'Inputs',
    imports: ['Autocomplete'],
    types: ['AutocompleteOption'],
    related: ['select', 'text-field', 'chip'],
  },
  {
    slug: 'date-picker',
    name: 'DatePicker',
    description: 'Calendar date input built on MUI X, with dayjs re-exported for values.',
    group: 'Inputs',
    imports: ['DatePicker', 'dayjs'],
    related: ['text-field', 'select', 'popover'],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description: 'Checkbox with an inline label.',
    group: 'Inputs',
    imports: ['Checkbox'],
    related: ['switch', 'radio', 'table'],
  },
  {
    slug: 'radio',
    name: 'Radio',
    description: 'Radio button with an inline label.',
    group: 'Inputs',
    imports: ['Radio'],
    related: ['checkbox', 'toggle-button-group', 'select'],
  },
  {
    slug: 'switch',
    name: 'Switch',
    description: 'On/off toggle with an inline label.',
    group: 'Inputs',
    imports: ['Switch'],
    related: ['checkbox', 'toggle-button-group', 'radio'],
  },
  {
    slug: 'slider',
    name: 'Slider',
    description: 'Slider for one value or a range, with optional value and min/max labels.',
    group: 'Inputs',
    imports: ['Slider'],
    related: ['rating', 'progress', 'text-field'],
  },
  {
    slug: 'rating',
    name: 'Rating',
    description: 'Star rating input with half steps and a value label.',
    group: 'Inputs',
    imports: ['Rating'],
    related: ['slider', 'radio', 'chip'],
  },
  // Data display
  {
    slug: 'avatar',
    name: 'Avatar',
    description: 'User avatar with initials or an image, and a status dot.',
    group: 'Data display',
    imports: ['Avatar'],
    related: ['badge', 'chip', 'tooltip'],
  },
  {
    slug: 'badge',
    name: 'Badge',
    description: 'A count or marker attached to another element.',
    group: 'Data display',
    imports: ['Badge'],
    related: ['avatar', 'chip', 'alert'],
  },
  {
    slug: 'chip',
    name: 'Chip',
    description: 'Compact label for tags and filters.',
    group: 'Data display',
    imports: ['Chip'],
    related: ['badge', 'autocomplete', 'toggle-button-group'],
  },
  {
    slug: 'table',
    name: 'Table',
    description: 'Data table driven by column definitions, with sorting, selection and pagination.',
    group: 'Data display',
    imports: ['Table'],
    types: ['TableColumn'],
    related: ['pagination', 'checkbox', 'skeleton'],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description: 'Hover or focus hint.',
    group: 'Data display',
    imports: ['Tooltip'],
    related: ['popover', 'button', 'badge'],
  },
  // Feedback
  {
    slug: 'alert',
    name: 'Alert',
    description: 'Inline status message.',
    group: 'Feedback',
    imports: ['Alert'],
    related: ['snackbar', 'dialog', 'badge'],
  },
  {
    slug: 'progress',
    name: 'Progress',
    description: 'Linear and circular progress, determinate or indeterminate.',
    group: 'Feedback',
    imports: ['Progress'],
    related: ['skeleton', 'slider', 'stepper'],
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    description: 'Loading placeholders that stay still for reduced motion.',
    group: 'Feedback',
    imports: ['Skeleton'],
    related: ['progress', 'card', 'table'],
  },
  {
    slug: 'snackbar',
    name: 'Snackbar',
    description: 'Brief, non-blocking message at the edge of the screen.',
    group: 'Feedback',
    imports: ['Snackbar'],
    related: ['alert', 'dialog', 'button'],
  },
  // Navigation
  {
    slug: 'tabs',
    name: 'Tabs',
    description: 'Tab list with panels. Pass tabs as data.',
    group: 'Navigation',
    imports: ['Tabs'],
    types: ['TabItem'],
    related: ['toggle-button-group', 'accordion', 'stepper'],
  },
  {
    slug: 'breadcrumbs',
    name: 'Breadcrumbs',
    description: 'The path to the current page. Pass items as data; long paths collapse.',
    group: 'Navigation',
    imports: ['Breadcrumbs'],
    types: ['BreadcrumbItem'],
    related: ['tabs', 'pagination', 'menu'],
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    description: 'Page navigation.',
    group: 'Navigation',
    imports: ['Pagination'],
    related: ['table', 'breadcrumbs', 'tabs'],
  },
  {
    slug: 'stepper',
    name: 'Stepper',
    description: 'Progress through numbered steps. Pass steps as data.',
    group: 'Navigation',
    imports: ['Stepper'],
    types: ['StepperStep'],
    related: ['tabs', 'progress', 'breadcrumbs'],
  },
  {
    slug: 'menu',
    name: 'Menu',
    description: 'Keyboard-navigable action menu anchored to a trigger.',
    group: 'Navigation',
    imports: ['Menu', 'MenuItem'],
    related: ['select', 'popover', 'button'],
  },
  // Surfaces
  {
    slug: 'card',
    name: 'Card',
    description: 'Surface container for grouped content.',
    group: 'Surfaces',
    imports: ['Card'],
    related: ['accordion', 'skeleton', 'dialog'],
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    description: 'Disclosure panels with a summary button and a labelled region.',
    group: 'Surfaces',
    imports: ['Accordion', 'AccordionSummary', 'AccordionDetails'],
    related: ['tabs', 'card', 'stepper'],
  },
  // Overlays
  {
    slug: 'dialog',
    name: 'Dialog',
    description: 'Modal dialog with title, content and actions slots.',
    group: 'Overlays',
    imports: ['Dialog', 'DialogTitle', 'DialogContent', 'DialogActions'],
    related: ['drawer', 'popover', 'snackbar'],
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    description: 'Side sheet that slides in from any edge.',
    group: 'Overlays',
    imports: ['Drawer'],
    related: ['dialog', 'menu', 'popover'],
  },
  {
    slug: 'popover',
    name: 'Popover',
    description: 'Floating panel anchored to an element.',
    group: 'Overlays',
    imports: ['Popover'],
    related: ['tooltip', 'menu', 'dialog'],
  },
];

export const getEntry = (slug: string) => CATALOG.find((c) => c.slug === slug);

/** Catalog entries by group, in GROUPS order. */
export const catalogByGroup = () => GROUPS.map((group) => ({ group, entries: CATALOG.filter((c) => c.group === group) }));
