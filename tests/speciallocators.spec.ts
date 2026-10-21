import { test, expect } from '@playwright/test';
 
test('Playwright Special locators', async ({ page }) => {
  
    //wait timeout priority -> Global < Page < Step
    const slowExpect = expect.configure({timeout:10000});
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", {name: 'Submit'}).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    await page.getByRole("link",{name : "Shop"}).click();
    //page level timeout
    await slowExpect(page.locator(".my-4").first()).toHaveText("Nokia Edge");

    await page.getByRole('checkbox', { name: 'Check me out if you Love' }).check();

    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button",{name:"Add to Cart"}).click();
    //step level timeouts - Its overides page level and global timeoutsss
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({timeout: 10000});
    page.setDefaultTimeout(10000); // set default timeout for all actions on this page

    await page.getByRole("listitem").getByRole("button",{name:"Cart"}).click();

    await page.getByPlaceholder("Select Country").pressSequentially("India");

    await page.locator("tbody").waitFor();

    await page.getByText("Place order").click();

    await expect(page.getByText("Thank you for your order!")).toBeVisible();

 
});

