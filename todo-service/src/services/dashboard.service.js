import { getTodoStats } from "../repositories/dashboard.repository.js";

export async function getDashboardStats(userId) {
    const stats = await getTodoStats(userId);

    return stats;
}
