"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTodoStore } from "@/store/todo.store";

export default function TodoPagination() {
    const { page, total, limit, setPage } = useTodoStore();

    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) return null;

    return (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
            <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="gap-2"
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </Button>

            <div className="text-center">
                <p className="text-sm font-medium">
                    Page {page} of {totalPages}
                </p>

                <p className="text-xs text-muted-foreground">
                    {total} total {total === 1 ? "todo" : "todos"}
                </p>
            </div>

            <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="gap-2"
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
