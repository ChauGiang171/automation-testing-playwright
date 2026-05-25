// @ts-check
const { test, expect } = require('@playwright/test');
const {HomePage} = require("../pages/HomePage");
const {CartPage} = require("../pages/CartPage");

/**
 * Mocking Test
 * Tests using intercepted API responses to simulate edge cases
 */

test.describe('Mocking API Responses', () => {

  test('should display error state when API fails', async ({ page }) => {
    // Intercept the products API and return an error
    await page.route('**/api/products*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    const homePage = new HomePage(page);
    await homePage.goto();
    
    // The product grid should be empty
    await expect(homePage.productCards).toHaveCount(0);
  });

  test('should handle slow API responses gracefully', async ({ page }) => {
    // Intercept products API and add a 3-second delay
    await page.route('**/api/products*', async route => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      route.continue();
    });

    const homePage = new HomePage(page);
    await homePage.goto();
    
    // Page should still be usable during loading
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.searchInput).toBeVisible();
    
    // Products should eventually appear
    await expect(homePage.productCards).toHaveCount(6, { timeout: 10000 });
  });

  test('should display out-of-stock correctly', async ({ page }) => {
    // Return products where one has zero stock
    await page.route('**/api/products*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            name: 'Wireless Headphones',
            price: 79.99,
            category: 'electronics',
            image: 'headphones.svg',
            stock: 0
          },
          {id: 2, name: 'Mechanical Keyboard', price: 129.99, category: 'electronics', image: 'keyboard.svg', stock: 8}
        ])
      });
    });

    const homePage = new HomePage(page);
    await homePage.goto();

    // Should display 2 products
    await expect(homePage.productCards).toHaveCount(2);

    // First product should show out of stock indicator
    const outOfStockProduct = homePage.productCards.filter({hasText: 'Wireless Headphones'});
    await expect(outOfStockProduct.locator('.product-stock')).toContainText(/out of stock|0/i);
  });

  test('should handle add-to-cart failure', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    
    // Let the page load normally, then intercept cart POST
    await page.route('**/api/cart', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Insufficient stock' })
        });
      } else {
        route.continue();
      }
    });
    
    // Try to add an item
    await homePage.addItemBtn.first().click();
    
    // Should show error feedback
    await expect(homePage.toast).toBeVisible();
  });

  test('should handle network timeout', async ({ page }) => {
    // Abort the request to simulate network failure
    await page.route('**/api/products*', route => {
      route.abort('timedout');
    });

    const homePage = new HomePage(page);
    await homePage.goto();
    
    // Page structure should still render
    await expect(homePage.logo).toBeVisible();
    
    // No products should display
    await expect(homePage.productCards).toHaveCount(0);
  });

});
