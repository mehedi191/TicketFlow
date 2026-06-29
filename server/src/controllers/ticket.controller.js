const { createTicket } = require("../services/ticket.service");
const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const create = async (req, res) => {
  try {
    const ticket = await createTicket({
      ...req.body,
      userId: req.user.id,
    });

    return successResponse(
      res,
      "Ticket created successfully.",
      ticket,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  create,
};