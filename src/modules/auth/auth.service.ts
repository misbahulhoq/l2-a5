// src/modules/auth/auth.service.ts
import mongoose from "mongoose";
import httpStatus from "http-status";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { Driver } from "../driver/driver.model";
import { AppError } from "../../utils/AppError";

const signupUser = async (payload: TUser & { vehicleInfo?: object }) => {
  // Check if user already exists
  if (await User.isUserExists(payload.email)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This email is already registered."
    );
  }

  const session = await mongoose.startSession();
  let newUser;

  try {
    session.startTransaction();

    //  Create the user
    const userResult = await User.create([payload], { session });
    if (!userResult.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user.");
    }

    // If the user is a driver, create the driver profile
    if (payload.role === "driver") {
      if (!payload.vehicleInfo) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Vehicle information is required for drivers."
        );
      }
      const driverPayload = {
        user: userResult[0]._id,
        vehicleInfo: payload.vehicleInfo,
      };
      await Driver.create([driverPayload], { session });
    }

    await session.commitTransaction();
    await session.endSession();

    newUser = await User.findById(userResult[0]._id);
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      err.message || "Something went wrong during signup."
    );
  }

  return newUser;
};

export const AuthServices = {
  signupUser,
};
