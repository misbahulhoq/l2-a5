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
exports.AuthServices = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("../driver/driver.model");
const AppError_1 = require("../../utils/AppError");
const env_config_1 = __importDefault(require("../../config/env.config"));
const signupUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user already exists
    if (yield user_model_1.User.isUserExists(payload.email)) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, "This email is already registered.");
    }
    const session = yield mongoose_1.default.startSession();
    let newUser;
    try {
        session.startTransaction();
        //  Create the user
        const userResult = yield user_model_1.User.create([payload], { session });
        if (!userResult.length) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Failed to create user.");
        }
        // If the user is a driver, create the driver profile
        if (payload.role === "driver") {
            if (!payload.vehicleInfo) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Vehicle information is required for drivers.");
            }
            const driverPayload = {
                user: userResult[0]._id,
                vehicleInfo: payload.vehicleInfo,
            };
            yield driver_model_1.Driver.create([driverPayload], { session });
        }
        yield session.commitTransaction();
        yield session.endSession();
        newUser = yield user_model_1.User.findById(userResult[0]._id);
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.AppError(err.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR, err.message || "Something went wrong during signup.");
    }
    return newUser;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email }).select("+password");
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    // 2. Check if the user is blocked
    if (user.status === "blocked") {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "This user is blocked!");
    }
    // 3. Check if the password is correct
    const isPasswordMatch = yield bcryptjs_1.default.compare(payload.password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Incorrect password");
    }
    const jwtPayload = {
        _id: user._id,
        email: user.email,
        role: user.role,
    };
    // 5. Create token
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, env_config_1.default.JWT_SECRET);
    // Get user data without the password
    const userData = yield user_model_1.User.findById(user._id);
    return {
        accessToken,
        user: userData,
    };
});
const getCurrentUser = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!accessToken)
            throw new AppError_1.AppError(400, "Invalid request");
        const decoded = jsonwebtoken_1.default.verify(accessToken, env_config_1.default.JWT_SECRET);
        const user = yield user_model_1.User.findById(decoded._id);
        return user;
    }
    catch (err) {
        throw new AppError_1.AppError(400, err.message || "Something went wrong.");
    }
});
exports.AuthServices = {
    signupUser,
    loginUser,
    getCurrentUser,
};
