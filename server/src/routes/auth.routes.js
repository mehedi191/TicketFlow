const express = require("express");

const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");

const {
  register,
  login,
  me,
} = require("../controllers/auth.controller");

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

// Current User
router.get(
  "/me",
  authenticate,
  me
);

module.exports = router;