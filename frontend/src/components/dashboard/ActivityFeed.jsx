"use client";

import { useEffect } from "react";
import { CheckCircle2, PlusCircle, Pencil, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useNotificationStore } from "@/store/notification.store";
import { useAuthStore } from "@/store/auth.store";

function getActivity(type) {
    switch (type) {
        case "todo.created":
            return {
                icon: PlusCircle,
                color: "text-blue-600",
                bg: "bg-blue-100",
                label: "Created",
            };

        case "todo.updated":
            return {
                icon: Pencil,
                color: "text-amber-600",
                bg: "bg-amber-100",
                label: "Updated",
            };

        case "todo.deleted":
            return {
                icon: Trash2,
                color: "text-red-600",
                bg: "bg-red-100",
                label: "Deleted",
            };

        default:
            return {
                icon: CheckCircle2,
                color: "text-green-600",
                bg: "bg-green-100",
                label: "Activity",
            };
    }
}

export default function ActivityFeed() {
    const user = useAuthStore((state) => state.user);

    const { notifications, loading, fetchNotifications } =
        useNotificationStore();

    useEffect(() => {
        if (user?.id) {
            fetchNotifications(user.id);
        }
    }, [user]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>

                <CardContent>Loading...</CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {notifications.slice(0, 5).map((activity) => {
                    const item = getActivity(activity.type);
                    const Icon = item.icon;

                    return (
                        <div
                            key={activity.id}
                            className="flex items-start gap-4"
                        >
                            <div className={`rounded-full p-2 ${item.bg}`}>
                                <Icon className={`h-4 w-4 ${item.color}`} />
                            </div>

                            <div className="flex-1">
                                <p className="font-medium">
                                    {item.label}{" "}
                                    <span className="text-slate-700">
                                        &ldquo;{activity.title}&rdquo;
                                    </span>
                                </p>

                                <p className="text-sm text-slate-500">
                                    {new Date(
                                        activity.createdAt,
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
