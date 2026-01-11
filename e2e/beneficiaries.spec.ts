import { test, expect } from '@playwright/test';

test('Beneficiaries UI', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await page.getByRole('button', { name: 'Beneficiaries' }).click();
  await expect(page.locator('h2', { hasText: 'Beneficiaries' })).toBeVisible();
  await page.screenshot({ path: 'e2e/beneficiaries.png', fullPage: true });
});
