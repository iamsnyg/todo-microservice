"use client";

import { useEffect } from "react";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useTodoStore } from "@/store/todo.store";

function getIcon(status) {
    switch (status) {
        case "COMPLETED":
            return <CheckCircle2 className="h-5 w-5 text-green-600" />;

        case "IN_PROGRESS":
            return <Clock3 className="h-5 w-5 text-amber-600" />;

        default:
            return <Circle className="h-5 w-5 text-slate-400" />;
    }
}

function getBadgeVariant(status) {
    switch (status) {
        case "COMPLETED":
            return "default";

        case "IN_PROGRESS":
            return "secondary";

        default:
            return "outline";
    }
}

export default function RecentTodos() {
    const { todos, loading, fetchTodos } = useTodoStore();

    useEffect(() => {
        fetchTodos({
            page: 1,
            limit: 5,
        });
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Todos</CardTitle>
                </CardHeader>

                <CardContent>Loading...</CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Todos</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                    >
                        <div className="flex items-center gap-3">
                            {getIcon(todo.status)}

                            <span className="font-medium">{todo.title}</span>
                        </div>

                        <Badge variant={getBadgeVariant(todo.status)}>
                            {todo.status.replace("_", " ")}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
