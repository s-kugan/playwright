import { test as base, Page, request, APIRequestContext } from '@playwright/test';
import { APIUtils } from './APIUtils';
const loginPayLoad = {userEmail:"deepa@deepa.com",userPassword:"Abcd@6666"};
const orderPayLoad = {orders:[{country:"Cuba",productOrderedId:"6960eac0c941646b7a8b3e68"}]};

type Fixtures = {
    authenticatedPage: Page;
    createOrder: { orderID: string };
    testDataForOrder: { productName: string };
};

const customtest = base.extend<Fixtures>({
    authenticatedPage: async ({browser}, use) => {
        // Perform login steps here
        const context = await browser.newContext();
        const page = await context.newPage();
        //page.route("**/*.{jpg,png,jpeg}", route => route.abort());
        await page.goto("https://rahulshettyacademy.com/client");   
        await page.locator("#userEmail").fill(process.env.USER_EMAIL!);
        await page.locator("#userPassword").fill(process.env.USER_PASSWORD!);
        await page.locator("[value='Login']").click();
        await page.waitForLoadState('networkidle');
        await use(page);
    },

    createOrder: async ({}, use) => {
        // Implement order creation logic here
        const apiContext: APIRequestContext = await request.newContext();
        const apiUtils = new APIUtils(apiContext, loginPayLoad);
        const orderID = await apiUtils.createOrder(orderPayLoad);
        await use({ orderID }); //tear down
        await apiContext.dispose();
    },

    testDataForOrder:{
        productName:'ADIDAS ORIGINAL'
    }
});

export { customtest };
