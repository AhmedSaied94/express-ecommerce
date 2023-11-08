const passport = require("passport");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      res.status(401).send({ message: err ? err.message : "Authentication failed" });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};
