import {test,expect} from '@playwright/test';


test('test with multiple tabs',async({page,context})=>{

    await page.goto("https://example.com",{waitUntil:'load'});
    

    const linke4lem = page.locator("#docID");

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        linke4lem.click()
    ]);


    await newPage.waitForLoadState('domcontentloaded');
});