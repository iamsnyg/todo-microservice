"use client";

import { Search, RotateCcw } from "lucide-react";

import { useTodoStore } from "@/store/todo.store";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TodoFilters() {
    const { search, status, priority, setSearch, setStatus, setPriority } =
        useTodoStore();

    function clearFilters() {
        setSearch("");
        setStatus("");
        setPriority("");
    }

    return (
        <div className="mb-6 flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    placeholder="Search todos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
                {/* Status */}
                <Select
                    value={status || "ALL"}
                    onValueChange={(value) =>
                        setStatus(value === "ALL" ? "" : value)
                    }
                >
                    <SelectTrigger className="w-full sm:w-44">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="TODO">Todo</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELED">Canceled</SelectItem>
                    </SelectContent>
                </Select>

                {/* Priority */}
                <Select
                    value={priority || "ALL"}
                    onValueChange={(value) =>
                        setPriority(value === "ALL" ? "" : value)
                    }
                >
                    <SelectTrigger className="w-full sm:w-44">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="ALL">All Priority</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                </Select>

                {/* Clear Filters */}
                <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="gap-2"
                >
                    <RotateCcw className="h-4 w-4" />
                    Clear
                </Button>
            </div>
        </div>
    );
}
