import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { RideServices } from "./rider.service";

const requestRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: riderId } = req.user as JwtPayload;
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

export const RideControllers = {
  requestRide,
};
