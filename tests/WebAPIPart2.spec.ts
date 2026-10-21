//Login UI -> .json
// test browser ->.json, cart-,order,orderdetails,orderhistory
import { test, expect } from '@playwright/test';
let webContext:any;


test.beforeAll('Save storage state', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    //page.route("**/*.{jpg,png,jpeg}", route => route.abort());
    await page.goto("https://rahulshettyacademy.com/client");   
    await page.locator("#userEmail").fill("anshika@gmail.com");
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await context.storageState({ path: 'state.json' });
    webContext = await browser.newContext({storageState: 'state.json'});
});

test('@Webst Client App login', async ({page}) => {
   //js file- Login js, DashboardPage
   const email = "";
   const productName = 'ZARA COAT 3';
   //const page = await webContext.newPage();
    page.on('request', request => {
        console.log('Request made:', request.url());
    });
    page.on('response', response => {
        console.log('Response received:', response.url(),response.status());
    });
   await page.goto("https://rahulshettyacademy.com/client");
   const products = page.locator(".card-body");
  
   
   //await page.getByPlaceholder("email@example.com").fill(email);
   //await page.getByPlaceholder("enter your passsword").fill("Iamking@000");
   //await page.getByRole('button',{name:"Login"}).click();
   await page.waitForLoadState('networkidle');
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles);
  
})
