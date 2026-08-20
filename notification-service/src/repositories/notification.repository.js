import prisma from "../config/database.js";

export async function createNotification(data) {
    return await prisma.notification.create({
        data,
    });
}

export async function getNotificationsByUser(userId) {
    return await prisma.notification.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function markNotificationAsRead(id) {
    return await prisma.notification.update({
        where: {
            id,
        },
        data: {
            isRead: true,
        },
    });
}

export async function markAllNotificationsAsRead(userId) {
    return await prisma.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
}
