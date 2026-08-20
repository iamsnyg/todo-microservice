"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TodoPagination from "./TodoPagination";
import TodoList from "./TodoList";
import CreateTodoDialog from "./CreateTodoDialog";
import TodoFilters from "./TodoFilters";

export default function TodoPage() {
    return (
        <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
            {/* Header */}
            <div className="flex flex-col gap-6 rounded-2xl border bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Todos</h1>

                    <p className="text-slate-500">
                        Manage all your tasks in one place.
                    </p>
                </div>

                <CreateTodoDialog />
            </div>

            {/* Filters */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <TodoFilters />
            </div>

            {/* Todo List */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle>Todo List</CardTitle>
                </CardHeader>

                <CardContent>
                    <TodoList />

                    <TodoPagination />
                </CardContent>
            </Card>
        </div>
    );
}
