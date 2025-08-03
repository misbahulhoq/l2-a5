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
exports.DriverControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const driver_service_1 = require("./driver.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = require("../../utils/AppError");
const updateDriverApprovalStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { approvalStatus } = req.body;
        if (!approvalStatus ||
            !["pending", "approved", "suspended"].includes(approvalStatus)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid approval status provided.");
        }
        const result = yield driver_service_1.DriverServices.updateDriverApprovalStatusInDB(id, {
            approvalStatus,
        });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Driver approval status updated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateMyAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const { availability } = req.body;
        // Validation for the availability status
        if (!availability || !["online", "offline"].includes(availability)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid availability status provided. Must be "online" or "offline".');
        }
        const result = yield driver_service_1.DriverServices.updateDriverAvailabilityInDB(_id, {
            availability,
        });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Availability status updated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMyHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id: driverId } = req.user;
        if (!driverId) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Driver ID is required");
        }
        const result = yield driver_service_1.DriverServices.getDriverHistoryFromDB(driverId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Driver history retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.DriverControllers = {
    updateDriverApprovalStatus,
    updateMyAvailability,
    getMyHistory,
};
