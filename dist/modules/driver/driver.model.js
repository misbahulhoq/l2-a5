"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driverSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    vehicleInfo: {
        model: { type: String, required: true },
        licensePlate: { type: String, required: true, unique: true },
        color: { type: String, required: true },
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
}, {
    timestamps: true,
});
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
