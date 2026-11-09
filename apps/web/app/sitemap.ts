import type { MetadataRoute } from 'next';
import { CATALOG } from '@/lib/catalog';
import { categoriesWithBlocks } from '@/lib/blocks';
import { TEMPLATES } from '@/lib/templates';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/docs',
    '/docs/theming',
    '/docs/components',
    ...CATALOG.map((c) => `/docs/components/${c.slug}`),
    '/blocks',
    ...categoriesWithBlocks().map((c) => `/blocks/${c.id}`),
    '/templates',
    ...TEMPLATES.map((t) => `/templates/${t.slug}`),
    '/demo',
  ];
  return paths.map((p) => ({ url: `${SITE_URL}${p === '/' ? '' : p}` }));
}
