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
exports.RideControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const ride_service_1 = require("./ride.service");
const AppError_1 = require("../../utils/AppError");
const requestRide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id: riderId } = req.user;
        const rideData = req.body;
        const result = yield ride_service_1.RideServices.requestRideInDB(riderId, rideData);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "Ride requested successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAvailableRides = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id: driverId } = req.user;
        const result = yield ride_service_1.RideServices.getAvailableRidesFromDB(driverId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Available rides retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const acceptRide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rideId } = req.params;
        const { _id: driverId } = req.user;
        const result = yield ride_service_1.RideServices.acceptRideInDB(rideId, driverId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Ride accepted successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateRideStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rideId } = req.params;
        const { _id: driverId } = req.user;
        const { status } = req.body;
        if (!status) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Status is required");
        }
        const result = yield ride_service_1.RideServices.updateRideStatusInDB(rideId, driverId, status);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Ride status updated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const cancelRide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rideId } = req.params;
        const { _id: riderId } = req.user;
        const result = yield ride_service_1.RideServices.cancelRideInDB(rideId, riderId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Ride cancelled successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMyRideHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id: riderId } = req.user;
        if (!riderId) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Rider ID is required");
        }
        const result = yield ride_service_1.RideServices.getRiderHistoryFromDB(riderId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Ride history retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllRides = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield ride_service_1.RideServices.getAllRidesFromDB();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "All rides retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.RideControllers = {
    requestRide,
    getAvailableRides,
    acceptRide,
    updateRideStatus,
    cancelRide,
    getMyRideHistory,
    getAllRides,
};
