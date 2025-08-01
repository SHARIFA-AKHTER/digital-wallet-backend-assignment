/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextFunction, Request, Response } from "express";

// export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
//   console.error('❌ Error:', err);
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'Something went wrong';

//   res.status(statusCode).json({
//     success: false,
//     message,
//     errorDetails: err.stack,
//   });
// };

import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
