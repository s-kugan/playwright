import {test,expect} from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('Popup Validations', async ({ page }) => {
    //page.route("**/*.{jpg,png,jpeg}", route => route.abort());
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    /* await page.goto("https://www.google.com");
    await page.goBack();
    await page.goForward(); */

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    //await page.pause();
    page.on('dialog', async dialog => {
        console.log(dialog.accept());
        await dialog.accept();
        //await dialog.dismiss();
    });
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    const framesPage =page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck?.split(" ")[1]);``

});


test("Screenshot & Visual comparision", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client");   
    await page.locator("#userEmail").fill(process.env.USER_EMAIL!);
    await page.locator("#userPassword").fill(process.env.USER_PASSWORD!);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    
});

test("Take screenshot only on locator", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.waitForLoadState('networkidle');   
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#displayed-text").screenshot({ path: 'locator-screenshot.png' });
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();    
});

test("Visual testing", async ({ page }) => {
    await page.goto("https://www.flightaware.com/");
    //await page.waitForLoadState('networkidle');
    expect(await page.screenshot()).toMatchSnapshot('rediff-homepage.png');
    // Add your test steps here
});