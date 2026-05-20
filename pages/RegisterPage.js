class RegisterPage {
    constructor(page) {
        this.page = page;

        // Form title
        this.title = page.locator('h1');

        // Form inputs
        this.nameInput = page.locator('#name');
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.confirmPasswordInput = page.locator('#confirmPassword');

        // Button
        this.submitBtn = page.locator('button[type="submit"]');

        // Messages
        this.toast = page.locator('#toast');
        this.errorMessage = page.locator('#errorMessage');

        // Auth switch
        this.loginLink = page.locator('text=Login here');
    }

    async goto() {
        await this.page.goto('/register.html');
    }
}

module.exports = { RegisterPage };