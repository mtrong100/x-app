import * as z from "zod";

export const SignupValidation = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username can't exceed 30 characters")
    .nonempty("Username is required"),
  email: z
    .string()
    .toLowerCase()
    .email("Invalid email format")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .nonempty("Password is required"),
});

export const SigninValidation = z.object({
  email: z
    .string()
    .toLowerCase()
    .email("Invalid email format")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .nonempty("Password is required"),
});

export const UpdateUserValidation = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username can't exceed 30 characters")
    .nonempty("Username is required"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(10, "Slug can't exceed 10 characters")
    .nonempty("Slug is required"),
});
