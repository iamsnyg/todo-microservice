import { z } from "zod";

export const createTodoSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title cannot exceed 100 characters"),

    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),

    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

    status: z
        .enum(["TODO", "IN_PROGRESS", "COMPLETED", "CANCELED"])
        .optional(),

    dueDate: z.string().datetime().optional().or(z.literal("")),
});

export const updateTodoSchema = createTodoSchema.partial();
