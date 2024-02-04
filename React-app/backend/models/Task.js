// models/Task.js

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  urgency: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  fields: Object,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Task", taskSchema);
