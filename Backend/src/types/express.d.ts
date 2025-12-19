import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      id?: number;
      user?: string | JwtPayload;
    }
  }
}

export {};
