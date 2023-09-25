const Principle = require("../models/principle");


// sign up of the principle controller
module.exports.signUp = async function (req, res) {
  console.log(req.body);
    try {
      //finding principle into the data base
      const principle = await Principle.findOne({ email: req.body.data.email });
      //if principle is not present in the data base then only create the principle
      if (!principle) {
        const newPrinciple = await Principle.create(req.body.data);
        
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



// checking the sign in data and sending the response
module.exports.signIn = async function (req, res) {    
    try {      
      const principle = await Principle.findOne({
        email: req.body.data.email,
        password: req.body.data.password,
      });
      //if principle is in the based than only login
      if (principle) {
        return res.json({
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