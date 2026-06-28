const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.parse(req.body);

      // Replace the request body with the validated/transformed data
      req.body = result;

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.issues,
      });
    }
  };
};

module.exports = validate;