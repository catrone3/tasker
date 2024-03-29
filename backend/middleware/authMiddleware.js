// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecretKey = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  // Check if the Authorization header exists
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  // Check if the Authorization header starts with "Bearer"
  const authHeader = req.headers.authorization;
  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        message: "Invalid authorization format. Must be a Bearer token.",
      });
  }
  // Extract the JWT token from the Authorization header
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, jwtSecretKey);
    console.log(decoded);

    // Check if the user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
