import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { DriverServices } from "./driver.service";
import sendResponse from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";

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

export const DriverControllers = {
  updateDriverApprovalStatus,
};
