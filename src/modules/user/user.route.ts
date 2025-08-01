import express from "express";
import { UserControllers } from "./user.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", auth("admin"), UserControllers.getAllUsers);

export const UserRoutes = router;
