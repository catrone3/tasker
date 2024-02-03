// routes/auth.js

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const User = require("../models/User");
const Token = require("../models/Token");
const validate = require("../middleware/validationMiddleware");

const router = express.Router();

// Validation middleware for login route
const loginValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/api/login", loginValidation, validate, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, jwtSecretKey, {
      expiresIn: "1h",
    });

    // Store token in MongoDB
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry
    const tokenData = new Token({ token, userId: user._id, expiresAt });
    await tokenData.save();

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// routes/auth.js

router.post("/api/logout", async (req, res) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    // Remove token from MongoDB
    await Token.deleteOne({ token });

    // Respond with a success message
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
