"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../../../app")); // Main express app
const user_model_1 = require("../../user/user.model");
const driver_model_1 = require("../../driver/driver.model");
const env_config_1 = __importDefault(require("../../../config/env.config"));
// Test suite for the signup route
describe("POST /api/v1/auth/signup", () => {
    // Connect to the database before running any tests
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(env_config_1.default.MONGO_TEST_URI);
    }));
    // Clear the user and driver collections after each test to ensure isolation
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.User.deleteMany({});
        yield driver_model_1.Driver.deleteMany({});
    }));
    // Disconnect from the database after all tests are done
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    // Test case for successful rider registration
    it("should register a new rider successfully and return 201 status code", () => __awaiter(void 0, void 0, void 0, function* () {
        const riderData = {
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password123",
            role: "rider",
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/api/v1/auth/signup")
            .send(riderData);
        // Assertions
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.email).toBe(riderData.email);
        expect(response.body.data.password).toBeUndefined(); // Ensure password is not returned
    }));
    // Test case for attempting to register with a duplicate email
    it("should return a 409 conflict error if the email is already registered", () => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = {
            name: "Jane Doe",
            email: "jane.doe@example.com",
            password: "password123",
            role: "rider",
        };
        yield user_model_1.User.create(existingUser);
        const duplicateUserData = {
            name: "Jane Smith",
            email: "jane.doe@example.com",
            password: "newpassword",
            role: "rider",
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/api/v1/auth/signup")
            .send(duplicateUserData);
        // Assertions
        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
    }));
    // Test case for missing required fields
    it("should return a 400 bad request error if required fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidData = {
            name: "Test User",
            email: "test@example.com",
            // Password is intentionally missing
            role: "rider",
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/api/v1/auth/signup")
            .send(invalidData);
        // Assertions
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    }));
    // Test case for driver signup without vehicle info
    it("should return a 400 bad request error if a driver signs up without vehicle info", () => __awaiter(void 0, void 0, void 0, function* () {
        const driverData = {
            name: "Driver Dan",
            email: "dan@example.com",
            password: "password123",
            role: "driver",
            // vehicleInfo is missing
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/api/v1/auth/signup")
            .send(driverData);
        // Assertions
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("Vehicle information");
    }));
});
