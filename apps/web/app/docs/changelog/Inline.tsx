// Tiny inline Markdown renderer for changelog text: `code`, **bold** and [links](url).
// Server-only and dependency free; anything else renders as plain text.
import * as React from 'react';
import { Link } from '@mui/material';

const TOKEN = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)\s]+\))|(https?:\/\/[^\s),]+[^\s),.])/g;

export default function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [whole, code, bold, link, url] = m;
    if (code) out.push(<code key={key++}>{code.slice(1, -1)}</code>);
    else if (bold) out.push(<strong key={key++}>{bold.slice(2, -2)}</strong>);
    else if (link) {
      const [, label, href] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(link)!;
      out.push(
        <Link key={key++} href={href} rel={href.startsWith('http') ? 'noopener' : undefined}>
          {label}
        </Link>,
      );
    } else if (url) {
      out.push(
        <Link key={key++} href={url} rel="noopener">
          {url.replace(/^https?:\/\//, '')}
        </Link>,
      );
    } else out.push(whole);
    last = m.index + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
