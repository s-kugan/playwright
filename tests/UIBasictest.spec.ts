import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto(process.env.PRACTICE_URL!, { waitUntil: 'domcontentloaded' });
});

test('@UI Basic test', async ({ page }) => {
    
    const txtuserName = page.locator('#username');
    const btnSignIn = page.locator("#signInBtn");
    const dropdown = page.locator('select.form-control');
    await dropdown.selectOption('consult'); // replace 'option1' with the actual value you want to select
    await expect(dropdown).toHaveValue('consult');

    const radiobtnUserType = page.locator("#usertype").last();
    await radiobtnUserType.click();
    await expect(radiobtnUserType).toBeChecked();
    //isChecked() returns Boolean value
    const btnOkay = page.locator("#okayBtn");
    await btnOkay.click();
    await expect(btnOkay).toBeHidden();

    const chkboxTerms = page.locator("#terms");
    await chkboxTerms.click();
    await expect(chkboxTerms).toBeChecked();
    await chkboxTerms.uncheck();
    await expect(chkboxTerms).not.toBeChecked();
    const blinkingText = page.locator(".blinkingText").first();
    await expect(blinkingText).toBeVisible();
    await expect(blinkingText).toHaveAttribute('class', 'blinkingText' );
});

test('@Windows child window handling', async ({ page, context }) => {

    const openWindowBtn = page.locator("[href*='documents-request']").first();
    const txtuserName = page.locator('#username');

    const [newPage] = await Promise.all([
        context.waitForEvent('page'), // listen for any new page to open
        openWindowBtn.click({timeout:30000})
    ]);

    await expect(newPage).toHaveURL(/documents-request/);
    const text = await newPage.locator(".red").first().textContent();
    console.log("Text content:", text);

    const arrayText = await text.split("@")
    const domain = await arrayText[1].split(" ")[0]
    console.log(domain);
    await txtuserName.fill(domain);
    await expect(txtuserName).toHaveValue(domain);
    console.log(await txtuserName.inputValue());

    //textContent(): text of any element (string | null). Doesn't include typed input values.
   // inputValue():  current value of <input>/<textarea>/<select> (string). Throws on other elements.

    
});