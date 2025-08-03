"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ debug: true });
const requiredKeys = [
    // "PORT",
    "MONGO_URI",
    "JWT_SECRET",
    "SALT_ROUNDS",
    "ADMIN_EMAIL",
    "ADMIN_PASS",
    // "NODE_ENV",
    "MONGO_TEST_URI",
    "JWT_EXPIRES_IN",
];
requiredKeys.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
});
exports.envVars = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
    MONGO_URI: process.env.MONGO_URI || "",
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS || 10),
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASS: process.env.ADMIN_PASS,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_TEST_URI: process.env.MONGO_TEST_URI,
};
exports.default = exports.envVars;
