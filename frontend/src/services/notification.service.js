import api from "./api";

// Get all notifications
export async function getNotifications(userId) {
    const response = await api.get("/api/notifications", {
        params: {
            userId,
        },
    });

    return response.data;
}

// Mark one notification as read
export async function markAsRead(id) {
    const response = await api.patch(`/api/notifications/${id}/read`);

    return response.data;
}

// Mark all notifications as read
export async function markAllAsRead(userId) {
    const response = await api.patch("/api/notifications/read-all", {
        userId,
    });

    return response.data;
}
