const express = require('express');
const router = express.Router();
const principleController = require('../controller/principle');
const passport = require('../middleware/passportJwtAuth');
// Import the validateData middleware
const { validateSignUpData, validateSignInData } = require('../middleware/validateSchema');


//user signup route
router.post('/sign-up', validateSignUpData,  principleController.signUp);
//user signin route
router.post('/sign-in', validateSignInData, passport.authenticate('local',{session : false}), principleController.signIn);

router.get('/logout', passport.authenticate('jwt',{session : false}), principleController.logout);


module.exports = router;