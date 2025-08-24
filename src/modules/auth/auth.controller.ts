import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import { AppError } from "../../utils/AppError";
import { success } from "zod";
import sendResponse from "../../utils/sendResponse";

const signup = async (req: Request, res: Response, next: NextFunction) => {
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

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email and password are required."
    );
  }

  const result = await AuthServices.loginUser(req.body);

  const { accessToken, user } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Login successful.",
    data: {
      user,
    },
  });
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Logout successful.",
  });
};

const getCurrentUser = async (req: Request, res: Response) => {
  const user = await AuthServices.getCurrentUser(req.cookies.accessToken);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User info retrieved successfully.",
    data: { user },
  });
};

export const AuthControllers = {
  signup,
  login,
  logout,
  getCurrentUser,
};
