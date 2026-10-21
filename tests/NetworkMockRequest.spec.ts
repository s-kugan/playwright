import{test, expect, request, APIRequestContext} from '@playwright/test';


test('@API security test request intercept,async ', async ({page}) => {

    // login and reach orders page
    await page.goto(process.env.BASE_URL!);
    await page.locator("#userEmail").fill(process.env.USER_EMAIL!);
    await page.locator("#userPassword").fill(process.env.USER_PASSWORD!);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();
    await page.locator("button[routerlink*='orders']").click();

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*", async route => {
    
        //continue method is used to intercept the request calls
        route.continue({url:'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6ac65ff02be7a4bc2b91f333'});
    });
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p.blink_me")).toHaveText("You are not authorize to view this order");
    //await page.pause();


    
});