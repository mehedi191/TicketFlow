const { z } = require("zod");

const assignTicketSchema = z.object({
  engineerId: z
    .string()
    .uuid("Invalid engineer ID."),
});

const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long.")
    .max(100, "Title cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters.")
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .optional()
    .default("MEDIUM"),
});

module.exports = {
  createTicketSchema,
  assignTicketSchema,
};