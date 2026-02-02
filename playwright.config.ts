import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173",
    headless: true,


    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [

    {
      name: "Desktop Chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },


    {
      name: "iPhone 14",
      use: {
        ...devices["iPhone 14"],
      },
    },

    
    {
      name: "Pixel 7",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],

  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
