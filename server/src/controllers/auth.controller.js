const { registerUser } = require("../services/auth.service");
const {
  successResponse,
  errorResponse,
} = require("../utils/response");

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

module.exports = {
  register,
};