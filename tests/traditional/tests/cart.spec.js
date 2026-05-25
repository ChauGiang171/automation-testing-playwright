// @ts-check
const { expect } = require('@playwright/test');
const { test } = require('../fixtures/pages');
/**
 * Shopping Cart Test
 * Tests for cart functionality including add, update, and remove items
 */

test.describe('Shopping Cart', () => {
  
  test.beforeEach(async ({ page, homePage }) => {
    // Clear cart before each test via API
    await page.request.delete('http://localhost:3000/api/cart');
    await homePage.goto();
  });

  test('should add item to cart', async ({ homePage }) => {
    // Click add to cart on first product
    const addItem = homePage.addItemBtn.first();
    await addItem.click();

    // Verify toast message appears
    await expect(homePage.toast).toBeVisible();
    await expect(homePage.toast).toContainText('Added to cart');
    
    // Verify cart count updates
    await expect(homePage.cartCount).toBeVisible();
    await expect(homePage.cartCount).toHaveText('1');
  });

  test('should navigate to cart page', async ({ page, homePage, cartPage }) => {
    await homePage.addItemBtn.first().click();

    // Wait Cart update
    await expect(homePage.cartCount).toHaveText('1');

    // Click cart link on navbar
    await homePage.cartLink.first().click();

    // Verify cart page
    await expect(page).toHaveURL('/cart.html');
    await expect(cartPage.title).toHaveText('Your Shopping Cart');
  });

  test('should display cart items correctly', async ({ page, cartPage}) => {
    // Add item via API for consistency
    await page.request.post('http://localhost:3000/api/cart', {
      data: { productId: 1, quantity: 2 }
    });
    
    // Navigate to cart
    await cartPage.goto();
    
    // Verify cart item is displayed
    await expect(cartPage.cartItems).toHaveCount(1);
    
    // Verify quantity is correct
    await expect(cartPage.qtyValue).toHaveText('2');
  });

  test('should update item quantity', async ({ page, cartPage }) => {
    // Add item first
    await page.request.post('http://localhost:3000/api/cart', {
      data: { productId: 1, quantity: 1 }
    });
    
    await cartPage.goto();
    
    // Click increase quantity button
    await cartPage.qtyIncreaseBtn.click();

    // Wait for update & Verify quantity increased
    await expect(cartPage.qtyValue).toHaveText('2');
  });

  test('should remove item from cart', async ({ page, cartPage }) => {
    // Add item first
    await page.request.post('http://localhost:3000/api/cart', {
      data: { productId: 1, quantity: 1 }
    });

    await cartPage.goto();
    
    // Click remove button
    await cartPage.removeBtn.click();

    // Wait for removal & Verify empty cart message appears
    await expect(cartPage.emptyCart).toBeVisible();
  });

  test('should clear entire cart', async ({ page, cartPage }) => {
    // Add multiple items
    await page.request.post('http://localhost:3000/api/cart', {
      data: { productId: 1, quantity: 1 }
    });
    await page.request.post('http://localhost:3000/api/cart', {
      data: { productId: 2, quantity: 1 }
    });
    
    await cartPage.goto();

    // Click clear cart button
    await cartPage.clearCartBtn.click();

    // Wait for clear & Verify cart is empty
    await expect(cartPage.emptyCart).toBeVisible();
  });

  test('should calculate correct totals', async ({ page, cartPage }) => {
    // Add item with known price ($79.99 for product 1)
    await page.request.post('http://localhost:3000/api/cart', {
      data: { productId: 1, quantity: 2 }
    });
    
    await cartPage.goto('/cart.html');
    
    // Verify total (2 × $79.99 = $159.98)
    await expect(cartPage.total).toContainText('159.98');
  });

  test('should show empty cart message when cart is empty', async ({ page, cartPage }) => {
    await cartPage.goto();
    
    // Verify empty cart elements are visible
    await expect(cartPage.emptyCart).toBeVisible();
    await expect(cartPage.emptyCart).toContainText('Your cart is empty');
    
    // Verify "Start Shopping" button exists
    await expect(cartPage.startShoppingBtn).toBeVisible();
  });

});
