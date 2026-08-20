"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard.store";
import StatsGrid from "./StatsGrid";

export default function DashboardStats() {
    const { stats, loading, fetchDashboardStats } = useDashboardStore();

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                Loading...
            </div>
        );
    }

    return <StatsGrid stats={stats} />;
}
