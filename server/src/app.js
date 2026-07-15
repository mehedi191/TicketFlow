const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");
const ticketRoutes = require("./routes/ticket.routes");
const commentRoutes = require("./routes/comment.routes");

console.log("commentRoutes:", commentRoutes);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TicketFlow API is running successfully.",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", routes);

module.exports = app;