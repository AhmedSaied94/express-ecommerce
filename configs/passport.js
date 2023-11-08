const passport = require("passport");
const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../users/models").User;
const jwtSecret = require("./jwt");
const {
  decryptPassword
} = require("./bcrypt");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
};

const generateJWT = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };
  const options = {
    expiresIn: "24h"
  };
  return jwt.sign(payload, jwtSecret, options);
};

const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
  // here we can do a database call to find the user by id
  User.findById(payload.id)
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Invalid token" });
      }
    })
    .catch((err) => done(err, false, { message: "Invalid token" }));
});

const localAuth = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  (email, password, done) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: "No user found with this email"
          });
        } else {
          decryptPassword(password, user, done);
        }
      })
      .catch((err) => done(err, false, { message: err.message }));
  }
);

passport.use(jwtAuth);
passport.use(localAuth);

module.exports = {
  passport,
  generateJWT
};
// };
