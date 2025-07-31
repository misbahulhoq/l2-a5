import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { TUser } from "./user.interface";
import envVars from "../../config/env.config";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0, // Exclude password from query results by default
    },
    role: {
      type: String,
      enum: ["admin", "rider", "driver"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password as string,
      envVars.SALT_ROUNDS
    );
  }
  next();
});

userSchema.statics.isUserExists = async function (email: string) {
  return await this.findOne({ email });
};

export const User = model<TUser>("User", userSchema);
