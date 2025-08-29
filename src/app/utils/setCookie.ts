/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Response } from "express";
// import { envVars } from "../config/env";

// export interface AuthTokens {
//   accessToken?: string;
//   refreshToken?: string;
// }

// export const setAuthCookie = (res: Response, tokenInfo: AuthTokens): void => {
//   if (tokenInfo.accessToken) {
//     res.cookie("accessToken", tokenInfo.accessToken, {
//       httpOnly: true,
//       secure: envVars.NODE_ENV === "production",
//       sameSite: "none",
//     });
//   }

//   if (tokenInfo.refreshToken) {
//     res.cookie("refreshToken", tokenInfo.refreshToken, {
//       httpOnly: true,
//       secure: envVars.NODE_ENV === "production",
//       sameSite: "none",
//     });
//   }
// };

import { Response } from "express";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}
export const setAuthCookie = (res: Response, tokenInfo: AuthTokens): void => {
  const response = res as any; 

  const isProd = process.env.NODE_ENV === "production";

  if (tokenInfo.accessToken) {
    response.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });
  }

  if (tokenInfo.refreshToken) {
    response.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });
  }
};
