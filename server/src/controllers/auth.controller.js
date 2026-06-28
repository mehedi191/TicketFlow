const {
  registerUser,
  loginUser,
  getCurrentUser,
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

// Get Current User
const me = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);

    return successResponse(
      res,
      "Current user fetched successfully.",
      user
    );
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

module.exports = {
  register,
  login,
  me,
};