"use client";

import { Calendar, Flag, CircleDot } from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import EditTodoDialog from "./EditTodoDialog";
import DeleteTodoDialog from "./DeleteTodoDialog";

export default function TodoCard({ todo }) {
    const priorityVariant = {
        LOW: "secondary",
        MEDIUM: "default",
        HIGH: "destructive",
    };

    const statusClass = {
        TODO: "bg-gray-100 text-gray-700 border-gray-200",
        IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
        COMPLETED: "bg-green-100 text-green-700 border-green-200",
        CANCELED: "bg-red-100 text-red-700 border-red-200",
    };

    const formatStatus = (status) =>
        status
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());

    const formatPriority = (priority) =>
        priority.charAt(0) + priority.slice(1).toLowerCase();

    return (
        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardContent className="space-y-5 p-5">
                {/* Header */}
                <div>
                    <h3 className="text-lg font-semibold">{todo.title}</h3>

                    {todo.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {todo.description}
                        </p>
                    )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant="outline"
                        className={statusClass[todo.status]}
                    >
                        <CircleDot className="mr-1 h-3 w-3" />
                        {formatStatus(todo.status)}
                    </Badge>

                    <Badge
                        variant={priorityVariant[todo.priority] || "secondary"}
                    >
                        <Flag className="mr-1 h-3 w-3" />
                        {formatPriority(todo.priority)}
                    </Badge>
                </div>

                {/* Dates */}
                <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Created:
                        {format(new Date(todo.createdAt), "dd MMM yyyy")}
                    </div>

                    {todo.dueDate && (
                        <div className="flex items-center gap-2 text-orange-600">
                            <Calendar className="h-4 w-4" />
                            Due:
                            {format(new Date(todo.dueDate), "dd MMM yyyy")}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-end">
                    <EditTodoDialog todo={todo} />

                    <DeleteTodoDialog todo={todo} />
                </div>
            </CardContent>
        </Card>
    );
}
