const { z } = require("zod");

const createCommentSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, "Comment must be at least 2 characters.")
    .max(1000, "Comment cannot exceed 1000 characters."),
});

module.exports = {
  createCommentSchema,
};