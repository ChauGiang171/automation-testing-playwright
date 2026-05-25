// @ts-check
const { expect } = require('@playwright/test');
const { test } = require('../fixtures/pages');
/**
 * Homepage Test
 * Tests for the main landing page of TechMart
 */

test.describe('Homepage', () => {
  
  test.beforeEach(async ({ page, homePage }) => {
    // Clear cart before each test for consistent state
    await page.request.delete('http://localhost:3000/api/cart');
    // Navigate to homepage before each test
    await homePage.goto();
  });

  test('should display the page title', async ({ page }) => {
    // Verify the page title contains TechMart
    await expect(page).toHaveTitle(/TechMart/);
  });

  test('should display the logo in the navbar', async ({ homePage }) => {
    // Check that the logo is visible
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.logo).toHaveText(/TechMart/);
  });

  test('should display the hero section', async ({ homePage }) => {
    // Verify hero section content
    await expect(homePage.heroTitle).toHaveText('Welcome to TechMart');
    await expect(homePage.heroSubtitle).toContainText('best tech accessories');
  });

  test('should display product cards', async ({ homePage }) => {
    // Wait for products to load
    await expect(homePage.productGrid).toBeVisible();
    
    // Check that at least one product card exists
    await expect(homePage.productCards).toHaveCount(6); // We have 6 products
  });

  test('should display product information correctly', async ({ homePage }) => {
    const firstProduct = homePage.productCards.first();
    await expect(firstProduct.locator('.product-info h3')).toBeVisible();
    await expect(firstProduct.locator('.product-price')).toBeVisible();
    await expect(firstProduct.locator('.product-stock')).toBeVisible();
    await expect(firstProduct.locator('.add-to-cart-btn')).toBeVisible();
  });

  test('should have a working search bar', async ({ page, homePage }) => {
    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.searchBtn).toBeVisible();
    
    // Type in search bar
    await homePage.searchInput.fill('Keyboard');
    await homePage.searchBtn.click();

    // Wait for filtered results
    await page.waitForTimeout(500);

    // Should show only keyboard product
    await expect(homePage.productCards).toHaveCount(1);
  });

  test('should filter products by category', async ({ page, homePage }) => {
    // Select electronics category
    await homePage.categoryFilter.selectOption('electronics');
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Check that all visible products are electronics
    const count = await homePage.productCards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(6); // Not all products
  });

  test('should display cart count in navbar', async ({ homePage }) => {
    await expect(homePage.cartCount).toBeVisible();
    await expect(homePage.cartCount).toHaveText('0');
  });

  test('should have login and signup buttons', async ({ homePage }) => {
    await expect(homePage.authArea.locator('text=Login')).toBeVisible();
    await expect(homePage.authArea.locator('text=Sign Up')).toBeVisible();
  });

  test('should have add item to cart', async  ({ homePage }) => {
    const addItem = homePage.addItemBtn.first();
    await addItem.click();

    await expect(homePage.toast).toBeVisible();
    await expect(homePage.toast).toContainText('Added to cart');
    await expect(homePage.cartCount).toBeVisible();
    await expect(homePage.cartCount).toHaveText('1');

  });

});
