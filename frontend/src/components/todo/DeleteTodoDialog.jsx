"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { useTodoStore } from "@/store/todo.store";

import { Button } from "@/components/ui/button";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteTodoDialog({ todo }) {
    const [deleting, setDeleting] = useState(false);

    const deleteTodo = useTodoStore((state) => state.deleteTodo);

    async function handleDelete() {
        try {
            setDeleting(true);

            const result = await deleteTodo(todo.id);

            if (!result.success) {
                alert(result.message);
            }

            // Later replace alert with toast
            // toast.success("Todo deleted successfully");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={<Button variant="destructive" size="icon" />}
            >
                <Trash2 className="h-4 w-4" />
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">
                        Delete Todo
                    </AlertDialogTitle>

                    <AlertDialogDescription className="space-y-2">
                        <p>
                            Are you sure you want to delete
                            <strong> &ldquo;{todo.title}&rdquo;</strong>?
                        </p>

                        <p className="text-sm text-muted-foreground">
                            This action cannot be undone.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {deleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
