const Joi = require('joi');

// Define validation schema for sign-up and sign-in data
const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
});

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Middleware to validate sign-up data
function validateSignUpData(req, res, next) {
  const { error } = signUpSchema.validate(req.body.data);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
}

// Middleware to validate sign-in data
function validateSignInData(req, res, next) {
  const { error } = signInSchema.validate(req.body.data);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
}

module.exports = {
  validateSignUpData,
  validateSignInData,
};
