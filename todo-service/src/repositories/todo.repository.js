import prisma from "../config/database.js";

export async function createTodo(data) {
    return await prisma.todo.create({
        data,
    });
}

export async function findTodoById(id) {
    return await prisma.todo.findUnique({
        where: {
            id,
        },
    });
}

export async function findTodosByUserId({
    userId,
    page = 1,
    limit = 10,
    search = "",
    status = "",
    priority = "",
}) {
    const where = {
        userId,

        ...(search && {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        }),

        ...(status && {
            status,
        }),

        ...(priority && {
            priority,
        }),
    };

    const [todos, total] = await Promise.all([
        prisma.todo.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * limit,
            take: limit,
        }),

        prisma.todo.count({
            where,
        }),
    ]);

    return {
        data: todos,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}

export async function updateTodo(id, data) {
    return await prisma.todo.update({
        where: {
            id,
        },
        data,
    });
}

export async function deleteTodo(id) {
    return await prisma.todo.delete({
        where: {
            id,
        },
    });
}
