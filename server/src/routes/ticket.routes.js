const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
  create,
  getMine,
  getById,
} = require("../controllers/ticket.controller");

const {
  createTicketSchema,
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

// Get Ticket By ID
router.get(
  "/:id",
  authenticate,
  getById
);

module.exports = router;