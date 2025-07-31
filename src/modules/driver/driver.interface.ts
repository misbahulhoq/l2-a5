import { Types } from "mongoose";

export type TVehicleInfo = {
  model: string;
  licensePlate: string;
  color: string;
};

export type TDriver = {
  user: Types.ObjectId;
  vehicleInfo: TVehicleInfo;
  approvalStatus: "pending" | "approved" | "suspended";
  availability: "online" | "offline";
};
