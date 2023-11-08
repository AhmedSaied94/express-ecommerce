const bcrypt = require("bcrypt");

const saltRounds = 10;

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const decryptPassword = (password, user, done) => {
  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (err) {
      done(null, false, { message: err.message });
    } else if (!isMatch) {
      done(null, false, { message: "Incorrect password" });
    } else {
      done(null, user);
    }
  });
};

module.exports = {
  encryptPassword,
  decryptPassword
};
