// middleware/extractProjectId.js

const Project = require("../models/Project");

const extractProjectId = async (req, res, next) => {
  const projectId = req.params.projectId;

  if (!projectId) {
    return res
      .status(400)
      .json({ message: "Project ID is missing from request parameters" });
  }

  try {
    // Check if the project with the provided ID exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Attach the project ID to the request object for further use
    req.projectId = projectId;
    req.project = project; // Optionally attach the whole project object

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error extracting project ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = extractProjectId;
