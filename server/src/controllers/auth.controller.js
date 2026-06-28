const {
  registerUser,
  loginUser,
} = require("../services/auth.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

// Register
const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    return successResponse(
      res,
      "User registered successfully.",
      user,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// Login
const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    return successResponse(
      res,
      "Login successful.",
      result
    );
} catch (error) {
  return errorResponse(res, error.message, 401);
}
};

module.exports = {
  register,
  login,
};