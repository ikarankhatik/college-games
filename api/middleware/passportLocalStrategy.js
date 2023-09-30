const LocalStrategy = require('passport-local').Strategy;
const Principle = require('../models/principle'); 
const passport = require('passport');

passport.use(new LocalStrategy({
  usernameField: 'email', 
  passwordField: 'password', 
}, async (email, password, done) => {
  try {
    const principle = await Principle.findOne({ email });
    
    if (!principle || principle.password !== password) {
      return done(null, false, { message: 'Invalid credentials' });
    }

    return done(null, principle);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((principle, done) => {
  done(null, principle.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const principle = await Principle.findById(id);
    done(null, principle);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
