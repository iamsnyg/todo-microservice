import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name cannot exceed 50 characters"),

        email: z.email("Please enter a valid email"),

        password: z.string().min(6, "Password must be at least 6 characters"),

        confirmPassword: z.string().min(6, "Confirm Password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
