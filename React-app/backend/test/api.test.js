const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server"); // Assuming your Express app is exported from server.js
const Task = require("../models/Task"); // Import your Task model
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Configure chai
chai.use(chaiHttp);
const expect = chai.expect;

// Function to insert a test user into the database
const insertTestUser = async () => {
  const testUserData = {
    username: "testuser",
    password: "testpassword",
    email: "test@test.com",
  };

  try {
    // Create a test user record in the database
    const testUser = await User.create(testUserData);
    return testUser;
  } catch (error) {
    console.error("Error inserting test user:", error);
    throw error;
  }
};

// Function to generate a JWT token for the test user
const generateToken = (user) => {
  const payload = {
    userId: user._id,
    // Add any other user data you want in the payload
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

let testUser;
let authToken;

describe("API Tests", () => {
  // Before running the tests, insert a test user into the database and generate JWT token
  before(async () => {
    try {
      testUser = await insertTestUser();
      authToken = generateToken(testUser);
      console.log("Test user and token created successfully");
    } catch (error) {
      console.error("Failed to create test user and token:", error);
      process.exit(1); // Exit the tests if user insertion fails
    }
  });

  // Test for GET /api/tasks endpoint
  describe("GET /api/tasks", () => {
    it("should return an array of tasks", async () => {
      const res = await chai
        .request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });
  });

  // Test for POST /api/tasks endpoint
  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const newTask = {
        title: "Test Task",
        description: "This is a test task",
        dueDate: new Date(),
        urgency: "High",
        completed: false,
      };
      const res = await chai
        .request(app)
        .post("/api/tasks")
        .send(newTask)
        .set("Authorization", `Bearer ${authToken}`);
      expect(res).to.have.status(201);
      expect(res.body).to.be.an("object").that.includes(newTask);
    });
  });

  // Test for GET /api/tasks/next endpoint
  describe("GET /api/tasks/next", () => {
    it("should return the next task to work on", async () => {
      const res = await chai
        .request(app)
        .get("/api/tasks/next")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object").that.has.property("title");
    });
  });

  // Test for DELETE /api/tasks/:id endpoint
  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task by ID", async () => {
      const task = await Task.findOne();
      const res = await chai
        .request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(res).to.have.status(200);
      expect(res.body)
        .to.have.property("message")
        .equal("Task deleted successfully");
    });
  });

  // Test for PUT /api/tasks/:id endpoint
  describe("PUT /api/tasks/:id", () => {
    it("should update a task by ID", async () => {
      const task = await Task.findOne();
      const updatedTaskData = { title: "Updated Task Title" };
      const res = await chai
        .request(app)
        .put(`/api/tasks/${task._id}`)
        .send(updatedTaskData)
        .set("Authorization", `Bearer ${authToken}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("title").equal(updatedTaskData.title);
    });
  });

  // Add more tests for other endpoints...
});
