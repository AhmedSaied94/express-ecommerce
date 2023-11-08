const express = require("express");
const passport = require("passport");
const { generateJWT } = require("../configs/passport");
const { User, Merchant } = require("./models");
const {
  registerValidationRules,
  loginValidationRules,
  updateValidationRules,
  registerMerchantValidationRules
} = require("./validation");
const { encryptPassword } = require("../configs/bcrypt");
const { validationResult } = require("express-validator");
const isAuthenticated = require("../middlewares/isAuthenticated");
const mongoose = require("mongoose");

const MONGO_URI = require("../configs/mongo");
const connection = mongoose.createConnection(MONGO_URI);

const userRouter = express.Router();

userRouter.post("/register", registerValidationRules(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    const user = new User({
      ...req.body,
      password: await encryptPassword(req.body.password)
    });
    await user.save();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

userRouter.post("/register/merchant", registerMerchantValidationRules(), async (req, res) => {
  const session = await connection.startSession();
  session.startTransaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      session.abortTransaction();
      return res.status(400).send(errors);
    }
    const merchantData = req.body.merchant;
    delete req.body.merchant;
    const user = new User({
      ...req.body,
      password: await encryptPassword(req.body.password)
    });
    await user.save();
    const merchant = new Merchant({
      ...merchantData,
      user: user._id
    });
    await merchant.save();
    session.commitTransaction();
    res.send({ ...merchant.toObject(), user });
  } catch (err) {
    console.log(err);
    session.abortTransaction();
    res.status(500).send(err);
  } finally {
    session.endSession();
  }
});

userRouter.post("/login", loginValidationRules(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : err ? err.message : "Login failed"
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.status(400).send(err);
        }
        const token = generateJWT(user);
        return res.json({ user, token });
      }
      );
    }
    )(req, res);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

userRouter.use(isAuthenticated);

userRouter.get("/profile", (req, res) => {
  res.send(req.user);
});

userRouter.patch("/profile", updateValidationRules(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors);
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = userRouter;
