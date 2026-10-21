import { setWorldConstructor, World } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import type { LoginPage } from '../../pageobjects/LoginPage';
import type { DashboardPage } from '../../pageobjects/DashboardPage';
import type { CheckoutPage } from '../../pageobjects/CheckoutPage';
import type { OrdersPage } from '../../pageobjects/OrdersPage';

// Cucumber creates a fresh CustomWorld for every scenario; it is the `this` inside hooks and steps.
// Steps can't share local variables, so anything they need to share lives here.
export class CustomWorld extends World {
    // Set in the Before hook (hooks.ts), closed in the After hook.
    context!: BrowserContext;
    page!: Page;
    poManager!: POManager;

    // Created once per scenario in the Before hook so steps just use this.loginPage etc.
    loginPage!: LoginPage;
    dashboardPage!: DashboardPage;
    checkoutPage!: CheckoutPage;
    ordersPage!: OrdersPage;

    // Set by the "Place the Order" step, read by the "OrderHistory" step.
    orderId = '';
}

// Registers the class so Cucumber uses it instead of the default World.
setWorldConstructor(CustomWorld);
