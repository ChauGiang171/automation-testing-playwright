const {test: base} =require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { LoginPage } = require('../pages/LoginPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { RegisterPage} = require('../pages/RegisterPage');

const test = base.extend({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },

    checkoutPage: async ({page}, use) =>{
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },

    registerPage: async ({page}, use) =>{
        const registerPage = new RegisterPage(page);
        await use(registerPage);
    }
});

module.exports = { test };