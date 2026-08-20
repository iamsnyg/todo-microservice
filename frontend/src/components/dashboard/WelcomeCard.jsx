"use client";

import { useAuthStore } from "@/store/auth.store";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function WelcomeCard() {
    const user = useAuthStore((state) => state.user);

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";

    return (
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl">
            <CardContent className="flex items-center justify-between p-8">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />

                        <span className="text-sm font-medium uppercase tracking-wider text-blue-100">
                            Welcome Back
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold">
                        {greeting},{" "}
                        <span className="text-yellow-300">
                            {user?.name || "User"}
                        </span>
                        👋
                    </h1>

                    <p className="mt-3 max-w-lg text-blue-100">
                        Stay organized, finish your tasks, and make today
                        productive.
                    </p>
                </div>

                <div className="hidden text-right md:block">
                    <p className="text-sm text-blue-100">
                        {new Date().toLocaleDateString(undefined, {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
