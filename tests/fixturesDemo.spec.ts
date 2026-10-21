import { expect } from '@playwright/test';
import { customtest } from '../utils/fixtures';

customtest("Fixtures demo", async({ authenticatedPage,createOrder,testDataForOrder})=>{

    // Login to application and verify if the order is created.
    await authenticatedPage.goto('https://rahulshettyacademy.com/client');
    await authenticatedPage.locator("button[routerlink*='myorders']").click();
    await authenticatedPage.locator("tbody").waitFor();
    await expect(authenticatedPage.getByText(createOrder.orderID)).toBeVisible();
    console.log('product name:', testDataForOrder.productName);


})