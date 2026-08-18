import { defineConfig } from '@playwright/test';
import 'dotenv/config';

/**
 * TestPortal base URL/API endpoint that tests will eventually target.
 * Configurable via .env (see .env.example) — no live instance is hardcoded here.
 */
const testPortalBaseUrl = process.env.TESTPORTAL_BASE_URL;

export default defineConfig({
  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: testPortalBaseUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
    },
    {
      name: 'ui',
      testDir: './tests/ui',
    },
    {
      name: 'mocking',
      testDir: './tests/mocking',
    },
  ],
});
