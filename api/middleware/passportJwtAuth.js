const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const LocalStrategy = require('passport-local').Strategy;

const Principle = require('../models/principle');

const cookieExtractor = req =>{
  
  let token = null;
  if(req && req.cookies){
      token = req.cookies["access_token"];
  }
  return token;
}

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_KEY, 
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      console.log(jwt_payload);
      const principle = await Principle.findById(jwt_payload.sub);

      if (!principle) {
        return done(null, false);
      }
      
      return done(null, principle);

    } catch (error) {
      // Log the error for debugging purposes
      console.error("JWT strategy error:", error);
      console.log(";giodigiodgosnd");
      // Pass the error to the done callback with a false value to indicate failure
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
