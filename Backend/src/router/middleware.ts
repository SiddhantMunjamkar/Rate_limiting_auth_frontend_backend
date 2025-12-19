import { Request, Response, NextFunction } from "express";
import { JWT_PASSWORD } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authmiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return;
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_PASSWORD) as JwtPayload;
    req.id = payload.id;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      res.status(500).json({ message: "Authentication failed" });
    }
  }
};
