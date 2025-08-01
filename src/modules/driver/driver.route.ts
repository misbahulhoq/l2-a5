import { Router } from "express";
import { DriverControllers } from "./driver.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.patch(
  "/:id/approval-status",
  auth("admin"),
  DriverControllers.updateDriverApprovalStatus
);
export const DriverRoutes = router;
