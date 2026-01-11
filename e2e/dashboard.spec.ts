import { test, expect } from '@playwright/test';

test('Dashboard UI', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await expect(page.getByText('Financial Overview')).toBeVisible();
  await page.screenshot({ path: 'e2e/dashboard.png', fullPage: true });
});
