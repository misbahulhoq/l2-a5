"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const globalErrorHandler = (error, request, response, next) => {
    let message = "Internal server error";
    let statusCode = error.statusCode || 500;
    let stack = error.stack || [];
    if (error instanceof AppError_1.AppError && error.isOperational) {
        message = error.message;
        statusCode = error.statusCode;
    }
    response.status(statusCode).json({
        success: false,
        message,
        // stack: envVars.NODE_ENV === "development" ? stack : [],
        stack,
    });
};
exports.globalErrorHandler = globalErrorHandler;
exports.default = exports.globalErrorHandler;
