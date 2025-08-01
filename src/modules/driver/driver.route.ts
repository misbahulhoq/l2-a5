import { Router } from "express";
import { DriverControllers } from "./driver.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.patch(
  "/:id/approval-status",
  auth("admin"),
  DriverControllers.updateDriverApprovalStatus
);

router.patch(
  "/me/availability",
  auth("driver"), // Ensures only a logged-in driver can access this
  DriverControllers.updateMyAvailability
);

export const DriverRoutes = router;
