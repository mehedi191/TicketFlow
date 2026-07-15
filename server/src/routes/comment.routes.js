const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const { createCommentSchema } = require("../validators/comment.validator");

const {
  create,
  getAll,
} = require("../controllers/comment.controller");

const router = express.Router();

router.post(
  "/:id/comments",
  authenticate,
  validate(createCommentSchema),
  create
);

router.get(
  "/:id/comments",
  authenticate,
  getAll
);

module.exports = router;