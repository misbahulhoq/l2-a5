import { NextFunction, Request, Response } from "express";
import envVars from "../config/env.config";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = error.message || "Internal server error";
  let statusCode = error.statusCode || 500;
  let stack = error.stack || [];

  res.status(statusCode).json({
    success: false,
    message,
    stack: envVars.NODE_ENV === "development" ? stack : [],
  });
};

export default globalErrorHandler;
