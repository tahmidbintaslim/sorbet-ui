import type { Metadata, Viewport } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import ColorModeProvider from '@/components/ColorMode';
import SiteShell from '@/components/SiteShell';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: { default: `${SITE.name}: ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: { title: SITE.name, description: SITE.description, type: 'website' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: false }}>
          <ColorModeProvider>
            <SiteShell>{children}</SiteShell>
          </ColorModeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
