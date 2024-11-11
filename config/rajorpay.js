const Razorpay = require('razorpay');

// Creates an instance of Razorpay configured with API key and secret from environment variables
exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})