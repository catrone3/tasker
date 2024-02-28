const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  status: {
    type: [String], // Example: ['To Do', 'In Progress', 'Done']
    default: ["To Do", "In Progress", "Done"],
  },
  urgency: {
    type: [String], // Example: ['Low', 'Medium', 'High']
    default: ["Low", "Medium", "High"],
  },
  permissions: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      level: {
        type: String,
        enum: ["Read", "Write", "Admin"],
        default: "Read",
      },
    },
  ],
  permissionOptions: {
    type: [String],
    default: ["Read", "Write", "Admin"],
  },
  customFields: {
    type: Map,
    of: String,
    default: {},
  },
  // Add more fields as needed
});

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
