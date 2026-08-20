import express from "express";
import {
    createTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo,
} from "../controllers/todo.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
    createTodoSchema,
    updateTodoSchema,
} from "../validations/todo.validation.js";
import { getStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(createTodoSchema), createTodo);

router.get("/", getTodos);

router.get("/stats", getStats);


router.get("/:id", getTodo);

router.put("/:id", validate(updateTodoSchema), updateTodo);

router.delete("/:id", deleteTodo);

export default router;
