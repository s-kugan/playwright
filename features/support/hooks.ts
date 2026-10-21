import { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import type { Browser } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { POManager } from '../../pageobjects/POManager';
import { CustomWorld } from './world';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
setDefaultTimeout(60 * 1000);

let browser: Browser;

BeforeAll(async function () {
    browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
});

AfterAll(async function () {
    await browser.close();
});

Before(async function (this: CustomWorld) {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
    this.poManager = new POManager(this.page);
    this.loginPage = this.poManager.getLoginPage();
    this.dashboardPage = this.poManager.getDashboardPage();
    this.checkoutPage = this.poManager.getCheckoutPage();
    this.ordersPage = this.poManager.getOrdersPage();
});

After(async function (this: CustomWorld, { result }) {
    if (result?.status === Status.FAILED) {
        this.attach(await this.page.screenshot(), 'image/png');
    }
    await this.context.close();
});
