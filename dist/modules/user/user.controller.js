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
exports.UserControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const AppError_1 = require("../../utils/AppError");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserServices.getAllUsersFromDB();
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Users retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateUserStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Basic validation
        if (!status || !["active", "blocked"].includes(status)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid status provided.");
        }
        const result = yield user_service_1.UserServices.updateUserStatusInDB(id, { status });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "User status updated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.UserControllers = {
    getAllUsers,
    updateUserStatus,
};
