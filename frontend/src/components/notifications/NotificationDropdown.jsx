"use client";

import { useNotificationStore } from "@/store/notification.store";
import { useAuthStore } from "@/store/auth.store";

export default function NotificationDropdown() {
    const user = useAuthStore((state) => state.user);

    const {
        notifications,
        loading,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    } = useNotificationStore();

    if (loading) {
        return <div className="w-80 p-4">Loading...</div>;
    }

    return (
        <div className="w-80 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-3">
                <h3 className="font-semibold">Notifications</h3>

                <button
                    onClick={() => markAllNotificationsAsRead(user.id)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Mark all
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                </div>
            ) : (
                notifications.map((notification) => (
                    <button
                        key={notification.id}
                        onClick={() =>
                            !notification.isRead &&
                            markNotificationAsRead(notification.id, user.id)
                        }
                        className={`w-full border-b p-3 text-left transition hover:bg-slate-100 ${
                            notification.isRead ? "bg-white" : "bg-blue-200"
                        }`}
                    >
                        <h4 className="font-medium">{notification.title}</h4>

                        <p className="text-sm text-muted-foreground">
                            {notification.message}
                        </p>
                    </button>
                ))
            )}
        </div>
    );
}
