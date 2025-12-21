import "dotenv/config";
import express from "express";
import cors from "cors";
import { UserRouter } from "./router/user";
import { GoogleAuthRouter } from "./router/googleuser";
import { rateLimiter } from "./router/ratelimiter";
import { connectRedis } from "./db/redis-cli";

const app = express();
app.use(express.json());
app.use(cors());
// Global - generous limit for DDoS protection
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 1000 }));

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/googleauth", GoogleAuthRouter);

async function startServer() {
  await connectRedis();
  
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
}

startServer().catch(console.error);


