import { email, z } from "zod";

export const UserSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(10),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(10),
});
