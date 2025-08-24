import { Schema, model } from "mongoose";
import { TDriver } from "./driver.interface";

const driverSchema = new Schema<TDriver>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    vehicleInfo: {
      model: { type: String, required: true },
      licensePlate: { type: String, required: true, unique: true },
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending",
    },
    availability: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  {
    timestamps: true,
  }
);

export const Driver = model<TDriver>("Driver", driverSchema);
