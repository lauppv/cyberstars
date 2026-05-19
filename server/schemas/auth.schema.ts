import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  email: z
    .email("Please enter a valid email address")
    .max(255, "Email must be at most 255 characters"),
  password: z
    .string()
    .min(6, "Password is too short — must be at least 6 characters")
    .max(255, "Password must be at most 255 characters"),
});

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .max(255, "Email must be at most 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(255, "Password must be at most 255 characters"),
});
