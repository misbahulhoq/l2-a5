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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../modules/user/user.model");
const env_config_1 = __importDefault(require("../config/env.config"));
const AppError_1 = require("../utils/AppError");
const auth = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.cookies.accessToken;
            // 1. Check if token is present
            if (!token) {
                throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
            }
            // 2. Verify the token
            const decoded = jsonwebtoken_1.default.verify(token, env_config_1.default.JWT_SECRET);
            const { _id, role } = decoded;
            // 3. Check if user exists
            const user = yield user_model_1.User.findById(_id);
            if (!user) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "This user is not found!");
            }
            // 4. Check if user is blocked
            if (user.status === "blocked") {
                throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "This user is blocked!");
            }
            // 5. Check if the role is authorized
            if (requiredRoles.length && !requiredRoles.includes(role)) {
                throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "You do not have permission to access this route!");
            }
            // Attach user to the request object
            // @ts-ignore
            req.user = decoded;
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.auth = auth;
