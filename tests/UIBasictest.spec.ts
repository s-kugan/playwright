import { test, expect } from '@playwright/test';

test('@UI Basic test', async ({ page }) => {
    await page.goto(process.env.PRACTICE_URL!);
    const txtuserName = page.locator('#username');
    const btnSignIn = page.locator("#signInBtn");
    const dropdown = page.locator('select.form-control');
    await dropdown.selectOption('consult'); // replace 'option1' with the actual value you want to select
    await expect(dropdown).toHaveValue('consult');
});