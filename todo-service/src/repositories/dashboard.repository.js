import prisma from "../config/database.js";

export async function getTodoStats(userId) {
    const [total, completed, todo, inProgress, canceled, highPriority] =
        await Promise.all([
            prisma.todo.count({
                where: { userId },
            }),

            prisma.todo.count({
                where: {
                    userId,
                    status: "COMPLETED",
                },
            }),

            prisma.todo.count({
                where: {
                    userId,
                    status: "TODO",
                },
            }),

            prisma.todo.count({
                where: {
                    userId,
                    status: "IN_PROGRESS",
                },
            }),

            prisma.todo.count({
                where: {
                    userId,
                    status: "CANCELED",
                },
            }),

            prisma.todo.count({
                where: {
                    userId,
                    priority: "HIGH",
                },
            }),
        ]);

    return {
        total,
        completed,
        todo,
        inProgress,
        canceled,
        highPriority,
    };
}
