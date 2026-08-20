import {
    createTodo as createTodoRepository,
    findTodoById,
    findTodosByUserId,
    updateTodo as updateTodoRepository,
    deleteTodo as deleteTodoRepository,
} from "../repositories/todo.repository.js";

import { publishEvent } from "./rabbitmq.service.js";

export async function createTodo(data) {
    const todo = await createTodoRepository(data);

    await publishEvent("todo.created", {
        type: "todo.created",
        id: todo.id,
        title: todo.title,
        description: todo.description,
        userId: todo.userId,
    });

    return todo;
}

export async function getTodoById(id) {
    const todo = await findTodoById(id);

    if (!todo) {
        throw new Error("Todo not found");
    }

    return todo;
}

export async function getUserTodos(filters) {
    return await findTodosByUserId(filters);
}

export async function updateTodo(id, data) {
    await getTodoById(id);

    const todo = await updateTodoRepository(id, data);

    await publishEvent("todo.updated", {
        type: "todo.updated",
        id: todo.id,
        title: todo.title,
        status: todo.status,
        userId: todo.userId,
    });

    return todo;
}

export async function deleteTodo(id) {
    const todo = await getTodoById(id);

    await deleteTodoRepository(id);

    await publishEvent("todo.deleted", {
        type: "todo.deleted",
        id: todo.id,
        title: todo.title,
        userId: todo.userId,
    });
}
