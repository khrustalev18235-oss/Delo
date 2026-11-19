const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
 testDir: '.', testMatch: /\.spec\.cjs$/,
 timeout: 30000, retries: 1,
 use: { browserName: 'chromium', headless: true, viewport: {width: 1440, height: 900}, baseURL: 'http://127.0.0.1:8765' },
 webServer: {command: 'python3 -m http.server 8765 --bind 127.0.0.1', cwd: '..', url: 'http://127.0.0.1:8765/demo/', reuseExistingServer: !process.env.CI, timeout: 20000},
});
