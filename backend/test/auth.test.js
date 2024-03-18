const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server"); // Assuming your Express app is exported from server.js
const User = require("../models/User"); // Import your User model
const Token = require("../models/Token"); // Import your Token model

// Configure chai
chai.use(chaiHttp);
const expect = chai.expect;

describe("Authentication API Tests", () => {
  // Test for POST /api/register endpoint
  describe("POST /api/register", () => {
    it("should register a new user", async () => {
      const newUser = {
        username: "testregistration",
        email: "registration@example.com",
        password: "Password123!",
      };
      const res = await chai.request(app).post("/api/register").send(newUser);
      expect(res).to.have.status(201);
      expect(res.body)
        .to.have.property("message")
        .equal("User registered successfully");
    });
  });

  // Test for POST /api/login endpoint
  describe("POST /api/login", () => {
    it("should login and return a JWT token", async () => {
      // Create a test user
      const newUser = {
        username: "testlogin",
        email: "login@example.com",
        password: "Password123!",
      };
      await chai.request(app).post("/api/register").send(newUser);

      // Login with the test user credentials
      const loginCredentials = {
        email: "login@example.com",
        password: "Password123!",
      };
      const res = await chai
        .request(app)
        .post("/api/login")
        .send(loginCredentials);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("token");
    });
  });

  // Test for POST /api/logout endpoint
  describe("POST /api/logout", () => {
    it("should logout a user and remove the token from database", async () => {
      // Login to get a token
      const loginCredentials = {
        email: "logout@example.com",
        password: "Password123!",
      };
      const loginRes = await chai
        .request(app)
        .post("/api/login")
        .send(loginCredentials);
      const token = loginRes.body.token;

      // Logout using the obtained token
      const res = await chai
        .request(app)
        .post("/api/logout")
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);

      // Check if the token is removed from the database
      const tokenDoc = await Token.findOne({ token });
      expect(tokenDoc).to.be.null;
    });
  });

  // Add more tests for other endpoints...
});
