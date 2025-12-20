import {  Request, Response, NextFunction } from "express";
import { redisClient } from "../db/redis-cli";

 export function rateLimiter(options: { windowMs: number; maxRequests: number }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = (
        req.headers["x-forwarded-for"] || req.connection.remoteAddress
      )?.toString().slice(0, 9) || "unknown";

      let ttl;
      const request = await redisClient.incr(ip);
      if (request === 1) {
        await redisClient.expire(ip, options.windowMs / 1000);
        ttl = options.windowMs / 1000;
      } else {
        ttl = await redisClient.ttl(ip);
      }

      if (request > options.maxRequests) {
        return res
          .status(429)
          .json({
            message: `Too many requests, please try again after ${ttl} seconds`,
          });
      } else {
        next();
      }
    } catch (error) {
      console.error("Ratelimiter error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
