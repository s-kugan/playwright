import{test, expect, request, APIRequestContext} from '@playwright/test';
import { APIUtils } from '../utils/APIUtils';
//const loginPayLoad = {userEmail:"anshika@gmail.com",userPassword:"Iamking@000"};
const loginPayLoad = {userEmail:"deepa@deepa.com",userPassword:"Abcd@6666"};
const orderPayLoad = {orders:[{country:"Cuba",productOrderedId:"6960eac0c941646b7a8b3e68"}]};

let token:any;
let orderID:any;
let apiContext: APIRequestContext;

test.beforeAll( async()=>
{
   apiContext = await request.newContext();
   const apiUtils = new APIUtils(apiContext, loginPayLoad);
   token = await apiUtils.getToken();
   orderID = await apiUtils.createOrder(orderPayLoad);
   
});

test.beforeEach(async()=>{

});
 
 
//create order is success
test('@WebAPI Place the order', async ({page})=>
{    

// Inject the token into local storage before navigating to the page
    await page.addInitScript(value => { 
        window.localStorage.setItem('token',value);
    }, token );

await page.goto("https://rahulshettyacademy.com/client");
await page.locator("button[routerlink*='myorders']").click();
await page.locator("tbody").waitFor();
const rows = await page.locator("tbody tr");
 
 
for(let i =0; i<await rows.count(); ++i)
{
   const rowOrderId =await rows.nth(i).locator("th").textContent();
   if (orderID.includes(rowOrderId))
   {
       await rows.nth(i).locator("button").first().click();
       break;
   }
}
const orderIdDetails =await page.locator(".col-text").textContent();
//await page.pause();
expect(orderID.includes(orderIdDetails)).toBeTruthy();
 
});
 
//Verify if order created is showing in history page
// Precondition - create order -