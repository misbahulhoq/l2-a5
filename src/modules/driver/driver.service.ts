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

export const DriverServices = {
  updateDriverApprovalStatusInDB,
  updateDriverAvailabilityInDB,
};
