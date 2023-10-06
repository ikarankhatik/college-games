const express = require('express');
const router = express.Router();
const stripController = require('../controller/stripe');



//user routes
router.post('/create-checkout-session', stripController.create);



module.exports = router;