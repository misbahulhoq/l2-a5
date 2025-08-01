import { Schema, model } from "mongoose";
import { TRide } from "./ride.interface";

const locationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const rideHistorySchema = new Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  { _id: false }
);

const rideSchema = new Schema<TRide>(
  {
    rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "User", default: null },
    pickupLocation: { type: locationSchema, required: true },
    destinationLocation: { type: locationSchema, required: true },
    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "picked_up",
        "in_transit",
        "completed",
        "cancelled",
      ],
      default: "requested",
    },
    fare: { type: Number },
    history: [rideHistorySchema],
  },
  {
    timestamps: true,
  }
);

export const Ride = model<TRide>("Ride", rideSchema);
