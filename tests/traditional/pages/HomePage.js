class HomePage {
    constructor(page) {
        this.page = page;
        this.logo = page.locator('.logo');
        this.cartCount = page.locator('#cartCount');
        this.authArea = page.locator('#authArea');
        this.heroTitle = page.locator('.hero h1');
        this.heroSubtitle = page.locator('.hero p');
        this.productGrid = page.locator('#productGrid');
        this.productCards = page.locator('.product-card');
        this.searchInput = page.locator('#searchInput');
        this.searchBtn = page.locator('#searchBtn');
        this.categoryFilter = page.locator('#categoryFilter');
        this.logoutBtn = page.locator('#logoutBtn');
        this.addItemBtn = page.locator('.add-to-cart-btn');
        this.toast = page.locator('#toast');
        this.cartLink = page.locator('.cart-link');
    }

    async goto() {
        await this.page.goto('/');
    }
}

module.exports = { HomePage };