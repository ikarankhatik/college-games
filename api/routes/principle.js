const express = require('express');
const router = express.Router();
const passport = require('../middleware/passportLocalStrategy');
const principleController = require('../controller/principle');
// Import the validateData middleware
const { validateSignUpData, validateSignInData } = require('../middleware/validateSignInSignUp');

//user signup route
router.post('/sign-up', validateSignUpData,  principleController.signUp);
//user signin route
router.post('/sign-in', validateSignInData,  passport.authenticate('local'), principleController.signIn);
// Logout route
router.get('/logout', principleController.logout);


module.exports = router;