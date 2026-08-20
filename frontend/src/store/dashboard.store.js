import { create } from "zustand";
import { getDashboardStats } from "@/services/dashboard.service";

export const useDashboardStore = create((set) => ({
    stats: {
        total: 0,
        todo: 0,
        inProgress: 0,
        completed: 0,
        canceled: 0,
        highPriority: 0,
    },

    loading: false,

    fetchDashboardStats: async () => {
        try {
            set({
                loading: true,
            });

            const response = await getDashboardStats();

            set({
                stats: response.data,
            });
        } catch (error) {
            console.error("Dashboard Stats Error:", error);
        } finally {
            set({
                loading: false,
            });
        }
    },
}));
