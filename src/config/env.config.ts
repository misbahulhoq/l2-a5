import dotenv from "dotenv";
dotenv.config();

interface IEnvConfig {
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
}

const requiredKeys = ["PORT", "MONGO_URI", "JWT_SECRET"];

requiredKeys.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export const envVars: IEnvConfig = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET as string,
};

export default envVars;
