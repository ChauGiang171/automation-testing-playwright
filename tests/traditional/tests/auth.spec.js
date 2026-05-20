// @ts-check
const { test, expect } = require('@playwright/test');
const {LoginPage} = require('../../../pages/LoginPage');
const {RegisterPage} = require('../../../pages/RegisterPage');
const {HomePage} = require('../../../pages/HomePage');
/**
 * Authentication Test
 * Tests for login, registration, and logout functionality
 */

test.describe('Authentication', () => {

  test.describe('Login', () => {
    
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page)
      await loginPage.goto();
    });

    test('should display login form', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await expect(loginPage.title).toHaveText('Login to TechMart');
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitBtn).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      // Fill in invalid credentials
      const loginPage = new LoginPage(page);
      await loginPage.emailInput.fill('wrong@email.com');
      await loginPage.passwordInput.fill('wrongpassword');
      
      // Submit form
      await loginPage.submitBtn.click();
      
      // Verify error message
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Invalid credentials');
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      // Fill in valid demo credentials
      const loginPage = new LoginPage(page);
      await loginPage.emailInput.fill('demo@techmart.com');
      await loginPage.passwordInput.fill('demo123');
      
      // Submit form
      await loginPage.submitBtn.click();
      
      // Verify toast message
      await expect(loginPage.toast).toContainText('Login successful');
      
      // Verify redirect to homepage
      await page.waitForURL('/');
    });

    test('should show validation for empty fields', async ({ page }) => {
      // Try to submit empty form
      const loginPage = new LoginPage(page);
      await loginPage.submitBtn.click();
      
      // Check that email field shows validation error (browser built-in)
      const isInvalid = await loginPage.emailInput.evaluate((el) => !el.checkValidity());
      expect(isInvalid).toBe(true);
    });

    test('should have link to registration page', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await expect(loginPage.signUpLink).toBeVisible();
      
      await loginPage.signUpLink.click();
      await expect(page).toHaveURL('/register.html');
    });

    test('should display demo credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await expect(loginPage.demoCredentials).toBeVisible();
      await expect(loginPage.demoCredentials).toContainText('demo@techmart.com');
      await expect(loginPage.demoCredentials).toContainText('demo123');
    });

  });

  test.describe('Registration', () => {
    
    test.beforeEach(async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
    });

    test('should display registration form', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await expect(registerPage.title).toHaveText('Create Your Account');
      await expect(registerPage.nameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.confirmPasswordInput).toBeVisible();
    });

    test('should show error for mismatched passwords', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.nameInput.fill('Test User');
      await registerPage.emailInput.fill('test@example.com');
      await registerPage.passwordInput.fill('password123');
      await registerPage.confirmPasswordInput.fill('different123');
      
      await registerPage.submitBtn.click();

      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toContainText('Passwords do not match');
    });

    test('should register new user successfully', async ({ page }) => {
      // Generate unique email to avoid conflicts
      const registerPage = new RegisterPage(page);
      const uniqueEmail = `test${Date.now()}@example.com`;
      
      await registerPage.nameInput.fill('New User');
      await registerPage.emailInput.fill(uniqueEmail);
      await registerPage.passwordInput.fill('password123');
      await registerPage.confirmPasswordInput.fill('password123');
      
      await registerPage.submitBtn.click();
      
      // Verify toast message
      await expect(registerPage.toast).toContainText('Account created');
      
      // Verify redirect to homepage
      await page.waitForURL('/');
    });

    test('should have link to login page', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await expect(registerPage.loginLink).toBeVisible();
      
      await registerPage.loginLink.click();
      await expect(page).toHaveURL('/login.html');
    });

  });

  test.describe('Logout', () => {
    
    test('should logout successfully', async ({ page }) => {
      // Login first
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.emailInput.fill('demo@techmart.com');
      await loginPage.passwordInput.fill('demo123');
      await loginPage.submitBtn.click();
      
      // Wait for redirect and user to be logged in
      const homePage = new HomePage(page)
      await page.waitForURL('/');
      // Verify logged in state
      await expect(homePage.authArea).toContainText('Hi, Demo User');
      
      // Click logout button
      await homePage.logoutBtn.click();
      
      // Verify logged out state
      await expect(homePage.authArea).toContainText('Login');
    });

  });

});
