const express = require('express');
require('dotenv').config();
const app = express();
const db = require('./config/mongoose');
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require("./middleware/passportLocalStrategy");
const MongoDBStore = require('connect-mongodb-session')(session);

// Compatible for cross-origin requests
app.use(cors({
  exposedHeaders: ['Authorization'],
}));
app.use(express.json());

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'sessions',
  expires: 60 * 60 * 24, // Session TTL in seconds (1 day)
}, (error) => {
  if (error) {
    console.error('Error initializing MongoDBStore:', error);
  }
});

// Handle MongoDBStore errors
store.on('error', (error) => {
  console.error('MongoDBStore error:', error);
});

app.use(
  session({
    name: 'ipangram',
    secret: 'basvbawbha',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60 * 60 * 1000, // Session expiration time
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static('uploads'));

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
