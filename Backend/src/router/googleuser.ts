import { Router, Request, Response } from "express";
import { googleClient } from "../config.js";
import { prismaClient } from "../db/index.js";
import { JWT_PASSWORD } from "../config.js";
import { authmiddleware } from "./middleware.js";
import jwt from "jsonwebtoken";

const googlerouter = Router();

googlerouter.get("/callback", async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({ error: "No authorization code provided" });
    }

    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.name || !payload.sub) {
      return res.status(400).json({ error: "Invalid token payload" });
    }

    const email = payload.email;
    const name = payload.name;
    const avatar = payload.picture || null;
    const googleId = payload.sub;

    let user = await prismaClient.googleUser.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prismaClient.googleUser.create({
        data: {
          googleId,
          name,
          email,
          avatar,
        },
      });
    }

    const token = jwt.sign({ id: user.id }, JWT_PASSWORD);
    res.redirect(`${process.env.FRONTEND_URL}/google-callback/?token=${token}`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

googlerouter.get("/me", authmiddleware, async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.googleUser.findUnique({
      where: { id: req.id },
      select: {
        id: true,
        googleId: true,
        name: true,
        email: true,
        avatar: true,
        CreatedAt: true,
        UpdatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export const GoogleAuthRouter = googlerouter;
