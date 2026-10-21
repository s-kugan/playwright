import type { Locator, Page } from '@playwright/test';

export class LoginPage{

    private userEmail: Locator;
    private userPassword: Locator;
    private signInbutton: Locator;
    private cardBody: Locator;      
    private errorToast: Locator;

    constructor(private page:Page) {
        this.page = page;
        this.userEmail = page.locator("#userEmail");
        this.userPassword = page.locator("#userPassword");         
        this.signInbutton = page.locator("[value='Login']");
        this.cardBody = page.locator(".card-body b");
        this.errorToast = page.locator("#toast-container");
    }

    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    async login(username: string, password: string) {
        await this.userEmail.fill(username);
        await this.userPassword.fill(password);
        await this.signInbutton.click();
        await this.cardBody.first().waitFor();
    }

    // Unlike login(), does not wait for the dashboard, so it works for failed logins.
    async submitLogin(username: string, password: string) {
        await this.userEmail.fill(username);
        await this.userPassword.fill(password);
        await this.signInbutton.click();
    }

    async getErrorMessage() {
        await this.errorToast.waitFor();
        return (await this.errorToast.textContent())!.trim();
    }
}