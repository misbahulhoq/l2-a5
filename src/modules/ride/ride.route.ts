import express from "express";
import { auth } from "../../middlewares/auth.middleware";
import { RideControllers } from "./rider.controller";

const router = express.Router();

router.post("/request", auth("rider"), RideControllers.requestRide);

export const RideRoutes = router;
