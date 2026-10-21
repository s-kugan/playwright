
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { CheckoutPage } from './CheckoutPage';
import { OrdersPage } from './OrdersPage';
import type { Page } from '@playwright/test';

export class POManager
{
    private loginPage: LoginPage;
    private dashboardPage: DashboardPage;
    private checkoutPage: CheckoutPage;
    private ordersPage: OrdersPage;
    
    constructor(private page: Page){
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.checkoutPage = new CheckoutPage(this.page);
        this.ordersPage = new OrdersPage(this.page);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getDashboardPage() {
        return this.dashboardPage;
    }

    getCheckoutPage() {
        return this.checkoutPage;
    }

    getOrdersPage() {
        return this.ordersPage;
    }

}