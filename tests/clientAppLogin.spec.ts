import { test, expect } from '@playwright/test';

test('@WebBasic Client App login', async ({ page }) => {
    const email = process.env.USER_EMAIL!;
    const password = process.env.USER_PASSWORD!;
    const productName = process.env.PRODUCT_NAME_ZARA!;
    const products = page.locator(".card-body");

    await page.goto(process.env.BASE_URL!);
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(password);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    const titles: string[] = await page.locator(".card-body b").allTextContents();
    console.log(titles);
    const product = products.filter({ has: page.locator("b", { hasText: productName }) });
    await expect(product).toHaveCount(1); // fails loudly if the product name doesn't match
    await product.getByRole('button', { name: /Add To Cart/i }).click();
    await expect(page.locator("#toast-container")).toContainText(/Product Added To Cart/i);
    await page.locator("[routerlink*='cart']").click();
    await expect(page.locator("h1:has-text('My Cart')")).toBeVisible();
    await expect(page.locator("h3:has-text('" + productName + "')").last()).toBeVisible();
    await page.getByRole('button', { name: /Buy Now/i }).click();

    // Personal information
    const personalInfo = page.locator(".payment__cc");
    await expect(personalInfo.locator("input.txt").first()).toHaveValue("4542 9931 9292 2293");
    const expiry = personalInfo.locator("select.ddl");
    await expiry.nth(0).selectOption("05");
    await expiry.nth(1).selectOption("28");
    await personalInfo.locator(".field:has(.title:has-text('CVV')) input").fill("123");
    await personalInfo.locator(".field:has(.title:has-text('Name on Card')) input").fill("Test User");
    await personalInfo.locator("input[name='coupon']").fill("rahulshettyacademy");
    await personalInfo.getByRole('button', { name: 'Apply Coupon' }).click();
    await expect(personalInfo.getByText("* Coupon Applied")).toBeVisible(); // form re-renders after the coupon call

    // Shipping information
    const shipping = page.locator(".payment__shipping");
    await expect(shipping.locator("label")).toHaveText(email);
    await shipping.getByPlaceholder("Select Country").pressSequentially("ind", { delay: 100 });
    await shipping.locator(".ta-item").filter({ hasText: /^\s*India\s*$/ }).click();
    await expect(shipping.getByPlaceholder("Select Country")).toHaveValue("India");
    await page.locator(".action__submit").click();
    await expect(page.locator("h1:has-text(' Thankyou for the order. ')")).toBeVisible();
    //await page.pause();

    const orderIdText = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    const orderId = orderIdText!.replace(/\|/g, "").trim();
    console.log(orderId);
    expect(orderId).toMatch(/^[a-z0-9]+$/i);

    const btnOrders = page.locator("button[routerlink=\"/dashboard/myorders\"]");
    await btnOrders.click();
    
    // Orders table loads asynchronously; filter() auto-waits and the click fails loudly if our order is missing
    const orderRow = page.locator("tbody tr").filter({ hasText: orderId });
    await expect(orderRow).toHaveCount(1);
    await orderRow.getByRole('button', { name: 'View' }).click();
    await expect(page.locator(".col-text")).toHaveText(orderId);
    
});
