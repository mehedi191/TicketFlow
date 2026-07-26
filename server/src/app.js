const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const apiLimiter = require("./middleware/rateLimit.middleware");
const ticketRoutes = require("./routes/ticket.routes");
const commentRoutes = require("./routes/comment.routes");

const routes = require("./routes");

const app = express();

// Middleware
app.use(helmet());
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
app.use("/api", apiLimiter);
app.use("/api", routes);

module.exports = app;