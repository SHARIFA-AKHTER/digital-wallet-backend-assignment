// import { JwtPayload } from "jsonwebtoken";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: JwtPayload & {
//         userId: string;
//       };
//     }
//   }
// }

import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload & {
      _id?: string;
      role?: string;
      email?: string;
     
    };
  }
}
