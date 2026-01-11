import { test, expect } from '@playwright/test';

test('Add Entry Modal UI', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await page.getByRole('button', { name: 'Add new entry' }).click();
  await expect(page.locator('.bg-\\[\\#1C1C1E\\]')).toBeVisible();
  await expect(page.getByText('Record Entry')).toBeVisible();
  await expect(page.getByPlaceholder('Notes')).toBeVisible();
  await page.screenshot({ path: 'e2e/add-entry-modal.png' });
});
