const Settings = require("../models/Settings");
const Project = require("../models/Project");
const User = require("../models/User");
const bcrypt = require("bcrypt");

async function initializeDefaultSettings() {
  try {
    // Find or create the default user
    let defaultUser = await User.findOne({ username: "admin" });
    const buffer = Buffer.from("Reset321!@#", "utf-8");

    // Encode the password
    const saltRounds = 10;
    const password = await bcrypt.hash(buffer, saltRounds);
    if (!defaultUser) {
      defaultUser = await User.create({
        username: "admin",
        password: password,
        email: "default@example.com" /* other user properties */,
      });
    }

    const newProject = new Project({ name: "Default" });
    await newProject.save();

    // Check if default settings already exist for the default project
    const existingSettings = await Settings.findOne({
      projectId: newProject._id,
    });
    if (existingSettings === null || existingSettings === undefined) {
      // Create default settings for the default project
      await Settings.create({
        projectId: newProject._id,
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
