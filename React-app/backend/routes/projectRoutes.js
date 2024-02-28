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

      // Check if a project with the same name already exists
      const existingProject = await Project.findOne({ name });

      // If a project with the same name exists, return a 409 Conflict status code
      if (existingProject) {
        return res.status(409).json({ message: "Project name already exists" });
      }

      // Create a new project
      const project = await Project.create({ name });

      // Add the project to the user's list of projects
      req.user.projects.push(project);
      await req.user.save();

      // Create project settings
      const settings = await Settings.create({
        projectId: project._id,
        permissions: [{ user: req.user._id, level: "Admin" }],
      });
      // Return the newly created project
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
    console.log(typeof project);
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

// GET /api/projects/:name
router.get("/api/projects/name/:name", async (req, res) => {
  try {
    const project = await Project.findOne(
      { name: req.params.name },
      { _id: 1 }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ projectId: project._id });
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
    console.log(settings);
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

router.put("/api/projects/:projectId/permissions", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { username, permissions } = req.body;

    // Find the project by ID
    const project = await Settings.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Get the userId of anyone with the admin permission level
    const adminUsers = project.permissions.filter(
      (user) => user.permissions === "Admin"
    );
    console.log(adminUsers);
    const adminUserIds = adminUsers.map((user) => user.user);
    console.log(adminUserIds);

    // Compare adminUserIds to the userId of the requesting user
    if (!adminUserIds.includes(req.user._id)) {
      return res.status(403).json({
        message: "You do not have permission to update project permissions",
      });
    }

    // Update the permissions for the specified user
    const existingUserIndex = project.permissions.findIndex(
      (user) => user.username === username
    );
    if (existingUserIndex !== -1) {
      project.permissions[existingUserIndex].permissions = permissions;
    } else {
      project.permissions.push({ username, permissions });
    }

    // Save the updated project
    await project.save();

    res
      .status(200)
      .json({ message: "Project permissions updated successfully" });
  } catch (err) {
    console.error("Error updating project permissions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Export the Module
module.exports = router;
