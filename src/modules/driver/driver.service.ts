import { Ride } from "../ride/ride.model";
import { TDriver } from "./driver.interface";
import { Driver } from "./driver.model";

const updateDriverApprovalStatusInDB = async (
  id: string,
  payload: Partial<TDriver>
) => {
  const result = await Driver.findOneAndUpdate({ user: id }, payload, {
    new: true,
  });
  return result;
};

const updateDriverAvailabilityInDB = async (
  userId: string,
  payload: Partial<TDriver>
) => {
  const result = await Driver.findOneAndUpdate({ user: userId }, payload, {
    new: true,
  });
  return result;
};

const getDriverHistoryFromDB = async (driverId: string) => {
  // Find all rides associated with this driver
  const rides = await Ride.find({ driver: driverId });

  // Calculate total earnings from completed rides
  const totalEarnings = rides.reduce((sum, ride) => {
    if (ride.status === "completed" && ride.fare) {
      return sum + ride.fare;
    }
    return sum;
  }, 0);

  return {
    rides,
    totalEarnings,
  };
};

export const DriverServices = {
  updateDriverApprovalStatusInDB,
  updateDriverAvailabilityInDB,
  getDriverHistoryFromDB,
};
