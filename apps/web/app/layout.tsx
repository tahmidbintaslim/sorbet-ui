import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import ColorModeProvider from '@/components/ColorMode';
import SiteShell from '@/components/SiteShell';
import { SITE } from '@/lib/site';
import { SITE_URL, pageMeta } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMeta({ path: '/' }),
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.name}: ${SITE.tagline}`, template: `%s | ${SITE.name}` },
};

// Structured data for search engines: the site and the library it documents.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', name: SITE.name, url: SITE_URL, description: SITE.description },
    {
      '@type': 'SoftwareSourceCode',
      name: SITE.name,
      description: SITE.description,
      codeRepository: SITE.github,
      programmingLanguage: 'TypeScript',
      license: 'https://opensource.org/licenses/MIT',
    },
  ],
};

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <AppRouterCacheProvider options={{ enableCssLayer: false }}>
          <ColorModeProvider>
            <SiteShell>{children}</SiteShell>
          </ColorModeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
