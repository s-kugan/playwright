import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class OrdersPage {

    private ordersButton: Locator;
    private orderRows: Locator;

    constructor(private page: Page) {
        this.ordersButton = page.locator("button[routerlink*='myorders']");
        this.orderRows = page.locator("tbody tr");
    }

    async goToOrders() {
        await this.ordersButton.click();
        await this.orderRows.first().waitFor();
    }

    async verifyOrderPresent(orderId: string) {
        const row = this.orderRows.filter({ has: this.page.locator("th", { hasText: orderId }) });
        await expect(row).toBeVisible();
    }
}
