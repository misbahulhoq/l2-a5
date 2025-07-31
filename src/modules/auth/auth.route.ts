import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/signup", AuthControllers.signupUser);

export const AuthRoutes = router;
