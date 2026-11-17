// Sample mailbox for Maya Okafor at Juniper Studio (a fictional design studio).
// People, companies and addresses are made up; every address ends in .example.

export type Accent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type FolderId = 'inbox' | 'starred' | 'sent' | 'drafts' | 'archive' | 'trash';
export type Label = 'Clients' | 'Team' | 'Finance' | 'Travel';

export type Reply = { from: string; time: string; body: string };
export type Message = {
  id: string;
  folder: Exclude<FolderId, 'starred'>;
  from: string;
  email: string;
  subject: string;
  /** Paragraphs. The first one doubles as the preview line in the list. */
  body: string[];
  /** Short label for the list ("9:42 AM", "Tue"). */
  time: string;
  /** Long form for the reading pane. */
  date: string;
  unread: boolean;
  starred: boolean;
  labels: Label[];
  /** Recipient, for sent mail and drafts. */
  to?: string;
  attachments?: { name: string; size: string }[];
  replies?: Reply[];
};

export const ME = { name: 'Maya Okafor', email: 'maya@juniperstudio.example' };

export const LABEL_COLOR = { Clients: 'primary', Team: 'success', Finance: 'warning', Travel: 'secondary' } as const;

export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

export const MESSAGES: Message[] = [
  {
    id: 'm1',
    folder: 'inbox',
    from: 'Tomas Lindqvist',
    email: 'tomas@harborcoffee.example',
    subject: 'Feedback on the packaging concepts',
    body: [
      'Hi Maya, we went through the three packaging routes with the whole team this morning and there is a clear favorite.',
      'Route B (the linocut illustrations) got the strongest reaction. People liked that it still reads as Harbor from across a shop, and the two-color print keeps us inside the budget we discussed.',
      'Two requests before we sign off: can we see the decaf bag in the darker green, and could the roast date move to the back panel? Our retail partners stack the bags upright and the front label gets covered by the shelf lip.',
      'If you can turn those around by Thursday we can take it to the printer the same week.',
    ],
    time: '9:42 AM',
    date: 'Today, 9:42 AM',
    unread: true,
    starred: true,
    labels: ['Clients'],
    attachments: [
      { name: 'route-b-notes.pdf', size: '240 KB' },
      { name: 'shelf-photo.jpg', size: '1.8 MB' },
    ],
  },
  {
    id: 'm2',
    folder: 'inbox',
    from: 'Priya Raman',
    email: 'priya@juniperstudio.example',
    subject: 'Studio day: Friday the 20th?',
    body: [
      'Quick poll for the studio day. Friday the 20th works for the print workshop, and they can take all six of us.',
      'It starts at 10 and runs to about 3, lunch included. I need to confirm numbers by Wednesday, so reply with a yes or no when you can.',
      'I will sort the train tickets once I know who is coming.',
    ],
    time: '8:15 AM',
    date: 'Today, 8:15 AM',
    unread: true,
    starred: false,
    labels: ['Team'],
  },
  {
    id: 'm3',
    folder: 'inbox',
    from: 'Ledgerly',
    email: 'billing@ledgerly.example',
    subject: 'Invoice INV-2041 was paid',
    body: [
      'Good news: Harbor Coffee paid invoice INV-2041 for $4,800.00. The payment will reach your account in one to two business days.',
      'Invoice: INV-2041. Client: Harbor Coffee Roasters. Paid: November 10. Method: bank transfer.',
      'You have 2 other invoices outstanding, totalling $6,150.00.',
    ],
    time: 'Yesterday',
    date: 'Yesterday, 4:03 PM',
    unread: true,
    starred: false,
    labels: ['Finance'],
    attachments: [{ name: 'INV-2041-receipt.pdf', size: '86 KB' }],
  },
  {
    id: 'm4',
    folder: 'inbox',
    from: 'Dara Okonkwo',
    email: 'dara@fieldnotes.example',
    subject: 'Re: Annual report timeline',
    body: [
      'Thanks for the revised schedule. Moving the photo shoot a week earlier works on our side.',
      'The only fixed date is the board meeting on December 9: they need printed copies in the room, so files have to be with the printer by the 1st at the latest.',
      'I have asked finance to send the final figures by next Friday so the charts are not a last-minute job this year.',
    ],
    time: 'Yesterday',
    date: 'Yesterday, 11:27 AM',
    unread: false,
    starred: true,
    labels: ['Clients'],
    replies: [{ from: ME.name, time: 'Yesterday, 1:10 PM', body: 'Perfect. I will lock the shoot for the 18th and send a call sheet tomorrow.' }],
  },
  {
    id: 'm5',
    folder: 'inbox',
    from: 'Skyline Rail',
    email: 'tickets@skylinerail.example',
    subject: 'Your tickets to Rotterdam, November 24',
    body: [
      'Your booking is confirmed. Two seats, coach 7, departing 07:52 and arriving 10:14.',
      'Tickets are attached and also available in the app. Seat reservations can be changed free of charge until the day before travel.',
    ],
    time: 'Mon',
    date: 'Monday, 6:48 PM',
    unread: false,
    starred: false,
    labels: ['Travel'],
    attachments: [{ name: 'tickets-RTM-2411.pdf', size: '312 KB' }],
  },
  {
    id: 'm6',
    folder: 'inbox',
    from: 'Jun Takeda',
    email: 'jun@juniperstudio.example',
    subject: 'Type licence for the Fieldnotes job',
    body: [
      'The foundry got back to me. A web and print licence for the full family is $640 for up to five users, or $380 if we only take the four weights we are actually using.',
      'I would take the four weights. Want me to go ahead and put it on the studio card?',
    ],
    time: 'Mon',
    date: 'Monday, 2:20 PM',
    unread: false,
    starred: false,
    labels: ['Team', 'Finance'],
  },
  {
    id: 'm7',
    folder: 'inbox',
    from: 'Mirela Popa',
    email: 'mirela@osterbakery.example',
    subject: 'Signage is up!',
    body: [
      'The new sign went up on Saturday and we have already had three people come in just to say they like it. Photos attached.',
      'Thank you for pushing us on the hand-painted version. It was the right call.',
    ],
    time: 'Sun',
    date: 'Sunday, 9:05 AM',
    unread: false,
    starred: true,
    labels: ['Clients'],
    attachments: [
      { name: 'oster-front.jpg', size: '2.4 MB' },
      { name: 'oster-night.jpg', size: '2.1 MB' },
    ],
  },
  {
    id: 'm8',
    folder: 'inbox',
    from: 'Callum Reyes',
    email: 'callum@juniperstudio.example',
    subject: 'Portfolio review notes',
    body: [
      'Notes from yesterday, as promised. Short version: lead with the Oster Bakery identity, cut the two oldest case studies, and add process shots to Harbor.',
      'I can pair with you on the case study copy on Thursday afternoon if that helps.',
    ],
    time: 'Nov 7',
    date: 'November 7, 3:44 PM',
    unread: false,
    starred: false,
    labels: ['Team'],
  },
  {
    id: 'm9',
    folder: 'inbox',
    from: 'Ledgerly',
    email: 'billing@ledgerly.example',
    subject: 'Reminder: INV-2038 is 7 days overdue',
    body: [
      'Invoice INV-2038 to Fieldnotes Foundation for $3,400.00 was due on November 1 and has not been paid yet.',
      'You can send a reminder from your dashboard, or mark the invoice as paid if the money has already arrived.',
    ],
    time: 'Nov 8',
    date: 'November 8, 8:00 AM',
    unread: false,
    starred: false,
    labels: ['Finance'],
  },
  {
    id: 's1',
    folder: 'sent',
    to: 'Dara Okonkwo',
    from: ME.name,
    email: ME.email,
    subject: 'Call sheet for the 18th',
    body: [
      'Hi Dara, call sheet attached for the shoot on the 18th. We start at the riverside site at 8:30 for the morning light and move indoors after lunch.',
      'Let me know if any of the people on the list have changed.',
    ],
    time: 'Tue',
    date: 'Tuesday, 10:02 AM',
    unread: false,
    starred: false,
    labels: ['Clients'],
    attachments: [{ name: 'call-sheet-nov-18.pdf', size: '128 KB' }],
  },
  {
    id: 's2',
    folder: 'sent',
    to: 'Mirela Popa',
    from: ME.name,
    email: ME.email,
    subject: 'Estimate: Oster Bakery winter menu',
    body: ['Hi Mirela, here is the estimate for the winter menu boards and the takeaway cards. It covers two rounds of changes and print-ready files.'],
    time: 'Nov 6',
    date: 'November 6, 4:30 PM',
    unread: false,
    starred: false,
    labels: ['Clients', 'Finance'],
  },
  {
    id: 'd1',
    folder: 'drafts',
    to: 'Studio team',
    from: ME.name,
    email: ME.email,
    subject: 'Studio rates for next year',
    body: ['Team, before we send the January letters I would like us to agree on the new day rate. My proposal is below.'],
    time: 'Nov 5',
    date: 'November 5, 5:12 PM',
    unread: false,
    starred: false,
    labels: ['Team'],
  },
  {
    id: 'a1',
    folder: 'archive',
    from: 'Noor Haddad',
    email: 'noor@lanternbooks.example',
    subject: 'Cover files received, thank you',
    body: ['All three covers arrived and the printer has confirmed the spine widths. We will send printed copies as soon as they are in.'],
    time: 'Oct 29',
    date: 'October 29, 12:18 PM',
    unread: false,
    starred: false,
    labels: ['Clients'],
  },
];
