import { Router, Request, Response } from "express";
import { UserSignupSchema, UserLoginSchema } from "../types/schema";
import { authmiddleware } from "./middleware";
import { prismaClient } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parsedBody = UserSignupSchema.safeParse(body);

    if (!parsedBody.success) {
      return res.status(411).json({ message: "Incorrect inputs" });
    }

    const userExists = await prismaClient.user.findUnique({
      where: { email: parsedBody.data.email },
    });

    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(parsedBody.data.password, 10);
    const newUser = await prismaClient.user.create({
      data: {
        email: parsedBody.data.email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User created", userId: newUser.id });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parsedBody = UserLoginSchema.safeParse(body);

    if (!parsedBody.success) {
      return res.status(411).json({ message: "Incorrect inputs" });
    }

    const user = await prismaClient.user.findUnique({
      where: { email: parsedBody.data.email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(
      parsedBody.data.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, JWT_PASSWORD);
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/profile", authmiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prismaClient.user.findUnique({
      where: { id: req.id },
      select: { email: true, id: true, CreatedAt: true, UpdatedAt: true },
    });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export const UserRouter = router;
