import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import ColorModeProvider from '@/components/ColorMode';
import SiteShell from '@/components/SiteShell';
import { COLOR_MODE_KEY, SITE } from '@/lib/site';
import { SITE_URL, pageMeta } from '@/lib/seo';
import { backgrounds, textColors } from '@sorbet-ui/tokens';

// Runs before first paint: picks the saved or OS color mode and marks <html>,
// so the page background and theme-aware images are right from the first frame
// (the MUI theme itself switches during hydration, see ColorMode.tsx).
const INIT_MODE = `try{var m=localStorage.getItem('${COLOR_MODE_KEY}');if(m!=='light'&&m!=='dark')m=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var d=document.documentElement;d.dataset.mode=m;d.style.colorScheme=m}catch(e){}`;
const PRE_HYDRATION_CSS = `html[data-mode="dark"] body{background-color:${backgrounds.dark.default};color:${textColors.dark.primary}}`;

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT_MODE }} />
        <style dangerouslySetInnerHTML={{ __html: PRE_HYDRATION_CSS }} />
      </head>
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
