const express = require('express');
const router = express.Router();

const principleController = require('../controller/principle');

//user routes
router.post('/sign-up', principleController.signUp);
router.post('/sign-in',principleController.signIn);

module.exports = router;