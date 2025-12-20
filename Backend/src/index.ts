import "dotenv/config";
import express from "express";
import cors from "cors";
import { UserRouter } from "./router/user";
import { GoogleAuthRouter } from "./router/googleuser";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/googleauth", GoogleAuthRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});


