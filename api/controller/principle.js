const Principle = require("../models/principle");
const jwt = require('jsonwebtoken'); 
const mongoose = require('mongoose');


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

// checking the sign in data and sending the response
module.exports.signIn = async function (req, res) {   
    try {      
      const principle = await Principle.findOne({
        email: req.body.email,
        password: req.body.password,
      });
      //if principle is in the based than only login
      if (principle) {
        // If user is authenticated, create and send a JWT token
         const token = signToken(principle._id)
         
         res.cookie('access_token', token, { sameSite: 'None' });
         res.json({
          success: true,
          message: "sign in successfully",
          principle         
        });
      } else {
        return res.json({ success: false, message: "Wrong credential" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

module.exports.logout = (req, res) => {
    try {
      // Clear the 'access_token' cookie
      res.clearCookie('access_token');
  
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
  







