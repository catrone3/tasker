const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, param } = require("express-validator");
const validate = require("../middleware/validationMiddleware"); // Import the validation middleware
const User = require("../models/User");

// Validation middleware for user registration
const registerValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)
    .withMessage(
      "Password must contain at least one number and one special character"
    ),
];

// Route for user registration
router.post("/api/register", registerValidation, validate, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const passwordUpdateValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)
    .withMessage(
      "Password must contain at least one number and one special character"
    ),
];

// Update password endpoint
router.put(
  "/api/users/:id/password",
  passwordUpdateValidation,
  validate,
  async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
      // Find the user by ID
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the current password is correct
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid current password" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Validation middleware for updating user email
const emailUpdateValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  body("newEmail").isEmail().withMessage("Invalid email format"),
  body("newEmail").notEmpty().withMessage("New email is required"),
];

// Update email endpoint
router.put(
  "/api/users/:id/email",
  emailUpdateValidation,
  validate,
  async (req, res) => {
    const { id } = req.params;
    const { newEmail } = req.body;

    try {
      // Find the user by ID
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the user's email
      user.email = newEmail;
      await user.save();

      res.status(200).json({ message: "Email updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;