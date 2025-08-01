import { TUser } from "./user.interface";
import { User } from "./user.model";

const getAllUsersFromDB = async () => {
  const result = await User.find();
  return result;
};

const updateUserStatusInDB = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  getAllUsersFromDB,
  updateUserStatusInDB,
};
