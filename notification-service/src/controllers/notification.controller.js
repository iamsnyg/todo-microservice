import {
    getUserNotifications,
    readNotification,
    readAllNotifications,
} from "../services/notification.service.js";

export async function getNotifications(req, res, next) {
    try {
        const { userId } = req.query;

        const notifications = await getUserNotifications(userId);

        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
}

export async function markAsRead(req, res, next) {
    try {
        const notification = await readNotification(req.params.id);

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification,
        });
    } catch (error) {
        next(error);
    }
}

export async function markAllAsRead(req, res, next) {
    try {
        const { userId } = req.body;

        await readAllNotifications(userId);

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        next(error);
    }
}
