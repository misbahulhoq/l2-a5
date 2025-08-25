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
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const AppError_1 = require("../../utils/AppError");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role, vehicleInfo } = req.body;
        // Check if name, email, password, and role are provided
        if (!name || !email || !password || !role) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Name, email, password, and role are required.");
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid email format.");
        }
        if (password.length < 6) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Password must be at least 6 characters long.");
        }
        if (!["rider", "driver"].includes(role)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Role must be either "rider" or "driver".');
        }
        // If the user is a driver, check if vehicle information is provided
        if (role === "driver") {
            if (!vehicleInfo || !vehicleInfo.model || !vehicleInfo.licensePlate) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Vehicle information (model, licensePlate) is required for drivers.");
            }
        }
        // if inputs are okay, create a new user.
        const userData = req.body;
        const result = yield auth_service_1.AuthServices.signupUser(userData);
        res.status(http_status_1.default.CREATED).json({
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "User registered successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Email and password are required.");
    }
    const result = yield auth_service_1.AuthServices.loginUser(req.body);
    const { accessToken, user } = result;
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Login successful.",
        data: {
            user,
        },
    });
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Logout successful.",
    });
});
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.AuthServices.getCurrentUser(req.cookies.accessToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User info retrieved successfully.",
        data: { user },
    });
});
exports.AuthControllers = {
    signup,
    login,
    logout,
    getCurrentUser,
};
