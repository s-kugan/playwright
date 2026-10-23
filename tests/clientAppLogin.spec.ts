import { test, expect } from '@playwright/test';

test('@Web Client App login', async ({ page }) => {
    const email = process.env.USER_EMAIL!;
    const password = process.env.USER_PASSWORD!;
    const productName = 'zara coat 3';
    const products = page.locator(".card-body");

    await page.goto(process.env.BASE_URL!);
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(password);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    const titles: string[] = await page.locator(".card-body b").allTextContents();
    console.log(titles);
});
