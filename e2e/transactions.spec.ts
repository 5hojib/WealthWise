import { test, expect } from '@playwright/test';

test('Transactions UI', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await page.getByRole('button', { name: 'Transactions' }).click();
  await expect(page.getByPlaceholder('Search transactions...')).toBeVisible();
  await page.screenshot({ path: 'e2e/transactions.png', fullPage: true });
});
