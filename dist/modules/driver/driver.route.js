"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
const express_1 = require("express");
const driver_controller_1 = require("./driver.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.patch("/:id/approval-status", (0, auth_middleware_1.auth)("admin"), driver_controller_1.DriverControllers.updateDriverApprovalStatus);
router.patch("/me/availability", (0, auth_middleware_1.auth)("driver"), // Ensures only a logged-in driver can access this
driver_controller_1.DriverControllers.updateMyAvailability);
// Route for a driver to get their ride and earnings history
router.get("/me/history", (0, auth_middleware_1.auth)("driver"), driver_controller_1.DriverControllers.getMyHistory);
exports.DriverRoutes = router;
