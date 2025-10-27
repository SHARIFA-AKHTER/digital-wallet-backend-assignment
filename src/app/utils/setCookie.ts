/* eslint-disable @typescript-eslint/no-explicit-any */


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
