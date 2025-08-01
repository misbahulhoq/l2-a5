import { Types } from "mongoose";

export type TLocation = {
  lat: number;
  lng: number;
};

export type TRideStatus =
  | "requested"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "completed"
  | "cancelled";

export type TRideHistory = {
  status: TRideStatus;
  timestamp: Date;
};

export type TRide = {
  rider: Types.ObjectId;
  driver: Types.ObjectId | null;
  pickupLocation: TLocation;
  destinationLocation: TLocation;
  status: TRideStatus;
  fare?: number;
  history: TRideHistory[];
};
