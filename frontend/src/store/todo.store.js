import { create } from "zustand";

import {
    getTodos,
    createTodo as createTodoService,
    updateTodo as updateTodoService,
    deleteTodo as deleteTodoService,
} from "@/services/todo.service";

export const useTodoStore = create((set, get) => ({
    todos: [],
    loading: false,

    total: 0,

    page: 1,
    limit: 6,

    search: "",
    status: "",
    priority: "",

    setLoading: (loading) =>
        set({
            loading,
        }),

    // Search
    setSearch: (search) =>
        set({
            search,
            page: 1,
        }),

    // Status Filter
    setStatus: (status) =>
        set({
            status,
            page: 1,
        }),

    // Priority Filter
    setPriority: (priority) =>
        set({
            priority,
            page: 1,
        }),

    // Pagination
    setPage: (page) =>
        set({
            page,
        }),

    // Page Size
    setLimit: (limit) =>
        set({
            limit,
            page: 1,
        }),

    // Fetch Todos
    fetchTodos: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const state = get();

            const response = await getTodos({
                page: params.page ?? state.page,
                limit: params.limit ?? state.limit,
                search: params.search ?? state.search,
                status: params.status ?? state.status,
                priority: params.priority ?? state.priority,
            });

            set({
                todos: response.data || [],
                total: response.total || 0,
            });
        } catch (error) {
            console.error(error);
        } finally {
            set({
                loading: false,
            });
        }
    },

    // Create Todo
    createTodo: async (todoData) => {
        try {
            set({
                loading: true,
            });

            const response = await createTodoService(todoData);

            await get().fetchTodos();

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error(error);

            return {
                success: false,
                message:
                    error.response?.data?.message || "Failed to create todo",
            };
        } finally {
            set({
                loading: false,
            });
        }
    },

    // Update Todo
    updateTodo: async (id, todoData) => {
        try {
            set({
                loading: true,
            });

            await updateTodoService(id, todoData);

            await get().fetchTodos();

            return {
                success: true,
            };
        } catch (error) {
            console.error(error);

            return {
                success: false,
                message:
                    error.response?.data?.message || "Failed to update todo",
            };
        } finally {
            set({
                loading: false,
            });
        }
    },

    // Delete Todo
    deleteTodo: async (id) => {
        try {
            set({
                loading: true,
            });

            await deleteTodoService(id);

            await get().fetchTodos();

            return {
                success: true,
            };
        } catch (error) {
            console.error(error);

            return {
                success: false,
                message:
                    error.response?.data?.message || "Failed to delete todo",
            };
        } finally {
            set({
                loading: false,
            });
        }
    },
}));
