const express = require("express");

const authRoutes = require("./auth.routes");
const ticketRoutes = require("./ticket.routes");
const commentRoutes = require("./comment.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/tickets", commentRoutes);

module.exports = router;