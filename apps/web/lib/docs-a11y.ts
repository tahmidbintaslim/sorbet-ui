// Accessibility notes per component, shown on each docs page. Server pages only.
// Every line describes behaviour that is in packages/react/src (or in the MUI
// component it wraps) and is covered by the component tests or the site's axe runs.
export const A11Y: Record<string, string[]> = {
  button: [
    'Renders a native <button>, or an <a> when href is set, so Enter and Space work without extra code.',
    'loading disables the button and sets aria-busy="true"; the label stays in the DOM, so the name does not change.',
    'Icon-only buttons (shape="square" or "circle") have no text: give them an aria-label.',
    'Keyboard focus draws a 3px ring in the button color.',
  ],
  'toggle-button-group': [
    'Each ToggleButton is a native button with aria-pressed, so its on/off state is announced.',
    'The group has role="group": name it with aria-label or aria-labelledby.',
    'Icon-only toggle buttons need their own aria-label.',
  ],
  'text-field': [
    'label is linked to the input; helperText is linked with aria-describedby.',
    'aria-label and aria-labelledby are forwarded to the <input>, so a field without a visible label can still be named.',
    'error sets aria-invalid on the input. Put the reason in helperText so it is read out.',
    'loading disables the field and sets aria-busy on the input; the spinner is labelled "Loading".',
  ],
  select: [
    'The trigger has role="combobox" and is named by the visible label, or by aria-label when there is no label.',
    'Enter, Space or the arrow keys open the list; arrow keys and type-ahead move between options; Escape closes it and returns focus.',
    'loading disables the select and sets aria-busy; the spinner is labelled "Loading".',
  ],
  autocomplete: [
    'The input has role="combobox" wired to a role="listbox" popup (MUI Autocomplete).',
    'Arrow keys move through options, Enter selects, Escape closes the list or clears the text.',
    'With multiple, each selected chip can be removed with Backspace or its delete button.',
    'label names the input; helperText is linked as its description.',
  ],
  'date-picker': [
    'The field is split into day, month and year sections: arrow keys change a section and move between them.',
    'The calendar button opens a dialog with a grid of days; arrow keys move by day and week, Escape closes it.',
    'label names the field; helperText is linked as its description.',
  ],
  checkbox: [
    'Renders a native checkbox input: Space toggles it.',
    'label wraps the input in a <label>, so the text is clickable. Without label, pass aria-label or aria-labelledby; both are forwarded to the input.',
    'indeterminate sets the native indeterminate state, which screen readers announce as "mixed".',
    'loading disables the checkbox and sets aria-busy.',
  ],
  radio: [
    'Renders a native radio input. Inside a RadioGroup the arrow keys move the selection and Tab enters and leaves the group.',
    'label wraps the input in a <label>. Without label, pass aria-label or aria-labelledby; both are forwarded to the input.',
    'Name the group with a FormLabel linked through aria-labelledby on RadioGroup.',
  ],
  switch: [
    'The input has role="switch": Space toggles it and the state is announced as on or off.',
    'label wraps the input in a <label>. Without label, pass aria-label, aria-labelledby or aria-describedby; they are forwarded to the input.',
    'loading disables the switch and sets aria-busy on its wrapper.',
  ],
  slider: [
    'Each thumb has role="slider" with aria-valuemin, aria-valuemax and aria-valuenow.',
    'Arrow keys change the value by one step, Page Up and Page Down by a larger step, Home and End jump to the ends.',
    'Name the slider with aria-label or aria-labelledby; for a range, name each thumb with getAriaLabel.',
  ],
  rating: [
    'Built from native radio inputs, one per star, each with a text label such as "3 Stars".',
    'Arrow keys change the rating. readOnly renders an image with the value as its name.',
    'With showLabel, the value text is in an aria-live="polite" region, so changes are announced.',
  ],
  avatar: [
    'With src, pass alt: it becomes the image name. Initials are read as text.',
    'loading sets aria-busy on the wrapper and the spinner is labelled "Loading".',
    'The status dot is visual only. If the status matters, say it in text next to the avatar.',
  ],
  badge: [
    'The badge content stays exposed to assistive tech in MUI v7 and v9 (v9 would otherwise hide it).',
    'A number alone has little meaning: include it in the name of the control it sits on, such as "Inbox, 4 unread".',
    'pulse does not animate when the visitor prefers reduced motion.',
  ],
  chip: [
    'A chip with onClick is a button in the tab order: Enter and Space activate it.',
    'A chip with onDelete can be removed with Backspace or Delete while it has focus.',
    'loading sets aria-busy and the spinner is labelled "Loading".',
  ],
  table: [
    'Renders a native <table>. caption, aria-label or aria-labelledby names both the table and its scroll region.',
    'The scroll container is focusable (role="region"), so keyboard users can scroll a wide table.',
    'With onRowClick, rows join the tab order and Enter or Space activates the focused row.',
    'Selection checkboxes are labelled "Select all rows" and "Select row <id>"; sorted columns set aria-sort.',
  ],
  tooltip: [
    'Shown on hover and on keyboard focus; Escape hides it.',
    'By default a string title becomes the child\'s aria-label. Use describeChild when the child already has a name and the tooltip adds detail.',
    'Tooltips are not reachable on touch without a long press: never put essential information only in a tooltip.',
  ],
  alert: [
    'Has role="alert", so it is announced when it appears. Do not use it for static page content that is not a status.',
    'Each color has its own icon, so meaning does not depend on color alone.',
    'onClose adds a close button labelled "Close". loading sets aria-busy.',
  ],
  progress: [
    'Has role="progressbar"; a determinate bar sets aria-valuenow from value.',
    'Always has an accessible name: aria-label or aria-labelledby when given, otherwise "Progress" ("Loading" when indeterminate).',
    'Give each bar on a page its own name so they can be told apart.',
  ],
  skeleton: [
    'Skeletons are aria-hidden: they are decoration.',
    'Mark the region that is loading with aria-busy="true" and add visually hidden text that says what is loading.',
    'The shimmer stops when the visitor prefers reduced motion.',
  ],
  snackbar: [
    'The message is in a role="alert" region, so it is announced when it opens.',
    'Escape dismisses it. Timers pause while it is hovered or focused, so there is time to reach its action.',
    'Do not put the only way to do something in a snackbar action: it disappears.',
  ],
  tabs: [
    'role="tablist" with role="tab" buttons and role="tabpanel" panels, linked with aria-controls and aria-labelledby.',
    'Arrow keys move between tabs (Up and Down when vertical); Home and End jump to the first and last tab.',
    'Panels are focusable, so keyboard users can reach panel content that has no controls of its own.',
    'Name the tab list with aria-label.',
  ],
  breadcrumbs: [
    'Renders a <nav> with an ordered list. Its name defaults to "Breadcrumb"; set aria-label when a page has more than one.',
    'The last item is text with aria-current="page", not a link.',
    'When collapsed, the ellipsis is a button named "Show N more items" that opens the hidden items in a menu.',
  ],
  pagination: [
    'Renders a <nav> named "Pagination" by default; set aria-label when a page has more than one.',
    'Each button has a name such as "Go to page 3"; the current page has aria-current="page".',
    'Previous and next are disabled, not removed, at the ends.',
  ],
  stepper: [
    'Renders an ordered list (<ol> with <li> steps), so the number of steps is announced.',
    'The current step has aria-current="step".',
    'Completed and error steps carry visually hidden text ("completed", "error"); change it with completedLabel and errorLabel.',
    'With onStepClick each step is a button and can be reached with Tab.',
  ],
  menu: [
    'The list has role="menu" and items have role="menuitem". aria-label or aria-labelledby is applied to the list.',
    'Arrow keys, Home, End and type-ahead move between items; Escape closes the menu and focus returns to the trigger.',
    'The trigger should set aria-haspopup="true", aria-controls and aria-expanded.',
  ],
  card: [
    'A card is a plain container with no role. Use a heading inside it so it shows up in the page outline.',
    'clickable only adds hover styles: wrap the content in CardActionArea (a real button) or render the card as a link so it works from the keyboard.',
    'loading sets aria-busy and the spinner is labelled "Loading".',
  ],
  accordion: [
    'Each summary is a button with aria-expanded. Enter and Space toggle the panel.',
    'The summary and its panel are linked automatically with id and aria-controls; the panel is a region labelled by its summary.',
    'A disabled item is skipped in the tab order.',
  ],
  dialog: [
    'role="dialog" with aria-modal. Name it with aria-labelledby pointing at the DialogTitle.',
    'Focus moves into the dialog on open, is trapped inside while it is open and returns to the trigger on close.',
    'Escape and a click on the backdrop call onClose.',
  ],
  drawer: [
    'The sheet has role="dialog" and aria-modal in MUI v7 and v9. aria-label or aria-labelledby is applied to it: always pass one.',
    'Focus moves into the drawer, is trapped while it is open and returns to the trigger on close.',
    'Escape and a click on the backdrop call onClose.',
  ],
  popover: [
    'Focus moves into the popover on open and returns to the trigger on close. Escape and a click outside call onClose.',
    'The panel has no role of its own. Set aria-haspopup="dialog" on the trigger, and give the content a heading or a label.',
    'For plain hints use Tooltip; for a list of actions use Menu.',
  ],
};
