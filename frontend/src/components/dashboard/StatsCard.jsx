"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function StatsCard({
    title,
    value,
    icon: Icon,
    color = "text-blue-600",
}) {
    return (
        <Card className="border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="flex items-center justify-between p-6">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">{value}</h2>
                </div>

                <div className={`rounded-xl bg-slate-100 p-3 ${color}`}>
                    <Icon className="h-7 w-7" />
                </div>
            </CardContent>
        </Card>
    );
}
