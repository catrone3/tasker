// server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const taskController = require("./routes/taskRoutes"); // Import the taskController
const authMiddleware = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Custom logging middleware
const customLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Request body:", req.body); // Log request body if needed
  next(); // Call the next middleware in the chain
};

// Middleware
app.use(customLogger);
app.use(bodyParser.json());
app.use(authMiddleware);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/task_manager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// More routes for updating and deleting tasks

app.use(authRoutes);
app.use(taskController);
app.use(userRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
