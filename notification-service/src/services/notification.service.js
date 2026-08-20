import { sendEmail } from "./email.service.js";
import { loadTemplate } from "../utils/templateLoader.js";

import {
    createNotification,
    getNotificationsByUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../repositories/notification.repository.js";

export async function handleNotification(event) {
    switch (event.type) {
        case "user.registered": {
            const html = await loadTemplate("welcome-email.html", {
                name: event.name,
            });

            await sendEmail({
                to: event.email,
                subject: "Welcome to Todo App",
                html,
            });

            break;
        }

        case "todo.created": {
            console.log("📝 Todo Created");

            await createNotification({
                userId: event.userId,
                type: event.type,
                title: event.title,
                message: `Todo "${event.title}" has been created.`,
            });

            console.log("✅ Notification Saved");

            break;
        }

        case "todo.updated": {
            console.log("✏️ Todo Updated");

            await createNotification({
                userId: event.userId,
                type: event.type,
                title: event.title,
                message: `Todo "${event.title}" has been updated.`,
            });

            console.log("✅ Notification Saved");

            break;
        }

        case "todo.deleted": {
            console.log("🗑️ Todo Deleted");

            await createNotification({
                userId: event.userId,
                type: event.type,
                title: event.title,
                message: `Todo "${event.title}" has been deleted.`,
            });

            console.log("✅ Notification Saved");

            break;
        }

        default: {
            console.log("Unknown Event");
            console.log(event);
        }
    }
}

// ================================
// Notification API Functions
// ================================

export async function getUserNotifications(userId) {
    return await getNotificationsByUser(userId);
}

export async function readNotification(id) {
    return await markNotificationAsRead(id);
}

export async function readAllNotifications(userId) {
    return await markAllNotificationsAsRead(userId);
}
