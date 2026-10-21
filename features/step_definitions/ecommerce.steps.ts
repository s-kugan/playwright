import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Replaces "${VAR}" with process.env.VAR so secrets stay out of the feature file.
const resolveEnv = (value: string) =>
    value.replace(/^\$\{(\w+)\}$/, (_, name: string) => process.env[name] ?? '');

//.env (PRODUCT_NAME=...)  ->  process.env  ->  resolveEnv("${PRODUCT_NAME}")  ->  real product name

Given('a user is login to e-commerce website with {string} and {string}',
    async function (this: CustomWorld, username: string, password: string) {
        await this.loginPage.navigateTo(process.env.BASE_URL!);
        await this.loginPage.login(resolveEnv(username), resolveEnv(password));
    });

When('Add {string} to Cart', async function (this: CustomWorld, productName: string) {
    await this.dashboardPage.searchProductAddCart(resolveEnv(productName));
    await this.dashboardPage.goToCart();
});

Then('Verify {string} is displayed in the Cart', async function (this: CustomWorld, productName: string) {
    await this.checkoutPage.verifyProductInCart(resolveEnv(productName));
});

When('Enter valid details and Place the Order', async function (this: CustomWorld) {
    await this.checkoutPage.checkout();
    await this.checkoutPage.selectCountry('ind', 'India');
    await this.checkoutPage.placeOrder();
    await this.checkoutPage.verifyOrderPlaced();
    this.orderId = await this.checkoutPage.getOrderId();
});

Then('Verify order is present in the OrderHistory', async function (this: CustomWorld) {
    await this.ordersPage.goToOrders();
    await this.ordersPage.verifyOrderPresent(this.orderId);
});

Given('a user opens the e-commerce website', async function (this: CustomWorld) {
    await this.loginPage.navigateTo(process.env.BASE_URL!);
});

When('the user submits login with {string} and {string}',
    async function (this: CustomWorld, username: string, password: string) {
        await this.loginPage.submitLogin(resolveEnv(username), resolveEnv(password));
    });

Then('the login error {string} is displayed', async function (this: CustomWorld, message: string) {
    expect(await this.loginPage.getErrorMessage()).toContain(message);
});
