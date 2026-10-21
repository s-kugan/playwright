
import type { Locator,Page } from '@playwright/test';

export class DashboardPage {

    private products: Locator;
    private productText: Locator;
    private cart: Locator;
    
    constructor(private page: Page) {
        this.products = page.locator(".card-body");
        this.productText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']"); 
    }

    async searchProductAddCart(productName: string) {
        await this.productText.first().waitFor();
        const product = this.products.filter({ has: this.page.locator("b", { hasText: productName }) });
        // Wait for the add-to-cart call to finish so navigating to the cart doesn't cancel it.
        await Promise.all([
            this.page.waitForResponse(res => res.url().includes("/add-to-cart") && res.ok()),
            product.first().getByRole("button", { name: /Add To Cart/i }).click(),
        ]);
    }

    async goToCart() {
        await this.cart.click();
    }
}