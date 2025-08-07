/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  BCRYPT_SALT_ROUND: any;
  PORT: string;
  DB_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_EXPIRES: string;
  // BCRYPT_SALT_ROUND: string;
  // FRONTEND_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables = [
    "PORT",
    "DB_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_EXPIRES",
    // "BCRYPT_SALT_ROUND",
    // "FRONTEND_URL",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT!,
    DB_URL: process.env.DB_URL!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES!,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES!,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND!,
    // FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",
  };
};

export const envVars = loadEnvVariables();

