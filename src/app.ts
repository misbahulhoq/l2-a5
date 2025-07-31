import express, { Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/error.middleware";
import seedAdmin from "./utils/seedAdmin";
import envVars from "./config/env.config";
import routes from "./routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Ride Booking API!",
  });
});

seedAdmin(envVars.ADMIN_EMAIL, envVars.ADMIN_PASS);

// global error handler
app.use(globalErrorHandler);

export default app;
