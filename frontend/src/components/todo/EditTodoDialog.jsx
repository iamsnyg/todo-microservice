"use client";

import { useState } from "react";
import { Loader2, Pencil } from "lucide-react";

import { useTodoStore } from "@/store/todo.store";

import { Button } from "@/components/ui/button";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import TodoForm from "./TodoForm";

export default function EditTodoDialog({ todo }) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        status: todo.status,
        dueDate: todo.dueDate
            ? new Date(todo.dueDate).toISOString().split("T")[0]
            : "",
    });

    const updateTodo = useTodoStore((state) => state.updateTodo);

    async function handleSubmit() {
        if (!formData.title.trim()) {
            alert("Title is required.");
            return;
        }

        try {
            setSaving(true);

            const result = await updateTodo(todo.id, formData);

            if (result.success) {
                setOpen(false);

                // Later replace with toast.success(...)
            } else {
                alert(result.message);
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                }
            />

            <SheetContent side="right" className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Edit Todo</SheetTitle>

                    <SheetDescription>
                        Update your task information.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6">
                    <TodoForm formData={formData} setFormData={setFormData} />

                    <div className="mt-8 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            disabled={saving}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button onClick={handleSubmit} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
