import * as todoService from "../services/todo.service.js";

export async function createTodo(req, res, next) {
    try {
        const todo = await todoService.createTodo({
            ...req.body,
            userId: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Todo created successfully",
            data: todo,
        });
    } catch (error) {
        next(error);
    }
}

export async function getTodos(req, res, next) {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            status = "",
            priority = "",
        } = req.query;

        const result = await todoService.getUserTodos({
            userId: req.user.id,
            page: Number(page),
            limit: Number(limit),
            search,
            status,
            priority,
        });

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
}

export async function getTodo(req, res, next) {
    try {
        const todo = await todoService.getTodoById(req.params.id);

        res.status(200).json({
            success: true,
            data: todo,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateTodo(req, res, next) {
    try {
        const todo = await todoService.updateTodo(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            data: todo,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteTodo(req, res, next) {
    try {
        await todoService.deleteTodo(req.params.id);

        res.status(200).json({
            success: true,
            message: "Todo deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}
