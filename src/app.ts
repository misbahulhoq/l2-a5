import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Ride Booking API!",
  });
});

export default app;
