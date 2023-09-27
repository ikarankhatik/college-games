const express = require('express');
const router = express.Router();

const principleController = require('../controller/principle');
// Import the validateData middleware
const { validateSignUpData, validateSignInData } = require('../middleware/validateSignInSignUp');

//user routes
router.post('/sign-up', validateSignUpData, principleController.signUp);
router.post('/sign-in', validateSignInData, principleController.signIn);

module.exports = router;