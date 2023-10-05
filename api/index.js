const express = require('express');
require('dotenv').config();
const app = express();
const db = require('./config/mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport')


app.use(cors({
  origin: 'http://localhost:5173', // Replace with the actual origin of your client-side code
  exposedHeaders: ['Authorization'],
  credentials: true, // Allow credentials (e.g., cookies)
}));
app.use(cookieParser());
app.use(express.json());


app.use('/uploads', express.static('uploads'));
app.use(passport.initialize());


// Use express router
app.use('/api', require('./routes'));

const Port = process.env.PORT || 4000;

// Start the server
app.listen(Port, function (err) {
  if (err) {
    console.log("Error", err);
  }
  console.log("Server running on port: " + Port);
});
