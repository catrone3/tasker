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
    password: "t3stpassword!",
    email: "test@test.com",
  };

  try {
    // Create a test user record in the database
    const testUser = await await chai
      .request(app)
      .post("/api/register")
      .send(testUserData);
    return testUser.body.id;
  } catch (error) {
    console.error("Error inserting test user:", error);
    throw error;
  }
};

// Function to generate a JWT token for the test user
const generateToken = async () => {
  const loginCredentials = {
    password: "t3stpassword!",
    email: "test@test.com",
  };
  const token = await chai
    .request(app)
    .post("/api/login")
    .send(loginCredentials);
  return token.body.token;
};

// Define a function to create and insert a dummy task
const createDummyTask = async (user) => {
  try {
    // Create a task object
    const dummyTask = new Task({
      title: "Dummy Task",
      description: "This is a dummy task",
      dueDate: new Date(),
      urgency: "High",
      completed: false,
      userId: user,
    });

    // Save the task object to the database
    const savedTask = await dummyTask.save();
    console.log("Dummy task inserted successfully:", savedTask);
    return savedTask;
  } catch (error) {
    console.error("Error creating dummy task:", error);
    throw error;
  }
};

let testUser;
let authToken;

describe("API Tests", () => {
  // cleanup database before starting any jobs
  before(async () => {
    try {
      await Task.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      console.error("Error deleting documents:", error);
    }
  });

  // Before running the tests, insert a test user into the database and generate JWT token
  beforeEach(async () => {
    try {
      await User.deleteMany({});
      testUser = await insertTestUser();
      authToken = await generateToken();
      await createDummyTask(testUser);
      console.log("Test user, token, and dummy task created successfully");
    } catch (error) {
      console.error("Failed to create test user and token:", error);
      process.exit(1); // Exit the tests if user insertion fails
    }
  });

  // Test for GET /api/tasks endpoint
  describe("GET /api/tasks", () => {
    it.only("should return an array of tasks", async () => {
      console.log("starting unit test");
      const page = 1;
      const limit = 10;
      console.log(limit);

      const res = await chai
        .request(app)
        .get("/api/tasks")
        .query({ page, limit })
        .set("Authorization", `Bearer ${authToken}`);
      console.log(res);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object");
      expect(res.body.tasks).to.be.an("array");
      expect(res.body.pagination).to.be.an("object");
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
        userId: testUser,
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
      createDummyTask();
      const task = await Task.findOne();
      console.log(task);
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
      createDummyTask();
      const task = await Task.findOne();
      console.log(task);
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

  // Test for PUT /api/users/:id/password endpoint
  describe("PUT /api/users/:id/password", () => {
    it("should update user password", async () => {
      const user = await User.findOne();
      const updatedPasswordData = {
        currentPassword: "Password123!",
        newPassword: "NewPassword456!",
      };
      const res = await chai
        .request(app)
        .put(`/api/users/${user._id}/password`)
        .send(updatedPasswordData)
        .set("Authorization", `Bearer ${authToken}`);
      expect(res).to.have.status(200);
      expect(res.body)
        .to.have.property("message")
        .equal("Password updated successfully");
    });
  });

  // Test for PUT /api/users/:id/email endpoint
  describe("PUT /api/users/:id/email", () => {
    it("should update user email", async () => {
      const user = await User.findOne();
      const updatedEmailData = {
        newEmail: "newemail@example.com",
      };
      const res = await chai
        .request(app)
        .put(`/api/users/${user._id}/email`)
        .send(updatedEmailData)
        .set("Authorization", `Bearer ${authToken}`);
      expect(res).to.have.status(200);
      expect(res.body)
        .to.have.property("message")
        .equal("Email updated successfully");
    });
  });
  // Add more tests for other endpoints...
});
