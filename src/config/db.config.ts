import mongoose from "mongoose";
import envVars from "./env.config";

async function dbConnect() {
  try {
    await mongoose.connect(envVars.MONGO_URI as string);
    console.log("🛢️ Database is connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
}

export default dbConnect;
