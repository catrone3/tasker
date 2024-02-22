// Import necessary modules and models
const express = require("express");
const Project = require("../models/Project");
const Settings = require("../models/Settings");
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

// Create settings for a project
router.post("/api/projects/:projectId/settings", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, urgency } = req.body;
    const settings = await Settings.create({ projectId, status, urgency });
    res.status(201).json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get settings by project ID
router.get("/api/projects/:projectId/settings", async (req, res) => {
  try {
    const { projectId } = req.params;
    const settings = await Settings.findOne({ projectId });
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update settings by project ID
router.put("/api/projects/:projectId/settings", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, urgency } = req.body;
    const settings = await Settings.findOneAndUpdate(
      { projectId },
      { status, urgency },
      { new: true }
    );
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete settings by project ID
router.delete("/api/projects/:projectId/settings", async (req, res) => {
  try {
    const { projectId } = req.params;
    const settings = await Settings.findOneAndDelete({ projectId });
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json({ message: "Settings deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/projects/:projectId/tasks", async (req, res) => {
  try {
    const { title, description, dueDate /* other task properties */ } =
      req.body;
    const { projectId } = req.params;

    // Fetch project settings
    const projectSettings = await Settings.findOne({ projectId });

    // Use projectSettings.customFields.urgency and projectSettings.customFields.status for dropdown values

    // Create the task with the fetched settings
    const task = await Task.create({
      title,
      description,
      dueDate,
      urgency: projectSettings.customFields.urgency,
      status: projectSettings.customFields.status,
      /* other task properties */
      projectId,
    });

    res.status(201).json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Export the Module
module.exports = router;
