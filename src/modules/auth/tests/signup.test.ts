import request from "supertest";
import mongoose from "mongoose";
import app from "../../../app"; // Main express app
import { User } from "../../user/user.model";
import { Driver } from "../../driver/driver.model";
import envVars from "../../../config/env.config";

// Test suite for the signup route
describe("POST /api/v1/auth/signup", () => {
  // Connect to the database before running any tests
  beforeAll(async () => {
    await mongoose.connect(envVars.MONGO_TEST_URI as string);
  });

  // Clear the user and driver collections after each test to ensure isolation
  afterEach(async () => {
    await User.deleteMany({});
    await Driver.deleteMany({});
  });

  // Disconnect from the database after all tests are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test case for successful rider registration
  it("should register a new rider successfully and return 201 status code", async () => {
    const riderData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      role: "rider",
    };

    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send(riderData);

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.email).toBe(riderData.email);
    expect(response.body.data.password).toBeUndefined(); // Ensure password is not returned
  });

  // Test case for attempting to register with a duplicate email
  it("should return a 409 conflict error if the email is already registered", async () => {
    const existingUser = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password123",
      role: "rider",
    };

    await User.create(existingUser);

    const duplicateUserData = {
      name: "Jane Smith",
      email: "jane.doe@example.com",
      password: "newpassword",
      role: "rider",
    };

    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send(duplicateUserData);

    // Assertions
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  // Test case for missing required fields
  it("should return a 400 bad request error if required fields are missing", async () => {
    const invalidData = {
      name: "Test User",
      email: "test@example.com",
      // Password is intentionally missing
      role: "rider",
    };

    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send(invalidData);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // Test case for driver signup without vehicle info
  it("should return a 400 bad request error if a driver signs up without vehicle info", async () => {
    const driverData = {
      name: "Driver Dan",
      email: "dan@example.com",
      password: "password123",
      role: "driver",
      // vehicleInfo is missing
    };

    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send(driverData);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Vehicle information");
  });
});
