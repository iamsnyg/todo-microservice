import { create } from "zustand";

import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from "@/services/notification.service";

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    loading: false,

    setLoading: (loading) =>
        set({
            loading,
        }),

    // Fetch Notifications
    fetchNotifications: async (userId) => {
        try {
            set({
                loading: true,
            });

            const response = await getNotifications(userId);

            set({
                notifications: response.data || [],
            });
        } catch (error) {
            console.error(error);
        } finally {
            set({
                loading: false,
            });
        }
    },

    // Mark One Notification as Read
    markNotificationAsRead: async (id, userId) => {
        try {
            await markAsRead(id);

            await get().fetchNotifications(userId);

            return {
                success: true,
            };
        } catch (error) {
            console.error(error);

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to mark notification as read",
            };
        }
    },

    // Mark All Notifications as Read
    markAllNotificationsAsRead: async (userId) => {
        try {
            await markAllAsRead(userId);

            await get().fetchNotifications(userId);

            return {
                success: true,
            };
        } catch (error) {
            console.error(error);

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to mark all notifications as read",
            };
        }
    },
}));
