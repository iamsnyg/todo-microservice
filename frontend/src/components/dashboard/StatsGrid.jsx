"use client";

import {
    CheckSquare,
    Clock3,
    CircleCheckBig,
    TriangleAlert,
} from "lucide-react";

import StatsCard from "./StatsCard";

export default function StatsGrid({ stats }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
                title="Total Todos"
                value={stats.total}
                icon={CheckSquare}
                color="text-blue-600"
            />

            <StatsCard
                title="Pending"
                value={stats.todo}
                icon={Clock3}
                color="text-amber-600"
            />

            <StatsCard
                title="Completed"
                value={stats.completed}
                icon={CircleCheckBig}
                color="text-green-600"
            />

            <StatsCard
                title="High Priority"
                value={stats.highPriority}
                icon={TriangleAlert}
                color="text-red-600"
            />
        </div>
    );
}
