const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
  create,
  getMine,
  getById,
  assign,
} = require("../controllers/ticket.controller");

const {
  createTicketSchema,
  assignTicketSchema,
} = require("../validators/ticket.validator");

const router = express.Router();

// Create Ticket
router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  validate(createTicketSchema),
  create
);

// Get My Tickets
router.get(
  "/my",
  authenticate,
  getMine
);

// Assign Ticket (Admin Only)
router.patch(
  "/:id/assign",
  authenticate,
  authorize("ADMIN"),
  validate(assignTicketSchema),
  assign
);

// Get Ticket By ID
router.get(
  "/:id",
  authenticate,
  getById
);

module.exports = router;