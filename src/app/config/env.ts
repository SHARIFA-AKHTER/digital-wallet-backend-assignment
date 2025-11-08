/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import dotenv from "dotenv";

// dotenv.config();

// interface EnvConfig {
//   NODE_ENV: string;
//   BCRYPT_SALT_ROUND: any;
//   PORT: string;
//   DB_URL: string;
//   JWT_ACCESS_SECRET: string;
//   JWT_REFRESH_SECRET: string;
//   JWT_ACCESS_EXPIRES: string;
//   JWT_REFRESH_EXPIRES: string;
// }

// const loadEnvVariables = (): EnvConfig => {
//   const requiredEnvVariables = [
//     "NODE_ENV",
//     "PORT",
//     "DB_URL",
//     "JWT_ACCESS_SECRET",
//     "JWT_REFRESH_SECRET",
//     "JWT_ACCESS_EXPIRES",
//     "JWT_REFRESH_EXPIRES",
//   ];

//   requiredEnvVariables.forEach((key) => {
//     if (!process.env[key]) {
//       throw new Error(`Missing required environment variable ${key}`);
//     }
//   });

//   return {
//     NODE_ENV: process.env.NODE_ENV!, // ✅ Add this
//     PORT: process.env.PORT!,
//     DB_URL: process.env.DB_URL!,
//     JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
//     JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
//     JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES!,
//     JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES!,
//     BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND!,
//   };
// };

// export const envVars = loadEnvVariables();

import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DB_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_EXPIRES: string;
  BCRYPT_SALT_ROUND: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FRONTEND_URL: string;
  SESSION_SECRET: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
}

const requiredEnvVariables = [
  "NODE_ENV",
  "PORT",
  "DB_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_ACCESS_EXPIRES",
  "JWT_REFRESH_EXPIRES",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "FRONTEND_URL",
  "SESSION_SECRET",
  "SUPER_ADMIN_EMAIL",
  "SUPER_ADMIN_PASSWORD",
];

requiredEnvVariables.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

export const envVars: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV!,
  PORT: process.env.PORT!,
  DB_URL: process.env.DB_URL!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES!,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES!,
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND ?? "10",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  SESSION_SECRET: process.env.SESSION_SECRET!,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL!,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD!,
};
