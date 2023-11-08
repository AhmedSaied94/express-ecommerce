const { model } = require("mongoose");

const mongoUser = process.env.MONGO_USER || "saied";
const mongoPass = process.env.MONGO_PASS || "ahmed7said";
const mongoHost = process.env.MONGO_HOST || "localhost";
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoDb = process.env.MONGO_DB || "express-ecommerce";

const MONGO_URI =
  // `mongodb+srv://${mongoUser}:${mongoPass}@${mongoHost}/${mongoDb}?retryWrites=true&w=majority`; // for mongodb atlas
  `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`; // for local mongodb

module.exports = MONGO_URI;
