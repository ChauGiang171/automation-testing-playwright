const checkoutData = {
    validShippingInfo: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        phone: '1234567890'
    },

    validPaymentInfo: {
        cardName: 'John Doe',
        cardNumber: '4111111111111111',
        expiry: '12/30',
        cvv: '123'
    }
};

const checkoutDataB = {
    validShippingInfo: {
        firstName: 'JohnB',
        lastName: 'DoeB',
        address: '123 Main Street B',
        city: 'New York B',
        state: 'NY',
        zip: 'ABCDEF',
        phone: '1234567890'
    },

    validPaymentInfo: {
        cardName: 'John Doe B',
        cardNumber: '4111111111111111',
        expiry: '12/26',
        cvv: '456'
    }
};

module.exports = {checkoutData, checkoutDataB};