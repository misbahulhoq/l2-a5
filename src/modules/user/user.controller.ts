import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { UserServices } from "./user.service";
import { AppError } from "../../utils/AppError";
import sendResponse from "../../utils/sendResponse";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.getAllUsersFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Basic validation
    if (!status || !["active", "blocked"].includes(status)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid status provided.");
    }

    const result = await UserServices.updateUserStatusInDB(id, { status });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  getAllUsers,
  updateUserStatus,
};
