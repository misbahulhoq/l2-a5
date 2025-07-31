import { NextFunction, Request, Response } from "express";
import envVars from "../config/env.config";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let message = error.message || "Internal server error";
  let statusCode = error.statusCode || 500;
  let stack = error.stack || [];

  if (envVars.NODE_ENV === "development") {
  }

  if (error instanceof AppError && error.isOperational) {
    message = error.message;
    statusCode = error.statusCode;
  }

  response.status(statusCode).json({
    success: false,
    message,
    stack: envVars.NODE_ENV === "development" ? stack : [],
  });
};

export default globalErrorHandler;
