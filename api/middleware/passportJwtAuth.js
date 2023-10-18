const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const Principle = require('../models/principle');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY, // Replace with your secret key
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log(jwt_payload.id,"pergopirjoghrthorthorthobrotbeoreoboerbore");
    try {
      const principle = await Principle.findById(jwt_payload.id);

      if (!principle) {
        return done(null, false);
      }

      return done(null, principle);
    } catch (error) {
      return done(error, false);
    }
  })
);

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

module.exports = passport;
