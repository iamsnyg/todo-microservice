import { z } from "zod";

export const createTodoSchema = z.object({
    title: z
        .string()
<<<<<<< HEAD
=======
        .trim()
>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title cannot exceed 100 characters"),

    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),

    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

    status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "CANCELED"]).optional(),

<<<<<<< HEAD
    dueDate: z.string().datetime().optional(),

    // userId: z.string().min(1, "User ID is required"),
});

export const updateTodoSchema = createTodoSchema.partial();
=======
    dueDate: z.string().datetime().optional().or(z.literal("")),
});

export const updateTodoSchema = createTodoSchema.partial();


>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
