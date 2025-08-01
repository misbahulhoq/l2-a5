import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { DriverServices } from "./driver.service";
import sendResponse from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";
import { JwtPayload } from "jsonwebtoken";

const updateDriverApprovalStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    if (
      !approvalStatus ||
      !["pending", "approved", "suspended"].includes(approvalStatus)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Invalid approval status provided."
      );
    }

    const result = await DriverServices.updateDriverApprovalStatusInDB(id, {
      approvalStatus,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver approval status updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateMyAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = (req as JwtPayload).user;
    const { availability } = req.body;

    // Validation for the availability status
    if (!availability || !["online", "offline"].includes(availability)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid availability status provided. Must be "online" or "offline".'
      );
    }

    const result = await DriverServices.updateDriverAvailabilityInDB(_id, {
      availability,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Availability status updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: driverId } = (req as JwtPayload).user;
    if (!driverId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Driver ID is required");
    }
    const result = await DriverServices.getDriverHistoryFromDB(driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver history retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const DriverControllers = {
  updateDriverApprovalStatus,
  updateMyAvailability,
  getMyHistory,
};
