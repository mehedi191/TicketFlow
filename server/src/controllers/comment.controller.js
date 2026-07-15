const {
  addComment,
  getComments,
} = require("../services/comment.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const create = async (req, res) => {
  try {
    const comment = await addComment(
      req.params.id,
      req.body.message,
      req.user
    );

    return successResponse(
      res,
      "Comment added successfully.",
      comment,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getAll = async (req, res) => {
  try {
    const comments = await getComments(
      req.params.id,
      req.user
    );

    return successResponse(
      res,
      "Comments fetched successfully.",
      comments
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  create,
  getAll,
};