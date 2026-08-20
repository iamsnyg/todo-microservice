"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

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

const initialForm = {
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
};

export default function CreateTodoDialog() {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState(initialForm);

    const createTodo = useTodoStore((state) => state.createTodo);

    async function handleSubmit() {
        if (!formData.title.trim()) {
            alert("Title is required.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                priority: formData.priority,
                status: formData.status,
                dueDate: formData.dueDate
                    ? new Date(formData.dueDate).toISOString()
                    : undefined,
            };

            console.log("Creating Todo:", payload);

            const result = await createTodo(payload);

            if (result.success) {
                setOpen(false);
                setFormData(initialForm);
            } else {
                alert(result.message || "Failed to create todo.");
            }
        } catch (error) {
            console.error("Create Todo Error:", error);

            alert(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to create todo.",
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Todo
                    </Button>
                }
            />

            <SheetContent side="right" className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Create New Todo</SheetTitle>

                    <SheetDescription>
                        Fill in the details below to create a new task.
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
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Todo
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
