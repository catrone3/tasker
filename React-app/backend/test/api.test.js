const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const Task = require("../models/Task");
const Project = require("../models/Project"); // Import Project model
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
    const res = await chai
      .request(app)
      .post("/api/register")
      .send(testUserData);
    return res.body.id;
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
  const res = await chai.request(app).post("/api/login").send(loginCredentials);
  return res.body.token;
};

// Define a function to create and insert a dummy task
const createDummyTask = async (user, project) => {
  try {
    const dummyTask = new Task({
      title: "Dummy Task",
      description: "This is a dummy task",
      dueDate: new Date(),
      urgency: "High",
      completed: false,
      createdBy: user,
      assignedTo: user, // New field for who the task is assigned to
      projectId: project._id, // New field for linking task to project
    });
    const savedTask = await dummyTask.save();
    console.log("Dummy task inserted successfully:", savedTask);
    return savedTask;
  } catch (error) {
    console.error("Error creating dummy task:", error);
    throw error;
  }
};

// Define a function to create and insert a dummy project
const createDummyProject = async () => {
  try {
    const dummyProject = new Project({
      name: "Dummy Project",
      description: "This is a dummy project",
    });
    const savedProject = await dummyProject.save();
    console.log("Dummy project inserted successfully:", savedProject);
    return savedProject;
  } catch (error) {
    console.error("Error creating dummy project:", error);
    throw error;
  }
};

let testUser;
let authToken;
let testProject;

