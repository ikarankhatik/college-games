const express = require('express');
const router = express.Router();
const stripeController = require('../controller/stripe');



//customer routes
//router.post('/create-checkout-session', stripController.create);
// router.post('/create-customer', stripController.createCustomer);
router.get('/config', stripeController.config);
router.post('/create-subscription', stripeController.createSubscription);
// router.post('/check-subscription', stripeController.checkSubscription);                             
router.get('/subscriptions', stripeController.subscriptions);
//router.get('/customer-detail', stripeController.customerDetails);
// router.post('/cancel-subscription', stripeController.cancelSubscription);
module.exports = router;