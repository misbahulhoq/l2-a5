"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const seedAdmin_1 = __importDefault(require("./utils/seedAdmin"));
const env_config_1 = __importDefault(require("./config/env.config"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: env_config_1.default.FRONT_END_URL,
    credentials: true,
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Headers",
        "accessToken",
    ],
}));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the Ride Booking API!",
    });
});
(0, seedAdmin_1.default)(env_config_1.default.ADMIN_EMAIL, env_config_1.default.ADMIN_PASS);
// global error handler
app.use(error_middleware_1.default);
exports.default = app;
