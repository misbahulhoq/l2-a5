"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ride_model_1 = require("./ride.model");
const AppError_1 = require("../../utils/AppError");
const driver_model_1 = require("../driver/driver.model");
const mongoose_1 = __importDefault(require("mongoose"));
const requestRideInDB = (riderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the rider has an active ride request
    const existingRide = yield ride_model_1.Ride.findOne({
        rider: riderId,
        status: { $in: ["requested", "accepted", "in_transit"] },
    });
    if (existingRide) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, "You already have an active ride request.");
    }
    // Create the new ride request
    const rideData = Object.assign(Object.assign({}, payload), { rider: riderId, status: "requested", history: [{ status: "requested", timestamp: new Date() }] });
    const result = yield ride_model_1.Ride.create(rideData);
    return result;
});
const getAvailableRidesFromDB = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!driver ||
        driver.approvalStatus !== "approved" ||
        driver.availability !== "online") {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "You must be an approved and online driver to see ride requests.");
    }
    // Find all rides that are currently in 'requested' state
    const result = yield ride_model_1.Ride.find({ status: "requested" });
    return result;
});
const acceptRideInDB = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    let updatedRide;
    try {
        session.startTransaction();
        // Find the ride and check its status
        const ride = yield ride_model_1.Ride.findById(rideId).session(session);
        if (!ride) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Ride request not found.");
        }
        if (ride.status !== "requested") {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, "This ride is no longer available.");
        }
        // Check if the driver is already on an active ride
        const activeRide = yield ride_model_1.Ride.findOne({
            driver: driverId,
            status: { $in: ["accepted", "in_transit"] },
        }).session(session);
        if (activeRide) {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, "You are already on an active ride.");
        }
        // Update the ride with the driver's ID and new status
        updatedRide = yield ride_model_1.Ride.findByIdAndUpdate(rideId, {
            driver: driverId,
            status: "accepted",
            $push: { history: { status: "accepted", timestamp: new Date() } },
        }, { new: true, session });
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return updatedRide;
});
const updateRideStatusInDB = (rideId, driverId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Ride not found.");
    }
    // Check if the logged-in driver is the assigned driver
    if (((_a = ride.driver) === null || _a === void 0 ? void 0 : _a.toString()) !== driverId) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "You are not authorized to update this ride.");
    }
    //  Check for valid status transition
    let validTransition = false;
    switch (ride.status) {
        case "accepted":
            if (newStatus === "picked_up")
                validTransition = true;
            break;
        case "picked_up":
            if (newStatus === "in_transit")
                validTransition = true;
            break;
        case "in_transit":
            if (newStatus === "completed")
                validTransition = true;
            break;
        default:
            validTransition = false;
    }
    if (!validTransition) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Cannot change status from "${ride.status}" to "${newStatus}".`);
    }
    // Update the status and history
    const updatedRide = yield ride_model_1.Ride.findByIdAndUpdate(rideId, {
        status: newStatus,
        $push: { history: { status: newStatus, timestamp: new Date() } },
    }, { new: true });
    return updatedRide;
});
const cancelRideInDB = (rideId, riderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Find the ride
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Ride not found.");
    }
    // 1. Check if the logged-in rider is the one who requested the ride
    if (((_a = ride.rider) === null || _a === void 0 ? void 0 : _a.toString()) !== riderId) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "You are not authorized to cancel this ride.");
    }
    // 2. Check if the ride is in a cancellable state
    if (!["requested", "accepted"].includes(ride.status)) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `This ride cannot be cancelled as its status is "${ride.status}".`);
    }
    // 3. Update the status to 'cancelled' and log the history
    const updatedRide = yield ride_model_1.Ride.findByIdAndUpdate(rideId, {
        status: "cancelled",
        $push: { history: { status: "cancelled", timestamp: new Date() } },
    }, { new: true });
    return updatedRide;
});
const getRiderHistoryFromDB = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_model_1.Ride.find({ rider: riderId });
    return result;
});
const getAllRidesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_model_1.Ride.find().populate("rider").populate("driver");
    return result;
});
exports.RideServices = {
    requestRideInDB,
    getAvailableRidesFromDB,
    acceptRideInDB,
    updateRideStatusInDB,
    cancelRideInDB,
    getRiderHistoryFromDB,
    getAllRidesFromDB,
};
