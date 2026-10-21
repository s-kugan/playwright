import{test, expect, request, APIRequestContext} from '@playwright/test';
import { APIUtils } from '../utils/APIUtils';
//const loginPayLoad = {userEmail:"anshika@gmail.com",userPassword:"Iamking@000"};
const loginPayLoad = {userEmail:"deepa@deepa.com",userPassword:"Abcd@6666"};
const orderPayLoad = {orders:[{country:"Cuba",productOrderedId:"6960eac0c941646b7a8b3e68"}]};
const fakePayLoadOrders = {data:[],message:"No Orders"}
const orderRequest = "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*";

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
test('@API Place the order', async ({page})=>
{    

// Inject the token into local storage before navigating to the page
    await page.addInitScript(value => { 
        window.localStorage.setItem('token',value);
    }, token );

await page.goto("https://rahulshettyacademy.com/client");
await page.route(orderRequest, async route => {

    const response = await page.request.fetch(route.request());
    //fulfill method send response back to the page
    const body = JSON.stringify(fakePayLoadOrders);
    await route.fulfill({response,body });

});

//https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6ac53a862be7a4bc2b8f7013

await page.locator("button[routerlink*='myorders']").click();
await page.waitForResponse(orderRequest);
console.log(await page.locator(".mt-4").textContent());
await page.locator("tbody").waitFor();
const rows = await page.locator("tbody tr");
 
 

 
});
 
//Verify if order created is showing in history page
// Precondition - create order -