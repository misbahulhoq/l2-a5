import dotenv from "dotenv";
dotenv.config({ debug: true });

interface IEnvConfig {
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  SALT_ROUNDS: number | string;
  ADMIN_EMAIL: string;
  ADMIN_PASS: string;
  NODE_ENV?: "development" | "production";
  MONGO_TEST_URI?: string;
}

const requiredKeys: (keyof IEnvConfig)[] = [
  // "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "SALT_ROUNDS",
  "ADMIN_EMAIL",
  "ADMIN_PASS",
  // "NODE_ENV",
  "MONGO_TEST_URI",
  "JWT_EXPIRES_IN",
];

requiredKeys.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export const envVars: IEnvConfig = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS || 10),
  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
  ADMIN_PASS: process.env.ADMIN_PASS as string,
  NODE_ENV: process.env.NODE_ENV as "development" | "production",
  MONGO_TEST_URI: process.env.MONGO_TEST_URI as string,
};

export default envVars;
