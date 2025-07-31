// src/modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import { AppError } from "../../utils/AppError";

const signupUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, vehicleInfo } = req.body;
    // Check if name, email, password, and role are provided
    if (!name || !email || !password || !role) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Name, email, password, and role are required."
      );
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid email format.");
    }
    if (password.length < 6) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Password must be at least 6 characters long."
      );
    }
    if (!["rider", "driver"].includes(role)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Role must be either "rider" or "driver".'
      );
    }

    // If the user is a driver, check if vehicle information is provided
    if (role === "driver") {
      if (!vehicleInfo || !vehicleInfo.model || !vehicleInfo.licensePlate) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Vehicle information (model, licensePlate) is required for drivers."
        );
      }
    }

    // if inputs are okay, create a new user.
    const userData = req.body;
    const result = await AuthServices.signupUser(userData);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthControllers = {
  signupUser,
};
