import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

// Use the preinstalled Chromium when present (cloud sandbox); otherwise
// Playwright's own browser from `playwright install`.
const preinstalled = '/opt/pw-browsers/chromium';
const executablePath =
  process.env.PW_CHROMIUM_PATH ?? (existsSync(preinstalled) ? preinstalled : undefined);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3100',
    launchOptions: { executablePath, args: ['--no-sandbox'] },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], launchOptions: { executablePath, args: ['--no-sandbox'] } } },
    {
      name: 'mobile',
      use: {
        viewport: { width: 375, height: 800 },
        isMobile: false,
        launchOptions: { executablePath, args: ['--no-sandbox'] },
      },
    },
  ],
  // Serves the static export; run `pnpm build` first.
  webServer: { command: 'node e2e/serve.mjs', url: 'http://localhost:3100', reuseExistingServer: !process.env.CI },
});
