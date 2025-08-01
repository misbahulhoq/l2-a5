import httpStatus from "http-status";
import { TRide, TRideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import { AppError } from "../../utils/AppError";
import { Driver } from "../driver/driver.model";
import mongoose from "mongoose";

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

const getAvailableRidesFromDB = async (driverId: string) => {
  const driver = await Driver.findOne({ user: driverId });
  if (
    !driver ||
    driver.approvalStatus !== "approved" ||
    driver.availability !== "online"
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You must be an approved and online driver to see ride requests."
    );
  }

  // Find all rides that are currently in 'requested' state
  const result = await Ride.find({ status: "requested" });
  return result;
};

const acceptRideInDB = async (rideId: string, driverId: string) => {
  const session = await mongoose.startSession();
  let updatedRide;

  try {
    session.startTransaction();

    // Find the ride and check its status
    const ride = await Ride.findById(rideId).session(session);
    if (!ride) {
      throw new AppError(httpStatus.NOT_FOUND, "Ride request not found.");
    }
    if (ride.status !== "requested") {
      throw new AppError(
        httpStatus.CONFLICT,
        "This ride is no longer available."
      );
    }

    // Check if the driver is already on an active ride
    const activeRide = await Ride.findOne({
      driver: driverId,
      status: { $in: ["accepted", "in_transit"] },
    }).session(session);

    if (activeRide) {
      throw new AppError(
        httpStatus.CONFLICT,
        "You are already on an active ride."
      );
    }

    // Update the ride with the driver's ID and new status
    updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      {
        driver: driverId as any,
        status: "accepted",
        $push: { history: { status: "accepted", timestamp: new Date() } },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return updatedRide;
};

const updateRideStatusInDB = async (
  rideId: string,
  driverId: string,
  newStatus: TRideStatus
) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found.");
  }

  // Check if the logged-in driver is the assigned driver
  if (ride.driver?.toString() !== driverId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this ride."
    );
  }

  //  Check for valid status transition
  let validTransition = false;
  switch (ride.status) {
    case "accepted":
      if (newStatus === "picked_up") validTransition = true;
      break;
    case "picked_up":
      if (newStatus === "in_transit") validTransition = true;
      break;
    case "in_transit":
      if (newStatus === "completed") validTransition = true;
      break;
    default:
      validTransition = false;
  }

  if (!validTransition) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change status from "${ride.status}" to "${newStatus}".`
    );
  }

  // Update the status and history
  const updatedRide = await Ride.findByIdAndUpdate(
    rideId,
    {
      status: newStatus,
      $push: { history: { status: newStatus, timestamp: new Date() } },
    },
    { new: true }
  );

  return updatedRide;
};

export const RideServices = {
  requestRideInDB,
  getAvailableRidesFromDB,
  acceptRideInDB,
  updateRideStatusInDB,
};
