"use client";

import { useEffect } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import NotificationDropdown from "./NotificationDropdown";

import { useNotificationStore } from "@/store/notification.store";
import { useAuthStore } from "@/store/auth.store";

export default function NotificationBell() {
    const user = useAuthStore((state) => state.user);

    const { notifications, fetchNotifications } = useNotificationStore();

    useEffect(() => {
        if (user?.id) {
            fetchNotifications(user.id);
        }
    }, [user]);

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead,
    ).length;

    return (
        <Popover>
            <PopoverTrigger
                render={<Button variant="ghost" size="icon" className="relative" />}
            >
                <Bell className="h-5 w-5" />

                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-0">
                <NotificationDropdown />
            </PopoverContent>
        </Popover>
    );
}
