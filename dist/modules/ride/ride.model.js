"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const locationSchema = new mongoose_1.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
}, { _id: false });
const rideHistorySchema = new mongoose_1.Schema({
    status: { type: String, required: true },
    timestamp: { type: Date, required: true },
}, { _id: false });
const rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    pickupLocation: { type: String, required: true },
    destinationLocation: { type: String, required: true },
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
    paymentMethod: {
        type: String,
        enum: ["cash", "card"],
        required: true,
    },
}, {
    timestamps: true,
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
