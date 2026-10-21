import test from '@playwright/test';

interface TestDataForProduct {
    productName: string;
};

export const baseTest = test.extend<{ testDataForProduct: TestDataForProduct }>({
    testDataForProduct: { productName: "ZARA COAT 3" },
});