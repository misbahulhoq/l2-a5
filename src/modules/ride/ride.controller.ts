import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { RideServices } from "./ride.service";
import { AppError } from "../../utils/AppError";

const requestRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: riderId } = (req as JwtPayload).user;
    const rideData = req.body;

    const result = await RideServices.requestRideInDB(riderId, rideData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Ride requested successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAvailableRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: driverId } = (req as JwtPayload).user;
    const result = await RideServices.getAvailableRidesFromDB(driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Available rides retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const acceptRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rideId } = req.params;
    const { _id: driverId } = (req as JwtPayload).user;

    const result = await RideServices.acceptRideInDB(rideId, driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride accepted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateRideStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rideId } = req.params;
    const { _id: driverId } = (req as JwtPayload).user;
    const { status } = req.body;
    if (!status) {
      throw new AppError(httpStatus.BAD_REQUEST, "Status is required");
    }

    const result = await RideServices.updateRideStatusInDB(
      rideId,
      driverId,
      status
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride status updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const RideControllers = {
  requestRide,
  getAvailableRides,
  acceptRide,
  updateRideStatus,
};
