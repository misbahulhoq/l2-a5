import { Types } from "mongoose";

// Type for location coordinates
export type TLocation = {
  lat: number;
  lng: number;
};

// Type for the status of a ride
export type TRideStatus =
  | "requested"
  | "accepted"
  | "in_transit"
  | "completed"
  | "cancelled";

// Type for the ride history log
export type TRideHistory = {
  status: TRideStatus;
  timestamp: Date;
};

// Main Ride Interface
export type TRide = {
  rider: Types.ObjectId;
  driver: Types.ObjectId | null;
  pickupLocation: TLocation;
  destinationLocation: TLocation;
  status: TRideStatus;
  fare?: number;
  history: TRideHistory[];
};
