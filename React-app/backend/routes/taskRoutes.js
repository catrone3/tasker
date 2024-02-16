// Import necessary modules and models
const express = require("express");
const Task = require("../models/Task");
const { body, query, param } = require("express-validator");
const validate = require("../middleware/validation"); // Import the validation middleware
const extractProjectId = require("../middleware/extractProjectId");

// Validation middleware for creating a task
const createTaskValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("dueDate").isISO8601().toDate().withMessage("Invalid due date format"),
  body("urgency")
    .isIn(["High", "Medium", "Low"])
    .withMessage("Invalid urgency level"),
  body("projectId").exists().withMessage("Project ID is required"),
  body("completed")
    .isBoolean()
    .withMessage("Completed field must be a boolean"),
  // Add validation rules for other fields as needed
];
// Create an Express router
const router = express.Router();

// Route to get paginated tasks
router.get("/api/tasks", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 tasks per page if not provided

    const startIndex = (page - 1) * limit;

    const tasks = await Task.find({ assignedTo: req.user._id })
      .skip(startIndex)
      .limit(limit);

    const totalTasks = await Task.countDocuments();
    const totalPages = Math.ceil(totalTasks / limit);

    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
      totalTasks: totalTasks,
    };

    res.json({ tasks, pagination });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/projects/:projectId/tasks
router.get(
  "/api/projects/:projectId/tasks",
  extractProjectId,
  async (req, res) => {
    try {
      const tasks = await Task.find({ project: req.params.projectId });
      res.json({ tasks });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/projects/:projectId/tasks
router.post(
  "/api/projects/:projectId/tasks",
  extractProjectId,
  createTaskValidation,
  validate,
  async (req, res) => {
    try {
      const { title, description, dueDate, urgency, completed, assignedTo } =
        req.body;
      const newTask = new Task({
        title,
        description,
        dueDate,
        urgency,
        completed,
        projectId: req.params.projectId,
        assignedTo,
        createdBy: req.user._id,
      });
      const savedTask = await newTask.save();
      res.status(201).json({ task: savedTask });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE /api/projects/:projectId/tasks/:taskId
router.delete(
  "/api/projects/:projectId/tasks/:taskId",
  extractProjectId,
  async (req, res) => {
    try {
      const { taskId } = req.params;
      await Task.findByIdAndDelete(taskId);
      res.json({ message: "Task deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Define route to retrieve the next task to work on
router.get("/api/tasks/next", async (req, res) => {
  try {
    // Fetch all tasks from the database
    const tasks = await Task.find({ assignedTo: req.user._id });

    // Calculate priority score for each task
    const weightedTasks = tasks.map((task) => {
      // Calculate due date factor (0 to 1) based on days until due date
      const daysUntilDue = Math.max(
        0,
        (task.dueDate - Date.now()) / (1000 * 60 * 60 * 24)
      ); // Convert milliseconds to days
      const dueDateFactor = 1 / (1 + daysUntilDue); // Inverse relationship: closer due date => higher factor

      // Assign urgency factor based on urgency level (could be defined as a constant or from the task object)
      const urgencyFactor =
        task.urgency === "High"
          ? 1
          : task.urgency === "Medium"
          ? 0.5
          : task.urgency === "Low"
          ? 0.25
          : 0; // Default to lowest urgency if not specified

      // Calculate priority score
      const weight1 = 0.7; // Weight for due date factor
      const weight2 = 0.3; // Weight for urgency factor
      const priorityScore = weight1 * dueDateFactor + weight2 * urgencyFactor;

      // Return task with priority score
      return { task, priorityScore };
    });

    // Sort tasks by priority score in descending order
    weightedTasks.sort((a, b) => b.priorityScore - a.priorityScore);

    // Select the task with the highest priority score
    const nextTask = weightedTasks[0].task;

    // Return the next task as the response
    res.json(nextTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const updateTaskValidation = [
  param("id").isMongoId().withMessage("Invalid task ID"),
  body("title").optional().notEmpty().withMessage("Title is required"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description is required"),
  body("dueDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid due date format"),
  body("urgency")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Invalid urgency level"),
  // Add validation rules for other fields as needed
];

// Route to update a task
router.put(
  "/api/tasks/:id",
  updateTaskValidation,
  validate,
  async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(updatedTask);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

const searchValidation = [
  query("query").trim().notEmpty().withMessage("Search query is required"),
];

// Route to search tasks by title or description
router.get(
  "/api/tasks/search",
  searchValidation,
  validate,
  async (req, res) => {
    try {
      const query = req.query.query; // Search query parameter

      const tasks = await Task.find({
        assignedTo: req.user._id,
        $or: [
          { title: { $regex: query, $options: "i" } }, // Case-insensitive search by title
          { description: { $regex: query, $options: "i" } }, // Case-insensitive search by description
        ],
      });

      res.json(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

const dueDateFilterValidation = [
  query("startDate").isISO8601().withMessage("Invalid start date format"),
  query("endDate").isISO8601().withMessage("Invalid end date format"),
];

// Route to filter tasks by due date range
router.get(
  "/api/tasks/filter/by-due-date",
  dueDateFilterValidation,
  validate,
  async (req, res) => {
    try {
      const startDate = new Date(req.query.startDate); // Start date query parameter
      const endDate = new Date(req.query.endDate); // End date query parameter

      const tasks = await Task.find({
        assignedTo: req.user._id,
        dueDate: { $gte: startDate, $lte: endDate }, // Filter tasks with due dates within the specified range
      });

      res.json(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Validation middleware for filtering tasks by urgency
const urgencyFilterValidation = [
  query("urgency")
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid urgency level"),
];

// Validation middleware for filtering tasks by completion status
const completionStatusFilterValidation = [
  query("completed")
    .isBoolean()
    .withMessage("Completed status must be a boolean value"),
];

// Apply validation middleware to the respective route handlers
router.get(
  "/api/tasks/filter/by-urgency",
  urgencyFilterValidation,
  validate,
  async (req, res) => {
    try {
      const { urgency } = req.query;

      const tasks = await Task.find({ userId: req.user._id, urgency });

      res.json(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/api/tasks/filter/by-completion-status",
  completionStatusFilterValidation,
  validate,
  async (req, res) => {
    try {
      const { completed } = req.query;

      const tasks = await Task.find({ userId: req.user._id, completed });

      res.json(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

//Export the Module
module.exports = router;
