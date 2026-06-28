const { z } = require("zod");

// Registration Schema
const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long.")
    .max(100, "Name cannot exceed 100 characters."),

  email: z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(100, "Password cannot exceed 100 characters."),

  role: z
    .enum(["ADMIN", "ENGINEER", "CUSTOMER"])
    .optional()
    .default("CUSTOMER"),
});


// Login Schema
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address."),

  password: z
    .string()
    .min(1, "Password is required."),
});

module.exports = {
  registerSchema,
  loginSchema,
};