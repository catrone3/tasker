const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server"); // Assuming your Express app is exported from server.js
const Task = require("../models/Task"); // Import your Task model

// Configure chai
chai.use(chaiHttp);
const expect = chai.expect;

describe("API Tests", () => {
  // Before running tests, clear the Task collection in the database
  before(async () => {
    await Task.deleteMany({});
  }, 5000);

  // Test for GET /api/tasks endpoint
  describe("GET /api/tasks", () => {
    it("should return an array of tasks", async () => {
      const res = await chai.request(app).get("/api/tasks");
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
      const res = await chai.request(app).post("/api/tasks").send(newTask);
      expect(res).to.have.status(201);
      expect(res.body).to.be.an("object").that.includes(newTask);
    });
  });

  // Test for GET /api/tasks/next endpoint
  describe("GET /api/tasks/next", () => {
    it("should return the next task to work on", async () => {
      const res = await chai.request(app).get("/api/tasks/next");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object").that.has.property("title");
    });
  });

  // Test for DELETE /api/tasks/:id endpoint
  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task by ID", async () => {
      const task = await Task.findOne();
      const res = await chai.request(app).delete(`/api/tasks/${task._id}`);
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
        .send(updatedTaskData);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("title").equal(updatedTaskData.title);
    });
  });

  // Add more tests for other endpoints...
});
