const express = require("express");

const authRoutes = require("./auth.routes");
const ticketRoutes = require("./ticket.routes");

const router = express.Router();

// Authentication Routes
router.use("/auth", authRoutes);

// Ticket Routes
router.use("/tickets", ticketRoutes);

module.exports = router;