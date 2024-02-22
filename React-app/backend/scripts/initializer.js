const Settings = require("./models/Settings");
const Project = require("./models/Project");
const User = require("./models/User");

async function initializeDefaultSettings() {
  try {
    // Find or create the default user
    let defaultUser = await User.findOne({ username: "defaultuser" });
    if (!defaultUser) {
      defaultUser = await User.create({
        username: "defaultuser",
        email: "default@example.com" /* other user properties */,
      });
    }

    // Find or create the default project
    let defaultProject = await Project.findOne({ name: "Default Project" });
    if (!defaultProject) {
      defaultProject = await Project.create({
        name: "Default Project" /* other project properties */,
      });
    }

    // Check if default settings already exist for the default project
    const existingSettings = await Settings.findOne({
      projectId: defaultProject._id,
    });
    if (!existingSettings) {
      // Create default settings for the default project
      await Settings.create({
        projectId: defaultProject._id,
        customFields: {
          /* default custom fields */
        },
      });
    }
  } catch (error) {
    console.error("Error initializing default settings:", error);
  }
}

module.exports = initializeDefaultSettings;
