const Principle = require("../models/principle");
const jwt = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Customer = require('../models/customer');
const stripe = require("stripe")(
  "sk_test_51NxmblSEekr2cLoVvt2tnHgZZ8mjBusHbOOEYvHpQmnDQKoUBQYv5bA4yVXX1xpf0MM8qd31LqBRcnsBW72hSD7B004tFJqfSB"
);

// sign up of the principle controller
module.exports.signUp = async function (req, res) {
  
    try {
      //finding principle into the data base
      const principle = await Principle.findOne({ email: req.body.data.email });
      //if principle is not present in the data base then only create the principle
      if (!principle) {
        const newPrinciple = await Principle.create(req.body);
        
        //sending the response to the database
        return res.json({
          success: true,
          message: "principle created successfully",
        });
      } else {
        return res.json({
          success: false,
          message: "principle with this email already exists",
        });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };


  const signToken = userID =>{
    return jwt.sign({
        iss : process.env.JWT_KEY,
        sub : userID
    },process.env.JWT_KEY,{expiresIn : "1h"});
}

// checking the sign-in data and sending the response
module.exports.signIn = async function (req, res) {
  try {
    const principle = await Principle.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    let isSubcribe = false;

    if (!principle) {
      return res.json({ success: false, message: "Wrong credential" });
    }

    // Check if a customer with the same principle already exists
    const existingCustomer = await Customer.findOne({ principleId: principle._id });

    if (existingCustomer) {
      // If a customer already exists for this principle, send their Stripe ID in the cookie
      res.cookie('customer', existingCustomer.customer, { maxAge: 900000, httpOnly: true });
      // Retrieve the susbcription from Stripe
      const subscriptions = await stripe.subscriptions.list({
      customer: existingCustomer.customer,
    });
    // Check if the customer already has a subscription
    if (subscriptions.data.length > 0) {
      console.log("chal raha");
       isSubcribe = true;
    }
      // Create and send a JWT token for authentication
      const token = signToken(principle._id);
      res.cookie('access_token', token);

      return res.json({
        success: true,
        message: "Sign in successful",
        principle,
        isSubcribe
      });
    }

    // If no customer exists, create a new Stripe customer
    const customer = await stripe.customers.create({
      email: req.body.email,
    });

    // Create a new Customer document and save it with the associated Principle ID and customer object ID
    const newCustomer = new Customer({
      principleId: principle._id,
      customer: customer.id,
    });

    await newCustomer.save();

    // Create and send a JWT token for authentication
    const token = signToken(principle._id);
    res.cookie('customer', customer.id, { maxAge: 900000, httpOnly: true });
    res.cookie('access_token', token);

    return res.json({
      success: true,
      message: "Sign in successful",
      principle,
      isSubcribe
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


module.exports.logout = (req, res) => {
    try {
      // Clear the 'access_token' cookie
      res.clearCookie('access_token');
      res.clearCookie('customer');
      // Send a JSON response indicating successful logout
      res.json({
        success: true,
        message: "Logout successfully",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      // Send an error response
      res.status(500).json({
        success: false,
        message: "An error occurred during logout",
      });
    }
  };
  