describe("API Tests", () => {
  // Cleanup database before starting any jobs
  before(async () => {
    try {
      await Task.deleteMany({});
      await Project.deleteMany({}); // Add deletion of projects
    } catch (error) {
      console.error("Error deleting documents:", error);
    }
  });

  // Before running the tests, insert a test user and project into the database and generate JWT token
  beforeEach(async () => {
    try {
      await User.deleteMany({});
      testUser = await insertTestUser();
      authToken = await generateToken();
      testProject = await createDummyProject(); // Create a dummy project
      await createDummyTask(testUser, testProject); // Pass the testProject to createDummyTask
      console.log(
        "Test user, token, project, and dummy task created successfully"
      );
    } catch (error) {
      console.error("Failed to create test user, token, and project:", error);
      process.exit(1);
    }
  });

  // Test for GET /api/tasks endpoint
  describe("GET /api/tasks", () => {
    it("should return an array of tasks", async () => {
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

  // Test for POST /api/projects/:projectId/tasks endpoint
  describe("POST /api/projects/:projectId/tasks", () => {
    it("should create a new task", async () => {
      const currentDate = new Date(); // Get the current date and time
      const minutePrecisionDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes()
      );
      const newTask = {
        title: "Test Task",
        description: "This is a test task",
        dueDate: minutePrecisionDate.toISOString(),
        urgency: "High",
        completed: false,
        createdBy: testUser,
        assignedTo: testUser, // Include assignedTo field
        projectId: testProject._id.toString(), // Include projectId field
      };
      const res = await chai
        .request(app)
        .post(`/api/projects/${testProject._id}/tasks`)
        .send(newTask)
        .set("Authorization", `Bearer ${authToken}`);
      console.log(res.body.task);
      expect(res).to.have.status(201);
      expect(res.body.task).to.be.an("object").that.includes(newTask);
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
  describe("DELETE /api/projects/:projectId/tasks/:taskId", () => {
    it("should delete a task by ID", async () => {
      const task = await Task.findOne();
      console.log(task);
      const res = await chai
        .request(app)
        .delete(`/api/projects/${task.projectId}/tasks/${task._id}`)
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
        currentPassword: "t3stpassword!",
        newPassword: "NewPassword456!",
      };
      const res = await chai
        .request(app)
        .put(`/api/users/${user._id}/password`)
        .send(updatedPasswordData)
        .set("Authorization", `Bearer ${authToken}`);
      console.log(res);
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

  // Test for POST /api/projects endpoint
  describe("POST /api/projects", () => {
    it("should create a new project", async () => {
      const newProject = {
        name: "Test Project",
      };
      const res = await chai
        .request(app)
        .post("/api/projects")
        .send(newProject)
        .set("Authorization", `Bearer ${authToken}`);
      expect(res).to.have.status(201);
      expect(res.body.project).to.be.an("object").that.includes(newProject);
    });
  });

  // Test for GET /api/projects/:id endpoint
  describe("GET /api/projects/:id", () => {
    it("should get a project by ID", async () => {
      const project = new Project({
        name: "Test Project",
      });
      await project.save();
      const res = await chai
        .request(app)
        .get(`/api/projects/${project._id}`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object").that.has.property("project");
      // Convert Mongoose model instance to a plain JavaScript object
      const projectObject = project.toObject();
      projectObject._id = projectObject._id.toString();
      console.log(res.body);
      console.log(projectObject);
      expect(res.body.project).to.deep.include(projectObject);
    });
  });

  // Test for GET /api/projects endpoint
  describe("GET /api/projects", () => {
    it("should get all projects for the authenticated user", async () => {
      const project1 = new Project({ name: "Project 1" });
      const project2 = new Project({ name: "Project 2" });
      await project1.save();
      await project2.save();
      const user = await User.findById(testUser);
      user.projects.push(project1, project2);
      await user.save();
      const res = await chai
        .request(app)
        .get("/api/projects")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object").that.has.property("projects");
      expect(res.body.projects).to.be.an("array").with.lengthOf(2);
    });
  });

  describe("GET /api/users/:id/projects", () => {
    it("should return projects associated with the user", async () => {
      const res = await chai.request(app).get(`/api/users/${userId}/projects`);
      expect(res).to.have.status(200);
      expect(res.body.projects).to.be.an("array").that.has.lengthOf(1);
      expect(res.body.projects[0]).to.deep.include({
        _id: projectId,
        name: "Test Project",
      });
    });

    it("should return 404 if user not found", async () => {
      const res = await chai.request(app).get(`/api/users/invalid-id/projects`);
      expect(res).to.have.status(404);
      expect(res.body).to.have.property("message").equal("User not found");
    });
  });

  describe("POST /api/users/:id/projects", () => {
    it("should add a project to the user's list of projects", async () => {
      const newProject = new Project({ name: "New Project" });
      await newProject.save();

      const res = await chai
        .request(app)
        .post(`/api/users/${userId}/projects`)
        .send({ projectId: newProject._id });

      expect(res).to.have.status(201);
      expect(res.body)
        .to.have.property("message")
        .equal("Project added to user");

      const updatedUser = await User.findById(userId).populate("projects");
      expect(updatedUser.projects.map((p) => p.toString())).to.include(
        newProject._id.toString()
      );
    });

    it("should return 404 if user not found", async () => {
      const res = await chai
        .request(app)
        .post(`/api/users/invalid-id/projects`);
      expect(res).to.have.status(404);
      expect(res.body).to.have.property("message").equal("User not found");
    });
  });

  describe("DELETE /api/users/:id/projects/:projectId", () => {
    it("should remove a project from the user's list of projects", async () => {
      const res = await chai
        .request(app)
        .delete(`/api/users/${userId}/projects/${projectId}`);
      expect(res).to.have.status(200);
      expect(res.body)
        .to.have.property("message")
        .equal("Project removed from user");

      const updatedUser = await User.findById(userId).populate("projects");
      expect(updatedUser.projects.map((p) => p.toString())).to.not.include(
        projectId.toString()
      );
    });

    it("should return 404 if user not found", async () => {
      const res = await chai
        .request(app)
        .delete(`/api/users/invalid-id/projects/${projectId}`);
      expect(res).to.have.status(404);
      expect(res.body).to.have.property("message").equal("User not found");
    });
  });
  // Add more tests for other endpoints...
});
