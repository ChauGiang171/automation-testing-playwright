// @ts-check
const { expect } = require('@playwright/test');
const { test } = require('../fixtures/pages');
const {checkoutData, checkoutDataB} = require('../test-data/checkout-data');
const {CartPage} = require("../pages/CartPage");

/**
 * Checkout Test
 * Tests for the checkout process including form validation and order submission
 */

test.describe('Checkout', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear cart and add an item before each test
    await page.request.delete('http://localhost:3000/api/cart');

    //Add item into transaction
    const res1 = await page.request.post('http://localhost:3000/api/cart', {
      data: { productId: 1, quantity: 1 }
    });
    expect(res1.ok()).toBeTruthy();

    const res2 = await page.request.post('http://localhost:3000/api/cart', {
      data: { productId: 3, quantity: 1 }
    });
    expect(res2.ok()).toBeTruthy();
  });

  test('should redirect to cart if cart is empty', async ({ page, checkoutPage, cartPage }) => {
    // Clear cart
    await page.request.delete('http://localhost:3000/api/cart');
    
    // Try to access checkout
    await checkoutPage.goto();
    
    // Should redirect to cart
    await page.waitForURL();
  });

  test('should display checkout form', async ({ checkoutPage }) => {
    await checkoutPage.goto();

    // Verify shipping form fields
    await expect(checkoutPage.firstName).toBeVisible();
    await expect(checkoutPage.lastName).toBeVisible();
    await expect(checkoutPage.address).toBeVisible();
    await expect(checkoutPage.city).toBeVisible();
    await expect(checkoutPage.state).toBeVisible();
    await expect(checkoutPage.zip).toBeVisible();
    await expect(checkoutPage.phone).toBeVisible();
    
    // Verify payment form fields
    await expect(checkoutPage.cardName).toBeVisible();
    await expect(checkoutPage.cardNumber).toBeVisible();
    await expect(checkoutPage.expiry).toBeVisible();
    await expect(checkoutPage.cvv).toBeVisible();
  });

  test('should display order summary', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    
    // Verify order summary section
    await expect(checkoutPage.orderSummary).toBeVisible();
    
    // Verify item is listed
    await expect(checkoutPage.orderItems).toHaveCount(2);
    
    // Verify totals are displayed
    await expect(checkoutPage.subtotal).toBeVisible();
    await expect(checkoutPage.tax).toBeVisible();
    await expect(checkoutPage.total).toBeVisible();
    await expect(checkoutPage.total).toContainText('$140.38');
  });

  test('should calculate tax correctly', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    
    // Product 1 is $129,99, Product 2 is $88,99 (qty 2 => $179,98)
    // Tax is 8%
    // Tax should be $27,20 (rounded)
    await expect(checkoutPage.tax).toContainText('$10.40');
  });

  test('should format card number with spaces', async ({ checkoutPage }) => {
    await checkoutPage.goto();

    await checkoutPage.cardNumber.fill('1234567890123456');
    
    // Should be formatted as 1234 5678 9012 3456
    await expect(checkoutPage.cardNumber).toHaveValue('1234 5678 9012 3456');
  });

  test('should format expiry date correctly', async ({ checkoutPage }) => {
    await checkoutPage.goto();

    await checkoutPage.expiry.fill('1225');
    
    // Should be formatted as 12/25
    await expect(checkoutPage.expiry).toHaveValue('12/25');
  });

  test('should complete checkout successfully', async ({ checkoutPage }) => {
    await checkoutPage.goto();

    //Fill shipping information
    await checkoutPage.fillShippingInfo(
        checkoutData.validShippingInfo
    );
    
    // Fill payment information
    await checkoutPage.fillPaymentInfo(
        checkoutData.validPaymentInfo
    )
    
    // Submit order
    await checkoutPage.placeOrderBtn.click({timeout: 10000});
    
    // Verify order confirmation modal
    await expect(checkoutPage.confirmationModal).toBeVisible();
    await expect(checkoutPage.confirmationModal).toContainText('Order Confirmed');
    await expect(checkoutPage.orderId).not.toBeEmpty();
  });

  test('should validate required fields', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    
    // Try to submit empty form
    await checkoutPage.placeOrderBtn.click();
    
    // First name should show validation
    const isInvalid = await checkoutPage.firstName.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('should validate ZIP code format', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    
    // Fill all fields but with invalid ZIP
    await checkoutPage.fillShippingInfo(
        checkoutDataB.validShippingInfo
    );

    await checkoutPage.placeOrderBtn.click();
    
    // ZIP should show validation error
    const isInvalid = await checkoutPage.zip.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

});
