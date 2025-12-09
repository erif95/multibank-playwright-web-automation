import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 15000 },

  use: {
    baseURL: 'https://trade.multibank.io',
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--disable-popup-blocking',        // disables pop-up blocking UI
            '--disable-notifications',         // prevents popup permission prompts
          ]
        }
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            'dom.disable_open_during_load': false, // allow JS to open new windows without prompts
            'privacy.popups.policy': 1,            // allow open windows
            'privacy.popups.showBrowserMessage': false,
            
          }
        }
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: {
          args: [
            '--disable-popup-blocking' // limited effect but Safari accepts the flag
          ]
        }
      }
    },
  ],
});