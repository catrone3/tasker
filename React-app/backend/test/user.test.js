const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server"); // Assuming your Express app is exported from server.js
const User = require("../models/User"); // Import your User model

// Configure chai
chai.use(chaiHttp);
const expect = chai.expect;

describe("User API Tests", () => {
  // Before running tests, clear the User collection in the database
  before(async () => {
    await User.deleteMany({});
  }, 5000);

  // Test for POST /api/register endpoint
  describe("POST /api/register", () => {
    it("should register a new user", async () => {
      const newUser = {
        username: "testuser",
        email: "test@example.com",
        password: "Password123!",
      };
      const res = await chai.request(app).post("/api/register").send(newUser);
      expect(res).to.have.status(201);
      expect(res.body)
        .to.have.property("message")
        .equal("User registered successfully");
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
        .send(updatedPasswordData);
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
        .send(updatedEmailData);
      expect(res).to.have.status(200);
      expect(res.body)
        .to.have.property("message")
        .equal("Email updated successfully");
    });
  });

  // Add more tests for other endpoints...
});
