"use client";

export default function DashboardHeader() {
    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";

    return (
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {greeting} 👋
                </h1>

                <p className="mt-2 text-slate-500">
                    Welcome back! Here&apos;s what&apos;s happening today.
                </p>
            </div>

            <div className="text-right">
                <p className="text-sm text-slate-500">
                    {new Date().toLocaleDateString(undefined, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                    })}
                </p>
            </div>
        </div>
    );
}
