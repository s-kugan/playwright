import type { APIRequestContext } from '@playwright/test';

interface LoginPayload {
    userEmail: string;
    userPassword: string;
}

export class APIUtils
{
    private apiContext: APIRequestContext;
    private loginPayLoad: LoginPayload;

    constructor(apiContext: APIRequestContext, loginPayLoad: LoginPayload) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }
    
    async getToken()
    {
           
           const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {data: this.loginPayLoad});
        
           const loginResponseJson = await loginResponse.json();
           const token = loginResponseJson.token;
           console.log(token);
           return token;
    }

    async createOrder(orderPayLoad: object)
    {
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", 
            {data: orderPayLoad, headers: {'Authorization': await this.getToken(), 'Content-Type': 'application/json'}
        });

        const orderResponseJson = await orderResponse.json();
        let orderID = orderResponseJson.orders[0];
        console.log('Order ID*********************:',orderID);
        return orderID;
    }
}
