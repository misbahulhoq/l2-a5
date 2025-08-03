"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const ride_controller_1 = require("./ride.controller");
const router = express_1.default.Router();
router.post("/request", (0, auth_middleware_1.auth)("rider"), ride_controller_1.RideControllers.requestRide);
router.get("/available", (0, auth_middleware_1.auth)("driver", "admin"), ride_controller_1.RideControllers.getAvailableRides);
// Route for a driver to accept a ride request
router.patch("/:rideId/accept", (0, auth_middleware_1.auth)("driver"), ride_controller_1.RideControllers.acceptRide);
// Route for a driver to update the status of their assigned ride
router.patch("/:rideId/status", (0, auth_middleware_1.auth)("driver"), ride_controller_1.RideControllers.updateRideStatus);
// Route for a rider to cancel their ride request
router.patch("/:rideId/cancel", (0, auth_middleware_1.auth)("rider"), ride_controller_1.RideControllers.cancelRide);
// Route for a rider to get their ride history
router.get("/my-history", (0, auth_middleware_1.auth)("rider"), ride_controller_1.RideControllers.getMyRideHistory);
// Route for an admin to get all rides in the system
router.get("/", (0, auth_middleware_1.auth)("admin"), ride_controller_1.RideControllers.getAllRides);
exports.RideRoutes = router;
