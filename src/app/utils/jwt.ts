import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

/**
 * Generate JWT Token
 */
export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};


