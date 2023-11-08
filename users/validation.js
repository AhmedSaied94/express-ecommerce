const { body } = require("express-validator");

const merchantValidationRules = () => {
  return [
    body("merchant.storeName").isLength({ min: 5, max: 20 }).withMessage("Store name must be at least 5 characters long and at most 20 characters long"),
    body("merchant.storeDescription").optional().isLength({ min: 10, max: 50 }).withMessage("Store description must be at least 10 characters long and at most 50 characters long"),
    body("merchant.storeAddress").optional().isLength({ min: 10, max: 50 }).withMessage("Store address must be at least 10 characters long and at most 50 characters long"),
    body("merchant.storePhone").optional().matches(/^\+[1-9]\d{1,14}$/).withMessage("Please enter a valid phone number starting with + and country code"),
    body("merchant.storeAvatar").optional().isURL().withMessage("Please enter a valid URL")
  ];
};

const registerValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Please enter a valid email address").notEmpty(),
    body("firstName").isLength({ min: 5, max: 10 }).withMessage("First name must be at least 5 characters long and at most 10 characters long"),
    body("lastName").optional().isLength({ min: 5, max: 10 }).withMessage("Last name must be at least 5 characters long and at most 10 characters long"),
    body("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number")
      .notEmpty(),
    // body("role").isIn(["admin", "customer", "merchant"]).withMessage("Role must be one of admin, customer, or merchant").notEmpty(),
    body("address").optional().isLength({ min: 10, max: 50 }).withMessage("Address must be at least 10 characters long and at most 50 characters long"),
    body("phone").optional().matches(/^\+[1-9]\d{1,14}$/).withMessage("Please enter a valid phone number starting with + and country code")

  ];
};

const registerMerchantValidationRules = () => {
  return [
    ...registerValidationRules(),
    body("role").equals("merchant").withMessage("Role must be merchant to register as a merchant").notEmpty(),
    ...merchantValidationRules()
  ];
};

const updateValidationRules = () => {
  return [
    body("email").optional().isEmail().withMessage("Please enter a valid email address").notEmpty(),
    body("firstName").optional().isLength({ min: 5, max: 10 }).withMessage("First name must be at least 5 characters long and at most 10 characters long").notEmpty(),
    body("lastName").optional().isLength({ min: 5, max: 10 }).withMessage("Last name must be at least 5 characters long and at most 10 characters long"),
    body("role").optional().isIn(["admin", "customer", "merchant"]).withMessage("Role must be one of admin, customer, or merchant").notEmpty(),
    body("address").optional().isLength({ min: 10, max: 50 }).withMessage("Address must be at least 10 characters long and at most 50 characters long"),
    body("phone").optional().matches(/^\+[1-9]\d{1,14}$/).withMessage("Please enter a valid phone number starting with + and country code")
  ];
};

const loginValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Please enter a valid email address").notEmpty(),
    body("password").notEmpty()
  ];
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  updateValidationRules,
  registerMerchantValidationRules
};
