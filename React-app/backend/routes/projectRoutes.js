// Import necessary modules and models
const express = require("express");
const Project = require("../models/Project");
const { body, query, param } = require("express-validator");
const validate = require("../middleware/validation"); // Import the validation middleware

// Validation middleware for creating a task
const createProjectValidation = [
  body("name").notEmpty().withMessage("name is required"),
  // Add validation rules for other fields as needed
];
// Create an Express router
const router = express.Router();

// POST /api/projects
router.post(
  "/api/projects",
  createProjectValidation,
  validate,
  async (req, res) => {
    try {
      const { name } = req.body;
      // Create a new project
      const project = await Project.create({ name });
      // Add the project to the user's list of projects
      req.user.projects.push(project);
      await req.user.save();
      res.status(201).json({ project });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/projects/:id
router.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/projects
router.get("/api/projects", async (req, res) => {
  try {
    // Populate the projects field of the user document
    await req.user.populate("projects");
    res.json({ projects: req.user.projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Export the Module
module.exports = router;
