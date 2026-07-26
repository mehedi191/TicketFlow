const {
  createTicket,
  getMyTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
  getAllTicketsService,
  getDashboardService,
} = require("../services/ticket.service");

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

const getMine = async (req, res) => {
  try {
    const tickets = await getMyTickets(req.user.id);

    return successResponse(
      res,
      "My tickets fetched successfully.",
      tickets
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getById = async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);

    const user = req.user;

    // ADMIN can access every ticket
    if (user.role === "ADMIN") {
      return successResponse(
        res,
        "Ticket fetched successfully.",
        ticket
      );
    }

    // CUSTOMER can access only their own tickets
    if (
      user.role === "CUSTOMER" &&
      ticket.createdById === user.id
    ) {
      return successResponse(
        res,
        "Ticket fetched successfully.",
        ticket
      );
    }

    // ENGINEER can access only assigned tickets
    if (
      user.role === "ENGINEER" &&
      ticket.assignedToId === user.id
    ) {
      return successResponse(
        res,
        "Ticket fetched successfully.",
        ticket
      );
    }

    return errorResponse(
      res,
      "Forbidden. You do not have permission to view this ticket.",
      403
    );
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

const assign = async (req, res) => {
  try {
    const ticket = await assignTicket(
      req.params.id,
      req.body.engineerId
    );

    return successResponse(
      res,
      "Ticket assigned successfully.",
      ticket
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateStatus = async (req, res) => {
  try {
    const ticket = await updateTicketStatus(
      req.params.id,
      req.body.status,
      req.user
    );

    return successResponse(
      res,
      "Ticket status updated successfully.",
      ticket
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getAllTickets = async (req, res) => {
  try {
    const result = await getAllTicketsService(req.query);

    return successResponse(
      res,
      "Tickets fetched successfully.",
      result
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getDashboard = async (req, res) => {
  try {
    const data = await getDashboardService();

    return successResponse(
      res,
      "Dashboard statistics fetched successfully.",
      data
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  create,
  getMine,
  getById,
  assign,
  updateStatus,
  getAllTickets,
  getDashboard,
};