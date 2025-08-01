import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { User } from "../modules/user/user.model";
import { TUserRole } from "../modules/user/user.interface";
import envVars from "../config/env.config";
import { AppError } from "../utils/AppError";

export const auth = (...requiredRoles: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      // 1. Check if token is present
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      // 2. Verify the token
      const decoded = jwt.verify(
        token,
        envVars.JWT_SECRET as string
      ) as JwtPayload;

      const { _id, role } = decoded;

      // 3. Check if user exists
      const user = await User.findById(_id);
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
      }

      // 4. Check if user is blocked
      if (user.status === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
      }

      // 5. Check if the role is authorized
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You do not have permission to access this route!"
        );
      }

      // Attach user to the request object
      req.user = decoded as JwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  };
};
