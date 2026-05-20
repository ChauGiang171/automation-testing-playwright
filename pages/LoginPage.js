class LoginPage {
    constructor(page) {
        this.page = page;

        // Form title
        this.title = page.locator('h1');

        // Form inputs
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');

        // Button
        this.submitBtn = page.locator('button[type="submit"]');

        // Messages
        this.toast = page.locator('#toast');
        this.errorMessage = page.locator('#errorMessage');

        // Auth switch
        this.signUpLink = page.locator('text=Sign up here');

        // Demo credentials section
        this.demoCredentials = page.locator('.demo-credentials');
    }

    async goto() {
        await this.page.goto('/login.html');
    }
}

module.exports = { LoginPage };