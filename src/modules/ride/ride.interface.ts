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
enum PaymentMethod {
  Cash = "cash",
  Card = "card",
}
export type TRide = {
  rider: Types.ObjectId;
  driver: Types.ObjectId | null;
  pickupLocation: string;
  destinationLocation: string;
  status: TRideStatus;
  fare?: number;
  history: TRideHistory[];
  paymentMethod: PaymentMethod;
};
