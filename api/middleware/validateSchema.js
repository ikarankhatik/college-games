const Joi = require("joi");

// Define validation schema for sign-up and sign-in data
const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
});

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Define Joi schemas for studentSchema validation
const studentSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  photo: Joi.string(),
  college: Joi.string().hex().length(24),
  personalData: Joi.object({
    gender: Joi.string().valid('male', 'female').required(),
    address: Joi.string().required(),
    hobbies: Joi.array().items(Joi.string()),
  }).required(),
  date: Joi.date().required(),
  interestedGames: Joi.array().items(Joi.string()),
});

// Middleware to validate sign-up data
function validateSignUpData(req, res, next) {
  const { error } = signUpSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
}

// Middleware to validate sign-in data
function validateSignInData(req, res, next) {
  const { error } = signInSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
}

// Middleware function to validate the student schema
function validateStudentData(req, res, next) {
  req.body.personalData = JSON.parse(req.body.personalData);
  req.body.interestedGames = JSON.parse(req.body.interestedGames);
  //console.log(req.body);
  const { error } = studentSchema.validate(req.body);
  

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
}

module.exports = {
  validateSignUpData,
  validateSignInData,
  validateStudentData,
};
