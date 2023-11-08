const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [5, "First name must be at least 5 characters long"],
    maxlength: [20, "First name must be at most 20 characters long"]
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
    minlength: [5, "Last name must be at least 5 characters long"],
    maxlength: [20, "Last name must be at most 20 characters long"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Please enter a valid email"
    ]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true
    // minlength: [8, "Password must be at least 8 characters long"],
    // match: [
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    //   "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    // ]
  },
  role: {
    type: String,
    enum: ["admin", "customer", "merchant"],
    default: "admin"
  },
  address: {
    type: String,
    required: false,
    trim: true,
    minlength: [10, "Address must be at least 10 characters long"],
    maxlength: [50, "Address must be at most 50 characters long"]
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    match: [
      // as e164 format
      /^\+[1-9]\d{1,14}$/,
      "Please enter a valid phone number starting with + and country code"
    ]
  },
  avatar: {
    type: String,
    required: false,
    trim: true,
    default: "https://via.placeholder.com/150"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", UserSchema);

const MerchantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    immutable: true,
    validate: {
      validator: async function (userId) {
        const user = await User.findById(userId);
        return user.role === "merchant";
      },
      message: "User must be a merchant"
    }
  },
  storeName: {
    type: String,
    required: [true, "Store name is required"],
    trim: true,
    minlength: [5, "Store name must be at least 5 characters long"],
    maxlength: [20, "Store name must be at most 20 characters long"]
  },
  storeDescription: {
    type: String,
    required: false,
    trim: true,
    minlength: [10, "Store description must be at least 10 characters long"],
    maxlength: [50, "Store description must be at most 50 characters long"]
  },
  storeAddress: {
    type: String,
    required: false,
    trim: true,
    minlength: [10, "Store address must be at least 10 characters long"],
    maxlength: [50, "Store address must be at most 50 characters long"]
  },
  storePhone: {
    type: String,
    required: false,
    trim: true,
    match: [
      // as e164 format
      /^\+[1-9]\d{1,14}$/,
      "Please enter a valid phone number starting with + and country code"
    ]
  },
  storeAvatar: {
    type: String,
    required: false,
    trim: true,
    default: "https://via.placeholder.com/150"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Merchant = mongoose.model("Merchant", MerchantSchema);

const CustomerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    immutable: true,
    validate: {
      validator: async function (userId) {
        const user = await User.findById(userId);
        return user.role === "customer";
      },
      message: "User must be a customer"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = {
  User,
  Merchant,
  Customer
};
