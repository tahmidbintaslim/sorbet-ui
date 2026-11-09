// Per-route metadata: one place for canonical URLs, Open Graph and Twitter tags,
// so every page shares its own title and description instead of the site's.
import type { Metadata } from 'next';
import { SITE } from './site';

export const SITE_URL = 'https://sorbetui.tahmid.space';
// 1200×630 social card (public/og.png).
const OG_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: `${SITE.name}: ${SITE.tagline}` };

export function pageMeta({ title, description, path }: { title?: string; description?: string; path: string }): Metadata {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name}: ${SITE.tagline}`;
  const desc = description ?? SITE.description;
  return {
    ...(title ? { title } : {}),
    description: desc,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description: desc, url: path, siteName: SITE.name, type: 'website', images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title: fullTitle, description: desc, images: [OG_IMAGE.url] },
  };
}
