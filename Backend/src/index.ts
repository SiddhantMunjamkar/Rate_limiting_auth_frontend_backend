import "dotenv/config";
import express from "express";
import cors from "cors";
import { UserRouter } from "./router/user";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", UserRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
