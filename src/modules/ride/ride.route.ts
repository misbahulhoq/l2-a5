import express from "express";
import { auth } from "../../middlewares/auth.middleware";
import { RideControllers } from "./ride.controller";

const router = express.Router();

router.post("/request", auth("rider"), RideControllers.requestRide);
router.get(
  "/available",
  auth("driver", "admin"),
  RideControllers.getAvailableRides
);
// Route for a driver to accept a ride request
router.patch("/:rideId/accept", auth("driver"), RideControllers.acceptRide);

// Route for a driver to update the status of their assigned ride
router.patch(
  "/:rideId/status",
  auth("driver"),
  RideControllers.updateRideStatus
);

// Route for a rider to cancel their ride request
router.patch("/:rideId/cancel", auth("rider"), RideControllers.cancelRide);
export const RideRoutes = router;
