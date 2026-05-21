class CartPage {
    constructor(page) {
        this.page = page;

        // Page title
        this.title = page.locator('h1');

        // Cart items
        this.cartItems = page.locator('.cart-item');
        this.qtyValue = page.locator('.qty-value');
        this.qtyIncreaseBtn = page.locator('.qty-btn').nth(1); // + button
        this.qtyDecreaseBtn = page.locator('.qty-btn').nth(0); // - button
        this.removeBtn = page.locator('.remove-btn');

        // Empty cart state
        this.emptyCart = page.locator('#emptyCart');
        this.startShoppingBtn = page.locator('text=Start Shopping');

        // Order summary
        this.total = page.locator('#total');
        this.clearCartBtn = page.locator('#clearCartBtn');
        this.checkoutBtn = page.locator('#checkoutBtn');


    }

    async goto() {
        await this.page.goto('/cart.html');
    }
}

module.exports = { CartPage };