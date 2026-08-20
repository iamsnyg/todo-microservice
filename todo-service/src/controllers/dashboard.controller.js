import { getDashboardStats } from "../services/dashboard.service.js";

export async function getStats(req, res, next) {
    try {
        const userId = req.user.id;

        const stats = await getDashboardStats(userId);

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
}
