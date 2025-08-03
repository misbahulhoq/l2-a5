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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverServices = void 0;
const ride_model_1 = require("../ride/ride.model");
const driver_model_1 = require("./driver.model");
const updateDriverApprovalStatusInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_model_1.Driver.findOneAndUpdate({ user: id }, payload, {
        new: true,
    });
    return result;
});
const updateDriverAvailabilityInDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_model_1.Driver.findOneAndUpdate({ user: userId }, payload, {
        new: true,
    });
    return result;
});
const getDriverHistoryFromDB = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find all rides associated with this driver
    const rides = yield ride_model_1.Ride.find({ driver: driverId });
    // Calculate total earnings from completed rides
    const totalEarnings = rides.reduce((sum, ride) => {
        if (ride.status === "completed" && ride.fare) {
            return sum + ride.fare;
        }
        return sum;
    }, 0);
    return {
        rides,
        totalEarnings,
    };
});
exports.DriverServices = {
    updateDriverApprovalStatusInDB,
    updateDriverAvailabilityInDB,
    getDriverHistoryFromDB,
};
