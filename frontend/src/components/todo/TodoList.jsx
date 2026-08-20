"use client";

import { useEffect } from "react";
import { ClipboardList } from "lucide-react";

import { useTodoStore } from "@/store/todo.store";
import TodoCard from "./TodoCard";

export default function TodoList() {
    const { todos, loading, page, search, status, priority, fetchTodos } =
        useTodoStore();

    useEffect(() => {
        fetchTodos();
    }, [page, search, status, priority]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="h-24 animate-pulse rounded-lg border bg-slate-100"
                    />
                ))}
            </div>
        );
    }

    if (todos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <ClipboardList className="mb-4 h-14 w-14 text-slate-300" />

                <h3 className="text-lg font-semibold">No todos found</h3>

                <p className="mt-2 text-sm text-slate-500">
                    Create your first todo or change your filters.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {todos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} />
            ))}
        </div>
    );
}
