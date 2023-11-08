const mongoose = require("mongoose");
const MONGO_URI = require("./configs/mongo");
const express = require("express");
const passport = require("passport");
const { PORT } = require("./configs/variables");
const userRouter = require("./users/routes");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const app = express();

// configure passport

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use("/users", userRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
