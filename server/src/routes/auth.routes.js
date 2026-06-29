const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  register,
  login,
  me,
} = require("../controllers/auth.controller");

const validate = require("../middleware/validate.middleware");

const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validator");

const router = express.Router();

// Register
router.post(
  "/register",
  validate(registerSchema),
  register
);

// Login
router.post(
  "/login",
  validate(loginSchema),
  login
);

// Current Logged-in User
router.get(
  "/me",
  authenticate,
  me
);

// Test Customer Route
router.get(
  "/customer",
  authenticate,
  authorize("CUSTOMER"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Customer!",
      user: req.user,
    });
  }
);

// Test Admin Route
router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin!",
      user: req.user,
    });
  }
);

module.exports = router;