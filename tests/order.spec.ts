import { test, expect } from '@playwright/test';
import { POManager } from '../pageobjects/POManager';
import testData from '../testdata.json';
import { baseTest } from '../utils/test-base';

// Tests share one account and its server-side cart, so they must not run in parallel.
test.describe.configure({ mode: 'serial' });

for (const datainput of testData) {

test(`@Order Place order test ${datainput.productName}`, async ({ page }) => {
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashboardPage();
    const checkoutPage = poManager.getCheckoutPage();

    await loginPage.navigateTo(process.env.BASE_URL!);
    await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
    await page.waitForLoadState('networkidle');
    //wait for metyhod works when the element returns single element
       
    await dashboardPage.searchProductAddCart(datainput.productName);
    await dashboardPage.goToCart();

   
    await checkoutPage.verifyProductInCart(datainput.productName);
    await checkoutPage.checkout();
    await checkoutPage.selectCountry("ind", "India");
    await checkoutPage.placeOrder();
    await checkoutPage.verifyOrderPlaced();
 })
}

baseTest(`@Order Place order test with fixture data`, async ({ page, testDataForProduct }) => {
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashboardPage();
    const checkoutPage = poManager.getCheckoutPage();

    await loginPage.navigateTo(process.env.BASE_URL!);
    await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
    await page.waitForLoadState('networkidle');
   
    await dashboardPage.searchProductAddCart(testDataForProduct.productName);
    await dashboardPage.goToCart();

   
    await checkoutPage.verifyProductInCart(testDataForProduct.productName);
    await checkoutPage.checkout();
    await checkoutPage.selectCountry("ind", "India");
    await checkoutPage.placeOrder();
    await checkoutPage.verifyOrderPlaced();
 })

// Fails on purpose to demo the "Copy prompt" button in the HTML report.
test(`@Order Copy prompt demo - intentional failure`, async ({ page }) => {
    await page.goto(process.env.BASE_URL!);
    await expect(page.getByRole('button', { name: 'Sign Up' })).not.toBeVisible();
    //await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
});
