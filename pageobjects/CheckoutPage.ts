import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {

    private cartItems: Locator;
    private checkoutButton: Locator;
    private countryInput: Locator;
    private placeOrderButton: Locator;
    private thankYouMessage: Locator;

    constructor(private page: Page) {
        this.cartItems = page.locator("div li");
        this.checkoutButton = page.getByRole("button", { name: "Checkout" });
        this.countryInput = page.getByPlaceholder("Select Country");
        this.placeOrderButton = page.getByText("PLACE ORDER");
        this.thankYouMessage = page.getByRole("heading", { name: "Thankyou for the order." });
    }

    async verifyProductInCart(productName: string) {
        await this.cartItems.first().waitFor();
        await expect(this.page.getByText(productName)).toBeVisible();
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async selectCountry(countryPrefix: string, countryName: string) {
        await this.countryInput.pressSequentially(countryPrefix);
        await this.page.getByRole("button", { name: countryName }).nth(1).click();
    }

    async placeOrder() {
        await this.placeOrderButton.click();
    }

    async verifyOrderPlaced() {
        await expect(this.thankYouMessage).toBeVisible({timeout:10000});
    }

    async getOrderId() {
        const text = await this.page.locator(".em-spacer-1 .ng-star-inserted").first().textContent();
        return text!.replaceAll("|", "").trim();
    }
}
