// middleware/validationMiddleware.js

const { validationResult } = require("express-validator");

// Validation middleware function
const validate = (req, res, next) => {
  // Extract validation errors from the request
  const errors = validationResult(req);

  // Check if there are any validation errors
  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response
    return res.status(400).json({ errors: errors.array() });
  }

  // If there are no validation errors, proceed to the next middleware or route handler
  next();
};

module.exports = validate;
