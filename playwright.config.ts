import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 15000 },

  fullyParallel: true,   // allow tests within a file to run in parallel
  retries: 3,            // retry failed tests
  workers: 1,           // global max workers (can be overridden per project)
  
  use: {
    baseURL: 'https://trade.multibank.io',
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--disable-popup-blocking',
            '--disable-notifications',
          ]
        }
      },
      workers: 1, // only 5 parallel workers for Chromium
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            'dom.disable_open_during_load': false,
            'privacy.popups.policy': 1,
            'privacy.popups.showBrowserMessage': false,
          }
        }
      },
      workers: 1, // only 5 parallel workers for Firefox
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: {
          args: [
            '--disable-popup-blocking'
          ]
        }
      },
      workers: 1, // only 1 worker for WebKit
    },
  ],
});