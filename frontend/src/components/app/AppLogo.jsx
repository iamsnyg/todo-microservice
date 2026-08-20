"use client";

import Link from "next/link";
import { CheckSquare } from "lucide-react";

export default function AppLogo() {
    return (
        <Link
            href="/dashboard"
            className="flex items-center gap-3"
        >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <CheckSquare className="h-6 w-6" />
            </div>

            <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Planova
                </h1>

                <p className="text-xs text-slate-500">
                    Build. Organize. Deliver.
                </p>
            </div>
        </Link>
    );
}