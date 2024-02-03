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

const username = process.env.MONGO_USERNAME || "root";
const password = process.env.MONGO_PASSWORD || "example";
const database = process.env.MONGO_DATABASE || "task_manager";

const connectionString = `mongodb://mongodb:27017`;

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(connectionString, {
    user: username,
    pass: password,
    dbName: database,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// login and logout routes
app.use(authRoutes);

//auth middleware
app.use(authMiddleware);
// More routes for updating and deleting tasks
app.use(taskController);
app.use(userRoutes);

// Start the server
const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

module.exports = server;
