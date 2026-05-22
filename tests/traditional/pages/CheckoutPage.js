class CheckoutPage {
    constructor(page) {
        this.page = page;

        // Shipping Information
        this.firstName = page.locator('#firstName');
        this.lastName = page.locator('#lastName');
        this.address = page.locator('#address');
        this.city = page.locator('#city');
        this.state = page.locator('#state');
        this.zip = page.locator('#zip');
        this.phone = page.locator('#phone');

        // Payment Information
        this.cardName = page.locator('#cardName');
        this.cardNumber = page.locator('#cardNumber');
        this.expiry = page.locator('#expiry');
        this.cvv = page.locator('#cvv');

        // Order Summary
        this.orderSummary = page.locator('.order-summary-sidebar');
        this.orderItems = page.locator('.order-item');
        this.subtotal = page.locator('#subtotal');
        this.tax = page.locator('#tax');
        this.total = page.locator('#total');

        // Buttons
        this.placeOrderBtn = page.locator('#placeOrderBtn');

        // Confirmation modal
        this.confirmationModal = page.locator('#orderConfirmation');
        this.orderId = page.locator('#orderId');
    }

    async goto() {
        await this.page.goto('/checkout.html');
    }

    async fillShippingInfo(data) {
        await this.firstName.fill(data.firstName);
        await this.lastName.fill(data.lastName);
        await this.address.fill(data.address);
        await this.city.fill(data.city);
        await this.state.selectOption(data.state);
        await this.zip.fill(data.zip);
        await this.phone.fill(data.phone);
    }

    async fillPaymentInfo(data) {
        await this.cardName.fill(data.cardName);
        await this.cardNumber.fill(data.cardNumber);
        await this.expiry.fill(data.expiry);
        await this.cvv.fill(data.cvv);
    }

    async placeOrder() {
        await this.placeOrderBtn.click();
    }

    async getOrderId() {
        return await this.orderId.textContent();
    }
}

module.exports = {CheckoutPage}