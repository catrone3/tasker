const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server"); // Assuming your Express app is exported from server.js
const User = require("../models/User"); // Import your User model
const jwt = require("jsonwebtoken");

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

describe("User API Tests", () => {
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
