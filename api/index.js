const express = require('express');
require('dotenv').config()
const app = express();
const db = require('./config/mongoose');
const cors = require('cors');
const multer = require('multer');



//compatible for the cross origin
app.use(cors({
    exposedHeaders: ['Authorization']
  }));
app.use(express.json());
app.use('/uploads', express.static('uploads'))
// use express router
app.use('/api', require('./routes'));


const Port = process.env.PORT || 4000
// server start here 
app.listen(Port, function(err){
    if(err){
        console.log("Error", err);
    }
    console.log("Server running on port::  " + Port);
});