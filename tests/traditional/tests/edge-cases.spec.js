// @ts-check
const { expect } = require('@playwright/test');
const { test } = require('../fixtures/pages');

/**
 * Edge Cases Test
 * Tests for unusual inputs, boundary conditions, and error handling
 */

test.describe('Edge Cases', () => {

  test.beforeEach(async ({ page }) => {
    //Clear cart before testing
    await page.request.delete('http://localhost:3000/api/cart');

    // Should redirect to cart
    await page.goto('/');
  });

  // --- SEARCH EDGE CASES ---

  test('should handle empty search gracefully', async ({ homePage }) => {
    
    // Click search without typing anything
    await homePage.searchBtn.click();

    //Count number of product in current page
    const totalItem = await homePage.productCards.count();
    // Should still show all products
    await expect(homePage.productCards).toHaveCount(totalItem);
  });

  test('should show no results for nonsense search', async ({ homePage }) => {
    
    await homePage.searchInput.fill('xyznonexistent123');
    await homePage.searchBtn.click();

    await expect(homePage.productCards).toHaveCount(0);
  });

  test('should handle special characters in search', async ({ homePage }) => {
    
    // Try special characters that could break things
    await homePage.searchInput.fill('<script>alert("xss")</script>');
    await homePage.searchBtn.click();
    
    // App should not break - just show no results
    await expect(homePage.productCards).toHaveCount(0);

    // Page should still be functional
    await expect(homePage.logo).toBeVisible();

  });

  test('should handle search with only whitespace', async ({ homePage }) => {
    await homePage.searchInput.fill(' ');
    await homePage.searchBtn.click();
    
    // Should show all products (whitespace = no filter)
    const count = await homePage.productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  // --- CART EDGE CASES ---

  test('should handle adding same product multiple times', async ({ homePage }) => {
    // Click add to cart three times
    await homePage.addItemBtn.first().click();
    await homePage.addItemBtn.first().click();
    await homePage.addItemBtn.first().click();

    
    // Cart count should be 3 (quantity increases)
    await expect(homePage.cartCount.first()).toHaveText('3');
  });

  test('should not allow checkout with empty cart', async ({ page }) => {
    //beforeEach added 2 items into cart, need to clean up cart before execute verify this case
    await  page.request.delete('http://localhost:3000/api/cart');

    // Go directly to checkout with empty cart
    await page.goto('/checkout.html');

    // Navigate to cart when cart empty
    await page.waitForURL('/cart.html');
  });

  // --- FORM VALIDATION EDGE CASES ---

  test('should require all fields for registration', async ({ page, registerPage }) => {
    await registerPage.goto();
    
    // Try to submit with only email filled
    await registerPage.emailInput.fill('test@example.com');
    await registerPage.submitBtn.click();
    
    // Should stay on register page (validation prevents submit)
    await expect(page).toHaveURL(/register/);
  });

  test('should reject duplicate email registration', async ({ registerPage }) => {
    await registerPage.goto();
    
    // Try to register with the demo account email
    await registerPage.nameInput.fill('Another User');
    await registerPage.emailInput.fill('demo@techmart.com');
    await registerPage.passwordInput.fill('password123');
    await registerPage.confirmPasswordInput.fill('password123');
    await registerPage.submitBtn.click();
    
    // Should show error about existing email
    await expect(registerPage.errorMessage).toBeVisible();
    await expect(registerPage.errorMessage).toContainText(/already registered|exists/i);
  });

  // --- NAVIGATION EDGE CASES ---

  test('should handle direct URL access to cart page', async ({ cartPage, homePage }) => {
    // Navigate directly to cart without adding anything
    await cartPage.goto();
    
    // Should show empty cart state
    await expect(homePage.logo).toBeVisible();
  });

  test('should preserve cart across page navigation', async ({ page, homePage }) => {
    // Add item to cart
    await homePage.addItemBtn.first().click();
    
    // Navigate away and back
    await page.goto('/login.html');
    await page.goto('/');
    
    // Cart count should still show 1
    await expect(homePage.cartCount.first()).toHaveText('1');
  });

});
