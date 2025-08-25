import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { Driver } from "../driver/driver.model";
import { AppError } from "../../utils/AppError";
import envVars from "../../config/env.config";
import { TLoginUser } from "./auth.interface";

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

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid email or password.");
  }

  // 2. Check if the user is blocked
  if (user.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  // 3. Check if the password is correct
  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    user.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
  }

  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  // 5. Create token
  const accessToken = jwt.sign(jwtPayload, envVars.JWT_SECRET as string);

  // Get user data without the password
  const userData = await User.findById(user._id);

  return {
    accessToken,
    user: userData,
  };
};

const getCurrentUser = async (accessToken: string) => {
  try {
    if (!accessToken) throw new AppError(400, "Invalid request");
    const decoded = jwt.verify(accessToken, envVars.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded._id);
    return user;
  } catch (err: any) {
    throw new AppError(400, err.message || "Something went wrong.");
  }
};

export const AuthServices = {
  signupUser,
  loginUser,
  getCurrentUser,
};
