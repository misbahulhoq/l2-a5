import httpStatus from "http-status";
import { TRide } from "./ride.interface";
import { Ride } from "./ride.model";
import { AppError } from "../../utils/AppError";

const requestRideInDB = async (riderId: string, payload: Partial<TRide>) => {
  // Check if the rider has an active ride request
  const existingRide = await Ride.findOne({
    rider: riderId,
    status: { $in: ["requested", "accepted", "in_transit"] },
  });

  if (existingRide) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You already have an active ride request."
    );
  }

  // Create the new ride request
  const rideData: Partial<TRide> = {
    ...payload,
    rider: riderId as any,
    status: "requested",
    history: [{ status: "requested", timestamp: new Date() }],
  };

  const result = await Ride.create(rideData);
  return result;
};

export const RideServices = {
  requestRideInDB,
};
